"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Search, Eye } from "lucide-react"
import { demoApprovalRequisitions } from "@/lib/demo-data"
import { useRouter } from "next/navigation"

const wings = ["All", "Admin Wing", "Training Wing", "Academic Wing", "Engineering Wing"]

export default function PurchaseRequisitionsPage() {
  const router = useRouter()
  const [selectedWings, setSelectedWings] = useState<string[]>(["All"])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedRequisitions, setSelectedRequisitions] = useState<string[]>([])

  const filteredRequisitions = demoApprovalRequisitions.filter((req) => {
    const wingMatch = selectedWings.includes("All") || selectedWings.includes(req.wing)
    const searchMatch =
      req.requisitionNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.wing.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.status.toLowerCase().includes(searchQuery.toLowerCase())
    return wingMatch && searchMatch
  })

  const handleWingToggle = (wing: string) => {
    if (wing === "All") {
      setSelectedWings(["All"])
    } else {
      const newSelection = selectedWings.includes(wing)
        ? selectedWings.filter((w) => w !== wing)
        : [...selectedWings.filter((w) => w !== "All"), wing]
      setSelectedWings(newSelection.length === 0 ? ["All"] : newSelection)
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRequisitions(filteredRequisitions.map((r) => r.id))
    } else {
      setSelectedRequisitions([])
    }
  }

  const handleSelectRequisition = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedRequisitions([...selectedRequisitions, id])
    } else {
      setSelectedRequisitions(selectedRequisitions.filter((rid) => rid !== id))
    }
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Purchase Requisitions</h1>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="bg-yellow-100 hover:bg-yellow-200 text-yellow-800 border-yellow-300"
            disabled={selectedRequisitions.length === 0}
          >
            Review
          </Button>
          <Button
            variant="outline"
            className="bg-red-100 hover:bg-red-200 text-red-800 border-red-300"
            disabled={selectedRequisitions.length === 0}
          >
            Reject
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white" disabled={selectedRequisitions.length === 0}>
            Approve
          </Button>
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex flex-wrap gap-2">
        {wings.map((wing) => (
          <Badge
            key={wing}
            variant={selectedWings.includes(wing) ? "default" : "outline"}
            className={`cursor-pointer px-4 py-2 ${
              selectedWings.includes(wing)
                ? wing === "All"
                  ? "bg-gray-900 hover:bg-gray-800"
                  : "bg-blue-600 hover:bg-blue-700"
                : "hover:bg-gray-100"
            }`}
            onClick={() => handleWingToggle(wing)}
          >
            {wing}
          </Badge>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search by Requisition No, Wing, or Status..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden bg-white">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3 text-left">
                <Checkbox
                  checked={
                    selectedRequisitions.length === filteredRequisitions.length && filteredRequisitions.length > 0
                  }
                  onCheckedChange={handleSelectAll}
                />
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Requisition No
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Wing</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Requested By
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Amount
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredRequisitions.map((req) => (
              <tr key={req.id} className="hover:bg-gray-50">
                <td className="px-4 py-4">
                  <Checkbox
                    checked={selectedRequisitions.includes(req.id)}
                    onCheckedChange={(checked) => handleSelectRequisition(req.id, checked as boolean)}
                  />
                </td>
                <td className="px-4 py-4 text-sm font-medium text-gray-900">{req.requisitionNo}</td>
                <td className="px-4 py-4 text-sm text-gray-700">{req.wing}</td>
                <td className="px-4 py-4 text-sm text-gray-700">{req.requestedBy}</td>
                <td className="px-4 py-4 text-sm text-gray-700">{req.date}</td>
                <td className="px-4 py-4 text-sm text-gray-700">{req.items}</td>
                <td className="px-4 py-4 text-sm font-medium text-gray-900">{req.totalAmount.toFixed(2)}</td>
                <td className="px-4 py-4">
                  <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border-yellow-300">
                    {req.status}
                  </Badge>
                </td>
                <td className="px-4 py-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.push(`/approval/purchase-requisition/${req.id}`)}
                  >
                    <Eye className="h-4 w-4 text-blue-600" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
