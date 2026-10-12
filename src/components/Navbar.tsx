import React from "react";
import { Pill, Shield, MessageSquare, Layers, Camera, Archive, Sparkles } from "lucide-react";

interface NavbarProps {
  currentView: "home" | "scan" | "card" | "compare" | "cabinet" | "chat";
  setCurrentView: (view: "home" | "scan" | "card" | "compare" | "cabinet" | "chat") => void;
  cabinetCount: number;
  hasCabinetAlerts: boolean;
  onOpenArchitecture: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  setCurrentView,
  cabinetCount,
  hasCabinetAlerts,
  onOpenArchitecture,
}) => {
  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40 transition-shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div
          onClick={() => setCurrentView("home")}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center text-white shadow-md shadow-teal-500/20 group-hover:scale-105 transition-transform">
            <Pill className="w-5 h-5 -rotate-45" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg sm:text-xl tracking-tight text-slate-900">
                Medi<span className="text-teal-600">Lens</span>
              </span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-teal-100 text-teal-800 tracking-wide">
                GEMMA
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
              Evidence-Grounded Medicine Intelligence
            </p>
          </div>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          <button
            onClick={() => setCurrentView("scan")}
            className={`px-3.5 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all ${
              currentView === "scan"
                ? "bg-teal-50 text-teal-700 shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
            }`}
          >
            <Camera className="w-4 h-4" />
            Scan Medicine
          </button>

          <button
            onClick={() => setCurrentView("compare")}
            className={`px-3.5 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all ${
              currentView === "compare"
                ? "bg-teal-50 text-teal-700 shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
            }`}
          >
            <Sparkles className="w-4 h-4 text-purple-600" />
            Compare
          </button>

          <button
            onClick={() => setCurrentView("cabinet")}
            className={`px-3.5 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all relative ${
              currentView === "cabinet"
                ? "bg-teal-50 text-teal-700 shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
            }`}
          >
            <Archive className="w-4 h-4" />
            Session Cabinet
            {cabinetCount > 0 && (
              <span
                className={`ml-1 px-1.5 py-0.2 rounded-full text-xs font-bold ${
                  hasCabinetAlerts
                    ? "bg-rose-500 text-white animate-pulse"
                    : "bg-slate-200 text-slate-700"
                }`}
              >
                {cabinetCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setCurrentView("chat")}
            className={`px-3.5 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all ${
              currentView === "chat"
                ? "bg-teal-50 text-teal-700 shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            Ask MediLens
          </button>

          <div className="h-5 w-px bg-slate-200 mx-2" />

          <button
            onClick={onOpenArchitecture}
            className="px-3 py-1.5 rounded-xl text-xs font-medium text-slate-500 hover:text-teal-700 hover:bg-teal-50/60 border border-slate-200 transition-colors flex items-center gap-1.5"
            title="Inspect FunctionGemma Architecture & Allowlisted Tools"
          >
            <Layers className="w-3.5 h-3.5 text-teal-600" />
            Architecture
          </button>
        </nav>

        {/* Mobile quick actions */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={onOpenArchitecture}
            className="p-2 rounded-lg text-slate-500 hover:text-teal-700 hover:bg-teal-50/60"
            aria-label="Inspect Architecture"
          >
            <Layers className="w-4 h-4 text-teal-600" />
          </button>
          <button
            onClick={() => setCurrentView("scan")}
            className="px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm"
          >
            <Camera className="w-3.5 h-3.5" />
            Scan
          </button>
        </div>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200 z-40 px-3 py-2 flex items-center justify-around">
        <button
          onClick={() => setCurrentView("home")}
          className={`flex flex-col items-center py-1 px-2 rounded-lg text-[10px] font-semibold transition-colors ${
            currentView === "home" ? "text-teal-600 font-bold" : "text-slate-500"
          }`}
        >
          <Pill className="w-5 h-5 mb-0.5" />
          Home
        </button>

        <button
          onClick={() => setCurrentView("scan")}
          className={`flex flex-col items-center py-1 px-2 rounded-lg text-[10px] font-semibold transition-colors ${
            currentView === "scan" ? "text-teal-600 font-bold" : "text-slate-500"
          }`}
        >
          <Camera className="w-5 h-5 mb-0.5" />
          Scan Label
        </button>

        <button
          onClick={() => setCurrentView("cabinet")}
          className={`flex flex-col items-center py-1 px-2 rounded-lg text-[10px] font-semibold transition-colors relative ${
            currentView === "cabinet" ? "text-teal-600 font-bold" : "text-slate-500"
          }`}
        >
          <Archive className="w-5 h-5 mb-0.5" />
          Cabinet {cabinetCount > 0 ? `(${cabinetCount})` : ""}
          {hasCabinetAlerts && (
            <span className="absolute top-1 right-2 w-2 h-2 rounded-full bg-rose-500" />
          )}
        </button>

        <button
          onClick={() => setCurrentView("chat")}
          className={`flex flex-col items-center py-1 px-2 rounded-lg text-[10px] font-semibold transition-colors ${
            currentView === "chat" ? "text-teal-600 font-bold" : "text-slate-500"
          }`}
        >
          <MessageSquare className="w-5 h-5 mb-0.5" />
          Ask MediLens
        </button>
      </div>
    </header>
  );
};
