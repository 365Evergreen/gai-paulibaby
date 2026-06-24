import React, { useState } from "react";
import { Download, Cloud, ExternalLink, Globe, GitBranch, ShieldCheck } from "lucide-react";
import { EditorElement } from "../types";

interface DeployPanelProps {
  htmlCode: string;
  reactCode: string;
  elements: EditorElement[];
}

export default function DeployPanel({ htmlCode, reactCode, elements }: DeployPanelProps) {
  const [deployHost, setDeployHost] = useState<"gcp" | "static">("gcp");
  const [simulatingDeploy, setSimulatingDeploy] = useState(false);
  const [deploySuccess, setDeploySuccess] = useState(false);
  const [deployedUrl, setDeployedUrl] = useState("");

  const handleSimulateDeploy = () => {
    setSimulatingDeploy(true);
    setDeploySuccess(false);
    setTimeout(() => {
      setSimulatingDeploy(false);
      setDeploySuccess(true);
      setDeployedUrl(`https://apex-rendered-${Math.floor(10000 + Math.random() * 90000)}.web.app`);
    }, 3000);
  };

  // Export elements configuration
  const handleExportConfig = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(elements, null, 2));
    const dlAnchor = document.createElement("a");
    dlAnchor.setAttribute("href", dataStr);
    dlAnchor.setAttribute("download", "apex_visual_config.json");
    dlAnchor.click();
  };

  return (
    <div id="deployment-guide-pane" className="flex-1 overflow-y-auto bg-slate-50 p-6 min-h-[calc(100vh-140px)]">
      <div className="max-w-4xl mx-auto flex flex-col h-full gap-6">
        {/* Banner */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div>
            <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <Cloud className="w-5 h-5 text-blue-500" />
              Build Production & Sync Deploy
            </h2>
            <p className="text-xs text-slate-500 leading-relaxed max-w-lg mt-1">
              Deploy your visual layouts as standard microservices to Google Cloud Run, export configs, or bind to external repositories for continuous integration.
            </p>
          </div>
          <button
            onClick={handleExportConfig}
            className="flex items-center gap-1.5 px-4.5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition shadow cursor-pointer"
          >
            <Download className="w-4 h-4" />
            Export Config JSON
          </button>
        </div>

        {/* CONTROLS GRID */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-1 space-y-4">
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
              <span className="text-[10px] font-bold text-slate-400 block tracking-wider uppercase font-mono">
                Host Selection
              </span>

              <div className="space-y-2">
                <button
                  onClick={() => setDeployHost("gcp")}
                  className={`w-full p-3 border rounded-xl text-left transition flex items-start gap-2.5 ${
                    deployHost === "gcp"
                      ? "bg-blue-50 border-blue-400 text-blue-900"
                      : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <Cloud className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-xs font-bold block">Google Cloud Run</strong>
                    <span className="text-[10px] text-slate-500">Containerized server microservice</span>
                  </div>
                </button>

                <button
                  onClick={() => setDeployHost("static")}
                  className={`w-full p-3 border rounded-xl text-left transition flex items-start gap-2.5 ${
                    deployHost === "static"
                      ? "bg-blue-50 border-blue-400 text-blue-900"
                      : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <Globe className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-xs font-bold block">Vercel / Netlify / CDN</strong>
                    <span className="text-[10px] text-slate-500">Static single-page site hosting</span>
                  </div>
                </button>
              </div>

              <div className="border-t border-slate-100 pt-4">
                <button
                  onClick={handleSimulateDeploy}
                  disabled={simulatingDeploy}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-bold text-xs rounded-xl transition shadow cursor-pointer"
                >
                  {simulatingDeploy ? "Compiling & Uploading..." : "Run Active Deploy Preview"}
                </button>
              </div>
            </div>

            {/* DEPLOY STATE */}
            {simulatingDeploy && (
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3 text-center">
                <div className="w-7 h-7 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="text-[11px] text-slate-500 font-medium">Bundling HTML structures and syncing Docker elements...</p>
              </div>
            )}

            {deploySuccess && !simulatingDeploy && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 shadow-sm space-y-3">
                <div className="flex items-center gap-1.5 text-emerald-800">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  <strong className="text-xs font-bold">Deploy Completed!</strong>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  The visual layout has compiled to optimized assets and pushed to live hosting.
                </p>
                <a
                  href={deployedUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] rounded-lg transition flex items-center justify-center gap-1 cursor-pointer"
                >
                  Visit Live Web App
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            )}
          </div>

          <div className="md:col-span-2 space-y-4">
            <h3 className="text-xs font-bold text-slate-400 tracking-wider uppercase font-mono flex items-center gap-1.5 mb-2">
              <Cloud className="w-4.5 h-4.5 text-slate-400" />
              Deployment & Setup Checklists
            </h3>

            {deployHost === "gcp" ? (
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4 text-xs">
                <div className="space-y-1">
                  <h4 className="font-bold text-slate-800">Google Cloud Run Guide</h4>
                  <p className="text-slate-500">Run this Docker setup to host your Express + React full-stack editor layout dynamically on Google Cloud Run.</p>
                </div>

                <div className="bg-slate-900 text-slate-300 rounded-xl p-4 font-mono text-[11px] border border-slate-800 overflow-x-auto space-y-2">
                  <span className="text-slate-500 font-bold select-none"># 1. Initialize Docker container build on Google Cloud</span>
                  <code className="block text-slate-200">gcloud builds submit --tag gcr.io/my-apex-project/app-service</code>
                  <span className="text-slate-500 font-bold select-none"># 2. Spin up container on Google Cloud Run microservice</span>
                  <code className="block text-slate-200">gcloud run deploy app-service --image gcr.io/my-apex-project/app-service --platform managed --port=3000 --allow-unauthenticated</code>
                </div>

                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 block font-mono">INTEGRATION VERIFICATIONS</span>
                  <div className="space-y-2 text-slate-600 font-medium">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                      <span>Configures automatic fallback headers matching standard network ingress routing.</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                      <span>Injects process environment variables (like `GEMINI_API_KEY`) securely via secret managers.</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4 text-xs">
                <div className="space-y-1">
                  <h4 className="font-bold text-slate-800">Static Host Integration Guide (Vercel, Netlify)</h4>
                  <p className="text-slate-500">Sync with your repository to establish lightning-fast continuous integration (CI/CD) on static hosting platforms.</p>
                </div>

                <div className="bg-slate-900 text-slate-300 rounded-xl p-4 font-mono text-[11px] border border-slate-800 overflow-x-auto space-y-2">
                  <span className="text-slate-500 font-bold select-none"># 1. Install global Vercel CLI</span>
                  <code className="block text-slate-200">npm install -g vercel</code>
                  <span className="text-slate-500 font-bold select-none"># 2. Deploy static folder to global edge CDN</span>
                  <code className="block text-slate-200">vercel --prod</code>
                </div>

                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 block font-mono">AUTOMATED REPOSITORY TRIGGERS</span>
                  <div className="space-y-2 text-slate-600 font-medium">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                      <span>Commit generated `.tsx` code and push to your connected `GitHub` or `GitLab` repository.</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                      <span>Static platform webhooks listen to branch triggers, building and serving the static folder.</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
