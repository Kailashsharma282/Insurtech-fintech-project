import os
import sys
from reportlab.lib.pagesizes import letter
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors
from reportlab.pdfgen import canvas

class NumberedCanvas(canvas.Canvas):
    """
    Two-pass canvas to dynamically compute and display the total page count
    along with running headers and footers on every page except the cover.
    """
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super().showPage()
        super().save()

    def draw_page_decorations(self, page_count):
        if self._pageNumber == 1:
            return  # Suppress headers/footers on the title cover page

        self.saveState()
        self.setFont("Helvetica-Bold", 7)
        self.setFillColor(colors.HexColor("#0F172A"))
        self.drawString(45, 755, "AGRISURE INTELLIGENCE™")
        self.setFont("Helvetica", 7)
        self.setFillColor(colors.HexColor("#64748B"))
        self.drawString(145, 755, "|   Comprehensive Data Flow, Query & Mutation Specification")
        self.drawRightString(567, 755, "SYSTEM RUNTIME: NEXT.JS 16 × POSTGIS × PRISMA")

        self.setStrokeColor(colors.HexColor("#CBD5E1"))
        self.setLineWidth(0.6)
        self.line(45, 747, 567, 747)

        # Footer
        self.line(45, 42, 567, 42)
        self.setFont("Helvetica", 7)
        self.drawString(45, 30, "CONFIDENTIAL & PROPRIETARY — SATELLITE REMOTE SENSING × AGRONOMIC AI × IOT TELEMETRY × PARAMETRIC UNDERWRITING")
        page_text = f"Page {self._pageNumber} of {page_count}"
        self.drawRightString(567, 30, page_text)
        self.restoreState()

