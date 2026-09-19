# 🤖 AI Usage & Engineering Evidence Document (`AI_USAGE.md`)

This document details the AI tools, prompts, generated code architecture, mistakes encountered, and resolutions applied during the development of the **TaskFlow Task Management Dashboard**.

---

## 1. AI Tools Used

| Tool | Purpose / Usage |
| :--- | :--- |
| **Google Antigravity (Gemini 3.7 Flash)** | Architecture design, full-stack React + TypeScript scaffolding, mock API design, interactive UI components, Tailwind CSS styling, and bug triage. |
| **Vite & TypeScript Compiler (`tsc`)** | Fast bundling, live reload, and strict type verification. |

---

## 2. Five Important Prompts Used

Below are the 5 core prompts that drove the planning, data design, filtering logic, error handling, and responsive layout:

### Prompt 1: System Architecture & Requirements Breakdown
```text
Build a responsive web dashboard with the following specifications:
- Simple login using a supplied mock API with session persistence.
- Display tasks in a table and mobile card view.
- Search and filter by employee, date, status, and store.
- Create and edit a task with form validation.
- Change task status dynamically.
- Summary metric cards: Total, Pending, Completed, Overdue.
- Handle API errors and validation.
- Desktop and mobile responsiveness.
- Tech Stack: React, TypeScript, Tailwind CSS.
```

### Prompt 2: Mock API & Asynchronous Data Modeling
```text
Create a robust Mock API layer in TypeScript with simulated network latencies (200-500ms) and localStorage persistence.
Include:
1. Auth API: login, session restoration, demo accounts for Manager, Admin, and Staff.
2. Tasks API: CRUD operations, dynamic overdue status calculation (dueDate < today && status !== 'Completed'),
   multi-field search, facet filtering by assignee, store, date, and priority.
3. Summary metrics aggregation (Total, Pending, Completed, Overdue, completion percentage).
4. Error simulation flag to test 500 error recovery and user feedback.
```

### Prompt 3: Interactive Summary Cards with Drill-Down Filtering
```text
Build 4 interactive summary cards: Total Tasks, Pending Tasks, Completed Tasks, and Overdue Tasks.
Each card should feature:
- Clean icon with distinct semantic color badges.
- Metric counter and contextual subtitle (e.g. completion rate percentage, active in-progress count).
- Progress bar indicator.
- Click-to-filter behavior: Clicking any card instantly filters the dashboard table by that status.
```

### Prompt 4: Multi-Faceted Filter & Search Component
```text
Design a responsive filter and search bar:
- Search input matching title, description, employee name, store name, or tags.
- Status quick-select pills (All, Pending, In Progress, Completed, Overdue).
- Expandable advanced filters: Employee dropdown, Store location dropdown, Date presets (Today, This Week, Overdue, Custom Range), Priority & Sort By selector.
- Active filter badges with one-click individual removal and a 'Clear all filters' button.
```

### Prompt 5: Validation, Error Recovery, and Responsive Views
```text
Implement comprehensive form validation for Task Creation and Editing:
- Inline validation error messages for required fields (Title min 3 chars, Assignee, Store, Due Date).
- Modal dialog with clean inputs, tag chip manager, and duration slider/number input.
- Global API error banner with 'Retry Request' action and interactive Toast notifications.
- Responsive design: clean sortable data table for desktop, and card layout for mobile viewports (<768px).
```

---

## 3. Breakdown of AI-Generated Code

The codebase is organized into modular TypeScript components and services:

```
src/
├── types/
│   └── index.ts                 # TypeScript interfaces (Task, Employee, Store, Filters, SummaryStats)
├── api/
│   ├── seedData.ts              # Multi-store sample seed data with dynamic relative dates
│   ├── mockAuth.ts              # Authentication service with demo users & session persistence
│   └── mockTasks.ts             # CRUD engine, filter pipeline, overdue calculator, error simulator
├── context/
│   ├── AuthContext.tsx          # Auth state provider and session management
│   └── ToastContext.tsx         # Notification toast system (Success, Error, Warning, Info)
├── components/
│   ├── auth/
│   │   └── LoginForm.tsx        # Responsive login screen with 1-click Quick Demo logins
│   ├── dashboard/
│   │   ├── Header.tsx           # Navbar with profile, error simulator switch, reset data button
│   │   ├── SummaryCards.tsx     # 4 interactive metric cards with progress indicators
│   │   ├── TaskFilters.tsx      # Full-text search and multi-facet filtering bar
│   │   ├── TaskTable.tsx        # Desktop sortable table & mobile responsive cards
│   │   ├── TaskModal.tsx        # Create/Edit modal with field-level validation
│   │   ├── TaskDetailModal.tsx  # Deep inspection view with quick status changer
│   │   └── DeleteConfirmModal.tsx # Safe deletion dialog
│   └── ui/
│       ├── Badge.tsx            # Semantic status & priority badges
│       ├── Button.tsx           # Multi-variant button component with loading state
│       ├── Modal.tsx            # Accessible backdrop modal dialog
│       └── Skeleton.tsx         # Loading skeletons for table rows and summary cards
├── utils/
│   └── dateUtils.ts             # Date formatting and overdue badge calculation
├── App.tsx                      # Main application orchestrator
└── main.tsx                     # React root mount
```

