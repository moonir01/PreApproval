// Demo data for NCCAIMS prototype

export interface Wing {
  id: string
  name: string
  code: string
  description: string
  createdAt: string
}

export interface Warehouse {
  id: string
  wingId: string
  name: string
  location: string
  capacity: number
  assignedManager: string
  contactEmail: string
  contactPhone: string
  notes: string
}

export interface Employee {
  id: string
  employeeCode: string
  fullName: string
  designation: string
  wingId: string
  warehouseId?: string
  email: string
  phone: string
  role: string
  status: "active" | "inactive"
}

export interface Item {
  id: string
  code: string
  name: string
  category: string
  uom: string
  defaultRate: number
  currentStock: number
  reorderLevel: number
  warehouseId: string
}

export interface Asset {
  id: string
  assetCode: string
  assetName: string
  registerDate: string
  identifiedBy: string
  lifeTime: number
  warrantyStart: string
  warrantyEnd: string
  brand: string
  bookValue: number
  totalDepreciation: number
  status: "In use" | "In repair" | "Disposed" | "Transferred"
  division: string
  category: string
  subCategory: string
  minorCategory: string
  quantity: number
}

export interface PreApproval {
  id: string
  preApprovalId: string
  wingId: string
  warehouseId: string
  requestedBy: string
  requestDate: string
  items: {
    itemId: string
    itemName: string
    description?: string
    uom?: string
    currentStock?: number
    quantity: number
    rate: number
    total: number
    remarks?: string
  }[]
  totalAmount: number
  status: "Draft" | "Pending" | "Approved" | "Rejected" | "Sent Back"
  currentStage: number
  workflowHistory: WorkflowAction[]
}

export interface Notesheet {
  id: string
  notesheetId: string
  preApprovalId: string
  wingId: string
  warehouseId: string
  initiatedBy: string
  initiatedDate: string
  status: "Draft" | "Pending" | "Approved" | "Rejected" | "Sent Back"
  currentStage: number
  workflowHistory: WorkflowAction[]
}

export interface WorkflowAction {
  stageId: number
  stageName: string
  actorId: string
  actorName: string
  action: "Recommend" | "Approve" | "Send Back" | "Reject"
  notes: string
  timestamp: string
}

export interface WorkflowStage {
  id: number
  name: string
  workflowType: "preapproval" | "notesheet"
  assignedEmployees: string[]
  assignedDesignations: string[]
  approvalMode: "sequential" | "parallel"
  order: number
  requiresAccountsReview: boolean
  accountsOfficers: string[]
  requiresMaintenanceReview: boolean // New field for maintenance review
  maintenanceOfficers: string[] // Maintenance officers for this stage
  requiresCentralAccountsReview: boolean // New field for central accounts review
  centralAccountsOfficers: string[] // Central accounts officers for this stage
}

export interface PurchaseOrder {
  id: string
  purchaseOrderId: string
  notesheetId: string
  preApprovalId: string
  wingId: string
  warehouseId: string
  createdBy: string
  createdDate: string
  items: {
    itemId: string
    itemName: string
    quantity: number
    rate: number
    total: number
  }[]
  totalAmount: number
  status: "Draft" | "Issued" | "Received" | "Cancelled"
  notes: string
}

// Demo Wings
export const demoWings: Wing[] = [
  {
    id: "wing-1",
    name: "Admin Wing",
    code: "ADM",
    description: "Administrative Wing - Handles administrative operations",
    createdAt: "2024-01-15",
  },
  {
    id: "wing-2",
    name: "Training Wing",
    code: "TRN",
    description: "Training Wing - Manages training programs and facilities",
    createdAt: "2024-01-15",
  },
  {
    id: "wing-3",
    name: "Cadet Battalion",
    code: "CAD",
    description: "Cadet Battalion - Oversees cadet operations",
    createdAt: "2024-02-01",
  },
  {
    id: "wing-4",
    name: "Academic Wing",
    code: "ACD",
    description: "Academic Wing - Manages academic activities",
    createdAt: "2024-02-10",
  },
  {
    id: "wing-5",
    name: "Engineering Wing",
    code: "ENG",
    description: "Engineering Wing - Handles engineering and maintenance",
    createdAt: "2024-02-15",
  },
  {
    id: "wing-6",
    name: "Medical Wing",
    code: "MED",
    description: "Medical Wing - Healthcare and medical facilities",
    createdAt: "2024-03-01",
  },
  {
    id: "wing-7",
    name: "Sports Wing",
    code: "SPT",
    description: "Sports Wing - Athletic programs and sports facilities",
    createdAt: "2024-03-10",
  },
  {
    id: "wing-8",
    name: "IT & Communications Wing",
    code: "ITC",
    description: "IT & Communications - Technology infrastructure",
    createdAt: "2024-03-10",
  },
  {
    id: "wing-9",
    name: "Logistics Wing",
    code: "LOG",
    description: "Logistics Wing - Supply chain and logistics management",
    createdAt: "2024-03-10",
  },
  {
    id: "wing-10",
    name: "Security Wing",
    code: "SEC",
    description: "Security Wing - Security and surveillance operations",
    createdAt: "2024-03-10",
  },
]

