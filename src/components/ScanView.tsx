import React, { useState, useRef, useEffect } from "react";
import {
  Camera,
  Image as ImageIcon,
  SwitchCamera,
  ArrowLeft,
  Sparkles,
  Zap,
  CheckCircle2,
  RefreshCw,
  X
} from "lucide-react";
import { CanonicalMedicine, SamplePackage, MedicineIntelligenceCardData } from "../types.ts";
import { getSampleMedicineImage } from "../utils/sampleImages.ts";

interface ScanViewProps {
  onScanSuccess: (data: {
    medicine: CanonicalMedicine;
    cardData: MedicineIntelligenceCardData;
  }) => void;
  onBack: () => void;
}

export const ScanView: React.FC<ScanViewProps> = ({ onScanSuccess, onBack }) => {
  const [samples, setSamples] = useState<SamplePackage[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analyzingStep, setAnalyzingStep] = useState<string>("Reading label text...");
  const [facingMode, setFacingMode] = useState<"environment" | "user">("environment");
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [showSamplesModal, setShowSamplesModal] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/sample-packages")
      .then((res) => res.json())
      .then((data) => {
        if (data.samples) setSamples(data.samples);
      })
      .catch(console.error);

    startCamera();
    return () => {
      stopCamera();
    };
  }, [facingMode]);

  const startCamera = async () => {
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraActive(true);
      }
    } catch (err) {
      console.warn("Camera could not be accessed directly:", err);
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  const handleCapture = () => {
    if (!videoRef.current || !cameraActive) {
      // If camera is not active in this browser environment, trigger file picker or sample selection
      fileInputRef.current?.click();
      return;
    }

    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
    analyzeImagePayload({ image_base64: dataUrl });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      analyzeImagePayload({ image_base64: dataUrl, mime_type: file.type || "image/jpeg" });
    };
    reader.readAsDataURL(file);
  };

  const handleSelectSample = (sample: SamplePackage) => {
    setShowSamplesModal(false);
    analyzeImagePayload({
      raw_text: sample.raw_ocr_text,
      image_base64: getSampleMedicineImage(sample.brand_name),
    });
  };

  const analyzeImagePayload = async (payload: { raw_text?: string; image_base64?: string; mime_type?: string }) => {
    setIsAnalyzing(true);
    setAnalyzingStep("Detecting label packaging...");

    try {
      setTimeout(() => setAnalyzingStep("Extracting active ingredients & dosage with Gemma AI..."), 500);
      setTimeout(() => setAnalyzingStep("Retrieving verified clinical reference & safety monographs..."), 1100);

      const response = await fetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Analysis failed");
      }

      const data = await response.json();

      setTimeout(() => {
        setIsAnalyzing(false);
        onScanSuccess({
          medicine: data.medicine,
          cardData: data.card_data,
        });
      }, 1400);
    } catch (err: any) {
      setIsAnalyzing(false);
      setErrorMessage(err.message || "Failed to analyze image. Please try another photo.");
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-65px)] bg-black text-white flex flex-col justify-between overflow-hidden">
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* Top Controls Bar (Screen 2) */}
      <div className="relative z-10 px-4 py-3 flex items-center justify-between bg-gradient-to-b from-black/80 to-transparent">
        <button
          onClick={onBack}
          className="p-2 rounded-full bg-black/40 backdrop-blur-md text-white hover:bg-black/60 transition-colors"
          aria-label="Go back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <span className="text-xs font-bold uppercase tracking-wider text-white/80">
          Scan Medicine
        </span>
        <button
          onClick={() => setShowSamplesModal(true)}
          className="px-2.5 py-1 rounded-full bg-teal-500/80 backdrop-blur-md text-white text-xs font-bold hover:bg-teal-500 transition-colors flex items-center gap-1"
        >
          <Sparkles className="w-3.5 h-3.5" /> Samples
        </button>
      </div>

      {/* Viewfinder Area */}
      <div className="relative flex-1 flex items-center justify-center p-4">
        {/* Camera Video Stream or Fallback Background */}
        {cameraActive ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-slate-950">
            {/* Crocin/Sample Preview Placeholder */}
            <div className="w-48 h-48 rounded-2xl bg-slate-900 border border-slate-800 p-2 mb-4 flex items-center justify-center overflow-hidden shadow-2xl">
              <img
                src={getSampleMedicineImage("crocin")}
                alt="Medicine Label Preview"
                className="max-h-full max-w-full object-contain"
              />
            </div>
            <p className="text-xs text-slate-400 max-w-xs mb-3">
              Camera simulated or inactive. Upload a photo or select an evaluation medicine package.
            </p>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 rounded-xl bg-teal-600 text-white font-bold text-xs hover:bg-teal-500 transition-colors"
            >
              Choose Photo from Device
            </button>
          </div>
        )}

        {/* Framing Corners (Screen 2) */}
        <div className="relative w-64 h-80 sm:w-72 sm:h-96 rounded-3xl pointer-events-none flex flex-col justify-between p-4 overflow-hidden">
          {/* Animated Laser Scanning Line */}
          <div className="absolute left-2 right-2 h-1 bg-gradient-to-r from-transparent via-teal-400 to-transparent shadow-[0_0_15px_#2dd4bf] animate-[bounce_3s_infinite]" />

          {/* Top Left Corner */}
          <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-white rounded-tl-2xl shadow-sm" />
          {/* Top Right Corner */}
          <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-white rounded-tr-2xl shadow-sm" />
          {/* Bottom Left Corner */}
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-white rounded-bl-2xl shadow-sm" />
          {/* Bottom Right Corner */}
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-white rounded-br-2xl shadow-sm" />

          <div />
          {/* Viewfinder Text Pill */}
          <div className="self-center bg-black/60 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-semibold text-white/90 text-center shadow-md">
            Position the label within the frame
          </div>
        </div>

        {/* Floating Error Toast */}
        {errorMessage && (
          <div className="absolute top-16 left-4 right-4 z-40 bg-rose-900/90 border border-rose-700 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center justify-between text-xs">
            <span>{errorMessage}</span>
            <button
              onClick={() => setErrorMessage(null)}
              className="ml-2 font-bold px-2 py-0.5 rounded-lg bg-rose-800 hover:bg-rose-700"
            >
              Dismiss
            </button>
          </div>
        )}
      </div>

      {/* Analyzing Overlay */}
      {isAnalyzing && (
        <div className="absolute inset-0 z-30 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-200">
          <div className="relative w-16 h-16 mb-4">
            <div className="absolute inset-0 rounded-full border-4 border-teal-500/20" />
            <div className="absolute inset-0 rounded-full border-4 border-teal-500 border-t-transparent animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center text-teal-400">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
          </div>
          <h3 className="text-base font-bold text-white">Analyzing Medicine with Gemma AI</h3>
          <p className="text-xs text-teal-300 mt-1 font-mono">{analyzingStep}</p>
        </div>
      )}

      {/* Bottom Shutter Controls Bar (Screen 2) */}
      <div className="relative z-10 px-8 py-6 bg-gradient-to-t from-black/90 to-transparent flex items-center justify-around">
        {/* Upload / Gallery Button */}
        <button
          onClick={() => fileInputRef.current?.click()}
          className="w-12 h-12 rounded-2xl bg-white/10 hover:bg-white/20 backdrop-blur-md flex items-center justify-center text-white transition-colors"
          title="Upload from Gallery"
          aria-label="Upload photo"
        >
          <ImageIcon className="w-6 h-6" />
        </button>

        {/* Big Shutter Button */}
        <button
          onClick={handleCapture}
          disabled={isAnalyzing}
          className="w-20 h-20 rounded-full border-4 border-white p-1.5 flex items-center justify-center group active:scale-95 transition-transform"
          aria-label="Take Photo"
        >
          <div className="w-full h-full rounded-full bg-white group-hover:bg-slate-200 transition-colors shadow-lg" />
        </button>

        {/* Flip Camera Button */}
        <button
          onClick={() => setFacingMode(facingMode === "environment" ? "user" : "environment")}
          className="w-12 h-12 rounded-2xl bg-white/10 hover:bg-white/20 backdrop-blur-md flex items-center justify-center text-white transition-colors"
          title="Switch Camera"
          aria-label="Flip camera"
        >
          <SwitchCamera className="w-6 h-6" />
        </button>
      </div>

      {/* Quick Samples Picker Modal */}
      {showSamplesModal && (
        <div className="absolute inset-0 z-40 bg-slate-900/90 backdrop-blur-sm p-4 flex flex-col justify-end">
          <div className="bg-white rounded-3xl p-5 text-slate-900 max-h-[80vh] overflow-y-auto space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Select Sample Medicine Package</h3>
              <button
                onClick={() => setShowSamplesModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {samples.map((sample) => (
                <div
                  key={sample.id}
                  onClick={() => handleSelectSample(sample)}
                  className="p-3 rounded-2xl border border-slate-200 hover:border-teal-500 hover:bg-teal-50/50 cursor-pointer flex items-center gap-3 transition-all"
                >
                  <div className="w-10 h-10 rounded-xl bg-slate-50 p-1 flex items-center justify-center border border-slate-100 shrink-0">
                    <img
                      src={getSampleMedicineImage(sample.brand_name)}
                      alt={sample.title}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs font-bold text-slate-900 truncate">{sample.title}</h4>
                    <p className="text-[10px] text-slate-500 truncate">{sample.strength}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
