"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import {
  demoWings,
  demoWarehouses,
  demoEmployees,
  demoItems,
  demoAssets,
  demoPreApprovals,
  demoNotesheets,
  demoWorkflowStages,
  demoAuditLogs,
  demoPurchaseOrders,
  demoApprovalPipelines,
  demoApprovalRequisitions,
  demoApprovalPreApprovals,
  type Wing,
  type Warehouse,
  type Employee,
  type Item,
  type Asset,
  type PreApproval,
  type Notesheet,
  type WorkflowStage,
  type AuditLog,
  type PurchaseOrder,
  type ApprovalPipeline,
  type ApprovalRequisition,
  type ApprovalPreApproval,
} from "./demo-data"

interface DataContextType {
  // User
  user: Employee | null

  // Wings
  wings: Wing[]
  addWing: (wing: Omit<Wing, "id">) => void
  updateWing: (id: string, wing: Partial<Wing>) => void
  deleteWing: (id: string) => void

  // Warehouses
  warehouses: Warehouse[]
  addWarehouse: (warehouse: Omit<Warehouse, "id">) => void
  updateWarehouse: (id: string, warehouse: Partial<Warehouse>) => void
  deleteWarehouse: (id: string) => void

  // Employees
  employees: Employee[]
  addEmployee: (employee: Omit<Employee, "id">) => void
  updateEmployee: (id: string, employee: Partial<Employee>) => void
  deleteEmployee: (id: string) => void

  // Items
  items: Item[]
  addItem: (item: Omit<Item, "id">) => void
  updateItem: (id: string, item: Partial<Item>) => void
  deleteItem: (id: string) => void

  // Assets
  assets: Asset[]
  addAsset: (asset: Omit<Asset, "id">) => void
  updateAsset: (id: string, asset: Partial<Asset>) => void
  deleteAsset: (id: string) => void

  // Pre-Approvals
  preApprovals: PreApproval[]
  addPreApproval: (preApproval: Omit<PreApproval, "id">) => void
  updatePreApproval: (id: string, preApproval: Partial<PreApproval>) => void
  deletePreApproval: (id: string) => void

  // Notesheets
  notesheets: Notesheet[]
  addNotesheet: (notesheet: Omit<Notesheet, "id">) => void
  updateNotesheet: (id: string, notesheet: Partial<Notesheet>) => void
  deleteNotesheet: (id: string) => void

  // Purchase Orders
  purchaseOrders: PurchaseOrder[]
  addPurchaseOrder: (po: Omit<PurchaseOrder, "id">) => void
  updatePurchaseOrder: (id: string, po: Partial<PurchaseOrder>) => void
  deletePurchaseOrder: (id: string) => void

  // Workflow Stages
  workflowStages: WorkflowStage[]
  addWorkflowStage: (stage: Omit<WorkflowStage, "id">) => void
  updateWorkflowStage: (id: number, stage: Partial<WorkflowStage>) => void
  deleteWorkflowStage: (id: number) => void

  // Audit Logs
  auditLogs: AuditLog[]
  addAuditLog: (log: Omit<AuditLog, "id">) => void

  // Approval Pipelines
  approvalPipelines: ApprovalPipeline[]
  addApprovalPipeline: (pipeline: Omit<ApprovalPipeline, "id">) => void
  updateApprovalPipeline: (id: string, pipeline: Partial<ApprovalPipeline>) => void
  deleteApprovalPipeline: (id: string) => void

  // Approval Requisitions
  approvalRequisitions: ApprovalRequisition[]
  updateApprovalRequisition: (id: string, requisition: Partial<ApprovalRequisition>) => void
  approveRequisition: (
    id: string,
    action: "Approved" | "Recommended" | "Rejected" | "Reviewed",
    comments?: string,
  ) => void
  createApprovalRequisition: (
    type:
      | "pre-approval"
      | "note-sheet"
      | "purchase-order"
      | "grn"
      | "inventory-issue"
      | "inventory-receive"
      | "inventory-transfer",
    requisitionNo: string,
    wingId: string,
    warehouseId: string,
    totalAmount: number,
    items: any[],
  ) => ApprovalRequisition | void

  // Approval Pre-Approvals
  approvalPreApprovals: ApprovalPreApproval[]
  updateApprovalPreApproval: (id: string, preApproval: Partial<ApprovalPreApproval>) => void
  approvePreApproval: (id: string, actorId: string, notes?: string) => void
  createApprovalPreApproval: (
    type:
      | "pre-approval"
      | "note-sheet"
      | "purchase-order"
      | "grn"
      | "inventory-issue"
      | "inventory-receive"
      | "inventory-transfer",
    preApprovalNo: string,
    warehouseId: string,
    wingId: string,
    totalAmount: number,
    items: any[],
  ) => ApprovalPreApproval | void
  sendToReviewer: (
    id: string,
    reviewType: "Account" | "Maintenance" | "Central Accounts",
    reviewerId: string,
    reviewerName: string,
  ) => void
  addReviewerComment: (id: string, reviewType: "Account" | "Maintenance" | "Central Accounts", comment: string) => void
  sendBackPreApproval: (id: string, notes: string) => void
}