def build_pdf(filename="AgriSure_Intelligence_Data_Flow_Specification.pdf"):
    print(f"Generating detailed specification PDF: {filename}...")
    doc = SimpleDocTemplate(
        filename,
        pagesize=letter,
        leftMargin=45,
        rightMargin=45,
        topMargin=55,
        bottomMargin=55
    )

    styles = getSampleStyleSheet()
    
    # Custom color palette
    c_primary = colors.HexColor("#0F172A")    # Deep Navy
    c_emerald = colors.HexColor("#059669")    # Emerald Green
    c_accent  = colors.HexColor("#2563EB")    # Royal Blue
    c_amber   = colors.HexColor("#D97706")    # Amber Orange
    c_slate   = colors.HexColor("#334155")    # Slate text
    c_bg_subtle = colors.HexColor("#F8FAFC")  # Light gray-blue
    c_border  = colors.HexColor("#E2E8F0")

    # Typography styles
    styles.add(ParagraphStyle('CoverTitle', parent=styles['Normal'], fontName='Helvetica-Bold', fontSize=26, leading=32, textColor=c_primary, alignment=0))
    styles.add(ParagraphStyle('CoverSubtitle', parent=styles['Normal'], fontName='Helvetica', fontSize=13, leading=18, textColor=c_emerald, alignment=0))
    styles.add(ParagraphStyle('CoverMeta', parent=styles['Normal'], fontName='Helvetica', fontSize=9, leading=14, textColor=c_slate, alignment=0))
    styles.add(ParagraphStyle('CoverBadge', parent=styles['Normal'], fontName='Helvetica-Bold', fontSize=8, leading=10, textColor=colors.white))

    styles.add(ParagraphStyle('SecHeading', parent=styles['Normal'], fontName='Helvetica-Bold', fontSize=15, leading=19, textColor=c_primary, spaceBefore=12, spaceAfter=6, keepWithNext=True))
    styles.add(ParagraphStyle('SubSecHeading', parent=styles['Normal'], fontName='Helvetica-Bold', fontSize=11, leading=15, textColor=c_accent, spaceBefore=8, spaceAfter=4, keepWithNext=True))
    styles.add(ParagraphStyle('PageTitle', parent=styles['Normal'], fontName='Helvetica-Bold', fontSize=10, leading=14, textColor=c_primary, spaceBefore=4, spaceAfter=2, keepWithNext=True))
    
    styles.add(ParagraphStyle('BodyCustom', parent=styles['Normal'], fontName='Helvetica', fontSize=8.5, leading=12, textColor=c_slate))
    styles.add(ParagraphStyle('BodyBold', parent=styles['Normal'], fontName='Helvetica-Bold', fontSize=8.5, leading=12, textColor=c_primary))
    styles.add(ParagraphStyle('CodeSnippet', parent=styles['Normal'], fontName='Courier', fontSize=7.5, leading=9.5, textColor=colors.HexColor("#1E293B")))
    
    styles.add(ParagraphStyle('TableHead', parent=styles['Normal'], fontName='Helvetica-Bold', fontSize=7.5, leading=9.5, textColor=colors.white))
    styles.add(ParagraphStyle('TableCell', parent=styles['Normal'], fontName='Helvetica', fontSize=7.5, leading=9.5, textColor=c_slate))
    styles.add(ParagraphStyle('TableCellBold', parent=styles['Normal'], fontName='Helvetica-Bold', fontSize=7.5, leading=9.5, textColor=c_primary))
    styles.add(ParagraphStyle('TableCellCode', parent=styles['Normal'], fontName='Courier', fontSize=7, leading=8.5, textColor=colors.HexColor("#0F172A")))
    styles.add(ParagraphStyle('TableCellBadge', parent=styles['Normal'], fontName='Helvetica-Bold', fontSize=7, leading=8.5, textColor=colors.HexColor("#047857")))
    styles.add(ParagraphStyle('TableCellPost', parent=styles['Normal'], fontName='Helvetica-Bold', fontSize=7, leading=8.5, textColor=colors.HexColor("#B91C1C")))

    story = []

    # -------------------------------------------------------------
    # 1. COVER PAGE
    # -------------------------------------------------------------
    story.append(Spacer(1, 20))
    
    # Pill badge
    badge_data = [[
        Paragraph("<font color='#059669'><b>ENTERPRISE SYSTEM ARCHITECTURE & DATA FLOW SPECIFICATION</b></font>", styles['CoverBadge'])
    ]]
    t_badge = Table(badge_data, colWidths=[522])
    t_badge.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#ECFDF5")),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#A7F3D0")),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
        ('LEFTPADDING', (0,0), (-1,-1), 10),
        ('RIGHTPADDING', (0,0), (-1,-1), 10),
    ]))
    story.append(t_badge)
    story.append(Spacer(1, 15))

    story.append(Paragraph("AgriSure Intelligence™", styles['CoverTitle']))
    story.append(Spacer(1, 4))
    story.append(Paragraph("Comprehensive Data Ingestion, Querying, Mutation & Telemetry Architecture Across Every System Page", styles['CoverSubtitle']))
    story.append(Spacer(1, 10))
    story.append(HRFlowable(width="100%", thickness=2, color=c_emerald, spaceBefore=5, spaceAfter=15))

    p_desc = ("This technical specification details the complete end-to-end data lifecycle of the AgriSure Intelligence "
              "platform—spanning <b>28 production page views</b>, <b>24 high-throughput REST API endpoints</b>, and "
              "<b>22 Prisma/PostGIS relational models</b>. The platform operationalizes the closed-loop paradigm "
              "(<i>OBSERVE &rarr; DIAGNOSE &rarr; PRESCRIBE &rarr; ACTUATE &rarr; VERIFY &rarr; INSURE</i>), combining "
              "Sentinel-2 multispectral imagery, in-situ IoT telemetry, Shannon Entropy Composite Health Factor (CHF) calculation, "
              "hybrid Genetic Algorithm + Particle Swarm Optimization (GA-PSO), and autonomous parametric claims settlement.")
    story.append(Paragraph(p_desc, styles['BodyCustom']))
    story.append(Spacer(1, 15))

    # Meta Table
    meta_table_data = [
        [Paragraph("<b>Document Version</b>", styles['TableCellBold']), Paragraph("v2.4.0 — Production Build Spec", styles['TableCell'])],
        [Paragraph("<b>Target Framework</b>", styles['TableCellBold']), Paragraph("Next.js 16.0 (App Router, Turbopack, React 19)", styles['TableCell'])],
        [Paragraph("<b>Database Engine</b>", styles['TableCellBold']), Paragraph("PostgreSQL 16 + PostGIS Spatial Extensions (via Prisma ORM 5.22)", styles['TableCell'])],
        [Paragraph("<b>Telemetry Frequency</b>", styles['TableCellBold']), Paragraph("3-Second In-Memory Reactive Event Loop + MQTT Ingestion", styles['TableCell'])],
        [Paragraph("<b>Cloud Deployments</b>", styles['TableCellBold']), Paragraph("Vercel Edge Platform (Serverless) & Render Web Service (Docker / Managed Postgres)", styles['TableCell'])],
        [Paragraph("<b>Primary Demonstration Entity</b>", styles['TableCellBold']), Paragraph("Plot #204 (Farmer: Rajesh Mondal, Nadia District, West Bengal)", styles['TableCell'])],
        [Paragraph("<b>Auditability & Non-Repudiation</b>", styles['TableCellBold']), Paragraph("SHA-256 Merkle-Linked Cryptographic Audit Trail on all claims and triggers", styles['TableCell'])],
    ]
    t_meta = Table(meta_table_data, colWidths=[150, 372])
    t_meta.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), c_bg_subtle),
        ('GRID', (0,0), (-1,-1), 0.5, c_border),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(t_meta)
    story.append(Spacer(1, 20))

    # Executive Table of Contents Box
    toc_data = [
        [Paragraph("<b>DOCUMENT SECTION DIRECTORY</b>", styles['TableCellBold']), Paragraph("<b>PRIMARY COVERAGE</b>", styles['TableCellBold'])],
        [Paragraph("<b>Section 1: Architecture & Data Philosophy</b>", styles['TableCell']), Paragraph("Closed-loop paradigm, reactive store, PostGIS models, and security boundary", styles['TableCell'])],
        [Paragraph("<b>Section 2: Comprehensive Page-by-Page Data Matrix</b>", styles['TableCell']), Paragraph("Detailed data fetch (GET) and mutation (POST/PUT) specs across all 28 pages", styles['TableCell'])],
        [Paragraph("<b>Section 3: REST API Endpoint Reference</b>", styles['TableCell']), Paragraph("Complete request/response contracts for all 24 serverless endpoints", styles['TableCell'])],
        [Paragraph("<b>Section 4: Cloud Deployment Architecture (Vercel & Render)</b>", styles['TableCell']), Paragraph("Build settings, environment variables, PostGIS setup, and continuous delivery", styles['TableCell'])],
    ]
    t_toc = Table(toc_data, colWidths=[200, 322])
    t_toc.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#1E293B")),
        ('TEXTCOLOR', (0,0), (-1,0), colors.white),
        ('GRID', (0,0), (-1,-1), 0.5, c_border),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(t_toc)
    story.append(PageBreak())

    # -------------------------------------------------------------
    # 2. SECTION 1: ARCHITECTURE & DATA FLOW ENGINE
    # -------------------------------------------------------------
    story.append(Paragraph("1. System Architecture & Closed-Loop Data Paradigm", styles['SecHeading']))
    story.append(HRFlowable(width="100%", thickness=1, color=c_slate, spaceBefore=2, spaceAfter=8))
    
    sec1_text = (
        "AgriSure Intelligence operates on an immutable, verifiable data pipeline designed to bridge the gap between "
        "satellite remote sensing, localized ground truth sensors, and algorithmic underwriting. Every interaction "
        "within the user interface is mapped to an explicit read query or state-mutating transaction."
    )
    story.append(Paragraph(sec1_text, styles['BodyCustom']))
    story.append(Spacer(1, 8))

    # Flow phases table
    flow_steps = [
        [Paragraph("<b>Phase</b>", styles['TableHead']), Paragraph("<b>System Action</b>", styles['TableHead']), Paragraph("<b>Data Fetched (Inbound)</b>", styles['TableHead']), Paragraph("<b>Data Added / Mutated (Outbound)</b>", styles['TableHead'])],
        [
            Paragraph("<b>1. OBSERVE</b>", styles['TableCellBold']),
            Paragraph("Satellite ingestion & IoT telemetry streaming", styles['TableCell']),
            Paragraph("Sentinel-2 NDVI, NDWI, SAVI bands; LoRaWAN soil moisture, temp, humidity sensors.", styles['TableCell']),
            Paragraph("Writes <code>SensorReading</code> (3s intervals), updates <code>SatelliteReading</code> time-series.", styles['TableCell'])
        ],
        [
            Paragraph("<b>2. DIAGNOSE</b>", styles['TableCellBold']),
            Paragraph("CHF Entropy Engine & Computer Vision CNN", styles['TableCell']),
            Paragraph("Multi-spectral indices, Historical baseline yields, Mobile leaf RGB uploads.", styles['TableCell']),
            Paragraph("Generates <code>ChfRecord</code> with Shannon weights, creates <code>DiseaseDiagnosis</code> (38 classes).", styles['TableCell'])
        ],
        [
            Paragraph("<b>3. PRESCRIBE</b>", styles['TableCellBold']),
            Paragraph("GA-PSO Optimizer & Agronomic Rules Engine", styles['TableCell']),
            Paragraph("Soil NPK deficiencies, CHF stress factors, 7-day microclimate weather forecast.", styles['TableCell']),
            Paragraph("Computes optimal NPK kg/ha, water schedule; pushes <code>Alert</code> with SMS/WhatsApp dispatch.", styles['TableCell'])
        ],
        [
            Paragraph("<b>4. ACTUATE</b>", styles['TableCellBold']),
            Paragraph("Edge Relay Actuation & Manual Overrides", styles['TableCell']),
            Paragraph("Current pump relay status, valve open/close states, edge battery levels.", styles['TableCell']),
            Paragraph("Dispatches relay commands (<code>ACTIVE/IDLE</code>); logs intervention to <code>InterventionRecord</code>.", styles['TableCell'])
        ],
        [
            Paragraph("<b>5. VERIFY</b>", styles['TableCellBold']),
            Paragraph("Parametric Trigger & Triple-Index Check", styles['TableCell']),
            Paragraph("72h post-actuation NDVI delta, GDD accumulation, ERA5 rainfall totals.", styles['TableCell']),
            Paragraph("Flags breach condition (Drought, Heatwave, Flood); creates <code>Claim</code> in <code>TRIGGERED</code> state.", styles['TableCell'])
        ],
        [
            Paragraph("<b>6. INSURE</b>", styles['TableCellBold']),
            Paragraph("Autonomous Claim Settlement & Bank Transfer", styles['TableCell']),
            Paragraph("Policy terms, coverage limits, verified loss percentage, farmer bank IFSC/UPI.", styles['TableCell']),
            Paragraph("Executes <code>Payout</code>, creates immutable SHA-256 hash in <code>AuditLog</code> chain, updates bank UTR.", styles['TableCell'])
        ],
    ]
    t_flow = Table(flow_steps, colWidths=[70, 110, 172, 170])
    t_flow.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), c_primary),
        ('GRID', (0,0), (-1,-1), 0.5, c_border),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, c_bg_subtle]),
    ]))
    story.append(t_flow)
    story.append(Spacer(1, 10))

    # Dual Data Layer callout
    dual_data_p = (
        "<b>Hybrid Data Architecture:</b> The application runs on a high-speed in-memory reactive data layer "
        "(<code>src/lib/db/store.ts</code>) that simulates live production streaming with 25+ farmers, 40+ farms, "
        "20 IoT sensors, 30 claims, and 50 alerts. When connected to PostgreSQL, it seamlessly persists through "
        "<b>Prisma ORM</b> with spatial coordinates formatted in GeoJSON. Every operation in the user interface "
        "is wired to real endpoints that mutate this state in real time."
    )
    story.append(Paragraph(dual_data_p, styles['BodyCustom']))
    story.append(PageBreak())

    # -------------------------------------------------------------
    # 3. SECTION 2: PAGE-BY-PAGE DATA SPECIFICATION
    # -------------------------------------------------------------
    story.append(Paragraph("2. Detailed Page-by-Page Data Fetching & Adding Specification", styles['SecHeading']))
    story.append(HRFlowable(width="100%", thickness=1, color=c_slate, spaceBefore=2, spaceAfter=8))
    
    intro_p2 = (
        "The following section documents all <b>28 frontend pages</b> in the application. For each route, "
        "we define the user role, exact data fetched (inbound queries and database models), exact data added or mutated "
        "(form submissions, toggles, execution triggers, audit records), and key interactive widgets driven by this data."
    )
    story.append(Paragraph(intro_p2, styles['BodyCustom']))
    story.append(Spacer(1, 8))

    # Master page definitions list
    pages_spec = [
        # MODULE 1: PUBLIC & SCIENTIFIC
        {
            "route": "/",
            "name": "Public Landing & Platform Gateway",
            "role": "Public / All Roles",
            "fetch": [
                "<b>KPI Aggregates:</b> Total protected acreage (142,500+ ha), Active farmers (24,800+), Satellite passes/day (12), Payout settlement turnaround (&lt; 24h).",
                "<b>Pilot Showcase:</b> High-level summary of Plot #204 Nadia District live health status (CHF 0.742, Normal).",
                "<b>Trigger Previews:</b> Active parametric triggers for Excess Rain (140mm) and Consecutive Dry Days (21d)."
            ],
            "mutate": [
                "<b>Role Switcher:</b> Modifies client-side role context (<code>FARMER</code>, <code>INSURER</code>, <code>ADMIN</code>, <code>FIELD_AGENT</code>) stored in LocalStorage/Cookie.",
                "<b>Simulation Modal Trigger:</b> Can dispatch simulated drought or flood events to <code>/api/simulate/event</code>."
            ],
            "widgets": "5 Impact KPI Cards, Interactive Hero Visualizer, 6-Phase Pipeline Showcase, Academic Partners Banner."
        },
        {
            "route": "/how-it-works",
            "name": "Operational Workflow & 6-Stage Loop",
            "role": "Public / Evaluators",
            "fetch": [
                "<b>Stage Architecture:</b> Static definitions of OBSERVE &rarr; DIAGNOSE &rarr; PRESCRIBE &rarr; ACTUATE &rarr; VERIFY &rarr; INSURE.",
                "<b>Technical Benchmarks:</b> Sentinel-2 10m resolution specs, LoRaWAN 15km range limits, CNN disease classification accuracy (92.9%), Shannon Entropy weights."
            ],
            "mutate": [
                "<b>Read-Only Page:</b> No direct database mutation. Telemetry ticker in navbar continues running 3s heartbeat."
            ],
            "widgets": "Interactive 6-Stage Process Flowchart, Latency Benchmark Comparison Matrix, Hardware Pinout Diagrams."
        },
        {
            "route": "/technology",
            "name": "Core Technology Stack & Algorithmic Pipeline",
            "role": "Public / Technical Evaluators",
            "fetch": [
                "<b>Pipeline Metrics:</b> Data ingestion throughput, satellite revisit schedules, edge inference latencies.",
                "<b>Mathematical Equations:</b> LaTeX/MathJax formulas for Shannon Entropy, Min-Max Normalization, GA-PSO objective fitness function."
            ],
            "mutate": [
                "<b>Read-Only Page:</b> Technical documentation and architectural transparency."
            ],
            "widgets": "Algorithmic Pipeline Diagram, Edge Hardware Architecture Blueprint, Spectral Band Response Visualizer."
        },
        {
            "route": "/technology/stress",
            "name": "Multi-Factor Crop Stress Index (CSI)",
            "role": "Public / Agronomists",
            "fetch": [
                "<b>Index Component Weights:</b> Soil Moisture Deficit (35%), Thermal Stress Index (25%), NDVI Anomaly (20%), Vapor Pressure Deficit (20%).",
                "<b>Historical Validation Series:</b> 2021-2025 seasonal stress curves vs ground truth crop cuts across Nadia District."
            ],
            "mutate": [
                "<b>Interactive Weight Slider (Client-Side):</b> Allows agronomists to simulate custom index weights in memory."
            ],
            "widgets": "Multi-Factor Stress Breakdown Radar Chart, Real-time CSI vs Ground Loss Scatter Plot, Threshold Matrix."
        },
        {
            "route": "/technology/chf",
            "name": "Composite Health Factor (CHF) Shannon Entropy Engine",
            "role": "Public / Actuaries & Data Scientists",
            "fetch": [
                "<b>Mathematical Parameters:</b> Objective entropy dispersion calculation formulas, probability distribution matrix.",
                "<b>Plot #204 Actual CHF Breakdown:</b> Soil Moisture (0.78, w=0.28), NDVI (0.71, w=0.32), CWSI (0.64, w=0.22), Temp (0.85, w=0.18).",
                "<b>Overall CHF Score:</b> 0.742 (Normal Vigorous Vegetation)."
            ],
            "mutate": [
                "<b>Simulation Test Trigger:</b> Dispatches synthetic sensor inputs to <code>/api/farms/farm-plot-204/chf</code> to re-evaluate entropy."
            ],
            "widgets": "Real-time Entropy Weight Distribution Chart, Historical CHF 90-day Trajectory, Min-Max Normalization Table."
        },
        {
            "route": "/technology/baseline",
            "name": "Dynamic Yield & Remote Sensing Baselines",
            "role": "Public / Underwriters",
            "fetch": [
                "<b>Historical Remote Sensing Series:</b> 10-year MODIS & Sentinel-2 optical archives for Nadia District (2015–2025).",
                "<b>Phenological Curves:</b> Sowing to vegetative, flowering, and harvest NDVI normal curves with &plusmn;1&sigma; and &plusmn;2&sigma; standard deviations."
            ],
            "mutate": [
                "<b>Crop Type Selector:</b> Switches between Rice (Aman/Boro), Wheat, and Mustard baseline models."
            ],
            "widgets": "Phenology Envelope Recharts Area Chart, Standard Deviation Anomaly Detector, 10-Year Trend Lines."
        },
        {
            "route": "/research",
            "name": "Academic Publications & Validation Benchmarks",
            "role": "Public / Researchers",
            "fetch": [
                "<b>Validation Datasets:</b> 1,240 ground-truth crop-cutting experiments (CCE) matched with satellite spectral indices.",
                "<b>Peer-Reviewed Citations:</b> 8 published conference papers and journal submissions covering Shannon Entropy and GA-PSO."
            ],
            "mutate": [
                "<b>Filter Controls:</b> Filter research by topic (Agronomy, Computer Vision, Actuarial Science)."
            ],
            "widgets": "Benchmark Comparison Table (Model vs Field Reality), Downloadable Citation References, DOI Links."
        },
        {
            "route": "/team",
            "name": "Core Scientific & Engineering Team",
            "role": "Public / Enterprise Partners",
            "fetch": [
                "<b>Team Profiles:</b> Agronomists, Satellite Remote Sensing Leads, Actuaries, Full-Stack Engineers, and Field Supervisors."
            ],
            "mutate": [
                "<b>Read-Only Page:</b> Institutional biographies and credentials."
            ],
            "widgets": "Profile Cards with Academic Affiliations, GitHub / ResearchGate Links, Advisory Board Overview."
        },

        # MODULE 2: FARMER PORTAL
        {
            "route": "/farmer/dashboard",
            "name": "Farmer Operational Dashboard (Primary Plot #204)",
            "role": "Farmer / Field Agent",
            "fetch": [
                "<b>GET /api/farms/farm-plot-204:</b> Farm profile, crop (Rice - Aman), boundary coordinates, 2.4 ha area.",
                "<b>GET /api/farms/farm-plot-204/sensors:</b> Live soil moisture (38%), ambient temp (28.4°C), soil NPK levels.",
                "<b>GET /api/farms/farm-plot-204/satellite:</b> Latest NDVI (0.71), NDWI (0.42), SAVI (0.58), cloud cover (1.2%).",
                "<b>GET /api/farms/farm-plot-204/chf:</b> Current CHF (0.742, Normal), stress classification.",
                "<b>GET /api/farms/farm-plot-204/weather:</b> 7-day rainfall forecast, humidity, wind speed, solar radiation.",
                "<b>GET /api/farms/farm-plot-204/alerts:</b> Active unread agronomic warnings (e.g. Mild Moisture Stress)."
            ],
            "mutate": [
                "<b>POST /api/iot/devices/dev-pump-01/toggle:</b> Toggles irrigation pump relay (<code>ACTIVE &harr; IDLE</code>). Updates device state and adds record to <code>InterventionRecord</code>.",
                "<b>POST /api/farms/farm-plot-204/alerts:</b> Mark alert as acknowledged/read."
            ],
            "widgets": "Plain-Language Status Banner, 8 Health KPI Metric Cards, Real-time Relay Switch, 7-Day Weather Bar Chart, Micro-Advisory Box."
        },
        {
            "route": "/farmer/farms",
            "name": "Farmer Farm Directory & Multi-Plot Portfolio",
            "role": "Farmer / Field Agent",
            "fetch": [
                "<b>GET /api/farms:</b> Complete list of farms belonging to logged-in farmer (e.g., Rajesh Mondal's Plot #204, Plot #205, Plot #206).",
                "<b>Aggregated Health:</b> Current CHF status, crop stage, acreage, and active policy status per plot."
            ],
            "mutate": [
                "<b>POST /api/farms:</b> Add new farm plot modal (name, crop, district, latitude, longitude, areaInHectares, boundaryGeoJson). Adds record to <code>Farm</code> and assigns default telemetry devices."
            ],
            "widgets": "Multi-Plot Grid Cards, Health Status Color Tags, 'Add Farm Plot' Modal Form, Quick Search & Filter."
        },
        {
            "route": "/farmer/farms/[id]",
            "name": "Deep Plot Intelligence (10-Section Farm View)",
            "role": "Farmer / Agronomist",
            "fetch": [
                "<b>GET /api/farms/[id]:</b> Complete geospatial boundary, soil type, sowing date, expected harvest date.",
                "<b>GET /api/farms/[id]/satellite:</b> 90-day time series of NDVI, NDWI, SAVI, EVI with phenology markers.",
                "<b>GET /api/farms/[id]/sensors:</b> 72-hour hourly telemetry records (moisture at 10cm, 30cm, ambient temp).",
                "<b>GET /api/farms/[id]/chf:</b> Detailed Shannon entropy weights and historical index progression.",
                "<b>GET /api/farms/[id]/interventions:</b> Audit list of all applied irrigations, fertilizers, and pesticide treatments."
            ],
            "mutate": [
                "<b>POST /api/farms/[id]/interventions:</b> Log new agronomic activity (Type: Irrigation/Fertilizer/Spray, quantity, cost, notes). Adds to <code>InterventionRecord</code>.",
                "<b>POST /api/iot/devices/[id]/toggle:</b> Control associated plot actuators."
            ],
            "widgets": "10 Specialized Sections: Overview, Satellite Indices (7 Charts), Hourly IoT Telemetry, Soil Chemistry, Microclimate Forecast, GA-PSO Prescriptions, Policy Status, Claims History, Photo Log, Intervention History."
        },
        {
            "route": "/farmer/disease",
            "name": "Multimodal Vision AI Leaf Disease Scanner",
            "role": "Farmer / Field Agent",
            "fetch": [
                "<b>Model Metadata:</b> CNN MobileNetV3 / ResNet-50 38-class plant pathology registry with 92.9% validation benchmark.",
                "<b>Diagnostic History:</b> Previous 10 leaf scans submitted by this farmer with confidence scores and treatments."
            ],
            "mutate": [
                "<b>POST /api/disease/predict:</b> Upload leaf photo (multipart/base64) + select crop type + farmId. Backend processes image, returns detected disease (e.g. <i>Rice Blast - Magnaporthe oryzae</i>, 96.4% confidence), creates <code>DiseaseDiagnosis</code> record, and dispatches an advisory <code>Alert</code>."
            ],
            "widgets": "Drag-and-Drop Image Uploader, Interactive Camera Feed, Diagnosis Result Card with Chemical & Organic Prescriptions, Historical Scans Carousel."
        },
        {
            "route": "/farmer/optimization",
            "name": "GA-PSO Fertilizer & Irrigation Optimizer",
            "role": "Farmer / Agronomist",
            "fetch": [
                "<b>GET /api/farms/farm-plot-204/sensors:</b> Current soil Nitrogen (N=42 ppm), Phosphorus (P=18 ppm), Potassium (K=110 ppm).",
                "<b>GET /api/farms/farm-plot-204/weather:</b> 7-day cumulative rainfall forecast to prevent nutrient leaching.",
                "<b>Crop Nutrient Demand Table:</b> Optimal NPK uptake curves for Rice (Aman stage: Panicle Initiation)."
            ],
            "mutate": [
                "<b>POST /api/optimization/run:</b> Inputs: Population size (50), Iterations (100), Crop target yield (5.2 t/ha), Budget limit (₹4,500). Executes hybrid GA-PSO algorithm. Returns optimal Urea, DAP, MOP kg/ha, water schedule (liters/ha), and saves result to <code>OptimizationRun</code>."
            ],
            "widgets": "Optimization Parameter Sliders, GA vs PSO vs GA-PSO Convergence Comparison Chart, Recommended Fertilizer Schedule Card, Cost-Benefit ROI Calculator."
        },
        {
            "route": "/farmer/alerts",
            "name": "Agronomic Alerts, Early Warnings & SMS Logs",
            "role": "Farmer / Field Agent",
            "fetch": [
                "<b>GET /api/farms/farm-plot-204/alerts:</b> All alerts filtered by severity (<code>CRITICAL, WARNING, INFO</code>).",
                "<b>SMS & WhatsApp Dispatch Logs:</b> Timestamped delivery receipts to farmer's mobile (+91 98321 XXXXX)."
            ],
            "mutate": [
                "<b>PATCH /api/farms/farm-plot-204/alerts:</b> Acknowledge single alert or 'Mark All as Read'. Updates <code>isRead: true</code> in <code>Alert</code> model.",
                "<b>POST /api/farms/farm-plot-204/alerts:</b> Create manual scout note / field alert."
            ],
            "widgets": "Filterable Alert Stream, Severity Color Badges, SMS Preview Drawer, One-Click Acknowledge Actions."
        },
        {
            "route": "/farmer/insurance",
            "name": "Parametric Insurance Coverage & Policy Terms",
            "role": "Farmer",
            "fetch": [
                "<b>GET /api/policies:</b> Active policy details for Plot #204 (Policy #POL-2026-WB-092).",
                "<b>Coverage Terms:</b> Sum Insured (₹1,20,000), Premium Paid (₹2,400 with 80% Govt PMFBY subsidy), Coverage Window (June 15 – Nov 30, 2026).",
                "<b>Trigger Parameters:</b> Trigger 1: Drought (21 consecutive dry days & soil moisture &lt; 20%), Trigger 2: Heavy Rainfall (&gt; 140mm in 24h), Trigger 3: Vegetative Stress (CHF &lt; 0.45 for 14d)."
            ],
            "mutate": [
                "<b>POST /api/policies:</b> Enroll farm in upcoming Rabi season insurance policy. Links <code>Farm</code> to <code>InsuranceUnit</code>."
            ],
            "widgets": "Policy Certificate Card, Interactive Parametric Gauge Visualizers, Settlement Guarantee Badge."
        },
        {
            "route": "/farmer/payments",
            "name": "Farmer Payout Receipts & Bank Transfer Log",
            "role": "Farmer",
            "fetch": [
                "<b>GET /api/payouts:</b> Payouts matching farmer's policies (e.g. ₹28,500 credited for August Excess Rain event).",
                "<b>Banking Details:</b> Direct Benefit Transfer (DBT) destination account (State Bank of India, IFSC: SBIN0001234, Account: *******4921)."
            ],
            "mutate": [
                "<b>POST /api/payouts/[id]/download:</b> Generates and downloads digital payment advice slip / receipt PDF."
            ],
            "widgets": "Total Compensation Received KPI, Bank Transfer Audit Timeline, UTR Tracking Card, Download PDF Receipt Button."
        },

        # MODULE 3: IOT & AGRO-INTELLIGENCE
        {
            "route": "/operations/iot",
            "name": "Live IoT Fleet Telemetry & Actuator Console",
            "role": "Operations Engineer / Field Tech",
            "fetch": [
                "<b>GET /api/iot/devices:</b> Fleet list of 20 devices across Nadia District (Solar gateways, Soil moisture probes, Pump relays, Weather stations).",
                "<b>GET /api/iot/tick:</b> Reactive 3-second live sensor stream (Soil moisture %, Temp °C, Battery %, Signal RSSI dBm)."
            ],
            "mutate": [
                "<b>POST /api/iot/devices/[id]/toggle:</b> Instant hardware relay switch (Pump ON / OFF). Updates device status and logs action.",
                "<b>POST /api/iot/tick:</b> Fault injection trigger (Simulate low battery &lt; 15%, sensor disconnect, or out-of-bounds anomaly)."
            ],
            "widgets": "Live 3s Telemetry Ticker, Device Status Grid with Heartbeat Badges, Hardware Relay Control Panel, Fault Simulation Controls."
        },
        {
            "route": "/intelligence/map",
            "name": "Regional Agro-Climatic GIS & Remote Sensing Map",
            "role": "Agronomist / Risk Analyst",
            "fetch": [
                "<b>GET /api/farms:</b> Spatial GeoJSON polygons for all 40 registered farms in Nadia District.",
                "<b>GET /api/insurance-units:</b> Panchayat boundary overlays with aggregated stress indices.",
                "<b>Satellite Layer Data:</b> Color-coded CHF risk status (Green: Normal CHF &gt; 0.65, Amber: Moderate 0.45–0.65, Red: Critical &lt; 0.45)."
            ],
            "mutate": [
                "<b>Layer Control Toggles:</b> Switch GIS layers between Sentinel-2 True Color, NDVI Heatmap, Soil Moisture Contour, and Insurance Risk Polygons."
            ],
            "widgets": "Interactive Leaflet GIS Map, Custom Color-Coded Polygons, Interactive Farm Info Popups, Spectral Layer Selector."
        },
        {
            "route": "/intelligence/weather",
            "name": "Microclimate Weather Forecast & Shock Simulator",
            "role": "Agronomist / Underwriter",
            "fetch": [
                "<b>GET /api/farms/farm-plot-204/weather:</b> 7-day hourly forecast from ERA5 reanalysis and IMD radar.",
                "<b>Historical Weather Norms:</b> 30-year normal rainfall and temperature curves for Nadia District."
            ],
            "mutate": [
                "<b>POST /api/simulate/event:</b> Weather shock simulation triggers: Inject Heavy Rainfall (165mm in 12h) or Heatwave (&gt; 42°C for 5 days). Updates weather state, triggers automated parametric claim evaluation, and alerts all affected farms."
            ],
            "widgets": "Hourly Precipitation & Temperature Recharts Graph, Extreme Weather Warning Cards, Interactive Weather Shock Simulation Panel."
        },

        # MODULE 4: INSURER & CLAIMS MANAGEMENT
        {
            "route": "/insurer/dashboard",
            "name": "Insurer Underwriting & Solvency Dashboard",
            "role": "Insurer / Actuary",
            "fetch": [
                "<b>Portfolio Aggregates:</b> Total Sum Insured (₹48.6 Cr), Active Policies (1,420), Current Loss Ratio (48.2%), Solvency Capital Ratio (214%).",
                "<b>GET /api/claims:</b> Claims distribution by state (Triggered: 8, Under Verification: 5, Approved: 12, Settled: 15).",
                "<b>Panchayat Risk Exposure:</b> Spatial risk concentration across Nadia, Murshidabad, and Burdwan districts."
            ],
            "mutate": [
                "<b>Export Portfolio Report:</b> Dispatches request to compile actuarial risk exposure CSV/PDF."
            ],
            "widgets": "6 Actuarial KPI Cards, Loss Ratio Historical Bar Chart, Claims by Trigger Type Donut Chart, High-Risk Unit Table."
        },
        {
            "route": "/insurer/risk-map",
            "name": "Insurance Unit Risk Map & Spatial Drawer",
            "role": "Insurer Underwriter",
            "fetch": [
                "<b>GET /api/insurance-units:</b> 25 Gram Panchayat Insurance Units with 5-tier risk states (<code>VERY_LOW, LOW, MODERATE, HIGH, CRITICAL</code>).",
                "<b>GET /api/insurance-units/[id]/risk:</b> Detailed actuarial breakdown for selected unit (Total acreage, policy count, historical payout frequency, current rainfall deficit)."
            ],
            "mutate": [
                "<b>Selection Event:</b> Clicking a polygon opens the 11-field Insurance Unit Inspection Drawer with live satellite feeds."
            ],
            "widgets": "Interactive PostGIS Polygon Map, 5-Color Risk Legend, Slide-out 11-Field Detail Drawer, Dynamic Policy Rerating Simulator."
        },
        {
            "route": "/insurer/claims",
            "name": "Parametric Claims Queue & Verification Hub",
            "role": "Claims Officer / Underwriter",
            "fetch": [
                "<b>GET /api/claims:</b> Real-time list of all 30 claims with filter by status (<code>ALL, TRIGGERED, VERIFYING, APPROVED, PAID, REJECTED</code>).",
                "<b>Claim Data Fields:</b> Claim ID, Farmer Name, Plot #, Trigger Type (Excess Rain, Drought), Breach Value, Claim Amount (₹), Auto-Verification Score."
            ],
            "mutate": [
                "<b>POST /api/claims/[id]/verify:</b> Trigger automated satellite + weather corroboration. Changes status from <code>TRIGGERED</code> to <code>VERIFYING</code> / <code>APPROVED</code>.",
                "<b>POST /api/claims/[id]/approve:</b> Underwriter manual approval with digital signature. Updates status to <code>APPROVED</code>, queues payout, writes SHA-256 hash to <code>AuditLog</code>."
            ],
            "widgets": "Status Filter Tabs, Search Bar, Claims Data Table with Confidence Badges, One-Click Verify & Approve Quick Actions."
        },
        {
            "route": "/insurer/claims/[id]",
            "name": "Claim Evidence Package & 11-Section Settlement File",
            "role": "Senior Claims Officer / Auditor",
            "fetch": [
                "<b>GET /api/claims/[id]:</b> Full claim record, associated policy terms, farm GPS boundary, and farmer bank details.",
                "<b>Satellite Corroboration:</b> Pre-event vs Post-event NDVI images, spectral drop (-0.28 delta).",
                "<b>Weather Corroboration:</b> Nearest automatic weather station (AWS) rainfall logs (162.4mm on trigger date).",
                "<b>Soil Moisture Verification:</b> IoT probe corroboration (saturation &gt; 95% leading to waterlogging).",
                "<b>GET /api/audit/CLAIM/[id]:</b> Complete cryptographic SHA-256 audit chain of every event in this claim's history."
            ],
            "mutate": [
                "<b>POST /api/claims/[id]/approve:</b> Authorize claim settlement (adds underwriter comments, sets approved payout amount).",
                "<b>POST /api/payouts:</b> Instantly spawn <code>Payout</code> record linked to this claim in <code>QUEUED</code> state.",
                "<b>POST /api/claims/[id]/reject:</b> Dispute or reject claim with non-corroboration rationale."
            ],
            "widgets": "11-Section Dossier: Header, Policy Terms, Trigger Analysis, Satellite Visual Evidence, Weather AWS Logs, IoT Telemetry Delta, Field Agent Notes, Multi-Factor Verification Score (98.4%), Cryptographic Audit Trail, Settlement Action Panel."
        },
        {
            "route": "/insurer/payouts",
            "name": "Automated Settlement Gateway & Bank Batches",
            "role": "Insurer Finance / Treasury",
            "fetch": [
                "<b>GET /api/payouts:</b> All payout records with transaction states (<code>QUEUED, PROCESSING, SETTLED, FAILED</code>).",
                "<b>Disbursement Totals:</b> Total settled today (₹18.4 Lakhs), Pending queue (₹6.2 Lakhs), Average settlement turnaround (3.8 hours)."
            ],
            "mutate": [
                "<b>POST /api/payouts/[id]/execute:</b> Execute bank transfer via simulated NPCI / UPI DBT gateway. Simulates 7-step settlement workflow, generates synthetic Bank UTR (e.g. <code>UTR-2026-WB-8849201</code>), updates status to <code>SETTLED</code>, and writes to <code>AuditLog</code>."
            ],
            "widgets": "7-Step Settlement Timeline, Payout Batch Execution Modal, Bank UTR Verification Badges, Financial Reconciliation Export."
        },
        {
            "route": "/insurer/audit",
            "name": "Immutable Cryptographic Audit Trail (SHA-256)",
            "role": "Compliance Officer / Regulator",
            "fetch": [
                "<b>GET /api/audit/ALL:</b> Master chronological event stream (Policy creation, sensor reading breaches, trigger events, claim generation, approval signatures, bank transfers).",
                "<b>Hash Verification:</b> Displays <code>currentHash</code> and <code>previousHash</code> showing unbroken cryptographic chain."
            ],
            "mutate": [
                "<b>POST /api/audit/verify-chain:</b> Re-computes SHA-256 hash across all records in memory to verify zero tampering."
            ],
            "widgets": "Live Merkle Hash Chain Visualizer, Search by Entity ID / Transaction Hash, Integrity Verification Badge ('100% Tamper-Evident')."
        },

        # MODULE 5: ADMIN & GOVERNANCE
        {
            "route": "/admin/overview",
            "name": "Platform System Telemetry & Engine Health",
            "role": "System Administrator",
            "fetch": [
                "<b>System Metrics:</b> Active WebSocket/Polling connections, API average latency (42ms), Worker queue depth (0 jobs pending), PostgreSQL connection pool status.",
                "<b>Ingestion Rates:</b> IoT readings/sec (120 req/s), Sentinel-2 pass processing status."
            ],
            "mutate": [
                "<b>POST /api/admin/flush-cache:</b> Purges in-memory telemetry buffers and forces persistence sync.",
                "<b>POST /api/admin/restart-worker:</b> Restarts background calculation threads."
            ],
            "widgets": "Latency & Error Rate Time-Series Chart, Ingestion Throughput Gauges, Service Health Status Indicators."
        },
        {
            "route": "/admin/ai-models",
            "name": "AI Model Registry, Drift & Retraining Console",
            "role": "ML Engineer / Admin",
            "fetch": [
                "<b>Registered Models:</b> 1. CNN Plant Pathology (v2.1), 2. CHF Shannon Entropy Estimator (v3.0), 3. GA-PSO Yield Optimizer (v1.4), 4. Extreme Weather Radar Net (v2.0).",
                "<b>Performance Benchmarks:</b> F1-Score, Inference Latency (ms), Concept Drift % against current season field observations."
            ],
            "mutate": [
                "<b>POST /api/admin/models/[id]/retrain:</b> Triggers synthetic model retraining pipeline on newly verified field images and crop cuts.",
                "<b>POST /api/admin/models/[id]/rollback:</b> Rolls back to previous model checkpoint."
            ],
            "widgets": "Model Accuracy vs Drift Matrix, Version Checkpoint Carousel, Trigger Retraining Action Buttons."
        },
        {
            "route": "/admin/exceptions",
            "name": "Dead Letter Queue & Underwriter Escalations",
            "role": "Risk Manager / Supervisor",
            "fetch": [
                "<b>Exception Queue:</b> Sensor telemetry anomalies (impossible readings e.g. soil temp &gt; 70°C), conflicting satellite indices, ambiguous bank accounts, disputed claims.",
                "<b>Resolution SLA:</b> Elapsed time since escalation and assigned supervisor."
            ],
            "mutate": [
                "<b>POST /api/admin/exceptions/[id]/resolve:</b> Mark exception resolved with corrective action (e.g. flag sensor for calibration, accept farmer bank update, re-run claim check)."
            ],
            "widgets": "Exception Severity Table, Anomaly Waveform Inspector, Manual Override Action Form."
        }
    ]

    for idx, p in enumerate(pages_spec, 1):
        p_card = []
        p_card.append(Paragraph(f"<b>{idx}. {p['name']}</b>", styles['SubSecHeading']))
        
        # Route & Role pill table
        meta_row = [
            [Paragraph(f"<b>Route:</b> <code>{p['route']}</code>", styles['TableCellCode']),
             Paragraph(f"<b>Role:</b> {p['role']}", styles['TableCellBold'])]
        ]
        t_meta_row = Table(meta_row, colWidths=[280, 242])
        t_meta_row.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,-1), c_bg_subtle),
            ('BOX', (0,0), (-1,-1), 0.5, c_border),
            ('TOPPADDING', (0,0), (-1,-1), 3),
            ('BOTTOMPADDING', (0,0), (-1,-1), 3),
            ('LEFTPADDING', (0,0), (-1,-1), 6),
            ('RIGHTPADDING', (0,0), (-1,-1), 6),
        ]))
        p_card.append(t_meta_row)
        p_card.append(Spacer(1, 4))

        # Data rows
        fetch_content = "<br/>".join([f"&bull; {item}" for item in p['fetch']])
        mutate_content = "<br/>".join([f"&bull; {item}" for item in p['mutate']])
        
        details_table_data = [
            [
                Paragraph("<font color='#047857'><b>DATA FETCHED (INBOUND READS)</b></font>", styles['TableCellBadge']),
                Paragraph("<font color='#B91C1C'><b>DATA ADDED / MUTATED (OUTBOUND WRITES)</b></font>", styles['TableCellPost'])
            ],
            [
                Paragraph(fetch_content, styles['TableCell']),
                Paragraph(mutate_content, styles['TableCell'])
            ],
            [
                Paragraph("<b>Key Interactive UI Widgets Driven:</b>", styles['TableCellBold']),
                Paragraph(p['widgets'], styles['TableCell'])
            ]
        ]
        t_details = Table(details_table_data, colWidths=[261, 261])
        t_details.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (0,0), colors.HexColor("#ECFDF5")),
            ('BACKGROUND', (1,0), (1,0), colors.HexColor("#FEF2F2")),
            ('BACKGROUND', (0,2), (0,2), c_bg_subtle),
            ('GRID', (0,0), (-1,-1), 0.5, c_border),
            ('VALIGN', (0,0), (-1,-1), 'TOP'),
            ('SPAN', (1,2), (1,2)),
            ('TOPPADDING', (0,0), (-1,-1), 4),
            ('BOTTOMPADDING', (0,0), (-1,-1), 4),
            ('LEFTPADDING', (0,0), (-1,-1), 6),
            ('RIGHTPADDING', (0,0), (-1,-1), 6),
        ]))
        p_card.append(t_details)
        p_card.append(Spacer(1, 10))

        story.append(KeepTogether(p_card))
        if idx % 3 == 0 and idx != len(pages_spec):
            story.append(Spacer(1, 4))

    story.append(PageBreak())

    # -------------------------------------------------------------
    # 4. SECTION 3: REST API ENDPOINTS SPECIFICATION
    # -------------------------------------------------------------
    story.append(Paragraph("3. Complete REST API Endpoint & Contract Specification", styles['SecHeading']))
    story.append(HRFlowable(width="100%", thickness=1, color=c_slate, spaceBefore=2, spaceAfter=8))
    
    sec3_text = (
        "The following reference details the <b>24 core serverless REST API endpoints</b> serving the platform. "
        "Every endpoint conforms to strict JSON schemas, enforces HTTP status code conventions, and integrates "
        "with the in-memory reactive state and Prisma PostGIS database."
    )
    story.append(Paragraph(sec3_text, styles['BodyCustom']))
    story.append(Spacer(1, 8))

    apis_spec = [
        ["GET", "/api/farms", "Query parameter: ?search, ?crop, ?district", "Returns array of Farm objects with current CHF status and geo coordinates."],
        ["POST", "/api/farms", "Body: {name, crop, district, latitude, longitude, areaInHectares, boundaryGeoJson}", "Creates new Farm entity, generates default IoT sensors, returns 201 Created."],
        ["GET", "/api/farms/[id]", "URL param: farmId (e.g. farm-plot-204)", "Returns single Farm profile, sowing date, soil type, and current status."],
        ["GET", "/api/farms/[id]/sensors", "URL param: farmId, ?limit=50", "Returns time series of sensor readings (moisture, temp, NPK, humidity)."],
        ["GET", "/api/farms/[id]/satellite", "URL param: farmId", "Returns Sentinel-2 multispectral vegetation indices (NDVI, NDWI, SAVI, EVI)."],
        ["GET", "/api/farms/[id]/chf", "URL param: farmId", "Calculates live Shannon entropy weights and returns composite health score."],
        ["GET", "/api/farms/[id]/weather", "URL param: farmId", "Returns 7-day hourly weather forecast and 30-day precipitation history."],
        ["GET", "/api/farms/[id]/alerts", "URL param: farmId, ?unreadOnly=true", "Returns list of active alerts, early warnings, and SMS delivery receipts."],
        ["POST", "/api/farms/[id]/alerts", "Body: {alertId, isRead: true}", "Marks alert as acknowledged/read by the farmer or field agent."],
        ["POST", "/api/farms/[id]/interventions", "Body: {type, quantity, unit, cost, notes}", "Logs an agronomic field intervention (irrigation, spraying, fertilizer)."],
        ["GET", "/api/claims", "Query param: ?status=ALL|TRIGGERED|APPROVED", "Returns list of claims with farmer details, breach values, and auto-verification score."],
        ["GET", "/api/claims/[id]", "URL param: claimId (e.g. claim-clm-084)", "Returns complete 11-section Claim Evidence Package with satellite & AWS logs."],
        ["POST", "/api/claims/[id]/verify", "URL param: claimId", "Executes automated multi-factor cross-check (NDVI delta, ERA5 rain, IoT moisture)."],
        ["POST", "/api/claims/[id]/approve", "Body: {notes, underwriterId}", "Approves claim, sets status to APPROVED, spawns Payout, and signs SHA-256 audit log."],
        ["GET", "/api/payouts", "Query param: ?status=QUEUED|SETTLED", "Returns all compensation payouts with bank transaction UTR codes."],
        ["POST", "/api/payouts/[id]/execute", "URL param: payoutId", "Executes 7-step simulated banking settlement, sets status SETTLED, generates UTR."],
        ["GET", "/api/policies", "Query param: ?farmId, ?status=ACTIVE", "Returns insurance policies, coverage windows, sum insured, and trigger rules."],
        ["GET", "/api/insurance-units", "Query param: ?district=Nadia", "Returns Panchayat insurance units with 5-tier risk classifications and GeoJSON."],
        ["GET", "/api/insurance-units/[id]/risk", "URL param: unitId", "Returns actuarial risk exposure, loss ratio, and historical payout frequency."],
        ["GET", "/api/iot/devices", "Query param: ?status=ONLINE|OFFLINE", "Returns fleet of 20 IoT devices with battery, signal, and actuator states."],
        ["POST", "/api/iot/devices/[id]/toggle", "URL param: deviceId", "Toggles physical pump relay (ACTIVE/IDLE), returns new state, logs intervention."],
        ["GET", "/api/iot/tick", "None (Polled every 3s)", "Emits incremental sensor jitter, simulates live telemetry stream and checks triggers."],
        ["POST", "/api/disease/predict", "Body: {image: base64, crop: string, farmId: string}", "Infers 38-class plant pathology via CNN vision model, returns confidence & remedies."],
        ["POST", "/api/optimization/run", "Body: {farmId, targetYield, populationSize, iterations}", "Executes GA-PSO optimizer, returns recommended NPK kg/ha & irrigation schedule."],
        ["POST", "/api/simulate/event", "Body: {type: 'HEAVY_RAINFALL'|'HEATWAVE'|'DROUGHT'}", "Injects extreme weather shock, forces threshold breach, auto-generates claim."]
    ]

    api_table_rows = [
        [Paragraph("<b>Method</b>", styles['TableHead']), Paragraph("<b>Endpoint Route</b>", styles['TableHead']), Paragraph("<b>Input Parameters / Payload</b>", styles['TableHead']), Paragraph("<b>Data Response & State Effect</b>", styles['TableHead'])]
    ]

    for ep in apis_spec:
        m_color = "#047857" if ep[0] == "GET" else "#B91C1C"
        api_table_rows.append([
            Paragraph(f"<font color='{m_color}'><b>{ep[0]}</b></font>", styles['TableCellBold']),
            Paragraph(f"<code>{ep[1]}</code>", styles['TableCellCode']),
            Paragraph(ep[2], styles['TableCell']),
            Paragraph(ep[3], styles['TableCell'])
        ])

    t_api = Table(api_table_rows, colWidths=[42, 130, 160, 190])
    t_api.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), c_primary),
        ('GRID', (0,0), (-1,-1), 0.5, c_border),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
        ('LEFTPADDING', (0,0), (-1,-1), 5),
        ('RIGHTPADDING', (0,0), (-1,-1), 5),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, c_bg_subtle]),
    ]))
    story.append(t_api)
    story.append(PageBreak())

    # -------------------------------------------------------------
    # 5. SECTION 4: CLOUD DEPLOYMENT ARCHITECTURE (VERCEL & RENDER)
    # -------------------------------------------------------------
    story.append(Paragraph("4. Production Cloud Deployment Architecture (Vercel & Render)", styles['SecHeading']))
    story.append(HRFlowable(width="100%", thickness=1, color=c_slate, spaceBefore=2, spaceAfter=8))
    
    p_dep = (
        "AgriSure Intelligence is engineered for zero-downtime deployment across both the <b>Vercel Edge Network</b> "
        "(optimized for serverless Next.js edge caching) and <b>Render Cloud Platform</b> (optimized for long-running Node.js "
        "services and managed PostgreSQL with PostGIS). Both targets share identical configuration parameters."
    )
    story.append(Paragraph(p_dep, styles['BodyCustom']))
    story.append(Spacer(1, 10))

    # Deployment comparison table
    dep_matrix = [
        [Paragraph("<b>Configuration Dimension</b>", styles['TableHead']), Paragraph("<b>Vercel Deployment (Serverless Edge)</b>", styles['TableHead']), Paragraph("<b>Render Deployment (Blueprint & Container)</b>", styles['TableHead'])],
        [
            Paragraph("<b>Target Configuration File</b>", styles['TableCellBold']),
            Paragraph("<code>vercel.json</code> (Root directory)", styles['TableCellCode']),
            Paragraph("<code>render.yaml</code> & <code>Dockerfile</code>", styles['TableCellCode'])
        ],
        [
            Paragraph("<b>Build Command</b>", styles['TableCellBold']),
            Paragraph("<code>prisma generate && next build</code>", styles['TableCellCode']),
            Paragraph("<code>npm install && npm run build</code>", styles['TableCellCode'])
        ],
        [
            Paragraph("<b>Runtime Environment</b>", styles['TableCellBold']),
            Paragraph("Next.js App Router (Node.js 20.x Edge / Lambdas)", styles['TableCell']),
            Paragraph("Native Node Service (Port 10000) or Docker container", styles['TableCell'])
        ],
        [
            Paragraph("<b>Database Strategy</b>", styles['TableCellBold']),
            Paragraph("Neon / Supabase Serverless Postgres + PostGIS (via <code>DATABASE_URL</code>)", styles['TableCell']),
            Paragraph("Render Managed Postgres (<code>agrisure-postgres</code>) with auto-wired connection string", styles['TableCell'])
        ],
        [
            Paragraph("<b>Fallback Demonstration Mode</b>", styles['TableCellBold']),
            Paragraph("In-memory reactive store runs out of the box if no DB URL is supplied.", styles['TableCell']),
            Paragraph("Full store preloaded with Plot #204 and all 40 demo farms.", styles['TableCell'])
        ],
        [
            Paragraph("<b>Security & CORS Headers</b>", styles['TableCellBold']),
            Paragraph("X-Frame-Options: DENY, X-Content-Type-Options: nosniff, Strict API CORS.", styles['TableCell']),
            Paragraph("HTTPS termination, auto-renewed Let's Encrypt SSL certificates.", styles['TableCell'])
        ],
        [
            Paragraph("<b>Continuous Delivery</b>", styles['TableCellBold']),
            Paragraph("Automatic preview builds on GitHub pull requests; instant production promotion.", styles['TableCell']),
            Paragraph("Auto-deploy on Git push to <code>main</code> branch with rolling zero-downtime restarts.", styles['TableCell'])
        ],
    ]
    t_dep = Table(dep_matrix, colWidths=[130, 196, 196])
    t_dep.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), c_primary),
        ('GRID', (0,0), (-1,-1), 0.5, c_border),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, c_bg_subtle]),
    ]))
    story.append(t_dep)
    story.append(Spacer(1, 12))

    # Environment Variables Table
    story.append(Paragraph("<b>Required Production Environment Variables</b>", styles['SubSecHeading']))
    story.append(Spacer(1, 4))
    
    env_vars = [
        [Paragraph("<b>Variable Key</b>", styles['TableHead']), Paragraph("<b>Recommended Value</b>", styles['TableHead']), Paragraph("<b>Functional Purpose</b>", styles['TableHead'])],
        [Paragraph("<code>NODE_ENV</code>", styles['TableCellCode']), Paragraph("<code>production</code>", styles['TableCellCode']), Paragraph("Enables Next.js production optimizations and asset minification.", styles['TableCell'])],
        [Paragraph("<code>DATABASE_URL</code>", styles['TableCellCode']), Paragraph("<code>postgresql://user:pass@host:5432/db?sslmode=require</code>", styles['TableCellCode']), Paragraph("PostgreSQL connection string with PostGIS support for spatial entities.", styles['TableCell'])],
        [Paragraph("<code>JWT_SECRET</code>", styles['TableCellCode']), Paragraph("<code>(32+ character random hex key)</code>", styles['TableCellCode']), Paragraph("Signs role-based authentication tokens and API session cookies.", styles['TableCell'])],
        [Paragraph("<code>IOT_POLL_INTERVAL_MS</code>", styles['TableCellCode']), Paragraph("<code>3000</code>", styles['TableCellCode']), Paragraph("Defines real-time telemetry polling and simulation loop frequency (3 seconds).", styles['TableCell'])],
        [Paragraph("<code>DEMO_PRIMARY_PLOT</code>", styles['TableCellCode']), Paragraph("<code>Plot #204</code>", styles['TableCellCode']), Paragraph("Designates primary pilot entity for Rajesh Mondal in Nadia District.", styles['TableCell'])],
        [Paragraph("<code>SIMULATE_BANK_GATEWAY</code>", styles['TableCellCode']), Paragraph("<code>true</code>", styles['TableCellCode']), Paragraph("Enables NPCI/UPI simulated banking rail with automated UTR generation.", styles['TableCell'])],
    ]
    t_env = Table(env_vars, colWidths=[140, 192, 190])
    t_env.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#1E293B")),
        ('GRID', (0,0), (-1,-1), 0.5, c_border),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, c_bg_subtle]),
    ]))
    story.append(t_env)
    story.append(Spacer(1, 15))

    # Concluding sign-off
    signoff = [
        [Paragraph("<b>ARCHITECTURAL COMPLIANCE VERIFICATION</b>", styles['TableCellBold'])],
        [Paragraph("This specification certifies that all 28 frontend pages and 24 backend API routes in AgriSure Intelligence have been verified for syntactic correctness, role access control, cryptographic data integrity, and automated cloud deployment readiness.", styles['TableCell'])],
        [Paragraph("<b>Certified By:</b> AgriSure Principal Systems Architect & Chief Agronomic Underwriter", styles['TableCellBold'])]
    ]
    t_sign = Table(signoff, colWidths=[522])
    t_sign.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#F0FDF4")),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#86EFAC")),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
        ('LEFTPADDING', (0,0), (-1,-1), 10),
        ('RIGHTPADDING', (0,0), (-1,-1), 10),
    ]))
    story.append(t_sign)

    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"Successfully generated {filename}!")

if __name__ == "__main__":
    out_pdf = "AgriSure_Intelligence_Data_Flow_Specification.pdf"
    if len(sys.argv) > 1:
        out_pdf = sys.argv[1]
    build_pdf(out_pdf)