// Demo Warehouses
export const demoWarehouses: Warehouse[] = [
  {
    id: "wh-1",
    wingId: "wing-1",
    name: "BQMS Store",
    location: "Admin Wing - BQMS Building",
    capacity: 8000,
    assignedManager: "emp-5",
    contactEmail: "bqms.store@academy.mil",
    contactPhone: "+1-234-567-8901",
    notes: "Battalion Quarter Master Store - Admin Wing",
  },
  {
    id: "wh-2",
    wingId: "wing-2",
    name: "MT Store",
    location: "Training Wing - Motor Transport",
    capacity: 12000,
    assignedManager: "emp-6",
    contactEmail: "mt.store@academy.mil",
    contactPhone: "+1-234-567-8902",
    notes: "Motor Transport Store - Training Wing",
  },
  {
    id: "wh-3",
    wingId: "wing-2",
    name: "RP Store",
    location: "Training Wing - Range Practice",
    capacity: 5000,
    assignedManager: "emp-7",
    contactEmail: "rp.store@academy.mil",
    contactPhone: "+1-234-567-8903",
    notes: "Range Practice Store - Training Wing",
  },
  {
    id: "wh-4",
    wingId: "wing-1",
    name: "BSM Store",
    location: "Admin Wing - Battalion Store",
    capacity: 6000,
    assignedManager: "emp-8",
    contactEmail: "bsm.store@academy.mil",
    contactPhone: "+1-234-567-8904",
    notes: "Battalion Store Manager - Admin Wing",
  },
  {
    id: "wh-5",
    wingId: "wing-6",
    name: "CMH",
    location: "Medical Wing - Combined Military Hospital",
    capacity: 10000,
    assignedManager: "emp-10",
    contactEmail: "cmh.store@academy.mil",
    contactPhone: "+1-234-567-8905",
    notes: "Combined Military Hospital Store",
  },
  {
    id: "wh-6",
    wingId: "wing-7",
    name: "TSC-1&2",
    location: "Sports Wing - Training Support Center 1 & 2",
    capacity: 7000,
    assignedManager: "emp-11",
    contactEmail: "tsc.store@academy.mil",
    contactPhone: "+1-234-567-8906",
    notes: "Training Support Center Store 1 & 2",
  },
  {
    id: "wh-7",
    wingId: "wing-5",
    name: "PCAT",
    location: "Engineering Wing - Pre-Commissioning Academic Training",
    capacity: 5500,
    assignedManager: "emp-12",
    contactEmail: "pcat.store@academy.mil",
    contactPhone: "+1-234-567-8907",
    notes: "PCAT Engineering Store",
  },
  {
    id: "wh-8",
    wingId: "wing-5",
    name: "Engg Faculty",
    location: "Engineering Wing - Faculty Building",
    capacity: 4000,
    assignedManager: "emp-13",
    contactEmail: "engg.faculty@academy.mil",
    contactPhone: "+1-234-567-8908",
    notes: "Engineering Faculty Store",
  },
  {
    id: "wh-9",
    wingId: "wing-4",
    name: "Aca WG",
    location: "Academic Wing - Main Academic Building",
    capacity: 6500,
    assignedManager: "emp-14",
    contactEmail: "aca.wg@academy.mil",
    contactPhone: "+1-234-567-8909",
    notes: "Academic Wing Store",
  },
  {
    id: "wh-10",
    wingId: "wing-3",
    name: "Cdt BN",
    location: "Cadet Battalion - Barracks",
    capacity: 8000,
    assignedManager: "emp-15",
    contactEmail: "cdt.bn@academy.mil",
    contactPhone: "+1-234-567-8910",
    notes: "Cadet Battalion Store",
  },
  {
    id: "wh-11",
    wingId: "wing-2",
    name: "Trg WG",
    location: "Training Wing - Main Training Complex",
    capacity: 9000,
    assignedManager: "emp-3",
    contactEmail: "trg.wg@academy.mil",
    contactPhone: "+1-234-567-8911",
    notes: "Training Wing Central Store",
  },
  {
    id: "wh-12",
    wingId: "wing-4",
    name: "AcaHQ",
    location: "Academic Wing - Headquarters",
    capacity: 3500,
    assignedManager: "emp-4",
    contactEmail: "aca.hq@academy.mil",
    contactPhone: "+1-234-567-8912",
    notes: "Academic Headquarters Store",
  },
]

