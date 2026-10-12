export function getDoctorAvatar(): string {
  return `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#e0f2fe"/>
          <stop offset="100%" stop-color="#bae6fd"/>
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r="50" fill="url(#bg)"/>
      <!-- Doctor shoulders with lab coat -->
      <path d="M15,92 C15,70 30,62 50,62 C70,62 85,70 85,92 Z" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5"/>
      <!-- Inner scrub shirt -->
      <path d="M40,62 L50,78 L60,62 Z" fill="#0284c7"/>
      <!-- Stethoscope -->
      <path d="M35,66 C35,80 65,80 65,66" fill="none" stroke="#475569" stroke-width="3" stroke-linecap="round"/>
      <circle cx="50" cy="80" r="4" fill="#94a3b8" stroke="#475569" stroke-width="1.5"/>
      <!-- Head / Face -->
      <circle cx="50" cy="38" r="18" fill="#fed7aa"/>
      <!-- Hair -->
      <path d="M30,36 C30,22 40,16 50,16 C60,16 70,22 70,36 C70,42 66,45 66,45 C66,45 66,28 50,28 C34,28 34,45 34,45 Z" fill="#78350f"/>
      <!-- Eyes & Smile -->
      <circle cx="44" cy="38" r="2" fill="#334155"/>
      <circle cx="56" cy="38" r="2" fill="#334155"/>
      <path d="M46,46 Q50,50 54,46" fill="none" stroke="#ea580c" stroke-width="2" stroke-linecap="round"/>
    </svg>
  `)}`;
}

export function getCrocinBlisterImage(): string {
  return `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160" width="160" height="160">
      <rect width="160" height="160" fill="#f1f5f9" rx="14"/>
      <!-- Blister Foil Background -->
      <rect x="20" y="20" width="120" height="120" rx="10" fill="#e2e8f0" stroke="#94a3b8" stroke-width="1.5"/>
      <!-- Blue top stripe -->
      <rect x="20" y="20" width="120" height="24" rx="10 10 0 0" fill="#0284c7"/>
      <text x="80" y="36" fill="#ffffff" font-family="system-ui, sans-serif" font-weight="900" font-size="10" text-anchor="middle">CROCIN 500</text>
      <!-- Tablets Grid (6 pills) -->
      <g fill="#ffffff" stroke="#cbd5e1" stroke-width="2">
        <circle cx="50" cy="65" r="14"/>
        <circle cx="110" cy="65" r="14"/>
        <circle cx="50" cy="98" r="14"/>
        <circle cx="110" cy="98" r="14"/>
        <circle cx="50" cy="126" r="10" opacity="0.6"/>
        <circle cx="110" cy="126" r="10" opacity="0.6"/>
      </g>
      <!-- Score line across tablets -->
      <line x1="38" y1="65" x2="62" y2="65" stroke="#94a3b8" stroke-width="1"/>
      <line x1="98" y1="65" x2="122" y2="65" stroke="#94a3b8" stroke-width="1"/>
      <line x1="38" y1="98" x2="62" y2="98" stroke="#94a3b8" stroke-width="1"/>
      <line x1="98" y1="98" x2="122" y2="98" stroke="#94a3b8" stroke-width="1"/>
    </svg>
  `)}`;
}

