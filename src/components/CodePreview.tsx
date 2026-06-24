import React, { useState } from "react";
import { Copy, Check, Download, FileCode, Code2 } from "lucide-react";

interface CodePreviewProps {
  htmlCode: string;
  reactCode: string;
}

export default function CodePreview({ htmlCode, reactCode }: CodePreviewProps) {
  const [activeTab, setActiveTab] = useState<"html" | "react">("react");
  const [copied, setCopied] = useState(false);

  const activeCode = activeTab === "html" ? htmlCode : reactCode;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(activeCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy code", err);
    }
  };

  const handleDownload = () => {
    const filename = activeTab === "html" ? "index.html" : "Page.tsx";
    const blob = new Blob([activeCode], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Helper to format code with line numbers safely
  const lines = activeCode.split("\n");

  return (
    <div id="code-preview-pane" className="flex-1 overflow-y-auto bg-swiss-bg p-6 font-mono min-h-[calc(100vh-140px)]">
      <div className="max-w-4xl mx-auto bg-white border-4 border-swiss-ink overflow-hidden shadow-[6px_6px_0px_#18181A] flex flex-col h-full min-h-[550px] rounded-none">
        {/* Code Bar Header */}
        <div className="bg-white border-b-2 border-swiss-ink px-6 py-4 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          {/* Tab buttons */}
          <div className="flex bg-white p-1 border-2 border-swiss-ink gap-1 text-xs rounded-none">
            <button
              onClick={() => setActiveTab("react")}
              className={`flex items-center gap-1.5 px-4 py-2 font-black font-mono uppercase tracking-wider transition rounded-none ${
                activeTab === "react" ? "bg-swiss-accent text-white" : "text-swiss-ink hover:bg-slate-100"
              }`}
            >
              <FileCode className="w-4 h-4" />
              React (.tsx)
            </button>
            <button
              onClick={() => setActiveTab("html")}
              className={`flex items-center gap-1.5 px-4 py-2 font-black font-mono uppercase tracking-wider transition rounded-none ${
                activeTab === "html" ? "bg-swiss-accent text-white" : "text-swiss-ink hover:bg-slate-100"
              }`}
            >
              <Code2 className="w-4 h-4" />
              HTML + Tailwind (.html)
            </button>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2 text-xs">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-4.5 py-2.5 bg-white text-swiss-ink hover:bg-swiss-ink hover:text-white border-2 border-swiss-ink shadow-[2px_2px_0px_#18181A] font-black font-mono uppercase tracking-wider transition active:translate-x-0.5 active:translate-y-0.5 cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-500" />
                  <span className="text-emerald-500">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy Code</span>
                </>
              )}
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-4.5 py-2.5 bg-white text-swiss-ink hover:bg-swiss-ink hover:text-white border-2 border-swiss-ink shadow-[2px_2px_0px_#18181A] font-black font-mono uppercase tracking-wider transition active:translate-x-0.5 active:translate-y-0.5 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download File</span>
            </button>
          </div>
        </div>

        {/* Code Content Box with line numbers */}
        <div className="flex-1 overflow-auto p-4 flex font-mono text-[13px] leading-relaxed bg-slate-900 border-b-2 border-swiss-ink max-h-[500px]">
          {/* Numbers Line gutter */}
          <div className="text-slate-500 text-right pr-4 border-r border-slate-800 select-none hidden sm:block w-10 shrink-0">
            {lines.map((_, idx) => (
              <div key={idx} className="h-6">
                {idx + 1}
              </div>
            ))}
          </div>

          {/* Code Viewer */}
          <pre className="pl-4 text-slate-200 overflow-x-auto flex-1 font-mono selection:bg-swiss-accent selection:text-white">
            {lines.map((line, idx) => (
              <div key={idx} className="h-6 whitespace-pre-wrap sm:whitespace-pre hover:bg-slate-800/40 px-1 rounded transition">
                {line || " "}
              </div>
            ))}
          </pre>
        </div>

        {/* Info Footer */}
        <div className="bg-white px-6 py-3.5 text-slate-500 text-[10px] flex justify-between items-center font-mono font-bold uppercase">
          <span>Target compiler: ECMAScript Next (ESNext)</span>
          <span className="text-swiss-accent font-mono">Tailwind CSS v4 CDN load</span>
        </div>
      </div>
    </div>
  );
}
