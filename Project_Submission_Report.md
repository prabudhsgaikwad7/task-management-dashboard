# 📄 Project Submission & AI Evidence Report

**Project Title**: TaskFlow — Retail & Enterprise Task Management Dashboard  
**Candidate Name**: Prabudh Gaikwad  
**Track**: Full-Stack Web Development  
**Submission Date**: September 2026  

---

## 1. Project Summary & Core Architecture

**TaskFlow** is a responsive web dashboard designed for retail operations, compliance tracking, and staff management. It provides end-to-end task workflow management, dynamic filtering, summary analytics, and built-in error resilience without requiring external backend infrastructure.

### Key Architecture & Capabilities:
- **Tech Stack**: React 18, TypeScript, Tailwind CSS, Lucide Icons, Date-fns, and Vite.
- **Asynchronous Mock API Layer**: Simulates real HTTP latency (200–500ms), manages CRUD operations, handles session persistence in `localStorage`, and includes a toggleable 500 error simulator.
- **Authentication & Session**: Secure login with credential validation, session restoration, and 1-click Quick Demo logins (*Regional Manager*, *Store Manager*, *Shift Lead*).
- **Interactive Summary Cards**: Live metric counters for **Total Tasks**, **Pending Tasks**, **Completed Tasks**, and **Overdue Tasks** (with dynamic date calculations and click-to-filter capability).
- **Multi-Faceted Filtering & Search**: Instant full-text search across titles, descriptions, assignees, stores, and tags; faceted filtering by Employee, Store Location, Status, Date Presets (Today, This Week, Overdue, Custom Range), and Priority sorting.
- **Task Operations & Validation**: Create & Edit modals with inline field validation, quick status selector in table rows, bulk batch operations, and deletion confirmation dialogs.
- **Responsive Layout**: Sortable data table with employee avatars and relative date badges for desktop, paired with a touch-friendly card view for mobile viewports (<768px).

---

## 2. GitHub Repository Link & Git History

- **GitHub Repository**: [https://github.com/prabudhsgaikwad7/task-management-dashboard](https://github.com/prabudhsgaikwad7/task-management-dashboard)

### Git Commit History (Exceeds ≥ 3 commits requirement):

| Commit Hash | Commit Message / Description |
| :--- | :--- |
| `cc0abfa` | `docs: link AI_USAGE.md and add candidate evaluation guidelines to README` |
| `f4e9ee9` | `docs: add AI_USAGE.md with prompts, architecture evidence, and triage logs` |
| `bfc77ca` | `feat(setup): initialize React Vite TypeScript project with Tailwind CSS and types` |

---

## 3. Summary of AI Evidence (`AI_USAGE.md`)

- **Direct Link to `AI_USAGE.md` on GitHub**: [https://github.com/prabudhsgaikwad7/task-management-dashboard/blob/main/AI_USAGE.md](https://github.com/prabudhsgaikwad7/task-management-dashboard/blob/main/AI_USAGE.md)

### Summary of Key Points from `AI_USAGE.md`:
1. **AI Tools Used**: Google Antigravity (powered by Gemini 3.7 Flash) for architecture design, full-stack React/TypeScript scaffolding, mock API design, styling, and debugging; Vite and `tsc` for validation.
2. **Five Core Prompts**:
   - *Prompt 1*: System Architecture & Requirements Breakdown.
   - *Prompt 2*: Asynchronous Mock API & Data Modeling.
   - *Prompt 3*: Interactive Summary Cards with Click-to-Filter.
   - *Prompt 4*: Multi-Faceted Search & Filter Component.
   - *Prompt 5*: Form Validation, Error Resilience, and Responsive Views.
3. **AI Mistakes Encountered & Solutions**:
   - **Mistake 1 (TypeScript `verbatimModuleSyntax` TS1484)**: Standard value imports were initially used for types; resolved by refactoring all type references across the codebase to explicit `import type { ... }` syntax.
   - **Mistake 2 (Windows PowerShell Statement Syntax)**: POSIX `&&` syntax failed during dependency installation; resolved by replacing with PowerShell statement separators (`;`).
   - **Mistake 3 (Dynamic Overdue Status Desynchronization)**: Static task status values in seed data did not dynamically reflect time changes; resolved by implementing dynamic `getEffectiveStatus()` relative date comparison logic.

---

## 4. Demonstration Video & Application Screenshots

### 🎥 5-Minute Demonstration Video Link
> **Video Link**: `[ INSERT YOUR VIDEO LINK HERE: e.g. Loom / Google Drive / YouTube / OneDrive Link ]`

### 📸 Application Screenshots Placeholders

#### Figure 1: Authentication & Quick Demo Login Interface
`[ Paste Screenshot of Login Screen with Demo User Cards Here ]`

#### Figure 2: Main Dashboard, Interactive Summary Metric Cards & Table
`[ Paste Screenshot of Dashboard Overview, Summary Cards & Sortable Table Here ]`

#### Figure 3: Multi-Faceted Search, Date Filter & Store Filter in Action
`[ Paste Screenshot of Active Search Filters and Chips Here ]`

#### Figure 4: Task Creation / Edit Modal with Real-Time Validation
`[ Paste Screenshot of Task Modal and Field Error Highlights Here ]`

#### Figure 5: API Error Simulation & Mobile Responsive Card Layout
`[ Paste Screenshot of 500 Error Retry Banner & Mobile Viewport Here ]`
