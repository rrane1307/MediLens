import React, { useState } from "react";
import { ArrowLeft, ArrowRightLeft, Sparkles, Check, Info } from "lucide-react";
import { CanonicalMedicine, SamplePackage } from "../types.ts";
import { getSampleMedicineImage } from "../utils/sampleImages.ts";

interface CompareViewProps {
  onBack: () => void;
  cabinet: CanonicalMedicine[];
  onSelectMedicineForDetails: (med: CanonicalMedicine) => void;
}

export const CompareView: React.FC<CompareViewProps> = ({ onBack, cabinet, onSelectMedicineForDetails }) => {
  // Default to Crocin 500 vs Dolo 650 as demonstrated in the user's screenshot
  const [medAId, setMedAId] = useState<string>("crocin");
  const [medBId, setMedBId] = useState<string>("dolo");

  const comparisonDatabase: Record<string, any> = {
    crocin: {
      id: "crocin",
      brand_name: "Crocin 500",
      generic_name: "Paracetamol Tablets IP",
      active_ingredient: "Paracetamol 500 mg",
      uses: "Fever, mild to moderate pain",
      dosage: "1–2 tablets every 4–6 hrs",
      max_daily: "4000 mg (8 tablets)",
      pack_size: "20 tablets",
      manufacturer: "GSK",
      price: "₹25–30",
      image: getSampleMedicineImage("crocin")
    },
    dolo: {
      id: "dolo",
      brand_name: "Dolo 650",
      generic_name: "Paracetamol Tablets IP 650 mg",
      active_ingredient: "Paracetamol 650 mg",
      uses: "Fever, mild to moderate pain",
      dosage: "1 tablet every 4–6 hrs",
      max_daily: "4000 mg (~6 tablets)",
      pack_size: "15 tablets",
      manufacturer: "Micro Labs",
      price: "₹20–25",
      image: getSampleMedicineImage("dolo")
    },
    tylenol: {
      id: "tylenol",
      brand_name: "Tylenol Extra Strength",
      generic_name: "Acetaminophen 500 mg",
      active_ingredient: "Acetaminophen 500 mg",
      uses: "Aches, arthritis, fever",
      dosage: "2 caplets every 6 hrs",
      max_daily: "4000 mg (6 caplets)",
      pack_size: "50 caplets",
      manufacturer: "Kenvue / J&J",
      price: "$10–12",
      image: getSampleMedicineImage("tylenol")
    },
    advil: {
      id: "advil",
      brand_name: "Advil Liqui-Gels",
      generic_name: "Ibuprofen 200 mg (NSAID)",
      active_ingredient: "Solubilized Ibuprofen 200 mg",
      uses: "Inflammation, headache, cramps",
      dosage: "1–2 capsules every 4–6 hrs",
      max_daily: "1200 mg OTC (6 capsules)",
      pack_size: "80 capsules",
      manufacturer: "Haleon",
      price: "$12–15",
      image: getSampleMedicineImage("advil")
    }
  };

  const medA = comparisonDatabase[medAId] || comparisonDatabase["crocin"];
  const medB = comparisonDatabase[medBId] || comparisonDatabase["dolo"];

  const handleSwap = () => {
    const temp = medAId;
    setMedAId(medBId);
    setMedBId(temp);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-700 hover:text-slate-900"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <h1 className="text-base sm:text-lg font-black text-slate-900">Compare Medicines</h1>
        <button
          onClick={handleSwap}
          className="p-2 rounded-xl text-slate-600 hover:text-teal-600 hover:bg-teal-50 transition-colors"
          title="Swap Medicines"
        >
          <ArrowRightLeft className="w-4 h-4" />
        </button>
      </div>

      {/* Two Product Cards Header */}
      <div className="grid grid-cols-2 gap-4">
        {/* Medicine A Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 flex flex-col items-center text-center shadow-xs">
          <div className="w-20 h-20 bg-slate-50 rounded-xl overflow-hidden mb-2 p-1 flex items-center justify-center">
            <img src={medA.image} alt={medA.brand_name} className="max-h-full max-w-full object-contain" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">{medA.brand_name}</h3>
          <p className="text-xs text-slate-500 mt-0.5">{medA.active_ingredient}</p>
          <select
            value={medAId}
            onChange={(e) => setMedAId(e.target.value)}
            className="mt-3 text-xs font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-lg px-2.5 py-1 focus:outline-hidden cursor-pointer"
          >
            <option value="crocin">Crocin 500</option>
            <option value="dolo">Dolo 650</option>
            <option value="tylenol">Tylenol 500</option>
            <option value="advil">Advil 200</option>
          </select>
        </div>

        {/* Medicine B Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 flex flex-col items-center text-center shadow-xs">
          <div className="w-20 h-20 bg-slate-50 rounded-xl overflow-hidden mb-2 p-1 flex items-center justify-center">
            <img src={medB.image} alt={medB.brand_name} className="max-h-full max-w-full object-contain" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">{medB.brand_name}</h3>
          <p className="text-xs text-slate-500 mt-0.5">{medB.active_ingredient}</p>
          <select
            value={medBId}
            onChange={(e) => setMedBId(e.target.value)}
            className="mt-3 text-xs font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-lg px-2.5 py-1 focus:outline-hidden cursor-pointer"
          >
            <option value="dolo">Dolo 650</option>
            <option value="crocin">Crocin 500</option>
            <option value="advil">Advil 200</option>
            <option value="tylenol">Tylenol 500</option>
          </select>
        </div>
      </div>

      {/* Side-by-Side Comparison Table (Matching Screen 6) */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 text-[11px] uppercase font-bold text-slate-500 border-b border-slate-200">
              <th className="py-3 px-4 w-1/3">Feature</th>
              <th className="py-3 px-4 w-1/3 text-slate-900 font-extrabold">{medA.brand_name}</th>
              <th className="py-3 px-4 w-1/3 text-slate-900 font-extrabold">{medB.brand_name}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
            <tr>
              <td className="py-3 px-4 font-semibold text-slate-600 bg-slate-50/50">Active Ingredient</td>
              <td className="py-3 px-4 font-bold text-slate-900">{medA.active_ingredient}</td>
              <td className="py-3 px-4 font-bold text-slate-900">{medB.active_ingredient}</td>
            </tr>
            <tr>
              <td className="py-3 px-4 font-semibold text-slate-600 bg-slate-50/50">Uses</td>
              <td className="py-3 px-4 text-slate-700">{medA.uses}</td>
              <td className="py-3 px-4 text-slate-700">{medB.uses}</td>
            </tr>
            <tr>
              <td className="py-3 px-4 font-semibold text-slate-600 bg-slate-50/50">Dosage (Adults)</td>
              <td className="py-3 px-4 text-slate-800">{medA.dosage}</td>
              <td className="py-3 px-4 text-slate-800">{medB.dosage}</td>
            </tr>
            <tr>
              <td className="py-3 px-4 font-semibold text-slate-600 bg-slate-50/50">Max Daily Dose</td>
              <td className="py-3 px-4 text-slate-800 font-semibold">{medA.max_daily}</td>
              <td className="py-3 px-4 text-slate-800 font-semibold">{medB.max_daily}</td>
            </tr>
            <tr>
              <td className="py-3 px-4 font-semibold text-slate-600 bg-slate-50/50">Pack Size</td>
              <td className="py-3 px-4 text-slate-700">{medA.pack_size}</td>
              <td className="py-3 px-4 text-slate-700">{medB.pack_size}</td>
            </tr>
            <tr>
              <td className="py-3 px-4 font-semibold text-slate-600 bg-slate-50/50">Manufacturer</td>
              <td className="py-3 px-4 text-slate-700">{medA.manufacturer}</td>
              <td className="py-3 px-4 text-slate-700">{medB.manufacturer}</td>
            </tr>
            <tr>
              <td className="py-3 px-4 font-semibold text-slate-600 bg-slate-50/50">Typical Price (approx)</td>
              <td className="py-3 px-4 font-bold text-teal-800">{medA.price}</td>
              <td className="py-3 px-4 font-bold text-teal-800">{medB.price}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* AI Insight Callout Card (Matching Screen 6) */}
      <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-xs sm:text-sm text-slate-800 space-y-2">
        <div className="flex items-center gap-1.5 font-bold text-amber-900 text-xs uppercase tracking-wider">
          <Sparkles className="w-4 h-4 text-amber-600" />
          AI Insight
        </div>
        <p className="leading-relaxed text-slate-700">
          {medA.brand_name.includes("Crocin") && medB.brand_name.includes("Dolo") ? (
            <>
              Both contain the same active ingredient (<strong>Paracetamol</strong>). <strong>Dolo 650</strong> has a higher strength per tablet, so fewer tablets are needed compared to <strong>Crocin 500</strong>. Choose based on the recommended dosage, availability, and your doctor's advice.
            </>
          ) : medA.generic_name === medB.generic_name ? (
            <>
              Both products deliver the same primary therapeutic molecule (<strong>{medA.generic_name}</strong>). Choose based on convenience, preferred formulation, and recommended physician guidance.
            </>
          ) : (
            <>
              <strong>{medA.brand_name}</strong> and <strong>{medB.brand_name}</strong> belong to different therapeutic classes. Ensure you do not combine them without reviewing potential drug interactions or contraindications.
            </>
          )}
        </p>
      </div>
    </div>
  );
};
