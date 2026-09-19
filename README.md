# 📋 TaskFlow — Retail & Enterprise Task Management Dashboard

A modern, responsive web application for managing retail floor operations, compliance timelines, and staff assignments. Built with **React**, **TypeScript**, **Tailwind CSS**, and an asynchronous **Mock API Layer**.

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

## 📄 Mandatory Evaluation & AI Evidence
This repository fulfills all evaluation guidelines:
- **`AI_USAGE.md`**: Complete AI evidence document including AI tools used, 5 key prompts, code architecture, AI mistakes encountered, and step-by-step resolution logs.
- **Git Commit History**: Clean, meaningful git history across features, architecture, UI, and documentation.
- **Self-Contained Mock Backend**: Zero external API dependencies, fully executable locally with `npm run dev`.


---

## 🔑 Demo Login Credentials

You can use the **Quick Demo Login buttons** on the login screen to sign in with a single click, or enter any of the credentials below:

| Role | Email | Password | Store Location |
| :--- | :--- | :--- | :--- |
| **Regional Manager** | `admin@taskflow.internal` | `admin123` | Downtown Flagship |
| **Store Manager** | `manager@taskflow.internal` | `manager123` | Downtown Flagship |
| **Shift Lead** | `staff@taskflow.internal` | `staff123` | Westside Galleria |

---

## ✨ Features & Capabilities

### 1. Interactive Summary Metrics Cards
- **Total Tasks**: Total count and active in-progress metrics.
- **Pending Tasks**: Active tasks awaiting completion with urgent task count.
- **Completed Tasks**: Tasks completed with live percentage completion rate.
- **Overdue Tasks**: Automatically flags tasks past their due date that are not completed.
- **Click to Filter**: Clicking any summary card instantly filters the table to that status.

### 2. Search, Filtering & Sorting
- **Instant Search**: Search by task title, description, employee name, store name, or tags.
- **Employee Filter**: Filter tasks assigned to specific team members.
- **Store Location Filter**: Filter by retail store branches.
- **Status Filter**: Filter by `All`, `Pending`, `In Progress`, `Completed`, or `Overdue`.
- **Date Range Filter**: Filter by `Due Today`, `This Week`, `Overdue Dates`, or `Custom Date Range`.
- **Priority & Sorting**: Sort by Due Date, Priority (Urgent first), Creation Date, or Title.

### 3. Task Operations (CRUD)
- **Create Task**: Comprehensive form with input validation (Title, Assignee, Store, Due Date, Priority, Category, Tags, Duration).
- **Edit Task**: Modify task details, reschedule due dates, or reassign staff.
- **Quick Status Changer**: Change status directly from the table row dropdown, mobile card selector, or task detail view.
- **Bulk Operations**: Select multiple tasks to mark them completed or delete them simultaneously.
- **Delete with Confirmation**: Safety confirmation modal preventing accidental deletions.

### 4. API Error Handling & Validation
- **Real-Time Validation**: Field-level validation with inline error messages for missing or invalid inputs.
- **Toast Notifications**: Interactive feedback toasts for success, warnings, and errors.
- **Error Simulation Mode**: Built-in header toggle (`Simulate API Error`) to test 500 error resilience, banner alerts, and "Retry Request" functionality.
- **Data Reset**: Click the reset icon in the header at any time to restore the default sample dataset.

### 5. Responsive Design
- **Desktop**: Full data table with avatar chips, relative date badges, and action menus.
- **Mobile & Tablet**: Touch-friendly card layout with quick actions.

---

## 🛠️ Tech Stack
- **Framework**: React 18 + Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Date Utilities**: Date-fns
- **Persistence**: Browser `localStorage` with simulated network latency
