"use client"
import ApprovalSetupEditClient from "@/components/approval-setup-edit-client"
import { demoWorkflowStages } from "@/lib/demo-data"
import { redirect } from "next/navigation" // Import redirect from next/navigation

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

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function ApprovalSetupEditPage({ params }: PageProps) {
  const resolvedParams = await params
  const stageId = Number.parseInt(resolvedParams.id)

  // Find the stage from demo data
  const stage = demoWorkflowStages.find((s) => s.id === stageId)

  if (!stage) {
    redirect("/setup/approval-setup")
  }

  // Pass the stage data to the client component
  return <ApprovalSetupEditClient stage={stage} />
}
