# Comprehensive Technical & Functional Specification: Sonali Enterprises ERP

> **Purpose**: This document serves as a complete, deep-dive architectural and functional blueprint of the **Sonali Enterprises Labour Contracting ERP** application. It is structured specifically to allow AI systems or engineering teams to understand the existing implementation, data structures, UI design system, business logic, and potential roadmap for future expansions.

---

## 1. Executive Summary & Business Domain

### 1.1 Company Profile
- **Company Name**: Sonali Enterprises
- **Location**: Chinchwad Highway Road, Pune, Maharashtra, India
- **Core Business**: Industrial & Automotive Labour Contracting / Workforce Management
- **Key Client**: Tata Motors Ltd. (Manufacturing Plants - Pune Complex)

### 1.2 Operational Model
Sonali Enterprises operates as a primary labour contractor supplying skilled, semi-skilled, and unskilled industrial manpower (welders, assembly line fitters, machine operators, quality inspectors, riggers, material handlers) to manufacturing facilities. The company handles:
1. End-to-end worker recruitment, onboarding, KYC, and exit offboarding.
2. Deployment of workers against Purchase Orders (POs) issued by Tata Motors.
3. Automated monthly wage generation, salary advance tracking, and payroll disbursements.
4. Client billing, GST 18% calculation, and invoice generation.
5. Profit margin analysis across worker wages versus client billing rates.

---

## 2. Technical Stack & Architecture

| Architectural Layer | Implementation Technology | Key Details |
| :--- | :--- | :--- |
| **Frontend Framework** | React 18+ (Functional Components) | Component-based, React Hooks (`useState`, `useEffect`, `useMemo`), React Suspense & Lazy Loading (`React.lazy`) |
| **Styling & Design System** | Tailwind CSS v3 | Custom UI component utility system (`@layer components`), high-contrast Light Theme design tokens (`slate-50` background, `white` cards, `slate-900` text) |
| **State & Data Store** | In-Memory Immutable React State | State-driven reactive model (`dummyData.js`), 0 backend API latency, instant CRUD updates without page reloads |
| **Build & Bundler** | Vite 8+ | Lightning-fast HMR dev server, optimized Rolldown production chunking |
| **Iconography** | Custom SVG Outline System (`Icons.jsx`) | Zero external icon library dependencies; Lucide-inspired responsive vector icons |
| **Hosting & Deployment** | Vercel SPA Ready | Single Page Application client-side routing via `vercel.json` rewrite rules |

---

## 3. Design System & UI/UX Standards

### 3.1 Color Palette & Theme Tokens
- **Application Background**: `#f8fafc` (`bg-slate-50`)
- **Card / Container Surfaces**: `#ffffff` (`bg-white`) with subtle borders `#e2e8f0` (`border-slate-200`) and soft elevation (`shadow-sm`)
- **Primary Text**: `#0f172a` (`text-slate-900` - Deep Navy/Slate Black)
- **Secondary / Subtitle Text**: `#64748b` (`text-slate-500` - Slate Muted)
- **Primary Action Buttons (`.btn-gold`)**: `#0f172a` background with white text, micro hover lift (`translate-y-[-1px]`) and soft drop shadow
- **Outline Buttons (`.btn-outline`)**: `#ffffff` background with slate-300 border and slate-800 text
- **Status Badges**:
  - `Active` / `Approved` / `Completed` / `Paid`: Emerald theme (`bg-emerald-50 text-emerald-700 border-emerald-200`)
  - `Pending` / `In Progress`: Amber theme (`bg-amber-50 text-amber-700 border-amber-200`)
  - `Draft` / `Inactive`: Slate theme (`bg-slate-100 text-slate-700 border-slate-200`)
  - `Open` / `Sent`: Sky theme (`bg-sky-50 text-sky-700 border-sky-200`)
  - `Rejected` / `Overdue` / `Blocked`: Rose theme (`bg-rose-50 text-rose-700 border-rose-200`)

### 3.2 Responsive Navigation Architecture
- **Desktop Layout (`≥ 768px`)**: Sticky left sidebar (`w-64`, `sticky top-0 h-screen flex-shrink-0 z-30`), housing brand details, operational links, and administrator profile. Content main section takes `flex-1 min-w-0` to eliminate UI clipping.
- **Mobile Layout (`< 768px`)**: Sticky top brand header + frosted bottom navigation bar (`fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-slate-200`), featuring 5 primary quick-access tabs with icon badges.