const DataContext = createContext<DataContextType | undefined>(undefined)

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Employee | null>(null)
  const [wings, setWings] = useState<Wing[]>([])
  const [warehouses, setWarehouses] = useState<Warehouse[]>([])
  const [employees, setEmployees] = useState<Employee[]>([])
  const [items, setItems] = useState<Item[]>([])
  const [assets, setAssets] = useState<Asset[]>([])
  const [preApprovals, setPreApprovals] = useState<PreApproval[]>([])
  const [notesheets, setNotesheets] = useState<Notesheet[]>([])
  const [workflowStages, setWorkflowStages] = useState<WorkflowStage[]>([])
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([])
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([])
  const [approvalPipelines, setApprovalPipelines] = useState<ApprovalPipeline[]>([])
  const [approvalRequisitions, setApprovalRequisitions] = useState<ApprovalRequisition[]>([])
  const [approvalPreApprovals, setApprovalPreApprovals] = useState<ApprovalPreApproval[]>(demoApprovalPreApprovals)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const loadFromStorage = (key: string, defaultData: any) => {
        const stored = localStorage.getItem(key)
        return stored ? JSON.parse(stored) : defaultData
      }

      const storedUser = localStorage.getItem("nccaims-user")
      if (storedUser) {
        setUser(JSON.parse(storedUser))
        console.log("[v0] Loaded user from localStorage:", JSON.parse(storedUser).employeeCode)
      } else {
        console.log("[v0] No user found in localStorage")
      }

      setWings(loadFromStorage("bma_wings", demoWings))
      setWarehouses(loadFromStorage("bma_warehouses", demoWarehouses))
      setEmployees(loadFromStorage("bma_employees", demoEmployees))
      setItems(loadFromStorage("bma_items", demoItems))
      setAssets(loadFromStorage("bma_assets", demoAssets))
      setPreApprovals(loadFromStorage("bma_preApprovals", demoPreApprovals))
      setNotesheets(loadFromStorage("bma_notesheets", demoNotesheets))
      setWorkflowStages(loadFromStorage("bma_workflowStages", demoWorkflowStages))
      setAuditLogs(loadFromStorage("bma_auditLogs", demoAuditLogs))
      setPurchaseOrders(loadFromStorage("bma_purchaseOrders", demoPurchaseOrders))
      setApprovalPipelines(loadFromStorage("bma_approvalPipelines", demoApprovalPipelines))
      setApprovalRequisitions(loadFromStorage("bma_approvalRequisitions", demoApprovalRequisitions))

      const loadedPreApprovals = loadFromStorage("bma_approvalPreApprovals", demoApprovalPreApprovals)
      setApprovalPreApprovals(loadedPreApprovals)
      console.log("[v0] Loaded approvalPreApprovals from localStorage:", loadedPreApprovals.length)
    }
  }, [])

  useEffect(() => {
    if (typeof window !== "undefined" && wings.length > 0) {
      localStorage.setItem("bma_wings", JSON.stringify(wings))
    }
  }, [wings])

  useEffect(() => {
    if (typeof window !== "undefined" && warehouses.length > 0) {
      localStorage.setItem("bma_warehouses", JSON.stringify(warehouses))
    }
  }, [warehouses])

  useEffect(() => {
    if (typeof window !== "undefined" && employees.length > 0) {
      localStorage.setItem("bma_employees", JSON.stringify(employees))
    }
  }, [employees])

  useEffect(() => {
    if (typeof window !== "undefined" && items.length > 0) {
      localStorage.setItem("bma_items", JSON.stringify(items))
    }
  }, [items])

  useEffect(() => {
    if (typeof window !== "undefined" && assets.length > 0) {
      localStorage.setItem("bma_assets", JSON.stringify(assets))
    }
  }, [assets])

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("bma_preApprovals", JSON.stringify(preApprovals))
    }
  }, [preApprovals])

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("bma_notesheets", JSON.stringify(notesheets))
    }
  }, [notesheets])

  useEffect(() => {
    if (typeof window !== "undefined" && workflowStages.length > 0) {
      localStorage.setItem("bma_workflowStages", JSON.stringify(workflowStages))
    }
  }, [workflowStages])

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("bma_auditLogs", JSON.stringify(auditLogs))
    }
  }, [auditLogs])

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("bma_purchaseOrders", JSON.stringify(purchaseOrders))
    }
  }, [purchaseOrders])

  useEffect(() => {
    if (typeof window !== "undefined" && approvalPipelines.length > 0) {
      localStorage.setItem("bma_approvalPipelines", JSON.stringify(approvalPipelines))
    }
  }, [approvalPipelines])

  useEffect(() => {
    if (typeof window !== "undefined" && approvalRequisitions.length > 0) {
      localStorage.setItem("bma_approvalRequisitions", JSON.stringify(approvalRequisitions))
    }
  }, [approvalRequisitions])

  useEffect(() => {
    if (typeof window !== "undefined" && approvalPreApprovals.length > 0) {
      localStorage.setItem("bma_approvalPreApprovals", JSON.stringify(approvalPreApprovals))
      console.log("[v0] Auto-saved approvalPreApprovals to localStorage:", approvalPreApprovals.length)
    }
  }, [approvalPreApprovals])

  const addWing = (wing: Omit<Wing, "id">) => {
    const newWing = { ...wing, id: `wing-${Date.now()}` }
    setWings([...wings, newWing])
  }

  const updateWing = (id: string, wing: Partial<Wing>) => {
    setWings(wings.map((w) => (w.id === id ? { ...w, ...wing } : w)))
  }

  const deleteWing = (id: string) => {
    setWings(wings.filter((w) => w.id !== id))
  }

  const addWarehouse = (warehouse: Omit<Warehouse, "id">) => {
    const newWarehouse = { ...warehouse, id: `wh-${Date.now()}` }
    setWarehouses([...warehouses, newWarehouse])
  }

  const updateWarehouse = (id: string, warehouse: Partial<Warehouse>) => {
    setWarehouses(warehouses.map((w) => (w.id === id ? { ...w, ...warehouse } : w)))
  }

  const deleteWarehouse = (id: string) => {
    setWarehouses(warehouses.filter((w) => w.id !== id))
  }

  const addEmployee = (employee: Omit<Employee, "id">) => {
    const newEmployee = { ...employee, id: `emp-${Date.now()}` }
    setEmployees([...employees, newEmployee])
  }

  const updateEmployee = (id: string, employee: Partial<Employee>) => {
    setEmployees(employees.map((e) => (e.id === id ? { ...e, ...employee } : e)))
  }

  const deleteEmployee = (id: string) => {
    setEmployees(employees.filter((e) => e.id !== id))
  }

  const addItem = (item: Omit<Item, "id">) => {
    const newItem = { ...item, id: `item-${Date.now()}` }
    setItems([...items, newItem])
  }

  const updateItem = (id: string, item: Partial<Item>) => {
    setItems(items.map((i) => (i.id === id ? { ...i, ...item } : i)))
  }

  const deleteItem = (id: string) => {
    setItems(items.filter((i) => i.id !== id))
  }

  const addAsset = (asset: Omit<Asset, "id">) => {
    const newAsset = { ...asset, id: `asset-${Date.now()}` }
    setAssets([...assets, newAsset])
  }

  const updateAsset = (id: string, asset: Partial<Asset>) => {
    setAssets(assets.map((a) => (a.id === id ? { ...a, ...asset } : a)))
  }

  const deleteAsset = (id: string) => {
    setAssets(assets.filter((a) => a.id !== id))
  }

  const addPreApproval = (preApproval: Omit<PreApproval, "id">) => {
    const newPreApproval = { ...preApproval, id: `pa-${Date.now()}` }
    setPreApprovals([...preApprovals, newPreApproval])
  }

  const updatePreApproval = (id: string, preApproval: Partial<PreApproval>) => {
    setPreApprovals(preApprovals.map((p) => (p.id === id ? { ...p, ...preApproval } : p)))
  }

  const deletePreApproval = (id: string) => {
    setPreApprovals(preApprovals.filter((p) => p.id !== id))
  }

  const addNotesheet = (notesheet: Omit<Notesheet, "id">) => {
    const newNotesheet = { ...notesheet, id: `ns-${Date.now()}` }
    const updatedNotesheets = [...notesheets, newNotesheet]
    setNotesheets(updatedNotesheets)
    localStorage.setItem("bma_notesheets", JSON.stringify(updatedNotesheets))
    console.log("[v0] Added notesheet and saved to localStorage:", newNotesheet.id)
  }

  const updateNotesheet = (id: string, notesheet: Partial<Notesheet>) => {
    setNotesheets(notesheets.map((n) => (n.id === id ? { ...n, ...notesheet } : n)))
  }

  const deleteNotesheet = (id: string) => {
    setNotesheets(notesheets.filter((n) => n.id !== id))
  }

  const addPurchaseOrder = (po: Omit<PurchaseOrder, "id">) => {
    const newPO = { ...po, id: `po-${Date.now()}` }
    setPurchaseOrders([...purchaseOrders, newPO])
  }

  const updatePurchaseOrder = (id: string, po: Partial<PurchaseOrder>) => {
    setPurchaseOrders(purchaseOrders.map((p) => (p.id === id ? { ...p, ...po } : p)))
  }

  const deletePurchaseOrder = (id: string) => {
    setPurchaseOrders(purchaseOrders.filter((p) => p.id !== id))
  }

  const addWorkflowStage = (stage: Omit<WorkflowStage, "id">) => {
    const maxId = Math.max(...workflowStages.map((s) => s.id), 0)
    const newStage = { ...stage, id: maxId + 1 }
    setWorkflowStages([...workflowStages, newStage])
  }

  const updateWorkflowStage = (id: number, stage: Partial<WorkflowStage>) => {
    setWorkflowStages(workflowStages.map((s) => (s.id === id ? { ...s, ...stage } : s)))
  }

  const deleteWorkflowStage = (id: number) => {
    setWorkflowStages(workflowStages.filter((s) => s.id !== id))
  }

  const addAuditLog = (log: Omit<AuditLog, "id">) => {
    const newLog = { ...log, id: `log-${Date.now()}` }
    setAuditLogs([newLog, ...auditLogs])
  }

  const addApprovalPipeline = (pipeline: Omit<ApprovalPipeline, "id">) => {
    const newPipeline = { ...pipeline, id: `pipeline-${Date.now()}` }
    setApprovalPipelines([...approvalPipelines, newPipeline])
  }

  const updateApprovalPipeline = (id: string, pipeline: Partial<ApprovalPipeline>) => {
    setApprovalPipelines(approvalPipelines.map((p) => (p.id === id ? { ...p, ...pipeline } : p)))
  }

  const deleteApprovalPipeline = (id: string) => {
    setApprovalPipelines(approvalPipelines.filter((p) => p.id !== id))
  }

  const updateApprovalRequisition = (id: string, requisition: Partial<ApprovalRequisition>) => {
    setApprovalRequisitions(approvalRequisitions.map((r) => (r.id === id ? { ...r, ...requisition } : r)))
  }

  const approveRequisition = (
    id: string,
    action: "Approved" | "Recommended" | "Rejected" | "Reviewed",
    comments?: string,
  ) => {
    setApprovalRequisitions(
      approvalRequisitions.map((req) => {
        if (req.id !== id) return req

        const currentStageInfo = workflowStages.find((s) => s.id === req.currentStageId)
        if (!currentStageInfo) return req

        const newHistory = [
          ...req.approvalHistory,
          {
            stageId: req.currentStageId,
            stageName: currentStageInfo.name,
            action,
            approvedBy: "Current User",
            approvedAt: new Date().toLocaleString(),
            comments,
          },
        ]

        if (action === "Approved") {
          const nextStage = workflowStages.find(
            (s) => s.workflowType === req.workflowType && s.order === currentStageInfo.order + 1,
          )

          if (nextStage) {
            return {
              ...req,
              currentStage: nextStage.order,
              currentStageId: nextStage.id,
              approvalHistory: newHistory,
              status: "Pending",
            }
          } else {
            return {
              ...req,
              approvalHistory: newHistory,
              status: "Approved",
            }
          }
        } else if (action === "Rejected") {
          return {
            ...req,
            approvalHistory: newHistory,
            status: "Rejected",
          }
        } else {
          return {
            ...req,
            approvalHistory: newHistory,
            status: action === "Recommended" ? "Recommended" : "Under Review",
          }
        }
      }),
    )

    addAuditLog({
      module: "Approval",
      action: `Requisition ${action}`,
      performedBy: "Current User",
      timestamp: new Date().toISOString(),
      details: `Requisition ${id} was ${action.toLowerCase()}`,
    })
  }

  const createApprovalRequisition = (
    type:
      | "pre-approval"
      | "note-sheet"
      | "purchase-order"
      | "grn"
      | "inventory-issue"
      | "inventory-receive"
      | "inventory-transfer",
    requisitionNo: string,
    wingId: string,
    warehouseId: string,
    totalAmount: number,
    items: any[],
  ) => {
    const workflowTypeMap: Record<string, string> = {
      "pre-approval": "preapproval",
      "note-sheet": "notesheet",
      "purchase-order": "purchaseorder",
      grn: "grn",
      "inventory-issue": "inventoryissue",
      "inventory-receive": "inventoryreceive",
      "inventory-transfer": "inventorytransfer",
    }

    const workflowType = workflowTypeMap[type]
    console.log("[v0] Creating approval requisition...")
    console.log("[v0] Looking for workflow stages with type:", workflowType)
    console.log("[v0] Available workflow stages:", workflowStages)

    const firstStage = workflowStages.find((s) => s.workflowType === workflowType && s.order === 1)

    if (!firstStage) {
      console.error(`[v0] No workflow stages found for ${workflowType}`)
      console.error(`[v0] Available workflow types:`, [...new Set(workflowStages.map((s) => s.workflowType))])
      return
    }

    console.log("[v0] Found first stage:", firstStage)

    const selectedWing = wings.find((w) => w.id === wingId)?.name || "Unknown Wing"
    const selectedWarehouse = warehouses.find((wh) => wh.id === warehouseId)?.name || "Central Warehouse"
    const loggedInUser = employees.find((emp) => emp.isLoggedIn)
    const transformedItems = items.map((item) => ({ ...item, id: `item-${Date.now()}` }))

    const newRequisition: ApprovalRequisition = {
      id: requisitionNo, // Use requisitionNo as ID instead of timestamp to make it easier to find
      requisitionNo,
      type,
      wing: selectedWing,
      requestedBy: loggedInUser ? `${loggedInUser.employeeCode} - ${loggedInUser.fullName}` : "Current User",
      date: new Date().toLocaleDateString(),
      items: items.length,
      totalAmount,
      status: "Pending",
      workflowType,
      currentStage: 1,
      currentStageId: firstStage.id,
      approvalHistory: [],
      warehouse: selectedWarehouse,
      itemDetails: items,
    }

    console.log("[v0] New requisition created:", newRequisition)

    setApprovalRequisitions((prev) => {
      const updated = [...prev, newRequisition]
      console.log("[v0] Updated approval requisitions array length:", updated.length)
      console.log("[v0] New requisition added:", requisitionNo)
      return updated
    })

    addAuditLog({
      timestamp: new Date().toISOString(),
      userId: "current-user",
      userName: "Current User",
      action: "CREATE",
      module: "Approval",
      details: `Created ${type} requisition ${requisitionNo} - Started at Stage 1: ${firstStage.name}`,
      ipAddress: "192.168.1.100",
    })

    console.log("[v0] Approval requisition creation completed")
    return newRequisition
  }

  const updateApprovalPreApproval = (id: string, preApproval: Partial<ApprovalPreApproval>) => {
    setApprovalPreApprovals(approvalPreApprovals.map((r) => (r.id === id ? { ...r, ...preApproval } : r)))
  }

  const approvePreApproval = (id: string, actorId: string, notes?: string) => {
    console.log("[v0] === approvePreApproval FUNCTION CALLED ===")
    console.log("[v0] Parameters:", { id, actorId, notes })

    const foundApproval = approvalPreApprovals.find((pa) => pa.id === id)
    if (!foundApproval) {
      console.error("[v0] No approval pre-approval found with ID:", id)
      return
    }

    const currentStage = workflowStages.find((s) => s.id === foundApproval.currentStageId)
    if (!currentStage) {
      console.error("[v0] Current stage not found for approval pre-approval ID:", id)
      return
    }

    const nextStage = workflowStages.find(
      (s) => s.workflowType === currentStage.workflowType && s.order === currentStage.order + 1,
    )

    const newStatus = nextStage ? "Pending" : "Approved"

    const updatedApprovals = approvalPreApprovals.map((pa) => {
      if (pa.id !== id) return pa

      const currentStageInfo = workflowStages.find((s) => s.id === pa.currentStageId)
      if (!currentStageInfo) return pa

      const newHistory = [
        ...pa.approvalHistory,
        {
          stageId: pa.currentStageId,
          stageName: currentStageInfo.name,
          action: "Approve",
          approvedBy: "Current User",
          approvedAt: new Date().toLocaleString(),
          comments: notes,
        },
      ]

      return {
        ...pa,
        currentStage: nextStage ? nextStage.order : currentStage.order,
        currentStageId: nextStage ? nextStage.id : currentStage.id,
        approvalHistory: newHistory,
        status: newStatus,
      }
    })

    setApprovalPreApprovals(updatedApprovals)
    localStorage.setItem("bma_approvalPreApprovals", JSON.stringify(updatedApprovals))
    console.log("[v0] Updated approval pre-approvals in state and localStorage")

    const updatedPreApprovals = preApprovals.map((pa) => {
      if (pa.id === id) {
        const updatedPA = {
          ...pa,
          currentStage: nextStage ? nextStage.order : currentStage.order,
          status: newStatus,
          workflowHistory: [
            ...pa.workflowHistory,
            {
              stageId: currentStage.id,
              stageName: currentStage.name,
              actorId,
              actorName: "Current User",
              action: "Approve",
              timestamp: new Date().toISOString(),
              notes: notes || "",
            },
          ],
        }
        console.log(
          `[v0] Updated ${id} from "${currentStage.name}" to "${nextStage ? nextStage.name : currentStage.name}"`,
        )
        console.log(
          `[v0] New currentStage number: ${updatedPA.currentStage}, workflowHistory length: ${updatedPA.workflowHistory.length}`,
        )
        return updatedPA
      }
      return pa
    })

    setPreApprovals(updatedPreApprovals)
    localStorage.setItem("bma_preApprovals", JSON.stringify(updatedPreApprovals))
    console.log("[v0] Pre-Approval list page array saved to localStorage")

    const verifyUpdate = updatedPreApprovals.find((pa) => pa.id === id)
    if (verifyUpdate) {
      console.log(
        `[v0] Verification - ${id} now at stage ${verifyUpdate.currentStage}: ${verifyUpdate.workflowHistory.length > 0 ? verifyUpdate.workflowHistory[verifyUpdate.workflowHistory.length - 1].stageName : "Not Started"}`,
      )
    }

    addAuditLog({
      timestamp: new Date().toISOString(),
      userId: actorId,
      userName: "Current User",
      action: "APPROVE",
      module: "Approval",
      details: `Approved ${foundApproval.type} ${foundApproval.preApprovalNo} at Stage ${currentStage.order}: ${currentStage.name}`,
      ipAddress: "192.168.1.100",
    })
  }

  const createApprovalPreApproval = (
    type:
      | "pre-approval"
      | "note-sheet"
      | "purchase-order"
      | "grn"
      | "inventory-issue"
      | "inventory-receive"
      | "inventory-transfer",
    preApprovalNo: string,
    warehouseId: string,
    wingId: string,
    totalAmount: number,
    items: any[],
  ) => {
    const workflowTypeMap: Record<string, string> = {
      "pre-approval": "preapproval",
      "note-sheet": "notesheet",
      "purchase-order": "purchaseorder",
      grn: "grn",
      "inventory-issue": "inventoryissue",
      "inventory-receive": "inventoryreceive",
      "inventory-transfer": "inventorytransfer",
    }

    const workflowType = workflowTypeMap[type]
    console.log("[v0] Creating approval pre-approval...")
    console.log("[v0] Looking for workflow stages with type:", workflowType)
    console.log("[v0] Available workflow stages:", workflowStages)

    const firstStage = workflowStages.find((s) => s.workflowType === workflowType && s.order === 1)

    if (!firstStage) {
      console.error(`[v0] No workflow stages found for ${workflowType}`)
      if (workflowStages && workflowStages.length > 0) {
        console.error(`[v0] Available workflow types:`, [...new Set(workflowStages.map((s) => s.workflowType))])
      }
      return
    }

    console.log("[v0] Found first stage:", firstStage)

    const selectedWing = wings.find((w) => w.id === wingId)
    const selectedWarehouse = warehouses.find((wh) => wh.id === warehouseId)
    const loggedInUser = employees.find((emp) => emp.isLoggedIn)
    const safeItems = items || []
    const transformedItems = safeItems.map((item) => ({ ...item, id: `item-${Date.now()}-${Math.random()}` }))

    const newApprovalPreApproval: ApprovalPreApproval = {
      id: preApprovalNo,
      preApprovalNo,
      type: "pre-approval",
      wing: selectedWing?.name || "",
      requestedBy: loggedInUser ? `${loggedInUser.employeeCode} - ${loggedInUser.fullName}` : "Current User",
      date: new Date().toLocaleDateString(),
      items: transformedItems.length,
      totalAmount,
      status: "Pending",
      workflowType,
      currentStage: firstStage.order,
      currentStageId: firstStage.id,
      approvalHistory: [],
      pendingReviews: [],
      reviewComments: [],
      warehouse: selectedWarehouse?.name || "",
      itemDetails: transformedItems,
    }

    console.log("[v0] New pre-approval created:", newApprovalPreApproval)

    setApprovalPreApprovals((prevApprovals) => {
      const updated = [...prevApprovals, newApprovalPreApproval]
      console.log("[v0] Updated approval pre-approvals array length:", updated.length)
      console.log("[v0] New pre-approval added:", preApprovalNo)
      // Save to localStorage
      localStorage.setItem("bma_approvalPreApprovals", JSON.stringify(updated))
      console.log("[v0] Saved approval pre-approvals to localStorage")
      return updated
    })

    const newPreApproval: PreApproval = {
      id: preApprovalNo,
      preApprovalId: preApprovalNo,
      wingId,
      warehouseId,
      requestedBy: loggedInUser?.id || "current-user",
      requestDate: new Date().toLocaleDateString("en-GB").split("/").reverse().join("-"),
      items: transformedItems.map((item) => ({
        itemId: item.id,
        itemName: item.name,
        description: item.description,
        uom: item.uom,
        currentStock: item.currentStock,
        quantity: item.quantity,
        rate: item.rate,
        total: item.total,
        remarks: item.remarks,
      })),
      totalAmount,
      status: "Pending",
      currentStage: firstStage.order,
      workflowHistory: [],
    }

    setPreApprovals((prevApprovals) => {
      const updated = [...prevApprovals, newPreApproval]
      console.log("[v0] Also added to preApprovals array for list page, length:", updated.length)
      localStorage.setItem("bma_preApprovals", JSON.stringify(updated))
      console.log("[v0] Saved preApprovals to localStorage")
      return updated
    })

    addAuditLog({
      timestamp: new Date().toISOString(),
      userId: "current-user",
      userName: "Current User",
      action: "CREATE",
      module: "Approval",
      details: `Created ${type} pre-approval ${preApprovalNo} - Started at Stage 1: ${firstStage.name}`,
      ipAddress: "192.168.1.100",
    })

    console.log("[v0] Approval pre-approval creation completed")
    return newApprovalPreApproval
  }

  const sendToReviewer = (
    id: string,
    reviewType: "Account" | "Maintenance" | "Central Accounts",
    reviewerId: string,
    reviewerName: string,
  ) => {
    console.log("[v0] === sendToReviewer FUNCTION CALLED ===")
    console.log("[v0] Parameters:", { id, reviewType, reviewerId, reviewerName })

    const loggedInUser = employees.find((emp) => emp.isLoggedIn)
    if (!loggedInUser) {
      console.warn("[v0] No logged in user found - proceeding with review assignment without sender info")
    } else {
      console.log("[v0] Logged in user:", loggedInUser.employeeCode, loggedInUser.fullName)
    }

    setApprovalPreApprovals((prev) => {
      console.log("[v0] Current approvalPreApprovals count:", prev.length)

      const updated = prev.map((doc) => {
        if (doc.id === id) {
          console.log("[v0] Found document to send to reviewer:", doc.id)

          const pendingReviews = doc.pendingReviews || []
          const reviewComments = doc.reviewComments || []

          // Check if review already exists
          const existingReview = pendingReviews.find((r) => r.reviewType === reviewType && r.reviewerId === reviewerId)

          if (existingReview) {
            console.log("[v0] Review already exists for this reviewer")
            return doc
          }

          const newReview = {
            reviewType,
            reviewerId,
            reviewerName,
            sentBy: loggedInUser?.employeeCode || "SYSTEM",
            sentByName: loggedInUser?.fullName || "System",
            sentDate: new Date().toLocaleDateString(),
          }

          const newPendingReviews = [...pendingReviews, newReview]

          console.log("[v0] Adding new pending review:", newReview)
          console.log("[v0] Total pending reviews after add:", newPendingReviews.length)

          return {
            ...doc,
            pendingReviews: newPendingReviews,
            reviewComments,
          }
        }
        return doc
      })

      console.log("[v0] Updated documents count:", updated.length)

      if (typeof window !== "undefined") {
        localStorage.setItem("bma_approvalPreApprovals", JSON.stringify(updated))
        console.log("[v0] Saved to localStorage immediately")

        const verified = localStorage.getItem("bma_approvalPreApprovals")
        if (verified) {
          const parsed = JSON.parse(verified)
          const verifiedDoc = parsed.find((d: any) => d.id === id)
          console.log("[v0] Verification - Document pending reviews:", verifiedDoc?.pendingReviews?.length || 0)
        }
      }

      return updated
    })
  }

  const addReviewerComment = (
    id: string,
    reviewType: "Account" | "Maintenance" | "Central Accounts",
    comment: string,
  ) => {
    let loggedInUser: Employee | undefined
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("nccaims-user")
      if (storedUser) {
        loggedInUser = JSON.parse(storedUser)
      }
    }

    if (!loggedInUser) {
      console.log("[v0] addReviewerComment - No logged in user found")
      return
    }

    console.log("[v0] addReviewerComment called", { id, reviewType, comment, user: loggedInUser.employeeCode })

    setApprovalPreApprovals((prevApprovals) => {
      const updated = prevApprovals.map((req) => {
        if (req.id !== id) return req

        console.log("[v0] Found matching document:", req.preApprovalNo)
        console.log(
          "[v0] Before update - pendingReviews:",
          req.pendingReviews?.length,
          "reviewComments:",
          req.reviewComments?.length,
        )

        const currentStageInfo = workflowStages.find((s) => s.id === req.currentStageId)
        if (!currentStageInfo) {
          console.error("[v0] Current stage not found for stage ID:", req.currentStageId)
          return req
        }

        console.log("[v0] Current stage:", currentStageInfo.name)

        const updatedPendingReviews = (req.pendingReviews || []).filter(
          (pr) => !(pr.reviewType === reviewType && pr.reviewerId === loggedInUser.employeeCode),
        )

        const newReviewComment = {
          reviewType,
          reviewerId: loggedInUser.employeeCode,
          reviewerName: loggedInUser.fullName,
          comment,
          submittedAt: new Date().toLocaleString(),
          stageId: req.currentStageId,
          stageName: currentStageInfo.name,
          date: new Date().toLocaleDateString(), // Add date field for display
        }

        console.log("[v0] Removing pending review, adding comment:", newReviewComment)

        const updatedReq = {
          ...req,
          pendingReviews: updatedPendingReviews,
          reviewComments: [...(req.reviewComments || []), newReviewComment],
        }

        console.log(
          "[v0] After update - pendingReviews:",
          updatedReq.pendingReviews.length,
          "reviewComments:",
          updatedReq.reviewComments.length,
        )

        return updatedReq
      })

      if (typeof window !== "undefined") {
        localStorage.setItem("bma_approvalPreApprovals", JSON.stringify(updated))
        console.log("[v0] Saved updated pre-approvals to localStorage")
      }

      return updated
    })
  }

  const sendBackPreApproval = (id: string, notes: string) => {
    const foundApproval = approvalPreApprovals.find((pa) => pa.id === id)
    if (!foundApproval) {
      console.error("[v0] Approval pre-approval not found for send back, ID:", id)
      return
    }

    const currentStage = workflowStages.find((s) => s.id === foundApproval.currentStageId)
    if (!currentStage) {
      console.error("[v0] Current stage not found for send back, ID:", id)
      return
    }

    const previousStage = workflowStages.find(
      (s) => s.workflowType === currentStage.workflowType && s.order === currentStage.order - 1,
    )

    if (!previousStage) {
      console.error("[v0] Cannot send back - already at first stage")
      return
    }

    const updatedApprovals = approvalPreApprovals.map((pa) => {
      if (pa.id !== id) return pa

      const newHistory = [
        ...pa.approvalHistory,
        {
          stageId: pa.currentStageId,
          stageName: currentStage.name,
          action: "Send Back",
          approvedBy: "Current User",
          approvedAt: new Date().toLocaleString(),
          comments: notes,
        },
      ]

      return {
        ...pa,
        currentStage: previousStage.order,
        currentStageId: previousStage.id,
        approvalHistory: newHistory,
        status: "Pending",
      }
    })

    setApprovalPreApprovals(updatedApprovals)
    localStorage.setItem("bma_approvalPreApprovals", JSON.stringify(updatedApprovals))
    console.log("[v0] Sent document back to previous stage in approvalPreApprovals")

    const updatedPreApprovals = preApprovals.map((pa) => {
      if (pa.id === id) {
        const updatedPA = {
          ...pa,
          currentStage: previousStage.order,
          status: "Pending" as const,
          workflowHistory: [
            ...pa.workflowHistory,
            {
              stageId: currentStage.id,
              stageName: currentStage.name,
              actorId: "current-user",
              actorName: "Current User",
              action: "Send Back" as const,
              timestamp: new Date().toISOString(),
              notes: notes || "",
            },
          ],
        }
        console.log(`[v0] Sent ${id} back from "${currentStage.name}" to "${previousStage.name}"`)
        return updatedPA
      }
      return pa
    })

    setPreApprovals(updatedPreApprovals)
    localStorage.setItem("bma_preApprovals", JSON.stringify(updatedPreApprovals))
    console.log("[v0] Pre-Approval list updated with send back action")
  }

  return (
    <DataContext.Provider
      value={{
        user,
        wings,
        addWing,
        updateWing,
        deleteWing,
        warehouses,
        addWarehouse,
        updateWarehouse,
        deleteWarehouse,
        employees,
        addEmployee,
        updateEmployee,
        deleteEmployee,
        items,
        addItem,
        updateItem,
        deleteItem,
        assets,
        addAsset,
        updateAsset,
        deleteAsset,
        preApprovals,
        addPreApproval,
        updatePreApproval,
        deletePreApproval,
        notesheets,
        addNotesheet,
        updateNotesheet,
        deleteNotesheet,
        purchaseOrders,
        addPurchaseOrder,
        updatePurchaseOrder,
        deletePurchaseOrder,
        workflowStages,
        addWorkflowStage,
        updateWorkflowStage,
        deleteWorkflowStage,
        auditLogs,
        addAuditLog,
        approvalPipelines,
        addApprovalPipeline,
        updateApprovalPipeline,
        deleteApprovalPipeline,
        approvalRequisitions,
        updateApprovalRequisition,
        approveRequisition,
        createApprovalRequisition,
        approvalPreApprovals,
        updateApprovalPreApproval,
        approvePreApproval,
        createApprovalPreApproval,
        sendToReviewer,
        addReviewerComment,
        sendBackPreApproval,
      }}
    >
      {children}
    </DataContext.Provider>
  )
}

function useData() {
  const context = useContext(DataContext)
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider")
  }
  return context
}

export { useData }
