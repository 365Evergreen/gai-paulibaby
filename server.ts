import express from "express";
import path from "path";
import fs from "fs";
import { exec } from "child_process";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Setup Gemini API client safely
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

app.use(express.json({ limit: "5mb" }));

// IN-MEMORY COLLABORATION STORAGE
interface CollabUser {
  id: string;
  name: string;
  color: string;
  cursor?: { x: number; y: number; elementId?: string };
  lastActive: number;
}

interface CollabMessage {
  id: string;
  userId: string;
  userName: string;
  text: string;
  timestamp: string;
}

interface Room {
  roomId: string;
  users: Record<string, CollabUser>;
  messages: CollabMessage[];
  elements: any[]; // the canvas element tree
  version: number;
}

const rooms: Record<string, Room> = {};

// Clean inactive collaboration users periodically (older than 30s)
setInterval(() => {
  const now = Date.now();
  for (const roomId in rooms) {
    const room = rooms[roomId];
    let changed = false;
    for (const userId in room.users) {
      if (now - room.users[userId].lastActive > 30000) {
        delete room.users[userId];
        changed = true;
      }
    }
    if (changed) {
      room.version++;
    }
    // Clean up empty rooms older than 1 hour
    if (Object.keys(room.users).length === 0 && room.messages.length === 0) {
      delete rooms[roomId];
    }
  }
}, 10000);

// API ROUTES

// 1. Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// 2. AI Design Suggestions Endpoint
app.post("/api/gemini/suggest", async (req, res) => {
  try {
    const { elements } = req.body;
    if (!elements || !Array.isArray(elements)) {
      res.status(400).json({ error: "Missing layout elements" });
      return;
    }

    const layoutSummary = JSON.stringify(elements, null, 2);

    const prompt = `Analyze the following WYSIWYG editor visual layout structure (represented in JSON format) and provide 3-4 professional, actionable UI/UX and aesthetic design suggestions. 
Keep suggestions specific to modifying elements, text alignments, layout groupings, margins, padding, or color choices.

Layout JSON:
${layoutSummary}
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are an expert web UI/UX designer and design system architect. Provide constructive visual feedback to improve layout, sizing, padding, and aesthetic groupings.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          description: "List of visual design suggestions",
          items: {
            type: Type.OBJECT,
            properties: {
              category: {
                type: Type.STRING,
                description: "The category of the design suggestion: layout, color, typography, or structure",
              },
              title: {
                type: Type.STRING,
                description: "A short, actionable title for the design suggestion.",
              },
              description: {
                type: Type.STRING,
                description: "A descriptive explanation of the change.",
              },
              impact: {
                type: Type.STRING,
                description: "The visual impact score: High, Medium, or Low",
              },
              reason: {
                type: Type.STRING,
                description: "The architectural or cognitive UI reasoning for the recommendation.",
              },
              suggestedStyles: {
                type: Type.OBJECT,
                description: "Optional Tailwind styles to map onto elements.",
                properties: {
                  bgColor: { type: Type.STRING },
                  textColor: { type: Type.STRING },
                  padding: { type: Type.STRING },
                  borderRadius: { type: Type.STRING },
                  border: { type: Type.STRING },
                  shadow: { type: Type.STRING },
                }
              },
              targetElementId: {
                type: Type.STRING,
                description: "The ID of the specific layout element suggested for modification (if applicable).",
              }
            },
            required: ["category", "title", "description", "impact", "reason"]
          }
        }
      }
    });

    const suggestions = JSON.parse(response.text || "[]");
    res.json({ success: true, suggestions });
  } catch (error: any) {
    console.error("AI Suggestions Error:", error);
    res.status(500).json({ error: error.message || "Failed to generate AI suggestions" });
  }
});

// 3. AI Accessibility (WCAG Compliance) Audit Endpoint
app.post("/api/gemini/audit", async (req, res) => {
  try {
    const { elements } = req.body;
    if (!elements || !Array.isArray(elements)) {
      res.status(400).json({ error: "Missing layout elements" });
      return;
    }

    const layoutSummary = JSON.stringify(elements, null, 2);

    const prompt = `Analyze the following visual design layout elements tree and check for WCAG accessibility (Web Content Accessibility Guidelines) issues (such as color contrast ratios, alt tags, semantic structure, screen reader readiness, keyboard focus spacing, etc.).

Layout JSON:
${layoutSummary}
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are a professional web accessibility specialist auditing sites for WCAG 2.1 AA or AAA standards. Identify concrete accessibility gaps in the layout JSON.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          description: "List of accessibility findings",
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING, description: "Unique issue identifier" },
              title: { type: Type.STRING, description: "Short summary of the issue" },
              description: { type: Type.STRING, description: "Detailed description of the accessibility gap" },
              severity: { type: Type.STRING, description: "Issue severity: Critical, Moderate, or Minor" },
              wcagRule: { type: Type.STRING, description: "WCAG rule referenced (e.g., WCAG 1.1.1, WCAG 1.4.3)" },
              recommendation: { type: Type.STRING, description: "Clear, step-by-step recommendation to fix" },
              elementId: { type: Type.STRING, description: "The ID of the element exhibiting the issue (if applicable)" }
            },
            required: ["id", "title", "description", "severity", "wcagRule", "recommendation"]
          }
        }
      }
    });

    const auditIssues = JSON.parse(response.text || "[]");
    res.json({ success: true, issues: auditIssues });
  } catch (error: any) {
    console.error("Accessibility Audit Error:", error);
    res.status(500).json({ error: error.message || "Failed to perform accessibility audit" });
  }
});