// Demo Employees
export const demoEmployees: Employee[] = [
  {
    id: "emp-1",
    employeeCode: "EMP001",
    fullName: "Col. James Anderson",
    designation: "Commander",
    wingId: "wing-1",
    email: "j.anderson@academy.mil",
    phone: "+1-234-567-0001",
    role: "Commander",
    status: "active",
  },
  {
    id: "emp-2",
    employeeCode: "EMP002",
    fullName: "Lt. Col. Sarah Mitchell",
    designation: "Deputy Commander",
    wingId: "wing-1",
    email: "s.mitchell@academy.mil",
    phone: "+1-234-567-0002",
    role: "Deputy Commander",
    status: "active",
  },
  {
    id: "emp-3",
    employeeCode: "EMP003",
    fullName: "Maj. Robert Chen",
    designation: "Wing Head",
    wingId: "wing-2",
    email: "r.chen@academy.mil",
    phone: "+1-234-567-0003",
    role: "Wing Head",
    status: "active",
  },
  {
    id: "emp-4",
    employeeCode: "EMP004",
    fullName: "Capt. Emily Rodriguez",
    designation: "Dept Head",
    wingId: "wing-4",
    email: "e.rodriguez@academy.mil",
    phone: "+1-234-567-0004",
    role: "Department Head",
    status: "active",
  },
  {
    id: "emp-5",
    employeeCode: "EMP005",
    fullName: "Mr. David Thompson",
    designation: "Principal Staff",
    wingId: "wing-1",
    warehouseId: "wh-1",
    email: "d.thompson@academy.mil",
    phone: "+1-234-567-0005",
    role: "Staff",
    status: "active",
  },
  {
    id: "emp-6",
    employeeCode: "EMP006",
    fullName: "Ms. Maria Garcia",
    designation: "Maintenance Officer",
    wingId: "wing-2",
    warehouseId: "wh-2",
    email: "m.garcia@academy.mil",
    phone: "+1-234-567-0006",
    role: "Maintenance Officer",
    status: "active",
  },
  {
    id: "emp-7",
    employeeCode: "EMP007",
    fullName: "Mr. John Williams",
    designation: "Principal Staff",
    wingId: "wing-4",
    warehouseId: "wh-3",
    email: "j.williams@academy.mil",
    phone: "+1-234-567-0007",
    role: "Staff",
    status: "active",
  },
  {
    id: "emp-8",
    employeeCode: "EMP008",
    fullName: "Eng. Lisa Kumar",
    designation: "Maintenance Officer",
    wingId: "wing-5",
    warehouseId: "wh-4",
    email: "l.kumar@academy.mil",
    phone: "+1-234-567-0008",
    role: "Maintenance Officer",
    status: "active",
  },
  {
    id: "emp-9",
    employeeCode: "EMP009",
    fullName: "Mr. Ahmed Hassan",
    designation: "Accounts Officer",
    wingId: "wing-1",
    email: "a.hassan@academy.mil",
    phone: "+1-234-567-0009",
    role: "Accounts Officer",
    status: "active",
  },
  {
    id: "emp-10",
    employeeCode: "EMP010",
    fullName: "Dr. Patricia Lee",
    designation: "Wing Head",
    wingId: "wing-6",
    warehouseId: "wh-5",
    email: "p.lee@academy.mil",
    phone: "+1-234-567-0010",
    role: "Wing Head",
    status: "active",
  },
  {
    id: "emp-11",
    employeeCode: "EMP011",
    fullName: "Col. Kumar Rajesh",
    designation: "Wing Head",
    wingId: "wing-3",
    email: "k.rajesh@academy.mil",
    phone: "+1-234-567-0011",
    role: "Wing Head",
    status: "active",
  },
  {
    id: "emp-12",
    employeeCode: "EMP012",
    fullName: "Maj. Li Wei",
    designation: "Dept Head",
    wingId: "wing-2",
    warehouseId: "wh-6",
    email: "l.wei@academy.mil",
    phone: "+1-234-567-0012",
    role: "Department Head",
    status: "active",
  },
  {
    id: "emp-13",
    employeeCode: "EMP013",
    fullName: "Capt. Nguyen Thi Mai",
    designation: "Maintenance Officer",
    wingId: "wing-4",
    warehouseId: "wh-7",
    email: "n.mai@academy.mil",
    phone: "+1-234-567-0013",
    role: "Maintenance Officer",
    status: "active",
  },
  {
    id: "emp-14",
    employeeCode: "EMP014",
    fullName: "Lt. Col. Park Jin-Soo",
    designation: "Deputy Commander",
    wingId: "wing-5",
    email: "p.jinsoo@academy.mil",
    phone: "+1-234-567-0014",
    role: "Deputy Commander",
    status: "active",
  },
  {
    id: "emp-15",
    employeeCode: "EMP015",
    fullName: "Col. Staff Tanaka Hiroshi",
    designation: "Principal Staff",
    wingId: "wing-1",
    warehouseId: "wh-8",
    email: "t.hiroshi@academy.mil",
    phone: "+1-234-567-0015",
    role: "Staff",
    status: "active",
  },
  {
    id: "emp-16",
    employeeCode: "EMP016",
    fullName: "Maj. Ahmad Farhan",
    designation: "Wing Head",
    wingId: "wing-7",
    warehouseId: "wh-9",
    email: "a.farhan@academy.mil",
    phone: "+1-234-567-0016",
    role: "Wing Head",
    status: "active",
  },
  {
    id: "emp-17",
    employeeCode: "EMP017",
    fullName: "Capt. Sharma Priya",
    designation: "Accounts Officer",
    wingId: "wing-3",
    email: "s.priya@academy.mil",
    phone: "+1-234-567-0017",
    role: "Accounts Officer",
    status: "active",
  },
  {
    id: "emp-18",
    employeeCode: "EMP018",
    fullName: "Col. Chen Xiaoming",
    designation: "Commander",
    wingId: "wing-6",
    email: "c.xiaoming@academy.mil",
    phone: "+1-234-567-0018",
    role: "Commander",
    status: "active",
  },
  {
    id: "emp-19",
    employeeCode: "EMP019",
    fullName: "Maj. Saidur Rahman",
    designation: "Major",
    wingId: "wing-8",
    warehouseId: "wh-10",
    email: "b.soojin@academy.mil",
    phone: "+1-234-567-0019",
    role: "Department Head",
    status: "active",
  },
  {
    id: "emp-20",
    employeeCode: "EMP020",
    fullName: "Capt. Kader Hossain",
    designation: "Captain",
    wingId: "wing-4",
    warehouseId: "wh-11",
    email: "s.arjun@academy.mil",
    phone: "+1-234-567-0020",
    role: "Maintenance Officer",
    status: "active",
  },
]

// Demo Items
export const demoItems: Item[] = [
  {
    id: "item-1",
    code: "OFF-001",
    name: "A4 Paper Ream",
    category: "Office Supplies",
    uom: "Ream",
    defaultRate: 5.5,
    currentStock: 250,
    reorderLevel: 50,
    warehouseId: "wh-1",
  },
  {
    id: "item-2",
    code: "EQP-001",
    name: "Desktop Computer",
    category: "Equipment",
    uom: "Unit",
    defaultRate: 1200.0,
    currentStock: 15,
    reorderLevel: 5,
    warehouseId: "wh-1",
  },
  {
    id: "item-3",
    code: "EQP-002",
    name: "Laptop Computer",
    category: "Equipment",
    uom: "Unit",
    defaultRate: 950.0,
    currentStock: 20,
    reorderLevel: 5,
    warehouseId: "wh-1",
  },
  {
    id: "item-4",
    code: "OFF-002",
    name: "Office Chair",
    category: "Office Supplies",
    uom: "Unit",
    defaultRate: 250.0,
    currentStock: 45,
    reorderLevel: 10,
    warehouseId: "wh-1",
  },
  {
    id: "item-5",
    code: "TRN-001",
    name: "Training Mat",
    category: "Training Equipment",
    uom: "Unit",
    defaultRate: 45.0,
    currentStock: 150,
    reorderLevel: 20,
    warehouseId: "wh-2",
  },
  {
    id: "item-6",
    code: "MED-001",
    name: "First Aid Kit",
    category: "Medical Supplies",
    uom: "Kit",
    defaultRate: 75.0,
    currentStock: 80,
    reorderLevel: 15,
    warehouseId: "wh-5",
  },
  {
    id: "item-7",
    code: "SPT-001",
    name: "Basketball",
    category: "Sports Equipment",
    uom: "Unit",
    defaultRate: 35.0,
    currentStock: 120,
    reorderLevel: 25,
    warehouseId: "wh-6",
  },
  {
    id: "item-8",
    code: "IT-001",
    name: "Network Switch",
    category: "IT Equipment",
    uom: "Unit",
    defaultRate: 450.0,
    currentStock: 12,
    reorderLevel: 3,
    warehouseId: "wh-7",
  },
  {
    id: "item-9",
    code: "UNI-001",
    name: "Cadet Dress Uniform",
    category: "Uniforms",
    uom: "Set",
    defaultRate: 180.0,
    currentStock: 200,
    reorderLevel: 30,
    warehouseId: "wh-10",
  },
  {
    id: "item-10",
    code: "SEC-001",
    name: "CCTV Camera",
    category: "Security Equipment",
    uom: "Unit",
    defaultRate: 280.0,
    currentStock: 35,
    reorderLevel: 5,
    warehouseId: "wh-9",
  },
]

