"use client"

import { useState } from "react"
import { useData } from "@/lib/data-context"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Download, Eye } from "lucide-react"
import Link from "next/link"

export default function PurchaseOrderPage() {
  const { purchaseOrders, wings, warehouses, notesheets, employees } = useData()
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState("")

  const filteredPOs = purchaseOrders.filter(
    (po) =>
      po.purchaseOrderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      po.notesheetId.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Issued":
        return "bg-green-100 text-green-700"
      case "Draft":
        return "bg-gray-100 text-gray-700"
      case "Received":
        return "bg-blue-100 text-blue-700"
      case "Cancelled":
        return "bg-red-100 text-red-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  const exportToExcel = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "PO Number,Notesheet,Wing,Warehouse,Created By,Created Date,Total Amount,Status\n" +
      filteredPOs
        .map((po) => {
          const wing = wings.find((w) => w.id === po.wingId)
          const warehouse = warehouses.find((w) => w.id === po.warehouseId)
          const creator = employees.find((e) => e.id === po.createdBy)
          return `${po.purchaseOrderId},${po.notesheetId},${wing?.name || ""},${warehouse?.name || ""},${creator?.fullName || ""},${po.createdDate},${po.totalAmount},${po.status}`
        })
        .join("\n")
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", "purchase_orders_export.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Purchase Orders</h1>
        <p className="text-sm text-gray-600">Manage purchase orders from approved notesheets</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search purchase orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md"
            />
          </div>
          <div className="flex gap-2">
            <Button onClick={exportToExcel} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Excel
            </Button>
            <Link href="/procurement/purchase-order/create">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create PO
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>PO Number</TableHead>
              <TableHead>Notesheet</TableHead>
              <TableHead>Wing</TableHead>
              <TableHead>Warehouse</TableHead>
              <TableHead>Created By</TableHead>
              <TableHead>Created Date</TableHead>
              <TableHead>Total Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPOs.map((po) => {
              const wing = wings.find((w) => w.id === po.wingId)
              const warehouse = warehouses.find((w) => w.id === po.warehouseId)
              const creator = employees.find((e) => e.id === po.createdBy)
              return (
                <TableRow key={po.id}>
                  <TableCell className="font-medium">{po.purchaseOrderId}</TableCell>
                  <TableCell>{po.notesheetId}</TableCell>
                  <TableCell>{wing?.name || "N/A"}</TableCell>
                  <TableCell>{warehouse?.name || "N/A"}</TableCell>
                  <TableCell>{creator?.fullName || "N/A"}</TableCell>
                  <TableCell>{po.createdDate}</TableCell>
                  <TableCell>${po.totalAmount.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(po.status)}>{po.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Link href={`/procurement/purchase-order/${po.id}`}>
                      <Button variant="outline" size="sm">
                        <Eye className="h-3 w-3" />
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
