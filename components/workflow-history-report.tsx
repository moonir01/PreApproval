"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { FileDown, CheckCircle, Clock } from "lucide-react"
import type { PreApproval, WorkflowStage } from "@/lib/demo-data"

interface WorkflowHistoryReportProps {
  preApproval: PreApproval
  initiatorName: string
  workflowStages?: WorkflowStage[]
}

export function WorkflowHistoryReport({ preApproval, initiatorName, workflowStages }: WorkflowHistoryReportProps) {
  const printReport = () => {
    window.print()
  }

  const exportReport = () => {
    alert("Export functionality - Would download the workflow history report")
  }

  const currentPendingStage =
    preApproval.status === "Pending" && workflowStages
      ? workflowStages.find((stage) => stage.workflowType === "preapproval" && stage.order === preApproval.currentStage)
      : null

  return (
    <div className="space-y-6">
      {/* Action Buttons */}
      <div className="flex justify-end gap-2 print:hidden">
        <Button variant="outline" size="sm" onClick={exportReport}>
          <FileDown className="h-4 w-4 mr-2" />
          Export
        </Button>
        <Button variant="outline" size="sm" onClick={printReport}>
          <FileDown className="h-4 w-4 mr-2" />
          Print
        </Button>
      </div>

      {/* Document Information */}
      <Card>
        <CardHeader className="bg-primary/5">
          <CardTitle className="text-primary">Document Information</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="font-semibold">Document</span>
              <p className="text-lg">{preApproval.preApprovalId}</p>
            </div>
            <div>
              <span className="font-semibold">Initiator</span>
              <p className="text-lg">{initiatorName}</p>
            </div>
            <div>
              <span className="font-semibold">Document Creation</span>
              <p>{new Date(preApproval.requestDate).toLocaleString()}</p>
            </div>
            <div>
              <span className="font-semibold">WF Send</span>
              <p>
                {preApproval.workflowHistory.length > 0
                  ? new Date(preApproval.workflowHistory[0].timestamp).toLocaleString()
                  : "Not Started"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Workflow History Table */}
      <Card>
        <CardHeader className="bg-primary/5">
          <CardTitle className="text-primary">Workflow History</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="w-full overflow-x-auto">
            <Table className="min-w-full">
              <TableHeader>
                <TableRow className="bg-muted">
                  <TableHead className="text-center font-bold whitespace-nowrap">S/L</TableHead>
                  <TableHead className="font-bold whitespace-nowrap">Approver</TableHead>
                  <TableHead className="font-bold whitespace-nowrap">Updated By</TableHead>
                  <TableHead className="font-bold whitespace-nowrap">Stage Name</TableHead>
                  <TableHead className="font-bold whitespace-nowrap">Status</TableHead>
                  <TableHead className="font-bold whitespace-nowrap">Time</TableHead>
                  <TableHead className="text-center font-bold whitespace-nowrap">Current State</TableHead>
                  <TableHead className="font-bold whitespace-nowrap">Rejection Remarks</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {preApproval.workflowHistory.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      No workflow history available
                    </TableCell>
                  </TableRow>
                ) : (
                  <>
                    {preApproval.workflowHistory.map((history, index) => (
                      <TableRow key={index}>
                        <TableCell className="text-center">{index + 1}</TableCell>
                        <TableCell>{history.actorName}</TableCell>
                        <TableCell>{history.action === "Reject" ? history.actorName : ""}</TableCell>
                        <TableCell>{history.stageName}</TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                              history.action === "Approve"
                                ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                                : history.action === "Recommend"
                                  ? "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
                                  : history.action === "Reject"
                                    ? "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400"
                                    : "bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400"
                            }`}
                          >
                            {history.action}
                          </span>
                        </TableCell>
                        <TableCell>{new Date(history.timestamp).toLocaleString()}</TableCell>
                        <TableCell className="text-center">
                          {index === preApproval.workflowHistory.length - 1 && preApproval.status !== "Pending" ? (
                            <CheckCircle className="h-5 w-5 text-green-600 mx-auto" />
                          ) : (
                            ""
                          )}
                        </TableCell>
                        <TableCell>{history.action === "Reject" ? history.notes : ""}</TableCell>
                      </TableRow>
                    ))}

                    {currentPendingStage && (
                      <TableRow className="bg-amber-50 dark:bg-amber-900/10">
                        <TableCell className="text-center">{preApproval.workflowHistory.length + 1}</TableCell>
                        <TableCell className="font-medium">
                          {currentPendingStage.assignedEmployees.join(", ")}
                        </TableCell>
                        <TableCell>-</TableCell>
                        <TableCell className="font-medium">{currentPendingStage.name}</TableCell>
                        <TableCell>
                          <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400">
                            Pending
                          </span>
                        </TableCell>
                        <TableCell>-</TableCell>
                        <TableCell className="text-center">
                          <Clock className="h-5 w-5 text-amber-600 mx-auto" />
                        </TableCell>
                        <TableCell className="italic text-muted-foreground">Awaiting Approval</TableCell>
                      </TableRow>
                    )}

                    {/* Document's 1st Workflow Activity Section */}
                    {preApproval.workflowHistory.length > 0 && (
                      <>
                        <TableRow>
                          <TableCell
                            colSpan={8}
                            className="text-center font-bold bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400 py-2"
                          >
                            Document's 1st Workflow Activity
                          </TableCell>
                        </TableRow>
                        {preApproval.workflowHistory
                          .slice()
                          .reverse()
                          .map((history, index) => (
                            <TableRow key={`reverse-${index}`}>
                              <TableCell className="text-center">
                                {preApproval.workflowHistory.length + index + 1}
                              </TableCell>
                              <TableCell>{history.actorName}</TableCell>
                              <TableCell>{history.actorName}</TableCell>
                              <TableCell>{history.stageName}</TableCell>
                              <TableCell>
                                <span
                                  className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                                    history.action === "Approve"
                                      ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                                      : history.action === "Recommend"
                                        ? "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
                                        : history.action === "Reject"
                                          ? "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400"
                                          : "bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400"
                                  }`}
                                >
                                  {history.action}
                                </span>
                              </TableCell>
                              <TableCell>{new Date(history.timestamp).toLocaleString()}</TableCell>
                              <TableCell className="text-center"></TableCell>
                              <TableCell>{history.action === "Reject" ? history.notes : ""}</TableCell>
                            </TableRow>
                          ))}
                      </>
                    )}
                  </>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
