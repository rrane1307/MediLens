import React, { useEffect, useState } from "react";
import { X, ExternalLink, ShieldAlert, CheckCircle2, Info, ArrowRight, Layers, FileText } from "lucide-react";
import { EvidenceObject } from "../types.ts";

interface EvidenceDrawerProps {
  evidenceId: string | null;
  onClose: () => void;
}

export const EvidenceDrawer: React.FC<EvidenceDrawerProps> = ({ evidenceId, onClose }) => {
  const [evidence, setEvidence] = useState<EvidenceObject | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!evidenceId) {
      setEvidence(null);
      return;
    }

    setLoading(true);
    setError(null);

    fetch(`/api/evidence/${encodeURIComponent(evidenceId)}`)
      .then((res) => {
        if (!res.ok) throw new Error("Evidence record not found in session store");
        return res.json();
      })
      .then((data) => {
        setEvidence(data.evidence);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [evidenceId]);

  if (!evidenceId) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-xs flex justify-end transition-opacity">
      <div className="w-full max-w-xl bg-white h-full shadow-2xl flex flex-col overflow-y-auto animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50 sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-teal-50 text-teal-700">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Evidence & Provenance Chain</h2>
              <p className="text-xs text-slate-500">Why MediLens reached this clinical conclusion</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
            aria-label="Close evidence panel"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 flex-1">
          {loading && (
            <div className="py-20 text-center">
              <div className="inline-block w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-3 text-sm text-slate-500 font-medium">Assembling verified provenance trace...</p>
            </div>
          )}

          {error && (
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900">
              <p className="font-semibold text-sm">Evidence Notice</p>
              <p className="text-xs mt-1 text-amber-800">{error}</p>
            </div>
          )}

          {evidence && (
            <>
              {/* Claim Card */}
              <div className="p-4 rounded-xl bg-teal-50/70 border border-teal-200">
                <span className="text-[11px] font-bold uppercase tracking-wider text-teal-800">Evaluated Finding</span>
                <p className="text-sm font-semibold text-slate-900 mt-1">{evidence.claim}</p>
              </div>

              {/* Step-by-Step Evidence Flow (Detected Label -> Reference -> Rule -> Explanation) */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                  Canonical Evidence Chain
                </h3>
                <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                  {/* Step 1: Detected Label Input */}
                  <div className="relative">
                    <div className="absolute -left-[27px] top-0 w-6 h-6 rounded-full bg-blue-100 border-2 border-blue-600 flex items-center justify-center text-blue-700 text-[10px] font-bold">
                      1
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-800">Detected Label Input</p>
                      <p className="text-xs text-slate-600 mt-0.5 bg-slate-50 p-2.5 rounded-lg border border-slate-200 font-mono">
                        {evidence.detected_input || "Raw package optical character recognition"}
                      </p>
                    </div>
                  </div>

                  {/* Step 2: Reference Dataset Grounding */}
                  <div className="relative">
                    <div className="absolute -left-[27px] top-0 w-6 h-6 rounded-full bg-teal-100 border-2 border-teal-600 flex items-center justify-center text-teal-700 text-[10px] font-bold">
                      2
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <p className="text-xs font-semibold text-slate-800">Configured Reference Source</p>
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                          <CheckCircle2 className="w-3 h-3" /> Grounded
                        </span>
                      </div>
                      <p className="text-xs font-medium text-slate-900 mt-0.5">{evidence.source}</p>
                      {evidence.source_section && (
                        <p className="text-[11px] text-slate-500 mt-0.5">Section: {evidence.source_section}</p>
                      )}
                    </div>
                  </div>

                  {/* Step 3: Deterministic Rule / Reason */}
                  <div className="relative">
                    <div className="absolute -left-[27px] top-0 w-6 h-6 rounded-full bg-amber-100 border-2 border-amber-600 flex items-center justify-center text-amber-800 text-[10px] font-bold">
                      3
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-800">Clinical Mechanism &amp; Rule</p>
                      <p className="text-xs text-slate-700 mt-0.5 leading-relaxed bg-amber-50/50 p-2.5 rounded-lg border border-amber-200/60">
                        {evidence.reason}
                      </p>
                    </div>
                  </div>

                  {/* Step 4: Tool Invoked */}
                  {evidence.tool_invoked && (
                    <div className="relative">
                      <div className="absolute -left-[27px] top-0 w-6 h-6 rounded-full bg-indigo-100 border-2 border-indigo-600 flex items-center justify-center text-indigo-700 text-[10px] font-bold">
                        4
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-800">Allowlisted Tool Execution</p>
                        <p className="text-xs font-mono text-indigo-700 mt-0.5">
                          FunctionGemma: <span className="font-semibold">{evidence.tool_invoked}()</span>
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Pipeline Step Traces */}
              {evidence.pipeline_trace && evidence.pipeline_trace.length > 0 && (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-slate-500" />
                    Agent Execution Telemetry
                  </h4>
                  <div className="space-y-2">
                    {evidence.pipeline_trace.map((tr, i) => (
                      <div key={i} className="flex items-start justify-between text-xs py-1 border-b border-slate-200/60 last:border-0">
                        <span className="font-semibold text-slate-700">{tr.step}</span>
                        <span className="text-slate-600 text-right">{tr.description}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Limitations & Boundaries */}
              {evidence.limitations && evidence.limitations.length > 0 && (
                <div className="p-4 rounded-xl bg-slate-100/80 border border-slate-200 text-xs text-slate-600">
                  <p className="font-bold text-slate-800 mb-1.5 flex items-center gap-1">
                    <Info className="w-3.5 h-3.5 text-slate-500" />
                    Documented Constraints &amp; Uncertainty Boundaries:
                  </p>
                  <ul className="list-disc pl-4 space-y-1">
                    {evidence.limitations.map((lim, i) => (
                      <li key={i}>{lim}</li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <span>MediLens Evidence Auditor v1.0</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 font-semibold text-slate-800 transition-colors"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
