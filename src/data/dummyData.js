// ============================================================
// SONALI ENTERPRISES — DUMMY DATA (Realistic Indian Context)
// ============================================================

export const COMPANY = {
  name: "Sonali Enterprises",
  address: "Chinchwad Highway Road, Pune, Maharashtra - 411019",
  phone: "+91 98765 43210",
  email: "info@sonalienterprises.in",
  gst: "27ABCDE1234F1Z5",
  pan: "ABCDE1234F",
  client: "Tata Motors Ltd.",
  clientAddress: "MIDC, Pimpri, Pune, Maharashtra - 411018",
};

export const WORKERS = [
  { id: "SE-001", name: "Rajesh Kumar Sharma", phone: "9823401122", skill: "Welding", dailyWage: 750, status: "Active", joiningDate: "2023-03-15", daysWorked: 24, department: "Assembly" },
  { id: "SE-002", name: "Suresh Pandurang Jadhav", phone: "9765432100", skill: "Fitter", dailyWage: 700, status: "Active", joiningDate: "2023-05-01", daysWorked: 26, department: "Fabrication" },
  { id: "SE-003", name: "Mahesh Vitthal Kale", phone: "9812345678", skill: "Electrician", dailyWage: 800, status: "Active", joiningDate: "2022-11-10", daysWorked: 22, department: "Electrical" },
  { id: "SE-004", name: "Vinod Ramesh Patil", phone: "9900112233", skill: "Helper", dailyWage: 550, status: "Active", joiningDate: "2024-01-05", daysWorked: 25, department: "General" },
  { id: "SE-005", name: "Santosh Dnyandev More", phone: "9876123456", skill: "Painter", dailyWage: 650, status: "Active", joiningDate: "2023-07-20", daysWorked: 20, department: "Finishing" },
  { id: "SE-006", name: "Anil Baburao Gaikwad", phone: "9654321789", skill: "CNC Operator", dailyWage: 950, status: "Active", joiningDate: "2022-08-15", daysWorked: 26, department: "Machining" },
  { id: "SE-007", name: "Prakash Shankar Bhosale", phone: "9988776655", skill: "Welder", dailyWage: 750, status: "Inactive", joiningDate: "2023-02-28", daysWorked: 0, department: "Assembly" },
  { id: "SE-008", name: "Dinesh Narayan Shinde", phone: "9123456780", skill: "Turner", dailyWage: 700, status: "Active", joiningDate: "2023-09-10", daysWorked: 24, department: "Machining" },
  { id: "SE-009", name: "Amol Ramchandra Deshmukh", phone: "9765001122", skill: "Forklift Operator", dailyWage: 850, status: "Active", joiningDate: "2023-11-01", daysWorked: 22, department: "Logistics" },
  { id: "SE-010", name: "Ganesh Maruti Waghmare", phone: "9800234567", skill: "Quality Inspector", dailyWage: 900, status: "Active", joiningDate: "2022-06-01", daysWorked: 26, department: "Quality" },
];

export const QUOTATIONS = [
  {
    id: "QT-2025-001",
    date: "2025-09-01",
    client: "Tata Motors Ltd.",
    description: "Supply of skilled welders and fitters for chassis assembly line at MIDC, Pimpri plant",
    workers: 8,
    duration: 30,
    ratePerWorkerPerDay: 750,
    total: 8 * 30 * 750,
    status: "Approved",
    notes: "Includes safety gear and PPE"
  },
  {
    id: "QT-2025-002",
    date: "2025-09-10",
    client: "Tata Motors Ltd.",
    description: "Provision of electricians and CNC operators for new production line setup",
    workers: 5,
    duration: 45,
    ratePerWorkerPerDay: 875,
    total: 5 * 45 * 875,
    status: "Sent",
    notes: "Includes overtime clause at 1.5x rate"
  },
  {
    id: "QT-2025-003",
    date: "2025-09-20",
    client: "Tata Motors Ltd.",
    description: "General helpers and material handling workers for paint shop operations",
    workers: 12,
    duration: 20,
    ratePerWorkerPerDay: 575,
    total: 12 * 20 * 575,
    status: "Draft",
    notes: "Seasonal requirement during Diwali rush period"
  },
];

