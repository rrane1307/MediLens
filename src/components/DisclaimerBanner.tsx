import React, { useState } from "react";
import { AlertTriangle, ChevronDown, ChevronUp, ShieldCheck } from "lucide-react";

export const DisclaimerBanner: React.FC = () => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-amber-500/10 border-b border-amber-500/20 text-amber-900 text-xs sm:text-sm px-4 py-2.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="p-1 rounded-full bg-amber-500/20 text-amber-700 shrink-0">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <p className="truncate sm:whitespace-normal font-medium text-amber-950">
            <span className="font-semibold">Safety Boundary:</span> MediLens is an information and safety-awareness product — not a diagnostic, prescribing, or medication-change system.
          </p>
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-amber-800 hover:text-amber-950 font-semibold text-xs flex items-center gap-1 shrink-0 px-2 py-1 rounded bg-amber-500/10 hover:bg-amber-500/20 transition-colors"
        >
          {expanded ? "Hide Details" : "Clinical Rules"}
          {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {expanded && (
        <div className="max-w-7xl mx-auto mt-2 pt-2 border-t border-amber-500/20 grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs text-amber-900">
          <div className="flex items-start gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span><strong>No Prescriptions:</strong> MediLens never instructs you to start, stop, or adjust prescription doses.</span>
          </div>
          <div className="flex items-start gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span><strong>Evidence Grounded:</strong> All safety claims cite configured monographs (FDA DailyMed, OpenFDA).</span>
          </div>
          <div className="flex items-start gap-1.5">
            <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span><strong>Emergency Care:</strong> For severe reactions, difficulty breathing, or acute poisoning, immediately call 911.</span>
          </div>
        </div>
      )}
    </div>
  );
};
