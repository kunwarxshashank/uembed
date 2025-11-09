"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { User } from "lucide-react"

export default function ProfilePage() {
  const { user, updateUser } = useAuth()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    username: user?.username || "",
    email: user?.email || "",
    telegram: user?.telegram || "",
    website: user?.website || "",
    paymentInfo: user?.paymentInfo || "USDT TRC20",
  })

  const isPremium = user?.premium === true;

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSave = async () => {
    setLoading(true)
    const result = await updateUser(formData)
    if (result.success) {
      // Show success message
    }
    setLoading(false)
  }

  const generateNewApiKey = async () => {
    const newApiKey = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    await updateUser({ apiKey: newApiKey })
  }

  return (
    <div className="flex gap-6">
      {/* Main Content */}
      <div className="flex-1">
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-white mb-6">Edit Profile Information</h2>

          <div className="mb-6">
            {isPremium ? (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-green-600 text-white shadow-md animate-pulse">
                Plan: Premium 🌟
              </span>
            ) : (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-yellow-400 text-black shadow-md">
                Plan: Free 🚀
              </span>
            )}
          </div>

          <div className="grid gap-6">
            <div className="space-y-2">
              <Label className="text-slate-300">Username:</Label>
              <Input
                value={formData.username}
                onChange={(e) => handleInputChange("username", e.target.value)}
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-300">Email:</Label>
              <Input
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-300">Telegram:</Label>
              <Input
                value={formData.telegram}
                onChange={(e) => handleInputChange("telegram", e.target.value)}
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-300">Website:</Label>
              <Input
                value={formData.website}
                onChange={(e) => handleInputChange("website", e.target.value)}
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>

            
            {/* <div className="space-y-2">
              <Label className="text-slate-300">Payment info:</Label>
              <div className="flex gap-2">
                <Input
                  value={formData.paymentInfo}
                  className="bg-slate-700 border-slate-600 text-white flex-1"
                  readOnly
                />
                <Select value={formData.paymentInfo} onValueChange={(value) => handleInputChange("paymentInfo", value)}>
                  <SelectTrigger className="w-40 bg-slate-700 border-slate-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600">
                    <SelectItem value="USDT TRC20">USDT TRC20</SelectItem>
                    <SelectItem value="BTC">BTC</SelectItem>
                    <SelectItem value="ETH">ETH</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div> */}


            <div className="space-y-2">
              <Label className="text-slate-300">Your API key:</Label>
              <div className="flex gap-2">
                <Input
                  value={user?.apiKey || ""}
                  className="bg-slate-700 border-slate-600 text-white flex-1"
                  readOnly
                />
                <Button onClick={generateNewApiKey} className="bg-blue-600 hover:bg-blue-700">
                  Change key
                </Button>
              </div>
            </div>
          </div>
          <Button onClick={handleSave} disabled={loading} className="bg-blue-600 hover:bg-blue-700 px-8">
            {loading ? "Saving..." : "Save Settings"}
          </Button>
        </div>
      </div>

      {/* User Profile Card */}
      {/* <div className="w-80">
        <Card className="bg-slate-800 border-slate-700 border-2 border-blue-500">
          <CardContent className="p-6 text-center">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-white text-xl font-semibold mb-2">Hello {user?.username || "User"}</h3>
            <p className="text-slate-400 mb-6">Welcome back!</p>
            <div className="space-y-3">
              <Button className="w-full bg-blue-600 hover:bg-blue-700">Change password</Button>
              <Button className="w-full bg-blue-600 hover:bg-blue-700">Change e-mail</Button>
            </div>
          </CardContent>
        </Card>
      </div> */}

    </div>
  )
}