// Demo Assets
export const demoAssets: Asset[] = [
  {
    id: "asset-1",
    assetCode: "GRN-M250900068",
    assetName: "QC Charger",
    registerDate: "2023-01-15",
    identifiedBy: "emp-5",
    lifeTime: 5,
    warrantyStart: "2023-01-15",
    warrantyEnd: "2024-01-15",
    brand: "Anker",
    bookValue: 4000,
    totalDepreciation: 800,
    status: "In use",
    division: "N/A",
    category: "N/A",
    subCategory: "N/A",
    minorCategory: "N/A",
    quantity: 2,
  },
  {
    id: "asset-2",
    assetCode: "GRN-M250800064",
    assetName: "asus monitor",
    registerDate: "2023-03-20",
    identifiedBy: "emp-6",
    lifeTime: 7,
    warrantyStart: "2023-03-20",
    warrantyEnd: "2026-03-20",
    brand: "ASUS",
    bookValue: 600,
    totalDepreciation: 85,
    status: "In use",
    division: "monitor",
    category: "monitor",
    subCategory: "N/A",
    minorCategory: "N/A",
    quantity: 6,
  },
  {
    id: "asset-3",
    assetCode: "GRN-M250800052",
    assetName: "Printer Xp",
    registerDate: "2022-11-10",
    identifiedBy: "emp-7",
    lifeTime: 5,
    warrantyStart: "2022-11-10",
    warrantyEnd: "2024-11-10",
    brand: "Epson",
    bookValue: 10000,
    totalDepreciation: 2400,
    status: "In use",
    division: "N/A",
    category: "N/A",
    subCategory: "N/A",
    minorCategory: "N/A",
    quantity: 10,
  },
]

export const demoWorkflowStages: WorkflowStage[] = [
  // Pre-Approval Workflow
  {
    id: 1,
    name: "Department Head Review",
    workflowType: "preapproval",
    assignedEmployees: ["EMP004", "EMP014"],
    assignedDesignations: ["Dept Head"],
    approvalMode: "sequential",
    order: 1,
    requiresAccountsReview: false,
    accountsOfficers: [],
    requiresMaintenanceReview: false,
    maintenanceOfficers: [],
    requiresCentralAccountsReview: false,
    centralAccountsOfficers: [],
  },
  {
    id: 2,
    name: "Wing Head Approval",
    workflowType: "preapproval",
    assignedEmployees: ["EMP003", "EMP010", "EMP011"],
    assignedDesignations: ["Wing Head"],
    approvalMode: "sequential",
    order: 2,
    requiresAccountsReview: false,
    accountsOfficers: [],
    requiresMaintenanceReview: false,
    maintenanceOfficers: [],
    requiresCentralAccountsReview: false,
    centralAccountsOfficers: [],
  },
  {
    id: 3,
    name: "Principal Staff",
    workflowType: "preapproval",
    assignedEmployees: ["EMP005", "EMP007", "EMP017"],
    assignedDesignations: ["Principal Staff"],
    approvalMode: "sequential",
    order: 3,
    requiresAccountsReview: true,
    accountsOfficers: ["EMP009", "EMP018"],
    requiresMaintenanceReview: true,
    maintenanceOfficers: ["EMP006", "EMP008"],
    requiresCentralAccountsReview: true,
    centralAccountsOfficers: ["EMP009", "EMP018"],
  },
  {
    id: 4,
    name: "Deputy Commander Approval",
    workflowType: "preapproval",
    assignedEmployees: ["EMP015"],
    assignedDesignations: ["Deputy Commander"],
    approvalMode: "sequential",
    order: 4,
    requiresAccountsReview: false,
    accountsOfficers: [],
    requiresMaintenanceReview: false,
    maintenanceOfficers: [],
    requiresCentralAccountsReview: false,
    centralAccountsOfficers: [],
  },
  {
    id: 5,
    name: "Commander Final Approval",
    workflowType: "preapproval",
    assignedEmployees: ["EMP001", "EMP012"],
    assignedDesignations: ["Commander"],
    approvalMode: "sequential",
    order: 5,
    requiresAccountsReview: false,
    accountsOfficers: [],
    requiresMaintenanceReview: false,
    maintenanceOfficers: [],
    requiresCentralAccountsReview: false,
    centralAccountsOfficers: [],
  },
  // Notesheet Workflow
  {
    id: 6,
    name: "Staff Officer Review",
    workflowType: "notesheet",
    assignedEmployees: ["EMP005", "EMP017"],
    assignedDesignations: ["Principal Staff"],
    approvalMode: "sequential",
    order: 1,
    requiresAccountsReview: false,
    accountsOfficers: [],
    requiresMaintenanceReview: false,
    maintenanceOfficers: [],
    requiresCentralAccountsReview: false,
    centralAccountsOfficers: [],
  },
  {
    id: 7,
    name: "Department Head Review",
    workflowType: "notesheet",
    assignedEmployees: ["EMP004", "EMP014"],
    assignedDesignations: ["Dept Head"],
    approvalMode: "sequential",
    order: 2,
    requiresAccountsReview: false,
    accountsOfficers: [],
    requiresMaintenanceReview: false,
    maintenanceOfficers: [],
    requiresCentralAccountsReview: false,
    centralAccountsOfficers: [],
  },
  {
    id: 8,
    name: "Wing Head Recommendation",
    workflowType: "notesheet",
    assignedEmployees: ["EMP003", "EMP010", "EMP011"],
    assignedDesignations: ["Wing Head"],
    approvalMode: "sequential",
    order: 3,
    requiresAccountsReview: false,
    accountsOfficers: [],
    requiresMaintenanceReview: false,
    maintenanceOfficers: [],
    requiresCentralAccountsReview: false,
    centralAccountsOfficers: [],
  },
  {
    id: 9,
    name: "Finance & Accounts Check",
    workflowType: "notesheet",
    assignedEmployees: ["EMP009", "EMP018"],
    assignedDesignations: ["Accounts Officer"],
    approvalMode: "parallel",
    order: 4,
    requiresAccountsReview: true,
    accountsOfficers: ["EMP009", "EMP018"],
    requiresMaintenanceReview: false,
    maintenanceOfficers: [],
    requiresCentralAccountsReview: false,
    centralAccountsOfficers: [],
  },
  {
    id: 10,
    name: "Deputy Commander Approval",
    workflowType: "notesheet",
    assignedEmployees: ["EMP015"],
    assignedDesignations: ["Deputy Commander"],
    approvalMode: "sequential",
    order: 5,
    requiresAccountsReview: false,
    accountsOfficers: [],
    requiresMaintenanceReview: false,
    maintenanceOfficers: [],
    requiresCentralAccountsReview: false,
    centralAccountsOfficers: [],
  },
  {
    id: 11,
    name: "Commander Final Approval",
    workflowType: "notesheet",
    assignedEmployees: ["EMP001", "EMP012"],
    assignedDesignations: ["Commander"],
    approvalMode: "sequential",
    order: 6,
    requiresAccountsReview: false,
    accountsOfficers: [],
    requiresMaintenanceReview: false,
    maintenanceOfficers: [],
    requiresCentralAccountsReview: false,
    centralAccountsOfficers: [],
  },
]

