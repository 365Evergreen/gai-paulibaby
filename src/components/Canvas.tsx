import React, { useState } from "react";
import { EditorElement } from "../types";
import { getTailwindClasses } from "../utils/codeGenerator";
import { MoveUp, MoveDown, Trash2, Copy, Edit2, Check } from "lucide-react";

interface CanvasProps {
  elements: EditorElement[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onUpdateElement: (id: string, updated: Partial<EditorElement>) => void;
  onDeleteElement: (id: string) => void;
  onMoveElement: (id: string, direction: "up" | "down") => void;
  onDuplicateElement: (id: string) => void;
  collabCursors?: Array<{ userId: string; name: string; color: string; elementId?: string }>;
}

export default function Canvas({
  elements,
  selectedId,
  onSelect,
  onUpdateElement,
  onDeleteElement,
  onMoveElement,
  onDuplicateElement,
  collabCursors = [],
}: CanvasProps) {
  const [editingTextId, setEditingTextId] = useState<string | null>(null);
  const [tempText, setTempText] = useState("");

  const handleStartEdit = (el: EditorElement, event: React.MouseEvent) => {
    event.stopPropagation();
    setEditingTextId(el.id);
    setTempText(el.content || "");
  };

  const handleSaveText = (id: string, event: React.MouseEvent | React.KeyboardEvent) => {
    event.stopPropagation();
    onUpdateElement(id, { content: tempText });
    setEditingTextId(null);
  };

  // Helper to render interactive visual element
  const renderVisualElement = (el: EditorElement): React.ReactNode => {
    const isSelected = selectedId === el.id;
    const classes = getTailwindClasses(el);

    // Filter cursors of collaborators active on this element
    const activeCursors = collabCursors.filter((c) => c.elementId === el.id);

    // Interactive wrapper styling
    const interactiveStyles = `relative group transition-all duration-200 
      ${isSelected ? "outline-3 outline-swiss-accent outline-offset-1 shadow-[2px_2px_0px_#18181A]" : "hover:outline-2 hover:outline-swiss-ink hover:outline-offset-1"}
    `;

    // Render control panel overlay for visual builders
    const renderControls = () => (
      <div className="absolute -top-3 right-2 hidden group-hover:flex items-center gap-1 bg-white shadow-[2px_2px_0px_#18181A] border-2 border-swiss-ink rounded-none p-1 z-50 text-xs">
        <span className="px-1 text-swiss-ink font-black font-mono text-[8px] mr-1 uppercase">{el.label}</span>
        <button
          onClick={(e) => { e.stopPropagation(); onMoveElement(el.id, "up"); }}
          className="p-1 hover:bg-swiss-accent hover:text-white border border-swiss-ink rounded-none text-swiss-ink transition"
          title="Move Up"
        >
          <MoveUp className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onMoveElement(el.id, "down"); }}
          className="p-1 hover:bg-swiss-accent hover:text-white border border-swiss-ink rounded-none text-swiss-ink transition"
          title="Move Down"
        >
          <MoveDown className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onDuplicateElement(el.id); }}
          className="p-1 hover:bg-swiss-accent hover:text-white border border-swiss-ink rounded-none text-swiss-ink transition"
          title="Duplicate"
        >
          <Copy className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onDeleteElement(el.id); }}
          className="p-1 hover:bg-red-500 hover:text-white border border-swiss-ink rounded-none text-red-600 transition"
          title="Delete"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    );

    // Collaboration cursor presence tags
    const renderCollabCursorTags = () => (
      activeCursors.length > 0 && (
        <div className="absolute -bottom-3 left-2 flex gap-1 z-40">
          {activeCursors.map((cursor) => (
            <span
              key={cursor.userId}
              className={`text-[10px] font-semibold text-white px-2 py-0.5 rounded-full shadow-sm animate-pulse ${cursor.color.replace("text-", "bg-")}`}
            >
              {cursor.name} edits...
            </span>
          ))}
        </div>
      )
    );

    const handleElementClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      onSelect(el.id);
    };

    // Double-click/Direct Content Render with interactive input fallback
    const renderEditableContent = (tagName: "h1" | "h2" | "p" | "span" | "button") => {
      const isEditing = editingTextId === el.id;

      if (isEditing) {
        return (
          <div className="flex items-center gap-1 w-full" onClick={(e) => e.stopPropagation()}>
            <input
              type="text"
              value={tempText}
              onChange={(e) => setTempText(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleSaveText(el.id, e); }}
              className="px-2 py-1.5 text-sm border-2 border-swiss-ink rounded-none bg-white text-swiss-ink font-mono font-bold w-full focus:outline-none focus:ring-2 focus:ring-swiss-accent"
              autoFocus
            />
            <button
              onClick={(e) => handleSaveText(el.id, e)}
              className="p-1.5 bg-swiss-ink text-white border-2 border-swiss-ink rounded-none hover:bg-swiss-accent transition"
            >
              <Check className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      }

      const displayContent = el.content || `[Double-click to edit ${el.label}]`;

      // Direct hover-edit triggers
      const editOverlayIcon = (
        <span 
          onClick={(e) => handleStartEdit(el, e)} 
          className="opacity-0 group-hover:opacity-100 ml-1.5 inline-block p-0.5 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded cursor-pointer transition"
          title="Quick edit text"
        >
          <Edit2 className="w-2.5 h-2.5 inline" />
        </span>
      );

      return (
        <span onDoubleClick={(e) => handleStartEdit(el, e)}>
          {displayContent}
          {editOverlayIcon}
        </span>
      );
    };

    switch (el.type) {
      case "heading":
        return (
          <h1 key={el.id} onClick={handleElementClick} className={`${classes} ${interactiveStyles}`}>
            {renderEditableContent("h1")}
            {renderControls()}
            {renderCollabCursorTags()}
          </h1>
        );
      case "subheading":
        return (
          <h2 key={el.id} onClick={handleElementClick} className={`${classes} ${interactiveStyles}`}>
            {renderEditableContent("h2")}
            {renderControls()}
            {renderCollabCursorTags()}
          </h2>
        );
      case "paragraph":
        return (
          <p key={el.id} onClick={handleElementClick} className={`${classes} ${interactiveStyles}`}>
            {renderEditableContent("p")}
            {renderControls()}
            {renderCollabCursorTags()}
          </p>
        );
      case "button":
        return (
          <button
            key={el.id}
            type="button"
            onClick={handleElementClick}
            className={`${classes} ${interactiveStyles}`}
          >
            {renderEditableContent("button")}
            {renderControls()}
            {renderCollabCursorTags()}
          </button>
        );
      case "image":
        const src = el.props?.src || "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=600&q=80";
        const alt = el.props?.alt || "Visual asset";
        return (
          <div key={el.id} onClick={handleElementClick} className={`${interactiveStyles} inline-block`}>
            <img src={src} alt={alt} className={classes} referrerPolicy="no-referrer" />
            {renderControls()}
            {renderCollabCursorTags()}
          </div>
        );
      case "badge":
        return (
          <span key={el.id} onClick={handleElementClick} className={`${classes} ${interactiveStyles} inline-block`}>
            {renderEditableContent("span")}
            {renderControls()}
            {renderCollabCursorTags()}
          </span>
        );
      case "input":
        const placeholder = el.props?.placeholder || "Type here...";
        return (
          <div key={el.id} onClick={handleElementClick} className={`${interactiveStyles} inline-block w-full`}>
            <input type="text" placeholder={placeholder} className={`${classes} pointer-events-none`} disabled />
            {renderControls()}
            {renderCollabCursorTags()}
          </div>
        );
      default:
        // Container type recursive rendering
        const ContainerTag = el.type === "footer" ? "footer" : "div";
        return (
          <ContainerTag
            key={el.id}
            onClick={handleElementClick}
            className={`${classes} ${interactiveStyles} min-h-[48px]`}
          >
            {el.children && el.children.length > 0 ? (
              el.children.map((child) => renderVisualElement(child))
            ) : (
              <div className="py-6 px-4 text-center border-2 border-dashed border-swiss-ink rounded-none text-swiss-ink font-mono font-bold text-xs bg-white/60 group-hover:bg-swiss-bg transition">
                [EMPTY {el.label.toUpperCase()}] CLICK PALETTE ITEMS TO INSERT HERE.
              </div>
            )}
            {renderControls()}
            {renderCollabCursorTags()}
          </ContainerTag>
        );
    }
  };

  return (
    <div id="canvas-scroll-container" className="flex-1 overflow-y-auto bg-swiss-bg p-8 flex flex-col justify-start items-center min-h-[calc(100vh-140px)]">
      <div className="w-full max-w-4xl bg-white border-4 border-swiss-ink shadow-[6px_6px_0px_#18181A] min-h-[600px] flex flex-col rounded-none">
        {/* Canvas Toolbar Info */}
        <div className="bg-white border-b-2 border-swiss-ink px-6 py-3 flex justify-between items-center text-xs text-swiss-ink font-mono font-bold select-none">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-swiss-accent animate-ping"></span>
            <span>LIVE INTERACTIVE STAGE</span>
          </div>
          <div className="text-slate-500 uppercase">
            {elements.length === 0 ? "STAGE EMPTY" : `${elements.length} ROOT_NODES_ACTIVE`}
          </div>
        </div>

        {/* Visual Content Stage */}
        <div className="flex-1 p-6 flex flex-col gap-4 bg-swiss-bg/10">
          {elements.length === 0 ? (
            <div className="flex-1 flex flex-col justify-center items-center py-20 text-center text-swiss-ink border-4 border-dashed border-swiss-ink rounded-none m-4 bg-white shadow-[4px_4px_0px_#18181A]">
              <p className="text-lg font-black text-swiss-ink font-syne uppercase mb-2">Your visual stage is empty</p>
              <p className="text-xs max-w-md font-mono text-slate-500 mb-6 uppercase">Select a starter layout from the header bar or insert items from the side palette to compose.</p>
            </div>
          ) : (
            elements.map((el) => renderVisualElement(el))
          )}
        </div>
      </div>
    </div>
  );
}
