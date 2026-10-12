import { Router, Request, Response } from "express";
import { extractMedicineFromTextOrImage } from "./agents/extraction.ts";
import { generateMedicineIntelligenceCard, answerContextualQuestion } from "./agents/explanation.ts";
import {
  ALLOWLISTED_TOOL_DEFINITIONS,
  get_evidence,
  check_warnings,
  check_interactions
} from "./tools/registry.ts";
import {
  savePendingScan,
  getPendingScan,
  confirmAndSaveMedicine,
  getCabinetMedicines,
  getMedicineById,
  addMedicineToCabinet,
  removeMedicineFromCabinet,
  runCabinetInteractionCheck
} from "./services/sessionCabinet.ts";
import { SAMPLE_EVALUATION_PACKAGES } from "./data/referenceDatabase.ts";
import { CanonicalMedicine } from "../src/types.ts";

export const apiRouter = Router();

// GET /api/sample-packages
apiRouter.get("/sample-packages", (req: Request, res: Response) => {
  res.json({
    status: "success",
    samples: SAMPLE_EVALUATION_PACKAGES,
  });
});

// GET /api/tools
apiRouter.get("/tools", (req: Request, res: Response) => {
  res.json({
    status: "success",
    tools: ALLOWLISTED_TOOL_DEFINITIONS,
    architecture: {
      canonical_name: "Agentic MediLens",
      router: "FunctionGemma Allowlisted Registry",
      extraction_engine: "Gemma Structured Vision & Label Extractor",
      explanation_engine: "Gemma Grounded Context Synthesizer",
      reference_sources: ["FDA DailyMed", "OpenFDA Boxed Warnings", "British National Formulary (BNF)"],
      safety_boundaries: [
        "No diagnosis",
        "No prescription generation",
        "No instructions to start, stop, or alter medication",
        "Require user confirmation before downstream checks when identity is uncertain",
        "UI distinguishes 'not found in reference' from 'safe'"
      ]
    }
  });
});

// POST /api/scan - upload image or raw text to start extraction
apiRouter.post("/scan", async (req: Request, res: Response) => {
  try {
    const { raw_text, image_base64, mime_type } = req.body;

    if (!raw_text && !image_base64) {
      return res.status(400).json({
        error: "Missing input. Please provide either raw_text or image_base64.",
      });
    }

    const extraction = await extractMedicineFromTextOrImage(
      raw_text,
      image_base64,
      mime_type || "image/jpeg"
    );

    if (image_base64 && !extraction.medicine.image_url) {
      extraction.medicine.image_url = image_base64;
    }

    // Attach extracted details for card synthesis
    (extraction.medicine as any).extracted_details = extraction.extracted_details;

    // Build the complete Medicine Intelligence Card immediately
    const cardData = await generateMedicineIntelligenceCard(extraction.medicine);

    // Save the fully enriched medicine to active session
    confirmAndSaveMedicine(cardData.medicine);

    res.json({
      status: "success",
      scan_id: cardData.medicine.id,
      medicine: cardData.medicine,
      card_data: cardData,
      raw_ocr_text: extraction.raw_text,
      confidence_score: extraction.confidence_score,
      uncertain_fields: extraction.uncertain_fields,
      unavailable_fields: extraction.unavailable_fields,
    });
  } catch (err: any) {
    console.error("Scan extraction error:", err);
    res.status(500).json({ error: "Failed to extract medicine label", details: err.message });
  }
});

// POST /api/scan/:id/confirm - confirm or edit fields
apiRouter.post("/scan/:id/confirm", async (req: Request, res: Response) => {
  try {
    const scanId = req.params.id;
    const existing = getPendingScan(scanId);

    const updatedFields: Partial<CanonicalMedicine> = req.body.medicine || req.body;

    const confirmed: CanonicalMedicine = {
      ...(existing || {}),
      ...updatedFields,
      id: scanId,
      field_status: {
        ...(existing?.field_status || {}),
        ...(updatedFields.field_status || {}),
      },
    } as CanonicalMedicine;

    // Mark updated fields as verified by user
    Object.keys(updatedFields).forEach((key) => {
      if (key !== "field_status" && key !== "id" && updatedFields[key as keyof CanonicalMedicine]) {
        confirmed.field_status[key] = "verified";
      }
    });

    confirmAndSaveMedicine(confirmed);

    // Automatically build Medicine Intelligence Card data
    const cardData = await generateMedicineIntelligenceCard(confirmed);

    res.json({
      status: "success",
      medicine: confirmed,
      card_data: cardData,
    });
  } catch (err: any) {
    console.error("Confirm error:", err);
    res.status(500).json({ error: "Failed to confirm medicine fields", details: err.message });
  }
});

