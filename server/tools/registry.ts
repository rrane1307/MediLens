import {
  REFERENCE_MONOGRAPHS,
  DETERMINISTIC_INTERACTION_RULES,
  ReferenceMonograph,
  InteractionRule
} from "../data/referenceDatabase.ts";
import type {
  CanonicalMedicine,
  SafetyResult,
  EvidenceObject,
  SystemStatus,
  AllowlistedTool
} from "../../src/types.ts";

// Tool Registry Metadata for FunctionGemma Router
export const ALLOWLISTED_TOOL_DEFINITIONS: AllowlistedTool[] = [
  {
    name: "extract_label",
    description: "Extracts canonical medicine schema and tags field uncertainties from raw visible label text.",
    input_schema: "{ raw_text: string }",
    output_schema: "CanonicalMedicine",
    invocation_count: 0
  },
  {
    name: "identify_medicine",
    description: "Matches extracted medicine candidate against controlled clinical reference database.",
    input_schema: "{ brand_name?: string, generic_name?: string, active_ingredients?: string[] }",
    output_schema: "{ normalized_key: string, system_status: SystemStatus, confidence: number }",
    invocation_count: 0
  },
  {
    name: "lookup_medicine",
    description: "Retrieves verified FDA/clinical monograph, indications, and official safety warnings.",
    input_schema: "{ normalized_key: string }",
    output_schema: "ReferenceMonograph",
    invocation_count: 0
  },
  {
    name: "check_warnings",
    description: "Evaluates deterministic single-medicine black box warnings and safety guidelines.",
    input_schema: "{ medicine: CanonicalMedicine }",
    output_schema: "SafetyResult[]",
    invocation_count: 0
  },
  {
    name: "check_interactions",
    description: "Performs deterministic pairwise interaction and duplicate ingredient checks.",
    input_schema: "{ medicine_a: CanonicalMedicine, medicine_b: CanonicalMedicine }",
    output_schema: "SafetyResult[]",
    invocation_count: 0
  },
  {
    name: "compare_medicines",
    description: "Compares active ingredients and therapeutic classes between medications.",
    input_schema: "{ medicine_a: CanonicalMedicine, medicine_b: CanonicalMedicine }",
    output_schema: "{ duplicate_ingredients: string[], same_class: boolean, summary: string }",
    invocation_count: 0
  },
  {
    name: "get_evidence",
    description: "Assembles full provenance chain from detected label through reference source to rule output.",
    input_schema: "{ evidence_id: string }",
    output_schema: "EvidenceObject",
    invocation_count: 0
  }
];

// Track tool invocations for the architecture inspector
export function recordToolInvocation(name: string) {
  const tool = ALLOWLISTED_TOOL_DEFINITIONS.find((t) => t.name === name);
  if (tool) {
    tool.invocation_count = (tool.invocation_count || 0) + 1;
    tool.last_invoked = new Date().toISOString();
  }
}

// In-memory Evidence Store
const evidenceStore = new Map<string, EvidenceObject>();

export function storeEvidence(evidence: EvidenceObject) {
  evidenceStore.set(evidence.id, evidence);
}

export function getStoredEvidence(id: string): EvidenceObject | null {
  return evidenceStore.get(id) || null;
}

