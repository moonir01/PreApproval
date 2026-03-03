"use client"

import { useState } from "react"
import { Plus, Edit, Trash2, MoveUp, MoveDown, Save, X, ArrowLeft, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useData } from "@/lib/data-context"
import { useRouter } from "next/navigation"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"

type WorkflowType = "preapproval" | "notesheet"
type ApprovalMode = "sequential" | "parallel"

interface WorkflowStageForm {
  id?: number
  name: string
  workflowType: WorkflowType
  assignedDesignations: string[]
  assignedEmployees: string[]
  approvalMode: ApprovalMode
  order: number
  requiresAccountsReview: boolean
  accountsOfficers: string[]
  requiresMaintenanceReview: boolean
  maintenanceOfficers: string[]
  requiresCentralAccountsReview: boolean
  centralAccountsOfficers: string[]
}

const designationOptions = [
  "Commander",
  "Deputy Commander",
  "Wing Head",
  "Dept Head",
  "Principal Staff",
  "Maintenance Officer",
  "Accounts Officer",
]

export default function WorkflowSetupPage() {
  const { workflowStages, addWorkflowStage, updateWorkflowStage, deleteWorkflowStage, employees } = useData()
  const router = useRouter()
  const [selectedWorkflowType, setSelectedWorkflowType] = useState<WorkflowType>("preapproval")
  const [isAddingStage, setIsAddingStage] = useState(false)
  const [editingStageId, setEditingStageId] = useState<number | null>(null)
  const [employeeDropdownOpen, setEmployeeDropdownOpen] = useState(false)
  const [accountsDropdownOpen, setAccountsDropdownOpen] = useState(false)
  const [maintenanceDropdownOpen, setMaintenanceDropdownOpen] = useState(false)
  const [centralAccountsDropdownOpen, setCentralAccountsDropdownOpen] = useState(false)
  const [formData, setFormData] = useState<WorkflowStageForm>({
    name: "",
    workflowType: "preapproval",
    assignedDesignations: [],
    assignedEmployees: [],
    approvalMode: "sequential",
    order: 1,
    requiresAccountsReview: false,
    accountsOfficers: [],
    requiresMaintenanceReview: false,
    maintenanceOfficers: [],
    requiresCentralAccountsReview: false,
    centralAccountsOfficers: [],
  })

  const filteredStages = workflowStages
    .filter((stage) => stage.workflowType === selectedWorkflowType)
    .sort((a, b) => a.order - b.order)

  const handleAddStage = () => {
    setIsAddingStage(true)
    setEditingStageId(null) // Ensure no stage is in edit mode when adding
    setFormData({
      name: "",
      workflowType: selectedWorkflowType,
      assignedDesignations: [],
      assignedEmployees: [],
      approvalMode: "sequential",
      order: filteredStages.length + 1,
      requiresAccountsReview: false,
      accountsOfficers: [],
      requiresMaintenanceReview: false,
      maintenanceOfficers: [],
      requiresCentralAccountsReview: false,
      centralAccountsOfficers: [],
    })
  }

  const handleEditStage = (stage: (typeof workflowStages)[0]) => {
    setEditingStageId(stage.id)
    setIsAddingStage(false) // Ensure add mode is off when editing
    setFormData({
      id: stage.id,
      name: stage.name,
      workflowType: stage.workflowType,
      assignedDesignations: stage.assignedDesignations,
      assignedEmployees: stage.assignedEmployees,
      approvalMode: stage.approvalMode,
      order: stage.order,
      requiresAccountsReview: stage.requiresAccountsReview || false,
      accountsOfficers: stage.accountsOfficers || [],
      requiresMaintenanceReview: stage.requiresMaintenanceReview || false,
      maintenanceOfficers: stage.maintenanceOfficers || [],
      requiresCentralAccountsReview: stage.requiresCentralAccountsReview || false,
      centralAccountsOfficers: stage.centralAccountsOfficers || [],
    })
  }

  const handleSaveStage = () => {
    if (editingStageId) {
      updateWorkflowStage(editingStageId, formData)
    } else {
      addWorkflowStage(formData)
    }
    setIsAddingStage(false)
    setEditingStageId(null)
    setFormData({
      name: "",
      workflowType: selectedWorkflowType,
      assignedDesignations: [],
      assignedEmployees: [],
      approvalMode: "sequential",
      order: 1,
      requiresAccountsReview: false,
      accountsOfficers: [],
      requiresMaintenanceReview: false,
      maintenanceOfficers: [],
      requiresCentralAccountsReview: false,
      centralAccountsOfficers: [],
    })
  }

  const handleCancelEdit = () => {
    setIsAddingStage(false)
    setEditingStageId(null)
  }

  const handleDeleteStage = (stageId: number) => {
    deleteWorkflowStage(stageId)
  }

  const handleMoveStage = (stageId: number, direction: "up" | "down") => {
    const currentStage = workflowStages.find((s) => s.id === stageId)
    if (!currentStage) return

    const currentOrder = currentStage.order
    const newOrder = direction === "up" ? currentOrder - 1 : currentOrder + 1

    // Find the stage to swap with
    const swapStage = filteredStages.find((s) => s.order === newOrder)
    if (!swapStage) return

    // Swap orders
    updateWorkflowStage(currentStage.id, { order: newOrder })
    updateWorkflowStage(swapStage.id, { order: currentOrder })
  }

  const toggleDesignation = (designation: string) => {
    setFormData((prev) => ({
      ...prev,
      assignedDesignations: prev.assignedDesignations.includes(designation)
        ? prev.assignedDesignations.filter((d) => d !== designation)
        : [...prev.assignedDesignations, designation],
    }))
  }

  const toggleEmployee = (employeeId: string) => {
    setFormData((prev) => ({
      ...prev,
      assignedEmployees: prev.assignedEmployees.includes(employeeId)
        ? prev.assignedEmployees.filter((e) => e !== employeeId)
        : [...prev.assignedEmployees, employeeId],
    }))
  }

  const toggleAccountsOfficer = (employeeId: string) => {
    setFormData((prev) => ({
      ...prev,
      accountsOfficers: prev.accountsOfficers.includes(employeeId)
        ? prev.accountsOfficers.filter((e) => e !== employeeId)
        : [...prev.accountsOfficers, employeeId],
    }))
  }

  const toggleMaintenanceOfficer = (employeeId: string) => {
    setFormData((prev) => ({
      ...prev,
      maintenanceOfficers: prev.maintenanceOfficers.includes(employeeId)
        ? prev.maintenanceOfficers.filter((e) => e !== employeeId)
        : [...prev.maintenanceOfficers, employeeId],
    }))
  }

  const toggleCentralAccountsOfficer = (employeeId: string) => {
    setFormData((prev) => ({
      ...prev,
      centralAccountsOfficers: prev.centralAccountsOfficers.includes(employeeId)
        ? prev.centralAccountsOfficers.filter((e) => e !== employeeId)
        : [...prev.centralAccountsOfficers, employeeId],
    }))
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-4">
        <Button variant="outline" onClick={() => router.back()} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
      </div>

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-black">Workflow Setup</h1>
        <p className="text-black/70 mt-2">Configure approval stages for Pre-Approval and Notesheet workflows</p>
      </div>

      {/* Workflow Type Selector */}
      <div className="mb-6">
        <Label className="text-black">Workflow Type</Label>
        <Select value={selectedWorkflowType} onValueChange={(value) => setSelectedWorkflowType(value as WorkflowType)}>
          <SelectTrigger className="max-w-xs bg-white text-black">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectItem value="preapproval">Pre-Approval Workflow</SelectItem>
            <SelectItem value="notesheet">Notesheet Workflow</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Add Stage Button */}
      <div className="mb-4">
        <Button onClick={handleAddStage} className="bg-blue-600 hover:bg-blue-700 text-white">
          <Plus className="h-4 w-4 mr-2" />
          Add Stage
        </Button>
      </div>

      {/* Add form at top only when adding new stage (not editing) */}
      {isAddingStage && editingStageId === null && (
        <Card className="mb-6 bg-white border-black/10">
          <CardHeader>
            <CardTitle className="text-black">Add New Stage</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-black">Stage Name</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Department Head Review"
                className="bg-white text-black"
              />
            </div>

            <div>
              <Label className="text-black">Approval Mode</Label>
              <Select
                value={formData.approvalMode}
                onValueChange={(value) => setFormData({ ...formData, approvalMode: value as ApprovalMode })}
              >
                <SelectTrigger className="bg-white text-black">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="sequential">Sequential</SelectItem>
                  <SelectItem value="parallel">Parallel</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-black/60 mt-1">
                Sequential: Approvals happen in order. Parallel: All approvers must approve.
              </p>
            </div>

            <div>
              <Label className="text-black">Assigned Designations (Optional)</Label>
              <p className="text-sm text-black/60 mb-2">
                Select designations for this stage. All employees with these designations can approve.
              </p>
              <div className="flex flex-wrap gap-2">
                {designationOptions.map((designation) => (
                  <Badge
                    key={designation}
                    variant={formData.assignedDesignations.includes(designation) ? "default" : "outline"}
                    className={`cursor-pointer ${
                      formData.assignedDesignations.includes(designation)
                        ? "bg-blue-600 text-white"
                        : "bg-white text-black border-black/20"
                    }`}
                    onClick={() => toggleDesignation(designation)}
                  >
                    {designation}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-black">Assigned Employees (Optional)</Label>
              <p className="text-sm text-black/60 mb-2">
                Select specific employees for this stage. These employees can approve regardless of designation.
              </p>

              <Popover open={employeeDropdownOpen} onOpenChange={setEmployeeDropdownOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={employeeDropdownOpen}
                    className="w-full justify-between bg-white text-black border-black/20"
                  >
                    {formData.assignedEmployees.length > 0
                      ? `${formData.assignedEmployees.length} employee${formData.assignedEmployees.length > 1 ? "s" : ""} selected`
                      : "Select employees..."}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[400px] p-0 bg-white" align="start">
                  <Command className="bg-white">
                    <CommandInput placeholder="Search employees..." className="text-black" />
                    <CommandList>
                      <CommandEmpty className="text-black/60">No employee found.</CommandEmpty>
                      <CommandGroup className="max-h-64 overflow-auto">
                        {employees
                          .filter((emp) => emp.status === "active")
                          .map((employee) => (
                            <CommandItem
                              key={employee.id}
                              onSelect={() => toggleEmployee(employee.id)}
                              className="flex items-center gap-2 cursor-pointer text-black hover:bg-black/5"
                            >
                              <div
                                className={`flex h-4 w-4 items-center justify-center rounded-sm border ${
                                  formData.assignedEmployees.includes(employee.id)
                                    ? "bg-blue-600 border-blue-600"
                                    : "border-black/20"
                                }`}
                              >
                                {formData.assignedEmployees.includes(employee.id) && (
                                  <Check className="h-3 w-3 text-white" />
                                )}
                              </div>
                              <span>
                                {employee.fullName} ({employee.employeeCode})
                              </span>
                              <span className="text-xs text-black/50">- {employee.designation}</span>
                            </CommandItem>
                          ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>

              {formData.assignedEmployees.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.assignedEmployees.map((empId) => {
                    const emp = employees.find((e) => e.id === empId)
                    if (!emp) return null
                    return (
                      <Badge
                        key={empId}
                        className="bg-green-600 text-white cursor-pointer"
                        onClick={() => toggleEmployee(empId)}
                      >
                        {emp.fullName} ({emp.employeeCode})
                        <X className="h-3 w-3 ml-1" />
                      </Badge>
                    )
                  })}
                </div>
              )}
            </div>

            <div className="border-t pt-4 mt-4">
              <Label className="text-black font-semibold mb-3 block">Review Types (Optional)</Label>

              <div className="flex items-center gap-6 mb-4">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="requiresAccountsReview"
                    checked={formData.requiresAccountsReview}
                    onChange={(e) => setFormData((prev) => ({ ...prev, requiresAccountsReview: e.target.checked }))}
                    className="h-4 w-4 rounded border-black/20"
                  />
                  <Label htmlFor="requiresAccountsReview" className="text-black cursor-pointer text-sm">
                    Accounts Officer Review
                  </Label>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="requiresMaintenanceReview"
                    checked={formData.requiresMaintenanceReview}
                    onChange={(e) => setFormData((prev) => ({ ...prev, requiresMaintenanceReview: e.target.checked }))}
                    className="h-4 w-4 rounded border-black/20"
                  />
                  <Label htmlFor="requiresMaintenanceReview" className="text-black cursor-pointer text-sm">
                    Maintenance Officer Review
                  </Label>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="requiresCentralAccountsReview"
                    checked={formData.requiresCentralAccountsReview}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, requiresCentralAccountsReview: e.target.checked }))
                    }
                    className="h-4 w-4 rounded border-black/20"
                  />
                  <Label htmlFor="requiresCentralAccountsReview" className="text-black cursor-pointer text-sm">
                    Central Accounts Review
                  </Label>
                </div>
              </div>

              <p className="text-sm text-black/60 mb-4">
                Enable review types to allow specific officers to add specialized comments at this stage.
              </p>

              <div className="grid grid-cols-3 gap-4">
                {/* Accounts Officer Section */}
                {formData.requiresAccountsReview && (
                  <div>
                    <Label className="text-black text-sm mb-2 block">Assign Accounts Officers</Label>
                    <Popover open={accountsDropdownOpen} onOpenChange={setAccountsDropdownOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={accountsDropdownOpen}
                          className="w-full justify-between bg-white text-black border-black/20"
                        >
                          {formData.accountsOfficers.length > 0
                            ? `${formData.accountsOfficers.length} selected`
                            : "Select..."}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[400px] p-0 bg-white" align="start">
                        <Command className="bg-white">
                          <CommandInput placeholder="Search accounts officers..." className="text-black" />
                          <CommandList>
                            <CommandEmpty className="text-black/60">No accounts officer found.</CommandEmpty>
                            <CommandGroup className="max-h-64 overflow-auto">
                              {employees
                                .filter((emp) => emp.status === "active" && emp.designation === "Accounts Officer")
                                .map((employee) => (
                                  <CommandItem
                                    key={employee.id}
                                    onSelect={() => toggleAccountsOfficer(employee.id)}
                                    className="flex items-center gap-2 cursor-pointer text-black hover:bg-black/5"
                                  >
                                    <div
                                      className={`flex h-4 w-4 items-center justify-center rounded-sm border ${
                                        formData.accountsOfficers.includes(employee.id)
                                          ? "bg-purple-600 border-purple-600"
                                          : "border-black/20"
                                      }`}
                                    >
                                      {formData.accountsOfficers.includes(employee.id) && (
                                        <Check className="h-3 w-3 text-white" />
                                      )}
                                    </div>
                                    <span>
                                      {employee.fullName} ({employee.employeeCode})
                                    </span>
                                  </CommandItem>
                                ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>

                    {formData.accountsOfficers.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {formData.accountsOfficers.map((empId) => {
                          const emp = employees.find((e) => e.id === empId)
                          if (!emp) return null
                          return (
                            <Badge
                              key={empId}
                              className="bg-purple-600 text-white cursor-pointer text-xs"
                              onClick={() => toggleAccountsOfficer(empId)}
                            >
                              {emp.fullName}
                              <X className="h-3 w-3 ml-1" />
                            </Badge>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )}

                {/* Maintenance Officer Section */}
                {formData.requiresMaintenanceReview && (
                  <div>
                    <Label className="text-black text-sm mb-2 block">Assign Maintenance Officers</Label>
                    <Popover open={maintenanceDropdownOpen} onOpenChange={setMaintenanceDropdownOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={maintenanceDropdownOpen}
                          className="w-full justify-between bg-white text-black border-black/20"
                        >
                          {formData.maintenanceOfficers.length > 0
                            ? `${formData.maintenanceOfficers.length} selected`
                            : "Select..."}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[400px] p-0 bg-white" align="start">
                        <Command className="bg-white">
                          <CommandInput placeholder="Search maintenance officers..." className="text-black" />
                          <CommandList>
                            <CommandEmpty className="text-black/60">No maintenance officer found.</CommandEmpty>
                            <CommandGroup className="max-h-64 overflow-auto">
                              {employees
                                .filter((emp) => emp.status === "active" && emp.designation === "Maintenance Officer")
                                .map((employee) => (
                                  <CommandItem
                                    key={employee.id}
                                    onSelect={() => toggleMaintenanceOfficer(employee.id)}
                                    className="flex items-center gap-2 cursor-pointer text-black hover:bg-black/5"
                                  >
                                    <div
                                      className={`flex h-4 w-4 items-center justify-center rounded-sm border ${
                                        formData.maintenanceOfficers.includes(employee.id)
                                          ? "bg-orange-600 border-orange-600"
                                          : "border-black/20"
                                      }`}
                                    >
                                      {formData.maintenanceOfficers.includes(employee.id) && (
                                        <Check className="h-3 w-3 text-white" />
                                      )}
                                    </div>
                                    <span>
                                      {employee.fullName} ({employee.employeeCode})
                                    </span>
                                  </CommandItem>
                                ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>

                    {formData.maintenanceOfficers.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {formData.maintenanceOfficers.map((empId) => {
                          const emp = employees.find((e) => e.id === empId)
                          if (!emp) return null
                          return (
                            <Badge
                              key={empId}
                              className="bg-orange-600 text-white cursor-pointer text-xs"
                              onClick={() => toggleMaintenanceOfficer(empId)}
                            >
                              {emp.fullName}
                              <X className="h-3 w-3 ml-1" />
                            </Badge>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )}

                {/* Central Accounts Officer Section */}
                {formData.requiresCentralAccountsReview && (
                  <div>
                    <Label className="text-black text-sm mb-2 block">Assign Central Accounts Officers</Label>
                    <Popover open={centralAccountsDropdownOpen} onOpenChange={setCentralAccountsDropdownOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={centralAccountsDropdownOpen}
                          className="w-full justify-between bg-white text-black border-black/20"
                        >
                          {formData.centralAccountsOfficers.length > 0
                            ? `${formData.centralAccountsOfficers.length} selected`
                            : "Select..."}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[400px] p-0 bg-white" align="start">
                        <Command className="bg-white">
                          <CommandInput placeholder="Search central accounts officers..." className="text-black" />
                          <CommandList>
                            <CommandEmpty className="text-black/60">No central accounts officer found.</CommandEmpty>
                            <CommandGroup className="max-h-64 overflow-auto">
                              {employees
                                .filter((emp) => emp.status === "active" && emp.designation === "Accounts Officer")
                                .map((employee) => (
                                  <CommandItem
                                    key={employee.id}
                                    onSelect={() => toggleCentralAccountsOfficer(employee.id)}
                                    className="flex items-center gap-2 cursor-pointer text-black hover:bg-black/5"
                                  >
                                    <div
                                      className={`flex h-4 w-4 items-center justify-center rounded-sm border ${
                                        formData.centralAccountsOfficers.includes(employee.id)
                                          ? "bg-teal-600 border-teal-600"
                                          : "border-black/20"
                                      }`}
                                    >
                                      {formData.centralAccountsOfficers.includes(employee.id) && (
                                        <Check className="h-3 w-3 text-white" />
                                      )}
                                    </div>
                                    <span>
                                      {employee.fullName} ({employee.employeeCode})
                                    </span>
                                  </CommandItem>
                                ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>

                    {formData.centralAccountsOfficers.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {formData.centralAccountsOfficers.map((empId) => {
                          const emp = employees.find((e) => e.id === empId)
                          if (!emp) return null
                          return (
                            <Badge
                              key={empId}
                              className="bg-teal-600 text-white cursor-pointer text-xs"
                              onClick={() => toggleCentralAccountsOfficer(empId)}
                            >
                              {emp.fullName}
                              <X className="h-3 w-3 ml-1" />
                            </Badge>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleSaveStage} className="bg-blue-600 hover:bg-blue-700 text-white">
                <Save className="h-4 w-4 mr-2" />
                Save Stage
              </Button>
              <Button onClick={handleCancelEdit} variant="outline" className="bg-white text-black border-black/20">
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stages List */}
      <div className="space-y-4">
        {filteredStages.map((stage, index) => (
          <div key={stage.id}>
            {editingStageId === stage.id ? (
              <Card className="bg-blue-50 border-blue-300">
                <CardHeader>
                  <CardTitle className="text-black">Edit Stage {stage.order}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-black">Stage Name</Label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g., Department Head Review"
                      className="bg-white text-black"
                    />
                  </div>

                  <div>
                    <Label className="text-black">Approval Mode</Label>
                    <Select
                      value={formData.approvalMode}
                      onValueChange={(value) => setFormData({ ...formData, approvalMode: value as ApprovalMode })}
                    >
                      <SelectTrigger className="bg-white text-black">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        <SelectItem value="sequential">Sequential</SelectItem>
                        <SelectItem value="parallel">Parallel</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-black">Assigned Designations (Optional)</Label>
                    <p className="text-sm text-black/60 mb-2">
                      Select designations for this stage. All employees with these designations can approve.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {designationOptions.map((designation) => (
                        <Badge
                          key={designation}
                          variant={formData.assignedDesignations.includes(designation) ? "default" : "outline"}
                          className={`cursor-pointer ${
                            formData.assignedDesignations.includes(designation)
                              ? "bg-blue-600 text-white"
                              : "bg-white text-black border-black/20"
                          }`}
                          onClick={() => toggleDesignation(designation)}
                        >
                          {designation}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label className="text-black">Assigned Employees (Optional)</Label>
                    <p className="text-sm text-black/60 mb-2">
                      Select specific employees for this stage. These employees can approve regardless of designation.
                    </p>
                    <Popover open={employeeDropdownOpen} onOpenChange={setEmployeeDropdownOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={employeeDropdownOpen}
                          className="w-full justify-between bg-white text-black border-black/20 mt-2"
                        >
                          {formData.assignedEmployees.length > 0
                            ? `${formData.assignedEmployees.length} employee${formData.assignedEmployees.length > 1 ? "s" : ""} selected`
                            : "Select employees..."}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[400px] p-0 bg-white" align="start">
                        <Command className="bg-white">
                          <CommandInput placeholder="Search employees..." className="text-black" />
                          <CommandList>
                            <CommandEmpty className="text-black/60">No employee found.</CommandEmpty>
                            <CommandGroup className="max-h-64 overflow-auto">
                              {employees
                                .filter((emp) => emp.status === "active")
                                .map((employee) => (
                                  <CommandItem
                                    key={employee.id}
                                    onSelect={() => toggleEmployee(employee.id)}
                                    className="flex items-center gap-2 cursor-pointer text-black hover:bg-black/5"
                                  >
                                    <div
                                      className={`flex h-4 w-4 items-center justify-center rounded-sm border ${
                                        formData.assignedEmployees.includes(employee.id)
                                          ? "bg-blue-600 border-blue-600"
                                          : "border-black/20"
                                      }`}
                                    >
                                      {formData.assignedEmployees.includes(employee.id) && (
                                        <Check className="h-3 w-3 text-white" />
                                      )}
                                    </div>
                                    <span>
                                      {employee.fullName} ({employee.employeeCode})
                                    </span>
                                    <span className="text-xs text-black/50">- {employee.designation}</span>
                                  </CommandItem>
                                ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>

                    {formData.assignedEmployees.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {formData.assignedEmployees.map((empId) => {
                          const emp = employees.find((e) => e.id === empId)
                          if (!emp) return null
                          return (
                            <Badge
                              key={empId}
                              className="bg-green-600 text-white cursor-pointer"
                              onClick={() => toggleEmployee(empId)}
                            >
                              {emp.fullName} ({emp.employeeCode})
                              <X className="h-3 w-3 ml-1" />
                            </Badge>
                          )
                        })}
                      </div>
                    )}
                  </div>

                  <div className="border-t pt-4 mt-4">
                    <Label className="text-black font-semibold mb-3 block">Review Types (Optional)</Label>

                    <div className="flex items-center gap-6 mb-4">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="edit-requiresAccountsReview"
                          checked={formData.requiresAccountsReview}
                          onChange={(e) =>
                            setFormData((prev) => ({ ...prev, requiresAccountsReview: e.target.checked }))
                          }
                          className="h-4 w-4 rounded border-black/20"
                        />
                        <Label htmlFor="edit-requiresAccountsReview" className="text-black cursor-pointer text-sm">
                          Accounts Officer Review
                        </Label>
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="edit-requiresMaintenanceReview"
                          checked={formData.requiresMaintenanceReview}
                          onChange={(e) =>
                            setFormData((prev) => ({ ...prev, requiresMaintenanceReview: e.target.checked }))
                          }
                          className="h-4 w-4 rounded border-black/20"
                        />
                        <Label htmlFor="edit-requiresMaintenanceReview" className="text-black cursor-pointer text-sm">
                          Maintenance Officer Review
                        </Label>
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="edit-requiresCentralAccountsReview"
                          checked={formData.requiresCentralAccountsReview}
                          onChange={(e) =>
                            setFormData((prev) => ({ ...prev, requiresCentralAccountsReview: e.target.checked }))
                          }
                          className="h-4 w-4 rounded border-black/20"
                        />
                        <Label
                          htmlFor="edit-requiresCentralAccountsReview"
                          className="text-black cursor-pointer text-sm"
                        >
                          Central Accounts Review
                        </Label>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      {formData.requiresAccountsReview && (
                        <div>
                          <Label className="text-black text-sm mb-2 block">Assign Accounts Officers</Label>
                          <Popover open={accountsDropdownOpen} onOpenChange={setAccountsDropdownOpen}>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={accountsDropdownOpen}
                                className="w-full justify-between bg-white text-black border-black/20"
                              >
                                {formData.accountsOfficers.length > 0
                                  ? `${formData.accountsOfficers.length} selected`
                                  : "Select..."}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[400px] p-0 bg-white" align="start">
                              <Command className="bg-white">
                                <CommandInput placeholder="Search accounts officers..." className="text-black" />
                                <CommandList>
                                  <CommandEmpty className="text-black/60">No accounts officer found.</CommandEmpty>
                                  <CommandGroup className="max-h-64 overflow-auto">
                                    {employees
                                      .filter(
                                        (emp) => emp.status === "active" && emp.designation === "Accounts Officer",
                                      )
                                      .map((employee) => (
                                        <CommandItem
                                          key={employee.id}
                                          onSelect={() => toggleAccountsOfficer(employee.id)}
                                          className="flex items-center gap-2 cursor-pointer text-black hover:bg-black/5"
                                        >
                                          <div
                                            className={`flex h-4 w-4 items-center justify-center rounded-sm border ${
                                              formData.accountsOfficers.includes(employee.id)
                                                ? "bg-purple-600 border-purple-600"
                                                : "border-black/20"
                                            }`}
                                          >
                                            {formData.accountsOfficers.includes(employee.id) && (
                                              <Check className="h-3 w-3 text-white" />
                                            )}
                                          </div>
                                          <span>
                                            {employee.fullName} ({employee.employeeCode})
                                          </span>
                                        </CommandItem>
                                      ))}
                                  </CommandGroup>
                                </CommandList>
                              </Command>
                            </PopoverContent>
                          </Popover>

                          {formData.accountsOfficers.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                              {formData.accountsOfficers.map((empId) => {
                                const emp = employees.find((e) => e.id === empId)
                                if (!emp) return null
                                return (
                                  <Badge
                                    key={empId}
                                    className="bg-purple-600 text-white cursor-pointer text-xs"
                                    onClick={() => toggleAccountsOfficer(empId)}
                                  >
                                    {emp.fullName}
                                    <X className="h-3 w-3 ml-1" />
                                  </Badge>
                                )
                              })}
                            </div>
                          )}
                        </div>
                      )}

                      {formData.requiresMaintenanceReview && (
                        <div>
                          <Label className="text-black text-sm mb-2 block">Assign Maintenance Officers</Label>
                          <Popover open={maintenanceDropdownOpen} onOpenChange={setMaintenanceDropdownOpen}>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={maintenanceDropdownOpen}
                                className="w-full justify-between bg-white text-black border-black/20"
                              >
                                {formData.maintenanceOfficers.length > 0
                                  ? `${formData.maintenanceOfficers.length} selected`
                                  : "Select..."}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[400px] p-0 bg-white" align="start">
                              <Command className="bg-white">
                                <CommandInput placeholder="Search maintenance officers..." className="text-black" />
                                <CommandList>
                                  <CommandEmpty className="text-black/60">No maintenance officer found.</CommandEmpty>
                                  <CommandGroup className="max-h-64 overflow-auto">
                                    {employees
                                      .filter(
                                        (emp) => emp.status === "active" && emp.designation === "Maintenance Officer",
                                      )
                                      .map((employee) => (
                                        <CommandItem
                                          key={employee.id}
                                          onSelect={() => toggleMaintenanceOfficer(employee.id)}
                                          className="flex items-center gap-2 cursor-pointer text-black hover:bg-black/5"
                                        >
                                          <div
                                            className={`flex h-4 w-4 items-center justify-center rounded-sm border ${
                                              formData.maintenanceOfficers.includes(employee.id)
                                                ? "bg-orange-600 border-orange-600"
                                                : "border-black/20"
                                            }`}
                                          >
                                            {formData.maintenanceOfficers.includes(employee.id) && (
                                              <Check className="h-3 w-3 text-white" />
                                            )}
                                          </div>
                                          <span>
                                            {employee.fullName} ({employee.employeeCode})
                                          </span>
                                        </CommandItem>
                                      ))}
                                  </CommandGroup>
                                </CommandList>
                              </Command>
                            </PopoverContent>
                          </Popover>

                          {formData.maintenanceOfficers.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                              {formData.maintenanceOfficers.map((empId) => {
                                const emp = employees.find((e) => e.id === empId)
                                if (!emp) return null
                                return (
                                  <Badge
                                    key={empId}
                                    className="bg-orange-600 text-white cursor-pointer text-xs"
                                    onClick={() => toggleMaintenanceOfficer(empId)}
                                  >
                                    {emp.fullName}
                                    <X className="h-3 w-3 ml-1" />
                                  </Badge>
                                )
                              })}
                            </div>
                          )}
                        </div>
                      )}

                      {formData.requiresCentralAccountsReview && (
                        <div>
                          <Label className="text-black text-sm mb-2 block">Assign Central Accounts Officers</Label>
                          <Popover open={centralAccountsDropdownOpen} onOpenChange={setCentralAccountsDropdownOpen}>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={centralAccountsDropdownOpen}
                                className="w-full justify-between bg-white text-black border-black/20"
                              >
                                {formData.centralAccountsOfficers.length > 0
                                  ? `${formData.centralAccountsOfficers.length} selected`
                                  : "Select..."}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[400px] p-0 bg-white" align="start">
                              <Command className="bg-white">
                                <CommandInput
                                  placeholder="Search central accounts officers..."
                                  className="text-black"
                                />
                                <CommandList>
                                  <CommandEmpty className="text-black/60">
                                    No central accounts officer found.
                                  </CommandEmpty>
                                  <CommandGroup className="max-h-64 overflow-auto">
                                    {employees
                                      .filter(
                                        (emp) => emp.status === "active" && emp.designation === "Accounts Officer",
                                      )
                                      .map((employee) => (
                                        <CommandItem
                                          key={employee.id}
                                          onSelect={() => toggleCentralAccountsOfficer(employee.id)}
                                          className="flex items-center gap-2 cursor-pointer text-black hover:bg-black/5"
                                        >
                                          <div
                                            className={`flex h-4 w-4 items-center justify-center rounded-sm border ${
                                              formData.centralAccountsOfficers.includes(employee.id)
                                                ? "bg-teal-600 border-teal-600"
                                                : "border-black/20"
                                            }`}
                                          >
                                            {formData.centralAccountsOfficers.includes(employee.id) && (
                                              <Check className="h-3 w-3 text-white" />
                                            )}
                                          </div>
                                          <span>
                                            {employee.fullName} ({employee.employeeCode})
                                          </span>
                                        </CommandItem>
                                      ))}
                                  </CommandGroup>
                                </CommandList>
                              </Command>
                            </PopoverContent>
                          </Popover>

                          {formData.centralAccountsOfficers.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                              {formData.centralAccountsOfficers.map((empId) => {
                                const emp = employees.find((e) => e.id === empId)
                                if (!emp) return null
                                return (
                                  <Badge
                                    key={empId}
                                    className="bg-teal-600 text-white cursor-pointer text-xs"
                                    onClick={() => toggleCentralAccountsOfficer(empId)}
                                  >
                                    {emp.fullName}
                                    <X className="h-3 w-3 ml-1" />
                                  </Badge>
                                )
                              })}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={handleSaveStage} className="bg-blue-600 hover:bg-blue-700 text-white">
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </Button>
                    <Button
                      onClick={handleCancelEdit}
                      variant="outline"
                      className="bg-white text-black border-black/20"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-white border-black/10">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 flex-wrap">
                        <Badge className="bg-blue-600 text-white">Stage {stage.order}</Badge>
                        <CardTitle className="text-black">{stage.name}</CardTitle>
                        <Badge variant="outline" className="bg-white text-black border-black/20">
                          {stage.approvalMode}
                        </Badge>
                        {stage.requiresAccountsReview && (
                          <Badge className="bg-purple-600 text-white">Accounts Review</Badge>
                        )}
                        {stage.requiresMaintenanceReview && (
                          <Badge className="bg-orange-600 text-white">Maintenance Review</Badge>
                        )}
                        {stage.requiresCentralAccountsReview && (
                          <Badge className="bg-teal-600 text-white">Central Accounts Review</Badge>
                        )}
                      </div>
                      <CardDescription className="mt-2 text-black/70">
                        {stage.assignedDesignations.length > 0 && (
                          <div>
                            <span className="font-semibold">Designations:</span> {stage.assignedDesignations.join(", ")}
                          </div>
                        )}
                        {stage.assignedEmployees.length > 0 && (
                          <div className="mt-1">
                            <span className="font-semibold">Employees:</span>{" "}
                            {stage.assignedEmployees
                              .map((empId) => {
                                const emp = employees.find((e) => e.id === empId)
                                return emp ? `${emp.fullName} (${emp.employeeCode})` : empId
                              })
                              .join(", ")}
                          </div>
                        )}
                        {stage.accountsOfficers && stage.accountsOfficers.length > 0 && (
                          <div className="mt-1">
                            <span className="font-semibold text-purple-700">Accounts Officers:</span>{" "}
                            {stage.accountsOfficers
                              .map((empId) => {
                                const emp = employees.find((e) => e.id === empId)
                                return emp ? `${emp.fullName}` : empId
                              })
                              .join(", ")}
                          </div>
                        )}
                        {stage.maintenanceOfficers && stage.maintenanceOfficers.length > 0 && (
                          <div className="mt-1">
                            <span className="font-semibold text-orange-700">Maintenance Officers:</span>{" "}
                            {stage.maintenanceOfficers
                              .map((empId) => {
                                const emp = employees.find((e) => e.id === empId)
                                return emp ? `${emp.fullName}` : empId
                              })
                              .join(", ")}
                          </div>
                        )}
                        {stage.centralAccountsOfficers && stage.centralAccountsOfficers.length > 0 && (
                          <div className="mt-1">
                            <span className="font-semibold text-teal-700">Central Accounts Officers:</span>{" "}
                            {stage.centralAccountsOfficers
                              .map((empId) => {
                                const emp = employees.find((e) => e.id === empId)
                                return emp ? `${emp.fullName}` : empId
                              })
                              .join(", ")}
                          </div>
                        )}
                        {stage.assignedDesignations.length === 0 && stage.assignedEmployees.length === 0 && (
                          <div className="text-red-600">No assignees configured</div>
                        )}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleMoveStage(stage.id, "up")}
                        disabled={index === 0}
                      >
                        <MoveUp className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleMoveStage(stage.id, "down")}
                        disabled={index === filteredStages.length - 1}
                      >
                        <MoveDown className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleEditStage(stage)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteStage(stage.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            )}
          </div>
        ))}

        {filteredStages.length === 0 && (
          <Card className="bg-white border-black/10">
            <CardContent className="py-12 text-center">
              <p className="text-black/60">No stages configured for this workflow. Click "Add Stage" to get started.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