// Demo Pre-Approvals
export const demoPreApprovals: PreApproval[] = [
  {
    id: "pa-1",
    preApprovalId: "PA-2025-001",
    wingId: "wing-4",
    warehouseId: "wh-3",
    requestedBy: "emp-4",
    requestDate: "2025-01-15",
    items: [
      {
        itemId: "item-1",
        itemName: "A4 Paper Ream",
        description: "White A4 paper, 500 sheets per ream",
        uom: "Ream",
        currentStock: 250,
        quantity: 100,
        rate: 5.5,
        total: 550,
        remarks: "Required for academic semester",
      },
      {
        itemId: "item-2",
        itemName: "Desktop Computer",
        description: "Dell OptiPlex 7090, i7, 16GB RAM, 512GB SSD",
        uom: "Unit",
        currentStock: 15,
        quantity: 5,
        rate: 1200,
        total: 6000,
        remarks: "Required for academic semester",
      },
    ],
    totalAmount: 6550,
    status: "Pending",
    currentStage: 2,
    workflowHistory: [
      {
        stageId: 1,
        stageName: "Department Head Review",
        actorId: "emp-4",
        actorName: "Capt. Emily Rodriguez",
        action: "Recommend",
        notes: "Approved - Required for academic semester",
        timestamp: "2025-01-15T10:30:00Z",
      },
    ],
  },
  {
    id: "pa-2",
    preApprovalId: "PA-2025-002",
    wingId: "wing-2",
    warehouseId: "wh-2",
    requestedBy: "emp-3",
    requestDate: "2025-01-20",
    items: [
      {
        itemId: "item-5",
        itemName: "Training Mat",
        description: "Anti-slip training mat, 6ft x 4ft",
        uom: "Unit",
        currentStock: 150,
        quantity: 50,
        rate: 45,
        total: 2250,
        remarks: "Required for upcoming training program",
      },
    ],
    totalAmount: 2250,
    status: "Approved",
    currentStage: 5,
    workflowHistory: [
      {
        stageId: 1,
        stageName: "Department Head Review",
        actorId: "emp-3",
        actorName: "Maj. Robert Chen",
        action: "Recommend",
        notes: "Required for upcoming training program",
        timestamp: "2025-01-20T09:00:00Z",
      },
      {
        stageId: 2,
        stageName: "Wing Head Approval",
        actorId: "emp-3",
        actorName: "Maj. Robert Chen",
        action: "Approve",
        notes: "Approved",
        timestamp: "2025-01-20T14:30:00Z",
      },
      {
        stageId: 3,
        stageName: "Principal Staff",
        actorId: "emp-9",
        actorName: "Mr. Ahmed Hassan",
        action: "Recommend",
        notes: "Budget available",
        timestamp: "2025-01-21T10:00:00Z",
      },
      {
        stageId: 4,
        stageName: "Deputy Commander Approval",
        actorId: "emp-2",
        actorName: "Lt. Col. Sarah Mitchell",
        action: "Approve",
        notes: "Approved",
        timestamp: "2025-01-21T15:00:00Z",
      },
      {
        stageId: 5,
        stageName: "Commander Final Approval",
        actorId: "emp-1",
        actorName: "Col. James Anderson",
        action: "Approve",
        notes: "Final approval granted",
        timestamp: "2025-01-22T11:00:00Z",
      },
    ],
  },
]

// Demo Notesheets
export const demoNotesheets: Notesheet[] = [
  {
    id: "ns-1",
    notesheetId: "NS-2025-001",
    preApprovalId: "PA-2025-002",
    wingId: "wing-2",
    warehouseId: "wh-2",
    initiatedBy: "emp-3",
    initiatedDate: "2025-01-23",
    status: "Pending",
    currentStage: 7,
    workflowHistory: [
      {
        stageId: 6,
        stageName: "Staff Officer Review",
        actorId: "emp-6",
        actorName: "Ms. Maria Garcia",
        action: "Recommend",
        notes: "Documentation complete",
        timestamp: "2025-01-23T09:00:00Z",
      },
    ],
  },
]

