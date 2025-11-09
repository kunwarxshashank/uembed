"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Settings, Play, Palette, Globe, User } from "lucide-react"

export default function PlayerPage() {
  const { user, updateUser } = useAuth()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    ...user?.playerSettings,
  })

  const handlePlayerSettingChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSave = async () => {
    setLoading(true)
    const result = await updateUser({ playerSettings: formData })
    if (result.success) {
      // Show success message
    }
    setLoading(false)
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="settings" className="w-full">
        <TabsList className="grid w-full grid-cols-5 bg-slate-800 mb-6">

          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Customization
          </TabsTrigger>
          <TabsTrigger value="player-settings" className="flex items-center gap-2">
            <Play className="w-4 h-4" />
            Security
          </TabsTrigger>
          <TabsTrigger value="webmaster" className="flex items-center gap-2">
            <User className="w-4 h-4" />
            Webmaster
          </TabsTrigger>
        </TabsList>


        {/* <TabsContent value="player-settings" className="space-y-6">
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
              <Label className="text-slate-300">Banned IPs</Label>
              <Textarea
                placeholder="e.g. 1.1.1.1, 2.3.4.*"
                value={formData.bannedIPs}
                onChange={(e) => handlePlayerSettingChange("bannedIPs", e.target.value)}
                className="bg-slate-700 border-slate-600 text-white min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300">Referer List</Label>
              <Textarea
                placeholder="e.g. 1.1.1.1, 2.3.4.*"
                value={formData.refererList}
                onChange={(e) => handlePlayerSettingChange("bannedIPs", e.target.value)}
                className="bg-slate-700 border-slate-600 text-white min-h-[100px]"
              />
            </div>

          </div>
          <Button onClick={handleSave} disabled={loading} className="bg-blue-600 hover:bg-blue-700 px-8">
            {loading ? "Saving..." : "Save Settings"}
          </Button>


          <div className="grid grid-cols-2 gap-6 mt-8">
            <div className="flex items-center justify-between">
              <Label className="text-slate-300">Block direct Access</Label>
              <Switch
                checked={formData.blockDirect}
                onCheckedChange={(checked) => handlePlayerSettingChange("blockDirect", checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label className="text-slate-300">Sandbox Detection</Label>
              <Switch
                checked={formData.sandboxDetect}
                onCheckedChange={(checked) => handlePlayerSettingChange("sandboxDetect", checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label className="text-slate-300">Adblock Detection</Label>
              <Switch
                checked={formData.adblockDetect}
                onCheckedChange={(checked) => handlePlayerSettingChange("adblockDetect", checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label className="text-slate-300">Devtools Detection</Label>
              <Switch
                checked={formData.devtoolDetect}
                onCheckedChange={(checked) => handlePlayerSettingChange("devtoolDetect", checked)}
              />
            </div>            
          </div>
        </TabsContent> */}



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



            {/* <div className="space-y-2">
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
                  <SelectItem value="hi">Hindi</SelectItem>
                </SelectContent>
              </Select>
            </div> */}


            {/* <div className="space-y-2">
              <Label className="text-slate-300">Default Server</Label>
              <Select
                value={formData.defaultServer}
                onValueChange={(value) => handlePlayerSettingChange("defaultServer", value)}
              >
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600">
                  <SelectItem value="0">Server 0</SelectItem>
                  <SelectItem value="1">Server 1</SelectItem>
                  <SelectItem value="2">Server 2</SelectItem>
                  <SelectItem value="3">Server 3</SelectItem>
                  <SelectItem value="4">Server 4</SelectItem>
                </SelectContent>
              </Select>
            </div> */}



            <div className="space-y-2">
              <Label className="text-slate-300">Choose Ads Type</Label>
              <Select
                value={formData.adstype}
                onValueChange={(value) => handlePlayerSettingChange("adstype", value)}
              >
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600">
                  <SelectItem value="popup">popup</SelectItem>
                  <SelectItem value="popunder">popunder</SelectItem>
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
            {formData.playerWatermark && (
              <div className="space-y-2">
                <Label className="text-slate-300">Player Logo Link</Label>
                <Input
                  placeholder="Enter png/svg logo"
                  value={formData.playerLogoLink}
                  onChange={(e) => handlePlayerSettingChange("playerLogoLink", e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
            )}
          </div>
          <Button onClick={handleSave} disabled={loading} className="bg-blue-600 hover:bg-blue-700 px-8">
            {loading ? "Saving..." : "Save Settings"}
          </Button>
        </TabsContent>


        <TabsContent value="player-settings">
          <div className="text-slate-400">Security settings coming soon...</div>
        </TabsContent>

        <TabsContent value="webmaster">
          <div className="text-slate-400">Webmaster tools coming soon...</div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
