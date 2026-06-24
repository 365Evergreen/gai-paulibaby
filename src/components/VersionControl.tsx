import React, { useState } from "react";
import { Revision, EditorElement } from "../types";
import { GitBranch, Save, History, RotateCcw, CheckCircle, Tag, User } from "lucide-react";

interface VersionControlProps {
  elements: EditorElement[];
  revisions: Revision[];
  onAddRevision: (name: string) => void;
  onRollback: (elements: EditorElement[]) => void;
}

export default function VersionControl({
  elements,
  revisions,
  onAddRevision,
  onRollback,
}: VersionControlProps) {
  const [commitMessage, setCommitMessage] = useState("");
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleCommit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commitMessage.trim()) return;

    onAddRevision(commitMessage.trim());
    setCommitMessage("");
    setSuccessMsg("Revision saved successfully!");
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  const handleRollback = (rev: Revision) => {
    onRollback(rev.elements);
    alert(`Visual canvas rolled back to checkpoint: "${rev.name}"`);
  };

  return (
    <div id="version-control-pane" className="flex-1 overflow-y-auto bg-slate-50 p-6 min-h-[calc(100vh-140px)]">
      <div className="max-w-4xl mx-auto flex flex-col h-full gap-6">
        {/* Branch Header Banner */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div>
            <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <GitBranch className="w-5 h-5 text-blue-600" />
              Design Revisions & Version Control
            </h2>
            <p className="text-xs text-slate-500 leading-relaxed max-w-lg mt-1">
              Save snapshots of your visual canvas to prevent effort loss. Revert or roll back to any previous checkpoint in a single click.
            </p>
          </div>
          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 gap-1 text-xs font-semibold shrink-0 font-mono select-none text-slate-600">
            <span className="px-3 py-1 rounded-lg">branch: main</span>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* COMMIT FORM */}
          <div className="md:col-span-1">
            <form onSubmit={handleCommit} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
              <span className="text-[10px] font-bold text-slate-400 block tracking-wider uppercase font-mono">
                Create Visual Commit
              </span>

              <div>
                <label className="text-[10px] font-bold text-slate-500 block mb-1 uppercase font-mono">Snapshot Message</label>
                <textarea
                  value={commitMessage}
                  onChange={(e) => setCommitMessage(e.target.value)}
                  placeholder="e.g. Added responsive cards to feature segment"
                  className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
                  rows={3}
                  required
                />
              </div>

              {successMsg && (
                <div className="flex items-center gap-1.5 p-2 bg-emerald-50 text-emerald-700 text-[11px] font-semibold rounded-lg border border-emerald-100 animate-fade-in">
                  <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition flex justify-center items-center gap-1.5 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                Commit Snapshot
              </button>
            </form>
          </div>

          {/* HISTORIC TIMELINE */}
          <div className="md:col-span-2 space-y-4">
            <h3 className="text-xs font-bold text-slate-400 tracking-wider uppercase font-mono flex items-center gap-1.5 mb-2">
              <History className="w-4.5 h-4.5 text-slate-400" />
              Commit Timeline History
            </h3>

            {revisions.length === 0 ? (
              <div className="text-center py-16 bg-white border border-slate-200 rounded-2xl shadow-sm text-slate-400">
                <p className="text-xs font-semibold text-slate-500">No revisions logged</p>
                <p className="text-[10px] max-w-xs mx-auto leading-relaxed mt-1">
                  Commit your current design state above to start building a revision timeline.
                </p>
              </div>
            ) : (
              <div className="space-y-4 relative before:absolute before:left-5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                {revisions.map((rev, index) => (
                  <div key={rev.id} className="relative pl-10">
                    {/* Circle Node indicator */}
                    <div className="absolute left-3.5 top-1 h-3.5 w-3.5 rounded-full border-2 border-white bg-blue-500 shadow-sm ring-2 ring-blue-100"></div>

                    {/* Timeline Card */}
                    <div className="bg-white border border-slate-200 rounded-xl p-4.5 hover:shadow-sm transition flex justify-between items-start gap-4">
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xs font-bold text-slate-800 leading-tight">{rev.name}</span>
                          <span className="text-[10px] bg-slate-100 text-slate-500 font-mono px-1.5 py-0.5 rounded font-bold">
                            {rev.id}
                          </span>
                        </div>

                        {/* Metadata row */}
                        <div className="flex flex-wrap gap-3 text-[10px] text-slate-400 font-medium font-sans">
                          <span className="flex items-center gap-1">
                            <User className="w-3.5 h-3.5" />
                            {rev.author}
                          </span>
                          <span>•</span>
                          <span>{rev.timestamp}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1 text-slate-500 font-bold">
                            <Tag className="w-3.5 h-3.5" />
                            {rev.elements.length} components
                          </span>
                        </div>
                      </div>

                      {/* Rollback Trigger Button */}
                      <button
                        onClick={() => handleRollback(rev)}
                        className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg border border-blue-200 transition cursor-pointer"
                        title="Rollback canvas to this checkpoint"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Restore</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
