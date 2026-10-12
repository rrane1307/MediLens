export interface ReferenceMonograph {
  id: string;
  normalized_name: string;
  brand_names: string[];
  generic_name: string;
  active_ingredients: string[];
  drug_class: string;
  standard_strengths: string[];
  common_dosage_forms: string[];
  fda_indications: string[];
  plain_explanation: string;
  black_box_warnings: string[];
  key_precautions: string[];
  max_daily_dose?: string;
  contraindications: string[];
  reference_source: string;
  source_section: string;
  last_reviewed: string;
}

export interface InteractionRule {
  id: string;
  drug_a: string; // normalized ingredient or class
  drug_b: string; // normalized ingredient or class
  type: "interaction" | "overlap";
  severity: "critical" | "high" | "moderate" | "advisory";
  claim: string;
  evidence: string;
  source: string;
  source_section: string;
  action_guidance: string;
}

export const REFERENCE_MONOGRAPHS: Record<string, ReferenceMonograph> = {
  acetaminophen: {
    id: "MONO-APAP-001",
    normalized_name: "acetaminophen",
    brand_names: ["Tylenol", "Panadol", "Mapap", "Feverall"],
    generic_name: "Acetaminophen (Paracetamol)",
    active_ingredients: ["Acetaminophen"],
    drug_class: "Analgesic and Antipyretic",
    standard_strengths: ["325 mg", "500 mg", "650 mg"],
    common_dosage_forms: ["Tablet", "Caplet", "Liquid suspension", "Suppository"],
    fda_indications: ["Temporary relief of minor aches and pains", "Temporary reduction of fever"],
    plain_explanation: "Acetaminophen relieves mild-to-moderate pain and reduces fever. It does not reduce inflammation like NSAIDs (ibuprofen or naproxen) do, and it is gentler on the stomach when taken at recommended dosages.",
    black_box_warnings: [
      "Severe liver damage (hepatotoxicity) may occur if taking more than 4,000 mg in 24 hours, taking with other drugs containing acetaminophen, or consuming 3 or more alcoholic drinks every day while using this product."
    ],
    key_precautions: [
      "Check all labels carefully: hundreds of prescription and OTC medications (such as cold, flu, and cough formulas) contain acetaminophen.",
      "Do not exceed maximum daily dose of 4,000 mg (many clinicians recommend 3,000 mg max for older adults or regular users).",
      "Avoid or strictly limit alcohol consumption."
    ],
    max_daily_dose: "4,000 mg / 24 hours for adults",
    contraindications: ["Severe active liver disease", "Hypersensitivity to acetaminophen"],
    reference_source: "FDA DailyMed & USP-DI Monograph Rev 2025",
    source_section: "Section 5: Warnings - Hepatotoxicity Risk",
    last_reviewed: "2025-11-15"
  },

  ibuprofen: {
    id: "MONO-IBU-002",
    normalized_name: "ibuprofen",
    brand_names: ["Advil", "Motrin", "Nuprin", "Midol Liquid Gels"],
    generic_name: "Ibuprofen",
    active_ingredients: ["Ibuprofen"],
    drug_class: "Nonsteroidal Anti-inflammatory Drug (NSAID)",
    standard_strengths: ["200 mg", "400 mg", "600 mg", "800 mg"],
    common_dosage_forms: ["Tablet", "Capsule", "Liqui-Gel", "Oral suspension"],
    fda_indications: ["Relief of pain and inflammation from arthritis", "Menstrual cramps", "Headache", "Fever"],
    plain_explanation: "Ibuprofen is an NSAID that works by reducing hormones that cause inflammation, pain, and fever in the body. It should usually be taken with food or milk to prevent stomach discomfort.",
    black_box_warnings: [
      "Cardiovascular Risk: NSAIDs may cause an increased risk of serious cardiovascular thrombotic events, myocardial infarction, and stroke, which can be fatal. Risk may increase with duration of use.",
      "Gastrointestinal Risk: NSAIDs cause an increased risk of serious gastrointestinal adverse events including bleeding, ulceration, and perforation of the stomach or intestines."
    ],
    key_precautions: [
      "Take with meals or milk to minimize gastrointestinal distress.",
      "Do not combine with other NSAIDs (such as naproxen or high-dose aspirin) or blood thinners (such as warfarin) without physician guidance.",
      "Avoid use during the third trimester of pregnancy due to premature closure of ductus arteriosus.",
      "Caution in patients with renal impairment, hypertension, or heart failure."
    ],
    max_daily_dose: "1,200 mg / 24 hours OTC (3,200 mg under direct medical supervision)",
    contraindications: ["Known allergy to NSAIDs or aspirin-induced asthma", "Coronary artery bypass graft (CABG) surgery period", "Active GI bleeding"],
    reference_source: "FDA DailyMed / OpenFDA Boxed Warning Database",
    source_section: "Boxed Warning - NSAID Class Warning",
    last_reviewed: "2025-10-20"
  },

  naproxen: {
    id: "MONO-NAP-003",
    normalized_name: "naproxen",
    brand_names: ["Aleve", "Naprosyn", "Anaprox"],
    generic_name: "Naproxen Sodium",
    active_ingredients: ["Naproxen Sodium"],
    drug_class: "Nonsteroidal Anti-inflammatory Drug (NSAID)",
    standard_strengths: ["220 mg", "275 mg", "500 mg", "550 mg"],
    common_dosage_forms: ["Tablet", "Caplet", "Liquid Gel"],
    fda_indications: ["Temporary relief of minor aches, pains, muscle aches, backaches, arthritis, and fever"],
    plain_explanation: "Naproxen is a long-acting NSAID that provides up to 12 hours of relief from pain, stiffness, and inflammation. Because it belongs to the NSAID family, it must never be doubled up with ibuprofen.",
    black_box_warnings: [
      "Serious cardiovascular thrombotic events, myocardial infarction, and stroke risk.",
      "Serious gastrointestinal inflammation, ulceration, bleeding, and perforation of stomach or intestines."
    ],
    key_precautions: [
      "Take with a full glass of water and food if stomach upset occurs.",
      "Avoid combining with other NSAID medications (ibuprofen, aspirin) or anticoagulants.",
      "Limit continuous OTC use to no more than 10 days for pain or 3 days for fever unless directed by a doctor."
    ],
    max_daily_dose: "660 mg (OTC) in 24 hours",
    contraindications: ["History of asthma, urticaria, or allergic-type reactions after taking aspirin or other NSAIDs"],
    reference_source: "FDA DailyMed NSAID Monograph",
    source_section: "Warnings and Adverse Reactions (GI/CV)",
    last_reviewed: "2025-09-12"
  },

  warfarin: {
    id: "MONO-WAR-004",
    normalized_name: "warfarin",
    brand_names: ["Coumadin", "Jantoven"],
    generic_name: "Warfarin Sodium",
    active_ingredients: ["Warfarin Sodium"],
    drug_class: "Anticoagulant (Vitamin K Antagonist)",
    standard_strengths: ["1 mg", "2 mg", "2.5 mg", "3 mg", "4 mg", "5 mg", "6 mg", "7.5 mg", "10 mg"],
    common_dosage_forms: ["Tablet"],
    fda_indications: ["Prophylaxis and treatment of venous thrombosis, pulmonary embolism, thromboembolic complications associated with atrial fibrillation or cardiac valve replacement"],
    plain_explanation: "Warfarin is a powerful prescription blood thinner that prevents harmful blood clots from forming inside blood vessels. Because it alters blood clotting, it is extremely sensitive to interactions with other medicines, including everyday pain relievers.",
    black_box_warnings: [
      "Bleeding Risk: Warfarin can cause major or fatal bleeding. Regular monitoring of INR (International Normalized Ratio) is required. Numerous medications, OTC drugs, and dietary items interact with Warfarin to alter clotting."
    ],
    key_precautions: [
      "Strictly avoid OTC NSAIDs (Ibuprofen, Naproxen, Aspirin) unless specifically prescribed by a physician, as they markedly increase hemorrhage risk.",
      "Maintain consistent dietary intake of Vitamin K (e.g. green leafy vegetables).",
      "Seek emergency medical evaluation for unusual bruising, pink/red urine, black stools, or severe headaches."
    ],
    contraindications: ["Pregnancy (causes fetal hemorrhage/malformations)", "Severe hepatic disease", "Active bleeding or hemorrhagic tendencies"],
    reference_source: "FDA Black Box Warning Reference / BNF Section 2.8.2",
    source_section: "Black Box Warning: Major Hemorrhagic Complications",
    last_reviewed: "2025-12-01"
  },

  lisinopril: {
    id: "MONO-LIS-005",
    normalized_name: "lisinopril",
    brand_names: ["Prinivil", "Zestril", "Qbrelis"],
    generic_name: "Lisinopril",
    active_ingredients: ["Lisinopril"],
    drug_class: "Angiotensin Converting Enzyme (ACE) Inhibitor",
    standard_strengths: ["2.5 mg", "5 mg", "10 mg", "20 mg", "30 mg", "40 mg"],
    common_dosage_forms: ["Tablet", "Oral solution"],
    fda_indications: ["Hypertension (high blood pressure)", "Adjunctive therapy in heart failure", "Acute myocardial infarction survival improvement"],
    plain_explanation: "Lisinopril relaxes and widens blood vessels, lowering blood pressure and making it easier for the heart to pump blood around the body.",
    black_box_warnings: [
      "Fetal Toxicity: When pregnancy is detected, discontinue Lisinopril as soon as possible. Drugs that act directly on the renin-angiotensin system can cause injury and death to the developing fetus."
    ],
    key_precautions: [
      "May cause persistent dry, tickly cough. Report to physician if intolerable.",
      "Monitor potassium levels: risk of hyperkalemia when combined with potassium supplements, potassium salt substitutes, or potassium-sparing diuretics.",
      "NSAIDs (such as ibuprofen or naproxen) can blunt Lisinopril's blood-pressure lowering effect and increase risk of acute kidney impairment."
    ],
    contraindications: ["History of angioedema related to previous ACE inhibitor treatment", "Concomitant use with aliskiren in patients with diabetes", "Pregnancy"],
    reference_source: "FDA DailyMed & Clinical Pharmacokinetics Compendium",
    source_section: "Black Box Warning & Renal Monitoring 5.1",
    last_reviewed: "2025-10-10"
  },

  amoxicillin: {
    id: "MONO-AMX-006",
    normalized_name: "amoxicillin",
    brand_names: ["Amoxil", "Moxatag", "Trimox"],
    generic_name: "Amoxicillin Trihydrate",
    active_ingredients: ["Amoxicillin"],
    drug_class: "Beta-lactam Antibiotic (Penicillin group)",
    standard_strengths: ["250 mg", "500 mg", "875 mg"],
    common_dosage_forms: ["Capsule", "Tablet", "Chewable tablet", "Oral suspension"],
    fda_indications: ["Treatment of infections of the ear, nose, throat, genitourinary tract, skin, and lower respiratory tract caused by susceptible microorganisms"],
    plain_explanation: "Amoxicillin is an antibiotic medication that stops bacterial growth. It treats bacterial infections only and has zero effect against viral infections such as colds or influenza.",
    black_box_warnings: [],
    key_precautions: [
      "Complete the entire prescribed course even if symptoms resolve quickly.",
      "Serious and occasionally fatal hypersensitivity (anaphylactic) reactions have been reported in patients on penicillin therapy.",
      "Seek prompt medical attention if developing hives, severe rash, facial swelling, or breathing difficulty."
    ],
    contraindications: ["History of serious hypersensitivity reaction to amoxicillin or other beta-lactam antibiotics (e.g. penicillins, cephalosporins)"],
    reference_source: "FDA DailyMed & WHO Essential Medicines Formulary",
    source_section: "Section 5: Warnings - Anaphylaxis",
    last_reviewed: "2025-11-01"
  },

  nyquil: {
    id: "MONO-NYQ-007",
    normalized_name: "nyquil",
    brand_names: ["Vicks NyQuil Cold & Flu", "Nighttime Cold/Flu Relief"],
    generic_name: "Acetaminophen, Dextromethorphan HBr, Doxylamine Succinate",
    active_ingredients: ["Acetaminophen", "Dextromethorphan HBr", "Doxylamine Succinate"],
    drug_class: "Combination Cold/Cough and Analgesic Preparation",
    standard_strengths: ["650 mg APAP / 30 mg DXM / 12.5 mg Doxylamine per 30 mL"],
    common_dosage_forms: ["Liquid syrup", "LiquiCaps"],
    fda_indications: ["Temporary relief of cold and flu symptoms including cough, minor throat irritation, headache, minor body aches, and runny nose"],
    plain_explanation: "NyQuil is a multi-symptom cold medication containing an analgesic/fever reducer (acetaminophen), a cough suppressant (dextromethorphan), and a sedating antihistamine (doxylamine). Because it already contains a full therapeutic dose of acetaminophen, taking it together with Tylenol or other paracetamol products causes dangerous drug overlap.",
    black_box_warnings: [
      "Liver Warning: Contains acetaminophen. Severe liver damage may occur if taking more than 4,000 mg of acetaminophen in 24 hours, or taking with other drugs containing acetaminophen."
    ],
    key_precautions: [
      "Critical Overlap Danger: Never combine with other medications containing acetaminophen (Tylenol, Excedrin, DayQuil).",
      "Causes marked drowsiness. Do not drive or operate machinery.",
      "Avoid alcoholic beverages."
    ],
    contraindications: ["Concomitant use of monoamine oxidase inhibitors (MAOIs)", "Severe liver dysfunction"],
    reference_source: "FDA DailyMed Multi-ingredient Monograph",
    source_section: "Drug Facts - Warnings & Inactive Ingredients",
    last_reviewed: "2025-12-10"
  },

  metformin: {
    id: "MONO-MET-008",
    normalized_name: "metformin",
    brand_names: ["Glucophage", "Fortamet", "Glumetza"],
    generic_name: "Metformin Hydrochloride",
    active_ingredients: ["Metformin HCl"],
    drug_class: "Biguanide Antihyperglycemic",
    standard_strengths: ["500 mg", "850 mg", "1000 mg"],
    common_dosage_forms: ["Tablet", "Extended-release tablet"],
    fda_indications: ["Adjunct to diet and exercise to improve glycemic control in adults and pediatric patients with type 2 diabetes mellitus"],
    plain_explanation: "Metformin lowers blood sugar levels by reducing the amount of glucose produced by the liver and improving the body's sensitivity to insulin. It is taken with meals to minimize stomach upset.",
    black_box_warnings: [
      "Lactic Acidosis: Post-marketing cases of metformin-associated lactic acidosis have resulted in death, hypothermia, hypotension, and resistant bradyarrhythmias. Risk increases with renal impairment, sepsis, and alcohol abuse."
    ],
    key_precautions: [
      "Withhold prior to or at the time of iodinated contrast imaging procedures in patients with eGFR < 60 mL/min/1.73 m2.",
      "Monitor kidney function (eGFR) regularly.",
      "Avoid excessive alcohol consumption."
    ],
    contraindications: ["Severe renal impairment (eGFR below 30 mL/min/1.73 m2)", "Metabolic acidosis or diabetic ketoacidosis"],
    reference_source: "FDA DailyMed Endocrine Drug Compendium",
    source_section: "Boxed Warning - Lactic Acidosis",
    last_reviewed: "2025-08-18"
  },

  aspirin: {
    id: "MONO-ASP-009",
    normalized_name: "aspirin",
    brand_names: ["Bayer Aspirin", "Ecotrin", "Bufferin"],
    generic_name: "Acetylsalicylic Acid",
    active_ingredients: ["Aspirin"],
    drug_class: "Salicylate / Antiplatelet / NSAID",
    standard_strengths: ["81 mg (low dose)", "325 mg", "500 mg"],
    common_dosage_forms: ["Tablet", "Enteric-coated tablet", "Chewable"],
    fda_indications: ["Secondary prevention of cardiovascular events", "Mild-to-moderate pain and fever reduction"],
    plain_explanation: "Aspirin stops platelets from sticking together to prevent blood clots, and at higher doses treats pain and inflammation. It carries bleeding cautions.",
    black_box_warnings: [],
    key_precautions: [
      "Reye's Syndrome Warning: Children and teenagers recovering from viral infections (chickenpox, flu) must not use aspirin.",
      "Increased bleeding risk when combined with warfarin or other NSAIDs."
    ],
    contraindications: ["Children/teenagers with viral illness", "Active gastrointestinal ulcers", "Bleeding disorders"],
    reference_source: "FDA DailyMed Cardiovascular Prophylaxis Monograph",
    source_section: "Warnings - Reye's Syndrome & Hemostasis",
    last_reviewed: "2025-10-05"
  },

  crocin: {
    id: "MONO-CRO-010",
    normalized_name: "crocin",
    brand_names: ["Crocin 500", "Crocin Advance", "Crocin Pain Relief"],
    generic_name: "Paracetamol Tablets IP",
    active_ingredients: ["Paracetamol 500 mg (per tablet)"],
    drug_class: "Analgesic & Antipyretic",
    standard_strengths: ["500 mg"],
    common_dosage_forms: ["Tablet (Oral)"],
    fda_indications: ["Fever (e.g., cold, flu, viral infections)", "Headache", "Body ache", "Toothache", "Mild to moderate pain"],
    plain_explanation: "Crocin 500 contains Paracetamol (500mg), which helps reduce fever and relieve mild to moderate pain. Paracetamol reduces pain and fever by acting on chemical messengers in the brain that signal pain and regulate body temperature.",
    black_box_warnings: [
      "Taking more than the daily recommended dose of 4,000 mg may cause serious liver damage or allergic reactions."
    ],
    key_precautions: [
      "Do not take more than the recommended dose (maximum 8 tablets / 4000 mg per 24 hours).",
      "Avoid in case of severe liver disease unless advised by a doctor.",
      "Prolonged use can harm the liver. Seek medical advice if symptoms persist for more than 3 days.",
      "Check all concurrent medications for hidden paracetamol/acetaminophen."
    ],
    max_daily_dose: "4,000 mg (8 tablets) in 24 hours for adults",
    contraindications: ["Severe active liver impairment", "Known hypersensitivity to paracetamol"],
    reference_source: "Indian Pharmacopoeia (IP) & GSK Monograph",
    source_section: "Prescribing Information: Crocin 500",
    last_reviewed: "2025-11-20"
  },

  dolo: {
    id: "MONO-DOL-011",
    normalized_name: "dolo",
    brand_names: ["Dolo 650", "Dolo-650", "Dolo"],
    generic_name: "Paracetamol Tablets IP 650 mg",
    active_ingredients: ["Paracetamol 650 mg (per tablet)"],
    drug_class: "Analgesic & Antipyretic",
    standard_strengths: ["650 mg"],
    common_dosage_forms: ["Tablet (Oral)"],
    fda_indications: ["Fever, mild to moderate pain, headache, osteoarthritis, post-vaccine fever"],
    plain_explanation: "Dolo 650 contains a higher strength of Paracetamol (650mg per tablet) widely prescribed for moderate to high fever and body ache. Because of its higher strength, fewer tablets are needed compared to 500mg formulations.",
    black_box_warnings: [
      "Overdose Warning: Daily dose must not exceed 4,000 mg (approx 6 tablets in 24 hours) to prevent acute hepatotoxicity."
    ],
    key_precautions: [
      "Do not take more than 1 tablet every 4 to 6 hours as needed; do not exceed 6 tablets (approx 3900-4000mg) per day.",
      "Never combine with Crocin, Tylenol, or other paracetamol preparations.",
      "Avoid alcohol while taking this medicine."
    ],
    max_daily_dose: "4,000 mg (max ~6 tablets) in 24 hours",
    contraindications: ["Severe hepatic insufficiency", "Hypersensitivity to paracetamol"],
    reference_source: "Micro Labs Clinical Monograph & Central Drugs Standard Control Organisation (CDSCO)",
    source_section: "Dolo 650 Prescribing Information",
    last_reviewed: "2025-11-25"
  }
};

