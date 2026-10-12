import React, { useState, useEffect } from "react";
import { Navbar } from "./components/Navbar.tsx";
import { DisclaimerBanner } from "./components/DisclaimerBanner.tsx";
import { HomeView } from "./components/HomeView.tsx";
import { ScanView } from "./components/ScanView.tsx";
import { MedicineCard } from "./components/MedicineCard.tsx";
import { CompareView } from "./components/CompareView.tsx";
import { CabinetView } from "./components/CabinetView.tsx";
import { ChatView } from "./components/ChatView.tsx";
import { EvidenceDrawer } from "./components/EvidenceDrawer.tsx";
import { ArchitectureModal } from "./components/ArchitectureModal.tsx";
import {
  CanonicalMedicine,
  MedicineIntelligenceCardData,
  SamplePackage
} from "./types.ts";
import { getSampleMedicineImage } from "./utils/sampleImages.ts";

export default function App() {
  const [currentView, setCurrentView] = useState<"home" | "scan" | "card" | "compare" | "cabinet" | "chat">("home");
  const [cabinet, setCabinet] = useState<CanonicalMedicine[]>([]);
  const [activeMedicine, setActiveMedicine] = useState<CanonicalMedicine | null>(null);
  const [activeCardData, setActiveCardData] = useState<MedicineIntelligenceCardData | null>(null);
  const [evidenceIdForDrawer, setEvidenceIdForDrawer] = useState<string | null>(null);
  const [isArchitectureModalOpen, setIsArchitectureModalOpen] = useState<boolean>(false);
  const [chatPrefillQuestion, setChatPrefillQuestion] = useState<string | undefined>(undefined);

  // Fetch current session cabinet on mount
  useEffect(() => {
    fetchCabinet();
  }, []);

  const fetchCabinet = async () => {
    try {
      const res = await fetch("/api/session/medicines");
      const data = await res.json();
      if (data.medicines) {
        setCabinet(data.medicines);
      }
    } catch (err) {
      console.error("Failed to load cabinet:", err);
    }
  };

  // Called when camera captures or user uploads image
  const handleScanSuccess = (data: {
    medicine: CanonicalMedicine;
    cardData: MedicineIntelligenceCardData;
  }) => {
    setActiveMedicine(data.medicine);
    setActiveCardData(data.cardData);
    // Add to cabinet automatically
    fetch("/api/session/medicines", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ medicine: data.medicine }),
    })
      .then((res) => res.json())
      .then((resData) => {
        if (resData.cabinet) setCabinet(resData.cabinet);
      })
      .catch(console.error);

    setCurrentView("card");
  };

  const handleSelectSample = async (sample: SamplePackage) => {
    try {
      const res = await fetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          raw_text: sample.raw_ocr_text,
          image_base64: getSampleMedicineImage(sample.brand_name),
        }),
      });

      if (!res.ok) throw new Error("Failed to analyze sample");
      const data = await res.json();

      setActiveMedicine(data.medicine);
      setActiveCardData(data.card_data);

      // Automatically add to cabinet
      fetch("/api/session/medicines", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ medicine: data.medicine }),
      })
        .then((r) => r.json())
        .then((resData) => {
          if (resData.cabinet) setCabinet(resData.cabinet);
        })
        .catch(console.error);

      setCurrentView("card");
    } catch (err: any) {
      console.error("Error analyzing sample:", err);
    }
  };

  const handleHomeUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      const dataUrl = e.target?.result as string;
      try {
        const res = await fetch("/api/scan", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            image_base64: dataUrl,
            mime_type: file.type || "image/jpeg",
          }),
        });
        if (!res.ok) throw new Error("Analysis failed");
        const data = await res.json();
        setActiveMedicine(data.medicine);
        setActiveCardData(data.card_data);
        if (data.medicine) {
          fetch("/api/session/medicines", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ medicine: data.medicine }),
          })
            .then((r) => r.json())
            .then((resData) => {
              if (resData.cabinet) setCabinet(resData.cabinet);
            })
            .catch(console.error);
        }
        setCurrentView("card");
      } catch (err) {
        console.error("Home upload error:", err);
        handleOpenAnalysis("sample-crocin-500");
      }
    };
    reader.readAsDataURL(file);
  };

  const handleOpenAnalysis = async (sampleId?: string) => {
    try {
      const targetId = sampleId || "sample-crocin-500";
      const sampleRes = await fetch("/api/sample-packages");
      const sampleData = await sampleRes.json();
      const sample = (sampleData.samples as SamplePackage[])?.find(
        (s) => s.id === targetId || s.brand_name.toLowerCase().includes("crocin")
      ) || sampleData.samples?.[0];

      if (sample) {
        handleSelectSample(sample);
      } else {
        const res = await fetch(`/api/medicines/${encodeURIComponent(targetId)}`);
        const data = await res.json();
        if (data.card_data) {
          setActiveCardData(data.card_data);
          setActiveMedicine(data.card_data.medicine);
          setCurrentView("card");
        }
      }
    } catch (err) {
      console.error("Open analysis error:", err);
    }
  };

  const handleAddToCabinet = async () => {
    if (!activeMedicine) return;
    try {
      const res = await fetch("/api/session/medicines", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ medicine: activeMedicine }),
      });
      const data = await res.json();
      if (data.cabinet) {
        setCabinet(data.cabinet);
      }
    } catch (err) {
      console.error("Failed to add to cabinet:", err);
    }
  };

  const handleRemoveFromCabinet = async (id: string) => {
    try {
      const res = await fetch(`/api/session/medicines/${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.cabinet) {
        setCabinet(data.cabinet);
      }
    } catch (err) {
      console.error("Failed to remove from cabinet:", err);
    }
  };

  const handleAddSampleDirectly = async (sampleId: string) => {
    try {
      const sampleRes = await fetch("/api/sample-packages");
      const sampleData = await sampleRes.json();
      const sample = (sampleData.samples as SamplePackage[])?.find((s) => s.id === sampleId);
      if (!sample) return;

      const scanRes = await fetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          raw_text: sample.raw_ocr_text,
          image_base64: getSampleMedicineImage(sample.brand_name),
        }),
      });
      const scanData = await scanRes.json();
      if (scanData.medicine) {
        setCabinet((prev) => [...prev.filter((m) => m.id !== scanData.medicine.id), scanData.medicine]);
      }
    } catch (err) {
      console.error("Direct sample addition error:", err);
    }
  };

  const handleSelectMedicineForDetails = async (med: CanonicalMedicine) => {
    setActiveMedicine(med);
    try {
      const res = await fetch(`/api/medicines/${encodeURIComponent(med.id)}`);
      if (res.ok) {
        const data = await res.json();
        setActiveCardData(data.card_data);
      }
    } catch (err) {
      console.error(err);
    }
    setCurrentView("card");
  };

  const isAlreadyInCabinet = Boolean(
    activeMedicine && cabinet.some((m) => m.id === activeMedicine.id || m.brand_name === activeMedicine.brand_name)
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-teal-500/20 selection:text-teal-900 pb-16 md:pb-0">
      {/* Top Clinical Disclaimer Banner */}
      <DisclaimerBanner />

      {/* Main Navigation Bar */}
      <Navbar
        currentView={currentView}
        setCurrentView={(view) => {
          setChatPrefillQuestion(undefined);
          setCurrentView(view);
        }}
        cabinetCount={cabinet.length}
        hasCabinetAlerts={cabinet.length >= 2}
        onOpenArchitecture={() => setIsArchitectureModalOpen(true)}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {currentView === "home" && (
          <HomeView
            onScanClick={() => setCurrentView("scan")}
            onUploadClick={handleHomeUpload}
            onOpenAnalysis={handleOpenAnalysis}
            onSelectSample={handleSelectSample}
          />
        )}

        {currentView === "scan" && (
          <ScanView
            onScanSuccess={handleScanSuccess}
            onBack={() => setCurrentView("home")}
          />
        )}

        {currentView === "card" && activeCardData && (
          <MedicineCard
            cardData={activeCardData}
            onBack={() => setCurrentView("home")}
            onOpenChat={(prefillQuestion?: string) => {
              setChatPrefillQuestion(prefillQuestion);
              setCurrentView("chat");
            }}
            onAddToCabinet={handleAddToCabinet}
            isAlreadyInCabinet={isAlreadyInCabinet}
            onRescan={() => setCurrentView("scan")}
          />
        )}

        {currentView === "compare" && (
          <CompareView
            onBack={() => setCurrentView("home")}
            cabinet={cabinet}
            onSelectMedicineForDetails={handleSelectMedicineForDetails}
          />
        )}

        {currentView === "cabinet" && (
          <CabinetView
            cabinet={cabinet}
            onRemoveFromCabinet={handleRemoveFromCabinet}
            onScanNew={() => setCurrentView("scan")}
            onOpenEvidence={(evId) => setEvidenceIdForDrawer(evId)}
            onSelectMedicineForDetails={handleSelectMedicineForDetails}
            onAddSampleDirectly={handleAddSampleDirectly}
          />
        )}

        {currentView === "chat" && (
          <ChatView
            currentMedicine={activeMedicine}
            cabinet={cabinet}
            initialQuestion={chatPrefillQuestion}
            onViewSpecs={() => setCurrentView("card")}
            onTriggerScan={() => setCurrentView("scan")}
            onOpenEvidence={(evId) => setEvidenceIdForDrawer(evId)}
            onBack={() => setCurrentView(activeCardData ? "card" : "home")}
          />
        )}
      </main>

      {/* Slide-out Evidence & Provenance Inspector Drawer */}
      <EvidenceDrawer
        evidenceId={evidenceIdForDrawer}
        onClose={() => setEvidenceIdForDrawer(null)}
      />

      {/* Modal: Canonical Architecture & Allowlisted Tools */}
      <ArchitectureModal
        isOpen={isArchitectureModalOpen}
        onClose={() => setIsArchitectureModalOpen(false)}
      />
    </div>
  );
}