export const PURCHASE_ORDERS = [
  {
    id: "PO-TM-2025-078",
    date: "2025-09-02",
    workType: "Chassis Assembly Line Support — Welding & Fitting",
    workersRequired: 8,
    duration: 30,
    value: 180000,
    status: "In Progress",
    linkedQuotation: "QT-2025-001",
    workers: ["SE-001", "SE-002", "SE-003", "SE-004", "SE-005", "SE-006", "SE-008", "SE-010"],
    startDate: "2025-09-05",
    endDate: "2025-10-05",
    contactPerson: "Mr. Ramesh Mehta, GM Operations"
  },
  {
    id: "PO-TM-2025-055",
    date: "2025-08-01",
    workType: "Paint Shop Material Handling",
    workersRequired: 6,
    duration: 25,
    value: 82500,
    status: "Completed",
    linkedQuotation: null,
    workers: ["SE-004", "SE-005", "SE-007", "SE-009"],
    startDate: "2025-08-05",
    endDate: "2025-08-30",
    contactPerson: "Mr. Sunil Verma, Plant Manager"
  },
  {
    id: "PO-TM-2025-062",
    date: "2025-08-15",
    workType: "Engine Assembly Plant — CNC & Machining Support",
    workersRequired: 4,
    duration: 20,
    value: 76000,
    status: "Open",
    linkedQuotation: "QT-2025-002",
    workers: ["SE-006", "SE-008"],
    startDate: "2025-10-01",
    endDate: "2025-10-21",
    contactPerson: "Mr. Ashok Kulkarni, Production Head"
  },
];

export const INVOICES = [
  {
    id: "INV-SE-2025-001",
    date: "2025-08-31",
    po: "PO-TM-2025-055",
    billTo: "Tata Motors Ltd.",
    billToAddress: "MIDC, Pimpri, Pune - 411018",
    description: "Paint Shop Material Handling — 6 workers × 25 days",
    workerCount: 6,
    daysWorked: 25,
    ratePerDay: 550,
    subtotal: 6 * 25 * 550,
    gst: 6 * 25 * 550 * 0.18,
    grandTotal: 6 * 25 * 550 * 1.18,
    status: "Paid",
    paidDate: "2025-09-10",
    dueDate: "2025-09-15"
  },
  {
    id: "INV-SE-2025-002",
    date: "2025-09-15",
    po: "PO-TM-2025-078",
    billTo: "Tata Motors Ltd.",
    billToAddress: "MIDC, Pimpri, Pune - 411018",
    description: "Chassis Assembly Line Support — 8 workers × 30 days (Welding & Fitting)",
    workerCount: 8,
    daysWorked: 30,
    ratePerDay: 750,
    subtotal: 8 * 30 * 750,
    gst: 8 * 30 * 750 * 0.18,
    grandTotal: 8 * 30 * 750 * 1.18,
    status: "Pending",
    paidDate: null,
    dueDate: "2025-09-30"
  },
  {
    id: "INV-SE-2025-003",
    date: "2025-07-31",
    po: null,
    billTo: "Tata Motors Ltd.",
    billToAddress: "MIDC, Pimpri, Pune - 411018",
    description: "Electrical Maintenance Team — 3 workers × 22 days",
    workerCount: 3,
    daysWorked: 22,
    ratePerDay: 825,
    subtotal: 3 * 22 * 825,
    gst: 3 * 22 * 825 * 0.18,
    grandTotal: 3 * 22 * 825 * 1.18,
    status: "Overdue",
    paidDate: null,
    dueDate: "2025-08-15"
  },
];

