"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { useData } from "@/lib/data-context"
import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Trash2, ArrowLeft } from "lucide-react"
import Link from "next/link"

interface PreApprovalItem {
  id: string
  itemId: string
  itemName: string
  description: string
  uom: string
  currentStock: number
  quantity: number
  rate: number
  remarks: string
  total: number
}

export default function CreatePreApprovalPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { items, wings, warehouses, addPreApproval } = useData()
  const [loading, setLoading] = useState(false)

  // Form state
  const [wingId, setWingId] = useState("")
  const [warehouseId, setWarehouseId] = useState("")
  const [preApprovalItems, setPreApprovalItems] = useState<PreApprovalItem[]>([])

  // New item state
  const [selectedItemId, setSelectedItemId] = useState("")
  const [description, setDescription] = useState("")
  const [quantity, setQuantity] = useState("")
  const [rate, setRate] = useState("")

  const addItem = () => {
    if (!selectedItemId || !quantity || !rate) {
      alert("Please fill in all item fields")
      return
    }

    const item = items.find((i) => i.id === selectedItemId)
    if (!item) return

    const qty = Number.parseInt(quantity)
    const rateNum = Number.parseFloat(rate)

    const newItem: PreApprovalItem = {
      id: `item-${Date.now()}`,
      itemId: item.id,
      itemName: item.name,
      description: description || "NA",
      uom: item.unit || "PCS",
      currentStock: item.quantity || 0,
      quantity: qty,
      rate: rateNum,
      remarks: "",
      total: qty * rateNum,
    }

    setPreApprovalItems([...preApprovalItems, newItem])
    setSelectedItemId("")
    setDescription("")
    setQuantity("")
    setRate("")
  }

  const removeItem = (id: string) => {
    setPreApprovalItems(preApprovalItems.filter((item) => item.id !== id))
  }

  const updateItemField = (id: string, field: keyof PreApprovalItem, value: string | number) => {
    setPreApprovalItems(
      preApprovalItems.map((item) => {
        if (item.id !== id) return item

        const updatedItem = { ...item, [field]: value }

        // Recalculate total if quantity or rate changes
        if (field === "quantity" || field === "rate") {
          updatedItem.total = updatedItem.quantity * updatedItem.rate
        }

        return updatedItem
      }),
    )
  }

  const totalAmount = preApprovalItems.reduce((sum, item) => sum + item.total, 0)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!wingId || !warehouseId || preApprovalItems.length === 0) {
      alert("Please fill in all required fields and add at least one item")
      return
    }

    setLoading(true)

    const newPreApproval = {
      id: `pa-${Date.now()}`,
      preApprovalId: `PA-${Date.now().toString().slice(-6)}`,
      wingId,
      warehouseId,
      requestedBy: user.fullName,
      requestDate: new Date().toISOString(),
      purpose: "",
      remarks: "",
      items: preApprovalItems.map((item) => ({
        itemId: item.itemId,
        description: item.itemName,
        quantity: item.quantity,
        unitPrice: item.rate,
        totalPrice: item.total,
      })),
      totalAmount,
      status: "Draft" as const,
      workflowHistory: [],
    }

    addPreApproval(newPreApproval)

    setTimeout(() => {
      setLoading(false)
      router.push("/procurement/pre-approval")
    }, 500)
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex items-center gap-3">
            <Link href="/procurement/pre-approval">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold">Create Pre-Approval</h1>
              <p className="text-sm text-muted-foreground">Initiate a new procurement request</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="border rounded-lg bg-card">
              <div className="p-6 space-y-6">
                <div>
                  <h2 className="text-lg font-semibold">Request Information</h2>
                  <p className="text-sm text-muted-foreground mt-1">Select the wing and warehouse for this request</p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="wing" className="text-sm font-medium">
                      Wing <span className="text-destructive">*</span>
                    </Label>
                    <Select value={wingId} onValueChange={setWingId} required>
                      <SelectTrigger id="wing">
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

                  <div className="space-y-2">
                    <Label htmlFor="warehouse" className="text-sm font-medium">
                      Warehouse <span className="text-destructive">*</span>
                    </Label>
                    <Select value={warehouseId} onValueChange={setWarehouseId} required>
                      <SelectTrigger id="warehouse">
                        <SelectValue placeholder="Select warehouse" />
                      </SelectTrigger>
                      <SelectContent>
                        {warehouses.map((warehouse) => (
                          <SelectItem key={warehouse.id} value={warehouse.id}>
                            {warehouse.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>

            <div className="border rounded-lg bg-card">
              <div className="p-6 space-y-6">
                <div>
                  <h2 className="text-lg font-semibold">Add Items</h2>
                  <p className="text-sm text-muted-foreground mt-1">Select items and enter details for this request</p>
                </div>

                {/* Add Item Form */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                  <div className="md:col-span-3 space-y-2">
                    <Label htmlFor="item" className="text-sm font-medium">
                      Item
                    </Label>
                    <Select value={selectedItemId} onValueChange={setSelectedItemId}>
                      <SelectTrigger id="item">
                        <SelectValue placeholder="Select item" />
                      </SelectTrigger>
                      <SelectContent>
                        {items.map((item) => (
                          <SelectItem key={item.id} value={item.id}>
                            {item.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="md:col-span-3 space-y-2">
                    <Label htmlFor="description" className="text-sm font-medium">
                      Description
                    </Label>
                    <Input
                      id="description"
                      placeholder="Item description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>

                  <div className="md:col-span-2 space-y-2">
                    <Label htmlFor="quantity" className="text-sm font-medium">
                      Quantity
                    </Label>
                    <Input
                      id="quantity"
                      type="number"
                      placeholder="Qty"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                    />
                  </div>

                  <div className="md:col-span-2 space-y-2">
                    <Label htmlFor="rate" className="text-sm font-medium">
                      Rate
                    </Label>
                    <Input
                      id="rate"
                      type="number"
                      placeholder="Rate"
                      value={rate}
                      onChange={(e) => setRate(e.target.value)}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <Button type="button" onClick={addItem} className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Add
                    </Button>
                  </div>
                </div>

                {/* Items Table */}
                {preApprovalItems.length > 0 && (
                  <div className="border rounded-lg overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Item</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead className="text-center">UOM</TableHead>
                          <TableHead className="text-center">Curr. Stock</TableHead>
                          <TableHead className="text-center">Quantity</TableHead>
                          <TableHead className="text-center">Rate</TableHead>
                          <TableHead className="text-right">Total</TableHead>
                          <TableHead>Remarks</TableHead>
                          <TableHead className="w-[50px]"></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {preApprovalItems.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell className="font-medium">{item.itemName}</TableCell>
                            <TableCell>
                              <Input
                                value={item.description}
                                onChange={(e) => updateItemField(item.id, "description", e.target.value)}
                                className="h-8 text-sm"
                              />
                            </TableCell>
                            <TableCell className="text-center text-muted-foreground">{item.uom}</TableCell>
                            <TableCell className="text-center text-muted-foreground">{item.currentStock}</TableCell>
                            <TableCell className="text-center">
                              <Input
                                type="number"
                                value={item.quantity}
                                onChange={(e) =>
                                  updateItemField(item.id, "quantity", Number.parseInt(e.target.value) || 0)
                                }
                                className="h-8 w-20 text-center mx-auto"
                              />
                            </TableCell>
                            <TableCell className="text-center">
                              <Input
                                type="number"
                                value={item.rate}
                                onChange={(e) =>
                                  updateItemField(item.id, "rate", Number.parseFloat(e.target.value) || 0)
                                }
                                className="h-8 w-24 text-center mx-auto"
                              />
                            </TableCell>
                            <TableCell className="text-right font-medium">${item.total.toFixed(2)}</TableCell>
                            <TableCell>
                              <Input
                                value={item.remarks}
                                onChange={(e) => updateItemField(item.id, "remarks", e.target.value)}
                                placeholder="Remarks"
                                className="h-8 text-sm min-w-[150px]"
                              />
                            </TableCell>
                            <TableCell>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => removeItem(item.id)}
                                className="h-8 w-8"
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    <div className="border-t bg-muted/30 p-4 flex justify-end">
                      <div className="text-right">
                        <span className="text-sm font-medium text-muted-foreground mr-4">Total Amount:</span>
                        <span className="text-lg font-bold">${totalAmount.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <Link href="/procurement/pre-approval">
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </Link>
              <Button type="submit" disabled={loading || preApprovalItems.length === 0}>
                {loading ? "Submitting..." : "Submit Pre-Approval"}
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
