"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

interface TrackedAsset {
  code: string
  assetName: string
  identifier: string
  identifierValue: string
  regDate: string
  bookValue: number
  totalDepr: number
  totalMaint: number
  status: "Available" | "Maintenance" | "Assigned"
  assignedTo?: string
}

const DEMO_ASSETS: TrackedAsset[] = [
  {
    code: "AR-M251100008",
    assetName: "Asset Schedule Testing",
    identifier: "Model",
    identifierValue: "AST-SCD-03",
    regDate: "10-11-2025",
    bookValue: 30000,
    totalDepr: 166.85,
    totalMaint: 0.0,
    status: "Available",
  },
  {
    code: "AR-M251100006",
    assetName: "Asset Schedule Testing",
    identifier: "Model",
    identifierValue: "AST-SCD-01",
    regDate: "01-11-2025",
    bookValue: 50000,
    totalDepr: 383.56,
    totalMaint: 0.0,
    status: "Available",
  },
  {
    code: "AR-M251100007",
    assetName: "Asset Schedule Testing",
    identifier: "Model",
    identifierValue: "AST-SCD-02",
    regDate: "01-11-2025",
    bookValue: 54000,
    totalDepr: 414.25,
    totalMaint: 5000.0,
    status: "Available",
  },
  {
    code: "AR-M251100005",
    assetName: "ASSETITEM ADDITION",
    identifier: "Model",
    identifierValue: "ASS-MM-2025",
    regDate: "25-11-2025",
    bookValue: 55000,
    totalDepr: 120.55,
    totalMaint: 3000.0,
    status: "Available",
  },
  {
    code: "AR-M251100000",
    assetName: "LED TV WC1001",
    identifier: "LEDTV01",
    identifierValue: "LEDTV01",
    regDate: "12-11-2025",
    bookValue: 50000,
    totalDepr: 536.99,
    totalMaint: 1000.0,
    status: "Maintenance",
    assignedTo: "Rakib Uddin Sohan (0...",
  },
  {
    code: "AR-M251100001",
    assetName: "LED TV WC1001",
    identifier: "LEDTV01",
    identifierValue: "LEDTV02",
    regDate: "12-11-2025",
    bookValue: 20000,
    totalDepr: 536.99,
    totalMaint: 0.0,
    status: "Assigned",
    assignedTo: "John Doe",
  },
  {
    code: "AR-M250800002",
    assetName: "Chuwi Laptop M-01",
    identifier: "Serial",
    identifierValue: "CWL-003",
    regDate: "18-09-2025",
    bookValue: 75000,
    totalDepr: 1250.0,
    totalMaint: 2500.0,
    status: "Assigned",
    assignedTo: "John Doe",
  },
  {
    code: "AR-M250700010",
    assetName: "Samsung Fast Charger",
    identifier: "Serial",
    identifierValue: "SFC-1",
    regDate: "27-07-2025",
    bookValue: 1500,
    totalDepr: 25.0,
    totalMaint: 0.0,
    status: "Assigned",
    assignedTo: "Azad Sharower",
  },
]

export default function AssetTrackingPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [divisionFilter, setDivisionFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [subCategoryFilter, setSubCategoryFilter] = useState("all")
  const [minorCategoryFilter, setMinorCategoryFilter] = useState("all")

  const getStatusColor = (status: TrackedAsset["status"]) => {
    switch (status) {
      case "Available":
        return "bg-green-100 text-green-800 border-green-300"
      case "Maintenance":
        return "bg-amber-100 text-amber-800 border-amber-300"
      case "Assigned":
        return "bg-blue-100 text-blue-800 border-blue-300"
      default:
        return "bg-gray-100 text-gray-800 border-gray-300"
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="p-6 max-w-[1600px] mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Asset List (Registered Tracking)</h1>
          </div>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-4 gap-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">Division</label>
            <Select value={divisionFilter} onValueChange={setDivisionFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Division" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Division</SelectItem>
                <SelectItem value="division1">Division 1</SelectItem>
                <SelectItem value="division2">Division 2</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">Category</label>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Category</SelectItem>
                <SelectItem value="electronics">Electronics</SelectItem>
                <SelectItem value="furniture">Furniture</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">Sub Category</label>
            <Select value={subCategoryFilter} onValueChange={setSubCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Sub Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Sub Category</SelectItem>
                <SelectItem value="sub1">Sub Category 1</SelectItem>
                <SelectItem value="sub2">Sub Category 2</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">Minor Category</label>
            <Select value={minorCategoryFilter} onValueChange={setMinorCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Minor Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Minor Category</SelectItem>
                <SelectItem value="minor1">Minor Category 1</SelectItem>
                <SelectItem value="minor2">Minor Category 2</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Table */}
        <div className="border rounded-lg bg-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-blue-50 border-b">
                <tr>
                  <th className="text-left p-4 text-sm font-semibold text-foreground">Code (AR Number)</th>
                  <th className="text-left p-4 text-sm font-semibold text-foreground">Asset</th>
                  <th className="text-left p-4 text-sm font-semibold text-foreground">Identifier</th>
                  <th className="text-left p-4 text-sm font-semibold text-foreground">Identifier Value</th>
                  <th className="text-left p-4 text-sm font-semibold text-foreground">Reg. Date</th>
                  <th className="text-right p-4 text-sm font-semibold text-foreground">Book Value</th>
                  <th className="text-right p-4 text-sm font-semibold text-foreground">Tot. Depr</th>
                  <th className="text-right p-4 text-sm font-semibold text-foreground">Tot. Maint</th>
                  <th className="text-left p-4 text-sm font-semibold text-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {DEMO_ASSETS.map((asset, index) => (
                  <tr key={asset.code} className="border-b hover:bg-muted/50 transition-colors">
                    <td className="p-4 text-sm text-blue-600 font-medium">{asset.code}</td>
                    <td className="p-4 text-sm text-foreground">{asset.assetName}</td>
                    <td className="p-4 text-sm text-muted-foreground">{asset.identifier}</td>
                    <td className="p-4 text-sm text-foreground">{asset.identifierValue}</td>
                    <td className="p-4 text-sm text-muted-foreground">{asset.regDate}</td>
                    <td className="p-4 text-sm text-right text-foreground">
                      {asset.bookValue.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                    <td className="p-4 text-sm text-right text-muted-foreground">
                      {asset.totalDepr.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                    <td className="p-4 text-sm text-right text-muted-foreground">
                      {asset.totalMaint.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                    <td className="p-4">
                      <div className="space-y-1">
                        <Badge className={`${getStatusColor(asset.status)} border`}>{asset.status}</Badge>
                        {asset.assignedTo && (
                          <div className="text-xs text-muted-foreground mt-1">{asset.assignedTo}</div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