export const PAYROLL = [
  { workerId: "SE-001", daysWorked: 24, dailyWage: 750, grossPay: 24 * 750, pf: 24 * 750 * 0.12, esic: 24 * 750 * 0.0075, netPay: 24 * 750 * (1 - 0.12 - 0.0075), status: "Paid" },
  { workerId: "SE-002", daysWorked: 26, dailyWage: 700, grossPay: 26 * 700, pf: 26 * 700 * 0.12, esic: 26 * 700 * 0.0075, netPay: 26 * 700 * (1 - 0.12 - 0.0075), status: "Paid" },
  { workerId: "SE-003", daysWorked: 22, dailyWage: 800, grossPay: 22 * 800, pf: 22 * 800 * 0.12, esic: 22 * 800 * 0.0075, netPay: 22 * 800 * (1 - 0.12 - 0.0075), status: "Pending" },
  { workerId: "SE-004", daysWorked: 25, dailyWage: 550, grossPay: 25 * 550, pf: 25 * 550 * 0.12, esic: 25 * 550 * 0.0075, netPay: 25 * 550 * (1 - 0.12 - 0.0075), status: "Pending" },
  { workerId: "SE-005", daysWorked: 20, dailyWage: 650, grossPay: 20 * 650, pf: 20 * 650 * 0.12, esic: 20 * 650 * 0.0075, netPay: 20 * 650 * (1 - 0.12 - 0.0075), status: "Paid" },
  { workerId: "SE-006", daysWorked: 26, dailyWage: 950, grossPay: 26 * 950, pf: 26 * 950 * 0.12, esic: 26 * 950 * 0.0075, netPay: 26 * 950 * (1 - 0.12 - 0.0075), status: "Pending" },
  { workerId: "SE-008", daysWorked: 24, dailyWage: 700, grossPay: 24 * 700, pf: 24 * 700 * 0.12, esic: 24 * 700 * 0.0075, netPay: 24 * 700 * (1 - 0.12 - 0.0075), status: "Pending" },
  { workerId: "SE-009", daysWorked: 22, dailyWage: 850, grossPay: 22 * 850, pf: 22 * 850 * 0.12, esic: 22 * 850 * 0.0075, netPay: 22 * 850 * (1 - 0.12 - 0.0075), status: "Pending" },
  { workerId: "SE-010", daysWorked: 26, dailyWage: 900, grossPay: 26 * 900, pf: 26 * 900 * 0.12, esic: 26 * 900 * 0.0075, netPay: 26 * 900 * (1 - 0.12 - 0.0075), status: "Paid" },
];

export const PL_HISTORY = [
  {
    month: "July 2025",
    revenue: 162855,
    workerWages: 108900,
    otherExpenses: 12000,
    netProfit: 162855 - 108900 - 12000,
    invoiceCount: 2,
    workerCount: 8
  },
  {
    month: "August 2025",
    revenue: 248850,
    workerWages: 156400,
    otherExpenses: 15000,
    netProfit: 248850 - 156400 - 15000,
    invoiceCount: 3,
    workerCount: 10
  },
  {
    month: "September 2025",
    revenue: 338040,
    workerWages: 214200,
    otherExpenses: 18000,
    netProfit: 338040 - 214200 - 18000,
    invoiceCount: 2,
    workerCount: 9
  }
];

