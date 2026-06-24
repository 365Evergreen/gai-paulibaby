import React, { useState, useEffect, useRef } from "react";
import { CollabSession, CollabUser, CollabMessage, EditorElement } from "../types";
import { Users, Send, Key, Sparkles, Copy, Check, LogOut, MessageSquareCode, ToggleLeft, ToggleRight } from "lucide-react";

interface CollabPanelProps {
  elements: EditorElement[];
  selectedId: string | null;
  onSyncElements: (synced: EditorElement[]) => void;
  onSyncCursors: (cursors: CollabUser[]) => void;
}

export default function CollabPanel({
  elements,
  selectedId,
  onSyncElements,
  onSyncCursors,
}: CollabPanelProps) {
  const [roomId, setRoomId] = useState<string>("");
  const [joinCode, setJoinCode] = useState<string>("");
  const [userName, setUserName] = useState<string>("Designer_" + Math.floor(Math.random() * 100));
  const [userId] = useState<string>(() => "usr-" + Math.random().toString(36).substring(2, 9));

  const [activeSession, setActiveSession] = useState<CollabSession | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Chat message input
  const [chatInput, setChatInput] = useState("");
  const [copiedCode, setCopiedCode] = useState(false);

  // Simulated collaborators flag
  const [simulationActive, setSimulationActive] = useState(true);

  // References to keep polling loop alive
  const pollingRef = useRef<NodeJS.Timeout | null>(null);
  const elementsRef = useRef(elements);
  elementsRef.current = elements;

  const activeSessionRef = useRef(activeSession);
  activeSessionRef.current = activeSession;

  // Handle Clipboard Copy of Code
  const copyRoomCode = async () => {
    if (!activeSession) return;
    try {
      await navigator.clipboard.writeText(activeSession.roomId);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  // Start space
  const handleCreateSpace = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/collab/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ elements: elementsRef.current }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to create collab room");

      // Set session active
      setActiveSession({
        roomId: data.roomId,
        users: [],
        messages: data.room.messages,
      });

      // Automatically join newly created room
      await handleJoinSpace(data.roomId);
    } catch (err: any) {
      setError(err.message || "Failed to establish a room");
    } finally {
      setLoading(false);
    }
  };

  // Join space
  const handleJoinSpace = async (targetRoomId?: string) => {
    const codeToJoin = (targetRoomId || joinCode).toUpperCase().trim();
    if (!codeToJoin) {
      setError("Please input a valid 8-character Room Code.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/collab/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomId: codeToJoin,
          userId,
          userName,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Room doesn't exist");

      setActiveSession({
        roomId: codeToJoin,
        users: Object.values(data.room.users),
        messages: data.room.messages,
      });

      // Synchronize initial element trees
      if (data.room.elements && data.room.elements.length > 0) {
        onSyncElements(data.room.elements);
      }
    } catch (err: any) {
      setError(err.message || "Could not connect to the room.");
    } finally {
      setLoading(false);
    }
  };

  // Leave active session
  const handleLeaveSession = () => {
    if (pollingRef.current) clearInterval(pollingRef.current);
    setActiveSession(null);
    onSyncCursors([]);
    setError(null);
  };

  // Chat messaging
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !activeSession) return;

    try {
      const response = await fetch("/api/collab/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomId: activeSession.roomId,
          userId,
          userName,
          text: chatInput.trim(),
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setChatInput("");
        // Immediately trigger a status poll to update logs
        pollCollabRoom();
      }
    } catch (err) {
      console.error("Message send failed:", err);
    }
  };

  // Long poll callback
  const pollCollabRoom = async () => {
    const session = activeSessionRef.current;
    if (!session) return;

    try {
      // 1. Send active editor cursor and update canvas
      await fetch("/api/collab/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomId: session.roomId,
          userId,
          cursor: { x: 0, y: 0, elementId: selectedId || undefined },
          elements: elementsRef.current, // Push updates to elements
        }),
      });

      // 2. Poll for latest room state
      const response = await fetch("/api/collab/poll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomId: session.roomId,
          userId,
        }),
      });

      if (!response.ok) return;
      const data = await response.json();

      if (data.success) {
        // Filter out self cursor
        const foreignUsers = (data.users || []).filter((u: any) => u.id !== userId);

        // Inject simulated collaborators if simulation is toggled on
        if (simulationActive) {
          const simBob: CollabUser = {
            id: "sim-bob",
            name: "Bob (UX Lead)",
            color: "text-amber-500",
            cursor: { x: 0, y: 0, elementId: elementsRef.current.length > 0 ? elementsRef.current[0].id : undefined },
            isSimulated: true,
          };
          const simAlice: CollabUser = {
            id: "sim-alice",
            name: "Alice (Reviewer)",
            color: "text-pink-500",
            cursor: { x: 0, y: 0, elementId: elementsRef.current.length > 0 ? elementsRef.current[elementsRef.current.length - 1].id : undefined },
            isSimulated: true,
          };
          foreignUsers.push(simBob, simAlice);
        }

        onSyncCursors(foreignUsers);

        // Sync messages
        setActiveSession((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            users: data.users || [],
            messages: data.messages || [],
          };
        });

        // Sync visual elements if modified by other collaborators (e.g., in other tab)
        // For simple sync, if there are updates, pull elements
        if (data.elements && JSON.stringify(data.elements) !== JSON.stringify(elementsRef.current)) {
          // Prevent self-overwrite loop: only ingest if it has actually changed and server holds more updated items
          onSyncElements(data.elements);
        }
      }
    } catch (e) {
      console.warn("Poll connection interrupted:", e);
    }
  };

  // Polling intervals setup
  useEffect(() => {
    if (activeSession) {
      // Trigger instant initial poll
      pollCollabRoom();
      // Establish loops (every 2.5s)
      pollingRef.current = setInterval(pollCollabRoom, 2500);
    }

    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, [activeSession === null, selectedId, simulationActive]);

  return (
    <div id="collab-sync-pane" className="flex-1 overflow-y-auto bg-slate-50 p-6 min-h-[calc(100vh-140px)]">
      <div className="max-w-4xl mx-auto flex flex-col h-full gap-6">
        {/* CONNECTION CARD */}
        {!activeSession ? (
          <div className="grid md:grid-cols-2 gap-6">
            {/* Create Room */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
              <div className="space-y-3">
                <div className="h-10 w-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
                  <Users className="w-5.5 h-5.5" />
                </div>
                <h3 className="text-base font-bold text-slate-800">Establish Collaborative Space</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Generate a live secure design session code. Any changes you make will instantly sync across other developers' canvases in real-time.
                </p>
              </div>

              <div className="space-y-4 mt-6">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 block mb-1 uppercase font-mono">My Display Name</label>
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 border border-slate-200 bg-slate-50 text-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold"
                  />
                </div>
                <button
                  onClick={handleCreateSpace}
                  disabled={loading}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-bold text-xs rounded-xl transition shadow cursor-pointer"
                >
                  {loading ? "Initializing Secure Room..." : "Create Collaboration Room"}
                </button>
              </div>
            </div>

            {/* Join Room */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
              <div className="space-y-3">
                <div className="h-10 w-10 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600">
                  <Key className="w-5.5 h-5.5" />
                </div>
                <h3 className="text-base font-bold text-slate-800">Join Existing Session</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Enter an active collaboration session room code to synchronize elements, visual layout trees, and coordinate active adjustments live.
                </p>
              </div>

              <div className="space-y-4 mt-6">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block mb-1 uppercase font-mono">Display Name</label>
                    <input
                      type="text"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      className="w-full text-xs px-3 py-2.5 border border-slate-200 bg-slate-50 text-slate-800 rounded-lg focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block mb-1 uppercase font-mono">Room Code</label>
                    <input
                      type="text"
                      value={joinCode}
                      onChange={(e) => setJoinCode(e.target.value)}
                      className="w-full text-xs px-3 py-2.5 border border-slate-200 bg-white text-slate-800 rounded-lg focus:outline-none font-mono uppercase"
                      placeholder="e.g. ROOM-4821"
                    />
                  </div>
                </div>

                {error && <p className="text-[11px] text-red-500 font-semibold">{error}</p>}

                <button
                  onClick={() => handleJoinSpace()}
                  disabled={loading}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white font-bold text-xs rounded-xl transition shadow cursor-pointer"
                >
                  {loading ? "Connecting..." : "Join Active Space"}
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* ACTIVE COLLABORATION ROOM HUD */
          <div className="grid md:grid-cols-3 gap-6 h-[480px]">
            {/* SESSION CONTROL PANEL */}
            <div className="md:col-span-1 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col justify-between h-full">
              <div className="space-y-5">
                {/* Active Session Info */}
                <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                  <div>
                    <span className="text-[10px] font-bold text-emerald-500 block animate-pulse uppercase font-mono">
                      ● Active Connection
                    </span>
                    <span className="text-sm font-black text-slate-800">{activeSession.roomId}</span>
                  </div>
                  <button
                    onClick={copyRoomCode}
                    className="p-1.5 bg-slate-50 border border-slate-150 rounded-lg text-slate-500 hover:text-slate-800 transition active:scale-90"
                    title="Copy Room ID"
                  >
                    {copiedCode ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>

                {/* Team Roster */}
                <div>
                  <span className="text-[10px] font-bold text-slate-400 block tracking-wider uppercase font-mono mb-2">
                    Team Members ({simulationActive ? activeSession.users.length + 2 : activeSession.users.length})
                  </span>
                  <div className="space-y-2">
                    {/* Self */}
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-800">
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
                      <span>{userName} (You)</span>
                    </div>

                    {/* Active external users */}
                    {activeSession.users
                      .filter((u) => u.id !== userId)
                      .map((user) => (
                        <div key={user.id} className="flex items-center gap-2 text-xs text-slate-600">
                          <span className={`w-2.5 h-2.5 rounded-full ${user.color.replace("text-", "bg-")}`}></span>
                          <span>{user.name}</span>
                        </div>
                      ))}

                    {/* Simulated users */}
                    {simulationActive && (
                      <>
                        <div className="flex items-center gap-2 text-xs text-slate-600">
                          <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></span>
                          <span className="font-semibold text-slate-700">Bob (UX Lead)</span>
                          <span className="text-[9px] bg-amber-50 text-amber-700 px-1 rounded-full font-mono font-bold">SIM</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-600">
                          <span className="w-2.5 h-2.5 rounded-full bg-pink-500 animate-pulse"></span>
                          <span className="font-semibold text-slate-700">Alice (Reviewer)</span>
                          <span className="text-[9px] bg-pink-50 text-pink-700 px-1 rounded-full font-mono font-bold">SIM</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Toggle Simulation */}
                <div className="border-t border-slate-100 pt-4 flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">Simulate Peer Edits</span>
                  <button
                    onClick={() => setSimulationActive(!simulationActive)}
                    className="text-slate-500 hover:text-slate-800 transition"
                  >
                    {simulationActive ? (
                      <ToggleRight className="w-7 h-7 text-blue-600" />
                    ) : (
                      <ToggleLeft className="w-7 h-7 text-slate-400" />
                    )}
                  </button>
                </div>
              </div>

              <button
                onClick={handleLeaveSession}
                className="w-full flex items-center justify-center gap-1.5 py-2.5 bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 font-bold text-xs rounded-xl transition mt-4"
              >
                <LogOut className="w-4 h-4" />
                Leave Connection Space
              </button>
            </div>

            {/* CHAT LOG ENGINE */}
            <div className="md:col-span-2 bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-col h-full overflow-hidden">
              <div className="bg-slate-50 border-b border-slate-150 px-5 py-3 flex items-center gap-2 text-xs font-semibold text-slate-700">
                <MessageSquareCode className="w-4.5 h-4.5 text-blue-500" />
                <span>Secure Space Chat Logs</span>
              </div>

              {/* Message Lists container */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-950/5 flex flex-col justify-end max-h-[350px]">
                {activeSession.messages.map((msg, index) => {
                  const isSelf = msg.userId === userId;
                  const isSys = msg.userId === "system";

                  if (isSys) {
                    return (
                      <div key={msg.id || index} className="text-center">
                        <span className="inline-block bg-slate-200 text-slate-600 text-[10px] font-bold px-3 py-1 rounded-full font-mono">
                          {msg.text}
                        </span>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={msg.id || index}
                      className={`flex flex-col max-w-[80%] ${isSelf ? "self-end items-end" : "self-start items-start"}`}
                    >
                      <div className="flex items-center gap-1 text-[10px] text-slate-400 font-bold mb-0.5 px-1 select-none">
                        <span>{msg.userName}</span>
                        <span>•</span>
                        <span>{msg.timestamp}</span>
                      </div>
                      <div
                        className={`text-xs px-3.5 py-2 rounded-2xl ${
                          isSelf
                            ? "bg-blue-600 text-white rounded-tr-none"
                            : "bg-white text-slate-800 border border-slate-200 rounded-tl-none shadow-sm"
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Chat Input Field Form */}
              <form onSubmit={handleSendMessage} className="border-t border-slate-200 p-3 flex gap-2 bg-white">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ask Bob or Alice for design feedback... (e.g. 'How is my design?')"
                  className="flex-1 text-xs px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-800"
                />
                <button
                  type="submit"
                  className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
