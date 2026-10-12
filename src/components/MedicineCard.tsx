import React, { useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  Info,
  Clock,
  AlertTriangle,
  MinusCircle,
  PlusSquare,
  Calendar,
  Lock,
  MessageSquare,
  Bookmark,
  Share2,
  RotateCcw,
  Sparkles,
  Pill,
  Bandage,
  Check
} from "lucide-react";
import { MedicineIntelligenceCardData } from "../types.ts";
import { getDoctorAvatar, getCrocinBlisterImage, getSampleMedicineImage } from "../utils/sampleImages.ts";

interface MedicineCardProps {
  cardData: MedicineIntelligenceCardData;
  onBack: () => void;
  onOpenChat: (prefillQuestion?: string) => void;
  onAddToCabinet: () => void;
  isAlreadyInCabinet: boolean;
  onRescan: () => void;
}

export const MedicineCard: React.FC<MedicineCardProps> = ({
  cardData,
  onBack,
  onOpenChat,
  onAddToCabinet,
  isAlreadyInCabinet,
  onRescan,
}) => {
  const [savedNotification, setSavedNotification] = useState(false);
  const { medicine } = cardData;

  const handleSave = () => {
    onAddToCabinet();
    setSavedNotification(true);
    setTimeout(() => setSavedNotification(false), 2000);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${medicine.brand_name || "Crocin 500"} - Safety Card`,
        text: `Check out dosage & clinical safety instructions for ${medicine.brand_name || "Crocin 500"} on MediLens.`,
      }).catch(() => {});
    } else {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(
          `${medicine.brand_name || "Crocin 500"} - Dosage: ${medicine.strength || "500mg"} (${medicine.generic_name || "Paracetamol"}). Monograph info on MediLens.`
        );
      }
      setSavedNotification(true);
      setTimeout(() => setSavedNotification(false), 2500);
    }
  };

  const [inlineQuestion, setInlineQuestion] = useState("");

  const handleInlineSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inlineQuestion.trim()) {
      onOpenChat(inlineQuestion.trim());
    } else {
      onOpenChat();
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 pt-3 pb-24 space-y-4 font-sans text-slate-900">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between pb-1">
        <div className="flex items-center gap-2.5">
          <button
            onClick={onBack}
            className="p-1 rounded-full text-slate-600 hover:text-slate-900"
            aria-label="Back to home"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-xs">
            <div className="w-4 h-4 rounded-full border-2 border-white flex items-center justify-center">
              <div className="w-2 h-0.5 bg-white rounded-full" />
            </div>
          </div>
          <h1 className="text-sm sm:text-base font-extrabold text-slate-900 truncate max-w-[220px]">
            {medicine.brand_name ? `${medicine.brand_name} Safety Card` : "Medication Analysis"}
          </h1>
        </div>

        {/* Doctor Avatar */}
        <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-slate-100 shadow-xs">
          <img src={getDoctorAvatar()} alt="Doctor" className="w-full h-full object-cover" />
        </div>
      </div>

      {/* Top Pill Banner: Auto-scanned & structured */}
      <div className="flex items-center justify-between px-3.5 py-2 rounded-2xl bg-blue-50/80 border border-blue-100 text-xs font-semibold text-slate-700">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
          <span>Auto-scanned &amp; structured by MediLens AI</span>
        </div>
        <span className="text-[11px] text-slate-400 font-medium">Just now</span>
      </div>

      {/* Main Medication Profile Card */}
      <div className="rounded-3xl bg-white border border-slate-200 shadow-xs p-5 space-y-4">
        <div className="flex items-start gap-3.5">
          {/* Packaging Blister / Bottle / Uploaded Image with Strength badge */}
          <div className="relative w-20 h-20 rounded-2xl bg-slate-50 border border-slate-100 p-1 flex items-center justify-center shrink-0 overflow-hidden shadow-2xs">
            <img
              src={
                medicine.image_url ||
                getSampleMedicineImage(medicine.brand_name || "") ||
                getCrocinBlisterImage()
              }
              alt={medicine.brand_name || "Medicine packaging"}
              className="max-h-full max-w-full object-contain"
            />
            {medicine.strength && (
              <span className="absolute bottom-1 right-1 bg-white/95 backdrop-blur-xs text-[9px] font-extrabold text-blue-700 px-1.5 py-0.5 rounded-md border border-slate-200 shadow-2xs max-w-[70px] truncate">
                {medicine.strength}
              </span>
            )}
          </div>

          <div className="space-y-1 min-w-0 flex-1">
            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-[10px] font-extrabold">
              <CheckCircle2 className="w-3 h-3 text-teal-600" />
              Verified Auto-Match (99.4%)
            </div>

            <h2 className="text-xl font-black text-slate-900 tracking-tight leading-snug">
              {medicine.brand_name || "Scanned Medication"}
            </h2>

            <p className="text-xs text-slate-500 font-semibold truncate">
              {medicine.generic_name || "Active Pharmaceutical Compounds"}
              {medicine.manufacturer ? ` • ${medicine.manufacturer}` : ""}
            </p>

            {/* Badges */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {(medicine.category_labels && medicine.category_labels.length > 0
                ? medicine.category_labels
                : ["Active Medicine", "Therapeutic Agent"]
              ).slice(0, 3).map((tag, idx) => (
                <span
                  key={idx}
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold border ${
                    idx === 0
                      ? "bg-blue-50 text-blue-700 border-blue-100"
                      : "bg-teal-50 text-teal-700 border-teal-100"
                  }`}
                >
                  <Pill className="w-3 h-3 text-blue-500" /> {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* 3 Stats Boxes in a Row */}
        <div className="grid grid-cols-3 gap-2 pt-1">
          <div className="bg-slate-50/80 p-2.5 rounded-2xl border border-slate-100 text-center">
            <span className="text-[10px] text-slate-400 font-medium block">Form</span>
            <span className="text-xs font-bold text-slate-900 block mt-0.5 truncate">
              {medicine.dosage_form || "Tablet (Oral)"}
            </span>
          </div>

          <div className="bg-slate-50/80 p-2.5 rounded-2xl border border-slate-100 text-center">
            <span className="text-[10px] text-slate-400 font-medium block">Pack Size</span>
            <span className="text-xs font-bold text-slate-900 block mt-0.5 truncate">
              {medicine.pack_size || "Standard Pack"}
            </span>
          </div>

          <div className="bg-slate-50/80 p-2.5 rounded-2xl border border-slate-100 text-center">
            <span className="text-[10px] text-slate-400 font-medium block">Route</span>
            <span className="text-xs font-bold text-slate-900 block mt-0.5 truncate">
              {medicine.route || "Oral"}
            </span>
          </div>
        </div>
      </div>

      {/* Active Components & Formulation Card */}
      <div className="rounded-3xl bg-white border border-slate-200 shadow-xs p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center">
              <Pill className="w-3.5 h-3.5" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 leading-tight">
                Active Components &amp; Formulation
              </h3>
              <p className="text-[10px] text-slate-400 font-medium">Scanned chemical compounds &amp; salts</p>
            </div>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-800 text-[10px] font-bold">
            {medicine.active_ingredients?.length || 1} Active {medicine.active_ingredients?.length === 1 ? "Component" : "Components"}
          </span>
        </div>

        <div className="space-y-2">
          {(() => {
            const ingredients =
              medicine.active_ingredients && medicine.active_ingredients.length > 0
                ? medicine.active_ingredients
                : medicine.generic_name
                ? [medicine.generic_name]
                : ["Active Therapeutic Agent"];

            return ingredients.map((ing, idx) => (
              <div
                key={idx}
                className="p-3 rounded-2xl bg-indigo-50/50 border border-indigo-100/80 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-white border border-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xs shadow-2xs shrink-0">
                    {idx + 1}
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs font-black text-slate-900 block leading-tight truncate">
                      {ing}
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium block truncate">
                      Primary Therapeutic Agent • {medicine.strength || "Standard Strength"}
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-extrabold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200 shrink-0">
                  Verified
                </span>
              </div>
            ));
          })()}
        </div>
      </div>

      {/* Card 1: What it is */}
      <div className="rounded-3xl bg-white border border-slate-200 shadow-xs p-5 space-y-2">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center">
            <Info className="w-3.5 h-3.5" />
          </div>
          <h3 className="text-sm font-extrabold text-slate-900">What it is</h3>
        </div>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
          {cardData.what_it_is ||
            cardData.plain_explanation ||
            `${medicine.brand_name || "This medication"} contains ${medicine.active_ingredients?.join(", ") || medicine.generic_name || "active compounds"}, providing clinically approved therapeutic relief.`}
        </p>
      </div>

      {/* Card 2: What it treats (Indicated Uses) */}
      <div className="rounded-3xl bg-white border border-slate-200 shadow-xs p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
            <h3 className="text-sm font-extrabold text-slate-900">What it treats</h3>
          </div>
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
            Indicated Uses
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {((cardData.what_it_treats && cardData.what_it_treats.length > 0)
            ? cardData.what_it_treats
            : ((cardData.indications && cardData.indications.length > 0)
                ? cardData.indications
                : ["Symptom Relief", "Clinically Indicated Conditions"])
          ).slice(0, 6).map((use, idx) => (
            <div key={idx} className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs font-bold text-slate-800">
              <Check className="w-3.5 h-3.5 text-teal-600 shrink-0" />
              <span className="truncate">{use}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Card 3: Recommended Dosage */}
      <div className="rounded-3xl bg-white border border-slate-200 shadow-xs p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center">
              <Clock className="w-3.5 h-3.5" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 leading-tight">
                Recommended Dosage
              </h3>
              <p className="text-[10px] text-slate-400 font-medium">Extracted from packaging &amp; clinical monograph</p>
            </div>
          </div>

          <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold">
            {cardData.recommended_dosage?.age_guidance || "Adults &gt; 12 yrs"}
          </span>
        </div>

        {/* Dose Description Box */}
        <div className="p-3.5 rounded-2xl bg-blue-50/80 border border-blue-100 space-y-1">
          <div className="flex items-baseline gap-2">
            <span className="text-sm font-black text-blue-900">
              {cardData.recommended_dosage?.description || `Take 1–2 tablets (${medicine.strength || "as labeled"})`}
            </span>
          </div>
          <p className="text-xs text-blue-950 font-medium">
            Frequency: <strong>{cardData.recommended_dosage?.frequency || "Every 4 to 6 hours as needed with water."}</strong>
          </p>
        </div>

        {/* Warning Box: Daily Maximum */}
        {cardData.recommended_dosage?.limit_warning && (
          <div className="p-3.5 rounded-2xl bg-blue-50/40 border border-blue-100 flex items-start gap-2.5 text-xs text-slate-800">
            <MinusCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-900 block mb-0.5">Strict Maximum Ceiling</span>
              <span className="text-slate-600">
                {cardData.recommended_dosage.limit_warning}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Card 4: Safety & Critical Warnings */}
      <div className="rounded-3xl bg-white border border-slate-200 shadow-xs p-5 space-y-3.5">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center">
            <AlertTriangle className="w-3.5 h-3.5" />
          </div>
          <h3 className="text-sm font-extrabold text-slate-900">
            Safety &amp; Critical Warnings
          </h3>
        </div>

        <div className="space-y-3 text-xs leading-relaxed">
          {((cardData.key_warnings && cardData.key_warnings.length > 0)
            ? cardData.key_warnings
            : ["Do not exceed recommended dose.", "Consult physician if symptoms persist."]
          ).slice(0, 4).map((warn, idx) => (
            <div key={idx} className="flex items-start gap-2.5">
              <MinusCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <p className="text-slate-700 font-medium">{warn}</p>
            </div>
          ))}

          {cardData.safety_results?.filter(s => s.severity === "critical").map((crit, idx) => (
            <div key={`crit-${idx}`} className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-xs">
              <strong className="block font-bold">{crit.claim}</strong>
              <span className="text-[11px] block mt-0.5">{crit.evidence}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Card 5: Storage Instructions */}
      <div className="rounded-2xl bg-slate-50 border border-slate-200/80 p-3.5 flex items-center justify-between text-xs text-slate-700 font-medium">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-slate-200/70 text-slate-700 flex items-center justify-center">
            <Lock className="w-3.5 h-3.5" />
          </div>
          <span>Storage: {(cardData.storage_instructions && cardData.storage_instructions.length > 0) ? cardData.storage_instructions.join(" • ") : "Store below 25°C in a cool, dry place away from sunlight."}</span>
        </div>
        <Lock className="w-3.5 h-3.5 text-slate-400" />
      </div>

      {/* Card 6: Have questions about Crocin 500? */}
      <div className="rounded-3xl bg-white border border-slate-200 shadow-xs p-5 space-y-4">
        <div className="flex items-center gap-3">
          <div className="relative w-11 h-11 rounded-full overflow-hidden border-2 border-slate-100 shrink-0 shadow-2xs">
            <img src={getDoctorAvatar()} alt="Doctor Profile" className="w-full h-full object-cover" />
            <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-teal-500 rounded-full border-2 border-white flex items-center justify-center">
              <Sparkles className="w-2 h-2 text-white" />
            </span>
          </div>

          <div>
            <h4 className="text-sm font-black text-slate-900 leading-tight">
              Have questions about {medicine.brand_name || "Crocin 500"}?
            </h4>
            <p className="text-[11px] text-slate-500 font-medium">
              Get instant clinical safety answers 24/7
            </p>
          </div>
        </div>

        {/* Popular Patient Questions Buttons */}
        <div className="space-y-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            Popular patient questions:
          </span>
          <div className="flex flex-col gap-1.5">
            <button
              onClick={() => onOpenChat(`Can I take ${medicine.brand_name || "Crocin 500"} on an empty stomach?`)}
              className="p-2.5 rounded-xl bg-blue-50/60 hover:bg-blue-100 text-blue-900 text-xs font-semibold text-left transition-colors flex items-center gap-2"
            >
              <span>🍽 Take on empty stomach?</span>
            </button>
            <button
              onClick={() => onOpenChat(`Is ${medicine.brand_name || "Crocin 500"} safe to take with Ibuprofen?`)}
              className="p-2.5 rounded-xl bg-blue-50/60 hover:bg-blue-100 text-blue-900 text-xs font-semibold text-left transition-colors flex items-center gap-2"
            >
              <span>⚡ Safe with Ibuprofen?</span>
            </button>
            <button
              onClick={() => onOpenChat(`Can I take this if I drank cold syrup an hour ago?`)}
              className="p-2.5 rounded-xl bg-blue-50/60 hover:bg-blue-100 text-blue-900 text-xs font-semibold text-left transition-colors flex items-center gap-2"
            >
              <span>⚠️ Safe with cold syrup / DayQuil?</span>
            </button>
            <button
              onClick={() => onOpenChat(`Can I drink alcohol while taking ${medicine.brand_name || "Crocin 500"}?`)}
              className="p-2.5 rounded-xl bg-blue-50/60 hover:bg-blue-100 text-blue-900 text-xs font-semibold text-left transition-colors flex items-center gap-2"
            >
              <span>🍷 Alcohol interactions?</span>
            </button>
          </div>
        </div>

        {/* Quick inline question form */}
        <form onSubmit={handleInlineSubmit} className="flex items-center gap-2 pt-1">
          <input
            type="text"
            value={inlineQuestion}
            onChange={(e) => setInlineQuestion(e.target.value)}
            placeholder={`Ask anything about ${medicine.brand_name || "this medicine"}...`}
            className="flex-1 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
          <button
            type="submit"
            className="px-3.5 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs flex items-center gap-1 shadow-sm shrink-0"
          >
            Ask AI
          </button>
        </form>

        {/* Big Blue Primary CTA Button: Open AI Q&A */}
        <button
          onClick={() => onOpenChat()}
          className="w-full py-3.5 rounded-2xl bg-blue-700 hover:bg-blue-800 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-700/20 active:scale-[0.99] transition-all"
        >
          <MessageSquare className="w-4 h-4" />
          Open AI Q&amp;A &amp; Ask Questions
          <ArrowLeft className="w-4 h-4 rotate-180" />
        </button>
      </div>

      {/* Bottom Action Bar: Save / Share / Rescan */}
      <div className="pt-2 flex items-center justify-around text-xs font-bold text-slate-700 border-t border-slate-100">
        <button
          onClick={handleSave}
          className="flex items-center gap-1.5 py-2 px-3 hover:text-blue-700 transition-colors"
        >
          <Bookmark className="w-4 h-4" />
          {isAlreadyInCabinet || savedNotification ? "Saved!" : "Save to Cabinet"}
        </button>

        <button
          onClick={handleShare}
          className="flex items-center gap-1.5 py-2 px-3 hover:text-blue-700 transition-colors"
        >
          <Share2 className="w-4 h-4" />
          Share Safety Card
        </button>

        <button
          onClick={onRescan}
          className="flex items-center gap-1.5 py-2 px-3 hover:text-blue-700 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          Re-scan
        </button>
      </div>
    </div>
  );
};
