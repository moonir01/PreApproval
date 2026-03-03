"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { useData } from "@/lib/data-context"
import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, FileDown, Plus } from "lucide-react"
import { AssetRegisterModal } from "@/components/asset-register-modal"
import type { Asset } from "@/lib/demo-data"

export default function AssetRegisterPage() {
  const router = useRouter()
  const { isAuthenticated } = useAuth()
  const { assets } = useData()
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [filteredAssets, setFilteredAssets] = useState<Asset[]>(assets)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, router])

  useEffect(() => {
    let filtered = assets

    if (searchTerm) {
      filtered = filtered.filter(
        (asset) =>
          asset.assetCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
          asset.assetName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          asset.brand.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (categoryFilter !== "all") {
      filtered = filtered.filter((asset) => asset.category === categoryFilter)
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((asset) => asset.status === statusFilter)
    }

    setFilteredAssets(filtered)
  }, [assets, searchTerm, categoryFilter, statusFilter])

  if (!isAuthenticated) {
    return null
  }

  const categories = Array.from(new Set(assets.map((a) => a.category).filter((c) => c !== "N/A")))

  const exportToExcel = () => {
    console.log("[v0] Exporting assets to Excel")
    alert("Excel export functionality - In production, this would download an Excel file")
  }

  const exportToPDF = () => {
    console.log("[v0] Exporting assets to PDF")
    alert("PDF export functionality - In production, this would download a PDF file")
  }

  const handleRegisterClick = (asset: Asset) => {
    setSelectedAsset(asset)
    setIsModalOpen(true)
  }

  return (
    <div className="flex min-h-screen bg-muted/30">
      <Sidebar />
      <main className="flex-1 lg:ml-64 p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Asset Registration</h1>
              <p className="text-muted-foreground mt-1">Manage and track organizational assets</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={exportToExcel}>
                <FileDown className="h-4 w-4 mr-2" />
                Excel
              </Button>
              <Button variant="outline" onClick={exportToPDF}>
                <FileDown className="h-4 w-4 mr-2" />
                PDF
              </Button>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Register Asset
              </Button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by asset code, name, or brand..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="In use">In use</SelectItem>
                <SelectItem value="In repair">In repair</SelectItem>
                <SelectItem value="Disposed">Disposed</SelectItem>
                <SelectItem value="Transferred">Transferred</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Asset Table */}
          <div className="border rounded-lg bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Asset Purchase Code</TableHead>
                  <TableHead>Asset Name</TableHead>
                  <TableHead>Division</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Sub Category</TableHead>
                  <TableHead>Minor Category</TableHead>
                  <TableHead className="text-right">QTY</TableHead>
                  <TableHead className="text-right">Book Value</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAssets.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                      No assets found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAssets.map((asset) => (
                    <TableRow key={asset.id}>
                      <TableCell className="font-medium">{asset.assetCode}</TableCell>
                      <TableCell>{asset.assetName}</TableCell>
                      <TableCell>{asset.division}</TableCell>
                      <TableCell>{asset.category}</TableCell>
                      <TableCell>{asset.subCategory}</TableCell>
                      <TableCell>{asset.minorCategory}</TableCell>
                      <TableCell className="text-right">{asset.quantity}</TableCell>
                      <TableCell className="text-right">${asset.bookValue.toLocaleString()}</TableCell>
                      <TableCell>
                        <Button size="sm" variant="default" onClick={() => handleRegisterClick(asset)}>
                          Register
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Summary */}
          <div className="flex justify-between items-center text-sm text-muted-foreground">
            <p>
              Showing {filteredAssets.length} of {assets.length} assets
            </p>
            <p>Total Book Value: ${filteredAssets.reduce((sum, asset) => sum + asset.bookValue, 0).toLocaleString()}</p>
          </div>
        </div>
      </main>
      <AssetRegisterModal open={isModalOpen} onOpenChange={setIsModalOpen} asset={selectedAsset} />
    </div>
  )
}