// 1. identify_medicine
export function identify_medicine(
  brand_name?: string | null,
  generic_name?: string | null,
  active_ingredients?: string[]
): {
  normalized_key: string | null;
  system_status: SystemStatus;
  confidence: number;
  matched_monograph?: ReferenceMonograph;
} {
  recordToolInvocation("identify_medicine");

  const candidates = [
    brand_name?.toLowerCase().trim(),
    generic_name?.toLowerCase().trim(),
    ...(active_ingredients || []).map((i) => i.toLowerCase().trim()),
  ].filter(Boolean) as string[];

  if (candidates.length === 0) {
    return {
      normalized_key: null,
      system_status: "INSUFFICIENT_INFORMATION",
      confidence: 0,
    };
  }

  // Exact or substring match in reference database
  for (const [key, monograph] of Object.entries(REFERENCE_MONOGRAPHS)) {
    for (const cand of candidates) {
      if (
        cand.includes(key) ||
        key.includes(cand) ||
        monograph.brand_names.some((b) => b.toLowerCase().includes(cand) || cand.includes(b.toLowerCase())) ||
        monograph.active_ingredients.some((ai) => ai.toLowerCase().includes(cand) || cand.includes(ai.toLowerCase()))
      ) {
        return {
          normalized_key: key,
          system_status: "VERIFIED",
          confidence: 0.96,
          matched_monograph: monograph,
        };
      }
    }
  }

  return {
    normalized_key: null,
    system_status: "NOT_FOUND",
    confidence: 0.2,
  };
}

// 2. lookup_medicine
export function lookup_medicine(normalized_key: string): ReferenceMonograph | null {
  recordToolInvocation("lookup_medicine");
  return REFERENCE_MONOGRAPHS[normalized_key.toLowerCase()] || null;
}

// 3. check_warnings
export function check_warnings(medicine: CanonicalMedicine): SafetyResult[] {
  recordToolInvocation("check_warnings");
  const results: SafetyResult[] = [];
  const idResult = identify_medicine(medicine.brand_name, medicine.generic_name, medicine.active_ingredients);

  if (!idResult.normalized_key || !idResult.matched_monograph) {
    // If identity is materially uncertain, PRD specifies:
    // "Do not run downstream checks when medicine identity is materially uncertain."
    results.push({
      id: `warn-uncertain-${medicine.id}`,
      type: "label_issue",
      status: "insufficient_information",
      severity: "advisory",
      medicine_ids: [medicine.id],
      claim: "Medicine identity not matched in configured reference dataset.",
      evidence: "The active ingredient or brand name extracted from the label could not be verified against the configured reference database. Downstream safety checks are halted until identity is confirmed.",
      source: "MediLens Deterministic Safety Gate",
      requires_confirmation: true,
      action_guidance: "Please review and edit the active ingredient or brand name in the confirmation screen.",
    });
    return results;
  }

  const mono = idResult.matched_monograph;

  // Black box warnings
  mono.black_box_warnings.forEach((bbw, idx) => {
    const evidenceId = `ev-bbw-${medicine.id}-${idx}`;
    const safetyRes: SafetyResult = {
      id: `warn-bbw-${medicine.id}-${idx}`,
      type: "warning",
      status: "found",
      severity: "critical",
      medicine_ids: [medicine.id],
      claim: `Black Box Safety Warning: ${mono.generic_name}`,
      evidence: bbw,
      source: mono.reference_source,
      requires_confirmation: true,
      action_guidance: "Review strict administration guidelines and discuss with a qualified healthcare professional.",
      evidence_id: evidenceId,
    };
    results.push(safetyRes);

    storeEvidence({
      id: evidenceId,
      claim: safetyRes.claim,
      source: mono.reference_source,
      source_section: mono.source_section,
      detected_input: `Identified active ingredient: ${mono.active_ingredients.join(", ")} from label '${medicine.brand_name || medicine.generic_name}'`,
      reason: `Matched verified monograph ${mono.id} containing official Black Box Warning.`,
      limitations: [
        "Derived solely from official FDA / clinical monographs in reference dataset.",
        "Does not account for individual patient renal function, age, or undisclosed medical conditions."
      ],
      tool_invoked: "check_warnings",
      pipeline_trace: [
        { step: "OCR / Vision", description: "Read label packaging text", status: "success" },
        { step: "Gemma Extraction", description: `Extracted active ingredient: ${mono.active_ingredients.join(", ")}`, status: "success" },
        { step: "Reference Lookup", description: `Matched ${mono.generic_name} (${mono.id})`, status: "success" },
        { step: "Deterministic Rule Engine", description: "Triggered FDA Black Box safety warning rule", status: "warning" }
      ]
    });
  });

  // Precautions / Alcohol / Max daily
  if (mono.max_daily_dose) {
    const evidenceId = `ev-max-${medicine.id}`;
    const safetyRes: SafetyResult = {
      id: `warn-max-${medicine.id}`,
      type: "warning",
      status: "found",
      severity: "high",
      medicine_ids: [medicine.id],
      claim: `Maximum Daily Dosage Limit: ${mono.max_daily_dose}`,
      evidence: mono.key_precautions[1] || mono.black_box_warnings[0] || `Do not exceed ${mono.max_daily_dose}.`,
      source: mono.reference_source,
      requires_confirmation: false,
      action_guidance: "Track cumulative daily doses across all medications to avoid exceeding this limit.",
      evidence_id: evidenceId,
    };
    results.push(safetyRes);

    storeEvidence({
      id: evidenceId,
      claim: safetyRes.claim,
      source: mono.reference_source,
      source_section: mono.source_section,
      detected_input: `Strength: ${medicine.strength || "Standard unit"}`,
      reason: `Standard therapeutic upper ceiling defined in monograph ${mono.id}.`,
      limitations: ["Calculated based on standard adult weight; elderly or hepatic impairment may require lower ceilings."],
      tool_invoked: "check_warnings",
      pipeline_trace: [
        { step: "Dosage Analysis", description: `Max threshold: ${mono.max_daily_dose}`, status: "info" }
      ]
    });
  }

  return results;
}

