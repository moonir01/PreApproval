//Pre Approval Create Page

"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { useData } from "@/lib/data-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash2, ArrowLeft } from "lucide-react"
import Link from "next/link"

interface ItemLine {
  itemId: string
  itemName: string
  uom: string
  currentStock: number
  quantity: number
  rate: number
  description: string
  remarks: string
  total: number
}

export default function CreatePreApprovalPage() {
  const router = useRouter()
  const { isAuthenticated, user } = useAuth()
  const dataContext = useData()
  const { wings, warehouses, items, addPreApproval, addAuditLog, createApprovalPreApproval } = dataContext || {}

  const [wingId, setWingId] = useState("")
  const [warehouseId, setWarehouseId] = useState("")
  const [itemLines, setItemLines] = useState<ItemLine[]>([])
  const [selectedItemId, setSelectedItemId] = useState("")
  const [quantity, setQuantity] = useState("")
  const [rate, setRate] = useState("")
  const [description, setDescription] = useState("")
  const [remarks, setRemarks] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    console.log("[v0] Create Pre-Approval page mounted")
    console.log("[v0] isAuthenticated:", isAuthenticated)
    console.log("[v0] user:", user)
    console.log("[v0] dataContext:", dataContext ? "loaded" : "missing")

    if (!isAuthenticated) {
      console.log("[v0] Not authenticated, redirecting to login")
      router.push("/")
    } else {
      setIsLoading(false)
    }
  }, [isAuthenticated, router, user, dataContext])

  if (isLoading) {
    return (
      <div className="p-4 lg:p-6 w-full flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-lg font-semibold">Loading...</div>
        </div>
      </div>
    )
  }

  if (!isAuthenticated || !user) {
    return null
  }

  if (!wings || !warehouses || !items || !createApprovalPreApproval) {
    console.error("[v0] Data context missing required data")
    return (
      <div className="p-4 lg:p-6 w-full">
        <div className="text-red-600">Error: Required data is not loaded. Please refresh the page.</div>
      </div>
    )
  }

  const filteredWarehouses = warehouses.filter((wh) => wh.wingId === wingId)

  const addItemLine = () => {
    if (!selectedItemId || !quantity || Number(quantity) <= 0) {
      alert("Please select an item and enter a valid quantity")
      return
    }

    const item = items.find((i) => i.id === selectedItemId)
    if (!item) return

    const qty = Number(quantity)
    const itemRate = rate ? Number(rate) : item.defaultRate
    const total = qty * itemRate

    // Handle both possible field names: uom/unitOfMeasure and currentStock/stockLevels
    const itemUOM = (item as any).uom || (item as any).unitOfMeasure || "Unit"
    let itemCurrentStock = (item as any).currentStock || 0

    // If item has stockLevels array (new structure), calculate total stock
    if ((item as any).stockLevels && Array.isArray((item as any).stockLevels)) {
      itemCurrentStock = (item as any).stockLevels.reduce((sum: number, level: any) => {
        return sum + (level.quantity || 0)
      }, 0)
    }

    // Get item code from itemCode or code field
    const itemCode = (item as any).itemCode || (item as any).code || item.id

    console.log("[v0] Adding item line - UOM:", itemUOM, "Stock:", itemCurrentStock, "Code:", itemCode)

    setItemLines([
      ...itemLines,
      {
        itemId: item.id,
        itemName: item.name,
        uom: itemUOM,
        currentStock: itemCurrentStock,
        quantity: qty,
        rate: itemRate,
        description: description || "",
        remarks: remarks || "",
        total,
      },
    ])

    setSelectedItemId("")
    setQuantity("")
    setRate("")
    setDescription("")
    setRemarks("")
  }

  const removeItemLine = (index: number) => {
    setItemLines(itemLines.filter((_, i) => i !== index))
  }

  const updateItemLine = (index: number, field: keyof ItemLine, value: number | string) => {
    const updated = [...itemLines]
    if (field === "quantity" || field === "rate") {
      updated[index][field] = Number(value)
      updated[index].total = updated[index].quantity * updated[index].rate
    } else if (field === "description" || field === "remarks") {
      updated[index][field] = String(value)
    }
    setItemLines(updated)
  }

  const totalAmount = itemLines.reduce((sum, line) => sum + line.total, 0)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!wingId || !warehouseId) {
      alert("Please select Wing and Warehouse")
      return
    }

    if (itemLines.length === 0) {
      alert("Please add at least one item")
      return
    }

    const year = new Date().getFullYear()
    const randomNum = Math.floor(Math.random() * 900) + 100 // 3-digit number between 100-999
    const preApprovalId = `PA-${year}-${String(randomNum).padStart(3, "0")}`

    console.log("[v0] Creating pre-approval:", preApprovalId)
    console.log("[v0] Item lines before transformation:", itemLines)

    const transformedItems = itemLines.map((line) => {
      const item = items.find((i) => i.id === line.itemId)
      console.log("[v0] Looking for item with id:", line.itemId)
      console.log("[v0] Found item:", item)

      // Get item code from multiple possible field names
      const itemCode = item ? (item as any).itemCode || (item as any).code || item.id : line.itemId

      const transformed = {
        code: itemCode,
        item: line.itemName,
        uom: line.uom, // Use UOM from line which was set when item was added
        lastPrice: item?.defaultRate || line.rate,
        stock: line.currentStock, // Use stock from line which was calculated when item was added
        reqQty: line.quantity,
        rate: line.rate,
        total: line.total,
      }
      console.log("[v0] Transformed item:", transformed)
      return transformed
    })

    console.log("[v0] All transformed items:", transformedItems)

    const approvalPreApproval = createApprovalPreApproval(
      "pre-approval",
      preApprovalId,
      warehouseId,
      wingId,
      totalAmount,
      transformedItems,
    )

    if (approvalPreApproval) {
      console.log("[v0] Approval pre-approval created successfully:", approvalPreApproval)
    } else {
      console.error("[v0] Failed to create approval pre-approval")
    }

    addAuditLog({
      timestamp: new Date().toISOString(),
      userId: user.id,
      userName: user.fullName,
      action: "CREATE",
      module: "Pre-Approval",
      details: `Created Pre-Approval ${preApprovalId}`,
      ipAddress: "192.168.1.100",
    })

    alert(`Pre-Approval ${preApprovalId} created successfully and sent to Stage 1 for approval!`)
    router.push("/procurement/pre-approval")
  }

  return (
    <div className="p-4 lg:p-6 w-full">
      <div className="w-full space-y-2">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/procurement/pre-approval">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-black">Create Pre-Approval</h1>
              <p className="text-sm text-gray-600">Initiate a new procurement request</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-2">
          {/* Basic Information */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Request Information</CardTitle>
              <CardDescription className="text-sm">Select the wing and warehouse for this request</CardDescription>
            </CardHeader>
            <CardContent className="pt-0 space-y-2">
              <div className="flex gap-2 items-start">
                <div className="w-[260px]">
                  <Label htmlFor="wing" className="text-sm mb-1 block">
                    Wing *
                  </Label>
                  <Select value={wingId} onValueChange={setWingId} required>
                    <SelectTrigger id="wing" className="h-9 w-full">
                      <SelectValue placeholder="Select wing" />
                    </SelectTrigger>
                    <SelectContent>
                      {wings.map((wing) => (
                        <SelectItem key={wing.id} value={wing.id}>
                          {wing.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="w-[260px]">
                  <Label htmlFor="warehouse" className="text-sm mb-1 block">
                    Warehouse *
                  </Label>
                  <Select value={warehouseId} onValueChange={setWarehouseId} disabled={!wingId} required>
                    <SelectTrigger id="warehouse" className="h-9 w-full">
                      <SelectValue placeholder="Select warehouse" />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredWarehouses.map((wh) => (
                        <SelectItem key={wh.id} value={wh.id}>
                          {wh.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Add Items */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Add Items</CardTitle>
              <CardDescription className="text-sm">Select items and enter details for this request</CardDescription>
            </CardHeader>
            <CardContent className="pt-0 space-y-2">
              <div className="flex gap-2 items-end">
                <div className="w-[260px]">
                  <Label htmlFor="item" className="text-sm mb-1 block">
                    Item
                  </Label>
                  <Select value={selectedItemId} onValueChange={setSelectedItemId}>
                    <SelectTrigger id="item" className="h-9 w-full">
                      <SelectValue placeholder="Select item" />
                    </SelectTrigger>
                    <SelectContent>
                      {items.map((item) => (
                        <SelectItem key={item.id} value={item.id}>
                          {item.name} - ${item.defaultRate}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="w-[120px]">
                  <Label htmlFor="quantity" className="text-sm mb-1 block">
                    Quantity
                  </Label>
                  <Input
                    id="quantity"
                    type="number"
                    placeholder="Qty"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    min="1"
                    className="h-9"
                  />
                </div>
                <div className="w-[120px]">
                  <Label htmlFor="rate" className="text-sm mb-1 block">
                    Rate
                  </Label>
                  <Input
                    id="rate"
                    type="number"
                    placeholder="Rate"
                    value={rate}
                    onChange={(e) => setRate(e.target.value)}
                    min="0"
                    step="0.01"
                    className="h-9"
                  />
                </div>
                <div className="flex-1">
                  <Label htmlFor="description" className="text-sm mb-1 block">
                    Description
                  </Label>
                  <Input
                    id="description"
                    type="text"
                    placeholder="Optional"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="h-9"
                  />
                </div>
                <div className="w-[120px]">
                  <Label htmlFor="remarks" className="text-sm mb-1 block">
                    Remarks
                  </Label>
                  <Input
                    id="remarks"
                    type="text"
                    placeholder="Optional"
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    className="h-9"
                  />
                </div>
                <Button type="button" onClick={addItemLine} size="sm" className="h-9 shrink-0">
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </Button>
              </div>

              {/* Item Lines Table */}
              {itemLines.length > 0 && (
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full border-collapse">
                    <thead style={{ backgroundColor: "rgba(182, 205, 241, 1)" }}>
                      <tr>
                        <th className="border border-gray-300 text-left px-3 py-2 font-semibold text-sm text-black">
                          Item
                        </th>
                        <th className="border border-gray-300 text-left px-3 py-2 font-semibold text-sm text-black">
                          Description
                        </th>
                        <th className="border border-gray-300 text-center px-3 py-2 font-semibold text-sm text-black w-24">
                          UOM
                        </th>
                        <th className="border border-gray-300 text-center px-3 py-2 font-semibold text-sm text-black w-24">
                          Curr. Stock
                        </th>
                        <th className="border border-gray-300 text-center px-3 py-2 font-semibold text-sm text-black w-28">
                          Quantity
                        </th>
                        <th className="border border-gray-300 text-center px-3 py-2 font-semibold text-sm text-black w-28">
                          Rate
                        </th>
                        <th className="border border-gray-300 text-center px-3 py-2 font-semibold text-sm text-black w-32">
                          Total
                        </th>
                        <th className="border border-gray-300 text-left px-3 py-2 font-semibold text-sm text-black">
                          Remarks
                        </th>
                        <th className="border border-gray-300 text-center px-3 py-2 font-semibold text-sm text-black w-16">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white">
                      {itemLines.map((line, index) => (
                        <tr key={index}>
                          <td className="border border-gray-300 px-3 py-2 text-sm text-black">{line.itemName}</td>
                          <td className="border border-gray-300 px-3 py-2">
                            <Input
                              type="text"
                              value={line.description}
                              onChange={(e) => updateItemLine(index, "description", e.target.value)}
                              className="w-full h-9 text-sm border-0 focus-visible:ring-0 focus-visible:ring-offset-0 px-2"
                              placeholder="Optional"
                            />
                          </td>
                          <td className="border border-gray-300 px-3 py-2 text-center text-sm text-black bg-gray-50">
                            {line.uom}
                          </td>
                          <td className="border border-gray-300 px-3 py-2 text-center text-sm text-black">
                            {line.currentStock}
                          </td>
                          <td className="border border-gray-300 px-3 py-2">
                            <Input
                              type="number"
                              value={line.quantity}
                              onChange={(e) => updateItemLine(index, "quantity", Number(e.target.value))}
                              className="w-full h-9 text-sm text-center border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                              min="1"
                            />
                          </td>
                          <td className="border border-gray-300 px-3 py-2">
                            <Input
                              type="number"
                              value={line.rate}
                              onChange={(e) => updateItemLine(index, "rate", Number(e.target.value))}
                              className="w-full h-9 text-sm text-center border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                              min="0"
                              step="0.01"
                            />
                          </td>
                          <td className="border border-gray-300 px-3 py-2 text-center text-sm font-medium text-black">
                            ${line.total.toFixed(2)}
                          </td>
                          <td className="border border-gray-300 px-3 py-2">
                            <Input
                              type="text"
                              value={line.remarks}
                              onChange={(e) => updateItemLine(index, "remarks", e.target.value)}
                              className="w-full h-9 text-sm border-0 focus-visible:ring-0 focus-visible:ring-offset-0 px-2"
                              placeholder="Optional"
                            />
                          </td>
                          <td className="border border-gray-300 px-3 py-2 text-center">
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeItemLine(index)}
                              className="h-8 w-8 p-0 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4 text-red-600" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="border-t border-gray-300 bg-gray-50 px-3 py-3 flex justify-end items-center gap-4">
                    <span className="text-sm font-semibold text-black">Total Amount:</span>
                    <span className="text-base font-bold text-black">${totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Link href="/procurement/pre-approval">
              <Button type="button" variant="outline" size="sm">
                Cancel
              </Button>
            </Link>
            <Button type="submit" size="sm" disabled={itemLines.length === 0}>
              Submit Pre-Approval
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
