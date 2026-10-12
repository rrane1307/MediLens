import React, { useState } from "react";
import {
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Edit3,
  ArrowRight,
  ShieldAlert,
  RotateCcw,
  Plus,
  Trash2
} from "lucide-react";
import { CanonicalMedicine, FieldStatusValue, MedicineIntelligenceCardData } from "../types.ts";

interface ConfirmViewProps {
  scanId: string;
  initialMedicine: CanonicalMedicine;
  onConfirmed: (cardData: MedicineIntelligenceCardData) => void;
  onRescan: () => void;
}

export const ConfirmView: React.FC<ConfirmViewProps> = ({
  scanId,
  initialMedicine,
  onConfirmed,
  onRescan,
}) => {
  const [formData, setFormData] = useState<CanonicalMedicine>({ ...initialMedicine });
  const [newIngredient, setNewIngredient] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const getStatusBadge = (field: string) => {
    const status: FieldStatusValue = formData.field_status?.[field] || "unavailable";
    if (status === "verified") {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
          <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Verified
        </span>
      );
    }
    if (status === "uncertain") {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-800">
          <AlertTriangle className="w-3 h-3 text-amber-600" /> Uncertain — Review
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
        <HelpCircle className="w-3 h-3 text-slate-400" /> Not Detected
      </span>
    );
  };

  const handleFieldChange = (field: keyof CanonicalMedicine, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
      field_status: {
        ...prev.field_status,
        [field]: "verified", // User edit marks field as verified
      },
    }));
  };

  const handleAddIngredient = () => {
    if (!newIngredient.trim()) return;
    const updated = [...formData.active_ingredients, newIngredient.trim()];
    handleFieldChange("active_ingredients", updated);
    setNewIngredient("");
  };

  const handleRemoveIngredient = (index: number) => {
    const updated = formData.active_ingredients.filter((_, i) => i !== index);
    handleFieldChange("active_ingredients", updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/scan/${encodeURIComponent(scanId)}/confirm`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ medicine: formData }),
      });

      if (!response.ok) {
        throw new Error("Confirmation failed on server");
      }

      const data = await response.json();
      setIsSubmitting(false);
      onConfirmed(data.card_data);
    } catch (err: any) {
      setIsSubmitting(false);
      alert(`Error confirming medicine: ${err.message}`);
    }
  };

  const hasUncertainIdentity =
    !formData.active_ingredients ||
    formData.active_ingredients.length === 0 ||
    formData.field_status?.active_ingredients === "uncertain";

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Step Header */}
      <div className="mb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold mb-2">
          <Edit3 className="w-3.5 h-3.5 text-amber-600" />
          Step 2: Review &amp; Confirm Identity
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Verify Extracted Medicine Facts
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Review extracted fields below. MediLens never silently guesses ambiguous text; your confirmation establishes the verified baseline for clinical reference lookups and interaction checks.
        </p>
      </div>

      {hasUncertainIdentity && (
        <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-950 flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs">
            <p className="font-bold text-sm">Active Ingredient Confirmation Required</p>
            <p className="mt-0.5 leading-relaxed">
              MediLens safety protocols require confirming the <strong>Active Ingredient</strong> before running downstream checks. Please check that the active ingredient below matches your physical label.
            </p>
          </div>
        </div>
      )}

      {/* Form Card */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        {/* Brand Name */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Brand / Commercial Name
            </label>
            {getStatusBadge("brand_name")}
          </div>
          <input
            type="text"
            value={formData.brand_name || ""}
            onChange={(e) => handleFieldChange("brand_name", e.target.value)}
            placeholder="e.g. Tylenol Extra Strength, Advil, Coumadin"
            className="w-full text-sm font-semibold text-slate-900 px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
          />
        </div>

        {/* Active Ingredients (Critical) */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              Active Ingredients <span className="text-rose-600">*</span>
            </label>
            {getStatusBadge("active_ingredients")}
          </div>

          <div className="space-y-2">
            <div className="flex flex-wrap gap-2">
              {formData.active_ingredients?.map((ing, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-50 text-teal-900 border border-teal-200 text-xs font-bold"
                >
                  {ing}
                  <button
                    type="button"
                    onClick={() => handleRemoveIngredient(idx)}
                    className="text-teal-600 hover:text-rose-600"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={newIngredient}
                onChange={(e) => setNewIngredient(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleAddIngredient(); } }}
                placeholder="Add ingredient (e.g. Acetaminophen, Ibuprofen, Warfarin)..."
                className="flex-1 text-xs px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              />
              <button
                type="button"
                onClick={handleAddIngredient}
                className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add
              </button>
            </div>
          </div>
        </div>

        {/* Strength & Dosage Form Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Strength / Concentration
              </label>
              {getStatusBadge("strength")}
            </div>
            <input
              type="text"
              value={formData.strength || ""}
              onChange={(e) => handleFieldChange("strength", e.target.value)}
              placeholder="e.g. 500 mg, 200 mg, 10 mg/mL"
              className="w-full text-xs font-semibold px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Dosage Form
              </label>
              {getStatusBadge("dosage_form")}
            </div>
            <input
              type="text"
              value={formData.dosage_form || ""}
              onChange={(e) => handleFieldChange("dosage_form", e.target.value)}
              placeholder="e.g. Caplet, Tablet, Liqui-Gel, Oral Solution"
              className="w-full text-xs font-semibold px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
            />
          </div>
        </div>

        {/* Expiry Date & Route */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Route of Administration
              </label>
              {getStatusBadge("route")}
            </div>
            <input
              type="text"
              value={formData.route || "Oral"}
              onChange={(e) => handleFieldChange("route", e.target.value)}
              placeholder="e.g. Oral, Topical, Inhalation"
              className="w-full text-xs font-semibold px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Expiration / Lot
              </label>
              {getStatusBadge("expiry")}
            </div>
            <input
              type="text"
              value={formData.expiry || ""}
              onChange={(e) => handleFieldChange("expiry", e.target.value)}
              placeholder="e.g. 11/2027, EXP 09/26"
              className="w-full text-xs font-semibold px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={onRescan}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100 flex items-center justify-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Rescan Label
          </button>

          <button
            type="submit"
            disabled={isSubmitting || (formData.active_ingredients?.length === 0 && !formData.brand_name)}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-teal-600/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Running Safety Verification..." : "Confirm & Run Safety Analysis"}
            {!isSubmitting && <ArrowRight className="w-4 h-4" />}
          </button>
        </div>
      </form>
    </div>
  );
};
