"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Save } from "lucide-react"

type ApprovalMode = "Sequential" | "Parallel" | "Any Order"

interface Stage {
  id: string
  stageName: string
  approvalMode: ApprovalMode
  designations: Array<{ designation: string; selected: boolean }>
  employees: Array<{ id: string; name: string; designation: string; selected: boolean }>
  reviewTypes: Array<{ id: string; name: string; enabled: boolean; officers: string[] }>
}

interface StageEditDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  stage: Stage
  onSave: (stage: Stage) => void
  stageNumber: number
}

export function StageEditDialog({ open, onOpenChange, stage, onSave, stageNumber }: StageEditDialogProps) {
  const [editingStage, setEditingStage] = useState(stage)

  const handleSave = () => {
    onSave(editingStage)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Stage {stageNumber}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Stage Name</Label>
            <Input
              value={editingStage.stageName}
              onChange={(e) => setEditingStage({ ...editingStage, stageName: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label>Approval Mode</Label>
            <Select
              value={editingStage.approvalMode}
              onValueChange={(value) => setEditingStage({ ...editingStage, approvalMode: value as ApprovalMode })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Sequential">Sequential</SelectItem>
                <SelectItem value="Parallel">Parallel</SelectItem>
                <SelectItem value="Any Order">Any Order</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
