"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { User, Edit, Settings, Play, Palette, Globe } from "lucide-react"

export default function AccountPage() {
  const { user, updateUser } = useAuth()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    username: user?.username || "",
    email: user?.email || "",
    telegram: user?.telegram || "",
    website: user?.website || "",
    paymentInfo: user?.paymentInfo || "USDT TRC20",
    ...user?.playerSettings,
  })

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handlePlayerSettingChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSave = async () => {
    setLoading(true)
    const { username, email, telegram, website, paymentInfo, ...playerSettings } = formData

    const updateData = {
      username,
      email,
      telegram,
      website,
      paymentInfo,
      playerSettings,
    }

    const result = await updateUser(updateData)
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
        <Tabs defaultValue="edit-info" className="w-full">
          <TabsList className="grid w-full grid-cols-6 bg-slate-800 mb-6">
            <TabsTrigger value="edit-info" className="flex items-center gap-2">
              <Edit className="w-4 h-4" />
              Edit info
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Settings
            </TabsTrigger>
            <TabsTrigger value="player-settings" className="flex items-center gap-2">
              <Play className="w-4 h-4" />
              Player Settings
            </TabsTrigger>
            <TabsTrigger value="encoding" className="flex items-center gap-2">
              <Palette className="w-4 h-4" />
              Encoding
            </TabsTrigger>
            <TabsTrigger value="custom-domains" className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              Custom Domains
            </TabsTrigger>
            <TabsTrigger value="webmaster" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Webmaster
            </TabsTrigger>
          </TabsList>

          <TabsContent value="edit-info" className="space-y-6">
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
              <div className="space-y-2">
                <Label className="text-slate-300">Payment info:</Label>
                <div className="flex gap-2">
                  <Input
                    value={formData.paymentInfo}
                    className="bg-slate-700 border-slate-600 text-white flex-1"
                    readOnly
                  />
                  <Select
                    value={formData.paymentInfo}
                    onValueChange={(value) => handleInputChange("paymentInfo", value)}
                  >
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
              </div>
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
          </TabsContent>

          <TabsContent value="player-settings" className="space-y-6">
            <div className="grid gap-6">
              <div className="space-y-2">
                <Label className="text-slate-300">Allowed embed domains</Label>
                <Textarea
                  placeholder="Site domain where you can put embed codes. Empty to allow all sites.&#10;e.g.: site1.com, site2.net"
                  value={formData.allowedEmbedDomains}
                  onChange={(e) => handlePlayerSettingChange("allowedEmbedDomains", e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white min-h-[100px]"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300">Banned countries</Label>
                <Textarea
                  placeholder="e.g. US|CN|FR"
                  value={formData.bannedCountries}
                  onChange={(e) => handlePlayerSettingChange("bannedCountries", e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white min-h-[100px]"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300">Banned IPs</Label>
                <Textarea
                  placeholder="e.g. 1.1.1.1, 2.3.4.*"
                  value={formData.bannedIPs}
                  onChange={(e) => handlePlayerSettingChange("bannedIPs", e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white min-h-[100px]"
                />
              </div>
            </div>
            <Button onClick={handleSave} disabled={loading} className="bg-blue-600 hover:bg-blue-700 px-8">
              {loading ? "Saving..." : "Save Settings"}
            </Button>

            {/* Toggle Options */}
            <div className="grid grid-cols-2 gap-6 mt-8">
              <div className="flex items-center justify-between">
                <Label className="text-slate-300">Block direct</Label>
                <Switch
                  checked={formData.blockDirect}
                  onCheckedChange={(checked) => handlePlayerSettingChange("blockDirect", checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-slate-300">Chromecast</Label>
                <Switch
                  checked={formData.chromecast}
                  onCheckedChange={(checked) => handlePlayerSettingChange("chromecast", checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-slate-300">Video title</Label>
                <Switch
                  checked={formData.videoTitle}
                  onCheckedChange={(checked) => handlePlayerSettingChange("videoTitle", checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-slate-300">Disable URL Clone</Label>
                <Switch
                  checked={formData.disableURLClone}
                  onCheckedChange={(checked) => handlePlayerSettingChange("disableURLClone", checked)}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <div className="grid gap-6">
              <div className="space-y-2">
                <Label className="text-slate-300">Player Color</Label>
                <Input
                  type="color"
                  value={formData.playerColor}
                  onChange={(e) => handlePlayerSettingChange("playerColor", e.target.value)}
                  className="bg-slate-700 border-slate-600 h-12 w-20"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300">Subtitles Color</Label>
                <Input
                  value={formData.subtitlesColor}
                  onChange={(e) => handlePlayerSettingChange("subtitlesColor", e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-slate-300">Subtitles AutoPlay</Label>
                <Switch
                  checked={formData.subtitlesAutoPlay}
                  onCheckedChange={(checked) => handlePlayerSettingChange("subtitlesAutoPlay", checked)}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300">Default Subtitles Language</Label>
                <Select
                  value={formData.defaultSubtitlesLanguage}
                  onValueChange={(value) => handlePlayerSettingChange("defaultSubtitlesLanguage", value)}
                >
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600">
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300">Default Audio Track Language</Label>
                <Select
                  value={formData.defaultAudioTrackLanguage}
                  onValueChange={(value) => handlePlayerSettingChange("defaultAudioTrackLanguage", value)}
                >
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600">
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-slate-300">Player Watermark</Label>
                <Switch
                  checked={formData.playerWatermark}
                  onCheckedChange={(checked) => handlePlayerSettingChange("playerWatermark", checked)}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300">Player Logo Position</Label>
                <Select
                  value={formData.playerLogoPosition}
                  onValueChange={(value) => handlePlayerSettingChange("playerLogoPosition", value)}
                >
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600">
                    <SelectItem value="Top Left">Top Left</SelectItem>
                    <SelectItem value="Top Right">Top Right</SelectItem>
                    <SelectItem value="Bottom Left">Bottom Left</SelectItem>
                    <SelectItem value="Bottom Right">Bottom Right</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300">Player Logo Link</Label>
                <Input
                  value={formData.playerLogoLink}
                  onChange={(e) => handlePlayerSettingChange("playerLogoLink", e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300">Upload Player Logo</Label>
                <div className="flex gap-2">
                  <Button variant="outline" className="bg-slate-700 border-slate-600 text-white">
                    Choose File
                  </Button>
                  <span className="text-slate-400 text-sm self-center">No file chosen</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-slate-300">Replace site logo</Label>
                <Switch
                  checked={formData.replaceSiteLogo}
                  onCheckedChange={(checked) => handlePlayerSettingChange("replaceSiteLogo", checked)}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300">Copyright Text Footer</Label>
                <Input
                  value={formData.copyrightText}
                  onChange={(e) => handlePlayerSettingChange("copyrightText", e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
            </div>
            <Button onClick={handleSave} disabled={loading} className="bg-blue-600 hover:bg-blue-700 px-8">
              {loading ? "Saving..." : "Save Settings"}
            </Button>
          </TabsContent>

          <TabsContent value="encoding">
            <div className="text-slate-400">Encoding settings coming soon...</div>
          </TabsContent>

          <TabsContent value="custom-domains">
            <div className="text-slate-400">Custom domains settings coming soon...</div>
          </TabsContent>

          <TabsContent value="webmaster">
            <div className="text-slate-400">Webmaster tools coming soon...</div>
          </TabsContent>
        </Tabs>
      </div>

      {/* User Profile Card */}
      <div className="w-80">
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
      </div>
    </div>
  )
}