export const DETERMINISTIC_INTERACTION_RULES: InteractionRule[] = [
  // 1. Warfarin + Ibuprofen (Severe Anticoagulant + NSAID Hemorrhage)
  {
    id: "INT-WAR-IBU-001",
    drug_a: "warfarin",
    drug_b: "ibuprofen",
    type: "interaction",
    severity: "critical",
    claim: "Major hemorrhage and gastrointestinal bleeding hazard: Warfarin + Ibuprofen combination.",
    evidence: "NSAIDs inhibit platelet cyclooxygenase (COX-1), disrupt normal platelet aggregation, and induce gastric mucosal erosions. Concurrent administration with vitamin K antagonists (Warfarin) exponentially multiplies gastrointestinal bleeding risk and may alter INR anticoagulation metrics.",
    source: "FDA Coumadin Prescribing Information & American College of Cardiology Guidelines",
    source_section: "Section 7.1: Drug-Drug Interactions - Anticoagulants and NSAIDs",
    action_guidance: "Do not combine without urgent consultation with your prescribing doctor or anticoagulant clinic. Alternative analgesics (e.g. supervised low-dose acetaminophen) may be evaluated by your physician."
  },

  // 2. Warfarin + Naproxen
  {
    id: "INT-WAR-NAP-002",
    drug_a: "warfarin",
    drug_b: "naproxen",
    type: "interaction",
    severity: "critical",
    claim: "Severe bleeding risk: Warfarin + Naproxen combination.",
    evidence: "Concurrent use of naproxen with warfarin leads to pronounced synergistic inhibition of hemostasis. Naproxen causes gastric mucosal injury and impairs platelet function, dramatically elevating upper GI hemorrhage incidence.",
    source: "OpenFDA Class Interaction Monograph & British National Formulary (BNF 2.8)",
    source_section: "Major Interactions: Anticoagulants and NSAIDs",
    action_guidance: "Avoid concurrent use. Consult your physician immediately."
  },

  // 3. Acetaminophen + NyQuil (Duplicate Active Ingredient Overlap)
  {
    id: "OVR-APAP-NYQ-003",
    drug_a: "acetaminophen",
    drug_b: "nyquil",
    type: "overlap",
    severity: "critical",
    claim: "Duplicate active ingredient detected: Acetaminophen is present in both medications.",
    evidence: "Both Tylenol/Acetaminophen and NyQuil contain therapeutic doses of Acetaminophen. Concurrent administration can easily surpass the maximum safe daily threshold of 4,000 mg (or 3,000 mg in vulnerable populations), posing an acute threat of severe hepatotoxicity (liver failure).",
    source: "FDA Safe Use Initiative: Acetaminophen Hepatotoxicity Warning Standards",
    source_section: "Black Box Warning: Duplicate Acetaminophen Ingestion",
    action_guidance: "Do not take these medications together. Check all cough/cold/pain labels to ensure total acetaminophen intake does not exceed 3,000-4,000 mg in 24 hours."
  },

  // 4. Ibuprofen + Naproxen (Duplicate NSAID Class Overlap)
  {
    id: "OVR-IBU-NAP-004",
    drug_a: "ibuprofen",
    drug_b: "naproxen",
    type: "overlap",
    severity: "high",
    claim: "Therapeutic duplication: Two nonsteroidal anti-inflammatory drugs (NSAIDs) selected simultaneously.",
    evidence: "Ibuprofen and Naproxen both act on the same enzymatic pathways (COX-1 and COX-2). Taking multiple systemic NSAIDs together provides no additional analgesic or anti-inflammatory benefit, while substantially increasing the incidence of severe peptic ulcers, GI bleeding, and acute kidney impairment.",
    source: "American College of Rheumatology & FDA NSAID Class Monograph",
    source_section: "Clinical Pharmacology: Therapeutic Duplication & GI Toxicity",
    action_guidance: "Do not combine two oral NSAIDs. Use one agent as directed, or discuss alternative non-NSAID options with a healthcare provider."
  },

  // 5. Lisinopril + Ibuprofen (ACE Inhibitor + NSAID Antagonism & Renal Risk)
  {
    id: "INT-LIS-IBU-005",
    drug_a: "lisinopril",
    drug_b: "ibuprofen",
    type: "interaction",
    severity: "high",
    claim: "Renal impairment risk and blunted antihypertensive effect: Lisinopril + Ibuprofen.",
    evidence: "NSAIDs inhibit renal prostaglandin synthesis, which can lead to fluid retention, elevation of blood pressure, and acute deterioration of renal function, particularly in elderly or volume-depleted patients taking ACE inhibitors like Lisinopril.",
    source: "FDA DailyMed Lisinopril Prescribing Information",
    source_section: "Section 7.3: Non-Steroidal Anti-Inflammatory Agents including Selective COX-2 Inhibitors",
    action_guidance: "Monitor blood pressure and renal function. Avoid prolonged or frequent high-dose NSAID use with Lisinopril without medical oversight."
  },

  // 6. Lisinopril + Naproxen
  {
    id: "INT-LIS-NAP-006",
    drug_a: "lisinopril",
    drug_b: "naproxen",
    type: "interaction",
    severity: "high",
    claim: "Decreased blood pressure control and elevated renal toxicity: Lisinopril + Naproxen.",
    evidence: "Naproxen counteracts the vasodilatory prostaglandins necessary for renal perfusion during ACE inhibition, increasing the risk of acute kidney injury and hyperkalemia.",
    source: "Clinical Pharmacology Reference & BNF 2.5.5",
    source_section: "ACE Inhibitor and NSAID Hemodynamic Interactions",
    action_guidance: "Consult your doctor regarding alternative pain management options."
  },

  // 7. Warfarin + Aspirin
  {
    id: "INT-WAR-ASP-007",
    drug_a: "warfarin",
    drug_b: "aspirin",
    type: "interaction",
    severity: "critical",
    claim: "Substantial bleeding risk: Warfarin + Aspirin combination.",
    evidence: "Aspirin produces irreversible antiplatelet inhibition and gastric irritation. Adding aspirin to warfarin without specific cardiology-directed dual-pathway management exponentially increases major bleeding rates.",
    source: "American Heart Association / ACC Guidelines for Antithrombotic Therapy",
    source_section: "Antithrombotic Therapy Complications & Bleeding Risk",
    action_guidance: "Only combine if explicitly instructed and monitored by a cardiologist."
  }
];