---

## 4. In-Memory Data Models & Schemas

### 4.1 Company (`COMPANY`)
```javascript
{
  name: "Sonali Enterprises",
  address: "Chinchwad Highway Road, Pune, Maharashtra - 411019",
  client: "Tata Motors Ltd., Pune",
  phone: "+91 98220 12345",
  email: "contact@sonalienterprises.in",
  gst: "27AAAFS1234H1Z5"
}
```

### 4.2 Worker (`WORKERS`)
```javascript
{
  id: "SE-001",
  name: "Amol Deshmukh",
  phone: "+91 98765 43210",
  skill: "Senior Welder",
  department: "Assembly Line 2",
  dailyWage: 850,
  status: "Active", // Active | Inactive
  joiningDate: "2023-03-15",
  aadhaar: "XXXX-XXXX-4829",
  bankAcc: "SBIN0001234"
}
```

### 4.3 Quotation (`QUOTATIONS`)
```javascript
{
  id: "QT-2025-001",
  client: "Tata Motors Ltd.",
  description: "Welding & Assembly Line Staffing - Shift B",
  workersNeeded: 25,
  durationDays: 30,
  ratePerWorkerDay: 1100, // Billing rate to Tata Motors
  subtotal: 825000,
  gst: 148500, // 18% GST
  total: 973500,
  status: "Approved", // Draft | Sent | Approved | Rejected
  createdDate: "2025-08-01"
}
```

### 4.4 Purchase Order (`PURCHASE_ORDERS`)
```javascript
{
  id: "PO-TM-2025-078",
  poNumber: "PO-992014",
  client: "Tata Motors Ltd.",
  workType: "Body Shop Assembly Line Workforce",
  workersRequired: 20,
  workersDeployed: 20,
  startDate: "2025-08-10",
  endDate: "2025-09-10",
  dailyRatePerWorker: 1100,
  totalValue: 660000,
  status: "In Progress" // Open | In Progress | Completed
}
```

### 4.5 Invoice (`INVOICES`)
```javascript
{
  id: "INV-SE-2025-001",
  poNumber: "PO-992014",
  client: "Tata Motors Ltd.",
  date: "2025-08-25",
  dueDate: "2025-09-10",
  workDescription: "Manpower Deployment for Body Shop Assembly Line (20 Workers x 26 Days)",
  workerCount: 20,
  daysWorked: 26,
  ratePerDay: 1100,
  subtotal: 572000,
  gstAmount: 102960, // 18%
  grandTotal: 674960,
  status: "Paid" // Paid | Pending | Overdue
}
```

### 4.6 Payroll (`PAYROLL`)
```javascript
{
  workerId: "SE-001",
  workerName: "Amol Deshmukh",
  skill: "Senior Welder",
  daysWorked: 26,
  dailyWage: 850,
  grossPay: 22100, // 26 * 850
  advanceDeduction: 1000,
  pfDeduction: 500,
  netPay: 20600,
  payoutStatus: "Paid" // Paid | Pending
}
```

### 4.7 Onboarding Record (`ONBOARDING`)
```javascript
{
  id: "ONB-2025-001",
  workerName: "Rohan Gaikwad",
  phone: "+91 91234 56789",
  appliedSkill: "Machine Operator",
  expectedWage: 750,
  currentStep: 3, // 1 to 5
  overallStatus: "In Progress", // In Progress | Blocked | Completed | Activated
  daysStarted: 2,
  documents: { aadhaar: true, pan: true, photo: true, bankPassbook: true, prevExp: false },
  medical: { status: "Fit", date: "2025-08-20", center: "Sahyadri Diagnostics Pune", notes: "Clear for industrial line work" },
  police: { status: "Cleared", refNo: "POL-PUN-88392", date: "2025-08-18" }
}
```

### 4.8 Offboarding Record (`OFFBOARDING`)
```javascript
{
  id: "OFF-2025-001",
  workerId: "SE-008",
  workerName: "Vikas Patil",
  skill: "Quality Inspector",
  department: "Paint Shop",
  joiningDate: "2023-01-10",
  exitType: "Resignation", // Resignation | Contract End | Termination | Absconding
  lastDate: "2025-08-15",
  reason: "Personal family reasons",
  daysWorked: 15,
  dailyWage: 900,
  pendingWages: 13500,
  advanceDeductions: 500,
  netSettlement: 13000,
  settlementStatus: "Paid", // Pending | Paid
  completionStatus: "Completed", // In Progress | Completed
  clearance: { idCard: true, uniform: true, noDues: true, exitInterview: true }
}
```