export interface AuditLog {
  id: string
  timestamp: string
  userId: string
  userName: string
  action: string
  module: string
  details: string
  ipAddress: string
}

export const demoAuditLogs: AuditLog[] = [
  {
    id: "log-1",
    timestamp: "2025-01-15T10:30:00Z",
    userId: "emp-4",
    userName: "Capt. Emily Rodriguez",
    action: "CREATE",
    module: "Pre-Approval",
    details: "Created Pre-Approval PA-2025-001",
    ipAddress: "192.168.1.45",
  },
  {
    id: "log-2",
    timestamp: "2025-01-15T10:35:00Z",
    userId: "emp-4",
    userName: "Capt. Emily Rodriguez",
    action: "APPROVE",
    module: "Pre-Approval Workflow",
    details: "Recommended Pre-Approval PA-2025-001 at Department Head Review stage",
    ipAddress: "192.168.1.45",
  },
]

// Demo Purchase Orders
export const demoPurchaseOrders: PurchaseOrder[] = [
  {
    id: "po-1",
    purchaseOrderId: "PO-2025-001",
    notesheetId: "NS-2025-001",
    preApprovalId: "PA-2025-002",
    wingId: "wing-2",
    warehouseId: "wh-2",
    createdBy: "emp-3",
    createdDate: "2025-01-24",
    items: [
      {
        itemId: "item-5",
        itemName: "Training Mat",
        quantity: 50,
        rate: 45,
        total: 2250,
      },
    ],
    totalAmount: 2250,
    status: "Issued",
    notes: "Purchase order for approved training equipment",
  },
]

export const workflows = demoWorkflowStages

export interface ApprovalPipeline {
  id: string
  pipelineName: string
  featureName: string
  superApprover: string
  assignedEmployees: string[]
  module: string
  userType: string
  remarks: string
  stages: {
    id: string
    stageName: string
    approvalOrder: string
    approvers: {
      id: string
      userType: string
      businessUnit: string
      approverName: string
      authorizationType: string
    }[]
  }[]
}

export const demoApprovalPipelines: ApprovalPipeline[] = [
  {
    id: "pipeline-1",
    pipelineName: "Pre-Approval Document",
    featureName: "Purchase Requisition",
    superApprover: "EMP001",
    assignedEmployees: ["EMP004", "EMP003", "EMP005", "EMP015", "EMP001"],
    module: "Procurement",
    userType: "user",
    remarks: "Standard procurement approval flow",
    stages: [
      {
        id: "stage-1",
        stageName: "Dept. Head",
        approvalOrder: "any-person",
        approvers: [
          {
            id: "app-1",
            userType: "user",
            businessUnit: "Business Unit 1",
            approverName: "EMP004",
            authorizationType: "approval",
          },
        ],
      },
      {
        id: "stage-2",
        stageName: "Wing Head",
        approvalOrder: "any-person",
        approvers: [
          {
            id: "app-2",
            userType: "user",
            businessUnit: "Business Unit 1",
            approverName: "EMP003",
            authorizationType: "approval",
          },
        ],
      },
      {
        id: "stage-3",
        stageName: "Principal Staff",
        approvalOrder: "any-person",
        approvers: [
          {
            id: "app-3",
            userType: "user",
            businessUnit: "Corporate",
            approverName: "EMP005",
            authorizationType: "approval",
          },
        ],
      },
      {
        id: "stage-4",
        stageName: "Dy Commander",
        approvalOrder: "any-person",
        approvers: [
          {
            id: "app-4",
            userType: "user",
            businessUnit: "Corporate",
            approverName: "EMP015",
            authorizationType: "approval",
          },
        ],
      },
    ],
  },
  {
    id: "pipeline-2",
    pipelineName: "Notesheet Workflow",
    featureName: "Purchase Requisition",
    superApprover: "EMP012",
    assignedEmployees: ["EMP005", "EMP004", "EMP003", "EMP009", "EMP015", "EMP012"],
    module: "Procurement",
    userType: "user",
    remarks: "Notesheet approval process",
    stages: [
      {
        id: "stage-1",
        stageName: "Staff Officer Review",
        approvalOrder: "in-sequence",
        approvers: [
          {
            id: "app-1",
            userType: "user",
            businessUnit: "Business Unit 1",
            approverName: "EMP005",
            authorizationType: "comment-only",
          },
        ],
      },
      {
        id: "stage-2",
        stageName: "Department Head Review",
        approvalOrder: "in-sequence",
        approvers: [
          {
            id: "app-2",
            userType: "user",
            businessUnit: "Business Unit 1",
            approverName: "EMP004",
            authorizationType: "approval",
          },
        ],
      },
      {
        id: "stage-3",
        stageName: "Wing Head Recommendation",
        approvalOrder: "in-sequence",
        approvers: [
          {
            id: "app-3",
            userType: "user",
            businessUnit: "Business Unit 2",
            approverName: "EMP003",
            authorizationType: "approval",
          },
        ],
      },
      {
        id: "stage-4",
        stageName: "Finance & Accounts Check",
        approvalOrder: "any-person",
        approvers: [
          {
            id: "app-4",
            userType: "user",
            businessUnit: "Corporate",
            approverName: "EMP009",
            authorizationType: "approval",
          },
        ],
      },
      {
        id: "stage-5",
        stageName: "Deputy Commander Approval",
        approvalOrder: "in-sequence",
        approvers: [
          {
            id: "app-5",
            userType: "user",
            businessUnit: "Corporate",
            approverName: "EMP015",
            authorizationType: "approval",
          },
        ],
      },
      {
        id: "stage-6",
        stageName: "Commander Final Approval",
        approvalOrder: "in-sequence",
        approvers: [
          {
            id: "app-6",
            userType: "user",
            businessUnit: "Corporate",
            approverName: "EMP012",
            authorizationType: "super-approver",
          },
        ],
      },
    ],
  },
]

