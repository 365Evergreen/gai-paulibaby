import React from "react";
import { EditorElement } from "../types";
import {
  Heading,
  Type,
  Square,
  Grid,
  Columns,
  BadgeAlert,
  Image as ImageIcon,
  MousePointer,
  Sparkles,
  Type as FontIcon,
  Maximize2,
  AlignCenter,
  AlignLeft,
  AlignRight,
  Palette,
  Trash2,
  Plus
} from "lucide-react";

interface SidebarProps {
  selectedElement: EditorElement | null;
  onAddElement: (type: string) => void;
  onUpdateElement: (id: string, updated: Partial<EditorElement>) => void;
  onDeleteElement: (id: string) => void;
}

export default function Sidebar({
  selectedElement,
  onAddElement,
  onUpdateElement,
  onDeleteElement,
}: SidebarProps) {
  // Preset styles lists for easy visual selectors
  const bgColorPresets = [
    { name: "Swiss Off-White", class: "bg-swiss-bg" },
    { name: "Swiss Ink Black", class: "bg-swiss-ink" },
    { name: "Swiss Accent Orange", class: "bg-swiss-accent" },
    { name: "Pure White", class: "bg-white" },
    { name: "Light Slate", class: "bg-slate-50" },
    { name: "Success Green", class: "bg-emerald-500" },
    { name: "Dark Slate", class: "bg-slate-900" },
    { name: "Transparent", class: "bg-transparent" },
  ];

  const textColorPresets = [
    { name: "Swiss Ink Black", class: "text-swiss-ink" },
    { name: "Swiss Accent Orange", class: "text-swiss-accent" },
    { name: "Swiss Off-White", class: "text-swiss-bg" },
    { name: "Muted Gray", class: "text-slate-500" },
    { name: "Pure White", class: "text-white" },
    { name: "Success Green", class: "text-emerald-600" },
  ];

  const paddingPresets = [
    { name: "None", class: "p-0" },
    { name: "Small (xs)", class: "p-2" },
    { name: "Medium (md)", class: "p-4" },
    { name: "Large (lg)", class: "p-6" },
    { name: "Chunky Swiss padding", class: "p-8 md:p-12" },
    { name: "Hero padding (xl)", class: "py-20 px-8" },
  ];

  const marginPresets = [
    { name: "None", class: "m-0" },
    { name: "Bottom spacing (sm)", class: "mb-2" },
    { name: "Bottom spacing (md)", class: "mb-4" },
    { name: "Bottom spacing (lg)", class: "mb-8" },
    { name: "Bottom spacing (xl)", class: "mb-16" },
    { name: "All-around (md)", class: "m-4" },
  ];

  const borderRadiusPresets = [
    { name: "Square (Swiss)", class: "rounded-none" },
    { name: "Rounded (sm)", class: "rounded" },
    { name: "Rounded (md)", class: "rounded-md" },
    { name: "Rounded (xl)", class: "rounded-xl" },
    { name: "Full Circle", class: "rounded-full" },
  ];

  const borderPresets = [
    { name: "None", class: "border-none" },
    { name: "Chunky Swiss Ink (2px)", class: "border-2 border-swiss-ink" },
    { name: "Thin Swiss Ink (1px)", class: "border border-swiss-ink" },
    { name: "Thick Orange Accent", class: "border-2 border-swiss-accent" },
    { name: "Bottom Swiss Border", class: "border-b-2 border-swiss-ink" },
  ];

  const shadowPresets = [
    { name: "None", class: "shadow-none" },
    { name: "Hard Swiss Shadow (4px)", class: "shadow-[4px_4px_0px_#18181A]" },
    { name: "Hard Accent Shadow (4px)", class: "shadow-[4px_4px_0px_#E5572E]" },
    { name: "Chunky Hard Shadow (8px)", class: "shadow-[8px_8px_0px_#18181A]" },
    { name: "Small Smooth", class: "shadow-sm" },
    { name: "Medium Smooth", class: "shadow-md" },
  ];

  const widthPresets = [
    { name: "Auto width", class: "w-auto" },
    { name: "Fit content", class: "w-fit" },
    { name: "Half size (1/2)", class: "w-1/2" },
    { name: "Full width (100%)", class: "w-full" },
    { name: "Max constraints", class: "max-w-4xl mx-auto" },
  ];

  const gridColsPresets = [
    { name: "1 Column", class: "grid-cols-1" },
    { name: "2 Columns", class: "grid-cols-2" },
    { name: "3 Columns", class: "grid-cols-3" },
    { name: "4 Columns", class: "grid-cols-4" },
  ];

  const flexDirPresets = [
    { name: "Row layout", class: "flex-row" },
    { name: "Column layout", class: "flex-col" },
  ];

  const handleStyleChange = (key: string, value: string) => {
    if (!selectedElement) return;
    const currentStyles = selectedElement.styles || {};
    onUpdateElement(selectedElement.id, {
      styles: {
        ...currentStyles,
        [key]: value,
      },
    });
  };

  return (
    <div id="editor-sidebar" className="w-80 border-r-2 border-swiss-ink bg-swiss-bg h-[calc(100vh-140px)] flex flex-col overflow-y-auto">
      {/* PALETTE SECTION */}
      <div className="p-5 border-b-2 border-swiss-ink bg-white">
        <h3 className="text-xs font-black text-swiss-ink tracking-widest uppercase mb-2 flex items-center gap-1.5 font-mono">
          <Plus className="w-4.5 h-4.5 text-swiss-accent" />
          Component Palette
        </h3>
        <p className="text-[11px] text-slate-500 mb-4 leading-relaxed">
          Click an element to insert. If a container layout is selected, it will nest inside!
        </p>

        {/* Categories Grid */}
        <div className="space-y-4">
          {/* Layout Elements */}
          <div>
            <span className="text-[9px] font-bold text-swiss-ink block mb-2 font-mono tracking-widest">LAYOUT CONTAINERS</span>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onAddElement("section")}
                className="flex items-center gap-2 p-2.5 text-xs text-swiss-ink bg-white hover:bg-swiss-accent hover:text-white transition duration-100 border-2 border-swiss-ink text-left font-bold shadow-[2px_2px_0px_#18181A] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]"
              >
                <Square className="w-3.5 h-3.5" />
                Section Wrap
              </button>
              <button
                onClick={() => onAddElement("grid")}
                className="flex items-center gap-2 p-2.5 text-xs text-swiss-ink bg-white hover:bg-swiss-accent hover:text-white transition duration-100 border-2 border-swiss-ink text-left font-bold shadow-[2px_2px_0px_#18181A] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]"
              >
                <Grid className="w-3.5 h-3.5" />
                CSS Grid
              </button>
              <button
                onClick={() => onAddElement("flex")}
                className="flex items-center gap-2 p-2.5 text-xs text-swiss-ink bg-white hover:bg-swiss-accent hover:text-white transition duration-100 border-2 border-swiss-ink text-left font-bold shadow-[2px_2px_0px_#18181A] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]"
              >
                <Columns className="w-3.5 h-3.5" />
                Flex Box
              </button>
              <button
                onClick={() => onAddElement("card")}
                className="flex items-center gap-2 p-2.5 text-xs text-swiss-ink bg-white hover:bg-swiss-accent hover:text-white transition duration-100 border-2 border-swiss-ink text-left font-bold shadow-[2px_2px_0px_#18181A] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                Visual Card
              </button>
            </div>
          </div>

          {/* Typography Elements */}
          <div>
            <span className="text-[9px] font-bold text-swiss-ink block mb-2 font-mono tracking-widest">TYPOGRAPHY</span>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onAddElement("heading")}
                className="flex items-center gap-2 p-2.5 text-xs text-swiss-ink bg-white hover:bg-swiss-accent hover:text-white transition duration-100 border-2 border-swiss-ink text-left font-bold shadow-[2px_2px_0px_#18181A] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]"
              >
                <Heading className="w-3.5 h-3.5 text-swiss-accent" />
                Big Title (H1)
              </button>
              <button
                onClick={() => onAddElement("subheading")}
                className="flex items-center gap-2 p-2.5 text-xs text-swiss-ink bg-white hover:bg-swiss-accent hover:text-white transition duration-100 border-2 border-swiss-ink text-left font-bold shadow-[2px_2px_0px_#18181A] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]"
              >
                <Type className="w-3.5 h-3.5 text-swiss-accent" />
                Subtitle (H2)
              </button>
              <button
                onClick={() => onAddElement("paragraph")}
                className="flex-1 col-span-2 flex items-center gap-2 p-2.5 text-xs text-swiss-ink bg-white hover:bg-swiss-accent hover:text-white transition duration-100 border-2 border-swiss-ink text-left font-bold shadow-[2px_2px_0px_#18181A] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]"
              >
                <FontIcon className="w-3.5 h-3.5" />
                Body Text Paragraph
              </button>
            </div>
          </div>

          {/* Components */}
          <div>
            <span className="text-[9px] font-bold text-swiss-ink block mb-2 font-mono tracking-widest">INTERACTION & ASSETS</span>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onAddElement("button")}
                className="flex items-center gap-2 p-2.5 text-xs text-swiss-ink bg-white hover:bg-swiss-accent hover:text-white transition duration-100 border-2 border-swiss-ink text-left font-bold shadow-[2px_2px_0px_#18181A] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]"
              >
                <MousePointer className="w-3.5 h-3.5" />
                CTA Button
              </button>
              <button
                onClick={() => onAddElement("badge")}
                className="flex items-center gap-2 p-2.5 text-xs text-swiss-ink bg-white hover:bg-swiss-accent hover:text-white transition duration-100 border-2 border-swiss-ink text-left font-bold shadow-[2px_2px_0px_#18181A] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]"
              >
                <BadgeAlert className="w-3.5 h-3.5" />
                Pill Badge
              </button>
              <button
                onClick={() => onAddElement("image")}
                className="flex items-center gap-2 p-2.5 text-xs text-swiss-ink bg-white hover:bg-swiss-accent hover:text-white transition duration-100 border-2 border-swiss-ink text-left font-bold shadow-[2px_2px_0px_#18181A] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]"
              >
                <ImageIcon className="w-3.5 h-3.5" />
                Responsive Image
              </button>
              <button
                onClick={() => onAddElement("input")}
                className="flex items-center gap-2 p-2.5 text-xs text-swiss-ink bg-white hover:bg-swiss-accent hover:text-white transition duration-100 border-2 border-swiss-ink text-left font-bold shadow-[2px_2px_0px_#18181A] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]"
              >
                <FontIcon className="w-3.5 h-3.5" />
                Text Input
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* PROPERTIES EDITOR */}
      <div className="flex-1 p-5 bg-swiss-bg">
        <h3 className="text-xs font-black text-swiss-ink tracking-widest uppercase mb-3 flex items-center gap-1.5 font-mono">
          <Sparkles className="w-4.5 h-4.5 text-swiss-accent" />
          Properties Inspector
        </h3>

        {selectedElement ? (
          <div className="space-y-4">
            {/* Active info banner */}
            <div className="bg-white p-3 border-2 border-swiss-ink flex justify-between items-center shadow-[2px_2px_0px_#18181A]">
              <div>
                <span className="text-[9px] font-bold text-swiss-accent block uppercase font-mono tracking-widest">SELECTED TYPE</span>
                <span className="text-xs font-black text-swiss-ink font-mono">{selectedElement.label}</span>
              </div>
              <button
                onClick={() => onDeleteElement(selectedElement.id)}
                className="p-1.5 bg-red-100 hover:bg-red-200 border-2 border-swiss-ink text-swiss-ink transition"
                title="Delete element"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {/* Content Field if text component */}
            {["heading", "subheading", "paragraph", "button", "badge"].includes(selectedElement.type) && (
              <div>
                <label className="text-[10px] font-black text-swiss-ink block mb-1 uppercase font-mono tracking-wider">Content Text</label>
                <textarea
                  value={selectedElement.content || ""}
                  onChange={(e) => onUpdateElement(selectedElement.id, { content: e.target.value })}
                  className="w-full text-xs p-2.5 border-2 border-swiss-ink bg-white focus:outline-none focus:ring-2 focus:ring-swiss-accent text-swiss-ink font-mono font-medium"
                  rows={3}
                />
              </div>
            )}

            {/* Custom attributes for Image */}
            {selectedElement.type === "image" && (
              <div className="space-y-2 border-t-2 border-b-2 border-swiss-ink py-3">
                <span className="text-[10px] font-black text-swiss-ink block font-mono tracking-widest">IMAGE ATTRIBUTES</span>
                <div>
                  <label className="text-[9px] font-bold text-slate-600 block mb-0.5 uppercase font-mono">Source URL</label>
                  <input
                    type="text"
                    value={selectedElement.props?.src || ""}
                    onChange={(e) =>
                      onUpdateElement(selectedElement.id, {
                        props: { ...selectedElement.props, src: e.target.value },
                      })
                    }
                    className="w-full text-xs p-2 border-2 border-swiss-ink bg-white text-swiss-ink font-mono font-medium focus:outline-none focus:ring-2 focus:ring-swiss-accent"
                    placeholder="https://images.unsplash.com/..."
                  />
                </div>
                <div>
                  <label className="text-[9px] font-bold text-slate-600 block mb-0.5 uppercase font-mono">Alt Description</label>
                  <input
                    type="text"
                    value={selectedElement.props?.alt || ""}
                    onChange={(e) =>
                      onUpdateElement(selectedElement.id, {
                        props: { ...selectedElement.props, alt: e.target.value },
                      })
                    }
                    className="w-full text-xs p-2 border-2 border-swiss-ink bg-white text-swiss-ink font-mono font-medium focus:outline-none focus:ring-2 focus:ring-swiss-accent"
                    placeholder="Descriptive alternate text"
                  />
                </div>
              </div>
            )}

            {/* Custom placeholder for Input */}
            {selectedElement.type === "input" && (
              <div className="border-t-2 border-b-2 border-swiss-ink py-3">
                <span className="text-[10px] font-black text-swiss-ink block font-mono tracking-widest">INPUT ATTRIBUTES</span>
                <label className="text-[9px] font-bold text-slate-600 block mb-0.5 uppercase font-mono">Placeholder</label>
                <input
                  type="text"
                  value={selectedElement.props?.placeholder || ""}
                  onChange={(e) =>
                    onUpdateElement(selectedElement.id, {
                      props: { ...selectedElement.props, placeholder: e.target.value },
                    })
                  }
                  className="w-full text-xs p-2 border-2 border-swiss-ink bg-white text-swiss-ink font-mono font-medium focus:outline-none focus:ring-2 focus:ring-swiss-accent"
                  placeholder="Type text here..."
                />
              </div>
            )}

            {/* Layout Specific configuration for Grid */}
            {selectedElement.type === "grid" && (
              <div>
                <label className="text-[10px] font-black text-swiss-ink block mb-1 uppercase font-mono tracking-wider">Grid Columns</label>
                <div className="grid grid-cols-2 gap-1.5">
                  {gridColsPresets.map((preset) => (
                    <button
                      key={preset.class}
                      onClick={() => handleStyleChange("gridCols", preset.class)}
                      className={`text-[10px] p-2 border-2 border-swiss-ink text-center font-bold font-mono transition shadow-[1px_1px_0px_#18181A] ${
                        selectedElement.styles?.gridCols === preset.class
                          ? "bg-swiss-accent text-white"
                          : "bg-white text-swiss-ink hover:bg-slate-50"
                      }`}
                    >
                      {preset.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Layout Specific configuration for Flex */}
            {selectedElement.type === "flex" && (
              <div>
                <label className="text-[10px] font-black text-swiss-ink block mb-1 uppercase font-mono tracking-wider">Direction</label>
                <div className="flex gap-2">
                  {flexDirPresets.map((preset) => (
                    <button
                      key={preset.class}
                      onClick={() => handleStyleChange("flexDir", preset.class)}
                      className={`flex-1 text-[10px] p-2 border-2 border-swiss-ink text-center font-bold font-mono transition shadow-[1px_1px_0px_#18181A] ${
                        selectedElement.styles?.flexDir === preset.class
                          ? "bg-swiss-accent text-white"
                          : "bg-white text-swiss-ink hover:bg-slate-50"
                      }`}
                    >
                      {preset.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* BACKGROUND COLOR ACCENT */}
            <div>
              <label className="text-[10px] font-black text-swiss-ink block mb-1.5 uppercase font-mono flex items-center gap-1">
                <Palette className="w-3.5 h-3.5 text-swiss-accent" />
                Background Color
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {bgColorPresets.map((preset) => (
                  <button
                    key={preset.class}
                    onClick={() => handleStyleChange("bgColor", preset.class)}
                    className={`h-8 border-2 border-swiss-ink text-[10px] flex items-center justify-center transition hover:scale-105 shadow-[1px_1px_0px_#18181A] ${
                      preset.class
                    } ${
                      selectedElement.styles?.bgColor === preset.class
                        ? "ring-2 ring-swiss-accent ring-offset-1"
                        : ""
                    }`}
                    title={preset.name}
                  >
                    {preset.class === "bg-swiss-ink" || preset.class === "bg-slate-900" ? (
                      <span className="text-white text-[8px] font-black font-mono">Abc</span>
                    ) : (
                      <span className="text-swiss-ink text-[8px] font-black font-mono">Abc</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* TEXT COLOR ACCENT */}
            <div>
              <label className="text-[10px] font-black text-swiss-ink block mb-1.5 uppercase font-mono tracking-wider">Text Color</label>
              <div className="grid grid-cols-3 gap-1.5">
                {textColorPresets.map((preset) => (
                  <button
                    key={preset.class}
                    onClick={() => handleStyleChange("textColor", preset.class)}
                    className={`p-1.5 text-[10px] font-black border-2 border-swiss-ink text-center transition truncate shadow-[1px_1px_0px_#18181A] ${
                      selectedElement.styles?.textColor === preset.class
                        ? "bg-swiss-accent text-white"
                        : "bg-white text-swiss-ink hover:bg-slate-50"
                    }`}
                  >
                    <span className={preset.class === "text-swiss-bg" ? "text-swiss-accent" : preset.class}>{preset.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* PADDING CONFIG */}
            <div>
              <label className="text-[10px] font-black text-swiss-ink block mb-1 uppercase font-mono tracking-wider">Padding Size</label>
              <select
                value={selectedElement.styles?.padding || ""}
                onChange={(e) => handleStyleChange("padding", e.target.value)}
                className="w-full text-xs p-2 border-2 border-swiss-ink bg-white text-swiss-ink font-mono font-bold focus:outline-none focus:ring-2 focus:ring-swiss-accent"
              >
                {paddingPresets.map((preset) => (
                  <option key={preset.class} value={preset.class}>
                    {preset.name}
                  </option>
                ))}
              </select>
            </div>

            {/* MARGIN SPACING */}
            <div>
              <label className="text-[10px] font-black text-swiss-ink block mb-1 uppercase font-mono tracking-wider">Margin Spacing</label>
              <select
                value={selectedElement.styles?.margin || ""}
                onChange={(e) => handleStyleChange("margin", e.target.value)}
                className="w-full text-xs p-2 border-2 border-swiss-ink bg-white text-swiss-ink font-mono font-bold focus:outline-none focus:ring-2 focus:ring-swiss-accent"
              >
                {marginPresets.map((preset) => (
                  <option key={preset.class} value={preset.class}>
                    {preset.name}
                  </option>
                ))}
              </select>
            </div>

            {/* ROUNDED CORNERS */}
            <div>
              <label className="text-[10px] font-black text-swiss-ink block mb-1 uppercase font-mono tracking-wider">Rounded Corners</label>
              <select
                value={selectedElement.styles?.borderRadius || ""}
                onChange={(e) => handleStyleChange("borderRadius", e.target.value)}
                className="w-full text-xs p-2 border-2 border-swiss-ink bg-white text-swiss-ink font-mono font-bold focus:outline-none focus:ring-2 focus:ring-swiss-accent"
              >
                {borderRadiusPresets.map((preset) => (
                  <option key={preset.class} value={preset.class}>
                    {preset.name}
                  </option>
                ))}
              </select>
            </div>

            {/* BORDER DESIGN */}
            <div>
              <label className="text-[10px] font-black text-swiss-ink block mb-1 uppercase font-mono flex items-center gap-1 tracking-wider">
                <Square className="w-3.5 h-3.5 text-swiss-accent" />
                Border Style
              </label>
              <select
                value={selectedElement.styles?.border || ""}
                onChange={(e) => handleStyleChange("border", e.target.value)}
                className="w-full text-xs p-2 border-2 border-swiss-ink bg-white text-swiss-ink font-mono font-bold focus:outline-none focus:ring-2 focus:ring-swiss-accent"
              >
                {borderPresets.map((preset) => (
                  <option key={preset.class} value={preset.class}>
                    {preset.name}
                  </option>
                ))}
              </select>
            </div>

            {/* SHADOW ACCENT */}
            <div>
              <label className="text-[10px] font-black text-swiss-ink block mb-1 uppercase font-mono tracking-wider">Shadow Intensity</label>
              <select
                value={selectedElement.styles?.shadow || ""}
                onChange={(e) => handleStyleChange("shadow", e.target.value)}
                className="w-full text-xs p-2 border-2 border-swiss-ink bg-white text-swiss-ink font-mono font-bold focus:outline-none focus:ring-2 focus:ring-swiss-accent"
              >
                {shadowPresets.map((preset) => (
                  <option key={preset.class} value={preset.class}>
                    {preset.name}
                  </option>
                ))}
              </select>
            </div>

            {/* WIDTH CONFIG */}
            <div>
              <label className="text-[10px] font-black text-swiss-ink block mb-1 uppercase font-mono tracking-wider">Width bounds</label>
              <select
                value={selectedElement.styles?.width || ""}
                onChange={(e) => handleStyleChange("width", e.target.value)}
                className="w-full text-xs p-2 border-2 border-swiss-ink bg-white text-swiss-ink font-mono font-bold focus:outline-none focus:ring-2 focus:ring-swiss-accent"
              >
                {widthPresets.map((preset) => (
                  <option key={preset.class} value={preset.class}>
                    {preset.name}
                  </option>
                ))}
              </select>
            </div>

            {/* TEXT ALIGNMENT */}
            {["heading", "subheading", "paragraph"].includes(selectedElement.type) && (
              <div>
                <label className="text-[10px] font-black text-swiss-ink block mb-1 uppercase font-mono tracking-wider">Text Alignment</label>
                <div className="flex bg-white p-1 border-2 border-swiss-ink gap-1">
                  <button
                    onClick={() => handleStyleChange("alignment", "text-left")}
                    className={`flex-1 flex justify-center py-1.5 transition ${
                      selectedElement.styles?.alignment === "text-left" || !selectedElement.styles?.alignment
                        ? "bg-swiss-ink text-white font-bold"
                        : "text-swiss-ink hover:bg-slate-100"
                    }`}
                  >
                    <AlignLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleStyleChange("alignment", "text-center")}
                    className={`flex-1 flex justify-center py-1.5 transition ${
                      selectedElement.styles?.alignment === "text-center"
                        ? "bg-swiss-ink text-white font-bold"
                        : "text-swiss-ink hover:bg-slate-100"
                    }`}
                  >
                    <AlignCenter className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleStyleChange("alignment", "text-right")}
                    className={`flex-1 flex justify-center py-1.5 transition ${
                      selectedElement.styles?.alignment === "text-right"
                        ? "bg-swiss-ink text-white font-bold"
                        : "text-swiss-ink hover:bg-slate-100"
                    }`}
                  >
                    <AlignRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-16 text-swiss-ink border-2 border-dashed border-swiss-ink bg-white shadow-[2px_2px_0px_#18181A]">
            <MousePointer className="w-8 h-8 mx-auto text-swiss-accent mb-2.5 animate-bounce" />
            <p className="text-xs font-black text-swiss-ink uppercase font-mono tracking-wider mb-1">No Element Selected</p>
            <p className="text-[10px] px-4 font-medium text-slate-500 leading-relaxed">
              Click any rendered component on the central visual stage to customize margins, colors, and styling rules.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