---

## 5. Detailed Module Specifications

### 5.1 Dashboard Module (`Dashboard.jsx`)
- **Executive KPI Cards**: 
  - Total Active Workers (Count + monthly growth indicator)
  - Active Purchase Orders (Open PO count from Tata Motors)
  - Pending Invoice Receivables (Unpaid invoice value in ₹)
  - Monthly Billed Revenue (Current month total billing in ₹)
  - Net Monthly Profit (Billed Revenue minus Worker Payouts & Expenses)
- **Interactive Revenue Trajectory SVG Chart**: Custom responsive vector bar chart displaying 6-month historical billing trajectory with hover highlights.
- **Quick Actions Bar**: Instant modal launch shortcuts for *New Quotation*, *New Invoice*, and *Add Worker*.
- **Live Audit Feed**: Real-time event log tracking recently raised invoices, PO arrivals, attendance updates, and worker onboarding status changes.

### 5.2 Worker Management Module (`Workers.jsx`)
- **Filter & Search Toolbar**: Real-time search by name, ID, or skill; filter pills for Active vs Inactive personnel.
- **Worker Data Table**: Displays ID, Name, Trade/Skill, Department, Daily Wage (₹), and Status Badge.
- **Worker Addition Modal**: Validated form capturing Name, Phone, Skill, Daily Wage, Department, Aadhaar, Bank Details, and Joining Date.
- **Worker Detail Drawer**: Slide-over panel summarizing worker attendance metrics, monthly earned wages, and active PO assignment.

### 5.3 Quotation Module (`Quotations.jsx`)
- **Quotation Generator Wizard**: Form auto-filling Tata Motors as client, capturing work description, required headcount, contract duration (days), and billing rate per day. Automatically calculates:
  $$\text{Subtotal} = \text{Workers} \times \text{Days} \times \text{Rate}$$
  $$\text{GST (18\%)} = \text{Subtotal} \times 0.18$$
  $$\text{Grand Total} = \text{Subtotal} + \text{GST}$$
- **Lifecycle Status Pipeline**: Quotations categorized into *Draft*, *Sent*, *Approved*, and *Rejected*.
- **Formatted Proposal View**: Modal presenting an official Sonali Enterprises letterhead quotation ready for client review.

### 5.4 Purchase Order (PO) Management (`PurchaseOrders.jsx`)
- **PO List & Detailed Cards**: Displays PO numbers issued by Tata Motors, work scope, required vs deployed headcount, and start/end dates.
- **Deployment Tracker**: Visual progress bar comparing `workersDeployed` against `workersRequired`.
- **Status Workflow**: Tracks PO states (*Open*, *In Progress*, *Completed*). Provides a 1-click action to generate a draft invoice upon PO completion.

### 5.5 Invoicing Module (`Invoices.jsx`)
- **Automated PO-to-Invoice Conversion**: Instantly populates invoice line items from PO data.
- **Tax Breakdown Engine**: Displays itemized subtotal, SGST (9%), CGST (9%), and grand total.
- **Tax Invoice Print Modal**: Generates a standard GST Tax Invoice card containing Sonali Enterprises GSTIN, Tata Motors billing address, bank transfer details, and authorized signature section.
- **Payment Status Handler**: Toggle invoice status between *Pending*, *Paid*, and *Overdue*.

### 5.6 Payroll & Worker Salaries (`Payroll.jsx`)
- **Monthly Payout Calculations**: Auto-computes gross earnings, advances, PF/ESI deductions, and net payable salary:
  $$\text{Gross Pay} = \text{Days Worked} \times \text{Daily Wage}$$
  $$\text{Net Salary} = \text{Gross Pay} - \text{Advance Deductions} - \text{PF/Deductions}$$
- **Disbursement Controls**: Allows administrative marking of worker salaries as *Paid* or *Pending*.
- **Margin Analysis Header**: Shows total billings collected from Tata Motors versus total worker wages disbursed, highlighting net gross profit.

