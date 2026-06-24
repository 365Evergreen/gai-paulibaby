import React, { useState, useEffect } from "react";
import { EditorElement, Revision, Template, CollabUser } from "./types";
import { emptyCanvasTemplate, landingPageTemplate, templatesList } from "./templatesData";
import { generateHtmlCode, generateReactCode } from "./utils/codeGenerator";

// Import custom visual components
import Canvas from "./components/Canvas";
import Sidebar from "./components/Sidebar";
import CodePreview from "./components/CodePreview";
import AISuggestions from "./components/AISuggestions";
import CodeReviewPanel from "./components/CodeReviewPanel";
import CollabPanel from "./components/CollabPanel";
import VersionControl from "./components/VersionControl";
import DeployPanel from "./components/DeployPanel";

import {
  Layout,
  Code2,
  Sparkles,
  Bug,
  Users,
  History,
  Cloud,
  Layers,
  HelpCircle,
  Smartphone,
  Monitor,
  Laptop
} from "lucide-react";

// Helper to generate IDs
const gid = () => `el-${Math.random().toString(36).substr(2, 9)}`;

export default function App() {
  // Current active workspace tab
  const [activeTab, setActiveTab] = useState<"editor" | "code" | "ai" | "review" | "collab" | "version" | "deploy">("editor");

  // Element visual hierarchy tree state
  const [elements, setElements] = useState<EditorElement[]>(landingPageTemplate);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Device layout size selector
  const [viewportSize, setViewportSize] = useState<"desktop" | "tablet" | "mobile">("desktop");

  // Revisions version history stack
  const [revisions, setRevisions] = useState<Revision[]>([
    {
      id: "rev-1",
      name: "v1.0.0 Initial landing page template",
      timestamp: "08:45:33 AM",
      author: "System (Auto)",
      elements: [...landingPageTemplate],
    },
  ]);

  // Collaborative cursors
  const [collabCursors, setCollabCursors] = useState<CollabUser[]>([]);

  // Find an element inside a recursive tree structure
  const findElementInTree = (nodes: EditorElement[], id: string): EditorElement | null => {
    for (const node of nodes) {
      if (node.id === id) return node;
      if (node.children && node.children.length > 0) {
        const found = findElementInTree(node.children, id);
        if (found) return found;
      }
    }
    return null;
  };

  const selectedElement = selectedId ? findElementInTree(elements, selectedId) : null;

  // Real-time generated code
  const htmlCode = generateHtmlCode(elements);
  const reactCode = generateReactCode(elements);

  // RECURSIVE UPDATER FOR ELEMENTS PROPERTIES
  const updateElementInTree = (
    nodes: EditorElement[],
    id: string,
    updated: Partial<EditorElement>
  ): EditorElement[] => {
    return nodes.map((node) => {
      if (node.id === id) {
        return { ...node, ...updated };
      }
      if (node.children && node.children.length > 0) {
        return { ...node, children: updateElementInTree(node.children, id, updated) };
      }
      return node;
    });
  };

  const handleUpdateElement = (id: string, updated: Partial<EditorElement>) => {
    setElements((prev) => updateElementInTree(prev, id, updated));
  };

  // RECURSIVE INJECTOR FOR NEW PALETTE COMPONENTS
  const addElementToTree = (
    nodes: EditorElement[],
    targetId: string,
    newElement: EditorElement
  ): { updatedNodes: EditorElement[]; success: boolean } => {
    let success = false;
    const updated = nodes.map((node) => {
      if (node.id === targetId) {
        // Only allow nesting in layout containers
        if (["section", "grid", "flex", "card", "hero", "footer"].includes(node.type)) {
          success = true;
          return {
            ...node,
            children: [...(node.children || []), newElement],
          };
        }
      }
      if (node.children && node.children.length > 0) {
        const res = addElementToTree(node.children, targetId, newElement);
        if (res.success) {
          success = true;
          return { ...node, children: res.updatedNodes };
        }
      }
      return node;
    });
    return { updatedNodes: updated, success };
  };

  const handleAddElement = (type: string) => {
    // Generate fresh element with nice default properties
    const newId = gid();
    const newEl: EditorElement = {
      id: newId,
      type,
      label: type.charAt(0).toUpperCase() + type.slice(1),
      styles: {},
      children: [],
    };

    // Configure specific template items
    switch (type) {
      case "heading":
        newEl.content = "Tactile Heading Element";
        newEl.styles = { fontSize: "text-3xl", fontWeight: "font-black", textColor: "text-swiss-ink", margin: "mb-3", customClasses: "font-syne tracking-tighter" };
        break;
      case "subheading":
        newEl.content = "Structural layout specifier subtext";
        newEl.styles = { fontSize: "text-lg", fontWeight: "font-black", textColor: "text-swiss-ink", margin: "mb-2", customClasses: "font-syne tracking-tight" };
        break;
      case "paragraph":
        newEl.content = "Deploy clean, compliant Tailwind layouts in seconds without writing a single line of boilerplate code.";
        newEl.styles = { fontSize: "text-sm", textColor: "text-slate-600", margin: "mb-4" };
        break;
      case "button":
        newEl.content = "ACTION_BUTTON";
        newEl.styles = { bgColor: "bg-swiss-accent", textColor: "text-white", padding: "px-4 py-2", borderRadius: "rounded-none", border: "border-2 border-swiss-ink", fontWeight: "font-black", shadow: "shadow-[2px_2px_0px_#18181A]", customClasses: "font-mono text-xs tracking-wider" };
        break;
      case "badge":
        newEl.content = "LIVE_SYSTEM // 01";
        newEl.styles = { bgColor: "bg-swiss-ink", textColor: "text-white", fontSize: "text-[10px]", fontWeight: "font-black", borderRadius: "rounded-none", padding: "px-2.5 py-1", border: "border-2 border-swiss-ink", customClasses: "font-mono tracking-widest" };
        break;
      case "image":
        newEl.styles = { width: "w-full", borderRadius: "rounded-none", border: "border-2 border-swiss-ink", customClasses: "shadow-[2px_2px_0px_#18181A]" };
        newEl.props = {
          src: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=600&q=80",
          alt: "Visual placeholder assets",
        };
        break;
      case "input":
        newEl.styles = { width: "w-full", padding: "p-2.5", border: "border-2 border-swiss-ink", borderRadius: "rounded-none", customClasses: "bg-white font-mono text-xs" };
        newEl.props = { placeholder: "type_content_here..." };
        break;
      case "grid":
        newEl.styles = { gridCols: "grid-cols-2", gap: "gap-4", padding: "p-4" };
        newEl.label = "2-Col Grid";
        break;
      case "flex":
        newEl.styles = { flexDir: "flex-row", gap: "gap-4", padding: "p-4" };
        newEl.label = "Flex Box";
        break;
      case "section":
        newEl.styles = { bgColor: "bg-swiss-bg", padding: "p-8", width: "w-full" };
        newEl.label = "Content Section";
        break;
      case "card":
        newEl.styles = { bgColor: "bg-white", padding: "p-6", borderRadius: "rounded-none", border: "border-2 border-swiss-ink", shadow: "shadow-[4px_4px_0px_#18181A]" };
        newEl.label = "Aesthetic Card";
        break;
    }

    if (selectedId) {
      const res = addElementToTree(elements, selectedId, newEl);
      if (res.success) {
        setElements(res.updatedNodes);
        setSelectedId(newId);
        return;
      }
    }

    // Default to root list insert
    setElements((prev) => [...prev, newEl]);
    setSelectedId(newId);
  };

  // RECURSIVE DELETER
  const deleteElementInTree = (nodes: EditorElement[], id: string): EditorElement[] => {
    return nodes
      .filter((node) => node.id !== id)
      .map((node) => {
        if (node.children && node.children.length > 0) {
          return { ...node, children: deleteElementInTree(node.children, id) };
        }
        return node;
      });
  };

  const handleDeleteElement = (id: string) => {
    setElements((prev) => deleteElementInTree(prev, id));
    if (selectedId === id) setSelectedId(null);
  };

  // RECURSIVE REORDER/MOVE IN TREE
  const moveElementInTree = (
    nodes: EditorElement[],
    id: string,
    direction: "up" | "down"
  ): { updatedNodes: EditorElement[]; found: boolean } => {
    // Check root list
    const index = nodes.findIndex((n) => n.id === id);
    if (index !== -1) {
      const targetIndex = direction === "up" ? index - 1 : index + 1;
      if (targetIndex >= 0 && targetIndex < nodes.length) {
        const copy = [...nodes];
        const [moved] = copy.splice(index, 1);
        copy.splice(targetIndex, 0, moved);
        return { updatedNodes: copy, found: true };
      }
      return { updatedNodes: nodes, found: true }; // found but can't move
    }

    // Check nested lists
    let found = false;
    const updated = nodes.map((node) => {
      if (node.children && node.children.length > 0) {
        const res = moveElementInTree(node.children, id, direction);
        if (res.found) {
          found = true;
          return { ...node, children: res.updatedNodes };
        }
      }
      return node;
    });

    return { updatedNodes: updated, found };
  };

  const handleMoveElement = (id: string, direction: "up" | "down") => {
    setElements((prev) => moveElementInTree(prev, id, direction).updatedNodes);
  };

  // RECURSIVE DUPLICATOR WITH FRESH IDS
  const cloneElementWithNewIds = (el: EditorElement): EditorElement => {
    const freshId = gid();
    return {
      ...el,
      id: freshId,
      children: el.children ? el.children.map((child) => cloneElementWithNewIds(child)) : [],
    };
  };

  const duplicateElementInTree = (nodes: EditorElement[], id: string): { updatedNodes: EditorElement[]; found: boolean } => {
    const index = nodes.findIndex((n) => n.id === id);
    if (index !== -1) {
      const cloned = cloneElementWithNewIds(nodes[index]);
      const copy = [...nodes];
      copy.splice(index + 1, 0, cloned);
      return { updatedNodes: copy, found: true };
    }

    let found = false;
    const updated = nodes.map((node) => {
      if (node.children && node.children.length > 0) {
        const res = duplicateElementInTree(node.children, id);
        if (res.found) {
          found = true;
          return { ...node, children: res.updatedNodes };
        }
      }
      return node;
    });

    return { updatedNodes: updated, found };
  };

  const handleDuplicateElement = (id: string) => {
    setElements((prev) => duplicateElementInTree(prev, id).updatedNodes);
  };

  // Switch template
  const handleLoadTemplate = (template: Template) => {
    setElements([...template.elements]);
    setSelectedId(null);
    // Add visual commit history node
    const timeStr = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const freshRev: Revision = {
      id: `rev-${revisions.length + 1}`,
      name: `Loaded Starter Template: "${template.name}"`,
      timestamp: timeStr,
      author: "System",
      elements: [...template.elements],
    };
    setRevisions((prev) => [freshRev, ...prev]);
  };

  // Version Control: Commit Revision State
  const handleAddRevision = (msg: string) => {
    const timeStr = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
    const freshRev: Revision = {
      id: `rev-${revisions.length + 1}`,
      name: msg,
      timestamp: timeStr,
      author: "Designer (Active)",
      elements: [...elements],
    };
    setRevisions((prev) => [freshRev, ...prev]);
  };

  // Version Control: Rollback Restore Callback
  const handleRollback = (restoredElements: EditorElement[]) => {
    setElements([...restoredElements]);
    setSelectedId(null);
  };

  // AI Design: Style modification hook
  const handleApplyAiStyles = (elementId: string, styles: Record<string, string>) => {
    handleUpdateElement(elementId, { styles });
  };

  return (
    <div className="min-h-screen bg-swiss-bg flex flex-col font-sans select-none antialiased">
      {/* GLOBAL APPLICATION HEADER */}
      <header className="bg-white border-b-4 border-swiss-ink text-swiss-ink px-6 py-4 flex flex-col md:flex-row gap-4 justify-between items-center shrink-0">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-swiss-accent border-2 border-swiss-ink flex items-center justify-center font-black text-white text-xl shadow-[2px_2px_0px_#18181A] select-none">
            ⚡
          </div>
          <div>
            <h1 className="text-lg font-black tracking-tight text-swiss-ink flex items-center gap-2 leading-none font-syne uppercase">
              APEX_DESIGN STUDIO
              <span className="text-[9px] bg-swiss-ink text-white font-black border-2 border-swiss-ink px-1.5 py-0.5 uppercase font-mono tracking-widest">
                AI_WYSIWYG
              </span>
            </h1>
            <p className="text-[10px] font-bold text-slate-500 font-mono uppercase mt-1">AI-Powered visual composer & styling sandbox</p>
          </div>
        </div>

        {/* TEMPLATE QUICK SELECTOR BAR */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-swiss-ink font-black uppercase font-mono mr-1 tracking-wider">STARTER LAYOUTS:</span>
          {templatesList.map((tpl) => (
            <button
              key={tpl.id}
              onClick={() => handleLoadTemplate(tpl)}
              className="px-4 py-2 bg-white text-swiss-ink border-2 border-swiss-ink hover:bg-swiss-accent hover:text-white transition font-black font-mono uppercase tracking-wider shadow-[2px_2px_0px_#18181A]"
            >
              {tpl.name}
            </button>
          ))}
        </div>
      </header>

      {/* PRIMARY TAB CONTROLS RAIL */}
      <nav className="bg-swiss-bg border-b-2 border-swiss-ink px-6 py-3 flex flex-wrap gap-3 justify-between items-center shrink-0">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveTab("editor")}
            className={`flex items-center gap-2 px-4 py-2 border-2 border-swiss-ink text-xs font-black uppercase font-mono tracking-wider transition shadow-[2px_2px_0px_#18181A] ${
              activeTab === "editor" ? "bg-swiss-accent text-white" : "bg-white text-swiss-ink hover:bg-slate-50"
            }`}
          >
            <Layers className="w-4 h-4" />
            Visual Stage
          </button>
          <button
            onClick={() => setActiveTab("code")}
            className={`flex items-center gap-2 px-4 py-2 border-2 border-swiss-ink text-xs font-black uppercase font-mono tracking-wider transition shadow-[2px_2px_0px_#18181A] ${
              activeTab === "code" ? "bg-swiss-accent text-white" : "bg-white text-swiss-ink hover:bg-slate-50"
            }`}
          >
            <Code2 className="w-4 h-4" />
            React/HTML Code
          </button>
          <button
            onClick={() => setActiveTab("ai")}
            className={`flex items-center gap-2 px-4 py-2 border-2 border-swiss-ink text-xs font-black uppercase font-mono tracking-wider transition shadow-[2px_2px_0px_#18181A] ${
              activeTab === "ai" ? "bg-swiss-accent text-white" : "bg-white text-swiss-ink hover:bg-slate-50"
            }`}
          >
            <Sparkles className="w-4 h-4 text-yellow-500 fill-yellow-500" />
            AI Designer Hub
          </button>
          <button
            onClick={() => setActiveTab("review")}
            className={`flex items-center gap-2 px-4 py-2 border-2 border-swiss-ink text-xs font-black uppercase font-mono tracking-wider transition shadow-[2px_2px_0px_#18181A] ${
              activeTab === "review" ? "bg-swiss-accent text-white" : "bg-white text-swiss-ink hover:bg-slate-50"
            }`}
          >
            <Bug className="w-4 h-4" />
            Design Audit
          </button>
          <button
            onClick={() => setActiveTab("collab")}
            className={`flex items-center gap-2 px-4 py-2 border-2 border-swiss-ink text-xs font-black uppercase font-mono tracking-wider transition shadow-[2px_2px_0px_#18181A] ${
              activeTab === "collab" ? "bg-swiss-accent text-white" : "bg-white text-swiss-ink hover:bg-slate-50"
            }`}
          >
            <Users className="w-4 h-4" />
            Team Sync
          </button>
          <button
            onClick={() => setActiveTab("version")}
            className={`flex items-center gap-2 px-4 py-2 border-2 border-swiss-ink text-xs font-black uppercase font-mono tracking-wider transition shadow-[2px_2px_0px_#18181A] ${
              activeTab === "version" ? "bg-swiss-accent text-white" : "bg-white text-swiss-ink hover:bg-slate-50"
            }`}
          >
            <History className="w-4 h-4" />
            Revisions
          </button>
          <button
            onClick={() => setActiveTab("deploy")}
            className={`flex items-center gap-2 px-4 py-2 border-2 border-swiss-ink text-xs font-black uppercase font-mono tracking-wider transition shadow-[2px_2px_0px_#18181A] ${
              activeTab === "deploy" ? "bg-swiss-accent text-white" : "bg-white text-swiss-ink hover:bg-slate-50"
            }`}
          >
            <Cloud className="w-4 h-4" />
            Production Deploy
          </button>
        </div>

        {/* DEVICE CANVAS PREVIEW SIZER (ONLY VISIBLE ON EDITOR TAB) */}
        {activeTab === "editor" && (
          <div className="flex bg-white p-1 border-2 border-swiss-ink gap-1 text-xs shadow-[2px_2px_0px_#18181A]">
            <button
              onClick={() => setViewportSize("desktop")}
              className={`p-1.5 transition ${
                viewportSize === "desktop" ? "bg-swiss-ink text-white font-bold" : "text-swiss-ink hover:bg-slate-100"
              }`}
              title="Desktop preview"
            >
              <Monitor className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewportSize("tablet")}
              className={`p-1.5 transition ${
                viewportSize === "tablet" ? "bg-swiss-ink text-white font-bold" : "text-swiss-ink hover:bg-slate-100"
              }`}
              title="Tablet layout preview"
            >
              <Laptop className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewportSize("mobile")}
              className={`p-1.5 transition ${
                viewportSize === "mobile" ? "bg-swiss-ink text-white font-bold" : "text-swiss-ink hover:bg-slate-100"
              }`}
              title="Mobile sizing viewport"
            >
              <Smartphone className="w-4 h-4" />
            </button>
          </div>
        )}
      </nav>

      {/* CORE FRAMEWORK WORKSPACE */}
      <main className="flex-1 flex overflow-hidden">
        {/* TAB 1: VISUAL CANVAS WYSIWYG EDITOR */}
        {activeTab === "editor" && (
          <div className="flex-1 flex overflow-hidden w-full">
            {/* Palette & Property Inspector */}
            <Sidebar
              selectedElement={selectedElement}
              onAddElement={handleAddElement}
              onUpdateElement={handleUpdateElement}
              onDeleteElement={handleDeleteElement}
            />

            {/* Stage element scaling based on active viewport helper */}
            <div
              className={`flex-1 flex flex-col transition-all duration-300 ${
                viewportSize === "tablet" ? "max-w-3xl border-l border-r border-slate-200 mx-auto bg-slate-50" : ""
              } ${viewportSize === "mobile" ? "max-w-md border-l border-r border-slate-200 mx-auto bg-slate-50" : ""}`}
            >
              <Canvas
                elements={elements}
                selectedId={selectedId}
                onSelect={setSelectedId}
                onUpdateElement={handleUpdateElement}
                onDeleteElement={handleDeleteElement}
                onMoveElement={handleMoveElement}
                onDuplicateElement={handleDuplicateElement}
                collabCursors={collabCursors}
              />
            </div>
          </div>
        )}

        {/* TAB 2: CODE PREVIEW */}
        {activeTab === "code" && <CodePreview htmlCode={htmlCode} reactCode={reactCode} />}

        {/* TAB 3: AI DESIGN SUGGESTIONS */}
        {activeTab === "ai" && <AISuggestions elements={elements} onApplyStyle={handleApplyAiStyles} />}

        {/* TAB 4: AUTOMATED REVIEW */}
        {activeTab === "review" && <CodeReviewPanel reactCode={reactCode} />}

        {/* TAB 5: TEAM COLLABORATION */}
        {activeTab === "collab" && (
          <CollabPanel
            elements={elements}
            selectedId={selectedId}
            onSyncElements={setElements}
            onSyncCursors={setCollabCursors}
          />
        )}

        {/* TAB 6: REVISION TIMELINE */}
        {activeTab === "version" && (
          <VersionControl
            elements={elements}
            revisions={revisions}
            onAddRevision={handleAddRevision}
            onRollback={handleRollback}
          />
        )}

        {/* TAB 7: PRODUCTION DEPLOY */}
        {activeTab === "deploy" && <DeployPanel htmlCode={htmlCode} reactCode={reactCode} elements={elements} />}
      </main>
    </div>
  );
}
