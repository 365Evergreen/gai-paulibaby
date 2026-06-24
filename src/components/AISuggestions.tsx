import React, { useState } from "react";
import { AISuggestion, AccessibilityIssue, EditorElement } from "../types";
import { Sparkles, Eye, ShieldAlert, CheckCircle, RefreshCw, Layers, Contrast, ChevronRight } from "lucide-react";

interface AISuggestionsProps {
  elements: EditorElement[];
  onApplyStyle: (elementId: string, styles: Record<string, string>) => void;
}

export default function AISuggestions({ elements, onApplyStyle }: AISuggestionsProps) {
  // State for Suggestions
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<AISuggestion[]>([]);
  const [suggestionsError, setSuggestionsError] = useState<string | null>(null);

  // State for Accessibility Audit
  const [loadingAudit, setLoadingAudit] = useState(false);
  const [auditIssues, setAuditIssues] = useState<AccessibilityIssue[]>([]);
  const [auditError, setAuditError] = useState<string | null>(null);

  // Active sub-tab
  const [activeSubTab, setActiveSubTab] = useState<"design" | "accessibility" | "contrast">("design");

  // Local Contrast Calculator State
  const [fgColor, setFgColor] = useState("#FFFFFF");
  const [bgColor, setBgColor] = useState("#2563EB");
  const [contrastRatio, setContrastRatio] = useState<number | null>(4.52);

  // Trigger Gemini API Design Suggestion
  const handleFetchSuggestions = async () => {
    setLoadingSuggestions(true);
    setSuggestionsError(null);
    try {
      const response = await fetch("/api/gemini/suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ elements }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to retrieve suggestions");
      }

      setSuggestions(data.suggestions || []);
    } catch (err: any) {
      console.error(err);
      setSuggestionsError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoadingSuggestions(false);
    }
  };

  // Trigger Gemini API Accessibility Audit
  const handleFetchAudit = async () => {
    setLoadingAudit(true);
    setAuditError(null);
    try {
      const response = await fetch("/api/gemini/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ elements }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to audit accessibility");
      }

      setAuditIssues(data.issues || []);
    } catch (err: any) {
      console.error(err);
      setAuditError(err.message || "Audit failed. Please try again.");
    } finally {
      setLoadingAudit(false);
    }
  };

  // Automated style merger back to active design
  const handleApplySuggestion = (s: AISuggestion) => {
    if (!s.suggestedStyles) return;

    // Determine target element ID
    let targetId = s.targetElementId;
    if (!targetId && elements.length > 0) {
      // Fallback: apply to root container or first child
      targetId = elements[0].id;
    }

    if (targetId) {
      onApplyStyle(targetId, s.suggestedStyles);
      // Remove or mark applied locally
      setSuggestions((prev) => prev.filter((item) => item.title !== s.title));
      alert(`Successfully auto-applied styles to element ${targetId}!`);
    } else {
      alert("Could not identify a target layout element to apply styles onto.");
    }
  };

  // Hex color contrast ratio helper
  const hexToRgb = (hex: string) => {
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    const fullHex = hex.replace(shorthandRegex, (_, r, g, b) => r + r + g + g + b + b);
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(fullHex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : { r: 0, g: 0, b: 0 };
  };

  const getLuminance = (r: number, g: number, b: number) => {
    const a = [r, g, b].map((v) => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
  };

  const calculateContrast = () => {
    const rgb1 = hexToRgb(fgColor);
    const rgb2 = hexToRgb(bgColor);

    const l1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
    const l2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);

    const brightest = Math.max(l1, l2);
    const darkest = Math.min(l1, l2);

    const ratio = (brightest + 0.05) / (darkest + 0.05);
    setContrastRatio(parseFloat(ratio.toFixed(2)));
  };

  const getWcagVerdict = (ratio: number) => {
    if (ratio >= 7.0) {
      return { text: "AAA Compliant (Excellent)", color: "text-emerald-600 bg-emerald-50 border-emerald-200" };
    } else if (ratio >= 4.5) {
      return { text: "AA Compliant (Passed)", color: "text-blue-600 bg-blue-50 border-blue-200" };
    } else if (ratio >= 3.0) {
      return { text: "AA Large Text Only", color: "text-amber-600 bg-amber-50 border-amber-200" };
    } else {
      return { text: "Failed WCAG guidelines", color: "text-red-600 bg-red-50 border-red-200" };
    }
  };

  return (
    <div id="ai-design-portal" className="flex-1 overflow-y-auto bg-slate-50 p-6 min-h-[calc(100vh-140px)]">
      <div className="max-w-4xl mx-auto flex flex-col h-full gap-6">
        {/* Banner header */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-700 rounded-2xl p-6 text-white shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="max-w-xl">
            <h2 className="text-xl font-bold flex items-center gap-2 mb-1.5 font-sans tracking-tight">
              <Sparkles className="w-5.5 h-5.5 text-amber-300 animate-pulse" />
              AI Design Studio & Auditor
            </h2>
            <p className="text-xs text-indigo-100 leading-relaxed font-medium">
              Utilize Gemini algorithms to critique layout spacing, check visual typography hierarchies, and verify complete compliance with section accessibility rules.
            </p>
          </div>
          <div className="flex bg-indigo-900/40 p-1 rounded-xl border border-indigo-500/30 gap-1 text-xs font-semibold shrink-0">
            <button
              onClick={() => setActiveSubTab("design")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
                activeSubTab === "design" ? "bg-white text-indigo-900 shadow-sm" : "text-indigo-100 hover:text-white"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              UX Critiques
            </button>
            <button
              onClick={() => setActiveSubTab("accessibility")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
                activeSubTab === "accessibility" ? "bg-white text-indigo-900 shadow-sm" : "text-indigo-100 hover:text-white"
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              Accessibility
            </button>
            <button
              onClick={() => setActiveSubTab("contrast")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
                activeSubTab === "contrast" ? "bg-white text-indigo-900 shadow-sm" : "text-indigo-100 hover:text-white"
              }`}
            >
              <Contrast className="w-3.5 h-3.5" />
              Contrast Check
            </button>
          </div>
        </div>

        {/* SUB TAB MAIN WORKSPACE */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          {activeSubTab === "design" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-sm font-bold text-slate-800">Design Critique & Layout Advice</h3>
                  <p className="text-xs text-slate-500">Retrieves professional critiques regarding alignment, margins, padding and spacing hierarchies.</p>
                </div>
                <button
                  onClick={handleFetchSuggestions}
                  disabled={loadingSuggestions}
                  className="flex items-center gap-1.5 px-4.5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold text-xs rounded-lg transition shadow cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loadingSuggestions ? "animate-spin" : ""}`} />
                  {loadingSuggestions ? "Analyzing layout..." : "Request AI Analysis"}
                </button>
              </div>

              {suggestionsError && (
                <div className="bg-red-50 text-red-700 text-xs p-4 rounded-xl border border-red-100 font-medium">
                  {suggestionsError}
                </div>
              )}

              {suggestions.length === 0 && !loadingSuggestions && (
                <div className="text-center py-16 text-slate-400 border-2 border-dashed border-slate-100 bg-slate-50/50 rounded-2xl">
                  <Sparkles className="w-10 h-10 mx-auto text-slate-300 mb-3" />
                  <p className="text-xs font-semibold text-slate-600 mb-1">No feedback requested yet</p>
                  <p className="text-[10px] max-w-sm mx-auto leading-relaxed">
                    Click the "Request AI Analysis" button to send your visual layout to Gemini for spacing, sizing, and design system advice.
                  </p>
                </div>
              )}

              {loadingSuggestions && (
                <div className="py-20 text-center text-slate-500 text-xs font-medium space-y-4">
                  <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                  <p className="animate-pulse">Gemini designer is inspecting layout hierarchies...</p>
                </div>
              )}

              {suggestions.length > 0 && (
                <div className="grid md:grid-cols-2 gap-4">
                  {suggestions.map((s, idx) => (
                    <div key={idx} className="bg-slate-50/50 hover:bg-slate-50 border border-slate-150 rounded-xl p-5 transition flex flex-col justify-between">
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider bg-indigo-50 px-2 py-0.5 rounded-full">
                            {s.category}
                          </span>
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                            s.impact === "High" ? "bg-red-100 text-red-700" : s.impact === "Medium" ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-600"
                          }`}>
                            {s.impact} Impact
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-slate-800 leading-tight">{s.title}</h4>
                        <p className="text-xs text-slate-600 leading-relaxed">{s.description}</p>
                        <div className="bg-white rounded-lg p-2.5 border border-slate-100 text-[11px] text-slate-500">
                          <strong className="text-slate-700 block mb-0.5">Rationale:</strong>
                          {s.reason}
                        </div>
                      </div>

                      {s.suggestedStyles && (
                        <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center">
                          <div className="text-[10px] text-slate-400 font-mono">
                            {Object.entries(s.suggestedStyles).map(([k, v]) => `${k}: ${v}`).join(", ")}
                          </div>
                          <button
                            onClick={() => handleApplySuggestion(s)}
                            className="flex items-center gap-1 text-[11px] text-blue-600 font-bold hover:text-blue-700 transition cursor-pointer"
                          >
                            Apply Suggestion
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeSubTab === "accessibility" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-sm font-bold text-slate-800">WCAG Accessibility Compliance Audit</h3>
                  <p className="text-xs text-slate-500">Checks layout tree for screen reader labels, image alt descriptors, and structural semantics.</p>
                </div>
                <button
                  onClick={handleFetchAudit}
                  disabled={loadingAudit}
                  className="flex items-center gap-1.5 px-4.5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold text-xs rounded-lg transition shadow cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loadingAudit ? "animate-spin" : ""}`} />
                  {loadingAudit ? "Auditing elements..." : "Run WCAG Audit"}
                </button>
              </div>

              {auditError && (
                <div className="bg-red-50 text-red-700 text-xs p-4 rounded-xl border border-red-100 font-medium">
                  {auditError}
                </div>
              )}

              {auditIssues.length === 0 && !loadingAudit && (
                <div className="text-center py-16 text-slate-400 border-2 border-dashed border-slate-100 bg-slate-50/50 rounded-2xl">
                  <ShieldAlert className="w-10 h-10 mx-auto text-slate-300 mb-3" />
                  <p className="text-xs font-semibold text-slate-600 mb-1">No accessibility audits conducted</p>
                  <p className="text-[10px] max-w-sm mx-auto leading-relaxed">
                    Conduct a comprehensive automated assessment based on WCAG AA rules to make sure individuals using screen readers or assistive devices enjoy a frictionless experience.
                  </p>
                </div>
              )}

              {loadingAudit && (
                <div className="py-20 text-center text-slate-500 text-xs font-medium space-y-4">
                  <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                  <p className="animate-pulse">Checking visual nodes against WCAG accessibility mandates...</p>
                </div>
              )}

              {auditIssues.length > 0 && (
                <div className="space-y-3">
                  {auditIssues.map((issue) => (
                    <div key={issue.id} className="bg-slate-50 hover:bg-slate-100/75 rounded-xl p-4 border border-slate-150 transition flex items-start gap-3">
                      <div className="mt-0.5">
                        {issue.severity === "Critical" ? (
                          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-100 text-red-600 text-xs font-bold font-mono">!</span>
                        ) : issue.severity === "Moderate" ? (
                          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-100 text-amber-600 text-xs font-bold font-mono">w</span>
                        ) : (
                          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-blue-600 text-xs font-bold font-mono">i</span>
                        )}
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="text-xs font-bold text-slate-800">{issue.title}</h4>
                          <span className="text-[9px] bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded font-mono font-bold">
                            {issue.wcagRule}
                          </span>
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                            issue.severity === "Critical" ? "bg-red-100 text-red-700" : issue.severity === "Moderate" ? "bg-amber-100 text-amber-700" : "bg-blue-100 text-blue-700"
                          }`}>
                            {issue.severity}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">{issue.description}</p>
                        <div className="bg-white rounded p-2 border border-slate-100 text-[11px] text-slate-500 mt-2">
                          <strong className="text-slate-700 font-bold">Recommendation: </strong>
                          {issue.recommendation}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeSubTab === "contrast" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                  <Contrast className="w-4 h-4 text-indigo-500" />
                  Color Contrast Calculator
                </h3>
                <p className="text-xs text-slate-500">Calculate hex value color contrast ratios to pass WCAG 2.1 AA text standards (minimum ratio 4.5:1).</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Inputs */}
                <div className="space-y-4 border border-slate-100 p-4.5 rounded-xl bg-slate-50/50">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block mb-1 uppercase font-mono">Foreground Text (Hex)</label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={fgColor}
                        onChange={(e) => setFgColor(e.target.value)}
                        className="w-10 h-10 border border-slate-200 rounded-lg cursor-pointer"
                      />
                      <input
                        type="text"
                        value={fgColor}
                        onChange={(e) => setFgColor(e.target.value)}
                        className="flex-1 text-xs px-3 py-2 border border-slate-200 rounded-lg bg-white text-slate-800 font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block mb-1 uppercase font-mono">Background Canvas (Hex)</label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={bgColor}
                        onChange={(e) => setBgColor(e.target.value)}
                        className="w-10 h-10 border border-slate-200 rounded-lg cursor-pointer"
                      />
                      <input
                        type="text"
                        value={bgColor}
                        onChange={(e) => setBgColor(e.target.value)}
                        className="flex-1 text-xs px-3 py-2 border border-slate-200 rounded-lg bg-white text-slate-800 font-mono"
                      />
                    </div>
                  </div>

                  <button
                    onClick={calculateContrast}
                    className="w-full py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-lg transition"
                  >
                    Calculate Ratio
                  </button>
                </div>

                {/* Outputs & Preview */}
                <div className="flex flex-col justify-between border border-slate-100 p-4.5 rounded-xl bg-slate-50/50">
                  {/* Visual preview card */}
                  <div
                    className="flex-1 min-h-[100px] flex flex-col justify-center items-center rounded-lg p-4 mb-4 border border-slate-200"
                    style={{ backgroundColor: bgColor, color: fgColor }}
                  >
                    <span className="text-lg font-bold">Visual Text Preview</span>
                    <span className="text-xs opacity-80">This is how your visual pairing reads on screen</span>
                  </div>

                  {contrastRatio !== null && (
                    <div className="space-y-3">
                      <div className="flex justify-between items-center text-xs font-mono">
                        <span className="text-slate-500 font-bold uppercase">Contrast Ratio:</span>
                        <span className="text-lg font-bold text-slate-800">{contrastRatio} : 1</span>
                      </div>
                      <div className={`p-3 rounded-lg border text-xs font-semibold text-center ${getWcagVerdict(contrastRatio).color}`}>
                        {getWcagVerdict(contrastRatio).text}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