// 4. check_interactions
export function check_interactions(
  medicine_a: CanonicalMedicine,
  medicine_b: CanonicalMedicine
): SafetyResult[] {
  recordToolInvocation("check_interactions");
  const results: SafetyResult[] = [];

  const idA = identify_medicine(medicine_a.brand_name, medicine_a.generic_name, medicine_a.active_ingredients);
  const idB = identify_medicine(medicine_b.brand_name, medicine_b.generic_name, medicine_b.active_ingredients);

  const keyA = idA.normalized_key;
  const keyB = idB.normalized_key;

  if (!keyA || !keyB) {
    results.push({
      id: `int-uncertain-${medicine_a.id}-${medicine_b.id}`,
      type: "interaction",
      status: "insufficient_information",
      severity: "advisory",
      medicine_ids: [medicine_a.id, medicine_b.id],
      claim: "Unable to complete full interaction evaluation: incomplete identity.",
      evidence: `One or both medicines (${medicine_a.brand_name || "Med A"} & ${medicine_b.brand_name || "Med B"}) are not confirmed in the reference database.`,
      source: "MediLens Deterministic Safety Gate",
      requires_confirmation: true,
      action_guidance: "Confirm active ingredients for both items to re-run automated interaction checks."
    });
    return results;
  }

  // Check 1: Duplicate Active Ingredient Overlap
  const ingredientsA = (medicine_a.active_ingredients || []).map((i) => i.toLowerCase().trim());
  const ingredientsB = (medicine_b.active_ingredients || []).map((i) => i.toLowerCase().trim());

  // Also include monograph canonical active ingredients
  if (idA.matched_monograph) {
    idA.matched_monograph.active_ingredients.forEach((i) => ingredientsA.push(i.toLowerCase().trim()));
  }
  if (idB.matched_monograph) {
    idB.matched_monograph.active_ingredients.forEach((i) => ingredientsB.push(i.toLowerCase().trim()));
  }

  const commonIngredients = Array.from(new Set(ingredientsA.filter((ing) => ingredientsB.includes(ing))));

  if (commonIngredients.length > 0) {
    const evidenceId = `ev-overlap-${medicine_a.id}-${medicine_b.id}`;
    const overlapRes: SafetyResult = {
      id: `ovr-${medicine_a.id}-${medicine_b.id}`,
      type: "overlap",
      status: "found",
      severity: "critical",
      medicine_ids: [medicine_a.id, medicine_b.id],
      claim: `Duplicate Active Ingredient: ${commonIngredients.join(", ").toUpperCase()} is present in both medications!`,
      evidence: `Both ${medicine_a.brand_name || "Medicine A"} and ${medicine_b.brand_name || "Medicine B"} deliver ${commonIngredients.join(", ")}. Taking them concurrently risks accidental toxic overdose.`,
      source: "FDA Safe Use Initiative: Duplicate Active Ingredient Rule",
      requires_confirmation: true,
      action_guidance: "Do not combine these products without explicit pharmacist or doctor verification.",
      evidence_id: evidenceId
    };
    results.push(overlapRes);

    storeEvidence({
      id: evidenceId,
      claim: overlapRes.claim,
      source: "FDA DailyMed & Clinical Pharmacokinetics Compendium",
      source_section: "Duplicate Active Ingredient Toxicity",
      detected_input: `Medicine A ingredients: [${medicine_a.active_ingredients.join(", ")}]; Medicine B ingredients: [${medicine_b.active_ingredients.join(", ")}]`,
      reason: `Exact active ingredient match found on '${commonIngredients.join(", ")}'`,
      limitations: [
        "Assumes oral formulations taken on the same 24-hour cycle.",
        "Does not calculate exact milligram total without user dosing schedule."
      ],
      tool_invoked: "check_interactions",
      pipeline_trace: [
        { step: "Normalization", description: `Active ingredients normalized: ${commonIngredients.join(", ")}`, status: "success" },
        { step: "Deterministic Rule", description: "Duplicate ingredient rule triggered", status: "warning" },
        { step: "Evidence Synthesis", description: "Assembled duplicate toxicity alert", status: "warning" }
      ]
    });
  }

  // Check 2: Pairwise Interaction from Curated Rules
  let ruleFound = false;
  for (const rule of DETERMINISTIC_INTERACTION_RULES) {
    const matchDirect = rule.drug_a === keyA && rule.drug_b === keyB;
    const matchReverse = rule.drug_a === keyB && rule.drug_b === keyA;

    if (matchDirect || matchReverse) {
      ruleFound = true;
      const evidenceId = `ev-rule-${rule.id}-${medicine_a.id}-${medicine_b.id}`;
      const ruleResult: SafetyResult = {
        id: `int-${rule.id}-${medicine_a.id}-${medicine_b.id}`,
        type: rule.type,
        status: "found",
        severity: rule.severity,
        medicine_ids: [medicine_a.id, medicine_b.id],
        claim: rule.claim,
        evidence: rule.evidence,
        source: rule.source,
        requires_confirmation: true,
        action_guidance: rule.action_guidance,
        evidence_id: evidenceId
      };
      results.push(ruleResult);

      storeEvidence({
        id: evidenceId,
        claim: rule.claim,
        source: rule.source,
        source_section: rule.source_section,
        detected_input: `Pair: ${keyA} (${medicine_a.brand_name}) + ${keyB} (${medicine_b.brand_name})`,
        reason: `Matched verified clinical interaction rule ${rule.id}.`,
        limitations: [
          "Derived from clinical interaction reference studies.",
          "Individual response depends on dose, duration, renal/hepatic clearance, and co-morbidities."
        ],
        tool_invoked: "check_interactions",
        pipeline_trace: [
          { step: "Pair Matching", description: `Matched pair ${keyA} <-> ${keyB}`, status: "success" },
          { step: "Rule Engine", description: `Evaluated ${rule.id} [${rule.severity.toUpperCase()}]`, status: "warning" },
          { step: "Clinical Action Guidance", description: rule.action_guidance, status: "info" }
        ]
      });
    }
  }

  // Check 3: If no known interaction found, explicitly distinguish from "safe" as mandated by PRD
  // PRD: "UI distinguishes 'no result found' from 'safe'. Use 'not found in the configured reference' instead of claiming universal safety."
  if (!ruleFound && commonIngredients.length === 0) {
    const evidenceId = `ev-notfound-${medicine_a.id}-${medicine_b.id}`;
    const notFoundResult: SafetyResult = {
      id: `int-notfound-${medicine_a.id}-${medicine_b.id}`,
      type: "interaction",
      status: "not_found",
      severity: "neutral",
      medicine_ids: [medicine_a.id, medicine_b.id],
      claim: `No documented interactions found between ${medicine_a.brand_name || keyA} and ${medicine_b.brand_name || keyB} in the configured reference dataset.`,
      evidence: "No known adverse drug-drug interactions or shared active ingredients were identified in the configured clinical reference dataset (FDA DailyMed / OpenFDA / BNF).",
      source: "MediLens Reference Source (FDA DailyMed / BNF Rev 2025)",
      requires_confirmation: false,
      action_guidance: "Note: 'Not found in reference' does NOT guarantee universal clinical safety. Always consult a pharmacist or doctor regarding your complete medication regimen.",
      evidence_id: evidenceId
    };
    results.push(notFoundResult);

    storeEvidence({
      id: evidenceId,
      claim: notFoundResult.claim,
      source: notFoundResult.source,
      source_section: "Interaction Screen Complete",
      detected_input: `${keyA} + ${keyB}`,
      reason: "Query against reference rules returned zero matching interaction pairs.",
      limitations: [
        "This evaluation is limited to the configured reference dataset.",
        "Unlisted herbal supplements, off-label combinations, food interactions, and idiosyncratic reactions are not captured."
      ],
      tool_invoked: "check_interactions",
      pipeline_trace: [
        { step: "Pair Query", description: `Queried ${keyA} + ${keyB} against rule repository`, status: "success" },
        { step: "Result", description: "Zero interaction records matched", status: "info" },
        { step: "Safety Boundary", description: "Emitted 'not found in reference' state (not claiming absolute safety)", status: "info" }
      ]
    });
  }

  return results;
}

