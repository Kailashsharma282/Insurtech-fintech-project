import os
import sys
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Image, PageBreak, KeepTogether, HRFlowable
)
from reportlab.pdfgen import canvas

PDF_OUTPUT_PATH = r"C:\Users\kaila\.gemini\antigravity-ide\brain\c7a1e0e5-0091-4279-8692-f0509653e994\AgriSure_Intelligence_Full_System_Design_Specification.pdf"
SCREENSHOTS_DIR = r"C:\Users\kaila\.gemini\antigravity-ide\brain\c7a1e0e5-0091-4279-8692-f0509653e994\pdf_screenshots"

# Color Palette (Palantir Geospatial Theme)
PRIMARY_DARK = colors.HexColor("#071511")
ACCENT_GREEN = colors.HexColor("#10B981")
EMERALD_LIGHT = colors.HexColor("#E6F7F0")
EMERALD_BORDER = colors.HexColor("#34D399")
SLATE_DARK = colors.HexColor("#0F172A")
SLATE_MUTED = colors.HexColor("#475569")
SLATE_LIGHT = colors.HexColor("#F8FAFC")
BORDER_COLOR = colors.HexColor("#CBD5E1")
AMBER_COLOR = colors.HexColor("#D97706")
BLUE_COLOR = colors.HexColor("#2563EB")

class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super(NumberedCanvas, self).__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_header_footer(num_pages)
            super(NumberedCanvas, self).showPage()
        super(NumberedCanvas, self).save()

    def draw_header_footer(self, total_pages):
        self.saveState()
        # Suppress header and footer on cover page (page 1)
        if self._pageNumber > 1:
            # Header
            self.setFont("Helvetica-Bold", 8)
            self.setFillColor(SLATE_MUTED)
            self.drawString(40, 760, "AGRISURE INTELLIGENCE  •  SYSTEM DESIGN & DATA SPECIFICATION MANUAL")
            self.setFont("Helvetica", 8)
            self.drawRightString(572, 760, "RESTRICTED / ACADEMIC ARCHITECTURE")
            
            self.setStrokeColor(BORDER_COLOR)
            self.setLineWidth(0.5)
            self.line(40, 752, 572, 752)

            # Footer
            self.line(40, 42, 572, 42)
            self.setFont("Helvetica", 8)
            self.setFillColor(SLATE_MUTED)
            self.drawString(40, 30, "Autonomous Agro-Resilience  •  Sentinel-2/1 SAR  •  IoT Telemetry  •  Parametric Underwriting")
            self.drawRightString(572, 30, f"Page {self._pageNumber} of {total_pages}")
        self.restoreState()

