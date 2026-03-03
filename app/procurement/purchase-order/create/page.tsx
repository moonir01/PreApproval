"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useData } from "@/lib/data-context"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Trash2, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function CreatePurchaseOrderPage() {
  const router = useRouter()
  const { notesheets, preApprovals, purchaseOrders, addPurchaseOrder, items: allItems } = useData()
  const { user } = useAuth()
  const [selectedNotesheetId, setSelectedNotesheetId] = useState("")
  const [poItems, setPOItems] = useState<
    Array<{ itemId: string; itemName: string; quantity: number; rate: number; total: number }>
  >([])
  const [notes, setNotes] = useState("")

  // Filter only approved notesheets
  const approvedNotesheets = notesheets.filter((ns) => ns.status === "Approved")

  const handleNotesheetSelect = (notesheetId: string) => {
    setSelectedNotesheetId(notesheetId)
    const notesheet = notesheets.find((ns) => ns.notesheetId === notesheetId)
    if (notesheet) {
      const preApproval = preApprovals.find((pa) => pa.preApprovalId === notesheet.preApprovalId)
      if (preApproval) {
        setPOItems(preApproval.items)
      }
    }
  }

  const handleQuantityChange = (index: number, quantity: number) => {
    const newItems = [...poItems]
    newItems[index].quantity = quantity
    newItems[index].total = quantity * newItems[index].rate
    setPOItems(newItems)
  }

  const handleRateChange = (index: number, rate: number) => {
    const newItems = [...poItems]
    newItems[index].rate = rate
    newItems[index].total = newItems[index].quantity * rate
    setPOItems(newItems)
  }

  const handleDeleteItem = (index: number) => {
    setPOItems(poItems.filter((_, i) => i !== index))
  }

  const handleAddItem = () => {
    setPOItems([
      ...poItems,
      {
        itemId: "",
        itemName: "",
        quantity: 0,
        rate: 0,
        total: 0,
      },
    ])
  }

  const handleItemSelect = (index: number, itemId: string) => {
    const item = allItems.find((i) => i.id === itemId)
    if (item) {
      const newItems = [...poItems]
      newItems[index] = {
        itemId: item.id,
        itemName: item.name,
        quantity: newItems[index].quantity || 1,
        rate: item.defaultRate,
        total: (newItems[index].quantity || 1) * item.defaultRate,
      }
      setPOItems(newItems)
    }
  }

  const totalAmount = poItems.reduce((sum, item) => sum + item.total, 0)

  const handleSubmit = () => {
    if (!selectedNotesheetId || poItems.length === 0) {
      alert("Please select a notesheet and add items")
      return
    }

    const notesheet = notesheets.find((ns) => ns.notesheetId === selectedNotesheetId)
    if (!notesheet) return

    const poNumber = `PO-${new Date().getFullYear()}-${String(purchaseOrders.length + 1).padStart(3, "0")}`

    addPurchaseOrder({
      purchaseOrderId: poNumber,
      notesheetId: selectedNotesheetId,
      preApprovalId: notesheet.preApprovalId,
      wingId: notesheet.wingId,
      warehouseId: notesheet.warehouseId,
      createdBy: user?.id || "",
      createdDate: new Date().toISOString().split("T")[0],
      items: poItems,
      totalAmount,
      status: "Issued",
      notes,
    })

    router.push("/procurement/purchase-order")
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <Link href="/procurement/purchase-order">
          <Button variant="ghost" size="sm" className="mb-2">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Purchase Orders
          </Button>
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Create Purchase Order</h1>
        <p className="text-sm text-gray-600">Create a new purchase order from approved notesheet</p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Select Notesheet</CardTitle>
            <CardDescription>Choose an approved notesheet to create purchase order</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="notesheet">Notesheet Number</Label>
                <Select value={selectedNotesheetId} onValueChange={handleNotesheetSelect}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select approved notesheet" />
                  </SelectTrigger>
                  <SelectContent>
                    {approvedNotesheets.map((ns) => (
                      <SelectItem key={ns.id} value={ns.notesheetId}>
                        {ns.notesheetId} - {ns.initiatedDate}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {selectedNotesheetId && (
          <>
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Purchase Order Items</CardTitle>
                    <CardDescription>Modify quantities and rates as needed</CardDescription>
                  </div>
                  <Button onClick={handleAddItem} size="sm">
                    Add Item
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item Name</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Rate ($)</TableHead>
                      <TableHead>Total ($)</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {poItems.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          {item.itemId ? (
                            item.itemName
                          ) : (
                            <Select value={item.itemId} onValueChange={(value) => handleItemSelect(index, value)}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select item" />
                              </SelectTrigger>
                              <SelectContent>
                                {allItems.map((i) => (
                                  <SelectItem key={i.id} value={i.id}>
                                    {i.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => handleQuantityChange(index, Number(e.target.value))}
                            className="w-24"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            step="0.01"
                            value={item.rate}
                            onChange={(e) => handleRateChange(index, Number(e.target.value))}
                            className="w-24"
                          />
                        </TableCell>
                        <TableCell>${item.total.toFixed(2)}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm" onClick={() => handleDeleteItem(index)}>
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell colSpan={3} className="text-right font-bold">
                        Total Amount:
                      </TableCell>
                      <TableCell className="font-bold">${totalAmount.toFixed(2)}</TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Additional Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Enter any additional notes or remarks..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                />
              </CardContent>
            </Card>

            <div className="flex justify-end gap-4">
              <Link href="/procurement/purchase-order">
                <Button variant="outline">Cancel</Button>
              </Link>
              <Button onClick={handleSubmit}>Create Purchase Order</Button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
