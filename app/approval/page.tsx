"use client"

import type React from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import {
  ShoppingBag,
  FileText,
  Package,
  ClipboardList,
  ArrowRightLeft,
  ArrowDownToLine,
  ArrowUpFromLine,
} from "lucide-react"

interface ApprovalCardData {
  id: string
  title: string
  count: number
  icon: React.ReactNode
  category: string
}

const approvalData: ApprovalCardData[] = [
  {
    id: "pre-approval",
    title: "Pre-Approval",
    count: 64,
    icon: <ClipboardList className="h-5 w-5" />,
    category: "PURCHASE APPROVAL",
  },
  {
    id: "note-sheet",
    title: "Note Sheet",
    count: 48,
    icon: <FileText className="h-5 w-5" />,
    category: "PURCHASE APPROVAL",
  },
  {
    id: "purchase-order",
    title: "Purchase Order",
    count: 62,
    icon: <ShoppingBag className="h-5 w-5" />,
    category: "PURCHASE APPROVAL",
  },
  {
    id: "purchase-receive",
    title: "Purchase Receive (GRN)",
    count: 57,
    icon: <Package className="h-5 w-5" />,
    category: "PURCHASE APPROVAL",
  },
  {
    id: "inventory-issue",
    title: "Inventory Issue",
    count: 35,
    icon: <ArrowRightLeft className="h-5 w-5" />,
    category: "INVENTORY APPROVAL",
  },
  {
    id: "inventory-receive",
    title: "Inventory Receive",
    count: 28,
    icon: <ArrowDownToLine className="h-5 w-5" />,
    category: "INVENTORY APPROVAL",
  },
  {
    id: "inventory-transfer",
    title: "Inventory Transfer",
    count: 19,
    icon: <ArrowUpFromLine className="h-5 w-5" />,
    category: "INVENTORY APPROVAL",
  },
]

const categories = ["PURCHASE APPROVAL", "INVENTORY APPROVAL"]

export default function ApprovalPage() {
  const router = useRouter()

  const handleCardClick = (id: string) => {
    router.push(`/approval/${id}`)
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {categories.map((category) => (
        <div key={category} className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">{category}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {approvalData
              .filter((item) => item.category === category)
              .map((item) => (
                <Card
                  key={item.id}
                  onClick={() => handleCardClick(item.id)}
                  className="p-4 flex items-center justify-between cursor-pointer hover:shadow-md transition-shadow border border-gray-200 bg-white"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div className="text-gray-600">{item.icon}</div>
                    <span className="text-sm font-medium text-gray-900">{item.title}</span>
                  </div>
                  <Badge
                    variant={item.count === 0 ? "secondary" : "destructive"}
                    className={
                      item.count === 0
                        ? "bg-green-500 hover:bg-green-600 text-white rounded-full min-w-[32px] h-[32px] flex items-center justify-center"
                        : "bg-red-500 hover:bg-red-600 text-white rounded-full min-w-[32px] h-[32px] flex items-center justify-center"
                    }
                  >
                    {item.count}
                  </Badge>
                </Card>
              ))}
          </div>
        </div>
      ))}
    </div>
  )
}
