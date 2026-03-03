"use client"

import { useState } from "react"
import { ArrowLeft, Save, X, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
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

interface WorkflowStage {
  id: number
  order: number
  name: string
  assignedDesignations?: string[]
  assignedEmployees?: string[]
  approvalMode: ApprovalMode
  requiresAccountsReview?: boolean
  accountsOfficers?: string[]
  requiresMaintenanceReview?: boolean
  maintenanceOfficers?: string[]
  requiresCentralAccountsReview?: boolean
  centralAccountsOfficers?: string[]
}

interface ApprovalSetupEditClientProps {
  stage: WorkflowStage
}

export default function ApprovalSetupEditClient({ stage }: ApprovalSetupEditClientProps) {
  const { employees, updateWorkflowStage } = useData()
  const router = useRouter()

  const [stageName, setStageName] = useState(stage.name)
  const [approvalMode, setApprovalMode] = useState<ApprovalMode>(stage.approvalMode)
  const [assignedDesignations, setAssignedDesignations] = useState<string[]>(stage.assignedDesignations || [])
  const [assignedEmployees, setAssignedEmployees] = useState<string[]>(stage.assignedEmployees || [])
  const [employeeDropdownOpen, setEmployeeDropdownOpen] = useState(false)

  // Review types
  const [requiresAccountsReview, setRequiresAccountsReview] = useState(stage.requiresAccountsReview || false)
  const [requiresMaintenanceReview, setRequiresMaintenanceReview] = useState(stage.requiresMaintenanceReview || false)
  const [requiresCentralAccountsReview, setRequiresCentralAccountsReview] = useState(
    stage.requiresCentralAccountsReview || false,
  )

  // Officers
  const [accountsOfficers, setAccountsOfficers] = useState<string[]>(stage.accountsOfficers || [])
  const [maintenanceOfficers, setMaintenanceOfficers] = useState<string[]>(stage.maintenanceOfficers || [])
  const [centralAccountsOfficers, setCentralAccountsOfficers] = useState<string[]>(stage.centralAccountsOfficers || [])

  const [accountsDropdownOpen, setAccountsDropdownOpen] = useState(false)
  const [maintenanceDropdownOpen, setMaintenanceDropdownOpen] = useState(false)
  const [centralAccountsDropdownOpen, setCentralAccountsDropdownOpen] = useState(false)

  const toggleDesignation = (designation: string) => {
    setAssignedDesignations((prev) =>
      prev.includes(designation) ? prev.filter((d) => d !== designation) : [...prev, designation],
    )
  }

  const toggleEmployee = (employeeId: string) => {
    setAssignedEmployees((prev) =>
      prev.includes(employeeId) ? prev.filter((e) => e !== employeeId) : [...prev, employeeId],
    )
  }

  const toggleOfficer = (employeeId: string, type: "accounts" | "maintenance" | "central") => {
    if (type === "accounts") {
      setAccountsOfficers((prev) =>
        prev.includes(employeeId) ? prev.filter((e) => e !== employeeId) : [...prev, employeeId],
      )
    } else if (type === "maintenance") {
      setMaintenanceOfficers((prev) =>
        prev.includes(employeeId) ? prev.filter((e) => e !== employeeId) : [...prev, employeeId],
      )
    } else {
      setCentralAccountsOfficers((prev) =>
        prev.includes(employeeId) ? prev.filter((e) => e !== employeeId) : [...prev, employeeId],
      )
    }
  }

  const handleSave = () => {
    if (!stageName.trim()) {
      alert("Please enter a stage name")
      return
    }

    // Update stage
    updateWorkflowStage(stage.id, {
      name: stageName,
      assignedDesignations,
      assignedEmployees,
      approvalMode,
      requiresAccountsReview,
      accountsOfficers,
      requiresMaintenanceReview,
      maintenanceOfficers,
      requiresCentralAccountsReview,
      centralAccountsOfficers,
    })

    router.push("/setup/approval-setup")
  }

  const handleCancel = () => {
    router.push("/setup/approval-setup")
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-4">
        <Button variant="outline" onClick={() => router.back()} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
      </div>

      <Card className="bg-white border-black/10">
        <CardHeader>
          <CardTitle className="text-black">Edit Stage {stage.order}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Stage Name */}
          <div>
            <Label className="text-black">Stage Name</Label>
            <Input
              value={stageName}
              onChange={(e) => setStageName(e.target.value)}
              placeholder="e.g., Department Head Review"
              className="bg-white text-black mt-2"
            />
          </div>

          {/* Approval Mode */}
          <div>
            <Label className="text-black">Approval Mode</Label>
            <Select value={approvalMode} onValueChange={(value) => setApprovalMode(value as ApprovalMode)}>
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
                  variant={assignedDesignations.includes(designation) ? "default" : "outline"}
                  className={`cursor-pointer ${
                    assignedDesignations.includes(designation)
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
                  {assignedEmployees.length > 0
                    ? `${assignedEmployees.length} employee${assignedEmployees.length > 1 ? "s" : ""} selected`
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
                            onSelect={() => toggleEmployee(employee.id)}
                            className="flex items-center gap-2 cursor-pointer text-black hover:bg-black/5"
                          >
                            <div
                              className={`flex h-4 w-4 items-center justify-center rounded-sm border ${
                                assignedEmployees.includes(employee.id)
                                  ? "bg-blue-600 border-blue-600"
                                  : "border-black/20"
                              }`}
                            >
                              {assignedEmployees.includes(employee.id) && <Check className="h-3 w-3 text-white" />}
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
          <div className="border-t pt-6 mt-6">
            <Label className="text-black font-semibold mb-3 block">Review Types (Optional)</Label>

            <div className="flex items-center gap-6 mb-4">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="requiresAccountsReview"
                  checked={requiresAccountsReview}
                  onChange={(e) => setRequiresAccountsReview(e.target.checked)}
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
                  checked={requiresMaintenanceReview}
                  onChange={(e) => setRequiresMaintenanceReview(e.target.checked)}
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
                  checked={requiresCentralAccountsReview}
                  onChange={(e) => setRequiresCentralAccountsReview(e.target.checked)}
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

            {/* Officer Assignments */}
            <div className="grid grid-cols-3 gap-4">
              {/* Accounts Officers */}
              {requiresAccountsReview && (
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
                        {accountsOfficers.length > 0 ? `${accountsOfficers.length} selected` : "Select..."}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[350px] p-0 bg-white" align="start">
                      <Command className="bg-white">
                        <CommandInput placeholder="Search officers..." className="text-black" />
                        <CommandList>
                          <CommandEmpty className="text-black/60">No accounts officer found.</CommandEmpty>
                          <CommandGroup className="max-h-64 overflow-auto">
                            {employees
                              .filter((emp) => emp.status === "active" && emp.designation === "Accounts Officer")
                              .map((employee) => (
                                <CommandItem
                                  key={employee.id}
                                  onSelect={() => toggleOfficer(employee.id, "accounts")}
                                  className="flex items-center gap-2 cursor-pointer text-black hover:bg-black/5"
                                >
                                  <div
                                    className={`flex h-4 w-4 items-center justify-center rounded-sm border ${
                                      accountsOfficers.includes(employee.id)
                                        ? "bg-purple-600 border-purple-600"
                                        : "border-black/20"
                                    }`}
                                  >
                                    {accountsOfficers.includes(employee.id) && <Check className="h-3 w-3 text-white" />}
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
              {requiresMaintenanceReview && (
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
                        {maintenanceOfficers.length > 0 ? `${maintenanceOfficers.length} selected` : "Select..."}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[350px] p-0 bg-white" align="start">
                      <Command className="bg-white">
                        <CommandInput placeholder="Search officers..." className="text-black" />
                        <CommandList>
                          <CommandEmpty className="text-black/60">No maintenance officer found.</CommandEmpty>
                          <CommandGroup className="max-h-64 overflow-auto">
                            {employees
                              .filter((emp) => emp.status === "active" && emp.designation === "Maintenance Officer")
                              .map((employee) => (
                                <CommandItem
                                  key={employee.id}
                                  onSelect={() => toggleOfficer(employee.id, "maintenance")}
                                  className="flex items-center gap-2 cursor-pointer text-black hover:bg-black/5"
                                >
                                  <div
                                    className={`flex h-4 w-4 items-center justify-center rounded-sm border ${
                                      maintenanceOfficers.includes(employee.id)
                                        ? "bg-orange-600 border-orange-600"
                                        : "border-black/20"
                                    }`}
                                  >
                                    {maintenanceOfficers.includes(employee.id) && (
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
              {requiresCentralAccountsReview && (
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
                        {centralAccountsOfficers.length > 0
                          ? `${centralAccountsOfficers.length} selected`
                          : "Select..."}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[350px] p-0 bg-white" align="start">
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
                                  onSelect={() => toggleOfficer(employee.id, "central")}
                                  className="flex items-center gap-2 cursor-pointer text-black hover:bg-black/5"
                                >
                                  <div
                                    className={`flex h-4 w-4 items-center justify-center rounded-sm border ${
                                      centralAccountsOfficers.includes(employee.id)
                                        ? "bg-teal-600 border-teal-600"
                                        : "border-black/20"
                                    }`}
                                  >
                                    {centralAccountsOfficers.includes(employee.id) && (
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

          {/* Action Buttons */}
          <div className="flex justify-start gap-3 pt-4 border-t">
            <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-white">
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
            <Button
              variant="outline"
              onClick={handleCancel}
              className="border-black/20 text-black hover:bg-black/5 bg-transparent"
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
