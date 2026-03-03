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
import { ArrowLeft, Plus, Trash2 } from "lucide-react"
import { RichTextEditor } from "@/components/rich-text-editor"
import Link from "next/link"

interface NotesheetItem {
  itemName: string
  description: string
  uom: string
  currentStock: number
  quantity: number
  rate: number
  remarks: string
  total: number
}

export default function CreateNotesheetPage() {
  const router = useRouter()
  const { isAuthenticated, user } = useAuth()
  const {
    preApprovals,
    approvalPreApprovals,
    wings,
    warehouses,
    items: availableItems,
    addNotesheet,
    addAuditLog,
  } = useData()

  const [reference, setReference] = useState("")
  const [selectedPreApprovalId, setSelectedPreApprovalId] = useState("")
  const [items, setItems] = useState<NotesheetItem[]>([])
  const [editorContentBody, setEditorContentBody] = useState("")
  const [editorContentFooter, setEditorContentFooter] = useState("")

  const [selectedItemId, setSelectedItemId] = useState("")
  const [description, setDescription] = useState("")
  const [quantity, setQuantity] = useState("")
  const [rate, setRate] = useState("")

  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    console.log("[v0] CreateNotesheetPage mounted")
    console.log("[v0] isAuthenticated:", isAuthenticated)
    console.log("[v0] user:", user)
    console.log("[v0] approvalPreApprovals:", approvalPreApprovals?.length)
    console.log(
      "[v0] approvalPreApprovals statuses:",
      approvalPreApprovals?.map((pa) => ({ id: pa.id, status: pa.status })),
    )
    console.log("[v0] wings:", wings?.length)
    console.log("[v0] warehouses:", warehouses?.length)
    console.log("[v0] availableItems:", availableItems?.length)

    if (!isAuthenticated) {
      router.push("/login")
    } else {
      setIsLoading(false)
    }
  }, [isAuthenticated, router, user, approvalPreApprovals, wings, warehouses, availableItems])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  if (!isAuthenticated || !user) {
    return null
  }

  const approvedPreApprovals = approvalPreApprovals || []

  const selectedPreApproval =
    approvalPreApprovals?.find((pa) => pa.id === selectedPreApprovalId) ||
    preApprovals?.find((pa) => pa.id === selectedPreApprovalId)

  const selectedWing = selectedPreApproval ? wings?.find((w) => w.id === selectedPreApproval.wingId) : null
  const selectedWarehouse = selectedPreApproval
    ? warehouses?.find((wh) => wh.id === selectedPreApproval.warehouseId)
    : null

  const handlePreApprovalChange = (value: string) => {
    setSelectedPreApprovalId(value)

    if (value) {
      const preApproval =
        approvalPreApprovals?.find((pa) => pa.id === value) || preApprovals?.find((pa) => pa.id === value)
      if (preApproval && preApproval.itemDetails) {
        const mappedItems: NotesheetItem[] = preApproval.itemDetails.map((item) => ({
          itemName: item.item || "",
          description: "",
          uom: item.uom || "PCS",
          currentStock: item.stock || 0,
          quantity: item.reqQty || 0,
          rate: item.rate || 0,
          remarks: "",
          total: item.total || 0,
        }))
        setItems(mappedItems)
        console.log("[v0] Auto-populated items from pre-approval:", mappedItems)
      }
    }
  }

  const handleAddItem = () => {
    if (!selectedItemId || !quantity || !rate) {
      alert("Please fill all required fields (Item, Quantity, Rate)")
      return
    }

    const selectedItem = availableItems?.find((item) => item.id === selectedItemId)

    const newItem: NotesheetItem = {
      itemName: selectedItem?.name || "",
      description,
      uom: "PCS",
      currentStock: 0,
      quantity: Number(quantity),
      rate: Number(rate),
      remarks: "",
      total: Number(quantity) * Number(rate),
    }

    setItems([...items, newItem])

    setSelectedItemId("")
    setDescription("")
    setQuantity("")
    setRate("")
  }

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index))
  }

  const handleItemFieldChange = (index: number, field: keyof NotesheetItem, value: string | number) => {
    const updatedItems = [...items]
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: value,
    }

    if (field === "quantity" || field === "rate") {
      updatedItems[index].total = updatedItems[index].quantity * updatedItems[index].rate
    }

    setItems(updatedItems)
  }

  const totalAmount = items.reduce((sum, item) => sum + item.total, 0)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!reference) {
      alert("Please enter a reference")
      return
    }

    if (items.length === 0) {
      alert("Please add at least one item")
      return
    }

    const notesheetId = `NS-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, "0")}`

    addNotesheet({
      notesheetId,
      preApprovalId: selectedPreApprovalId || reference,
      wingId: selectedPreApproval?.wingId || "",
      warehouseId: selectedPreApproval?.warehouseId || "",
      initiatedBy: user.id,
      initiatedDate: new Date().toISOString(),
      status: "Pending",
      currentStage: 1,
      workflowHistory: [],
    })

    addAuditLog({
      timestamp: new Date().toISOString(),
      userId: user.id,
      userName: user.fullName,
      action: "CREATE",
      module: "Notesheet",
      details: `Created Notesheet ${notesheetId} with reference ${reference}`,
      ipAddress: "192.168.1.100",
    })

    alert(`Notesheet ${notesheetId} created successfully!`)
    router.push("/procurement/notesheet")
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <main className="p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/procurement/notesheet">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold">Create Notesheet</h1>
                <p className="text-muted-foreground mt-1">Create a notesheet with reference and detailed content</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Reference and Pre-Approval */}
            <Card>
              <CardHeader>
                <CardTitle>Reference Information</CardTitle>
                <CardDescription>Enter reference and optionally select a pre-approval</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="reference">Reference *</Label>
                    <Input
                      id="reference"
                      placeholder="Enter reference number"
                      value={reference}
                      onChange={(e) => setReference(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="preApproval">Pre-Approval (Optional)</Label>
                    <Select value={selectedPreApprovalId} onValueChange={handlePreApprovalChange}>
                      <SelectTrigger id="preApproval">
                        <SelectValue placeholder="Select pre-approval to auto-fill" />
                      </SelectTrigger>
                      <SelectContent>
                        {approvedPreApprovals.map((pa) => (
                          <SelectItem key={pa.id} value={pa.id}>
                            {pa.id}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Pre-Approval Details (if selected) */}
            {selectedPreApproval && (
              <Card>
                <CardHeader>
                  <CardTitle>Pre-Approval Details</CardTitle>
                  <CardDescription>Information from selected pre-approval</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label className="text-muted-foreground">Pre-Approval ID</Label>
                      <p className="font-medium">{selectedPreApproval.id}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Total Amount</Label>
                      <p className="font-medium text-lg">${selectedPreApproval.totalAmount?.toLocaleString() || 0}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Wing</Label>
                      <p className="font-medium">{selectedWing?.name}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Warehouse</Label>
                      <p className="font-medium">{selectedWarehouse?.name}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Add Items</CardTitle>
                <CardDescription>
                  {selectedPreApprovalId
                    ? "Items auto-loaded from pre-approval. You can add more items below."
                    : "Add items manually for this notesheet"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-4">
                  <div className="space-y-2">
                    <Label htmlFor="itemSelect">Item</Label>
                    <Select value={selectedItemId} onValueChange={setSelectedItemId}>
                      <SelectTrigger id="itemSelect">
                        <SelectValue placeholder="Select item" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableItems.map((item) => (
                          <SelectItem key={item.id} value={item.id}>
                            {item.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="itemDescription">Description</Label>
                    <Input
                      id="itemDescription"
                      placeholder="Item description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="quantity">Quantity</Label>
                    <Input
                      id="quantity"
                      type="number"
                      placeholder="Qty"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rate">Rate</Label>
                    <Input
                      id="rate"
                      type="number"
                      placeholder="Rate"
                      value={rate}
                      onChange={(e) => setRate(e.target.value)}
                    />
                  </div>
                </div>
                <Button type="button" onClick={handleAddItem} className="w-full md:w-auto">
                  <Plus className="h-4 w-4 mr-2" />
                  Add
                </Button>

                {items.length > 0 && (
                  <div className="border rounded-lg overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-muted">
                        <tr>
                          <th className="text-left p-3 font-medium">Item</th>
                          <th className="text-left p-3 font-medium">Description</th>
                          <th className="text-left p-3 font-medium">UOM</th>
                          <th className="text-right p-3 font-medium">Curr. Stock</th>
                          <th className="text-right p-3 font-medium">Quantity</th>
                          <th className="text-right p-3 font-medium">Rate</th>
                          <th className="text-right p-3 font-medium">Total</th>
                          <th className="text-left p-3 font-medium">Remarks</th>
                          <th className="text-center p-3 font-medium">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {items.map((item, index) => (
                          <tr key={index} className="border-t">
                            <td className="p-3">{item.itemName}</td>
                            <td className="p-3">
                              <Input
                                type="text"
                                value={item.description}
                                onChange={(e) => handleItemFieldChange(index, "description", e.target.value)}
                                placeholder="Description"
                                className="min-w-[120px]"
                              />
                            </td>
                            <td className="p-3">
                              <Select
                                value={item.uom}
                                onValueChange={(value) => handleItemFieldChange(index, "uom", value)}
                              >
                                <SelectTrigger className="min-w-[80px]">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="PCS">PCS</SelectItem>
                                  <SelectItem value="KG">KG</SelectItem>
                                  <SelectItem value="LTR">LTR</SelectItem>
                                  <SelectItem value="MTR">MTR</SelectItem>
                                  <SelectItem value="BOX">BOX</SelectItem>
                                </SelectContent>
                              </Select>
                            </td>
                            <td className="p-3 text-right">{item.currentStock}</td>
                            <td className="p-3">
                              <Input
                                type="number"
                                value={item.quantity}
                                onChange={(e) => handleItemFieldChange(index, "quantity", Number(e.target.value))}
                                className="min-w-[80px] text-right"
                              />
                            </td>
                            <td className="p-3">
                              <Input
                                type="number"
                                value={item.rate}
                                onChange={(e) => handleItemFieldChange(index, "rate", Number(e.target.value))}
                                className="min-w-[80px] text-right"
                              />
                            </td>
                            <td className="p-3 text-right font-medium">${item.total.toFixed(2)}</td>
                            <td className="p-3">
                              <Input
                                type="text"
                                value={item.remarks}
                                onChange={(e) => handleItemFieldChange(index, "remarks", e.target.value)}
                                placeholder="Remarks"
                                className="min-w-[120px]"
                              />
                            </td>
                            <td className="p-3 text-center">
                              <Button type="button" size="sm" variant="ghost" onClick={() => handleRemoveItem(index)}>
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </td>
                          </tr>
                        ))}
                        <tr className="border-t bg-muted/50">
                          <td colSpan={6} className="p-3 text-right font-semibold">
                            Total Amount:
                          </td>
                          <td className="p-3 text-right font-bold text-lg">${totalAmount.toFixed(2)}</td>
                          <td colSpan={2}></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Remarks (body)</CardTitle>
              </CardHeader>
              <CardContent>
                <RichTextEditor content={editorContentBody} onChange={setEditorContentBody} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Remarks (footer)</CardTitle>
              </CardHeader>
              <CardContent>
                <RichTextEditor content={editorContentFooter} onChange={setEditorContentFooter} />
              </CardContent>
            </Card>

            <div className="flex justify-end gap-4">
              <Link href="/procurement/notesheet">
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </Link>
              <Button type="submit">Create Notesheet</Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