export const SAMPLE_EVALUATION_PACKAGES = [
  {
    id: "sample-crocin-500",
    title: "Crocin 500 Tablets",
    subtitle: "Paracetamol Tablets IP 500 mg (GSK)",
    brand_name: "Crocin 500",
    generic_name: "Paracetamol Tablets IP",
    active_ingredients: ["Paracetamol 500 mg (per tablet)"],
    strength: "500 mg",
    category: "Pain & Fever" as const,
    pack_size: "20 Tablets",
    manufacturer: "GlaxoSmithKline Pharmaceuticals Ltd.",
    typical_price: "₹25–30",
    image_url: "/samples/crocin.png",
    raw_ocr_text: `Rx
Paracetamol Tablets IP 500 mg
Crocin® 500
Effective relief from Fever & Pain
20 Tablets
GSK - GlaxoSmithKline Pharmaceuticals Ltd.
Each tablet contains Paracetamol IP 500 mg
Dosage: As directed by physician (Adults 1-2 tablets every 4-6 hrs, max 8 tablets / 24 hrs)
Store in a cool, dry place. Keep out of reach of children.
Warnings: Taking more than daily dose of 4000 mg may cause severe liver damage.
EXP: 09/2027 LOT: CR5021`,
    highlight: "Iconic OTC fever & pain reliever (Paracetamol 500mg). Featured in demo screenshot.",
    tags: ["Paracetamol", "GSK", "Fever", "Pain Reliever"]
  },
  {
    id: "sample-dolo-650",
    title: "Dolo 650 Tablets",
    subtitle: "Paracetamol Tablets IP 650 mg (Micro Labs)",
    brand_name: "Dolo 650",
    generic_name: "Paracetamol Tablets IP 650 mg",
    active_ingredients: ["Paracetamol 650 mg (per tablet)"],
    strength: "650 mg",
    category: "Pain & Fever" as const,
    pack_size: "15 Tablets",
    manufacturer: "Micro Labs Limited",
    typical_price: "₹20–25",
    image_url: "/samples/dolo.png",
    raw_ocr_text: `Dolo-650
Paracetamol Tablets IP 650 mg
For Fever & Mild to Moderate Pain
15 Tablets
Micro Labs Limited
Each uncoated tablet contains: Paracetamol IP 650 mg
Dosage: 1 tablet every 4-6 hours or as directed by the physician. Do not exceed 4,000 mg daily.
Caution: Overdose may lead to serious liver damage.
Store in a cool, dry place away from direct light.
EXP: 04/2028 LOT: DL6590`,
    highlight: "Higher-strength paracetamol (650mg). Used for head-to-head comparison with Crocin 500.",
    tags: ["Paracetamol 650mg", "Micro Labs", "Comparison", "High Strength"]
  },
  {
    id: "sample-tylenol-500",
    title: "Tylenol Extra Strength 500mg",
    subtitle: "Acetaminophen Pain Reliever / Fever Reducer",
    brand_name: "Tylenol",
    generic_name: "Acetaminophen",
    active_ingredients: ["Acetaminophen"],
    strength: "500 mg",
    category: "Pain & Fever" as const,
    image_url: "/samples/tylenol.png",
    raw_ocr_text: `EXTRA STRENGTH TYLENOL
Acetaminophen 500 mg
Pain Reliever • Fever Reducer
50 Caplets
Active ingredient (in each caplet): Acetaminophen 500 mg.
Uses: temporarily relieves minor aches and pains due to: headache, muscular aches, backache, minor pain of arthritis, the common cold, toothache, premenstrual and menstrual cramps; temporarily reduces fever.
Warnings:
Liver warning: This product contains acetaminophen. Severe liver damage may occur if you take:
• more than 4,000 mg of acetaminophen in 24 hours
• with other drugs containing acetaminophen
• 3 or more alcoholic drinks every day while using this product
Allergy alert: acetaminophen may cause severe skin reactions. Symptoms may include: skin reddening, blisters, rash.
Do not use: with any other drug containing acetaminophen (prescription or nonprescription).
Ask a doctor before use if you have liver disease.
Directions: Do not take more than directed (see overdose warning). Adults and children 12 years and over: take 2 caplets every 6 hours while symptoms last. Do not take more than 6 caplets in 24 hours, unless directed by a doctor. Do not use for more than 10 days unless directed by a doctor.
EXP: 11/2027 LOT: 320B41`,
    highlight: "Standard OTC analgesic with strict 4,000mg liver warning and duplicate acetaminophen check.",
    tags: ["Acetaminophen", "Analgesic", "Liver Warning", "OTC"]
  },
  {
    id: "sample-advil-200",
    title: "Advil Liqui-Gels 200mg",
    subtitle: "Ibuprofen NSAID Pain Reliever",
    brand_name: "Advil",
    generic_name: "Ibuprofen",
    active_ingredients: ["Ibuprofen"],
    strength: "200 mg",
    category: "Pain & Fever" as const,
    image_url: "/samples/advil.png",
    raw_ocr_text: `ADVIL LIQUI-GELS
Solubilized Ibuprofen Capsules, 200 mg
Pain Reliever / Fever Reducer (NSAID)
80 Liquid Filled Capsules
Active ingredient (in each capsule): Solubilized ibuprofen equal to 200 mg ibuprofen (NSAID)* (*nonsteroidal anti-inflammatory drug).
Uses: temporarily relieves minor aches and pains due to: headache, toothache, backache, menstrual cramps, the common cold, muscular aches, minor pain of arthritis; temporarily reduces fever.
Warnings:
Allergy alert: Ibuprofen may cause a severe allergic reaction, especially in people allergic to aspirin.
Stomach bleeding warning: This product contains an NSAID, which may cause severe stomach bleeding. The chance is higher if you:
• are age 60 or older
• have had stomach ulcers or bleeding problems
• take a blood thinning (anticoagulant) or steroid drug
• take other drugs containing prescription or nonprescription NSAIDs [aspirin, ibuprofen, naproxen, or others]
• have 3 or more alcoholic drinks every day while using this product
• take more or for a longer time than directed
Heart attack and stroke warning: NSAIDs, except aspirin, increase the risk of heart attack, heart failure, and stroke.
Directions: do not take more than directed. The smallest effective dose should be used. Adults and children 12 years and older: take 1 capsule every 4 to 6 hours while symptoms persist. If pain or fever does not respond to 1 capsule, 2 capsules may be used. Do not exceed 6 capsules in 24 hours.
EXP: 09/2026 LOT: ADV991`,
    highlight: "NSAID class with GI bleeding, cardiovascular warning, and critical interaction with Warfarin.",
    tags: ["NSAID", "Ibuprofen", "Bleeding Warning", "Heart Warning"]
  },
  {
    id: "sample-nyquil-cold",
    title: "Vicks NyQuil Cold & Flu",
    subtitle: "Nighttime Multi-Symptom Relief (Acetaminophen Combo)",
    brand_name: "Vicks NyQuil",
    generic_name: "Acetaminophen, Dextromethorphan HBr, Doxylamine succinate",
    active_ingredients: ["Acetaminophen", "Dextromethorphan HBr", "Doxylamine succinate"],
    strength: "650 mg APAP / 30 mg DXM / 12.5 mg per 30 mL",
    category: "Cold & Flu" as const,
    image_url: "/samples/nyquil.png",
    raw_ocr_text: `VICKS NyQuil COLD & FLU
Nighttime Relief
Acetaminophen, Doxylamine Succinate, Dextromethorphan HBr
Pain Reliever / Fever Reducer, Antihistamine, Cough Suppressant
12 FL OZ (354 ml)
Active ingredients (in each 30 mL dose cup):
Acetaminophen 650 mg (Pain reliever/fever reducer)
Dextromethorphan HBr 30 mg (Cough suppressant)
Doxylamine succinate 12.5 mg (Antihistamine)
Uses: temporarily relieves common cold/flu symptoms: cough due to minor throat and bronchial irritation, sore throat, headache, minor aches & pains, fever, runny nose and sneezing.
Warnings:
Liver warning: This product contains acetaminophen. Severe liver damage may occur if you take:
• more than 4,000 mg of acetaminophen in 24 hours, which is the maximum daily amount for this product
• with other drugs containing acetaminophen
• 3 or more alcoholic drinks every day while using this product
Sore throat warning: If sore throat is severe, persists for more than 2 days, seek doctor.
Do not use: with any other drug containing acetaminophen (prescription or nonprescription).
May cause marked drowsiness; alcohol, sedatives, and tranquilizers may increase drowsiness effect.
EXP: 03/2027 LOT: NQ8102`,
    highlight: "Crucial test case: multi-ingredient formula containing 650mg Acetaminophen that triggers duplicate ingredient alert when paired with Tylenol.",
    tags: ["Combination", "Acetaminophen Overlap", "Antihistamine", "Drowsiness"]
  },
  {
    id: "sample-warfarin-5",
    title: "Coumadin (Warfarin Sodium) 5mg",
    subtitle: "Oral Anticoagulant Prescription Tablet",
    brand_name: "Coumadin",
    generic_name: "Warfarin Sodium",
    active_ingredients: ["Warfarin Sodium"],
    strength: "5 mg",
    category: "Anticoagulant" as const,
    image_url: "/samples/warfarin.png",
    raw_ocr_text: `COUMADIN®
(Warfarin Sodium Tablets, USP)
5 mg
Rx Only - 100 Tablets
Each tablet contains: Warfarin sodium, USP 5 mg.
WARNING: BLEEDING RISK
Warfarin sodium can cause major or fatal bleeding. Perform regular monitoring of INR in all treated patients. Drugs, dietary changes, and other factors affect INR levels achieved with warfarin sodium therapy. Instruct patients about prevention measures to minimize risk of bleeding and to report signs and symptoms of bleeding.
Contraindications: Pregnancy; Hemorrhagic tendencies or blood dyscrasias; Recent or contemplated surgery.
Warning: Many other medications interact with warfarin. Do not take any OTC medication or change dosages without physician approval.
EXP: 08/2026 LOT: CF501A`,
    highlight: "Prescription blood thinner with Black Box Warning. Tests high-severity interaction check against OTC NSAIDs.",
    tags: ["Prescription", "Warfarin", "Anticoagulant", "Black Box"]
  },
  {
    id: "sample-lisinopril-10",
    title: "Lisinopril 10mg Tablets",
    subtitle: "ACE Inhibitor Blood Pressure Medication",
    brand_name: "Prinivil / Zestril",
    generic_name: "Lisinopril",
    active_ingredients: ["Lisinopril"],
    strength: "10 mg",
    category: "Cardiovascular" as const,
    image_url: "/samples/lisinopril.png",
    raw_ocr_text: `LISINOPRIL TABLETS USP
10 mg
Rx Only - 90 Tablets
Each tablet contains 10 mg of lisinopril USP.
WARNING: FETAL TOXICITY
• When pregnancy is detected, discontinue Lisinopril as soon as possible.
• Drugs that act directly on the renin-angiotensin system can cause injury and death to the developing fetus.
Indications: Hypertension, heart failure adjunct, post-myocardial infarction.
Precautions: Monitor serum potassium; risk of hyperkalemia. Persistent dry cough may occur. Co-administration with NSAIDs may reduce antihypertensive effect and precipitate renal impairment.
EXP: 01/2028 LOT: LIS7702`,
    highlight: "Hypertension medication testing renal/antihypertensive interactions with NSAIDs and pregnancy black box warning.",
    tags: ["Prescription", "Lisinopril", "Hypertension", "Renal Alert"]
  },
  {
    id: "sample-amoxicillin-500",
    title: "Amoxicillin 500mg Capsules",
    subtitle: "Penicillin-class Beta-Lactam Antibiotic",
    brand_name: "Amoxil",
    generic_name: "Amoxicillin",
    active_ingredients: ["Amoxicillin"],
    strength: "500 mg",
    category: "Antibiotic" as const,
    image_url: "/samples/amoxicillin.png",
    raw_ocr_text: `AMOXICILLIN CAPSULES, USP
500 mg
Rx Only - 30 Capsules
Each capsule contains amoxicillin trihydrate equivalent to 500 mg amoxicillin.
Directions: Take 1 capsule every 8 hours as prescribed by physician. Complete the entire course of therapy even if feeling better.
Warning: Serious and occasionally fatal hypersensitivity (anaphylactic) reactions have been reported in patients on penicillin therapy. Discontinue if rash, hives, or breathing difficulty occurs.
Keep tightly closed. Store at 20° to 25°C (68° to 77°F).
EXP: 05/2027 LOT: AMX334`,
    highlight: "Oral antibiotic testing penicillin allergy precautions, adherence guidance, and isolated non-interacting profile.",
    tags: ["Antibiotic", "Prescription", "Penicillin", "Allergy Caution"]
  }
];