### 5.7 Profit & Loss Statement (`ProfitLoss.jsx`)
- **Monthly Financial KPI Summary**: Displays Total Billed Revenue, Total Worker Wages Paid, Overhead Operating Expenses, Net Profit (₹), and Net Profit Margin (%).
- **Visual Margin Progress Bars**: CSS bar breakdown showing percentage of revenue consumed by worker salaries versus retained profit.
- **6-Month Historical P&L Table**: Month-by-month comparative table analyzing revenue trends, wage costs, expenses, and net margin growth.

### 5.8 Worker Onboarding Module (`Onboarding.jsx`)
- **5-Step Stepper Workflow**:
  1. **Basic Info**: Name, phone, address, gender, emergency contact, target skill, expected wage.
  2. **Document Check (KYC)**: Verification toggles for Aadhaar, PAN, Passport Photo, Bank Passbook, and Previous Experience Letter.
  3. **Medical Fitness Verification**: Test date, medical center name, result status (*Fit*, *Unfit*, *Pending*), and doctor notes. (If *Unfit*, blocks onboarding).
  4. **Police Verification**: Clearance tracking, reference number, submission date, status (*Cleared*, *Pending*, *Rejected*). (If *Rejected*, blocks activation).
  5. **Review & System Activation**: Verification summary. Once all mandatory steps pass, 1-click button activates the worker and automatically transfers them into the main Worker Management table.
- **Digital Onboarding Link Generator**: Modal producing a public candidate onboarding URL (`app.sonalienterprises.in/onboard/TKN-2847`) with deep-link shortcuts for WhatsApp dispatch (`wa.me`) and SMS preview.

### 5.9 Worker Offboarding Module (`Offboarding.jsx`)
- **Exit Formalities Stepper**:
  1. **Exit Initiation**: Selection of worker, exit type (*Resignation*, *Contract End*, *Termination*, *Absconding*), last working date, and exit reason.
  2. **Final Salary Settlement**: Auto-calculates earned wages for final month working days, deducts remaining advances, and calculates net payable settlement.
  3. **Department Clearance Checklist**: Confirmation toggles for ID card return, uniform/helmet return, No Dues certificate, and exit interview.
  4. **Experience Letter & Deactivation**: Final status summary, deactivation button (marks worker status to *Inactive* in main worker directory), and generation of an official **Service & Experience Certificate** letterhead.

---

## 6. Guidelines for AI Prompting & Future Expansion Ideas

If feeding this specification into another AI agent (such as Claude 3.5 Sonnet, GPT-4o, or Gemini 1.5 Pro) to generate new features, architectural refactors, or backend extensions, use the following structured prompt directives:

### 💡 Suggested Prompts for Next-Gen Features

#### 1. Real-Time Database & Backend Integration
> *"Using the data schemas defined in Section 4 of this spec, design a Node.js + Express + PostgreSQL REST API with Prisma ORM. Include JWT authentication for two roles (`Admin` and `Plant Supervisor`), database migrations, and endpoints for all 9 ERP modules."*

#### 2. QR-Code Gate Attendance System
> *"Design a mobile-first Worker Gate Attendance module where Plant Supervisors can scan a QR code on a worker's digital ID card using their phone camera to mark daily Shift A / Shift B gate entry. Auto-link attendance data directly to the Payroll calculation engine."*

#### 3. Automated WhatsApp Billing & Slip Dispatch
> *"Implement a Twilio / WhatsApp Business API integration module that automatically dispatches PDF Settlement Slips to offboarded workers, digital onboarding links to new candidates, and monthly Tax Invoices to Tata Motors procurement managers upon status change."*

#### 4. Multi-Client / Multi-Tenant Scaling
> *"Expand the single-client architecture (currently Tata Motors Ltd.) to support multi-client operations. Update the Quotation, PO, and Invoice modules to allow selecting from multiple enterprise clients (e.g., Mahindra & Mahindra, Bajaj Auto, Bharat Forge) with client-specific GST rules and billing cycles."*

#### 5. Predictive AI Worker Allocation Engine
> *"Propose an AI module that analyzes historical PO requirements and worker skill levels to automatically recommend the optimal team composition for incoming Purchase Orders, maximizing contract profit margin while satisfying skill mix constraints."*

---
*Document Version: 2.0 (Production High-Contrast Light Theme Specification)*  
*Maintained by: Sonali Enterprises Technical Architecture Team*