// 4. Combined Python Static Review + Gemini Code Review Endpoint
app.post("/api/review-code", async (req, res) => {
  try {
    const { code, filename = "generated_code.tsx" } = req.body;
    if (!code) {
      res.status(400).json({ error: "Missing source code to review" });
      return;
    }

    // Write code to a temporary file
    const tempDir = path.join(process.cwd(), "dist", "temp");
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    const tempFilePath = path.join(tempDir, `${Date.now()}_${filename}`);
    fs.writeFileSync(tempFilePath, code, "utf-8");

    // Execute Python script to do static analysis
    let pythonIssues: any[] = [];
    try {
      await new Promise<void>((resolve, reject) => {
        exec(`python3 code_reviewer.py "${tempFilePath}"`, (error, stdout, stderr) => {
          if (error) {
            console.warn("Python static reviewer error:", error, stderr);
            // Non-blocking, fallback to empty python results and use Gemini
            resolve();
            return;
          }
          try {
            const data = JSON.parse(stdout);
            if (data && Array.isArray(data.issues)) {
              pythonIssues = data.issues;
            }
            resolve();
          } catch (e) {
            console.error("Failed to parse Python reviewer JSON response:", e);
            resolve();
          }
        });
      });
    } catch (pyErr) {
      console.warn("Python Execution wrapper failed", pyErr);
    }

    // Clean up temporary file
    try {
      if (fs.existsSync(tempFilePath)) {
        fs.unlinkSync(tempFilePath);
      }
    } catch (err) {
      console.error("Failed to delete temp file:", err);
    }

    // Run AI review via Gemini to augment findings with deeper context
    let aiIssues: any[] = [];
    try {
      const prompt = `Review the following generated React / Tailwind CSS code. Analyze for potential errors, performance vulnerabilities, modern React guidelines, security issues (XSS, bad targets), and best practices. Return issues as a JSON array matching the schema.

Code:
\`\`\`tsx
${code}
\`\`\`
`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction: "You are an automated code review bot that finds errors, clean-code issues, performance bottlenecks, and accessibility problems in React + Tailwind code.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            description: "List of code review findings",
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                category: { type: Type.STRING, description: "Category of code issue: syntax, security, performance, best-practice, or accessibility" },
                severity: { type: Type.STRING, description: "Severity of issue: error, warning, or info" },
                title: { type: Type.STRING, description: "Short visual title" },
                description: { type: Type.STRING, description: "What is wrong with the code snippet" },
                line: { type: Type.INTEGER, description: "1-indexed approximate line number" },
                snippet: { type: Type.STRING, description: "The specific snippet exhibiting the issue" },
                recommendation: { type: Type.STRING, description: "Specific steps to resolve the issue" }
              },
              required: ["id", "category", "severity", "title", "description", "recommendation"]
            }
          }
        }
      });

      aiIssues = JSON.parse(response.text || "[]");
    } catch (geminiReviewErr: any) {
      console.error("Gemini Code Review augment error:", geminiReviewErr);
    }

    // Merge Python findings and Gemini findings uniquely
    const mergedIssuesMap: Record<string, any> = {};

    pythonIssues.forEach((issue) => {
      mergedIssuesMap[`py-${issue.id}`] = { ...issue, id: `py-${issue.id}` };
    });

    aiIssues.forEach((issue, idx) => {
      mergedIssuesMap[`ai-${issue.id || idx}`] = { ...issue, id: `ai-${issue.id || idx}` };
    });

    const mergedIssues = Object.values(mergedIssuesMap);

    res.json({
      success: true,
      issuesCount: mergedIssues.length,
      issues: mergedIssues,
    });
  } catch (error: any) {
    console.error("Full Code Review Error:", error);
    res.status(500).json({ error: error.message || "Failed to analyze code review" });
  }
});

