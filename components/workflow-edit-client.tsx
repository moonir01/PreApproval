"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useData } from "@/lib/data-context"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Save, ArrowLeft } from "lucide-react"
import { StageEditDialog } from "@/components/stage-edit-dialog"
import type { ApprovalPipeline } from "@/lib/demo-data"

type ApprovalMode = "Sequential" | "Parallel" | "Any Order"

interface Stage {
  id: string
  stageName: string
  approvalMode: ApprovalMode
  designations: Array<{ designation: string; selected: boolean }>
  employees: Array<{ id: string; name: string; designation: string; selected: boolean }>
  reviewTypes: Array<{ id: string; name: string; enabled: boolean; officers: string[] }>
}

interface WorkflowEditClientProps {
  pipeline: ApprovalPipeline
}

export function WorkflowEditClient({ pipeline }: WorkflowEditClientProps) {
  const { employees } = useData()
  const router = useRouter()

  const [pipelineName] = useState(pipeline.pipelineName)
  const [featureName] = useState(pipeline.featureName)
  const [stages, setStages] = useState<Stage[]>(() => {
    return pipeline.stages.map((stage) => ({
      id: stage.id,
      stageName: stage.stageName,
      approvalMode: "Sequential" as ApprovalMode,
      designations: [],
      employees: [],
      reviewTypes: [],
    }))
  })
  const [editingStage, setEditingStage] = useState<Stage | null>(null)
  const [showStageDialog, setShowStageDialog] = useState(false)

  const handleEditStage = (stage: Stage) => {
    setEditingStage({ ...stage })
    setShowStageDialog(true)
  }

  const handleSaveStageChanges = (updatedStage: Stage) => {
    setStages(stages.map((s) => (s.id === updatedStage.id ? updatedStage : s)))
    setShowStageDialog(false)
    setEditingStage(null)
  }

  const handleSavePipeline = () => {
    alert("Workflow updated successfully!")
    router.push("/setup/workflow")
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Edit Workflow: {pipelineName}</h1>
        </div>
        <Button onClick={handleSavePipeline} className="gap-2 bg-blue-600 hover:bg-blue-700">
          <Save className="h-4 w-4" />
          Save Changes
        </Button>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Pipeline Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm text-gray-600">Pipeline Name</Label>
              <p className="font-medium">{pipelineName}</p>
            </div>
            <div>
              <Label className="text-sm text-gray-600">Feature Name</Label>
              <p className="font-medium">{featureName}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Approval Stages</h2>
        {stages.map((stage, index) => (
          <Card key={stage.id} className="border-2">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 text-white font-semibold">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{stage.stageName}</h3>
                    <p className="text-sm text-gray-600">{stage.approvalMode}</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  onClick={() => handleEditStage(stage)}
                  className="border-blue-600 text-blue-600 hover:bg-blue-50"
                >
                  Edit Stage
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {editingStage && (
        <StageEditDialog
          open={showStageDialog}
          onOpenChange={setShowStageDialog}
          stage={editingStage}
          onSave={handleSaveStageChanges}
          stageNumber={stages.findIndex((s) => s.id === editingStage.id) + 1}
        />
      )}
    </div>
  )
}