---

## 4. AI Mistakes Found & How They Were Corrected

### Mistake 1: TypeScript 5.x `verbatimModuleSyntax` Compilation Errors (TS1484)
- **The Issue**: When generating TypeScript imports in components and API services, types and interfaces were imported using standard value import syntax:
  ```typescript
  // ❌ Caused TS1484 error under verbatimModuleSyntax:
  import { Task, TaskStatus, Employee } from '../types';
  ```
  Vite's default `tsconfig.app.json` configuration had `"verbatimModuleSyntax": true`, causing compiler errors during `npm run build`:
  `error TS1484: 'Task' is a type and must be imported using a type-only import`.
- **How It Was Corrected**: Updated all import declarations across all files to explicitly use `import type { ... }`:
  ```typescript
  // ✅ Fixed with type-only import syntax:
  import type { Task, TaskStatus, Employee } from '../types';
  ```

---

### Mistake 2: PowerShell Shell Command Chaining Syntax Failure on Windows
- **The Issue**: The initial setup script used POSIX/Bash syntax `&&` to chain dependency installations (`npm install -D ... && npm install ...`). On Windows PowerShell, `&&` is not a valid token in default syntax modes, throwing a `ParserError: The token '&&' is not a valid statement separator`.
- **How It Was Corrected**: Replaced `&&` with PowerShell-compatible statement separators (`;` and separate sequential tool executions):
  ```powershell
  # ✅ Fixed command:
  npm install -D tailwindcss@3.4.17 postcss autoprefixer; npm install lucide-react clsx tailwind-merge date-fns
  ```

---

### Mistake 3: Dynamic Overdue State Desynchronization
- **The Issue**: Hardcoded static status values in seed data would become inaccurate over time if evaluated relative to the current live date (a task with due date yesterday might still be marked as "Pending" instead of "Overdue").
- **How It Was Corrected**: Implemented an automated `getEffectiveStatus()` helper in [`src/api/mockTasks.ts`](file:///c:/Users/Prabudh/OneDrive/Desktop/Task%20Management%20Dashboard/src/api/mockTasks.ts) and relative date generators (`getRelativeDateStr()`), ensuring that any uncompleted task past its due date dynamically renders with the Overdue status, badge styling, and increments the Overdue summary counter.

---

## 5. Five-Minute Demonstration Video Script Guide

When recording your 5-minute video, follow this structured demo:

1. **Introduction (0:00 – 0:45)**:
   - Introduce yourself and state the project goal: A responsive retail task management dashboard.
   - Show the Login screen and demonstrate the **Quick Demo Login** buttons.
2. **Dashboard Overview & Summary Cards (0:45 – 1:30)**:
   - Walk through the 4 Summary Cards (Total, Pending, Completed, Overdue).
   - Demonstrate the **Click-to-Filter** capability (clicking "Overdue" filters the list).
3. **Search & Multi-Filter Engine (1:30 – 2:30)**:
   - Search by keyword (`RFID`, `Apparel`, `Sarah`).
   - Filter by Employee, Store Location (`Downtown Flagship`, `STR-101`), and Due Date range.
   - Show active filter chips and clear them.
4. **Task CRUD & Quick Status Changes (2:30 – 3:45)**:
   - Click **+ New Task** and demonstrate form validation (submit empty form to show required field alerts).
   - Create a new task and see it instantly appear with updated metrics.
   - Change task status via the inline dropdown and mobile view.
   - Open the Task Detail modal and test editing.
5. **Error Handling & Mobile Responsiveness (3:45 – 5:00)**:
   - Toggle **Simulate API Error** in the top header to demonstrate 500 error resilience and the "Retry Request" banner.
   - Resize the browser window or use DevTools device toolbar to show mobile card view.
