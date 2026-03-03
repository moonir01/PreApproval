"use client"

import { useRouter } from "next/navigation"
import { useData } from "@/lib/data-context"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export default function WorkflowDetailView({ id }: { id: string }) {
  const router = useRouter()
  const { approvalPipelines, employees } = useData()

  const pipeline = approvalPipelines.find((p) => p.id === id)

  if (!pipeline) {
    return (
      <div className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Pipeline not found</h1>
        </div>
      </div>
    )
  }

  const getEmployeeDetails = (empId: string) => {
    return employees.find((e) => e.id === empId)
  }

  const superApproverDetails = getEmployeeDetails(pipeline.superApprover)

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">Approval Setup View</h1>
      </div>

      {/* Pipeline Info */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="grid grid-cols-2 gap-x-12 gap-y-4">
            <div className="flex gap-4">
              <span className="font-semibold w-40">Pipeline Name</span>
              <span>: {pipeline.pipelineName}</span>
            </div>
            <div className="flex gap-4">
              <span className="font-semibold w-40">User Type</span>
              <span>: {pipeline.userType.charAt(0).toUpperCase() + pipeline.userType.slice(1)}</span>
            </div>
            <div className="flex gap-4">
              <span className="font-semibold w-40">Approval Feature</span>
              <span>: {pipeline.featureName}</span>
            </div>
            <div className="flex gap-4">
              <span className="font-semibold w-40">Super Approver</span>
              <span>: {superApproverDetails?.fullName || pipeline.superApprover}</span>
            </div>
            <div className="flex gap-4">
              <span className="font-semibold w-40">Remarks</span>
              <span>: {pipeline.remarks || "N/A"}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stages */}
      <div className="space-y-6">
        {pipeline.stages.map((stage, index) => {
          const stageEmployees = stage.approvers.map((approver) => getEmployeeDetails(approver.approverName))
          const numPersons = stage.approvers.length

          return (
            <div key={stage.id}>
              <Card className="mb-4">
                <CardContent className="p-6">
                  <div className="grid grid-cols-2 gap-x-12 gap-y-4">
                    <div className="flex gap-4">
                      <span className="font-semibold w-40">Stage Name</span>
                      <span>: {stage.stageName}</span>
                    </div>
                    <div className="flex gap-4">
                      <span className="font-semibold w-40">Approval Order</span>
                      <span>
                        :{" "}
                        {stage.approvalOrder
                          .split("-")
                          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                          .join(" ")}
                      </span>
                    </div>
                    <div className="flex gap-4">
                      <span className="font-semibold w-40">Number of Person</span>
                      <span>: {numPersons}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Approvers Table */}
              <div className="border rounded-lg overflow-hidden bg-white mb-6">
                <table className="w-full">
                  <thead>
                    <tr className="bg-blue-100 border-b">
                      <th className="text-left py-3 px-4 font-semibold text-sm">SL</th>
                      <th className="text-left py-3 px-4 font-semibold text-sm">User Type</th>
                      <th className="text-left py-3 px-4 font-semibold text-sm">Approver Name</th>
                      <th className="text-left py-3 px-4 font-semibold text-sm">Authorization Type</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stage.approvers.map((approver, approverIndex) => {
                      const employeeDetails = getEmployeeDetails(approver.approverName)
                      return (
                        <tr key={approver.id} className="border-b">
                          <td className="py-3 px-4 text-sm">{approverIndex + 1}</td>
                          <td className="py-3 px-4 text-sm capitalize">
                            {approver.userType
                              .split("-")
                              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                              .join(" ")}
                          </td>
                          <td className="py-3 px-4 text-sm">
                            {employeeDetails?.fullName || approver.approverName}
                            {employeeDetails && (
                              <span className="text-muted-foreground ml-2">({employeeDetails.designation})</span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-sm capitalize">
                            {approver.authorizationType
                              .split("-")
                              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                              .join(" ")}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