// 5. COLLABORATION ROOM ENDPOINTS
app.post("/api/collab/create", (req, res) => {
  const { elements = [] } = req.body;
  const roomId = `ROOM-${Math.floor(1000 + Math.random() * 9000)}`;
  rooms[roomId] = {
    roomId,
    users: {},
    messages: [
      {
        id: `msg-welcome`,
        userId: "system",
        userName: "System",
        text: `Room ${roomId} created! Share this room code to collaborate with your peers in real-time.`,
        timestamp: new Date().toLocaleTimeString(),
      },
    ],
    elements,
    version: 1,
  };
  res.json({ success: true, roomId, room: rooms[roomId] });
});

app.post("/api/collab/join", (req, res) => {
  const { roomId, userId, userName } = req.body;
  if (!roomId || !userId || !userName) {
    res.status(400).json({ error: "Missing required parameters" });
    return;
  }

  const cleanRoomId = roomId.toUpperCase().trim();
  const room = rooms[cleanRoomId];
  if (!room) {
    res.status(404).json({ error: "Room not found. Please verify the code or create a new room." });
    return;
  }

  const colors = [
    "text-pink-500",
    "text-violet-500",
    "text-amber-500",
    "text-emerald-500",
    "text-teal-500",
    "text-rose-500",
    "text-indigo-500",
  ];
  const color = colors[Math.floor(Math.random() * colors.length)];

  room.users[userId] = {
    id: userId,
    name: userName,
    color,
    lastActive: Date.now(),
  };

  room.messages.push({
    id: `msg-${Date.now()}`,
    userId: "system",
    userName: "System",
    text: `${userName} joined the session!`,
    timestamp: new Date().toLocaleTimeString(),
  });

  room.version++;

  res.json({ success: true, roomId: cleanRoomId, room });
});

app.post("/api/collab/update", (req, res) => {
  const { roomId, userId, cursor, elements } = req.body;
  if (!roomId || !userId) {
    res.status(400).json({ error: "Missing roomId or userId" });
    return;
  }

  const room = rooms[roomId];
  if (!room) {
    res.status(404).json({ error: "Room not found" });
    return;
  }

  if (room.users[userId]) {
    room.users[userId].lastActive = Date.now();
    if (cursor) {
      room.users[userId].cursor = cursor;
    }
  }

  if (elements && Array.isArray(elements)) {
    room.elements = elements;
    room.version++;
  }

  res.json({ success: true, version: room.version });
});

app.post("/api/collab/message", (req, res) => {
  const { roomId, userId, userName, text } = req.body;
  if (!roomId || !userId || !text) {
    res.status(400).json({ error: "Missing parameters" });
    return;
  }

  const room = rooms[roomId];
  if (!room) {
    res.status(404).json({ error: "Room not found" });
    return;
  }

  const message: CollabMessage = {
    id: `msg-${Date.now()}`,
    userId,
    userName,
    text,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  };

  room.messages.push(message);
  room.version++;

  // Simple automated responder for simulated collaboration if room code is special or has simulation enabled
  if (text.toLowerCase().includes("design") || text.toLowerCase().includes("audit") || text.toLowerCase().includes("hello")) {
    setTimeout(() => {
      if (rooms[roomId]) {
        const simMessage: CollabMessage = {
          id: `msg-sim-${Date.now()}`,
          userId: "sim-bob",
          userName: "Bob (UX Lead)",
          text: `Hey! I recommend checking our layout contrast in the AI accessibility panel. Looks clean, though!`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        rooms[roomId].messages.push(simMessage);
        rooms[roomId].version++;
      }
    }, 1500);
  }

  res.json({ success: true, message });
});

app.post("/api/collab/poll", (req, res) => {
  const { roomId, userId, currentVersion } = req.body;
  if (!roomId || !userId) {
    res.status(400).json({ error: "Missing roomId or userId" });
    return;
  }

  const room = rooms[roomId];
  if (!room) {
    res.status(404).json({ error: "Room not found" });
    return;
  }

  // Update last active timestamp
  if (room.users[userId]) {
    room.users[userId].lastActive = Date.now();
  }

  // If there's an active version mismatch or change, return full data
  // Standard short poll return
  res.json({
    success: true,
    version: room.version,
    users: Object.values(room.users),
    messages: room.messages,
    elements: room.elements,
  });
});

// START THE CUSTOM VITE SERVER WRAPPER
async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
