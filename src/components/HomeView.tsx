import React, { useRef } from "react";
import {
  Camera,
  Image as ImageIcon,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  Info,
  Bot,
  Bandage,
  ShieldAlert
} from "lucide-react";
import { SamplePackage, CanonicalMedicine } from "../types.ts";
import { getDoctorAvatar, getCrocinBlisterImage } from "../utils/sampleImages.ts";

interface HomeViewProps {
  onScanClick: () => void;
  onUploadClick: (file: File) => void;
  onOpenAnalysis: (sampleId?: string) => void;
  onSelectSample?: (sample: SamplePackage) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onScanClick,
  onUploadClick,
  onOpenAnalysis,
  onSelectSample,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUploadClick(file);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 pt-3 pb-24 space-y-4 font-sans text-slate-900">
      {/* Hidden File Input for Gallery Upload */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Top Header Bar */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            {/* Blue pill icon */}
            <div className="w-5 h-5 rounded-full border-2 border-white flex items-center justify-center">
              <div className="w-2.5 h-1 bg-white rounded-full" />
            </div>
          </div>
          <div>
            <h1 className="text-base font-extrabold text-slate-900 tracking-tight leading-tight">
              MediLens
            </h1>
            <p className="text-xs text-slate-400 font-medium">Home / Scan</p>
          </div>
        </div>

        {/* Doctor Avatar */}
        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-slate-100 shadow-xs">
          <img src={getDoctorAvatar()} alt="Doctor Profile" className="w-full h-full object-cover" />
        </div>
      </div>

      {/* Badge Bar: Clinically Verified AI & v2.4 Ready */}
      <div className="flex items-center justify-between pt-1">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-[11px] font-extrabold tracking-wide">
          <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
          CLINICALLY VERIFIED AI
        </div>
        <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
          v2.4 Ready
        </span>
      </div>

      {/* User Greeting & Headline */}
      <div className="space-y-1 pt-1">
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Hi Sarah
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
          Point your camera or upload a package to understand dosage, active ingredients, and safety instantly.
        </p>
      </div>

      {/* Primary Blue Card: Scan Medicine Label */}
      <div
        onClick={onScanClick}
        className="rounded-3xl bg-gradient-to-r from-blue-700 via-blue-600 to-blue-700 text-white p-5 sm:p-6 shadow-xl shadow-blue-600/25 cursor-pointer hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-between gap-4"
      >
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-xs text-[10px] font-bold tracking-wide text-white">
            <Sparkles className="w-3 h-3 text-blue-200" />
            Instant AI Reading
          </div>
          <h3 className="text-lg sm:text-xl font-black tracking-tight text-white leading-snug">
            Scan Medicine Label
          </h3>
          <p className="text-xs text-blue-100 font-medium">
            Real-time automatic capture
          </p>
        </div>

        {/* Big Circular Camera Icon */}
        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white text-blue-600 flex items-center justify-center shadow-lg shrink-0">
          <Camera className="w-7 h-7 sm:w-8 sm:h-8" />
        </div>
      </div>

      {/* Secondary Card: Upload Photo from Gallery */}
      <div
        onClick={() => fileInputRef.current?.click()}
        className="rounded-2xl bg-blue-50/70 border border-blue-100 hover:border-blue-200 p-4 cursor-pointer hover:bg-blue-50 transition-all flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white border border-blue-100 flex items-center justify-center text-blue-600 shadow-2xs">
            <ImageIcon className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-extrabold text-slate-900">
              Upload Photo from Gallery
            </h4>
            <p className="text-xs text-slate-500 font-medium">
              From camera roll or files
            </p>
          </div>
        </div>
        <ArrowRight className="w-5 h-5 text-slate-400" />
      </div>

      {/* Pill: Zero manual typing */}
      <div className="rounded-xl bg-slate-50 border border-slate-200/80 px-3.5 py-2.5 flex items-center gap-2 text-xs font-semibold text-slate-700">
        <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
        <span>Zero manual typing • Auto-detects dosage, active salts &amp; contraindications</span>
      </div>

      {/* Info Pill: Works with blister packs */}
      <div className="rounded-2xl bg-blue-50/60 border border-blue-100 px-3.5 py-2.5 flex items-center gap-2 text-xs font-medium text-slate-700">
        <Info className="w-4 h-4 text-blue-600 shrink-0" />
        <span>Works with blister packs, pill bottles, syrup cartons...</span>
      </div>

      {/* Recent Analysis Section */}
      <div className="space-y-2.5 pt-2">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
            Recent Analysis
          </h3>
          <button
            onClick={() => onOpenAnalysis("sample-crocin-500")}
            className="text-xs font-bold text-blue-600 hover:text-blue-700"
          >
            View All
          </button>
        </div>

        {/* Crocin 500 Product Card */}
        <div className="rounded-3xl bg-white border border-slate-200 shadow-xs p-4 space-y-3.5 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              {/* Blister pack thumbnail */}
              <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 p-1 flex items-center justify-center shrink-0 overflow-hidden shadow-2xs">
                <img
                  src={getCrocinBlisterImage()}
                  alt="Crocin 500 Tablets"
                  className="max-h-full max-w-full object-contain"
                />
              </div>

              <div>
                <h4 className="text-sm font-extrabold text-slate-900">
                  Crocin 500
                </h4>
                <p className="text-xs text-slate-500 font-medium">
                  Paracetamol 500 mg • Tablet
                </p>
              </div>
            </div>

            <span className="text-[11px] font-semibold text-slate-400">
              2h ago
            </span>
          </div>

          {/* Badges Row */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-100">
              <Bandage className="w-3.5 h-3.5 text-blue-500" />
              Fever &amp; Mild Pain
            </span>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-teal-50 text-teal-700 border border-teal-100">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
              Safe with profile
            </span>
          </div>

          {/* Blue Action Button */}
          <button
            onClick={() => onOpenAnalysis("sample-crocin-500")}
            className="w-full py-3 rounded-2xl bg-blue-700 hover:bg-blue-800 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-blue-700/20 active:scale-[0.99] transition-all"
          >
            <Bot className="w-4 h-4" />
            View Analysis &amp; Ask AI
          </button>
        </div>
      </div>

      {/* Quick Example Evaluation Packages */}
      <div className="space-y-2 pt-1">
        <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider px-1">
          <span>Or test sample medicine label:</span>
          <Sparkles className="w-3.5 h-3.5 text-blue-500" />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => onOpenAnalysis("sample-tylenol-500")}
            className="p-3 rounded-2xl bg-white border border-slate-200 hover:border-blue-400 hover:bg-blue-50/40 text-left transition-all shadow-2xs group"
          >
            <span className="text-xs font-bold text-slate-900 group-hover:text-blue-700 block">Tylenol 500mg</span>
            <span className="text-[10px] text-slate-500 block truncate">Acetaminophen Caplet</span>
          </button>
          <button
            onClick={() => onOpenAnalysis("sample-advil-200")}
            className="p-3 rounded-2xl bg-white border border-slate-200 hover:border-blue-400 hover:bg-blue-50/40 text-left transition-all shadow-2xs group"
          >
            <span className="text-xs font-bold text-slate-900 group-hover:text-blue-700 block">Advil 200mg</span>
            <span className="text-[10px] text-slate-500 block truncate">Ibuprofen NSAID</span>
          </button>
        </div>
      </div>

      {/* Clinical Disclaimer Card */}
      <div className="rounded-2xl bg-blue-50/50 border border-blue-100 p-4 flex items-start gap-2.5 text-xs text-slate-600">
        <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
        <p className="leading-relaxed text-[11px]">
          MediLens simplifies packaging terms into plain language. Always verify critical medical questions with your qualified healthcare provider.
        </p>
      </div>
    </div>
  );
};
