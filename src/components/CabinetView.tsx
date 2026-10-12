import React, { useState, useEffect } from "react";
import {
  Archive,
  AlertTriangle,
  ShieldAlert,
  Info,
  CheckCircle2,
  Trash2,
  Plus,
  ArrowRight,
  Layers,
  Sparkles,
  RefreshCw,
  ExternalLink,
  Pill,
  Camera
} from "lucide-react";
import { CanonicalMedicine, SafetyResult, SamplePackage } from "../types.ts";

interface CabinetViewProps {
  cabinet: CanonicalMedicine[];
  onRemoveFromCabinet: (id: string) => void;
  onScanNew: () => void;
  onOpenEvidence: (evidenceId: string) => void;
  onSelectMedicineForDetails: (med: CanonicalMedicine) => void;
  onAddSampleDirectly: (sampleId: string) => void;
}

export const CabinetView: React.FC<CabinetViewProps> = ({
  cabinet,
  onRemoveFromCabinet,
  onScanNew,
  onOpenEvidence,
  onSelectMedicineForDetails,
  onAddSampleDirectly,
}) => {
  const [interactions, setInteractions] = useState<SafetyResult[]>([]);
  const [loadingChecks, setLoadingChecks] = useState<boolean>(false);
  const [samples, setSamples] = useState<SamplePackage[]>([]);

  useEffect(() => {
    fetch("/api/sample-packages")
      .then((res) => res.json())
      .then((data) => {
        if (data.samples) setSamples(data.samples);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (cabinet.length >= 1) {
      runInteractionChecks();
    } else {
      setInteractions([]);
    }
  }, [cabinet]);

  const runInteractionChecks = async () => {
    setLoadingChecks(true);
    try {
      const res = await fetch("/api/session/check-interactions", { method: "POST" });
      const data = await res.json();
      if (data.results) {
        setInteractions(data.results);
      }
      setLoadingChecks(false);
    } catch (err) {
      console.error(err);
      setLoadingChecks(false);
    }
  };

  const getSeverityBadge = (res: SafetyResult) => {
    if (res.severity === "critical") {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-extrabold uppercase tracking-wide bg-rose-100 text-rose-900 border border-rose-300">
          <ShieldAlert className="w-3.5 h-3.5 text-rose-700" />
          [CRITICAL SAFETY INTERACTION]
        </span>
      );
    }
    if (res.severity === "high") {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-extrabold uppercase tracking-wide bg-amber-100 text-amber-900 border border-amber-300">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
          [HIGH RISK OVERLAP / INTERACTION]
        </span>
      );
    }
    if (res.status === "not_found") {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wide bg-slate-100 text-slate-800 border border-slate-300">
          <Info className="w-3.5 h-3.5 text-slate-600" />
          [NO INTERACTION FOUND IN REFERENCE]
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wide bg-blue-100 text-blue-900 border border-blue-300">
        <Info className="w-3.5 h-3.5 text-blue-700" />
        [ADVISORY GUIDELINE]
      </span>
    );
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-semibold mb-2">
            <Archive className="w-3.5 h-3.5 text-teal-600" />
            Session Medication Cabinet
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Active Medications &amp; Multi-Medicine Safety
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            FunctionGemma automatically evaluates pairwise interactions, duplicate active ingredients, and class toxicities across all confirmed medications.
          </p>
        </div>

        <button
          onClick={onScanNew}
          className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-teal-600/20"
        >
          <Camera className="w-4 h-4" /> Scan Another Medicine
        </button>
      </div>

      {/* Main Grid: Cabinet List vs Interaction Results */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Cabinet Inventory (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
              <Pill className="w-4 h-4 text-teal-600" />
              Cabinet Items ({cabinet.length})
            </h2>
          </div>

          {cabinet.length === 0 ? (
            <div className="p-8 rounded-3xl border-2 border-dashed border-slate-300 text-center bg-slate-50">
              <Archive className="w-10 h-10 text-slate-400 mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-700">Cabinet is currently empty</p>
              <p className="text-xs text-slate-500 mt-1">
                Scan your medicine labels or pick from the sample packages below to evaluate combinations.
              </p>
              <button
                onClick={onScanNew}
                className="mt-4 px-4 py-2 rounded-xl bg-teal-600 text-white text-xs font-bold hover:bg-teal-700"
              >
                Scan First Medicine
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {cabinet.map((med) => (
                <div
                  key={med.id}
                  className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-teal-500/40 shadow-2xs transition-all flex items-start justify-between gap-3 group"
                >
                  <div
                    onClick={() => onSelectMedicineForDetails(med)}
                    className="cursor-pointer flex-1"
                  >
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-teal-50 text-teal-800">
                      {med.dosage_form || "Medication"}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 mt-1 group-hover:text-teal-700 transition-colors">
                      {med.brand_name || med.generic_name}
                    </h3>
                    <p className="text-xs text-slate-600">
                      Active: <span className="font-semibold">{med.active_ingredients?.join(", ") || "Unknown"}</span>
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5 font-mono">
                      Strength: {med.strength || "Standard"} • Route: {med.route || "Oral"}
                    </p>
                  </div>

                  <button
                    onClick={() => onRemoveFromCabinet(med.id)}
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    title="Remove from cabinet"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Quick-Add Demo Pairs Box */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Quick Test: Pairwise Clinical Cases
            </h3>
            <p className="text-xs text-slate-500 mb-3">
              Test known interaction and duplicate-ingredient cases from the PRD evaluation dataset:
            </p>
            <div className="space-y-2">
              <button
                onClick={() => onAddSampleDirectly("sample-tylenol-500")}
                className="w-full text-left p-2.5 rounded-xl border border-slate-200 bg-white hover:border-teal-500 text-xs font-semibold text-slate-800 flex items-center justify-between"
              >
                <span>+ Add <strong>Tylenol 500mg</strong> (Acetaminophen)</span>
                <span className="text-teal-600 font-bold text-[11px]">+ Add</span>
              </button>

              <button
                onClick={() => onAddSampleDirectly("sample-nyquil-cold")}
                className="w-full text-left p-2.5 rounded-xl border border-slate-200 bg-white hover:border-teal-500 text-xs font-semibold text-slate-800 flex items-center justify-between"
              >
                <span>+ Add <strong>NyQuil Cold &amp; Flu</strong> (Duplicate APAP Test)</span>
                <span className="text-teal-600 font-bold text-[11px]">+ Add</span>
              </button>

              <button
                onClick={() => onAddSampleDirectly("sample-advil-200")}
                className="w-full text-left p-2.5 rounded-xl border border-slate-200 bg-white hover:border-teal-500 text-xs font-semibold text-slate-800 flex items-center justify-between"
              >
                <span>+ Add <strong>Advil 200mg</strong> (Ibuprofen NSAID)</span>
                <span className="text-teal-600 font-bold text-[11px]">+ Add</span>
              </button>

              <button
                onClick={() => onAddSampleDirectly("sample-warfarin-5")}
                className="w-full text-left p-2.5 rounded-xl border border-slate-200 bg-white hover:border-teal-500 text-xs font-semibold text-slate-800 flex items-center justify-between"
              >
                <span>+ Add <strong>Warfarin 5mg</strong> (Coumadin Bleeding Test)</span>
                <span className="text-teal-600 font-bold text-[11px]">+ Add</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Multi-Medicine Safety & Interaction Matrix (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-600" />
              Safety &amp; Interaction Analysis
            </h2>
            <button
              onClick={runInteractionChecks}
              disabled={loadingChecks || cabinet.length < 2}
              className="text-xs font-semibold text-teal-700 hover:text-teal-900 flex items-center gap-1 disabled:opacity-40"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loadingChecks ? "animate-spin" : ""}`} />
              Re-run Checks
            </button>
          </div>

          {cabinet.length < 2 ? (
            <div className="p-8 rounded-3xl bg-white border border-slate-200 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mx-auto">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Add a Second Medicine to Check Interactions</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                MediLens checks drug-drug interactions, duplicate active ingredients (such as taking Tylenol and NyQuil together), and cumulative class toxicities when 2 or more medicines are in your cabinet.
              </p>
              <button
                onClick={onScanNew}
                className="mt-2 px-5 py-2.5 rounded-xl bg-teal-600 text-white font-bold text-xs sm:text-sm hover:bg-teal-700"
              >
                Scan or Add Second Medicine
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {interactions.length === 0 ? (
                <div className="p-6 rounded-3xl bg-white border border-slate-200 text-slate-600 text-xs">
                  No interactions evaluated yet. Click "Re-run Checks".
                </div>
              ) : (
                interactions.map((res) => (
                  <div
                    key={res.id}
                    className={`p-5 rounded-3xl border transition-all ${
                      res.severity === "critical"
                        ? "bg-rose-50/50 border-rose-300"
                        : res.severity === "high"
                        ? "bg-amber-50/50 border-amber-300"
                        : "bg-white border-slate-200"
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                      {getSeverityBadge(res)}
                      <span className="text-[10px] font-mono text-slate-500 uppercase">
                        Type: {res.type}
                      </span>
                    </div>

                    <h3 className="text-sm sm:text-base font-extrabold text-slate-900 leading-snug">
                      {res.claim}
                    </h3>

                    <p className="text-xs text-slate-700 mt-2 leading-relaxed">
                      {res.evidence}
                    </p>

                    {res.action_guidance && (
                      <div className="mt-3 p-3 rounded-xl bg-white/90 border border-slate-200/80 text-xs font-semibold text-slate-800">
                        <span className="text-teal-800 font-bold block mb-0.5">Clinical Guidance:</span>
                        {res.action_guidance}
                      </div>
                    )}

                    <div className="mt-4 pt-3 border-t border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-slate-500">
                      <span>Source: {res.source}</span>
                      {res.evidence_id && (
                        <button
                          onClick={() => onOpenEvidence(res.evidence_id!)}
                          className="px-3 py-1 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-800 font-bold self-start sm:self-center flex items-center gap-1"
                        >
                          <Layers className="w-3.5 h-3.5" /> Why? Inspect Evidence
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}

              {/* Crucial PRD Boundary Notice (Section 2.2 #17 & Section 8) */}
              <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200 text-xs text-slate-600 space-y-1">
                <p className="font-bold text-slate-800 flex items-center gap-1.5">
                  <Info className="w-4 h-4 text-slate-500" />
                  Medical Safety Boundary:
                </p>
                <p className="text-[11px] leading-relaxed">
                  In compliance with PRD safety specifications, MediLens distinguishes <em>"No interaction found in configured reference"</em> from asserting that a combination is universal or absolute safe. Always discuss all concurrent prescription and OTC medications with a physician or pharmacist.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
