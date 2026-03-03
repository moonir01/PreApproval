import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, XCircle, CheckCircle } from "lucide-react"
import Link from "next/link"
import { demoApprovalRequisitions } from "@/lib/demo-data"

export default async function ApproveRequisitionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const requisition = demoApprovalRequisitions.find((r) => r.id === id)

  if (!requisition) {
    return (
      <div className="p-6">
        <p>Requisition not found</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/approval/purchase-requisition">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-xl font-semibold text-gray-900">Approve Requisition: {requisition.requisitionNo}</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="bg-red-50 hover:bg-red-100 text-red-700 border-red-300">
            <XCircle className="h-4 w-4 mr-2" />
            Reject
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            <CheckCircle className="h-4 w-4 mr-2" />
            Approve
          </Button>
        </div>
      </div>

      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        {/* Requisition Details */}
        <Card className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <p className="text-sm text-gray-500 mb-1">Requisition No</p>
              <p className="text-sm font-medium text-gray-900">{requisition.requisitionNo}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Request Date</p>
              <p className="text-sm font-medium text-gray-900">{requisition.date}, 16:16:17</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Requested By</p>
              <p className="text-sm font-medium text-gray-900">{requisition.requestedBy}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Status</p>
              <p className="text-sm font-medium text-yellow-600">{requisition.status}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Wing / Office</p>
              <p className="text-sm font-medium text-gray-900">{requisition.wing}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Total Amount</p>
              <p className="text-sm font-medium text-blue-600">{requisition.totalAmount.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Warehouse</p>
              <p className="text-sm font-medium text-gray-900">{requisition.warehouse}</p>
            </div>
          </div>
        </Card>

        {/* Item Details */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Item Details</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Code</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Item</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">UOM</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Price</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Req Qty</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rate</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {requisition.itemDetails.map((item, index) => (
                  <tr key={index}>
                    <td className="px-4 py-3 text-sm text-gray-900">{item.code}</td>
                    <td className="px-4 py-3 text-sm text-blue-600">{item.item}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{item.uom}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{item.lastPrice.toFixed(2)}</td>
                    <td className="px-4 py-3 text-sm text-blue-600 font-medium">{item.stock}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 font-medium">{item.reqQty}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{item.rate.toFixed(2)}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 font-medium">{item.total.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-50 border-t">
                <tr>
                  <td colSpan={7} className="px-4 py-3 text-right text-sm font-semibold text-gray-900">
                    Grand Total:
                  </td>
                  <td className="px-4 py-3 text-sm font-bold text-blue-600">{requisition.totalAmount.toFixed(2)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </Card>

        {/* Budget Summary */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Budget Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-sm text-green-700 mb-1">Allocated Budget</p>
              <p className="text-2xl font-bold text-green-600">
                {requisition.budgetSummary.allocated.toLocaleString()}.00
              </p>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-700 mb-1">Utilized</p>
              <p className="text-2xl font-bold text-blue-600">
                {requisition.budgetSummary.utilized.toLocaleString()}.00
              </p>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-700 mb-1">Remaining</p>
              <p className="text-2xl font-bold text-yellow-600">
                {requisition.budgetSummary.remaining.toLocaleString()}.00
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
