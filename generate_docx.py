import os
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import nsdecls, qn

def set_cell_background(cell, fill_hex):
    tcPr = cell._tc.get_or_add_tcPr()
    shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{fill_hex}"/>')
    tcPr.append(shd)

def set_cell_margins(cell, top=120, bottom=120, left=180, right=180):
    tcPr = cell._tc.get_or_add_tcPr()
    tcMar = parse_xml(f'<w:tcMar {nsdecls("w")}><w:top w:w="{top}" w:type="dxa"/><w:bottom w:w="{bottom}" w:type="dxa"/><w:left w:w="{left}" w:type="dxa"/><w:right w:w="{right}" w:type="dxa"/></w:tcMar>')
    tcPr.append(tcMar)

def create_report():
    doc = Document()

    # Set standard page margins (1 inch)
    sections = doc.sections
    for section in sections:
        section.top_margin = Inches(0.8)
        section.bottom_margin = Inches(0.8)
        section.left_margin = Inches(0.9)
        section.right_margin = Inches(0.9)

    # Style colors
    BRAND_COLOR = RGBColor(14, 135, 235)   # Blue #0e87eb
    DARK_COLOR = RGBColor(30, 41, 59)      # Slate 800
    MUTED_COLOR = RGBColor(100, 116, 139)  # Slate 500
    ACCENT_BG = "F0F7FF"
    BORDER_COLOR = "CBD5E1"

    # Title
    p_title = doc.add_paragraph()
    p_title.paragraph_format.space_before = Pt(0)
    p_title.paragraph_format.space_after = Pt(4)
    run_title = p_title.add_run("Project Submission & AI Evidence Report")
    run_title.font.name = "Arial"
    run_title.font.size = Pt(22)
    run_title.font.bold = True
    run_title.font.color.rgb = BRAND_COLOR

    # Subtitle / Candidate Info
    p_sub = doc.add_paragraph()
    p_sub.paragraph_format.space_after = Pt(16)
    run_sub = p_sub.add_run("TaskFlow — Retail & Enterprise Task Management Dashboard\nCandidate: Prabudh Gaikwad | Track: Full-Stack Web Development")
    run_sub.font.name = "Arial"
    run_sub.font.size = Pt(11)
    run_sub.font.color.rgb = MUTED_COLOR

    # -------------------------------------------------------------
    # SECTION 1: Summary of Project
    # -------------------------------------------------------------
    h1 = doc.add_paragraph()
    h1.paragraph_format.space_before = Pt(14)
    h1.paragraph_format.space_after = Pt(6)
    r_h1 = h1.add_run("1. Project Summary & Core Architecture")
    r_h1.font.name = "Arial"
    r_h1.font.size = Pt(14)
    r_h1.font.bold = True
    r_h1.font.color.rgb = DARK_COLOR

    p1 = doc.add_paragraph()
    p1.paragraph_format.space_after = Pt(6)
    p1.paragraph_format.line_spacing = 1.15
    p1.add_run(
        "TaskFlow is a production-ready, responsive task management dashboard designed for retail store operations, "
        "compliance schedules, and shift personnel tracking. The application provides end-to-end task workflow management, "
        "real-time filtering, summary analytics, and built-in error resilience."
    )

    # Bullet points for key features
    features = [
        ("Tech Stack", "React 18, TypeScript, Tailwind CSS, Lucide Icons, Date-fns, and Vite."),
        ("Asynchronous Mock API Layer", "Simulates realistic HTTP network latency (200–500ms), handles CRUD operations, session persistence via browser localStorage, and includes a toggleable 500 error simulator."),
        ("Authentication & Session", "Sleek login interface with credential validation, session restoration, and 1-click Quick Demo logins (Regional Manager, Store Manager, Shift Lead)."),
        ("Interactive Summary Cards", "Live metric counters for Total Tasks, Pending Tasks, Completed Tasks, and Overdue Tasks (with dynamic date calculations and click-to-filter capability)."),
        ("Multi-Faceted Filtering & Search", "Instant keyword search across titles, descriptions, assignees, stores, and tags; faceted filtering by Employee, Store Location, Status, Date Presets (Today, This Week, Overdue, Custom Range), and Priority sorting."),
        ("Task Operations & Validation", "Comprehensive Create & Edit modals with inline field validation, quick row status selector, bulk batch operations, and safe deletion confirmation dialogs."),
        ("Responsive Layout", "Full desktop data table with employee avatars and relative date badges, paired with a touch-optimized card view for mobile devices.")
    ]

    for title, desc in features:
        bp = doc.add_paragraph(style='List Bullet')
        bp.paragraph_format.space_after = Pt(3)
        bp.paragraph_format.line_spacing = 1.15
        r_t = bp.add_run(f"{title}: ")
        r_t.font.bold = True
        r_t.font.color.rgb = DARK_COLOR
        bp.add_run(desc)

    # -------------------------------------------------------------
    # SECTION 2: GitHub Repository Link & Git History
    # -------------------------------------------------------------
    h2 = doc.add_paragraph()
    h2.paragraph_format.space_before = Pt(14)
    h2.paragraph_format.space_after = Pt(6)
    r_h2 = h2.add_run("2. GitHub Repository & Commit History")
    r_h2.font.name = "Arial"
    r_h2.font.size = Pt(14)
    r_h2.font.bold = True
    r_h2.font.color.rgb = DARK_COLOR

    p_git = doc.add_paragraph()
    p_git.paragraph_format.space_after = Pt(6)
    p_git.add_run("Source-Code Repository: ").bold = True
    r_link = p_git.add_run("https://github.com/prabudhsgaikwad7/task-management-dashboard")
    r_link.font.color.rgb = BRAND_COLOR
    r_link.font.underline = True

    p_commits_intro = doc.add_paragraph()
    p_commits_intro.paragraph_format.space_after = Pt(4)
    p_commits_intro.add_run("Meaningful Git Commit Log (Exceeds ≥ 3 commits requirement):").bold = True

    commits = [
        ("cc0abfa", "docs: link AI_USAGE.md and add candidate evaluation guidelines to README"),
        ("f4e9ee9", "docs: add AI_USAGE.md with prompts, architecture evidence, and triage logs"),
        ("bfc77ca", "feat(setup): initialize React Vite TypeScript project with Tailwind CSS and types")
    ]

    table = doc.add_table(rows=1, cols=2)
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    table.autofit = False

    hdr_cells = table.rows[0].cells
    hdr_cells[0].text = "Commit Hash"
    hdr_cells[1].text = "Commit Message / Description"
    hdr_cells[0].paragraphs[0].runs[0].font.bold = True
    hdr_cells[1].paragraphs[0].runs[0].font.bold = True
    set_cell_background(hdr_cells[0], "E2E8F0")
    set_cell_background(hdr_cells[1], "E2E8F0")
    hdr_cells[0].width = Inches(1.5)
    hdr_cells[1].width = Inches(5.0)

    for chash, cmsg in commits:
        row = table.add_row()
        c0, c1 = row.cells
        c0.width = Inches(1.5)
        c1.width = Inches(5.0)
        c0.text = chash
        c1.text = cmsg
        c0.paragraphs[0].runs[0].font.name = "Consolas"
        c0.paragraphs[0].runs[0].font.size = Pt(9.5)
        set_cell_margins(c0, 80, 80, 120, 120)
        set_cell_margins(c1, 80, 80, 120, 120)

    # -------------------------------------------------------------
    # SECTION 3: Summary of AI_USAGE.md & Direct Link
    # -------------------------------------------------------------
    h3 = doc.add_paragraph()
    h3.paragraph_format.space_before = Pt(16)
    h3.paragraph_format.space_after = Pt(6)
    r_h3 = h3.add_run("3. Summary of AI Evidence (AI_USAGE.md)")
    r_h3.font.name = "Arial"
    r_h3.font.size = Pt(14)
    r_h3.font.bold = True
    r_h3.font.color.rgb = DARK_COLOR

    p_ai_link = doc.add_paragraph()
    p_ai_link.paragraph_format.space_after = Pt(6)
    p_ai_link.add_run("Direct Link to AI_USAGE.md: ").bold = True
    r_ailink = p_ai_link.add_run("https://github.com/prabudhsgaikwad7/task-management-dashboard/blob/main/AI_USAGE.md")
    r_ailink.font.color.rgb = BRAND_COLOR
    r_ailink.font.underline = True

    p_ai_sum = doc.add_paragraph()
    p_ai_sum.paragraph_format.space_after = Pt(4)
    p_ai_sum.add_run("Key Summary from AI_USAGE.md:").bold = True

    ai_points = [
        ("AI Tools Used", "Google Antigravity (powered by Gemini 3.7 Flash) for end-to-end architecture, TypeScript component development, mock API design, styling, and debugging; Vite & tsc for validation."),
        ("Five Core Prompts", "1. System Architecture & Requirements Breakdown\n2. Asynchronous Mock API & Data Modeling\n3. Interactive Summary Cards with Click-to-Filter\n4. Multi-Faceted Search & Filter Component\n5. Form Validation, Error Resilience, and Responsive Views."),
        ("AI Mistake 1 (TypeScript verbatimModuleSyntax TS1484)", "Issue: Standard value import syntax was initially generated for types, violating TypeScript 5's verbatimModuleSyntax during build.\nResolution: Refactored all type references across the codebase to explicit 'import type { ... }' syntax."),
        ("AI Mistake 2 (Windows PowerShell Statement Syntax)", "Issue: Chaining setup commands using POSIX '&&' syntax failed on Windows PowerShell.\nResolution: Adjusted shell commands to use valid PowerShell statement separators (';') and isolated execution calls."),
        ("AI Mistake 3 (Dynamic Overdue Status Desynchronization)", "Issue: Static task status badges in seed data became desynchronized relative to current execution time.\nResolution: Implemented dynamic getEffectiveStatus() date comparison logic ensuring past-due uncompleted tasks automatically compute as Overdue in cards and tables.")
    ]

    for atitle, adesc in ai_points:
        bp = doc.add_paragraph(style='List Bullet')
        bp.paragraph_format.space_after = Pt(4)
        bp.paragraph_format.line_spacing = 1.15
        r_t = bp.add_run(f"{atitle}:\n")
        r_t.font.bold = True
        bp.add_run(adesc)

    # -------------------------------------------------------------
    # SECTION 4: Demonstration Video & Screenshots
    # -------------------------------------------------------------
    h4 = doc.add_paragraph()
    h4.paragraph_format.space_before = Pt(16)
    h4.paragraph_format.space_after = Pt(6)
    r_h4 = h4.add_run("4. Demonstration Video & Application Screenshots")
    r_h4.font.name = "Arial"
    r_h4.font.size = Pt(14)
    r_h4.font.bold = True
    r_h4.font.color.rgb = DARK_COLOR

    p_vid = doc.add_paragraph()
    p_vid.paragraph_format.space_after = Pt(8)
    p_vid.add_run("5-Minute Demonstration Video Link:\n").bold = True
    r_vbox = p_vid.add_run("[ INSERT YOUR VIDEO LINK HERE: e.g. Google Drive / Loom / YouTube / OneDrive Link ]")
    r_vbox.font.color.rgb = RGBColor(220, 38, 38) # Red placeholder
    r_vbox.font.bold = True

    p_ss_intro = doc.add_paragraph()
    p_ss_intro.paragraph_format.space_after = Pt(6)
    p_ss_intro.add_run("Application Screenshots (Placeholders for Submission):").bold = True

    ss_items = [
        ("Figure 1: Authentication & Quick Demo Login Interface", "[ Paste Screenshot of Login Screen with Demo User Cards Here ]"),
        ("Figure 2: Main Dashboard, Interactive Summary Metric Cards & Table", "[ Paste Screenshot of Dashboard Overview, Summary Cards & Sortable Table Here ]"),
        ("Figure 3: Multi-Faceted Search, Date Filter & Store Filter in Action", "[ Paste Screenshot of Active Search Filters and Chips Here ]"),
        ("Figure 4: Task Creation / Edit Modal with Real-Time Validation", "[ Paste Screenshot of Task Modal and Field Error Highlights Here ]"),
        ("Figure 5: API Error Simulation & Mobile Responsive Card Layout", "[ Paste Screenshot of 500 Error Retry Banner & Mobile Viewport Here ]")
    ]

    for ftitle, fdesc in ss_items:
        p_fig = doc.add_paragraph()
        p_fig.paragraph_format.space_before = Pt(6)
        p_fig.paragraph_format.space_after = Pt(2)
        p_fig.add_run(ftitle).bold = True
        
        # Callout box for screenshot placement
        box_table = doc.add_table(rows=1, cols=1)
        box_table.alignment = WD_TABLE_ALIGNMENT.CENTER
        cell = box_table.rows[0].cells[0]
        cell.width = Inches(6.5)
        set_cell_background(cell, "F8FAFC")
        set_cell_margins(cell, 200, 200, 200, 200)
        p_cell = cell.paragraphs[0]
        p_cell.alignment = WD_ALIGN_PARAGRAPH.CENTER
        r_c = p_cell.add_run(fdesc)
        r_c.font.color.rgb = MUTED_COLOR
        r_c.font.italic = True

    # Output file paths
    output_path = r"c:\Users\Prabudh\OneDrive\Desktop\Task Management Dashboard\Project_Submission_Report.docx"
    doc.save(output_path)
    print(f"Successfully generated: {output_path}")

if __name__ == "__main__":
    create_report()
