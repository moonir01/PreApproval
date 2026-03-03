"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import type { Asset } from "@/lib/demo-data"

interface AssetRegisterModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  asset: Asset | null
}

interface AssetItem {
  assetName: string
  itemCode: string
  value: number
}

export function AssetRegisterModal({ open, onOpenChange, asset }: AssetRegisterModalProps) {
  const [registrationType, setRegistrationType] = useState<"private" | "public">("private")
  const [registerDate, setRegisterDate] = useState<Date>(new Date())
  const [identifierBy, setIdentifierBy] = useState("serial")
  const [lifeTime, setLifeTime] = useState("")
  const [leadTime, setLeadTime] = useState("")
  const [warrantyStartDate, setWarrantyStartDate] = useState<Date>(new Date())
  const [warrantyEndDate, setWarrantyEndDate] = useState<Date>(new Date())
  const [baseValue, setBaseValue] = useState("100")
  const [depreciation, setDepreciation] = useState(false)
  const [assetItems, setAssetItems] = useState<AssetItem[]>([])

  useEffect(() => {
    if (asset && open) {
      // Generate asset items based on quantity
      const items: AssetItem[] = []
      const qty = asset.quantity || 1
      const startValue = Number.parseInt(baseValue) || 100

      for (let i = 0; i < qty; i++) {
        items.push({
          assetName: asset.assetName,
          itemCode: `AST-${Math.floor(10000 + Math.random() * 90000)}`,
          value: startValue + i,
        })
      }
      setAssetItems(items)
    }
  }, [asset, open, baseValue])

  const handleIncrementAll = () => {
    const startValue = Number.parseInt(baseValue) || 100
    setAssetItems(
      assetItems.map((item, index) => ({
        ...item,
        value: startValue + index,
      })),
    )
  }

  const handleSave = () => {
    console.log("[v0] Saving asset registration:", {
      registrationType,
      registerDate,
      identifierBy,
      lifeTime,
      leadTime,
      warrantyStartDate,
      warrantyEndDate,
      baseValue,
      depreciation,
      assetItems,
    })
    // TODO: Implement actual save to data context
    alert("Asset registration saved successfully!")
    onOpenChange(false)
  }

  if (!asset) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-none w-[90vw] h-[90vh] rounded-lg flex flex-col">
        <DialogHeader>
          <DialogTitle>Asset Register</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 flex-1 overflow-y-auto px-6 pb-6">
          {/* Registration Type */}
          <RadioGroup value={registrationType} onValueChange={(v) => setRegistrationType(v as "private" | "public")}>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="private" id="private" />
                <Label htmlFor="private">Private</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="public" id="public" />
                <Label htmlFor="public">Public</Label>
              </div>
            </div>
          </RadioGroup>

          {/* Form Fields */}
          <div className="grid grid-cols-5 gap-4">
            {/* Asset Register Date */}
            <div className="space-y-2">
              <Label>Asset Register Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(registerDate, "MM/dd/yyyy")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={registerDate} onSelect={(date) => date && setRegisterDate(date)} />
                </PopoverContent>
              </Popover>
            </div>

            {/* Identifier By */}
            <div className="space-y-2">
              <Label>
                Identifier By <span className="text-red-500">*</span>
              </Label>
              <Select value={identifierBy} onValueChange={setIdentifierBy}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="serial">Serial No</SelectItem>
                  <SelectItem value="barcode">Barcode</SelectItem>
                  <SelectItem value="rfid">RFID</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Life Time */}
            <div className="space-y-2">
              <Label>Life Time (Year)</Label>
              <Input placeholder="Years" value={lifeTime} onChange={(e) => setLifeTime(e.target.value)} />
            </div>

            {/* Lead Time */}
            <div className="space-y-2">
              <Label>Lead Time (Days)</Label>
              <Input placeholder="Days" value={leadTime} onChange={(e) => setLeadTime(e.target.value)} />
            </div>

            {/* Warranty Start Date */}
            <div className="space-y-2">
              <Label>Warranty Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(warrantyStartDate, "MM/dd/yyyy")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={warrantyStartDate}
                    onSelect={(date) => date && setWarrantyStartDate(date)}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Second Row */}
          <div className="grid grid-cols-5 gap-4">
            {/* Warranty End Date */}
            <div className="space-y-2">
              <Label>Warranty End Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(warrantyEndDate, "MM/dd/yyyy")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={warrantyEndDate}
                    onSelect={(date) => date && setWarrantyEndDate(date)}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Value (Identifier) */}
            <div className="space-y-2">
              <Label>Value (Identifier)</Label>
              <Input type="number" value={baseValue} onChange={(e) => setBaseValue(e.target.value)} />
            </div>

            {/* Increment All Button */}
            <div className="space-y-2">
              <Label className="opacity-0">Action</Label>
              <Button onClick={handleIncrementAll} className="w-full">
                Increment All
              </Button>
            </div>

            {/* Depreciation */}
            <div className="space-y-2">
              <Label className="opacity-0">Options</Label>
              <div className="flex items-center space-x-2 h-10">
                <Checkbox
                  id="depreciation"
                  checked={depreciation}
                  onCheckedChange={(checked) => setDepreciation(checked === true)}
                />
                <label
                  htmlFor="depreciation"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Depreciation
                </label>
              </div>
            </div>
          </div>

          {/* Asset Items Table */}
          <div className="border rounded-lg">
            <div className="overflow-auto max-h-96">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="p-3 text-left text-sm font-medium">#</th>
                    <th className="p-3 text-left text-sm font-medium">Asset Name</th>
                    <th className="p-3 text-left text-sm font-medium">Item Code</th>
                    <th className="p-3 text-left text-sm font-medium">Value (Identifier)</th>
                  </tr>
                </thead>
                <tbody>
                  {assetItems.map((item, index) => (
                    <tr key={index} className="border-t">
                      <td className="p-3 text-sm">{index + 1}</td>
                      <td className="p-3 text-sm">{item.assetName}</td>
                      <td className="p-3 text-sm">{item.itemCode}</td>
                      <td className="p-3 text-sm">
                        <Input
                          type="number"
                          value={item.value}
                          onChange={(e) => {
                            const newItems = [...assetItems]
                            newItems[index].value = Number.parseInt(e.target.value) || 0
                            setAssetItems(newItems)
                          }}
                          className="w-32"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              CLOSE
            </Button>
            <Button onClick={handleSave}>SAVE</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