// Approval Requisition Interface and Demo Data
export interface ApprovalPreApproval {
  id: string
  preApprovalNo: string
  wing: string
  requestedBy: string
  date: string
  items: number
  totalAmount: number
  status: string
  warehouse: string
  workflowType:
    | "preapproval"
    | "notesheet"
    | "purchase-order"
    | "purchase-receive"
    | "inventory-issue"
    | "inventory-receive"
    | "inventory-transfer"
  currentStage: number
  currentStageId: number
  approvalHistory: Array<{
    stageId: number
    stageName: string
    action: "Approved" | "Recommended" | "Rejected" | "Reviewed"
    approvedBy: string
    approvedAt: string
    comments?: string
  }>
  pendingReviews?: Array<{
    reviewType: "Account" | "Maintenance" | "Central Accounts"
    reviewerId: string
    reviewerName: string
    sentBy: string
    sentAt: string
    stageId: number
    stageName: string
  }>
  reviewComments?: Array<{
    reviewType: "Account" | "Maintenance" | "Central Accounts"
    reviewerId: string
    reviewerName: string
    comment: string
    submittedAt: string
    stageId: number
    stageName: string
  }>
  itemDetails: Array<{
    code: string
    item: string
    uom: string
    lastPrice: number
    stock: number
    reqQty: number
    rate: number
    total: number
  }>
  budgetSummary: {
    allocated: number
    utilized: number
    remaining: number
  }
}

