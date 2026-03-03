"use client"
import { notFound } from "next/navigation"
import { demoApprovalPipelines } from "@/lib/demo-data"
import { WorkflowEditClient } from "@/components/workflow-edit-client"

type ApprovalMode = "Sequential" | "Parallel" | "Any Order"

interface Stage {
  id: string
  stageName: string
  approvalMode: ApprovalMode
  designations: Array<{ designation: string; selected: boolean }>
  employees: Array<{ id: string; name: string; designation: string; selected: boolean }>
  reviewTypes: Array<{ id: string; name: string; enabled: boolean; officers: string[] }>
}

export default async function WorkflowEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const pipeline = demoApprovalPipelines.find((p) => p.id === id)

  if (!pipeline) {
    notFound()
  }

  return <WorkflowEditClient pipeline={pipeline} />
}