export const ONBOARDING = [
  {
    id: "ONB-2025-001",
    name: "Vikram Ramesh More",
    phone: "9890123456",
    address: "Plot 42, Sector 10, Bhosari, Pune - 411026",
    dob: "1996-05-14",
    gender: "Male",
    emergencyName: "Ramesh More (Father)",
    emergencyPhone: "9890001122",
    skill: "Welding",
    expectedWage: 750,
    department: "Assembly",
    currentStep: 2, // Document Collection
    status: "In Progress",
    daysStarted: 3,
    startDate: "2025-09-02",
    documents: {
      aadhaar: "Uploaded",
      pan: "Uploaded",
      photo: "Uploaded",
      passbook: "Pending",
      experience: "Pending",
    },
    medical: {
      date: "2025-09-06",
      center: "Apex Occupational Health Center, Chinchwad",
      result: "Pending",
      remarks: "Scheduled for Saturday morning",
    },
    police: {
      submittedDate: "2025-09-03",
      refNo: "PUN-POL-2025-8841",
      status: "Pending",
    }
  },
  {
    id: "ONB-2025-002",
    name: "Pravin Tukaram Shinde",
    phone: "9766554433",
    address: "Flat 201, Shanti Nagar, Akurdi, Pune - 411035",
    dob: "1994-11-20",
    gender: "Male",
    emergencyName: "Sunita Shinde (Wife)",
    emergencyPhone: "9766554400",
    skill: "Electrician",
    expectedWage: 800,
    department: "Electrical",
    currentStep: 3, // Medical Verification
    status: "Blocked",
    daysStarted: 5,
    startDate: "2025-08-31",
    documents: {
      aadhaar: "Verified",
      pan: "Verified",
      photo: "Verified",
      passbook: "Verified",
      experience: "Verified",
    },
    medical: {
      date: "2025-09-03",
      center: "Lifepoint Multispecialty Hospital, Wakad",
      result: "Unfit",
      remarks: "BP 165/105 mmHg detected. Re-examination recommended after medication.",
    },
    police: {
      submittedDate: "2025-09-01",
      refNo: "PUN-POL-2025-7712",
      status: "Cleared",
    }
  },
  {
    id: "ONB-2025-003",
    name: "Rahul Devendra Thorat",
    phone: "9922334455",
    address: "Near Water Tank, Nigdi Pradhikaran, Pune - 411044",
    dob: "1998-02-08",
    gender: "Male",
    emergencyName: "Devendra Thorat (Father)",
    emergencyPhone: "9922334400",
    skill: "Fitter",
    expectedWage: 700,
    department: "Fabrication",
    currentStep: 5, // Final Review & Activation
    status: "Completed",
    daysStarted: 7,
    startDate: "2025-08-29",
    documents: {
      aadhaar: "Verified",
      pan: "Verified",
      photo: "Verified",
      passbook: "Verified",
      experience: "Verified",
    },
    medical: {
      date: "2025-09-01",
      center: "Apex Occupational Health Center, Chinchwad",
      result: "Fit",
      remarks: "Physically fit for industrial workshop activities.",
    },
    police: {
      submittedDate: "2025-08-30",
      refNo: "PUN-POL-2025-6610",
      status: "Cleared",
    }
  }
];

export const OFFBOARDING = [
  {
    id: "OFF-2025-001",
    workerId: "SE-007",
    workerName: "Prakash Shankar Bhosale",
    skill: "Welder",
    department: "Assembly",
    joiningDate: "2023-02-28",
    exitType: "Contract End",
    lastDate: "2025-08-30",
    reason: "Completion of 6-month chassis welding contract project",
    daysWorked: 26,
    dailyWage: 750,
    pendingWages: 19500,
    advanceDeductions: 0,
    netSettlement: 19500,
    settlementStatus: "Paid",
    completionStatus: "Completed",
    clearance: {
      idCard: true,
      uniform: true,
      noDues: true,
      exitInterview: true,
    }
  },
  {
    id: "OFF-2025-002",
    workerId: "SE-005",
    workerName: "Santosh Dnyandev More",
    skill: "Painter",
    department: "Finishing",
    joiningDate: "2023-07-20",
    exitType: "Resignation",
    lastDate: "2025-09-15",
    reason: "Moving back to hometown in Satara due to personal reasons",
    daysWorked: 20,
    dailyWage: 650,
    pendingWages: 13000,
    advanceDeductions: 2000,
    netSettlement: 11000,
    settlementStatus: "Pending",
    completionStatus: "In Progress",
    clearance: {
      idCard: true,
      uniform: true,
      noDues: false,
      exitInterview: true,
    }
  }
];

export const ACTIVITY_FEED = [
  { id: 1, type: "invoice", text: "Invoice INV-SE-2025-002 raised for ₹2,12,400", time: "2 hours ago", icon: "📄" },
  { id: 2, type: "payment", text: "Payment received for INV-SE-2025-001 — ₹96,030", time: "1 day ago", icon: "💰" },
  { id: 3, type: "po", text: "New PO received: PO-TM-2025-078 from Tata Motors", time: "2 days ago", icon: "📋" },
  { id: 4, type: "worker", text: "Amol Deshmukh (SE-009) marked attendance for 22 days", time: "3 days ago", icon: "👷" },
  { id: 5, type: "quotation", text: "Quotation QT-2025-001 approved by Tata Motors", time: "4 days ago", icon: "✅" },
];

export const REVENUE_CHART = [
  { month: "Apr", value: 120000 },
  { month: "May", value: 195000 },
  { month: "Jun", value: 145000 },
  { month: "Jul", value: 162855 },
  { month: "Aug", value: 248850 },
  { month: "Sep", value: 338040 },
];
