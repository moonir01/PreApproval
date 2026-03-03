"use client"

import { useState } from "react"
import { Plus, Edit, Trash2, MoveUp, MoveDown, Save, X, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useData } from "@/lib/data-context"
import { useRouter } from "next/navigation"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"

type ApprovalMode = "sequential" | "parallel"

const designationOptions = [
  "Commander",
  "Deputy Commander",
  "Wing Head",
  "Dept Head",
  "Principal Staff",
  "Maintenance Officer",
  "Accounts Officer",
]

export default function ApprovalSetupPage() {
  const router = useRouter()
  const { workflowStages, deleteWorkflowStage, updateWorkflowStage, employees } = useData()
  const [selectedWorkflowType, setSelectedWorkflowType] = useState<"preapproval" | "notesheet">("preapproval")
  const [editingStageId, setEditingStageId] = useState<number | null>(null)

  const [editStageName, setEditStageName] = useState("")
  const [editApprovalMode, setEditApprovalMode] = useState<ApprovalMode>("sequential")
  const [editAssignedDesignations, setEditAssignedDesignations] = useState<string[]>([])
  const [editAssignedEmployees, setEditAssignedEmployees] = useState<string[]>([])
  const [editRequiresAccountsReview, setEditRequiresAccountsReview] = useState(false)
  const [editRequiresMaintenanceReview, setEditRequiresMaintenanceReview] = useState(false)
  const [editRequiresCentralAccountsReview, setEditRequiresCentralAccountsReview] = useState(false)
  const [editAccountsOfficers, setEditAccountsOfficers] = useState<string[]>([])
  const [editMaintenanceOfficers, setEditMaintenanceOfficers] = useState<string[]>([])
  const [editCentralAccountsOfficers, setEditCentralAccountsOfficers] = useState<string[]>([])

  const [employeeDropdownOpen, setEmployeeDropdownOpen] = useState(false)
  const [accountsDropdownOpen, setAccountsDropdownOpen] = useState(false)
  const [maintenanceDropdownOpen, setMaintenanceDropdownOpen] = useState(false)
  const [centralAccountsDropdownOpen, setCentralAccountsDropdownOpen] = useState(false)

  const filteredStages = workflowStages
    .filter((stage) => stage.workflowType === selectedWorkflowType)
    .sort((a, b) => a.order - b.order)

  const handleStartEdit = (stageId: number) => {
    const stage = workflowStages.find((s) => s.id === stageId)
    if (!stage) return

    setEditingStageId(stageId)
    setEditStageName(stage.name)
    setEditApprovalMode(stage.approvalMode)
    setEditAssignedDesignations(stage.assignedDesignations || [])
    setEditAssignedEmployees(stage.assignedEmployees || [])
    setEditRequiresAccountsReview(stage.requiresAccountsReview || false)
    setEditRequiresMaintenanceReview(stage.requiresMaintenanceReview || false)
    setEditRequiresCentralAccountsReview(stage.requiresCentralAccountsReview || false)
    setEditAccountsOfficers(stage.accountsOfficers || [])
    setEditMaintenanceOfficers(stage.maintenanceOfficers || [])
    setEditCentralAccountsOfficers(stage.centralAccountsOfficers || [])
  }

  const handleSaveEdit = () => {
    if (!editStageName.trim()) {
      alert("Please enter a stage name")
      return
    }

    if (editingStageId) {
      updateWorkflowStage(editingStageId, {
        name: editStageName,
        assignedDesignations: editAssignedDesignations,
        assignedEmployees: editAssignedEmployees,
        approvalMode: editApprovalMode,
        requiresAccountsReview: editRequiresAccountsReview,
        accountsOfficers: editAccountsOfficers,
        requiresMaintenanceReview: editRequiresMaintenanceReview,
        maintenanceOfficers: editMaintenanceOfficers,
        requiresCentralAccountsReview: editRequiresCentralAccountsReview,
        centralAccountsOfficers: editCentralAccountsOfficers,
      })
      setEditingStageId(null)
    }
  }

  const handleCancelEdit = () => {
    setEditingStageId(null)
  }

  const toggleEditDesignation = (designation: string) => {
    setEditAssignedDesignations((prev) =>
      prev.includes(designation) ? prev.filter((d) => d !== designation) : [...prev, designation],
    )
  }

  const toggleEditEmployee = (employeeId: string) => {
    setEditAssignedEmployees((prev) =>
      prev.includes(employeeId) ? prev.filter((e) => e !== employeeId) : [...prev, employeeId],
    )
  }

  const toggleEditOfficer = (employeeId: string, type: "accounts" | "maintenance" | "central") => {
    if (type === "accounts") {
      setEditAccountsOfficers((prev) =>
        prev.includes(employeeId) ? prev.filter((e) => e !== employeeId) : [...prev, employeeId],
      )
    } else if (type === "maintenance") {
      setEditMaintenanceOfficers((prev) =>
        prev.includes(employeeId) ? prev.filter((e) => e !== employeeId) : [...prev, employeeId],
      )
    } else {
      setEditCentralAccountsOfficers((prev) =>
        prev.includes(employeeId) ? prev.filter((e) => e !== employeeId) : [...prev, employeeId],
      )
    }
  }

  const handleDeleteStage = (stageId: number) => {
    if (confirm("Are you sure you want to delete this stage?")) {
      deleteWorkflowStage(stageId)
    }
  }

  const handleMoveStage = (stageId: number, direction: "up" | "down") => {
    const currentStage = workflowStages.find((s) => s.id === stageId)
    if (!currentStage) return

    const currentOrder = currentStage.order
    const newOrder = direction === "up" ? currentOrder - 1 : currentOrder + 1

    const swapStage = filteredStages.find((s) => s.order === newOrder)
    if (!swapStage) return

    updateWorkflowStage(currentStage.id, { order: newOrder })
    updateWorkflowStage(swapStage.id, { order: currentOrder })
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-black">Workflow Setup</h1>
        <p className="text-black/70 mt-2">Configure approval stages for Pre-Approval and Notesheet workflows</p>
      </div>

      {/* Workflow Type Selector */}
      <div className="mb-6">
        <label className="text-sm font-medium text-black mb-2 block">Workflow Type</label>
        <Select
          value={selectedWorkflowType}
          onValueChange={(value) => setSelectedWorkflowType(value as "preapproval" | "notesheet")}
        >
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
        <Button
          onClick={() => router.push("/setup/approval-setup/create")}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Stage
        </Button>
      </div>

      {/* Stages List */}
      <div className="space-y-4">
        {filteredStages.length === 0 ? (
          <div className="text-center py-12 text-black/60">
            <p>No approval stages configured for this workflow type.</p>
            <p className="text-sm mt-2">Click "Add Stage" to create your first stage.</p>
          </div>
        ) : (
          filteredStages.map((stage, index) => (
            <Card key={stage.id} className="bg-white border-black/10">
              {editingStageId === stage.id ? (
                // Expanded Edit Form
                <div className="p-6 space-y-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-black">Edit Stage {stage.order}</h3>
                  </div>

                  {/* Stage Name */}
                  <div>
                    <Label className="text-black">Stage Name</Label>
                    <Input
                      value={editStageName}
                      onChange={(e) => setEditStageName(e.target.value)}
                      placeholder="e.g., Department Head Review"
                      className="bg-white text-black mt-2"
                    />
                  </div>

                  {/* Approval Mode */}
                  <div>
                    <Label className="text-black">Approval Mode</Label>
                    <Select
                      value={editApprovalMode}
                      onValueChange={(value) => setEditApprovalMode(value as ApprovalMode)}
                    >
                      <SelectTrigger className="bg-white text-black mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        <SelectItem value="sequential">Sequential</SelectItem>
                        <SelectItem value="parallel">Parallel</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-black/60 mt-2">
                      Sequential: Approvals happen in order. Parallel: All approvers must approve.
                    </p>
                  </div>

                  {/* Assigned Designations */}
                  <div>
                    <Label className="text-black">Assigned Designations (Optional)</Label>
                    <p className="text-sm text-black/60 mt-1 mb-3">
                      Select designations for this stage. All employees with these designations can approve.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {designationOptions.map((designation) => (
                        <Badge
                          key={designation}
                          variant={editAssignedDesignations.includes(designation) ? "default" : "outline"}
                          className={`cursor-pointer ${
                            editAssignedDesignations.includes(designation)
                              ? "bg-blue-600 text-white"
                              : "bg-white text-black border-black/20"
                          }`}
                          onClick={() => toggleEditDesignation(designation)}
                        >
                          {designation}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Assigned Employees */}
                  <div>
                    <Label className="text-black">Assigned Employees (Optional)</Label>
                    <p className="text-sm text-black/60 mt-1 mb-3">
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
                          {editAssignedEmployees.length > 0
                            ? `${editAssignedEmployees.length} employee${editAssignedEmployees.length > 1 ? "s" : ""} selected`
                            : "Select employees..."}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[500px] p-0 bg-white" align="start">
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
                                    onSelect={() => toggleEditEmployee(employee.id)}
                                    className="flex items-center gap-2 cursor-pointer text-black hover:bg-black/5"
                                  >
                                    <div
                                      className={`flex h-4 w-4 items-center justify-center rounded-sm border ${
                                        editAssignedEmployees.includes(employee.id)
                                          ? "bg-blue-600 border-blue-600"
                                          : "border-black/20"
                                      }`}
                                    >
                                      {editAssignedEmployees.includes(employee.id) && (
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
                  </div>

                  {/* Review Types */}
                  <div className="border-t pt-6">
                    <Label className="text-black font-semibold mb-3 block">Review Types (Optional)</Label>

                    <div className="flex items-center gap-6 mb-4">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="editRequiresAccountsReview"
                          checked={editRequiresAccountsReview}
                          onChange={(e) => setEditRequiresAccountsReview(e.target.checked)}
                          className="h-4 w-4 rounded border-black/20"
                        />
                        <Label htmlFor="editRequiresAccountsReview" className="text-black cursor-pointer text-sm">
                          Accounts Officer Review
                        </Label>
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="editRequiresMaintenanceReview"
                          checked={editRequiresMaintenanceReview}
                          onChange={(e) => setEditRequiresMaintenanceReview(e.target.checked)}
                          className="h-4 w-4 rounded border-black/20"
                        />
                        <Label htmlFor="editRequiresMaintenanceReview" className="text-black cursor-pointer text-sm">
                          Maintenance Officer Review
                        </Label>
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="editRequiresCentralAccountsReview"
                          checked={editRequiresCentralAccountsReview}
                          onChange={(e) => setEditRequiresCentralAccountsReview(e.target.checked)}
                          className="h-4 w-4 rounded border-black/20"
                        />
                        <Label
                          htmlFor="editRequiresCentralAccountsReview"
                          className="text-black cursor-pointer text-sm"
                        >
                          Central Accounts Review
                        </Label>
                      </div>
                    </div>

                    <p className="text-sm text-black/60 mb-4">
                      Enable review types to allow specific officers to add specialized comments at this stage.
                    </p>

                    {/* Officer Assignments */}
                    <div className="grid grid-cols-3 gap-4">
                      {/* Accounts Officers */}
                      {editRequiresAccountsReview && (
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
                                {editAccountsOfficers.length > 0
                                  ? `${editAccountsOfficers.length} selected`
                                  : "Select..."}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[350px] p-0 bg-white" align="start">
                              <Command className="bg-white">
                                <CommandInput placeholder="Search officers..." className="text-black" />
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
                                          onSelect={() => toggleEditOfficer(employee.id, "accounts")}
                                          className="flex items-center gap-2 cursor-pointer text-black hover:bg-black/5"
                                        >
                                          <div
                                            className={`flex h-4 w-4 items-center justify-center rounded-sm border ${
                                              editAccountsOfficers.includes(employee.id)
                                                ? "bg-purple-600 border-purple-600"
                                                : "border-black/20"
                                            }`}
                                          >
                                            {editAccountsOfficers.includes(employee.id) && (
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
                        </div>
                      )}

                      {/* Maintenance Officers */}
                      {editRequiresMaintenanceReview && (
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
                                {editMaintenanceOfficers.length > 0
                                  ? `${editMaintenanceOfficers.length} selected`
                                  : "Select..."}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[350px] p-0 bg-white" align="start">
                              <Command className="bg-white">
                                <CommandInput placeholder="Search officers..." className="text-black" />
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
                                          onSelect={() => toggleEditOfficer(employee.id, "maintenance")}
                                          className="flex items-center gap-2 cursor-pointer text-black hover:bg-black/5"
                                        >
                                          <div
                                            className={`flex h-4 w-4 items-center justify-center rounded-sm border ${
                                              editMaintenanceOfficers.includes(employee.id)
                                                ? "bg-orange-600 border-orange-600"
                                                : "border-black/20"
                                            }`}
                                          >
                                            {editMaintenanceOfficers.includes(employee.id) && (
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
                        </div>
                      )}

                      {/* Central Accounts Officers */}
                      {editRequiresCentralAccountsReview && (
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
                                {editCentralAccountsOfficers.length > 0
                                  ? `${editCentralAccountsOfficers.length} selected`
                                  : "Select..."}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[350px] p-0 bg-white" align="start">
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
                                          onSelect={() => toggleEditOfficer(employee.id, "central")}
                                          className="flex items-center gap-2 cursor-pointer text-black hover:bg-black/5"
                                        >
                                          <div
                                            className={`flex h-4 w-4 items-center justify-center rounded-sm border ${
                                              editCentralAccountsOfficers.includes(employee.id)
                                                ? "bg-teal-600 border-teal-600"
                                                : "border-black/20"
                                            }`}
                                          >
                                            {editCentralAccountsOfficers.includes(employee.id) && (
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
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Save and Cancel Buttons */}
                  <div className="flex gap-2 pt-4 border-t">
                    <Button onClick={handleSaveEdit} className="bg-blue-600 hover:bg-blue-700 text-white">
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </Button>
                    <Button
                      onClick={handleCancelEdit}
                      variant="outline"
                      className="text-black border-black/20 bg-transparent"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                // Collapsed View
                <div className="p-4 flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    <Badge className="bg-blue-600 text-white font-semibold">Stage {stage.order}</Badge>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold text-black">{stage.name}</h3>
                        <Badge variant="outline" className="text-xs">
                          {stage.approvalMode}
                        </Badge>
                      </div>

                      {stage.assignedDesignations && stage.assignedDesignations.length > 0 && (
                        <div className="mb-2">
                          <span className="text-sm font-medium text-black">Designations: </span>
                          <span className="text-sm text-black/70">{stage.assignedDesignations.join(", ")}</span>
                        </div>
                      )}

                      {stage.assignedEmployees && stage.assignedEmployees.length > 0 && (
                        <div className="mb-2">
                          <span className="text-sm font-medium text-black">Employees: </span>
                          <span className="text-sm text-black/70">
                            {stage.assignedEmployees
                              .map((empId) => {
                                const emp = employees.find((e) => e.id === empId)
                                return emp ? emp.employeeCode : empId
                              })
                              .join(", ")}
                          </span>
                        </div>
                      )}

                      {/* Review Types */}
                      <div className="flex flex-wrap gap-2 mt-3">
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

                      {/* Officer Assignments */}
                      {stage.accountsOfficers?.length ||
                      stage.maintenanceOfficers?.length ||
                      stage.centralAccountsOfficers?.length ? (
                        <div className="mt-3 space-y-1 text-sm">
                          {stage.accountsOfficers && stage.accountsOfficers.length > 0 && (
                            <div>
                              <span className="font-medium text-purple-600">Accounts Officers: </span>
                              <span className="text-black/70">
                                {stage.accountsOfficers
                                  .map((empId) => {
                                    const emp = employees.find((e) => e.id === empId)
                                    return emp ? emp.employeeCode : empId
                                  })
                                  .join(", ")}
                              </span>
                            </div>
                          )}
                          {stage.maintenanceOfficers && stage.maintenanceOfficers.length > 0 && (
                            <div>
                              <span className="font-medium text-orange-600">Maintenance Officers: </span>
                              <span className="text-black/70">
                                {stage.maintenanceOfficers
                                  .map((empId) => {
                                    const emp = employees.find((e) => e.id === empId)
                                    return emp ? emp.employeeCode : empId
                                  })
                                  .join(", ")}
                              </span>
                            </div>
                          )}
                          {stage.centralAccountsOfficers && stage.centralAccountsOfficers.length > 0 && (
                            <div>
                              <span className="font-medium text-teal-600">Central Accounts Officers: </span>
                              <span className="text-black/70">
                                {stage.centralAccountsOfficers
                                  .map((empId) => {
                                    const emp = employees.find((e) => e.id === empId)
                                    return emp ? emp.employeeCode : empId
                                  })
                                  .join(", ")}
                              </span>
                            </div>
                          )}
                        </div>
                      ) : null}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleMoveStage(stage.id, "up")}
                      disabled={index === 0}
                      className="text-black hover:bg-black/5"
                    >
                      <MoveUp className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleMoveStage(stage.id, "down")}
                      disabled={index === filteredStages.length - 1}
                      className="text-black hover:bg-black/5"
                    >
                      <MoveDown className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleStartEdit(stage.id)}
                      className="text-black hover:bg-black/5"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteStage(stage.id)}
                      className="text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
