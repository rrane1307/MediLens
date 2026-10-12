export type FieldStatusValue = "verified" | "uncertain" | "unavailable";

export type SystemStatus = 
  | "VERIFIED"
  | "UNCERTAIN"
  | "INSUFFICIENT_INFORMATION"
  | "REQUIRES_CONFIRMATION"
  | "NOT_FOUND";

export interface CanonicalMedicine {
  id: string;
  brand_name: string | null;
  generic_name: string | null;
  active_ingredients: string[];
  strength: string | null;
  dosage_form: string | null;
  route: string | null;
  pack_size?: string | null;
  manufacturer: string | null;
  expiry: string | null;
  warnings: string[];
  instructions: string[];
  field_status: Record<string, FieldStatusValue>;
  // UI helpers
  image_url?: string | null;
  raw_ocr_text?: string;
  scanned_at?: string;
  confidence_score?: number;
  category_labels?: string[];
  typical_price?: string;
}

export type SafetyResultType = "interaction" | "overlap" | "warning" | "label_issue";
export type SafetyResultStatus = "found" | "not_found" | "insufficient_information";
export type SafetySeverity = "critical" | "high" | "moderate" | "advisory" | "neutral";

export interface SafetyResult {
  id: string;
  type: SafetyResultType;
  status: SafetyResultStatus;
  severity: SafetySeverity;
  medicine_ids: string[];
  claim: string;
  evidence: string;
  source: string;
  requires_confirmation: boolean;
  action_guidance?: string;
  evidence_id?: string;
}

export interface EvidenceObject {
  id: string;
  claim: string;
  source: string;
  source_section: string | null;
  detected_input: string | null;
  reason: string;
  limitations: string[];
  tool_invoked?: string;
  pipeline_trace?: {
    step: string;
    description: string;
    status: "success" | "warning" | "info";
    timestamp?: string;
  }[];
}

export interface DosageGuidance {
  description: string;
  limit_warning?: string;
  frequency?: string;
  age_guidance?: string;
}

export interface SideEffectsGuidance {
  tolerability: string;
  rare_effects: string[];
  severe_alert: string;
}

export interface MedicineIntelligenceCardData {
  medicine: CanonicalMedicine;
  system_state: SystemStatus;
  // Core AI Analysis breakdown matching attached design
  what_it_is: string;
  what_it_treats: string[];
  how_it_works: string;
  key_benefits: string[];
  important_note: string;
  // Safety & Usage breakdown
  recommended_dosage: DosageGuidance;
  key_warnings: string[];
  side_effects: SideEffectsGuidance;
  storage_instructions: string[];
  plain_explanation: string;
  indications: string[];
  safety_results: SafetyResult[];
  reference_source: {
    source_name: string;
    monograph_id: string;
    last_verified: string;
    official_disclaimer: string;
  };
  uncertainty_notes: string[];
  recommended_questions: string[];
}

export interface SamplePackage {
  id: string;
  title: string;
  subtitle: string;
  brand_name: string;
  generic_name: string;
  active_ingredients: string[];
  strength: string;
  category: "Pain & Fever" | "Cold & Flu" | "Cardiovascular" | "Anticoagulant" | "Antibiotic" | "Supplements";
  image_url: string;
  raw_ocr_text: string;
  highlight: string;
  tags: string[];
  pack_size?: string;
  manufacturer?: string;
  typical_price?: string;
}

export interface AllowlistedTool {
  name: string;
  description: string;
  input_schema: string;
  output_schema: string;
  last_invoked?: string;
  invocation_count?: number;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "gemma";
  content: string;
  timestamp: string;
  caution_badge?: string;
  alert_box?: {
    title: string;
    subtitle: string;
    severity?: "danger" | "warning" | "info";
  };
  questionnaire?: {
    prompt: string;
    options: string[];
  };
  source_note?: string;
  dosage_link?: string;
  evidence_citations?: {
    claim: string;
    source: string;
    evidence_id: string;
  }[];
  limitations?: string[];
  tools_routed?: string[];
}