export const demoApprovalPreApprovals: ApprovalPreApproval[] = [
  {
    id: "PA-ADM-2024-001",
    preApprovalNo: "PA-ADM-2024-001",
    wing: "Admin Wing",
    requestedBy: "Current User",
    date: "09/12/2025",
    items: 2,
    totalAmount: 25000.0,
    status: "Pending",
    warehouse: "Central Warehouse",
    workflowType: "preapproval",
    currentStage: 1,
    currentStageId: 1,
    approvalHistory: [],
    itemDetails: [
      {
        code: "ITM-001",
        item: "Office Chair",
        uom: "Nos",
        lastPrice: 480.0,
        stock: 15,
        reqQty: 20,
        rate: 500.0,
        total: 10000.0,
      },
      {
        code: "ITM-002",
        item: "Office Desk",
        uom: "Nos",
        lastPrice: 1450.0,
        stock: 5,
        reqQty: 10,
        rate: 1500.0,
        total: 15000.0,
      },
    ],
    budgetSummary: {
      allocated: 5000000.0,
      utilized: 1250000.0,
      remaining: 3750000.0,
    },
  },
  {
    id: "PA-ADM-2024-002",
    preApprovalNo: "PA-ADM-2024-002",
    wing: "Admin Wing",
    requestedBy: "Current User",
    date: "10/12/2025",
    items: 1,
    totalAmount: 5000.0,
    status: "Pending",
    warehouse: "Central Warehouse",
    workflowType: "preapproval",
    currentStage: 1,
    currentStageId: 1,
    approvalHistory: [],
    itemDetails: [
      {
        code: "ITM-003",
        item: "Printer Toner",
        uom: "Nos",
        lastPrice: 450.0,
        stock: 8,
        reqQty: 10,
        rate: 500.0,
        total: 5000.0,
      },
    ],
    budgetSummary: {
      allocated: 5000000.0,
      utilized: 1250000.0,
      remaining: 3750000.0,
    },
  },
  {
    id: "PA-TRG-2024-001",
    preApprovalNo: "PA-TRG-2024-001",
    wing: "Training Wing",
    requestedBy: "Current User",
    date: "08/12/2025",
    items: 2,
    totalAmount: 120000.0,
    status: "Pending",
    warehouse: "Central Warehouse",
    workflowType: "preapproval",
    currentStage: 1,
    currentStageId: 1,
    approvalHistory: [],
    itemDetails: [
      {
        code: "ITM-010",
        item: "Training Manual",
        uom: "Nos",
        lastPrice: 95.0,
        stock: 50,
        reqQty: 100,
        rate: 100.0,
        total: 10000.0,
      },
      {
        code: "ITM-011",
        item: "Projector",
        uom: "Nos",
        lastPrice: 10500.0,
        stock: 2,
        reqQty: 10,
        rate: 11000.0,
        total: 110000.0,
      },
    ],
    budgetSummary: {
      allocated: 8000000.0,
      utilized: 2500000.0,
      remaining: 5500000.0,
    },
  },
  {
    id: "PA-ACA-2024-001",
    preApprovalNo: "PA-ACA-2024-001",
    wing: "Academic Wing",
    requestedBy: "Current User",
    date: "11/12/2025",
    items: 2,
    totalAmount: 450000.0,
    status: "Pending",
    warehouse: "Central Warehouse",
    workflowType: "preapproval",
    currentStage: 2,
    currentStageId: 2,
    approvalHistory: [
      {
        stageId: 1,
        stageName: "Department Head Review",
        action: "Approved",
        approvedBy: "EMP004 - John Smith",
        approvedAt: "11/12/2025, 10:30 AM",
        comments: "Budget is available. Approved for next stage.",
      },
    ],
    itemDetails: [
      {
        code: "ITM-020",
        item: "Laboratory Equipment",
        uom: "Set",
        lastPrice: 42000.0,
        stock: 1,
        reqQty: 5,
        rate: 45000.0,
        total: 225000.0,
      },
      {
        code: "ITM-021",
        item: "Chemistry Set",
        uom: "Set",
        lastPrice: 21500.0,
        stock: 3,
        reqQty: 10,
        rate: 22500.0,
        total: 225000.0,
      },
    ],
    budgetSummary: {
      allocated: 12000000.0,
      utilized: 4500000.0,
      remaining: 7500000.0,
    },
  },
  {
    id: "PA-ENG-2024-001",
    preApprovalNo: "PA-ENG-2024-001",
    wing: "Engineering Wing",
    requestedBy: "Current User",
    date: "06/12/2025",
    items: 1,
    totalAmount: 15000.0,
    status: "Pending",
    warehouse: "Central Warehouse",
    workflowType: "preapproval",
    currentStage: 1,
    currentStageId: 1,
    approvalHistory: [],
    itemDetails: [
      {
        code: "ITM-030",
        item: "Welding Machine",
        uom: "Nos",
        lastPrice: 14500.0,
        stock: 2,
        reqQty: 1,
        rate: 15000.0,
        total: 15000.0,
      },
    ],
    budgetSummary: {
      allocated: 10000000.0,
      utilized: 3500000.0,
      remaining: 6500000.0,
    },
  },
  {
    id: "PA-ADM-2024-003",
    preApprovalNo: "PA-ADM-2024-003",
    wing: "Admin Wing",
    requestedBy: "Current User",
    date: "05/12/2025",
    items: 1,
    totalAmount: 8500.0,
    status: "Pending",
    warehouse: "Central Warehouse",
    workflowType: "preapproval",
    currentStage: 1,
    currentStageId: 1,
    approvalHistory: [],
    itemDetails: [
      {
        code: "ITM-005",
        item: "Filing Cabinet",
        uom: "Nos",
        lastPrice: 800.0,
        stock: 10,
        reqQty: 10,
        rate: 850.0,
        total: 8500.0,
      },
    ],
    budgetSummary: {
      allocated: 5000000.0,
      utilized: 1250000.0,
      remaining: 3750000.0,
    },
  },
  {
    id: "PA-TRG-2024-002",
    preApprovalNo: "PA-TRG-2024-002",
    wing: "Training Wing",
    requestedBy: "Current User",
    date: "07/12/2025",
    items: 1,
    totalAmount: 45000.0,
    status: "Pending",
    warehouse: "Central Warehouse",
    workflowType: "preapproval",
    currentStage: 1,
    currentStageId: 1,
    approvalHistory: [],
    itemDetails: [
      {
        code: "ITM-012",
        item: "Whiteboard",
        uom: "Nos",
        lastPrice: 4400.0,
        stock: 5,
        reqQty: 10,
        rate: 4500.0,
        total: 45000.0,
      },
    ],
    budgetSummary: {
      allocated: 8000000.0,
      utilized: 2500000.0,
      remaining: 5500000.0,
    },
  },
  {
    id: "NS-ADM-2024-001",
    preApprovalNo: "NS-ADM-2024-001",
    wing: "Admin Wing",
    requestedBy: "Current User",
    date: "09/12/2025",
    items: 1,
    totalAmount: 50000.0,
    status: "Pending",
    warehouse: "Central Warehouse",
    workflowType: "notesheet",
    currentStage: 1,
    currentStageId: 6,
    approvalHistory: [],
    itemDetails: [
      {
        code: "ITM-040",
        item: "Office Renovation",
        uom: "Lot",
        lastPrice: 48000.0,
        stock: 0,
        reqQty: 1,
        rate: 50000.0,
        total: 50000.0,
      },
    ],
    budgetSummary: {
      allocated: 5000000.0,
      utilized: 1250000.0,
      remaining: 3750000.0,
    },
  },
  {
    id: "PA-2025-179",
    preApprovalNo: "PA-2025-179",
    wing: "Sports Wing",
    requestedBy: "Current User",
    date: "12/17/2025",
    items: 1,
    totalAmount: 25000,
    status: "Pending",
    warehouse: "Main Warehouse",
    workflowType: "preapproval",
    currentStage: 3,
    currentStageId: 3,
    approvalHistory: [
      {
        stageId: 1,
        stageName: "Department Head Review",
        action: "Approved",
        approvedBy: "Current User",
        approvedAt: "12/17/2025, 10:30:00 AM",
        comments: "Budget allocation verified",
      },
      {
        stageId: 2,
        stageName: "Wing Commander Review",
        action: "Approved",
        approvedBy: "Current User",
        approvedAt: "12/17/2025, 11:45:00 AM",
        comments: "Approved for procurement",
      },
    ],
    pendingReviews: [
      {
        reviewType: "Central Accounts",
        reviewerId: "EMP018",
        reviewerName: "Col. Chen Xiaoming",
        sentBy: "SYSTEM",
        sentAt: "12/17/2025",
        stageId: 3,
        stageName: "Finance Review",
      },
    ],
    reviewComments: [
      {
        reviewType: "Account",
        reviewerId: "EMP009",
        reviewerName: "Mr. Ahmed Hassan",
        comment:
          "Documents verified and found correct. Budget allocation confirmed for Sports Wing equipment purchase.",
        submittedAt: "2024-12-11",
        stageId: 3,
        stageName: "Finance Review",
      },
      {
        reviewType: "Maintenance",
        reviewerId: "EMP006",
        reviewerName: "Ms. Maria Garcia",
        comment:
          "Waiting for medical report verification. Equipment specifications need technical validation before final approval.",
        submittedAt: "2024-12-12",
        stageId: 3,
        stageName: "Finance Review",
      },
    ],
    itemDetails: [
      {
        code: "SPRT-001",
        item: "Sports Equipment Set",
        uom: "Set",
        lastPrice: 24000,
        stock: 2,
        reqQty: 1,
        rate: 25000,
        total: 25000,
      },
    ],
    budgetSummary: {
      allocated: 50000,
      utilized: 15000,
      remaining: 35000,
    },
  },
]

export const demoApprovalRequisitions = demoApprovalPreApprovals
export type ApprovalRequisition = ApprovalPreApproval

export function getApprovalPreApprovals(): ApprovalPreApproval[] {
  if (typeof window === "undefined") {
    return demoApprovalPreApprovals
  }

  const stored = localStorage.getItem("bma_approvalPreApprovals")
  if (stored) {
    try {
      return JSON.parse(stored)
    } catch {
      return demoApprovalPreApprovals
    }
  }
  return demoApprovalPreApprovals
}

export function getUsers(): (Employee & { isLoggedIn?: boolean })[] {
  if (typeof window === "undefined") {
    return demoEmployees
  }

  const storedUser = localStorage.getItem("nccaims-user")
  if (storedUser) {
    try {
      const loggedInUser = JSON.parse(storedUser) as Employee
      return demoEmployees.map((emp) => ({
        ...emp,
        isLoggedIn: emp.employeeCode === loggedInUser.employeeCode,
      }))
    } catch {
      return demoEmployees
    }
  }
  return demoEmployees
}
