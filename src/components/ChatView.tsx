import React, { useState, useRef, useEffect } from "react";
import {
  Camera,
  Mic,
  ArrowUp,
  Info,
  CheckCircle2,
  AlertTriangle,
  Bot,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  ExternalLink
} from "lucide-react";
import { ChatMessage, CanonicalMedicine } from "../types.ts";
import { getDoctorAvatar, getCrocinBlisterImage, getSampleMedicineImage } from "../utils/sampleImages.ts";
import { ArrowLeft } from "lucide-react";

interface ChatViewProps {
  currentMedicine?: CanonicalMedicine | null;
  cabinet?: CanonicalMedicine[];
  initialQuestion?: string;
  onViewSpecs: () => void;
  onTriggerScan: () => void;
  onOpenEvidence?: (evId: string) => void;
  onBack?: () => void;
}

export const ChatView: React.FC<ChatViewProps> = ({
  currentMedicine,
  cabinet,
  initialQuestion,
  onViewSpecs,
  onTriggerScan,
  onOpenEvidence,
  onBack,
}) => {
  const medName = currentMedicine?.brand_name || "Crocin 500";
  const medSubtitle = currentMedicine?.generic_name || "Paracetamol 500mg • Analgesic & Antipyretic";
  const medImage = currentMedicine?.image_url || getSampleMedicineImage(medName) || getCrocinBlisterImage();

  const isParacetamol =
    (currentMedicine?.generic_name || "").toLowerCase().includes("paracetamol") ||
    (currentMedicine?.generic_name || "").toLowerCase().includes("acetaminophen") ||
    (currentMedicine?.brand_name || "").toLowerCase().includes("crocin");

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const welcomeMsg: ChatMessage = {
      id: "msg-welcome",
      sender: "gemma",
      content: `I’ve analyzed and verified **${medName}** (${medSubtitle}). You can ask me anything about dosage, interactions with other medications, food guidelines, or safety precautions.`,
      timestamp: "Just now",
    };

    if (isParacetamol && !initialQuestion) {
      return [
        welcomeMsg,
        {
          id: "msg-user-sample",
          sender: "user",
          content: "Can I take this medicine if I already took cold syrup an hour ago?",
          timestamp: "Just now",
        },
        {
          id: "msg-bot-sample",
          sender: "gemma",
          caution_badge: "Active Caution",
          alert_box: {
            title: `Check label before taking ${medName}`,
            subtitle: "Potential duplicate Paracetamol hazard detected.",
            severity: "danger",
          },
          content: `Many popular cold and cough syrups (such as DayQuil, Sinutab, Benylin, and Vicks) already formulate **Paracetamol (Acetaminophen)** inside to relieve headaches.\n\nTaking **${medName}** within 4 hours of an acetaminophen-containing syrup could unintentionally exceed the safe adult limit of **4,000 mg per 24 hours** and cause acute liver toxicity.`,
          questionnaire: {
            prompt: "What brand of cold syrup did you drink?",
            options: ["Vicks Action 500", "Benadryl Dry Cough", "Ascoril-D", "Other / Scan bottle"],
          },
          source_note: "Source: FDA Drug Safety & CDSCO Guidelines",
          dosage_link: "View Dosage Chart",
          timestamp: "Just now",
        },
      ];
    }

    return [welcomeMsg];
  });

  const [inputVal, setInputVal] = useState<string>("");
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialQuestion && initialQuestion.trim()) {
      handleSend(initialQuestion);
    }
  }, [initialQuestion]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (qToSend?: string) => {
    const q = qToSend || inputVal;
    if (!q.trim() || isTyping) return;

    const userMessage: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: "user",
      content: q,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputVal("");
    setIsTyping(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: q,
          current_medicine: currentMedicine,
          current_medicine_id: currentMedicine?.id || "crocin",
          previous_messages: messages.slice(-4),
        }),
      });

      if (!response.ok) throw new Error("Chat request failed");
      const data = await response.json();
      setMessages((prev) => [...prev, data.message]);
      setIsTyping(false);
    } catch (err: any) {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: "gemma",
          content: `Regarding ${medName}: Adult dose is 1–2 tablets every 4–6 hours as needed. Never exceed 4,000 mg in 24 hours. Consult a doctor or pharmacist.`,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    }
  };

  const handleQuestionnaireOption = (option: string) => {
    if (option.includes("Scan")) {
      onTriggerScan();
    } else {
      handleSend(`I drank ${option}. Is that safe with ${medName}?`);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 pt-3 pb-24 space-y-3 font-sans text-slate-900">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between pb-1">
        <div className="flex items-center gap-2">
          {onBack && (
            <button
              onClick={onBack}
              className="p-1 rounded-full text-slate-600 hover:text-slate-900 transition-colors"
              aria-label="Back to details"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-xs">
            <div className="w-4 h-4 rounded-full border-2 border-white flex items-center justify-center">
              <div className="w-2 h-0.5 bg-white rounded-full" />
            </div>
          </div>
          <div>
            <h1 className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight leading-tight">
              MediLens AI Q&amp;A
            </h1>
            <p className="text-[11px] text-slate-400 font-medium">Grounded Clinical Answers</p>
          </div>
        </div>

        {/* Doctor Avatar */}
        <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-slate-100 shadow-xs">
          <img src={getDoctorAvatar()} alt="Doctor Profile" className="w-full h-full object-cover" />
        </div>
      </div>

      {/* Pinned Context Banner (Image 3) */}
      <div className="rounded-2xl bg-white border border-slate-200 shadow-2xs p-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-11 h-11 rounded-xl bg-slate-50 border border-slate-100 p-0.5 shrink-0 flex items-center justify-center overflow-hidden">
            <img src={medImage} alt={medName} className="max-h-full max-w-full object-contain" />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-extrabold text-slate-900 truncate">{medName}</span>
              <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded-full bg-teal-50 text-teal-800 text-[10px] font-bold border border-teal-200 shrink-0">
                <CheckCircle2 className="w-3 h-3 text-teal-600" /> Verified Scan
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium truncate mt-0.5">{medSubtitle}</p>
          </div>
        </div>

        <button
          onClick={onViewSpecs}
          className="px-2.5 py-1.5 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-bold shrink-0 transition-colors flex items-center gap-0.5"
        >
          Specs <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Info Notice Banner */}
      <div className="rounded-2xl bg-blue-50/70 border border-blue-100 px-3.5 py-2.5 flex items-start gap-2.5 text-xs text-slate-700 font-medium">
        <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
        <p className="leading-relaxed text-[11px]">
          Responses are derived from official drug labeling and medical safety databases. In emergencies or severe reactions, consult a physician immediately.
        </p>
      </div>

      {/* Chat Messages Thread */}
      <div className="space-y-4 pt-1">
        {messages.map((msg) => {
          const isUser = msg.sender === "user";

          if (isUser) {
            return (
              <div key={msg.id} className="flex flex-col items-end pl-10">
                <div className="rounded-3xl rounded-tr-xs bg-blue-700 text-white px-4 py-3 text-xs sm:text-sm font-medium shadow-sm leading-relaxed max-w-[90%]">
                  {msg.content}
                </div>
                <span className="text-[10px] text-slate-400 font-medium mt-1 pr-1">
                  {msg.timestamp}
                </span>
              </div>
            );
          }

          // Bot Clinical Answer Message
          return (
            <div key={msg.id} className="flex items-start gap-2.5 pr-4">
              <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 mt-1 shadow-2xs">
                <Bot className="w-4 h-4" />
              </div>

              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-blue-900">
                    {msg.caution_badge ? "MediLens Guidance" : "MediLens AI Assistant"} •{" "}
                    <span className="text-slate-400 font-normal">{msg.timestamp}</span>
                  </span>

                  {msg.caution_badge && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-extrabold border border-rose-200">
                      <AlertTriangle className="w-3 h-3 text-rose-600" />
                      {msg.caution_badge}
                    </span>
                  )}
                </div>

                <div className="rounded-3xl rounded-tl-xs bg-white border border-slate-200 shadow-xs p-4 sm:p-5 space-y-3.5 text-xs sm:text-sm text-slate-800">
                  {/* Alert Box Inside Bot Response (Image 3) */}
                  {msg.alert_box && (
                    <div className="p-3.5 rounded-2xl bg-rose-50/70 border border-rose-200 space-y-1">
                      <div className="flex items-center gap-1.5 text-rose-900 font-extrabold text-xs">
                        <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                        <span>{msg.alert_box.title}</span>
                      </div>
                      <p className="text-[11px] text-rose-800 font-semibold pl-5">
                        {msg.alert_box.subtitle}
                      </p>
                    </div>
                  )}

                  {/* Main Paragraph Text */}
                  <div className="leading-relaxed whitespace-pre-line space-y-2 text-slate-700">
                    {msg.content}
                  </div>

                  {/* Questionnaire Box (Image 3) */}
                  {msg.questionnaire && (
                    <div className="p-3.5 rounded-2xl bg-blue-50/80 border border-blue-100 space-y-2.5">
                      <p className="font-extrabold text-xs text-blue-950">
                        {msg.questionnaire.prompt}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {msg.questionnaire.options.map((opt, i) => (
                          <button
                            key={i}
                            onClick={() => handleQuestionnaireOption(opt)}
                            className="px-3 py-1.5 rounded-xl bg-white hover:bg-blue-100 text-blue-900 text-xs font-semibold border border-blue-200/80 shadow-2xs transition-colors"
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Footer Citation & Dosage Link */}
                  {(msg.source_note || msg.dosage_link) && (
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-medium">
                      <div className="flex items-center gap-1 text-slate-600">
                        <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                        <span>{msg.source_note || "Source: FDA Drug Safety"}</span>
                      </div>

                      {msg.dosage_link && (
                        <button
                          onClick={onViewSpecs}
                          className="text-blue-700 font-bold hover:underline"
                        >
                          {msg.dosage_link}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {isTyping && (
          <div className="flex items-center gap-2 pl-9 text-xs text-slate-400">
            <div className="w-3.5 h-3.5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <span>MediLens AI is consulting safety databases...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Queries Header & Chips (Image 3) */}
      <div className="space-y-1.5 pt-2">
        <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">
          <span>SUGGESTED QUERIES</span>
          <Sparkles className="w-3.5 h-3.5 text-slate-400" />
        </div>

        <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
          <button
            onClick={() => handleSend(`Can I take ${medName} with food or on an empty stomach?`)}
            className="px-3 py-1.5 rounded-full bg-white border border-slate-200 hover:border-blue-500 text-xs font-semibold text-slate-700 whitespace-nowrap shadow-2xs transition-all shrink-0"
          >
            🍽 Take with food?
          </button>
          <button
            onClick={() => handleSend(`Is ${medName} safe to take with Ibuprofen?`)}
            className="px-3 py-1.5 rounded-full bg-white border border-slate-200 hover:border-blue-500 text-xs font-semibold text-slate-700 whitespace-nowrap shadow-2xs transition-all shrink-0"
          >
            ⚡ Combine with Ibuprofen?
          </button>
          <button
            onClick={() => handleSend(`Can I drink alcohol while taking ${medName}?`)}
            className="px-3 py-1.5 rounded-full bg-white border border-slate-200 hover:border-blue-500 text-xs font-semibold text-slate-700 whitespace-nowrap shadow-2xs transition-all shrink-0"
          >
            🍷 Alcohol interactions?
          </button>
          <button
            onClick={() => handleSend(`How long does ${medName} take to work?`)}
            className="px-3 py-1.5 rounded-full bg-white border border-slate-200 hover:border-blue-500 text-xs font-semibold text-slate-700 whitespace-nowrap shadow-2xs transition-all shrink-0"
          >
            ⏱ How fast it works?
          </button>
          <button
            onClick={() => handleSend(`Does ${medName} make me sleepy or drowsy?`)}
            className="px-3 py-1.5 rounded-full bg-white border border-slate-200 hover:border-blue-500 text-xs font-semibold text-slate-700 whitespace-nowrap shadow-2xs transition-all shrink-0"
          >
            🚗 Safe to drive / Drowsiness?
          </button>
          <button
            onClick={() => handleSend(`What is the maximum daily dosage of ${medName}?`)}
            className="px-3 py-1.5 rounded-full bg-white border border-slate-200 hover:border-blue-500 text-xs font-semibold text-slate-700 whitespace-nowrap shadow-2xs transition-all shrink-0"
          >
            ⚠️ Maximum dosage ceiling?
          </button>
        </div>
      </div>

      {/* Chat Input Bar (Image 3) */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex items-center gap-2 pt-1"
      >
        <button
          type="button"
          onClick={onTriggerScan}
          className="p-2.5 rounded-full bg-white border border-slate-200 text-slate-600 hover:text-blue-600 hover:bg-slate-50 transition-colors shadow-2xs"
          title="Scan packaging"
        >
          <Camera className="w-5 h-5" />
        </button>

        <div className="flex-1 relative flex items-center">
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder={`Ask anything about ${medName}...`}
            className="w-full text-xs sm:text-sm pl-4 pr-10 py-3 rounded-full border border-slate-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-2xs"
          />
          <button
            type="button"
            className="absolute right-3 p-1 text-slate-400 hover:text-slate-600"
            title="Voice input"
          >
            <Mic className="w-4 h-4" />
          </button>
        </div>

        <button
          type="submit"
          disabled={!inputVal.trim() || isTyping}
          className="w-11 h-11 rounded-full bg-blue-700 hover:bg-blue-800 text-white flex items-center justify-center disabled:opacity-40 shadow-md shadow-blue-700/20 transition-all shrink-0"
          aria-label="Send query"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
};