// High quality SVG data URIs for sample medicine packages
export function getSampleMedicineImage(brand: string): string {
  const brandLower = brand.toLowerCase();
  
  if (brandLower.includes("crocin")) {
    return `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300" width="300" height="300">
        <rect width="300" height="300" fill="#f8fafc" rx="16"/>
        <!-- Crocin Box (Blue and White) -->
        <rect x="65" y="55" width="170" height="190" rx="10" fill="#ffffff" stroke="#cbd5e1" stroke-width="2.5" filter="drop-shadow(0 6px 12px rgba(0,0,0,0.08))"/>
        <!-- Right Blue Side Graphic -->
        <path d="M165,55 L235,55 L235,245 L150,245 Z" fill="#0284c7"/>
        <!-- GSK Logo badge -->
        <circle cx="215" cy="80" r="14" fill="#ea580c"/>
        <text x="215" y="85" fill="#ffffff" font-family="system-ui, sans-serif" font-weight="900" font-size="9" text-anchor="middle">gsk</text>
        <!-- Rx symbol -->
        <text x="80" y="85" fill="#dc2626" font-family="serif" font-weight="bold" font-size="14">Rx</text>
        <text x="80" y="105" fill="#1e293b" font-family="system-ui, sans-serif" font-weight="700" font-size="11">Paracetamol</text>
        <text x="80" y="120" fill="#1e293b" font-family="system-ui, sans-serif" font-weight="700" font-size="10">Tablets IP 500 mg</text>
        <!-- Crocin Brand in Red & Navy -->
        <text x="80" y="155" fill="#0f172a" font-family="system-ui, sans-serif" font-weight="900" font-size="22">Crocin<tspan fill="#dc2626" font-size="12">®</tspan></text>
        <text x="80" y="195" fill="#dc2626" font-family="system-ui, sans-serif" font-weight="900" font-size="34">500</text>
        <!-- Effective relief banner -->
        <text x="225" y="170" fill="#ffffff" font-family="system-ui, sans-serif" font-weight="700" font-size="8" text-anchor="end">Effective relief</text>
        <text x="225" y="182" fill="#ffffff" font-family="system-ui, sans-serif" font-weight="600" font-size="7.5" text-anchor="end">from Fever &amp; Pain</text>
        <rect x="75" y="215" width="80" height="18" fill="#f1f5f9" rx="4"/>
        <text x="115" y="227" fill="#475569" font-family="system-ui, sans-serif" font-weight="700" font-size="8.5" text-anchor="middle">20 Tablets</text>
      </svg>
    `)}`;
  }

  if (brandLower.includes("dolo")) {
    return `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300" width="300" height="300">
        <rect width="300" height="300" fill="#f8fafc" rx="16"/>
        <!-- Dolo 650 Box (Orange and Cyan/Blue) -->
        <rect x="65" y="55" width="170" height="190" rx="10" fill="#f97316" stroke="#ea580c" stroke-width="2.5" filter="drop-shadow(0 6px 12px rgba(0,0,0,0.08))"/>
        <!-- Cyan Wave pattern -->
        <path d="M65,110 Q150,70 235,115 L235,245 L65,245 Z" fill="#0284c7"/>
        <rect x="78" y="70" width="60" height="18" fill="#ffffff" rx="4"/>
        <text x="108" y="82" fill="#ea580c" font-family="system-ui, sans-serif" font-weight="900" font-size="8" text-anchor="middle">MICRO LABS</text>
        <text x="150" y="150" fill="#ffffff" font-family="system-ui, sans-serif" font-weight="900" font-size="28" text-anchor="middle">Dolo-650</text>
        <text x="150" y="172" fill="#bae6fd" font-family="system-ui, sans-serif" font-weight="600" font-size="9" text-anchor="middle">Paracetamol Tablets IP 650 mg</text>
        <text x="150" y="215" fill="#fed7aa" font-family="system-ui, sans-serif" font-weight="700" font-size="9" text-anchor="middle">For Fever &amp; Mild to Moderate Pain</text>
        <rect x="105" y="225" width="90" height="14" fill="#0369a1" rx="4"/>
        <text x="150" y="235" fill="#ffffff" font-family="system-ui, sans-serif" font-weight="700" font-size="8" text-anchor="middle">15 Tablets</text>
      </svg>
    `)}`;
  }

  if (brandLower.includes("tylenol")) {
    return `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300" width="300" height="300">
        <rect width="300" height="300" fill="#f8fafc" rx="16"/>
        <!-- Bottle Body -->
        <rect x="80" y="80" width="140" height="180" rx="18" fill="#ffffff" stroke="#e2e8f0" stroke-width="3" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.05))"/>
        <!-- Red Cap -->
        <rect x="105" y="45" width="90" height="38" rx="6" fill="#dc2626"/>
        <line x1="115" y1="52" x2="115" y2="76" stroke="#b91c1c" stroke-width="2"/>
        <line x1="130" y1="52" x2="130" y2="76" stroke="#b91c1c" stroke-width="2"/>
        <line x1="150" y1="52" x2="150" y2="76" stroke="#b91c1c" stroke-width="2"/>
        <line x1="170" y1="52" x2="170" y2="76" stroke="#b91c1c" stroke-width="2"/>
        <line x1="185" y1="52" x2="185" y2="76" stroke="#b91c1c" stroke-width="2"/>
        <!-- Label Area -->
        <rect x="88" y="100" width="124" height="140" fill="#fef2f2" rx="6"/>
        <!-- Header Banner -->
        <rect x="88" y="100" width="124" height="36" fill="#dc2626" rx="6 6 0 0"/>
        <text x="150" y="124" fill="#ffffff" font-family="system-ui, sans-serif" font-weight="900" font-size="17" text-anchor="middle" letter-spacing="0.5">TYLENOL</text>
        <text x="150" y="150" fill="#991b1b" font-family="system-ui, sans-serif" font-weight="700" font-size="9" text-anchor="middle">EXTRA STRENGTH</text>
        <text x="150" y="165" fill="#334155" font-family="system-ui, sans-serif" font-weight="600" font-size="11" text-anchor="middle">Acetaminophen 500 mg</text>
        <rect x="105" y="176" width="90" height="16" fill="#fee2e2" rx="4"/>
        <text x="150" y="188" fill="#b91c1c" font-family="system-ui, sans-serif" font-weight="600" font-size="8" text-anchor="middle">PAIN RELIEVER • FEVER</text>
        <!-- Liver Warning Icon -->
        <circle cx="150" cy="216" r="12" fill="#ef4444"/>
        <text x="150" y="221" fill="#ffffff" font-family="system-ui, sans-serif" font-weight="900" font-size="13" text-anchor="middle">!</text>
      </svg>
    `)}`;
  }

  if (brandLower.includes("advil")) {
    return `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300" width="300" height="300">
        <rect width="300" height="300" fill="#f8fafc" rx="16"/>
        <rect x="80" y="80" width="140" height="180" rx="18" fill="#ffffff" stroke="#e2e8f0" stroke-width="3"/>
        <!-- Blue Cap -->
        <rect x="105" y="45" width="90" height="38" rx="6" fill="#0284c7"/>
        <line x1="120" y1="52" x2="120" y2="76" stroke="#0369a1" stroke-width="2"/>
        <line x1="150" y1="52" x2="150" y2="76" stroke="#0369a1" stroke-width="2"/>
        <line x1="180" y1="52" x2="180" y2="76" stroke="#0369a1" stroke-width="2"/>
        <!-- Label Area -->
        <rect x="88" y="100" width="124" height="140" fill="#f0f9ff" rx="6"/>
        <rect x="88" y="100" width="124" height="36" fill="#0284c7" rx="6 6 0 0"/>
        <text x="150" y="125" fill="#ffffff" font-family="system-ui, sans-serif" font-weight="900" font-size="18" text-anchor="middle">Advil</text>
        <text x="150" y="152" fill="#0369a1" font-family="system-ui, sans-serif" font-weight="700" font-size="10" text-anchor="middle">LIQUI-GELS</text>
        <text x="150" y="168" fill="#0f172a" font-family="system-ui, sans-serif" font-weight="600" font-size="11" text-anchor="middle">Ibuprofen 200 mg</text>
        <rect x="105" y="178" width="90" height="16" fill="#e0f2fe" rx="4"/>
        <text x="150" y="190" fill="#0369a1" font-family="system-ui, sans-serif" font-weight="700" font-size="8" text-anchor="middle">NSAID RELIEVER</text>
        <!-- Gel capsule icon -->
        <ellipse cx="150" cy="216" rx="20" ry="10" fill="#38bdf8" opacity="0.8"/>
      </svg>
    `)}`;
  }

  if (brandLower.includes("nyquil")) {
    return `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300" width="300" height="300">
        <rect width="300" height="300" fill="#f8fafc" rx="16"/>
        <rect x="85" y="70" width="130" height="200" rx="12" fill="#0f172a" stroke="#334155" stroke-width="3"/>
        <!-- Green Cap -->
        <rect x="110" y="35" width="80" height="38" rx="6" fill="#16a34a"/>
        <!-- Label Area -->
        <rect x="92" y="85" width="116" height="165" fill="#1e293b" rx="6"/>
        <rect x="92" y="85" width="116" height="34" fill="#059669" rx="6 6 0 0"/>
        <text x="150" y="108" fill="#ffffff" font-family="system-ui, sans-serif" font-weight="900" font-size="16" text-anchor="middle">NyQuil</text>
        <text x="150" y="132" fill="#34d399" font-family="system-ui, sans-serif" font-weight="700" font-size="9" text-anchor="middle">COLD &amp; FLU NIGHT</text>
        <text x="150" y="152" fill="#e2e8f0" font-family="system-ui, sans-serif" font-weight="600" font-size="10" text-anchor="middle">Acetaminophen Combo</text>
        <rect x="100" y="165" width="100" height="32" fill="#f59e0b" rx="4"/>
        <text x="150" y="178" fill="#78350f" font-family="system-ui, sans-serif" font-weight="800" font-size="8" text-anchor="middle">APAP 650 mg</text>
        <text x="150" y="190" fill="#78350f" font-family="system-ui, sans-serif" font-weight="600" font-size="7" text-anchor="middle">+ DXM &amp; Doxylamine</text>
        <!-- Night moon -->
        <path d="M142,212 A10,10 0 0 0 156,226 A12,12 0 1 1 142,212 Z" fill="#fbbf24"/>
      </svg>
    `)}`;
  }

  if (brandLower.includes("warfarin") || brandLower.includes("coumadin")) {
    return `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300" width="300" height="300">
        <rect width="300" height="300" fill="#f8fafc" rx="16"/>
        <rect x="85" y="80" width="130" height="175" rx="14" fill="#ffedd5" stroke="#fed7aa" stroke-width="3"/>
        <!-- White Childproof Cap -->
        <rect x="105" y="45" width="90" height="38" rx="6" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2"/>
        <text x="150" y="68" fill="#64748b" font-family="system-ui, sans-serif" font-weight="700" font-size="8" text-anchor="middle">PUSH &amp; TURN</text>
        <!-- Rx Prescription Label -->
        <rect x="92" y="95" width="116" height="145" fill="#ffffff" rx="4" stroke="#e2e8f0"/>
        <rect x="92" y="95" width="116" height="24" fill="#ea580c" rx="4 4 0 0"/>
        <text x="150" y="112" fill="#ffffff" font-family="system-ui, sans-serif" font-weight="900" font-size="11" text-anchor="middle">Rx ONLY • HIGH ALERT</text>
        <text x="150" y="134" fill="#0f172a" font-family="system-ui, sans-serif" font-weight="900" font-size="14" text-anchor="middle">COUMADIN</text>
        <text x="150" y="148" fill="#475569" font-family="system-ui, sans-serif" font-weight="600" font-size="9" text-anchor="middle">Warfarin Sodium 5 mg</text>
        <!-- Black box warning outline -->
        <rect x="98" y="160" width="104" height="42" fill="#fef2f2" stroke="#dc2626" stroke-width="1.5" rx="3"/>
        <text x="150" y="174" fill="#991b1b" font-family="system-ui, sans-serif" font-weight="900" font-size="7.5" text-anchor="middle">BOXED WARNING</text>
        <text x="150" y="186" fill="#991b1b" font-family="system-ui, sans-serif" font-weight="600" font-size="7" text-anchor="middle">BLEEDING RISK / INR</text>
        <text x="150" y="196" fill="#b91c1c" font-family="system-ui, sans-serif" font-weight="600" font-size="6.5" text-anchor="middle">INTERACTS WITH NSAIDS</text>
      </svg>
    `)}`;
  }

  if (brandLower.includes("lisinopril")) {
    return `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300" width="300" height="300">
        <rect width="300" height="300" fill="#f8fafc" rx="16"/>
        <rect x="85" y="80" width="130" height="175" rx="14" fill="#ffffff" stroke="#cbd5e1" stroke-width="3"/>
        <rect x="105" y="45" width="90" height="38" rx="6" fill="#f1f5f9" stroke="#94a3b8" stroke-width="2"/>
        <rect x="92" y="95" width="116" height="145" fill="#f8fafc" rx="4" stroke="#e2e8f0"/>
        <rect x="92" y="95" width="116" height="24" fill="#0d9488" rx="4 4 0 0"/>
        <text x="150" y="112" fill="#ffffff" font-family="system-ui, sans-serif" font-weight="900" font-size="11" text-anchor="middle">Rx PRESCRIPTION</text>
        <text x="150" y="136" fill="#0f172a" font-family="system-ui, sans-serif" font-weight="800" font-size="14" text-anchor="middle">LISINOPRIL</text>
        <text x="150" y="152" fill="#0d9488" font-family="system-ui, sans-serif" font-weight="700" font-size="11" text-anchor="middle">10 mg Tablets</text>
        <text x="150" y="170" fill="#475569" font-family="system-ui, sans-serif" font-weight="500" font-size="8" text-anchor="middle">ACE INHIBITOR</text>
        <!-- Heart / Blood Pressure icon -->
        <path d="M150,195 C150,195 138,185 138,178 C138,174 142,170 146,170 C148.5,170 150,172 150,172 C150,172 151.5,170 154,170 C158,170 162,174 162,178 C162,185 150,195 150,195 Z" fill="#0d9488"/>
      </svg>
    `)}`;
  }

  // Generic antibiotic / medicine fallback
  return `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300" width="300" height="300">
      <rect width="300" height="300" fill="#f8fafc" rx="16"/>
      <rect x="70" y="90" width="160" height="150" rx="8" fill="#ffffff" stroke="#cbd5e1" stroke-width="3"/>
      <rect x="70" y="90" width="160" height="32" fill="#4f46e5" rx="8 8 0 0"/>
      <text x="150" y="112" fill="#ffffff" font-family="system-ui, sans-serif" font-weight="900" font-size="13" text-anchor="middle">AMOXICILLIN 500mg</text>
      <text x="150" y="145" fill="#1e1b4b" font-family="system-ui, sans-serif" font-weight="800" font-size="14" text-anchor="middle">Amoxil</text>
      <text x="150" y="165" fill="#6366f1" font-family="system-ui, sans-serif" font-weight="700" font-size="10" text-anchor="middle">Antibiotic Capsules</text>
      <rect x="100" y="180" width="100" height="24" fill="#eef2ff" rx="4"/>
      <text x="150" y="196" fill="#4338ca" font-family="system-ui, sans-serif" font-weight="600" font-size="8.5" text-anchor="middle">Rx - Oral Use Only</text>
    </svg>
  `)}`;
}
