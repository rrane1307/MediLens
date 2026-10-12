import React, { useEffect, useState } from "react";
import { X, Cpu, ShieldCheck, Database, Wrench, GitFork, Check, ArrowRight } from "lucide-react";
import { AllowlistedTool } from "../types.ts";

interface ArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ArchitectureModal: React.FC<ArchitectureModalProps> = ({ isOpen, onClose }) => {
  const [tools, setTools] = useState<AllowlistedTool[]>([]);
  const [activeTab, setActiveTab] = useState<"flow" | "tools" | "safety">("flow");

  useEffect(() => {
    if (isOpen) {
      fetch("/api/tools")
        .then((res) => res.json())
        .then((data) => {
          if (data.tools) setTools(data.tools);
        })
        .catch(console.error);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-teal-900 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-teal-500/20 text-teal-300">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Canonical MediLens Architecture</h2>
              <p className="text-xs text-teal-200">Agentic Label Intelligence: FunctionGemma + Controlled Tools + Gemma</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 pt-3 gap-6 text-sm font-semibold">
          <button
            onClick={() => setActiveTab("flow")}
            className={`pb-3 border-b-2 transition-colors ${
              activeTab === "flow" ? "border-teal-600 text-teal-700" : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            Agentic Pipeline
          </button>
          <button
            onClick={() => setActiveTab("tools")}
            className={`pb-3 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === "tools" ? "border-teal-600 text-teal-700" : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            Allowlisted Tools ({tools.length})
          </button>
          <button
            onClick={() => setActiveTab("safety")}
            className={`pb-3 border-b-2 transition-colors ${
              activeTab === "safety" ? "border-teal-600 text-teal-700" : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            Safety Boundary Gates
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[70vh] overflow-y-auto space-y-6 text-slate-800">
          {activeTab === "flow" && (
            <div className="space-y-4">
              <p className="text-xs text-slate-600 leading-relaxed">
                As defined in the PRD, MediLens replaces unrestricted LLM generation with an <strong>agentic tool-use pipeline</strong>.
                Raw medical text is extracted and confirmed, routed through strictly deterministic reference tools, and only then synthesized by Gemma into plain language.
              </p>

              {/* Diagram */}
              <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 font-mono text-xs space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg bg-white border border-slate-200 shadow-xs">
                  <span className="font-bold text-slate-700">1. User Label Scan</span>
                  <span className="text-[11px] text-slate-500">Camera / High-res Package Image</span>
                </div>
                <div className="flex justify-center text-teal-600">↓</div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-teal-50 border border-teal-200 shadow-xs">
                  <div>
                    <span className="font-bold text-teal-900">2. OCR + Gemma Structured Extraction</span>
                    <p className="text-[10px] text-teal-700 mt-0.5">Extracts canonical fields, tags verified vs uncertain</p>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-teal-200/60 text-teal-800 font-bold text-[10px]">P0 Contract</span>
                </div>
                <div className="flex justify-center text-teal-600">↓</div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-amber-50 border border-amber-200 shadow-xs">
                  <div>
                    <span className="font-bold text-amber-900">3. User Confirmation Gate</span>
                    <p className="text-[10px] text-amber-700 mt-0.5">User confirms or edits active ingredient &amp; strength before downstream checks</p>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-amber-200/60 text-amber-800 font-bold text-[10px]">Safety Barrier</span>
                </div>
                <div className="flex justify-center text-teal-600">↓</div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-indigo-50 border border-indigo-200 shadow-xs">
                  <div>
                    <span className="font-bold text-indigo-900">4. FunctionGemma Tool Router</span>
                    <p className="text-[10px] text-indigo-700 mt-0.5">Routes to allowlisted tools: Lookup, Warnings, Overlap, Evidence</p>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-indigo-200/60 text-indigo-800 font-bold text-[10px]">Deterministic</span>
                </div>
                <div className="flex justify-center text-teal-600">↓</div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-emerald-50 border border-emerald-200 shadow-xs">
                  <div>
                    <span className="font-bold text-emerald-900">5. Gemma Grounded Synthesizer</span>
                    <p className="text-[10px] text-emerald-700 mt-0.5">Generates plain-language explanation strictly bound to verified context</p>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-200/60 text-emerald-800 font-bold text-[10px]">Zero Hallucination</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === "tools" && (
            <div className="space-y-4">
              <p className="text-xs text-slate-600">
                The FunctionGemma router has access strictly to these 7 predefined tools. Arbitrary code execution and untracked database mutations are prevented by design.
              </p>

              <div className="space-y-3">
                {tools.map((tool) => (
                  <div key={tool.name} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Wrench className="w-4 h-4 text-teal-600" />
                        <code className="text-xs font-bold text-teal-800">{tool.name}</code>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                        Invocations: {tool.invocation_count || 0}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1.5">{tool.description}</p>
                    <div className="mt-2 flex flex-wrap gap-2 text-[10px] font-mono text-slate-500">
                      <span><strong>Input:</strong> {tool.input_schema}</span>
                      <span>•</span>
                      <span><strong>Output:</strong> {tool.output_schema}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "safety" && (
            <div className="space-y-4 text-xs text-slate-700">
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
                <h4 className="font-bold text-amber-900 flex items-center gap-1.5 mb-2">
                  <ShieldCheck className="w-4 h-4 text-amber-600" />
                  PRD Section 8: Safety Invariants
                </h4>
                <ul className="space-y-1.5 text-amber-900/90 pl-4 list-disc">
                  <li><strong>No Diagnosis or Prescribing:</strong> MediLens never suggests a diagnosis or instructs dosage changes.</li>
                  <li><strong>Uncertainty Halts Downstream Checks:</strong> If active ingredients are uncertain or absent, reference lookups pause until the user confirms.</li>
                  <li><strong>Never Claim Universal Safety:</strong> The UI always distinguishes <em>"No interaction found in configured reference"</em> from asserting that a drug combination is absolutely safe.</li>
                  <li><strong>Non-Color Severity Signifiers:</strong> Severity ratings use explicit badges, icons, and text labels (not color alone) to maintain accessibility.</li>
                  <li><strong>Auditable Evidence Chains:</strong> Every safety claim is backed by a deterministic rule and official monograph citation (FDA DailyMed, OpenFDA).</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <span>Model: Gemma 4 Architecture • Engine: Google GenAI</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 text-white font-medium hover:bg-slate-900 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