def build_pdf():
    doc = SimpleDocTemplate(
        PDF_OUTPUT_PATH,
        pagesize=letter,
        leftMargin=40,
        rightMargin=40,
        topMargin=54,
        bottomMargin=54
    )

    styles = getSampleStyleSheet()
    
    # Custom Typography Styles
    title_style = ParagraphStyle(
        'CoverTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=28,
        leading=34,
        textColor=PRIMARY_DARK,
        alignment=0
    )

    subtitle_style = ParagraphStyle(
        'CoverSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=13,
        leading=18,
        textColor=SLATE_MUTED,
        alignment=0
    )

    h1_style = ParagraphStyle(
        'Heading1_Custom',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=18,
        leading=22,
        textColor=PRIMARY_DARK,
        spaceBefore=14,
        spaceAfter=8
    )

    h2_style = ParagraphStyle(
        'Heading2_Custom',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=13,
        leading=17,
        textColor=ACCENT_GREEN,
        spaceBefore=10,
        spaceAfter=5
    )

    h3_style = ParagraphStyle(
        'Heading3_Custom',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=10,
        leading=14,
        textColor=SLATE_DARK,
        spaceBefore=6,
        spaceAfter=3
    )

    body_style = ParagraphStyle(
        'Body_Custom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=13,
        textColor=SLATE_DARK,
        spaceAfter=6
    )

    bullet_style = ParagraphStyle(
        'Bullet_Custom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=12,
        textColor=SLATE_DARK,
        leftIndent=12,
        spaceAfter=3
    )

    table_header_style = ParagraphStyle(
        'TableHeader',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8,
        leading=10,
        textColor=colors.white
    )

    table_cell_style = ParagraphStyle(
        'TableCell',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=7.5,
        leading=9.5,
        textColor=SLATE_DARK
    )

    table_cell_bold = ParagraphStyle(
        'TableCellBold',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=7.5,
        leading=9.5,
        textColor=SLATE_DARK
    )

    table_cell_code = ParagraphStyle(
        'TableCellCode',
        parent=styles['Normal'],
        fontName='Courier',
        fontSize=7,
        leading=8.5,
        textColor=colors.HexColor("#065F46")
    )

    badge_style = ParagraphStyle(
        'BadgeText',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=7.5,
        leading=9,
        textColor=colors.HexColor("#065F46")
    )

    story = []

    # ==========================================
    # 1. COVER PAGE
    # ==========================================
    story.append(Spacer(1, 40))
    story.append(Paragraph("AGRISURE INTELLIGENCE", ParagraphStyle('CoverPre', fontName='Helvetica-Bold', fontSize=12, textColor=ACCENT_GREEN, leading=14)))
    story.append(Spacer(1, 8))
    story.append(Paragraph("Full System Design, Page Architectures & Data Specification Manual", title_style))
    story.append(Spacer(1, 12))
    story.append(Paragraph("Satellite Remote Sensing × Agronomic AI × In-Situ IoT Telemetry × Parametric Underwriting", subtitle_style))
    story.append(Spacer(1, 20))
    
    story.append(HRFlowable(width="100%", thickness=3, color=ACCENT_GREEN, spaceBefore=5, spaceAfter=25))

    # Meta information block
    meta_data = [
        [Paragraph("<b>Document Version:</b>", body_style), Paragraph("Release v1.0.0 (Production Master)", body_style)],
        [Paragraph("<b>Target Infrastructure:</b>", body_style), Paragraph("Vercel Edge (Next.js 16) + Render Core API + PostgreSQL/PostGIS", body_style)],
        [Paragraph("<b>Primary Demonstration Pilot:</b>", body_style), Paragraph("Plot #204 (Rajesh Mondal, Nadia District, West Bengal • Aman Paddy)", body_style)],
        [Paragraph("<b>Operational Philosophy:</b>", body_style), Paragraph("Detect Early → Intervene Precisely → Preserve Yield → Settle Automatically", body_style)],
        [Paragraph("<b>Supported Languages:</b>", body_style), Paragraph("7 Regional Languages (English, Bengali, Hindi, Telugu, Tamil, Kannada, Malayalam)", body_style)],
        [Paragraph("<b>Security & Access:</b>", body_style), Paragraph("Role-Based Access Control (Farmer, Insurer, System Admin, Field Agent)", body_style)],
        [Paragraph("<b>Generated Timestamp:</b>", body_style), Paragraph("September 2026 • Official Platform Release Document", body_style)],
    ]
    meta_table = Table(meta_data, colWidths=[150, 382])
    meta_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), EMERALD_LIGHT),
        ('BOX', (0,0), (-1,-1), 1, ACCENT_GREEN),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor("#A7F3D0")),
        ('PADDING', (0,0), (-1,-1), 8),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ]))
    story.append(meta_table)

    story.append(Spacer(1, 30))
    
    # Summary Abstract Box
    abstract_text = (
        "<b>Executive Architectural Abstract:</b> AgriSure Intelligence is a closed-loop cyber-physical agriculture resilience "
        "and parametric underwriting platform. By pairing European Space Agency Sentinel-2 optical imagery (10m multispectral) "
        "and Sentinel-1 C-band SAR radar cross-polarization with real-time in-situ ESP32 telemetry (volumetric root soil moisture, "
        "ambient micro-weather), the system computes localized Shannon Entropy Crop Health Factor (CHF) indices. Rather than "
        "merely waiting for catastrophic loss, the platform executes a 6-stage operational resilience cycle: it detects stress days "
        "before visual foliar wilting, prescribes bio-inspired GA-PSO nutrient/irrigation remedies, actuates solar pumps, verifies "
        "post-intervention vegetative rebound, and automatically settles residual losses via smart parametric contracts with direct-to-bank "
        "DBT settlement—entirely eliminating surveyor delays and fraudulent claim friction."
    )
    story.append(Paragraph(abstract_text, ParagraphStyle('Abstract', parent=body_style, fontSize=9.5, leading=14, textColor=SLATE_DARK)))

    story.append(PageBreak())

    # ==========================================
    # 2. EXECUTIVE ARCHITECTURE OVERVIEW
    # ==========================================
    story.append(Paragraph("1. System Architecture & 4-Pillar Foundation", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=BORDER_COLOR, spaceBefore=2, spaceAfter=12))

    story.append(Paragraph(
        "AgriSure Intelligence is architected across four interlocking technological pillars that function as a unified operational loop:",
        body_style
    ))

    pillar_data = [
        [
            Paragraph("<b>Pillar 1: Satellite Remote Sensing</b>", h3_style),
            Paragraph("<b>Pillar 2: In-Situ IoT Telemetry</b>", h3_style)
        ],
        [
            Paragraph(
                "• Sentinel-2 MSI: 10m spatial resolution across 13 spectral bands.<br/>"
                "• Sentinel-1 SAR: Dual-pol (VH/VV) C-band radar penetrative of monsoon clouds.<br/>"
                "• Computed Vegetation Indices: NDVI, NDRE, LSWI, EVI, and radar roughness ratios.<br/>"
                "• 4-year localized pixel baseline comparison against historical Kharif averages.",
                bullet_style
            ),
            Paragraph(
                "• ESP32 MCU nodes reporting at 3-second telemetry polling cycles.<br/>"
                "• Dual capacitance probes: Root Zone (15 cm) and Deep Sub-surface (30 cm).<br/>"
                "• Ambient DHT22 micro-climate stations & digital N-P-K soil conductivity probes.<br/>"
                "• Remote hardware actuation: Bi-directional relays controlling solar micro-irrigation.",
                bullet_style
            )
        ],
        [
            Paragraph("<b>Pillar 3: Agronomic Intelligence (AI)</b>", h3_style),
            Paragraph("<b>Pillar 4: Parametric FinTech & Underwriting</b>", h3_style)
        ],
        [
            Paragraph(
                "• 38-Class PlantVillage Computer Vision classifier (92.9% precision).<br/>"
                "• GA-PSO Hybrid bio-inspired optimizer for precise NPK/water prescriptions.<br/>"
                "• Shannon Entropy Crop Health Factor (CHF) combining 5 normalized sub-indices.<br/>"
                "• Early stress warning: Identifies physiological stress 5-7 days before visual wilting.",
                bullet_style
            ),
            Paragraph(
                "• Zero-paperwork index-based trigger specification (e.g. CHF &le; 0.580 for 14 days).<br/>"
                "• Automated DBT bank payout calculation via PMFBY subsidy framework (80% subsidy).<br/>"
                "• 11-Section Cryptographic Claim Evidence Dossiers for re-insurers.<br/>"
                "• Chained SHA-256 Merkle audit trail ensuring zero dispute or corruption.",
                bullet_style
            )
        ]
    ]
    pillar_table = Table(pillar_data, colWidths=[266, 266])
    pillar_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (0,0), EMERALD_LIGHT),
        ('BACKGROUND', (1,0), (1,0), colors.HexColor("#EFF6FF")),
        ('BACKGROUND', (0,2), (0,2), colors.HexColor("#FEF3C7")),
        ('BACKGROUND', (1,2), (1,2), colors.HexColor("#F1F5F9")),
        ('BOX', (0,0), (-1,-1), 1, BORDER_COLOR),
        ('INNERGRID', (0,0), (-1,-1), 0.5, BORDER_COLOR),
        ('PADDING', (0,0), (-1,-1), 7),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ]))
    story.append(pillar_table)

    story.append(Spacer(1, 14))

    # The 6-Stage Resilience Cycle Table
    story.append(Paragraph("The 6-Stage Closed-Loop Resilience Lifecycle", h2_style))
    cycle_summary_data = [
        [Paragraph("Stage", table_header_style), Paragraph("Stage Name", table_header_style), Paragraph("Core Technology & Data Source", table_header_style), Paragraph("Operational Outcome", table_header_style)],
        [Paragraph("01", table_cell_bold), Paragraph("OBSERVE", table_cell_bold), Paragraph("Sentinel-2 MSI (10m) + Sentinel-1 SAR + ESP32 IoT probes", table_cell_style), Paragraph("Raw multi-spectral and in-situ moisture time-series ingestion", table_cell_style)],
        [Paragraph("02", table_cell_bold), Paragraph("DIAGNOSE", table_cell_bold), Paragraph("Shannon Entropy CHF index + 38-class leaf computer vision", table_cell_style), Paragraph("Detects physiological stress days prior to visual canopy wilting", table_cell_style)],
        [Paragraph("03", table_cell_bold), Paragraph("PRESCRIBE", table_cell_bold), Paragraph("GA-PSO bio-inspired heuristic multi-objective optimizer", table_cell_style), Paragraph("Generates calibrated N-P-K dosages and micro-irrigation volume", table_cell_style)],
        [Paragraph("04", table_cell_bold), Paragraph("ACTUATE", table_cell_bold), Paragraph("Solar pump remote relay switch + voice mobile advisories", table_cell_style), Paragraph("Executes 45-min drip cycle or targeted organic bio-control spray", table_cell_style)],
        [Paragraph("05", table_cell_bold), Paragraph("VERIFY", table_cell_bold), Paragraph("Bi-weekly satellite return passes + root capacitance sensors", table_cell_style), Paragraph("Validates post-intervention vegetative recovery trajectory", table_cell_style)],
        [Paragraph("06", table_cell_bold), Paragraph("INSURE", table_cell_bold), Paragraph("Parametric smart contract index breach trigger", table_cell_style), Paragraph("Automatic RBI NEFT payout to DBT account if shock exceeds remedy", table_cell_style)],
    ]
    cycle_table = Table(cycle_summary_data, colWidths=[35, 75, 210, 212])
    cycle_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), PRIMARY_DARK),
        ('BOX', (0,0), (-1,-1), 1, BORDER_COLOR),
        ('INNERGRID', (0,0), (-1,-1), 0.5, BORDER_COLOR),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, SLATE_LIGHT]),
        ('PADDING', (0,0), (-1,-1), 5),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ]))
    story.append(cycle_table)

    story.append(PageBreak())

    # ==========================================
    # 3. DETAILED PAGE-BY-PAGE DESIGN SPECIFICATIONS
    # ==========================================
    story.append(Paragraph("2. Detailed Page Designs, Data Requirements & Field Specifications", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=BORDER_COLOR, spaceBefore=2, spaceAfter=14))

    # Helper function to render a page spec section
    def render_page_section(page_meta, data_reqs, fields_data):
        items = []
        
        # Section Header with badges
        header_table = Table([
            [
                Paragraph(f"<b>{page_meta['num']}. {page_meta['title']}</b>", h2_style),
                Paragraph(f"<b>Route:</b> <font color='#065F46'><code>{page_meta['route']}</code></font>", ParagraphStyle('Rte', fontName='Helvetica', fontSize=8.5, alignment=2))
            ],
            [
                Paragraph(f"<b>Authorized RBAC Persona:</b> {page_meta['role']} &nbsp;|&nbsp; <b>Tier:</b> {page_meta['tier']}", ParagraphStyle('Rol', fontName='Helvetica', fontSize=8, textColor=SLATE_MUTED)),
                Paragraph(f"<b>Language Support:</b> {page_meta['lang']}", ParagraphStyle('Lng', fontName='Helvetica', fontSize=8, textColor=SLATE_MUTED, alignment=2))
            ]
        ], colWidths=[330, 202])
        header_table.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,-1), EMERALD_LIGHT),
            ('BOX', (0,0), (-1,-1), 1, ACCENT_GREEN),
            ('PADDING', (0,0), (-1,-1), 6),
            ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ]))
        items.append(header_table)
        items.append(Spacer(1, 8))

        # Screenshot display
        img_path = os.path.join(SCREENSHOTS_DIR, f"{page_meta['file']}.png")
        if os.path.exists(img_path):
            img = Image(img_path, width=6.8*inch, height=3.7*inch)
            items.append(img)
            items.append(Spacer(1, 8))
        else:
            items.append(Paragraph(f"<i>[Screenshot image placeholder: {page_meta['file']}.png]</i>", body_style))
            items.append(Spacer(1, 8))

        # Functional Purpose
        items.append(Paragraph("<b>Functional Purpose & UX Design:</b>", h3_style))
        items.append(Paragraph(page_meta['purpose'], body_style))
        items.append(Spacer(1, 4))

        # Data Required Section
        items.append(Paragraph("<b>Data Required & Technical Pipeline:</b>", h3_style))
        for req in data_reqs:
            items.append(Paragraph(f"• <b>{req['label']}:</b> {req['detail']}", bullet_style))
        items.append(Spacer(1, 6))

        # Fields Specification Table
        items.append(Paragraph("<b>Field Specification & Data Schema:</b>", h3_style))
        table_rows = [
            [
                Paragraph("Field / Metric Name", table_header_style),
                Paragraph("Data Type", table_header_style),
                Paragraph("UI Control", table_header_style),
                Paragraph("Req?", table_header_style),
                Paragraph("Validation Rules & Technical Logic", table_header_style),
                Paragraph("Sample Production Value", table_header_style)
            ]
        ]
        for f in fields_data:
            table_rows.append([
                Paragraph(f[0], table_cell_bold),
                Paragraph(f[1], table_cell_code),
                Paragraph(f[2], table_cell_style),
                Paragraph(f[3], table_cell_style),
                Paragraph(f[4], table_cell_style),
                Paragraph(f[5], table_cell_style),
            ])
        
        field_table = Table(table_rows, colWidths=[90, 60, 68, 32, 172, 110])
        field_table.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,0), PRIMARY_DARK),
            ('BOX', (0,0), (-1,-1), 1, BORDER_COLOR),
            ('INNERGRID', (0,0), (-1,-1), 0.5, BORDER_COLOR),
            ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, SLATE_LIGHT]),
            ('PADDING', (0,0), (-1,-1), 4),
            ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ]))
        items.append(field_table)
        items.append(Spacer(1, 14))
        items.append(PageBreak())
        return items

    # -------------------------------------------------------------
    # PAGE 1: PUBLIC LANDING PAGE
    # -------------------------------------------------------------
    p1_meta = {
        "num": "2.1",
        "title": "Public Landing Page & Closed-Loop Cockpit",
        "route": "/",
        "role": "Public Universal (Role Adaptive)",
        "tier": "Presentation & Discovery",
        "lang": "English (or 7 Regional Languages for Farmers)",
        "file": "01_landing_page",
        "purpose": (
            "Serves as the high-impact portal showcasing the 4-pillar architectural foundation. Features dynamic 3D elevation cards, "
            "live telemetry ticker, benchmark KPI performance targets, the 6-Stage Resilience Cycle, role-filtered CTA buttons, and a live "
            "demonstration card of the Nadia pilot farm. Adapts dynamically: if role is Farmer, displays regional language guidance and "
            "restricts actions exclusively to farmer portals."
        )
    }
    p1_reqs = [
        {"label": "Real-Time Telemetry Tick", "detail": "Polls <code>/api/iot/devices/iot-dev-1</code> every 3s to retrieve volumetric soil moisture and pump relay status."},
        {"label": "Agronomic Research Benchmarks", "detail": "Static calibration matrices benchmarked against PlantVillage (38 foliar disease classes, 92.9% accuracy)."},
        {"label": "Pilot Farm Reference State", "detail": "Pre-seeded pilot record for Plot #204 Nadia District, Aman Paddy, showing CHF 0.71 vigour status."},
        {"label": "Role-Based CTA Dynamic State", "detail": "Inspects <code>agrisure_user_role</code> cookie. Renders Farmer Hub & Apply Insurance for FARMER; Underwriter Desk for INSURER."}
    ]
    p1_fields = [
        ["Disease Taxonomy", "Integer", "KPI Card", "No", "Calibrated taxonomy classes from PlantVillage", "38 classes"],
        ["Model Precision", "Float (Percentage)", "KPI Card", "No", "Accuracy score across foliar blight & brown spot", "92.9%"],
        ["CHF Correlation (r)", "Float", "KPI Card", "No", "Pearson r correlation against actual harvest yields", "0.85"],
        ["Claim Target Speed", "String (Range)", "KPI Card", "No", "Benchmark resolution turnaround vs 6-9 mo traditional", "30–45 days"],
        ["IoT Polling Interval", "Integer (Seconds)", "KPI Card", "No", "ESP32 transmission cycle frequency", "3s"],
        ["Pilot Plot ID", "String", "Live Unit Badge", "No", "Cadastral identifier for primary demonstration farm", "Plot #204 (Baganchra)"],
        ["Pilot CHF Health", "Float (0.00-1.00)", "Status Indicator", "No", "Composite Crop Health Factor (Normal: 0.76)", "0.71 (Optimal)"],
        ["Pilot Soil Moisture", "Float (Percentage)", "Live Readout", "No", "Volumetric Water Content (VWC) at 15cm", "58.0% VWC"],
        ["Weather Risk State", "String (Enum)", "Pill Badge", "No", "Values: LOW, MODERATE, HIGH, SEVERE", "Low (Monsoon Inflow)"],
    ]
    story.extend(render_page_section(p1_meta, p1_reqs, p1_fields))

    # -------------------------------------------------------------
    # PAGE 2: FARMER RESILIENCE DASHBOARD
    # -------------------------------------------------------------
    p2_meta = {
        "num": "2.2",
        "title": "Farmer Agronomic Resilience Hub",
        "route": "/farmer/dashboard",
        "role": "FARMER (Strictly Restricted)",
        "tier": "Core Operational Workspace",
        "lang": "7 Regional Languages with Audio Synthesis",
        "file": "02_farmer_dashboard",
        "purpose": (
            "Central daily management console for smallholder farmers. Built with a 4-step visual pictorial guide and regional voice "
            "synthesis for low-literacy users. Displays plain-language vigour scores, volumetric root soil moisture, disease status, "
            "prescribed actions, 4-day weather forecasts, and an interactive 1-click pump toggle actuating physical field micro-drip relays."
        )
    }
    p2_reqs = [
        {"label": "Farm Master Record", "detail": "<code>GET /api/farms/farm-plot-204</code> retrieves boundary, acreage, crop type, and cadastral registration."},
        {"label": "In-Situ Sensor Stream", "detail": "<code>GET /api/farms/farm-plot-204/sensors</code> retrieves real-time ESP32 soil moisture (58.0%) and soil temp (28.4°C)."},
        {"label": "Micro-Climate Forecast", "detail": "<code>GET /api/farms/farm-plot-204/weather</code> provides 4-day precipitation forecasts (4mm, 12mm, 24mm, 0mm)."},
        {"label": "Pump Relay Actuation", "detail": "<code>POST /api/iot/devices/iot-dev-1/toggle</code> sends payload <code>{ action: 'toggle' }</code> to flip physical pump relay."},
        {"label": "Speech Synthesis Engine", "detail": "Web Audio API generates 2-tone melodic chime; SpeechSynthesis speaks localized advisory in <code>bn-IN</code>, <code>te-IN</code>, etc."}
    ]
    p2_fields = [
        ["Farmer Name", "String", "Greeting Header", "No", "Authenticated farmer identity from profile", "Subhash Biswas / Rajesh Mondal"],
        ["Selected Plot", "String", "Dropdown Selector", "Yes", "Plot ID matching registered landholdings", "Plot #204 (Baganchra)"],
        ["Crop Health (CHF)", "Float (0.00-1.00)", "Health Card (🟢)", "No", "Shannon entropy composite vigour index", "0.71 (Optimal Vigour)"],
        ["Soil Moisture (VWC)", "Float (%)", "Moisture Card (💧)", "No", "Volumetric water content from ESP32 capacitance", "58.0%"],
        ["Weather Risk", "String (Enum)", "Weather Card (⛅)", "No", "Computed synoptic storm/drought risk level", "Low Risk (Monsoon Steady)"],
        ["Disease Threat", "String", "Disease Card (🌿)", "No", "Foliar blight inference from satellite/CV scan", "Canopy Clear (0% Blight)"],
        ["Prescribed Action", "String", "Action Card (⚡)", "No", "Daily agronomic prescription in regional language", "Micro-drip pulse on Friday"],
        ["Pump Toggle Switch", "Boolean", "Button Control", "Yes", "Toggles state: TRUE (Running) or FALSE (Idle)", "PUMP RUNNING / STANDBY"],
        ["Health Trend Series", "Array of Objects", "Recharts LineChart", "No", "6-week historical CHF progression vs normal 0.76", "[Week 1: 68 ... Current: 71]"],
    ]
    story.extend(render_page_section(p2_meta, p2_reqs, p2_fields))

    # -------------------------------------------------------------
    # PAGE 3: MY FARMS PORTFOLIO
    # -------------------------------------------------------------
    p3_meta = {
        "num": "2.3",
        "title": "My Farms Portfolio & Satellite Index Map",
        "route": "/farmer/farms",
        "role": "FARMER (Strictly Restricted)",
        "tier": "Geospatial Farm Management",
        "lang": "7 Regional Languages",
        "file": "03_farmer_farms",
        "purpose": (
            "Geospatial landholding explorer allowing farmers to inspect all registered plots. Renders interactive satellite overlay boundaries "
            "(Leaflet GIS), area acreages, crop types, planting dates, and multi-spectral vegetation indices (NDVI, NDRE, LSWI, VH/VV backscatter)."
        )
    }
    p3_reqs = [
        {"label": "Plots GeoJSON Collection", "detail": "<code>GET /api/farms</code> returns GeoJSON polygon coordinates, soil characteristics, and assigned Insurance Unit code."},
        {"label": "Multispectral Tile Endpoint", "detail": "<code>GET /api/farms/[id]/satellite</code> provides Sentinel-2 B4, B8, B11 reflectance ratios and cloud mask metadata."},
        {"label": "Entropy CHF Calculation", "detail": "<code>GET /api/farms/[id]/chf</code> breaks down the 5 weighted sub-indices driving current health score."}
    ]
    p3_fields = [
        ["Plot Identifier", "String (Unique)", "Plot Selector", "Yes", "Unique cadastral plot key (e.g. farm-plot-204)", "Plot #204 (Baganchra)"],
        ["Land Acreage (ha)", "Float", "Numeric Badge", "Yes", "Total cultivable plot area in hectares", "2.8 ha"],
        ["Crop Cultivar", "String", "Text Input", "Yes", "Active crop name (e.g. Aman Paddy, Jute, Potato)", "Aman Paddy (Swarna Sub-1)"],
        ["Planting Sowing Date", "Date (YYYY-MM-DD)", "Date Picker", "Yes", "Kharif germination / transplanting date", "2026-06-15"],
        ["Normalized NDVI", "Float (-1.0 to 1.0)", "Telemetry Gauge", "No", "Near-infrared vs Red reflectance: (B8-B4)/(B8+B4)", "0.68 (Healthy Canopy)"],
        ["Soil Water Index (LSWI)", "Float (-1.0 to 1.0)", "Telemetry Gauge", "No", "Canopy moisture index: (B8-B11)/(B8+B11)", "0.42 (Adequate Moisture)"],
        ["SAR VH Backscatter", "Float (dB)", "Radar Metric", "No", "Sentinel-1 cross-polarization volumetric scattering", "-14.2 dB"],
        ["Insurance Unit (IU)", "String (Code)", "Readonly Code", "No", "Government PMFBY administrative cluster code", "WB-NAD-001 (Nadia Central)"],
    ]
    story.extend(render_page_section(p3_meta, p3_reqs, p3_fields))

    # -------------------------------------------------------------
    # PAGE 4: COMPUTER VISION LEAF DISEASE AI
    # -------------------------------------------------------------
    p4_meta = {
        "num": "2.4",
        "title": "Computer Vision Leaf Disease AI",
        "route": "/farmer/disease",
        "role": "FARMER (Strictly Restricted)",
        "tier": "Edge Agronomic Diagnostics",
        "lang": "7 Regional Languages",
        "file": "04_farmer_disease_ai",
        "purpose": (
            "Mobile-optimized diagnostic portal where farmers take a photo of an affected leaf or upload an image. The deep convolutional "
            "neural network classifies the foliar condition across 38 crop disease categories, provides a model confidence rating, severity level, "
            "and immediate scientific/organic chemical treatment prescriptions with exact sprayer dosages."
        )
    }
    p4_reqs = [
        {"label": "Diagnostic Inference API", "detail": "<code>POST /api/disease/predict</code> receives multipart foliar image file or base64 data string."},
        {"label": "Disease Classification Model", "detail": "ResNet-50 / MobileNet backbone calibrated on 54,305 PlantVillage foliar samples across 14 crop species."},
        {"label": "Treatment Repository", "detail": "Database lookup linking detected pathogen to registered CIBRC (Central Insecticides Board) approved treatments."}
    ]
    p4_fields = [
        ["Leaf Photo Upload", "Binary (JPEG/PNG)", "File Dropzone / Camera", "Yes", "Max file size: 10 MB. Foliar crop image required", "IMG_rice_leaf_0842.jpg"],
        ["Associated Farm Plot", "String", "Dropdown Selector", "Yes", "Plot context where the leaf was sampled", "Plot #204 (Baganchra)"],
        ["Detected Diagnosis", "String", "Result Card", "No", "Predicted disease name or Healthy confirmation", "Rice Brown Spot (Bipolaris oryzae)"],
        ["Confidence Rating", "Float (%)", "Confidence Bar", "No", "Softmax probability distribution score &ge; 85%", "94.6% Confidence"],
        ["Severity Classification", "String (Enum)", "Pill Badge", "No", "Values: INCIPIENT (L1), MODERATE (L2), SEVERE (L3)", "Stage 1 (Incipient Lesions)"],
        ["Chemical Remedy", "String", "Prescription Box", "No", "Fungicide / bactericide dosage per liter of water", "Hexaconazole 5% SC @ 2.0 ml/L"],
        ["Bio-Control Alternative", "String", "Prescription Box", "No", "Organic microbial spray recommendations", "Trichoderma viride @ 5g/L foliar"],
        ["Application Timing", "String", "Schedule Alert", "No", "Optimal diurnal window for foliar spray", "Apply late afternoon (after 4:30 PM)"],
    ]
    story.extend(render_page_section(p4_meta, p4_reqs, p4_fields))

    # -------------------------------------------------------------
    # PAGE 5: GA-PSO NUTRIENT OPTIMIZER
    # -------------------------------------------------------------
    p5_meta = {
        "num": "2.5",
        "title": "GA-PSO Bio-Inspired Nutrient Optimizer",
        "route": "/farmer/optimization",
        "role": "FARMER (Strictly Restricted)",
        "tier": "Bio-Inspired Agronomic Optimization",
        "lang": "7 Regional Languages",
        "file": "05_farmer_ga_pso",
        "purpose": (
            "Hybrid heuristic optimizer combining Genetic Algorithms (global exploratory search) and Particle Swarm Optimization (local exploitation) "
            "to balance fertilizer investment against maximum attainable yield. Minimizes nitrate leaching and nitrogen volatilization while respecting "
            "soil chemical equilibria."
        )
    }
    p5_reqs = [
        {"label": "Optimization Solver API", "detail": "<code>POST /api/optimization/run</code> sends soil macronutrient baseline, crop growth stage, and acreage."},
        {"label": "Soil Chemical Baseline", "detail": "Retrieves current soil nitrogen (180 kg/ha), phosphorus (24 kg/ha), and potassium (145 kg/ha)."},
        {"label": "Objective Function Evaluation", "detail": "Calculates pareto front minimizing input expenditure while maximizing crop vigour curve."}
    ]
    p5_fields = [
        ["Crop Phenology Stage", "String (Enum)", "Dropdown", "Yes", "Values: VEGETATIVE, PANICLE_INITIATION, GRAIN_FILLING", "Panicle Initiation"],
        ["Available Soil N", "Float (kg/ha)", "Number Input", "Yes", "Soil test / sensor nitrogen: range 50 - 400 kg/ha", "180 kg/ha"],
        ["Available Soil P", "Float (kg/ha)", "Number Input", "Yes", "Available Olsen phosphorus: range 5 - 80 kg/ha", "24 kg/ha"],
        ["Available Soil K", "Float (kg/ha)", "Number Input", "Yes", "Available ammonium acetate potassium: range 50 - 500", "145 kg/ha"],
        ["Optimization Weight", "Float (0.0-1.0)", "Range Slider", "Yes", "Balance: 0.0 (Cost Min) to 1.0 (Yield Max)", "0.70 (Yield Priority)"],
        ["Recommended Urea", "Float (kg/ha)", "Output Card", "No", "Calibrated 46-0-0 nitrogen fertilizer requirement", "65.0 kg/ha"],
        ["Recommended DAP", "Float (kg/ha)", "Output Card", "No", "Di-ammonium Phosphate 18-46-0 dosage", "35.0 kg/ha"],
        ["Recommended MOP", "Float (kg/ha)", "Output Card", "No", "Muriate of Potash 0-0-60 dosage", "25.0 kg/ha"],
        ["Target Water Depth", "Float (mm)", "Output Card", "No", "Calculated irrigation pulse volume", "45 mm"],
        ["Yield Increment", "Float (%)", "Metric Callout", "No", "Projected percentage gain over control plot", "+14.2% Estimated Yield"],
    ]
    story.extend(render_page_section(p5_meta, p5_reqs, p5_fields))

    # -------------------------------------------------------------
    # PAGE 6: IOT TELEMETRY & ALERTS
    # -------------------------------------------------------------
    p6_meta = {
        "num": "2.6",
        "title": "In-Situ IoT Sensor Streams & Telemetry Alerts",
        "route": "/farmer/alerts",
        "role": "FARMER (Strictly Restricted)",
        "tier": "Real-Time Telemetry & Alerting",
        "lang": "7 Regional Languages",
        "file": "06_farmer_iot_alerts",
        "purpose": (
            "Live streaming telemetry monitor showing real-time readings from in-field sensor probes and solar weather stations. Generates "
            "prioritized alert cards (Critical, Warning, Info) with timestamps and allows farmers to acknowledge alerts or trigger automated "
            "pump mitigation with one click."
        )
    }
    p6_reqs = [
        {"label": "Alerts Stream Endpoint", "detail": "<code>GET /api/farms/[id]/alerts</code> lists unacknowledged and historical physiological stress warnings."},
        {"label": "Live Ingestion Telemetry", "detail": "<code>GET /api/iot/devices</code> streams active probe battery voltage, signal RSSI, and sensor values."},
        {"label": "Alert Acknowledgment", "detail": "<code>POST /api/farms/[id]/alerts/[alertId]/ack</code> updates status from UNREAD to ACKNOWLEDGED."}
    ]
    p6_fields = [
        ["Alert Priority Severity", "String (Enum)", "Color-Coded Badge", "No", "Values: CRITICAL (Red), WARNING (Amber), INFO (Blue)", "WARNING"],
        ["Alert Title", "String", "Alert Card Header", "No", "Concise issue summary in regional language", "Root Zone Moisture Deficit (<35%)"],
        ["Sensor Node Origin", "String", "Device Tag", "No", "Hardware identifier of the emitting ESP32 unit", "ESP32-NODE-01 (Plot #204)"],
        ["Observed Metric Value", "Float + Unit", "Numeric Metric", "No", "Physical value breaching tolerance envelope", "31.4% VWC (Tolerance &ge; 45%)"],
        ["Trigger Timestamp", "DateTime (ISO)", "Time Label", "No", "Time of threshold breach occurrence", "2026-09-16 14:22:10 IST"],
        ["Action Taken Status", "String (Enum)", "Status Badge", "No", "Values: UNREAD, ACKNOWLEDGED, MITIGATED", "MITIGATED (Pump Actuated)"],
        ["Mitigation Shortcut", "Button Action", "Action Button", "Yes", "Triggers immediate pump relay activation", "Start Drip Irrigation Pulse"],
    ]
    story.extend(render_page_section(p6_meta, p6_reqs, p6_fields))

    # -------------------------------------------------------------
    # PAGE 7: PARAMETRIC INSURANCE HUB
    # -------------------------------------------------------------
    p7_meta = {
        "num": "2.7",
        "title": "Parametric Crop Insurance Active Policies",
        "route": "/farmer/insurance",
        "role": "FARMER (Strictly Restricted)",
        "tier": "Insurance Coverage Management",
        "lang": "7 Regional Languages",
        "file": "07_farmer_insurance_hub",
        "purpose": (
            "Farmer's dedicated insurance portfolio overview. Displays all active, pending, and past policies. Highlights coverage sums insured, "
            "parametric trigger conditions (CHF breach threshold), current index safety margins, and one-click direct application for new policies."
        )
    }
    p7_reqs = [
        {"label": "Farmer Policies Endpoint", "detail": "<code>GET /api/policies?farmerId=...</code> returns policy history, status, certificate hash, and trigger terms."},
        {"label": "Current CHF Monitoring", "detail": "Cross-references live plot CHF against policy trigger threshold to compute breach vigilance state."}
    ]
    p7_fields = [
        ["Policy Reference ID", "String (Unique)", "Card Header Code", "No", "Format: POL-WB-YYYY-XXXX", "POL-WB-2026-0881"],
        ["Covered Farm Plot", "String", "Plot Name Pill", "No", "Designated landholding parcel", "Plot #204 (Baganchra, Nadia)"],
        ["Coverage Sum Insured", "Currency (INR)", "Primary Metric", "No", "Total guaranteed parametric financial payout", "₹1,40,000"],
        ["Trigger CHF Condition", "Float (0.00-1.00)", "Index Threshold", "No", "Payout triggers if 14-day mean CHF drops below", "0.580 (Index Threshold)"],
        ["Current Plot Vigour", "Float (0.00-1.00)", "Health Readout", "No", "Active satellite Crop Health Factor", "0.710 (Safe / No Breach)"],
        ["Policy Approval Status", "String (Enum)", "Status Badge", "No", "Values: ACTIVE (Green), PENDING (Amber), REJECTED (Red)", "ACTIVE & VERIFIED"],
        ["Gross Premium Amount", "Currency (INR)", "Financial Breakdown", "No", "Actuarial premium calculated for season", "₹7,000"],
        ["PMFBY Subsidy Credit", "Currency (INR)", "Subsidy Tag", "No", "80% government financial subsidy contribution", "₹5,600 (Govt Paid)"],
        ["Farmer Net Contribution", "Currency (INR)", "Net Payable", "No", "Statutory 2% Kharif premium share paid by farmer", "₹1,400 (Paid)"],
    ]
    story.extend(render_page_section(p7_meta, p7_reqs, p7_fields))

    # -------------------------------------------------------------
    # PAGE 8: PARAMETRIC INSURANCE APPLICATION FORM
    # -------------------------------------------------------------
    p8_meta = {
        "num": "2.8",
        "title": "Guided Parametric Insurance Application Form",
        "route": "/farmer/insurance/apply",
        "role": "FARMER (Strictly Restricted)",
        "tier": "Financial Enrolment & Onboarding",
        "lang": "7 Regional Languages",
        "file": "08_farmer_insurance_apply",
        "purpose": (
            "A structured 4-step guided insurance enrolment application for smallholder farmers with regional voice assistance. Features "
            "plot selection, coverage tier options (Baseline vs Comprehensive), live 80% PMFBY government subsidy calculations, automated "
            "DBT bank account verification, and instantaneous submission creating a pending underwriting record."
        )
    }
    p8_reqs = [
        {"label": "Plot Enrolment Options", "detail": "Retrieves farmer plots eligible for Kharif 2026 coverage (Plot #204, Plot #205, Plot #212)."},
        {"label": "Actuarial Premium Engine", "detail": "Calculates gross premium (5%), PMFBY government subsidy (80%), and statutory farmer payable (2%)."},
        {"label": "DBT Bank Verification Service", "detail": "Validates linked bank account IFSC (PUNB0120111) and Aadhaar direct benefit transfer eligibility."},
        {"label": "Policy Submission API", "detail": "<code>POST /api/policies</code> submits complete insurance application payload to institutional underwriter queue."}
    ]
    p8_fields = [
        ["Selected Plot Option", "String", "Plot Radio Cards", "Yes", "Farmer selects from registered farm parcels", "Plot #204 (2.8 ha, Aman Paddy)"],
        ["Coverage Shield Tier", "String (Enum)", "Tier Selector Cards", "Yes", "Values: BASELINE (CHF 0.55), COMPREHENSIVE (CHF 0.58)", "COMPREHENSIVE SHIELD"],
        ["Total Sum Insured", "Currency (INR)", "Calculated Display", "No", "Derived: Plot Acreage × Scale of Finance (₹50k/ha)", "₹1,40,000"],
        ["Gross Premium (5%)", "Currency (INR)", "Calculated Display", "No", "Standard actuarial premium rate before subsidy", "₹7,000"],
        ["PMFBY Govt Subsidy (80%)", "Currency (INR)", "Calculated Display", "No", "State and Central government statutory support", "-₹5,600"],
        ["Farmer Net Payable (2%)", "Currency (INR)", "Highlighted Cost", "No", "Actual out-of-pocket amount payable by farmer", "₹1,400"],
        ["Trigger CHF Threshold", "Float", "Terms Specification", "No", "Index trigger breach parameter for chosen tier", "0.580 CHF"],
        ["Bank Account Linkage", "String (Masked)", "Readonly Verification", "Yes", "Pre-verified bank account for automatic DBT payout", "Punjab National Bank (****8420)"],
        ["Underwriter Application Notes", "String", "Text Input (Optional)", "No", "Optional remarks or field history provided by applicant", "Applied online via Farmer Web Portal"],
    ]
    story.extend(render_page_section(p8_meta, p8_reqs, p8_fields))

    # -------------------------------------------------------------
    # PAGE 9: FARMER PAYOUTS & BANK CLAIMS
    # -------------------------------------------------------------
    p9_meta = {
        "num": "2.9",
        "title": "Direct Benefit Bank Payouts Ledger",
        "route": "/farmer/payments",
        "role": "FARMER (Strictly Restricted)",
        "tier": "Financial Disbursements & Settlements",
        "lang": "7 Regional Languages",
        "file": "09_farmer_payments",
        "purpose": (
            "Displays the farmer's transaction ledger of all automatic parametric claim compensations deposited directly into their bank account. "
            "Lists triggering drought/pest events, calculated loss shortfalls, RBI NEFT/IMPS transaction reference numbers, and settlement timestamps."
        )
    }
    p9_reqs = [
        {"label": "Payouts History Endpoint", "detail": "<code>GET /api/payouts?farmerId=...</code> retrieves historical compensation disbursements."},
        {"label": "Banking Gateway Integration", "detail": "Simulated Reserve Bank of India National Electronic Funds Transfer (NEFT) settlement UTR records."}
    ]
    p9_fields = [
        ["Claim Sequence ID", "String", "Code Identifier", "No", "Format: CLM-YYYY-XXXX", "CLM-2026-0041"],
        ["Peril Classification", "String", "Peril Badge", "No", "Triggering peril: DROUGHT_INDEX, EXCESS_RAIN, PEST_SHOCK", "Deficit Precipitation / Drought Index"],
        ["Index Shortfall Extent", "Float (%)", "Shortfall Pill", "No", "Calculated deficit between baseline and observed CHF", "18.5% CHF Deficit"],
        ["Disbursed Compensation", "Currency (INR)", "Primary Amount", "No", "Direct payout credited to farmer's bank account", "₹25,900.00"],
        ["Bank UTR Reference", "String", "Transaction Code", "No", "Official banking settlement reference number", "NEFT-RBI-99382104"],
        ["Disbursement Timestamp", "DateTime", "Time Label", "No", "Timestamp of completed electronic funds transfer", "2026-08-12 11:45:00 IST"],
        ["Transfer Status", "String (Enum)", "Status Badge", "No", "Values: INITIATED, TRANSFERRED_TO_BANK, SETTLED", "TRANSFERRED_TO_BANK 🟢"],
    ]
    story.extend(render_page_section(p9_meta, p9_reqs, p9_fields))

    # -------------------------------------------------------------
    # PAGE 10: INSURER UNDERWRITING DESK
    # -------------------------------------------------------------
    p10_meta = {
        "num": "2.10",
        "title": "Institutional Underwriter Exposure Desk",
        "route": "/insurer/dashboard",
        "role": "INSURER (Strictly Restricted)",
        "tier": "Actuarial Portfolio Risk Analytics",
        "lang": "English (Professional Actuarial)",
        "file": "10_insurer_dashboard",
        "purpose": (
            "Macro-risk cockpit designed for insurance executives, actuaries, and reinsurers. Displays aggregate portfolio exposure across "
            "West Bengal agricultural districts, current loss ratios, active policies count, spatial CHF density distributions, flagged high-risk "
            "insurance units, and direct shortcuts to the Policy Application Review Desk."
        )
    }
    p10_reqs = [
        {"label": "Portfolio Exposure Summary", "detail": "<code>GET /api/insurance-units/summary</code> calculates aggregate insured area (48,250 ha) and total sum insured (₹142.8 Cr)."},
        {"label": "Actuarial Loss Ratio", "detail": "Computes current claims payout vs gross written premium (18.4% current vs 65% ceiling)."},
        {"label": "Underwriting Policy Stats", "detail": "<code>GET /api/policies/stats</code> tracks pending application queue count and daily intake velocity."}
    ]
    p10_fields = [
        ["Total Insured Acreage", "Float (Hectares)", "Metric Card", "No", "Aggregate insured farmland under management", "48,250 ha"],
        ["Total Portfolio Exposure", "Currency (INR Crores)", "Metric Card", "No", "Gross aggregate sum insured exposure", "₹142.80 Crores"],
        ["Active Policies Enrolled", "Integer", "Metric Card", "No", "Total active parametric policies issued", "1,280 Policies"],
        ["Portfolio Loss Ratio", "Float (%)", "Risk Metric", "No", "Total claims paid / Total gross premium received", "18.4% (Healthy)"],
        ["State Mean CHF Index", "Float (0.00-1.00)", "Health Metric", "No", "Mean vegetative index across all clusters", "0.684"],
        ["High Risk IU Units", "Integer", "Warning Alert", "No", "Units with >30% plots approaching trigger threshold", "3 Units Flagged (Bankura, Murshidabad)"],
        ["Application Queue Alert", "Badge Counter", "Navigation Shortcut", "No", "Number of pending farmer policies awaiting review", "3 Applications Pending Review ⚡"],
    ]
    story.extend(render_page_section(p10_meta, p10_reqs, p10_fields))

    # -------------------------------------------------------------
    # PAGE 11: INSURER POLICY REVIEW DESK
    # -------------------------------------------------------------
    p11_meta = {
        "num": "2.11",
        "title": "Policy Applications & Decisioning Review Desk",
        "route": "/insurer/policies",
        "role": "INSURER (Strictly Restricted)",
        "tier": "Underwriting Adjudication & Governance",
        "lang": "English (Professional Actuarial)",
        "file": "11_insurer_policies_review",
        "purpose": (
            "Interactive underwriter review workspace where institutional officers examine incoming farmer insurance applications. Features "
            "applicant profile inspection, satellite historical baselines, and one-click 'Accept & Issue Policy' (green) or 'Reject Application' "
            "(red) with mandatory formal rejection reasons and auditable notes."
        )
    }
    p11_reqs = [
        {"label": "Pending Applications Queue", "detail": "<code>GET /api/policies?status=PENDING_APPROVAL</code> lists incoming farmer policy applications."},
        {"label": "Historical Baseline Validation", "detail": "Cross-checks plot satellite NDVI records to ensure land parcel has genuine agricultural history."},
        {"label": "Policy Decision Dispatch API", "detail": "<code>POST /api/policies/[id]/decision</code> with payload <code>{ decision: 'APPROVE'|'REJECT', reason, notes }</code>."},
        {"label": "Audit Trail Inscription", "detail": "On approval or rejection, automatically commits a SHA-256 state transition block to the immutable audit ledger."}
    ]
    p11_fields = [
        ["Application ID", "String (Unique)", "Table Column", "No", "System identifier for policy application", "pol-sub-1049"],
        ["Applicant Farmer Name", "String", "Table Column", "No", "Farmer legal identity", "Rajesh Mondal / Subhash Biswas"],
        ["Plot Identifier & Area", "String + Float", "Table Column", "No", "Cadastral plot identifier and acreage", "Plot #204 (2.8 ha)"],
        ["Crop Cultivar", "String", "Table Column", "No", "Target agricultural commodity", "Aman Paddy"],
        ["Requested Sum Insured", "Currency (INR)", "Table Column", "No", "Requested parametric coverage value", "₹1,40,000"],
        ["Gross Premium Calculated", "Currency (INR)", "Table Column", "No", "Actuarial premium assessed", "₹7,000"],
        ["Govt Subsidy Credit", "Currency (INR)", "Table Column", "No", "80% PMFBY financial contribution", "₹5,600"],
        ["Farmer Net Payable", "Currency (INR)", "Table Column", "No", "2% farmer statutory share", "₹1,400"],
        ["Decision Action: Accept", "Button (Green)", "Action Button", "Yes", "Triggers policy activation and cryptographic certificate", "Accept & Issue Policy 🟢"],
        ["Decision Action: Reject", "Button (Red)", "Action Button", "Yes", "Opens modal for formal rejection reason selection", "Reject Application 🔴"],
        ["Formal Rejection Reason", "String (Enum)", "Modal Dropdown", "Yes (if reject)", "Predefined IRDAI reason codes", "EXCEEDS_SPATIAL_IU_RISK_CAP"],
        ["Underwriter Review Notes", "String", "Modal Textarea", "Yes (if reject)", "Auditable commentary justifying decision", "Spatial concentration in cluster exceeds cap"],
    ]
    story.extend(render_page_section(p11_meta, p11_reqs, p11_fields))

    # -------------------------------------------------------------
    # PAGE 12: INSURER RISK MAP
    # -------------------------------------------------------------
    p12_meta = {
        "num": "2.12",
        "title": "Insurance Unit Spatial Risk Choropleth Map",
        "route": "/insurer/risk-map",
        "role": "INSURER (Strictly Restricted)",
        "tier": "Spatial Actuarial GIS",
        "lang": "English (Professional Actuarial)",
        "file": "12_insurer_risk_map",
        "purpose": (
            "Geospatial choropleth console visualizing aggregated crop health, drought exposure, and parametric liability across all "
            "Insurance Units (IUs) in West Bengal. Underwriters toggle multi-spectral overlays, inspect spatial correlation matrices, and "
            "identify localized peril hotspots before threshold breach cascades."
        )
    }
    p12_reqs = [
        {"label": "IU GeoJSON Boundaries", "detail": "<code>GET /api/insurance-units</code> returns spatial polygons for WB-NAD-001, WB-BRD-004, WB-MUR-002, etc."},
        {"label": "Aggregated Spatial Risk Index", "detail": "Computes spatial copula model evaluating inter-plot correlation and catastrophic cluster risk."},
        {"label": "Raster Layer Overlay", "detail": "Integrates false-color infrared (CIR) and moisture deficit heatmaps onto the Leaflet map viewport."}
    ]
    p12_fields = [
        ["Insurance Unit Code", "String (Unique)", "Polygon Label", "No", "Administrative unit code (e.g. WB-NAD-001)", "WB-NAD-001 (Nadia Central)"],
        ["District Cluster", "String", "Tooltip Header", "No", "Administrative district classification", "Nadia District"],
        ["Mean Unit CHF", "Float (0.00-1.00)", "Choropleth Color", "No", "Green (&ge;0.70), Yellow (0.60-0.69), Red (<0.60)", "0.710 (Normal / Green)"],
        ["Enrolled Farmland Area", "Float (ha)", "Info Sidebar", "No", "Total active insured acreage in unit", "12,450 ha"],
        ["Total Exposure Liability", "Currency (INR)", "Info Sidebar", "No", "Cumulative sum insured in unit", "₹37.35 Crores"],
        ["Drought Vulnerability", "String (Enum)", "Pill Badge", "No", "Values: LOW, MODERATE, HIGH, CRITICAL", "LOW (Adequate Monsoon)"],
        ["Layer Toggles", "String (Options)", "Map Control Bar", "Yes", "NDVI, NDRE, LSWI, VH/VV Radar, Soil Moisture", "Active: Synthetic Aperture Radar (SAR)"],
    ]
    story.extend(render_page_section(p12_meta, p12_reqs, p12_fields))

    # -------------------------------------------------------------
    # PAGE 13: CLAIMS & 11-SECTION EVIDENCE PACKAGES
    # -------------------------------------------------------------
    p13_meta = {
        "num": "2.13",
        "title": "Parametric Claims Verification Console",
        "route": "/insurer/claims",
        "role": "INSURER (Strictly Restricted)",
        "tier": "Claims Adjudication & Evidence",
        "lang": "English (Professional Actuarial)",
        "file": "13_insurer_claims_evidence",
        "purpose": (
            "Auditing cockpit for examining automatically triggered parametric claims. Contains full 11-Section Cryptographic Evidence "
            "Dossiers compiling cadastral identity, in-situ sensor history, Sentinel-2/1 curves, Shannon entropy calculations, spatial correlation "
            "checks, and direct authorization triggers for bank disbursement."
        )
    }
    p13_reqs = [
        {"label": "Claims Queue Endpoint", "detail": "<code>GET /api/claims</code> retrieves claims in VERIFIED, UNDER_REVIEW, and SETTLED states."},
        {"label": "11-Section Dossier API", "detail": "<code>GET /api/claims/[id]</code> compiles complete multi-source empirical evidence package."},
        {"label": "Claim Approval API", "detail": "<code>POST /api/claims/[id]/approve</code> authorizes disbursement and passes claim to payments queue."}
    ]
    p13_fields = [
        ["Claim Identification ID", "String (Unique)", "Table Column", "No", "Format: CLM-YYYY-XXXX", "CLM-2026-0041"],
        ["Policy Reference", "String", "Linked Code", "No", "Underlying parametric policy contract", "POL-WB-2026-0881"],
        ["Beneficiary Farmer", "String", "Table Column", "No", "Claimant farmer name", "Rajesh Mondal"],
        ["Plot Identifier", "String", "Table Column", "No", "Affected farmland plot", "Plot #204 (Baganchra)"],
        ["Triggering Peril", "String (Enum)", "Peril Badge", "No", "Values: DROUGHT_INDEX, FLOOD_SAR, HEAT_STRESS", "DROUGHT_INDEX (CHF Deficit)"],
        ["Trigger CHF Breached", "Float", "Numeric Column", "No", "Contractually specified breach threshold", "0.580 CHF"],
        ["Observed Mean CHF", "Float", "Numeric Column", "No", "Actual 14-day observed composite index", "0.472 CHF (Deficit 18.5%)"],
        ["Assessed Payout Amount", "Currency (INR)", "Financial Column", "No", "Compensation determined by index shortfall formula", "₹25,900.00"],
        ["Evidence Package Status", "String", "Status Badge", "No", "Verification of all 11 scientific evidence sections", "11/11 SECTIONS VERIFIED 🔒"],
        ["Action: Authorize Payout", "Button (Emerald)", "Action Button", "Yes", "Directs claim to automated RBI disbursement pipeline", "Authorize Payout &rarr;"],
    ]
    story.extend(render_page_section(p13_meta, p13_reqs, p13_fields))

    # -------------------------------------------------------------
    # PAGE 14: 7-STAGE PAYOUTS SETTLEMENT
    # -------------------------------------------------------------
    p14_meta = {
        "num": "2.14",
        "title": "7-Stage Automated RBI NEFT/IMPS Settlement",
        "route": "/insurer/payouts",
        "role": "INSURER (Strictly Restricted)",
        "tier": "Banking & Funds Disbursement",
        "lang": "English (Professional Actuarial)",
        "file": "14_insurer_payouts_settlement",
        "purpose": (
            "Visual workflow tracker monitoring the 7 automated settlement stages: 1. Trigger Detection → 2. Spatial Cross-Validation → "
            "3. Quantum Determination → 4. Reinsurance Allocation → 5. Underwriter Authorization → 6. RBI Gateway Transmission → "
            "7. DBT Account Credit. Features simulated RBI NEFT/IMPS settlement execution."
        )
    }
    p14_reqs = [
        {"label": "Settlements Batch Endpoint", "detail": "<code>GET /api/payouts</code> lists queued and executed bank direct transfer transactions."},
        {"label": "Instant Settlement Trigger", "detail": "<code>POST /api/payouts/[id]/execute</code> dispatches funds transfer to simulated RBI gateway."}
    ]
    p14_fields = [
        ["Payout Batch Reference", "String (Unique)", "Batch Header", "No", "Format: PAY-BATCH-YYYY-MM-XXXX", "PAY-BATCH-2026-09-001"],
        ["Disbursement Amount", "Currency (INR)", "Primary Card Metric", "No", "Total funds released in this transaction", "₹25,900.00"],
        ["Beneficiary Bank Name", "String", "Bank Badge", "No", "Farmer's registered direct benefit transfer bank", "Punjab National Bank"],
        ["Beneficiary IFSC Code", "String", "Readonly Code", "No", "Branch IFSC code (11 characters)", "PUNB0120111"],
        ["Settlement Stage Active", "Integer (1 to 7)", "Step Progress Indicator", "No", "Active pipeline stage of the 7 settlement steps", "Stage 6: RBI Gateway Transmission"],
        ["RBI UTR Number", "String", "Receipt Identifier", "No", "Unique Transaction Reference from central bank", "NEFT-RBI-99382104"],
        ["Execution Timestamp", "DateTime", "Time Record", "No", "Settlement execution time", "2026-09-16 11:45:00 IST"],
        ["Settlement State", "String (Enum)", "Status Badge", "No", "Values: QUEUED, IN_TRANSIT, COMPLETED", "COMPLETED & CREDITED 🟢"],
    ]
    story.extend(render_page_section(p14_meta, p14_reqs, p14_fields))

    # -------------------------------------------------------------
    # PAGE 15: CRYPTOGRAPHIC AUDIT LEDGER
    # -------------------------------------------------------------
    p15_meta = {
        "num": "2.15",
        "title": "Immutable Cryptographic SHA-256 Audit Trail",
        "route": "/insurer/audit",
        "role": "INSURER (Strictly Restricted)",
        "tier": "Integrity & Compliance Ledger",
        "lang": "English (Professional Actuarial)",
        "file": "15_insurer_cryptographic_audit",
        "purpose": (
            "Enterprise cryptographic audit ledger recording every state change, satellite pass calculation, model inference, underwriter decision, "
            "and banking settlement in a chained SHA-256 Merkle structure. Guarantees regulatory transparency for IRDAI auditors and reinsurers."
        )
    }
    p15_reqs = [
        {"label": "Audit Blocks Endpoint", "detail": "<code>GET /api/audit</code> lists chained transaction blocks with cryptographic hash verification."},
        {"label": "Merkle Root Computation", "detail": "Calculates cryptographic root hash certifying integrity against previous block hash."}
    ]
    p15_fields = [
        ["Audit Block Number", "Integer", "Block Header", "No", "Sequential immutable block index", "Block #0842"],
        ["Timestamp (UTC)", "DateTime", "Time Label", "No", "ISO-8601 millisecond-precision timestamp", "2026-09-16T14:22:10.842Z"],
        ["Entity Type", "String (Enum)", "Entity Pill", "No", "Values: POLICY, CLAIM, SATELLITE_PASS, TELEMETRY, PAYOUT", "POLICY"],
        ["Event Action", "String", "Action Label", "No", "Operation executed (e.g. POLICY_ISSUED, PUMP_TOGGLED)", "POLICY_UNDERWRITING_APPROVED"],
        ["Actor Principal", "String", "Actor Tag", "No", "Entity executing transaction (Underwriter ID, System Oracle)", "Priya Sengupta (IRDAI-AGR-8842)"],
        ["Previous Block Hash", "SHA-256 (64 hex)", "Code Monospace", "No", "Cryptographic hash of immediately preceding block", "7f83b1657ff1fc53b92dc18148a1d6..."],
        ["Current Merkle Hash", "SHA-256 (64 hex)", "Code Monospace", "No", "SHA-256 hash of current block payload", "a591a6d40bf420404a011733cfb7b1..."],
        ["Verification Status", "String", "Security Badge", "No", "Chain integrity verification check", "CRYPTOGRAPHICALLY VERIFIED 🔒"],
    ]
    story.extend(render_page_section(p15_meta, p15_reqs, p15_fields))

    # -------------------------------------------------------------
    # PAGE 16: OPERATIONS & IOT GATEWAY
    # -------------------------------------------------------------
    p16_meta = {
        "num": "2.16",
        "title": "Hardware IoT Ingestion & Pump Relay Control",
        "route": "/operations/iot",
        "role": "ADMIN & FIELD AGENT",
        "tier": "Hardware Infrastructure Operations",
        "lang": "English",
        "file": "16_operations_iot",
        "purpose": (
            "Operations control room monitoring the network of 20 field IoT stations across West Bengal. Displays hardware heartbeat, battery "
            "voltage (LiFePO4 4.1V), cellular/LoRa signal RSSI, dual-probe capacitance calibration, and bi-directional pump relay toggles."
        )
    }
    p16_reqs = [
        {"label": "IoT Fleet Endpoint", "detail": "<code>GET /api/iot/devices</code> retrieves status and readings across all 20 hardware nodes."},
        {"label": "Remote Actuation Dispatch", "detail": "<code>POST /api/iot/devices/[id]/toggle</code> pulses hardware GPIO relay on physical device."},
        {"label": "Heartbeat Tick Monitor", "detail": "<code>POST /api/iot/tick</code> simulates streaming packet arrivals from field edge gateways."}
    ]
    p16_fields = [
        ["Device Hardware ID", "String (Unique)", "Card Header", "No", "MAC / IMEI hardware device tag", "ESP32-NODE-01 (Plot #204)"],
        ["Installed Plot Location", "String", "Location Pill", "No", "Farmland installation site", "Baganchra, Santipur Central (Nadia)"],
        ["Battery Storage Voltage", "Float (Volts)", "Power Indicator", "No", "LiFePO4 solar battery voltage: 3.2V to 4.2V", "4.12 V (Solar Inflow Active)"],
        ["Cellular / LoRa RSSI", "Integer (dBm)", "Signal Bar", "No", "Signal strength: optimal is > -85 dBm", "-78 dBm (Strong Link)"],
        ["Root Soil Moisture (15cm)", "Float (%)", "Sensor Metric", "No", "Volumetric water content in primary root zone", "58.0% VWC"],
        ["Sub-surface Moisture (30cm)", "Float (%)", "Sensor Metric", "No", "Deep capacitance moisture reading", "64.5% VWC"],
        ["Soil Temperature", "Float (°C)", "Sensor Metric", "No", "Direct in-ground probe temperature", "28.4 °C"],
        ["Pump Relay State", "Boolean", "Toggle Control", "Yes", "Physical relay contact: CLOSED (1) or OPEN (0)", "RELAY ACTIVE (Pump On)"],
        ["Flowmeter Rate", "Float (L/min)", "Flow Metric", "No", "Discharge volume through inline micro-drip line", "42.5 L/min"],
    ]
    story.extend(render_page_section(p16_meta, p16_reqs, p16_fields))

    # -------------------------------------------------------------
    # PAGE 17: INTELLIGENCE GIS MAP
    # -------------------------------------------------------------
    p17_meta = {
        "num": "2.17",
        "title": "Sentinel Multispectral GIS Analytics Console",
        "route": "/intelligence/map",
        "role": "ADMIN & FIELD AGENT",
        "tier": "Geospatial Earth Observation",
        "lang": "English",
        "file": "17_intelligence_gis_map",
        "purpose": (
            "High-resolution spatial GIS explorer overlaying European Space Agency Sentinel-2 optical multispectral imagery and Sentinel-1 C-band "
            "SAR radar data. Users toggle false color infrared composites, inspect pixel-level vegetative indices, and analyze cloud penetration."
        )
    }
    p17_reqs = [
        {"label": "Satellite Raster Tile Service", "detail": "Streams Sentinel-2 L2A bottom-of-atmosphere reflectance tiles and Sentinel-1 SAR GRD tiles."},
        {"label": "Cloud Masking Engine", "detail": "Applies Scene Classification Layer (SCL) to filter atmospheric haze and cloud shadows."},
        {"label": "Spatial Query Point Intersect", "detail": "Allows clicking any pixel coordinate to retrieve full spectral signature (B2-B12)."}
    ]
    p17_fields = [
        ["Spectral Band Preset", "String (Enum)", "Layer Dropdown", "Yes", "RGB True Color, CIR Infrared, SWIR Agriculture", "Agriculture Composite (B11-B8-B2)"],
        ["Active Remote Index", "String (Enum)", "Index Selector", "Yes", "NDVI, NDRE, EVI, LSWI, Radar VH/VV Ratio", "NDVI (Normalized Difference Veg)"],
        ["Cloud Mask Threshold", "Integer (%)", "Slider Control", "Yes", "Maximum acceptable scene cloud percentage", "15% Maximum Cloud Cover"],
        ["Pixel Cursor Coordinate", "Float (Lat/Lon)", "Status Coordinate", "No", "Geographic location of viewport cursor", "LAT 23.472°N • LON 88.556°E"],
        ["Sensor Satellite Platform", "String", "Metadata Pill", "No", "Active spacecraft: Sentinel-2A / Sentinel-2B / Sentinel-1A", "Sentinel-2B MSI (10m Resolution)"],
        ["Pixel CHF Health Score", "Float (0.00-1.00)", "Inspect Tooltip", "No", "Calculated vegetative health at sampled point", "0.710 (High Vigour)"],
    ]
    story.extend(render_page_section(p17_meta, p17_reqs, p17_fields))

    # -------------------------------------------------------------
    # PAGE 18: AUTHENTICATION & LOGIN
    # -------------------------------------------------------------
    p18_meta = {
        "num": "2.18",
        "title": "Multi-Role Authentication & OTP Portal",
        "route": "/login",
        "role": "Public Universal",
        "tier": "Access Control & Identity",
        "lang": "English / Role Adaptive",
        "file": "18_auth_login",
        "purpose": (
            "Secure entry portal supporting four distinct personas: Farmer, Insurer, System Administrator, and Field Agent. Provides "
            "1-click evaluation presets for instant demonstration, SMS OTP authentication for rural farmers, and credential login for underwriters."
        )
    }
    p18_reqs = [
        {"label": "Authentication API", "detail": "<code>POST /api/auth/login</code> validates credentials, issues auth token, and sets <code>agrisure_user_role</code> cookie."},
        {"label": "SMS OTP Service", "detail": "Simulated OTP dispatch to farmer's mobile number (+91 98321 44820)."}
    ]
    p18_fields = [
        ["Target Role Persona", "String (Enum)", "Role Selector Tabs", "Yes", "Values: FARMER, INSURER, ADMIN, FIELD_AGENT", "🧑‍🌾 Farmer"],
        ["User Identifier", "String", "Text Input", "Yes", "Mobile Number (Farmers) or Work Email (Insurers)", "+91 98321 44820 / p.sengupta@agrisure.in"],
        ["Password / SMS OTP", "String (Secret)", "Password / OTP Input", "Yes", "Password or 6-digit one-time SMS verification code", "•••••••• / 842011"],
        ["Instant Demo Preset", "Button Action", "Quick-Fill Buttons", "No", "One-click autofill of verified persona credentials", "Autofill Rajesh Mondal (Farmer)"],
        ["Keep Logged In", "Boolean", "Checkbox", "No", "Extends session cookie lifespan to 30 days", "TRUE (Checked)"],
    ]
    story.extend(render_page_section(p18_meta, p18_reqs, p18_fields))

    # -------------------------------------------------------------
    # PAGE 19: HOW IT WORKS & ARCHITECTURE
    # -------------------------------------------------------------
    p19_meta = {
        "num": "2.19",
        "title": "6-Stage Technical Architecture & Agronomic Math",
        "route": "/how-it-works",
        "role": "INSURER & ADMIN",
        "tier": "Technical Documentation",
        "lang": "English",
        "file": "19_how_it_works",
        "purpose": (
            "Comprehensive technical specification detailing the mathematical foundations: the Shannon Entropy Crop Health Factor formula, "
            "GA-PSO bio-inspired heuristic equations, synthetic aperture radar backscatter processing, copula spatial risk aggregation, "
            "and the complete 6-stage operational protocol."
        )
    }
    p19_reqs = [
        {"label": "Mathematical Specifications", "detail": "LaTeX-rendered equations for Shannon entropy sub-index weights and GA-PSO fitness functions."},
        {"label": "Agronomic Protocol Validation", "detail": "Citations of university research models benchmarked against West Bengal agro-ecological zones."}
    ]
    p19_fields = [
        ["Shannon Entropy Formula", "Equation", "Math Block", "No", "CHF = &Sigma; w_i &times; I_i where w_i is derived via entropy weights", "CHF Formula Matrix"],
        ["GA-PSO Fitness Function", "Equation", "Math Block", "No", "Minimizes cost & nutrient leaching; maximizes vegetative vigour", "Fitness Objective Equation"],
        ["SAR Polarimetric Ratio", "Equation", "Math Block", "No", "VH/VV cross-polarization backscatter ratio for soil moisture", "&gamma; = &sigma;^0_VH / &sigma;^0_VV"],
        ["Parametric Trigger Spec", "Rule Spec", "Protocol Block", "No", "Threshold breach specification and claim qualification logic", "CHF &le; 0.580 for 14 consecutive days"],
    ]
    story.extend(render_page_section(p19_meta, p19_reqs, p19_fields))

    # ==========================================
    # 4. DATABASE ENTITY & DATA DICTIONARY
    # ==========================================
    story.append(Paragraph("3. Database Schema & Data Dictionary (Prisma ORM)", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=BORDER_COLOR, spaceBefore=2, spaceAfter=12))

    story.append(Paragraph(
        "The system persists all agro-financial state across 22 PostgreSQL models defined in <code>prisma/schema.prisma</code> "
        "with PostGIS geometry support. Below is the operational data dictionary of the primary core entities:",
        body_style
    ))

    db_summary_data = [
        [Paragraph("Entity Model", table_header_style), Paragraph("Primary Key", table_header_style), Paragraph("Key Backing Attributes", table_header_style), Paragraph("Operational Role in Platform", table_header_style)],
        [Paragraph("User", table_cell_bold), Paragraph("id (UUID)", table_cell_code), Paragraph("name, role (Enum), phone, email, district, village, bankAccount", table_cell_style), Paragraph("Authenticates Farmers, Insurers, Admins, and Agents with RBAC isolation.", table_cell_style)],
        [Paragraph("Farm", table_cell_bold), Paragraph("id (UUID)", table_cell_code), Paragraph("farmerId, plotNumber, areaHa, crop, boundaryGeoJson, iuCode", table_cell_style), Paragraph("Cadastral plot record with spatial boundaries for satellite intersection.", table_cell_style)],
        [Paragraph("IoTDevice", table_cell_bold), Paragraph("id (UUID)", table_cell_code), Paragraph("farmId, deviceCode, batteryV, rssiDbm, pumpRelayActive, lastPing", table_cell_style), Paragraph("Hardware telemetry ingestion node and remote micro-irrigation pump relay.", table_cell_style)],
        [Paragraph("SensorReading", table_cell_bold), Paragraph("id (UUID)", table_cell_code), Paragraph("deviceId, soilMoisture15, soilMoisture30, soilTemp, ambientRh, recordedAt", table_cell_style), Paragraph("High-frequency 3s timeseries tracking volumetric root zone water content.", table_cell_style)],
        [Paragraph("CropHealthRecord", table_cell_bold), Paragraph("id (UUID)", table_cell_code), Paragraph("farmId, chfIndex, ndvi, ndre, lswi, sarBackscatter, sourceDate", table_cell_style), Paragraph("Computed Shannon entropy composite vigour derived from Sentinel-2/1 passes.", table_cell_style)],
        [Paragraph("Policy", table_cell_bold), Paragraph("id (UUID)", table_cell_code), Paragraph("policyNumber, farmId, farmerId, sumInsured, grossPremium, subsidyAmount, farmerShare, triggerChf, status", table_cell_style), Paragraph("Smart parametric contract binding farmer, underwriter, and index trigger threshold.", table_cell_style)],
        [Paragraph("Claim", table_cell_bold), Paragraph("id (UUID)", table_cell_code), Paragraph("claimNumber, policyId, perilType, triggerDate, deficitChf, payoutAmount, status, evidenceDossierJson", table_cell_style), Paragraph("Automated claim qualification record backed by 11-section empirical evidence package.", table_cell_style)],
        [Paragraph("Payout", table_cell_bold), Paragraph("id (UUID)", table_cell_code), Paragraph("claimId, farmerId, amount, bankName, ifsc, utrNumber, stage (1-7), settledAt", table_cell_style), Paragraph("Direct Benefit Transfer ledger tracking electronic funds settlement to farmer's account.", table_cell_style)],
        [Paragraph("AuditBlock", table_cell_bold), Paragraph("id (UUID)", table_cell_code), Paragraph("blockNumber, entityType, actorId, prevHash, merkleHash, payloadJson, createdAt", table_cell_style), Paragraph("Chained SHA-256 Merkle ledger certifying immutable platform transparency.", table_cell_style)],
    ]
    db_table = Table(db_summary_data, colWidths=[80, 65, 205, 182])
    db_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), PRIMARY_DARK),
        ('BOX', (0,0), (-1,-1), 1, BORDER_COLOR),
        ('INNERGRID', (0,0), (-1,-1), 0.5, BORDER_COLOR),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, SLATE_LIGHT]),
        ('PADDING', (0,0), (-1,-1), 5),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ]))
    story.append(db_table)

    story.append(PageBreak())

    # ==========================================
    # 5. REST API INVENTORY & SECURITY ARCHITECTURE
    # ==========================================
    story.append(Paragraph("4. REST API Endpoint Inventory & Edge Security", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=BORDER_COLOR, spaceBefore=2, spaceAfter=12))

    story.append(Paragraph(
        "All API routes are served from Next.js 16 Route Handlers (<code>src/app/api/*</code>) under strict HTTP method conventions "
        "and edge proxy guard verification:",
        body_style
    ))

    api_inventory_data = [
        [Paragraph("Method", table_header_style), Paragraph("Endpoint Path", table_header_style), Paragraph("Required Role", table_header_style), Paragraph("Data Payload & Response Summary", table_header_style)],
        [Paragraph("POST", table_cell_bold), Paragraph("/api/auth/login", table_cell_code), Paragraph("Universal", table_cell_style), Paragraph("Receives credentials/OTP; sets <code>agrisure_user_role</code> cookie; returns profile.", table_cell_style)],
        [Paragraph("POST", table_cell_bold), Paragraph("/api/auth/register", table_cell_code), Paragraph("Universal", table_cell_style), Paragraph("Creates farmer or institutional user account; stores initial profile record.", table_cell_style)],
        [Paragraph("GET", table_cell_bold), Paragraph("/api/farms", table_cell_code), Paragraph("FARMER, AGENT", table_cell_style), Paragraph("Returns list of registered farms with GeoJSON boundaries and vegetative scores.", table_cell_style)],
        [Paragraph("GET", table_cell_bold), Paragraph("/api/farms/[id]/sensors", table_cell_code), Paragraph("FARMER, AGENT", table_cell_style), Paragraph("Returns real-time soil moisture (15cm & 30cm), temp, and ambient humidity.", table_cell_style)],
        [Paragraph("POST", table_cell_bold), Paragraph("/api/disease/predict", table_cell_code), Paragraph("FARMER", table_cell_style), Paragraph("Multipart leaf image &rarr; 38-class CV inference, confidence, and spray remedy.", table_cell_style)],
        [Paragraph("POST", table_cell_bold), Paragraph("/api/optimization/run", table_cell_code), Paragraph("FARMER", table_cell_style), Paragraph("Soil N-P-K baseline &rarr; GA-PSO fertilizer (Urea, DAP, MOP) and water schedule.", table_cell_style)],
        [Paragraph("POST", table_cell_bold), Paragraph("/api/iot/devices/[id]/toggle", table_cell_code), Paragraph("FARMER, ADMIN", table_cell_style), Paragraph("Toggles physical pump relay between ACTIVE (1) and STANDBY (0).", table_cell_style)],
        [Paragraph("GET", table_cell_bold), Paragraph("/api/policies", table_cell_code), Paragraph("Universal", table_cell_style), Paragraph("Lists policies filtered by status (ACTIVE, PENDING_APPROVAL, REJECTED).", table_cell_style)],
        [Paragraph("POST", table_cell_bold), Paragraph("/api/policies", table_cell_code), Paragraph("FARMER", table_cell_style), Paragraph("Submits new insurance application with subsidy calculation and bank verification.", table_cell_style)],
        [Paragraph("POST", table_cell_bold), Paragraph("/api/policies/[id]/decision", table_cell_code), Paragraph("INSURER", table_cell_style), Paragraph("Accepts or rejects application with formal reason and audit ledger inscription.", table_cell_style)],
        [Paragraph("GET", table_cell_bold), Paragraph("/api/claims", table_cell_code), Paragraph("INSURER", table_cell_style), Paragraph("Retrieves all claims with 11-section empirical cryptographic evidence dossiers.", table_cell_style)],
        [Paragraph("POST", table_cell_bold), Paragraph("/api/claims/[id]/approve", table_cell_code), Paragraph("INSURER", table_cell_style), Paragraph("Approves qualified parametric claim and queues it for automated bank disbursement.", table_cell_style)],
        [Paragraph("GET", table_cell_bold), Paragraph("/api/payouts", table_cell_code), Paragraph("Universal", table_cell_style), Paragraph("Lists 7-stage automated bank compensation transfers with simulated RBI UTRs.", table_cell_style)],
        [Paragraph("POST", table_cell_bold), Paragraph("/api/payouts/[id]/execute", table_cell_code), Paragraph("INSURER", table_cell_style), Paragraph("Executes instantaneous electronic direct benefit deposit to farmer's bank account.", table_cell_style)],
        [Paragraph("GET", table_cell_bold), Paragraph("/api/audit", table_cell_code), Paragraph("INSURER, ADMIN", table_cell_style), Paragraph("Streams immutable chained SHA-256 Merkle audit blocks for regulatory compliance.", table_cell_style)],
        [Paragraph("POST", table_cell_bold), Paragraph("/api/simulate/event", table_cell_code), Paragraph("Universal (Demo)", table_cell_style), Paragraph("Injects synthetic weather shock: Severe Drought, Flash Flood, or Foliar Blight.", table_cell_style)],
    ]
    api_table = Table(api_inventory_data, colWidths=[45, 140, 85, 262])
    api_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), PRIMARY_DARK),
        ('BOX', (0,0), (-1,-1), 1, BORDER_COLOR),
        ('INNERGRID', (0,0), (-1,-1), 0.5, BORDER_COLOR),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, SLATE_LIGHT]),
        ('PADDING', (0,0), (-1,-1), 4),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ]))
    story.append(api_table)

    story.append(Spacer(1, 14))

    # Deployment Architecture Callout Box
    deploy_summary = (
        "<b>Deployment Topology & Production Runtime:</b><br/>"
        "• <b>Vercel Production Edge:</b> Hosts the Next.js 16 App Router frontend with Turbopack acceleration, "
        "regional edge middleware route gating, and optimized static asset delivery.<br/>"
        "• <b>Render Cloud Platform:</b> Hosts the containerized database layer (PostgreSQL 16 with PostGIS spatial extension) "
        "and telemetry background daemon workers.<br/>"
        "• <b>Edge Route Protection (src/middleware.ts):</b> Inspects incoming <code>agrisure_user_role</code> cookies. "
        "Blocks and redirects unauthorized cross-role route attempts (e.g. Farmers cannot visit /insurer/* or /admin/*; "
        "Insurers cannot visit /farmer/*).<br/>"
        "• <b>Client-Side Watchdog (RouteGuard.tsx):</b> Intercepts client navigation and displays an animated "
        "modal redirecting the user to their authorized dashboard within 1.2 seconds."
    )
    story.append(Paragraph(deploy_summary, ParagraphStyle('DeployBox', parent=body_style, fontSize=8.5, leading=12.5, textColor=SLATE_DARK)))

    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"Publication-Grade PDF successfully generated at: {PDF_OUTPUT_PATH}")

if __name__ == "__main__":
    build_pdf()