// GET /api/medicines/:id - return Medicine Intelligence Card data
apiRouter.get("/medicines/:id", async (req: Request, res: Response) => {
  try {
    const medId = req.params.id;
    const med = getMedicineById(medId);

    if (!med) {
      return res.status(404).json({ error: "Medicine not found in active session." });
    }

    const cardData = await generateMedicineIntelligenceCard(med);
    res.json({
      status: "success",
      card_data: cardData,
    });
  } catch (err: any) {
    console.error("Get medicine error:", err);
    res.status(500).json({ error: "Failed to load medicine intelligence card", details: err.message });
  }
});

// POST /api/medicines/:id/check - run supported single-medicine checks
apiRouter.post("/medicines/:id/check", async (req: Request, res: Response) => {
  try {
    const medId = req.params.id;
    const med = getMedicineById(medId);

    if (!med) {
      return res.status(404).json({ error: "Medicine not found." });
    }

    const warnings = check_warnings(med);
    res.json({
      status: "success",
      medicine_id: medId,
      warnings,
    });
  } catch (err: any) {
    console.error("Check medicine error:", err);
    res.status(500).json({ error: "Failed to run safety checks", details: err.message });
  }
});

// GET /api/session/medicines - list current session medicines
apiRouter.get("/session/medicines", (req: Request, res: Response) => {
  const medicines = getCabinetMedicines();
  res.json({
    status: "success",
    medicines,
    total: medicines.length,
  });
});

// POST /api/session/medicines - add medicine to cabinet
apiRouter.post("/session/medicines", async (req: Request, res: Response) => {
  try {
    const { medicine_id, medicine } = req.body;
    let toAdd = medicine;

    if (!toAdd && medicine_id) {
      toAdd = getMedicineById(medicine_id);
    }

    if (!toAdd) {
      return res.status(400).json({ error: "Medicine data or valid medicine_id required." });
    }

    const updatedCabinet = addMedicineToCabinet(toAdd);
    const interactionSummary = runCabinetInteractionCheck();

    res.json({
      status: "success",
      cabinet: updatedCabinet,
      interaction_summary: interactionSummary,
    });
  } catch (err: any) {
    console.error("Add to cabinet error:", err);
    res.status(500).json({ error: "Failed to add medicine to cabinet", details: err.message });
  }
});

// DELETE /api/session/medicines/:id - remove medicine from cabinet
apiRouter.delete("/session/medicines/:id", (req: Request, res: Response) => {
  const updated = removeMedicineFromCabinet(req.params.id);
  const interactionSummary = runCabinetInteractionCheck();
  res.json({
    status: "success",
    cabinet: updated,
    interaction_summary: interactionSummary,
  });
});

// POST /api/session/check-interactions - run pairwise interaction checks for all cabinet items
apiRouter.post("/session/check-interactions", (req: Request, res: Response) => {
  try {
    const summary = runCabinetInteractionCheck();
    res.json({
      status: "success",
      ...summary,
    });
  } catch (err: any) {
    console.error("Cabinet check interactions error:", err);
    res.status(500).json({ error: "Failed to check interactions", details: err.message });
  }
});

// POST /api/chat - grounded Q&A using current context
apiRouter.post("/chat", async (req: Request, res: Response) => {
  try {
    const { question, current_medicine_id, current_medicine, previous_messages } = req.body;

    if (!question || typeof question !== "string") {
      return res.status(400).json({ error: "Question string is required." });
    }

    const currentMed = current_medicine || (current_medicine_id ? getMedicineById(current_medicine_id) : null);
    const cabinet = getCabinetMedicines();

    const responseMessage = await answerContextualQuestion({
      question,
      current_medicine: currentMed,
      cabinet_medicines: cabinet,
      previous_messages,
    });

    res.json({
      status: "success",
      message: responseMessage,
    });
  } catch (err: any) {
    console.error("Chat error:", err);
    res.status(500).json({ error: "Failed to answer question", details: err.message });
  }
});

// GET /api/evidence/:id - return full evidence provenance chain
apiRouter.get("/evidence/:id", (req: Request, res: Response) => {
  const ev = get_evidence(req.params.id);
  if (!ev) {
    return res.status(404).json({
      error: "Evidence object not found.",
      id: req.params.id,
    });
  }
  res.json({
    status: "success",
    evidence: ev,
  });
});
