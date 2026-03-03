"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useData } from "@/lib/data-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Eye, Pencil, X, Search, ChevronLeft, ChevronRight, Settings } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function WorkflowSetupPage() {
  const { approvalPipelines, employees } = useData()
  const router = useRouter()
  const [searchPipelineName, setSearchPipelineName] = useState("")
  const [searchFeatureName, setSearchFeatureName] = useState("")
  const [rowsPerPage, setRowsPerPage] = useState(50)
  const [currentPage, setCurrentPage] = useState(1)

  const filteredPipelines = approvalPipelines.filter(
    (pipeline) =>
      pipeline.pipelineName.toLowerCase().includes(searchPipelineName.toLowerCase()) &&
      pipeline.featureName.toLowerCase().includes(searchFeatureName.toLowerCase()),
  )

  // Pagination
  const totalPages = Math.ceil(filteredPipelines.length / rowsPerPage)
  const startIndex = (currentPage - 1) * rowsPerPage
  const endIndex = startIndex + rowsPerPage
  const currentPipelines = filteredPipelines.slice(startIndex, endIndex)

  // Get employee name by ID
  const getEmployeeName = (empId: string) => {
    const employee = employees.find((e) => e.id === empId)
    return employee ? employee.fullName : empId
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground">Workflow Setup</h1>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search Pipeline Name..."
              value={searchPipelineName}
              onChange={(e) => setSearchPipelineName(e.target.value)}
              className="pl-9 w-64"
            />
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search Feature Name..."
              value={searchFeatureName}
              onChange={(e) => setSearchFeatureName(e.target.value)}
              className="pl-9 w-64"
            />
          </div>
          <Button
            variant="outline"
            className="border-blue-600 text-blue-600 hover:bg-blue-50 bg-transparent"
            onClick={() => router.push("/setup/workflow/create")}
          >
            <Settings className="h-4 w-4 mr-2" />
            Approval Setup
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden bg-white">
        <table className="w-full">
          <thead>
            <tr className="bg-blue-100 border-b">
              <th className="text-left py-3 px-4 font-semibold text-sm">SL</th>
              <th className="text-left py-3 px-4 font-semibold text-sm">Pipeline Name</th>
              <th className="text-left py-3 px-4 font-semibold text-sm">Feature Name</th>
              <th className="text-left py-3 px-4 font-semibold text-sm">Super Approver</th>
              <th className="text-left py-3 px-4 font-semibold text-sm">Assigned Employees</th>
              <th className="text-right py-3 px-4 font-semibold text-sm">Action</th>
            </tr>
          </thead>
          <tbody>
            {currentPipelines.map((pipeline, index) => (
              <tr key={pipeline.id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-4 text-sm">{startIndex + index + 1}</td>
                <td className="py-3 px-4 text-sm">{pipeline.pipelineName}</td>
                <td className="py-3 px-4 text-sm">{pipeline.featureName}</td>
                <td className="py-3 px-4 text-sm">{getEmployeeName(pipeline.superApprover)}</td>
                <td className="py-3 px-4 text-sm">{pipeline.assignedEmployees.length} employees</td>
                <td className="py-3 px-4">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => router.push(`/setup/workflow/${pipeline.id}`)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => router.push(`/setup/workflow/${pipeline.id}/edit`)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
            {currentPipelines.length === 0 && (
              <tr>
                <td colSpan={6} className="py-8 text-center text-muted-foreground">
                  No pipelines found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer - Pagination */}
      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Rows per page:</span>
          <Select value={rowsPerPage.toString()} onValueChange={(value) => setRowsPerPage(Number(value))}>
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">
            {startIndex + 1}–{Math.min(endIndex, filteredPipelines.length)} of {filteredPipelines.length}
          </span>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