// 5. compare_medicines
export function compare_medicines(
  medicine_a: CanonicalMedicine,
  medicine_b: CanonicalMedicine
): {
  duplicate_ingredients: string[];
  same_class: boolean;
  class_a?: string;
  class_b?: string;
  summary: string;
} {
  recordToolInvocation("compare_medicines");
  const idA = identify_medicine(medicine_a.brand_name, medicine_a.generic_name, medicine_a.active_ingredients);
  const idB = identify_medicine(medicine_b.brand_name, medicine_b.generic_name, medicine_b.active_ingredients);

  const ingA = (medicine_a.active_ingredients || []).map((i) => i.toLowerCase().trim());
  const ingB = (medicine_b.active_ingredients || []).map((i) => i.toLowerCase().trim());
  const duplicates = ingA.filter((i) => ingB.includes(i));

  const classA = idA.matched_monograph?.drug_class;
  const classB = idB.matched_monograph?.drug_class;
  const sameClass = Boolean(classA && classB && classA.toLowerCase() === classB.toLowerCase());

  let summary = `Comparing ${medicine_a.brand_name || "Medicine A"} and ${medicine_b.brand_name || "Medicine B"}.`;
  if (duplicates.length > 0) {
    summary += ` WARNING: Duplicate active ingredients detected (${duplicates.join(", ")}).`;
  }
  if (sameClass) {
    summary += ` Both belong to the class: ${classA}. Potential therapeutic duplication.`;
  }

  return {
    duplicate_ingredients: duplicates,
    same_class: sameClass,
    class_a: classA,
    class_b: classB,
    summary,
  };
}

// 6. get_evidence
export function get_evidence(evidence_id: string): EvidenceObject | null {
  recordToolInvocation("get_evidence");
  return getStoredEvidence(evidence_id);
}
