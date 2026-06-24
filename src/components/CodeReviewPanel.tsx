import React, { useState } from "react";
import { CodeReviewIssue } from "../types";
import { ShieldCheck, Bug, Heart, AlertTriangle, HelpCircle, RefreshCw, Terminal, CheckCircle2 } from "lucide-react";

interface CodeReviewPanelProps {
  reactCode: string;
}

export default function CodeReviewPanel({ reactCode }: CodeReviewPanelProps) {
  const [loading, setLoading] = useState(false);
  const [issues, setIssues] = useState<CodeReviewIssue[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Trigger server-side combined code review (Python script + Gemini)
  const handleRunReview = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/review-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: reactCode, filename: "GeneratedPage.tsx" }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to analyze code review");
      }

      setIssues(data.issues || []);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Something went wrong during the review process.");
    } finally {
      setLoading(false);
    }
  };

  // Calculate high-fidelity Code Review Quality Score (0 to 100)
  const calculateScore = () => {
    if (issues.length === 0) return 100;
    const errorsCount = issues.filter((i) => i.severity === "error").length;
    const warningsCount = issues.filter((i) => i.severity === "warning").length;
    const infosCount = issues.filter((i) => i.severity === "info").length;

    const penalty = errorsCount * 15 + warningsCount * 7 + infosCount * 3;
    return Math.max(15, 100 - penalty);
  };

  const getScoreVerdict = (score: number) => {
    if (score >= 90) return { label: "Excellent (Production Ready)", color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/30" };
    if (score >= 70) return { label: "Good (Needs Minor Refactoring)", color: "text-amber-500 bg-amber-500/10 border-amber-500/30" };
    return { label: "Critical Issues Found (Refactoring Recommended)", color: "text-red-500 bg-red-500/10 border-red-500/30" };
  };

  const score = calculateScore();
  const verdict = getScoreVerdict(score);

  return (
    <div id="code-review-pane" className="flex-1 overflow-y-auto bg-slate-50 p-6 min-h-[calc(100vh-140px)]">
      <div className="max-w-4xl mx-auto flex flex-col h-full gap-6">
        {/* Review Header Controls */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div>
            <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <Bug className="w-5 h-5 text-red-500" />
              Automated Code Review Panel
            </h2>
            <p className="text-xs text-slate-500 leading-relaxed max-w-lg mt-1">
              Analyze the auto-generated code for syntax, security liabilities (XSS/hijacking), performance leaks, and React standard conventions. Uses visual python scripts and deep-learning scanners.
            </p>
          </div>
          <button
            onClick={handleRunReview}
            disabled={loading}
            className="flex items-center gap-2 px-5 py-3 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 text-white font-bold text-xs rounded-xl transition shadow cursor-pointer shrink-0"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            {loading ? "Reviewing codebase..." : "Start Code Review"}
          </button>
        </div>

        {error && (
          <div className="bg-red-50 text-red-700 text-xs p-4 rounded-xl border border-red-100 font-medium">
            {error}
          </div>
        )}

        {/* DEFAULT VIEW */}
        {issues.length === 0 && !loading && (
          <div className="text-center py-20 bg-white border border-slate-200 rounded-2xl shadow-sm">
            <ShieldCheck className="w-12 h-12 mx-auto text-emerald-500 mb-4" />
            <p className="text-sm font-semibold text-slate-700 mb-1">Code Quality Audit Ready</p>
            <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed mb-6">
              Click "Start Code Review" to run python-driven AST rules combined with AI-powered deep review on your active design's React code.
            </p>
            <button
              onClick={handleRunReview}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition"
            >
              Analyze Now
            </button>
          </div>
        )}

        {/* LOADING SCREEN */}
        {loading && (
          <div className="py-24 text-center bg-white border border-slate-200 rounded-2xl shadow-sm space-y-4">
            <div className="w-9 h-9 border-4 border-slate-900 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-xs text-slate-500 animate-pulse font-medium">
              Running python code_reviewer.py checks & prompting Gemini auditor...
            </p>
          </div>
        )}

        {/* RESULTS ACTIVE DASHBOARD */}
        {issues.length > 0 && !loading && (
          <div className="grid md:grid-cols-3 gap-6">
            {/* SCORE DISPLAY BAR */}
            <div className="md:col-span-1 space-y-4">
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
                <span className="text-[10px] font-bold text-slate-400 block tracking-wider uppercase font-mono">
                  Codebase Health Score
                </span>
                <div className="flex items-baseline gap-1">
                  <span className={`text-5xl font-black ${
                    score >= 90 ? "text-emerald-500" : score >= 70 ? "text-amber-500" : "text-red-500"
                  }`}>
                    {score}
                  </span>
                  <span className="text-slate-400 font-bold">/100</span>
                </div>

                <div className="w-full bg-slate-100 rounded-full h-2.5">
                  <div
                    className={`h-2.5 rounded-full transition-all duration-500 ${
                      score >= 90 ? "bg-emerald-500" : score >= 70 ? "bg-amber-500" : "bg-red-500"
                    }`}
                    style={{ width: `${score}%` }}
                  ></div>
                </div>

                <div className={`p-3 rounded-lg border text-[11px] font-bold text-center leading-relaxed ${verdict.color}`}>
                  {verdict.label}
                </div>

                {/* Counter Stats */}
                <div className="border-t border-slate-100 pt-4 space-y-2 text-xs">
                  <div className="flex justify-between items-center text-slate-600 font-medium">
                    <span>Errors:</span>
                    <span className="px-2 py-0.5 bg-red-100 text-red-700 font-bold rounded-full text-[10px]">
                      {issues.filter((i) => i.severity === "error").length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-slate-600 font-medium">
                    <span>Warnings:</span>
                    <span className="px-2 py-0.5 bg-amber-100 text-amber-700 font-bold rounded-full text-[10px]">
                      {issues.filter((i) => i.severity === "warning").length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-slate-600 font-medium">
                    <span>Best Practices:</span>
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-700 font-bold rounded-full text-[10px]">
                      {issues.filter((i) => i.severity === "info").length}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* CRITIQUE ISSUES LOGS */}
            <div className="md:col-span-2 space-y-4">
              <h3 className="text-xs font-bold text-slate-400 tracking-wider uppercase font-mono mb-2">
                Actionable Findings List
              </h3>

              <div className="space-y-3">
                {issues.map((issue) => (
                  <div
                    key={issue.id}
                    className="bg-white border border-slate-200 rounded-xl p-5 hover:border-slate-300 transition-all shadow-sm space-y-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        {issue.severity === "error" ? (
                          <AlertTriangle className="w-4 h-4 text-red-500" />
                        ) : issue.severity === "warning" ? (
                          <AlertTriangle className="w-4 h-4 text-amber-500" />
                        ) : (
                          <HelpCircle className="w-4 h-4 text-blue-500" />
                        )}
                        <h4 className="text-xs font-bold text-slate-800 leading-tight">{issue.title}</h4>
                      </div>
                      <div className="flex gap-1 text-[9px] font-bold">
                        <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono">
                          {issue.category.toUpperCase()}
                        </span>
                        <span className={`px-2 py-0.5 rounded uppercase ${
                          issue.severity === "error" ? "bg-red-50 text-red-600" : issue.severity === "warning" ? "bg-amber-50 text-amber-600" : "bg-blue-50 text-blue-600"
                        }`}>
                          {issue.severity}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">{issue.description}</p>

                    {/* Specific file lines info */}
                    {(issue.line || issue.snippet) && (
                      <div className="bg-slate-900 text-slate-300 rounded-lg p-3 font-mono text-[11px] border border-slate-800 overflow-x-auto space-y-1">
                        <div className="text-slate-500 flex justify-between select-none">
                          <span>{issue.id.startsWith("py") ? "python-static-audit" : "gemini-audit"}</span>
                          {issue.line && <span>Line {issue.line}</span>}
                        </div>
                        {issue.snippet && <code className="block text-slate-200">{issue.snippet}</code>}
                      </div>
                    )}

                    <div className="bg-emerald-50/50 rounded-lg p-3 border border-emerald-100/50 text-xs text-slate-700 flex gap-2">
                      <div className="shrink-0 mt-0.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      </div>
                      <div>
                        <strong className="text-emerald-800 font-bold block mb-0.5">Action Plan:</strong>
                        {issue.recommendation}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
