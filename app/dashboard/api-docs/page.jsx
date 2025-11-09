"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Copy, Code, Play, Film, Tv, List, Settings } from "lucide-react"

export default function ApiDocsPage() {
  const [copiedCode, setCopiedCode] = useState("")

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text)
    setCopiedCode(id)
    setTimeout(() => setCopiedCode(""), 2000)
  }

  const CodeBlock = ({ code, language = "bash", id }) => (
    <div className="relative">
      <pre className="bg-slate-900 border border-slate-700 rounded-lg p-4 overflow-x-auto">
        <code className="text-green-400 text-sm">{code}</code>
      </pre>
      <Button
        onClick={() => copyToClipboard(code, id)}
        size="sm"
        variant="outline"
        className="absolute top-2 right-2 bg-slate-800 border-slate-600 text-slate-300 hover:bg-slate-700"
      >
        {copiedCode === id ? "Copied!" : <Copy className="w-4 h-4" />}
      </Button>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
          <Code className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">API Documentation</h1>
          <p className="text-slate-400">Complete guide to integrate Uembed API into your applications</p>
        </div>
      </div>

      {/* Quick Start */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Play className="w-5 h-5" />
            Quick Start
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-slate-300">
            Get started with Uembed API in minutes. Use TMDB or IMDB IDs to embed movies and TV shows directly into your
            website.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Badge className="bg-blue-600">Base URL</Badge>
              <CodeBlock code="https://uembed.site/?id={tmdb_id}" id="base-url" />
            </div>
            <div className="space-y-2">
              <Badge className="bg-green-600">Authentication</Badge>
              <p className="text-slate-400 text-sm">No API key required for basic usage</p>
            </div>
          </div>
        </CardContent>
      </Card>


      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Play className="w-5 h-5" />
            Api Key (Go to Profile section for apikey)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-slate-300">
            Your saved setting will be applied to player, only on passing apikey ! You don't have to pass parameters, your params will be ignored if you pass apikey
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Badge className="bg-blue-600">Base URL</Badge>
              <CodeBlock code="https://uembed.site/?id={tmdb_id}&apikey=your_apikey" id="base-url" />
            </div>
            <div className="space-y-2">
              <Badge className="bg-green-600">Api Authentication</Badge>
              <p className="text-slate-400 text-sm"><b>&apikey=your_apikey</b></p>
            </div>
          </div>
        </CardContent>
      </Card>


      {/* API Endpoints */}
      <Tabs defaultValue="movies" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-slate-800">
          <TabsTrigger value="movies" className="flex items-center gap-2">
            <Film className="w-4 h-4" />
            Movies
          </TabsTrigger>
          <TabsTrigger value="tv-shows" className="flex items-center gap-2">
            <Tv className="w-4 h-4" />
            TV Shows
          </TabsTrigger>
          <TabsTrigger value="parameters" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Parameters
          </TabsTrigger>
          <TabsTrigger value="listing" className="flex items-center gap-2">
            <List className="w-4 h-4" />
            Listing
          </TabsTrigger>
        </TabsList>

        <TabsContent value="movies" className="space-y-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Movie Embed URL</CardTitle>
              <p className="text-slate-400">Use TMDB or IMDB ID to generate the movie embed URL.</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-white font-semibold">Endpoint</h3>
                <CodeBlock code="https://uembed.site/?id={tmdb_id}" id="movie-tmdb" />
                <CodeBlock code="https://uembed.site/?id={imdb_id}" id="movie-imdb" />
              </div>
              <div className="space-y-2">
                <h3 className="text-white font-semibold">Examples</h3>
                <div className="space-y-2">
                  <div>
                    <Badge variant="outline" className="text-slate-300 border-slate-500 mb-2">
                      TMDB ID
                    </Badge>
                    <CodeBlock code="https://uembed.site/?id=550" id="movie-example-tmdb" />
                  </div>
                  <div>
                    <Badge variant="outline" className="text-slate-300 border-slate-500 mb-2">
                      IMDB ID
                    </Badge>
                    <CodeBlock code="https://uembed.site/?id=tt0137523" id="movie-example-imdb" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tv-shows" className="space-y-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">TV Show Embed URL</CardTitle>
              <p className="text-slate-400">
                Use TMDB or IMDB ID along with season and episode numbers for the TV show.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-white font-semibold">Endpoint</h3>
                <CodeBlock
                  code="https://uembed.site/?id={tmdb_id}&season={season_number}&episode={episode_number}"
                  id="tv-tmdb"
                />
                <CodeBlock
                  code="https://uembed.site/?id={imdb_id}&season={season_number}&episode={episode_number}"
                  id="tv-imdb"
                />
              </div>
              <div className="space-y-2">
                <h3 className="text-white font-semibold">Examples</h3>
                <div className="space-y-2">
                  <div>
                    <Badge variant="outline" className="text-slate-300 border-slate-500 mb-2">
                      Game of Thrones - Season 1, Episode 1
                    </Badge>
                    <CodeBlock code="https://uembed.site/?id=1399&season=1&episode=1" id="tv-example-got" />
                  </div>
                  <div>
                    <Badge variant="outline" className="text-slate-300 border-slate-500 mb-2">
                      Breaking Bad - Season 2, Episode 5
                    </Badge>
                    <CodeBlock code="https://uembed.site/?id=tt0903747&season=2&episode=5" id="tv-example-bb" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="parameters" className="space-y-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Language Parameter</CardTitle>
              <p className="text-slate-400">
                Set Language Default based on your preference. Use the lang parameter in the API request.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-white font-semibold">Usage</h3>
                <p className="text-slate-400 text-sm">Default English, lang=hi for Hindi</p>
                <CodeBlock code="https://uembed.site/?id=1399&season=1&episode=1&lang=hi" id="lang-example" />
              </div>
              <div className="space-y-2">
                <h3 className="text-white font-semibold">Supported Languages</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  <Badge variant="outline" className="text-slate-300 border-slate-500">
                    en (English) Default
                  </Badge>
                  <Badge variant="outline" className="text-slate-300 border-slate-500">
                    hi (Hindi)
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Server Parameter</CardTitle>
              <p className="text-slate-400">You can select default server by server parameter in the API request.</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-white font-semibold">Usage</h3>
                <p className="text-slate-400 text-sm">Default server=0, change it to 1,2,3 as your preference</p>
                <CodeBlock code="https://uembed.site/?id=1399&season=1&episode=1&server=1" id="server-example" />
              </div>
              <div className="space-y-2">
                <h3 className="text-white font-semibold">Available Servers</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  <Badge variant="outline" className="text-slate-300 border-slate-500">
                    server=0 (Default)
                  </Badge>
                  <Badge variant="outline" className="text-slate-300 border-slate-500">
                    server=1
                  </Badge>
                  <Badge variant="outline" className="text-slate-300 border-slate-500">
                    server=2
                  </Badge>
                  <Badge variant="outline" className="text-slate-300 border-slate-500">
                    server=3
                  </Badge>
                   <Badge variant="outline" className="text-slate-300 border-slate-500">
                    server=4
                  </Badge>                 
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="listing" className="space-y-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">List All Movies & Series</CardTitle>
              <p className="text-slate-400">{`{type} is required - specify "tv" for TV shows or "movie" for movies.`}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-white font-semibold">Endpoint</h3>
                <CodeBlock
                  code="https://madplay.site/api/backendfetch?requestID={type}&language=en-US&page=1"
                  id="listing-endpoint"
                />
              </div>
              <div className="space-y-2">
                <h3 className="text-white font-semibold">Examples</h3>
                <div className="space-y-2">
                  <div>
                    <Badge variant="outline" className="text-slate-300 border-slate-500 mb-2">
                      Latest Movies
                    </Badge>
                    <CodeBlock
                      code="https://madplay.site/api/backendfetch?requestID=latestMovie&language=en-US&page=1"
                      id="latest-movies"
                    />
                  </div>
                  <div>
                    <Badge variant="outline" className="text-slate-300 border-slate-500 mb-2">
                      Latest TV Shows
                    </Badge>
                    <CodeBlock
                      code="https://madplay.site/api/backendfetch?requestID=latestTv&language=en-US&page=1"
                      id="latest-tv"
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-white font-semibold">Parameters</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-700">
                        <th className="text-left text-slate-300 p-2">Parameter</th>
                        <th className="text-left text-slate-300 p-2">Type</th>
                        <th className="text-left text-slate-300 p-2">Description</th>
                        <th className="text-left text-slate-300 p-2">Example</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-slate-700">
                        <td className="text-slate-400 p-2">requestID</td>
                        <td className="text-slate-400 p-2">string</td>
                        <td className="text-slate-400 p-2">Type of content (latestMovie, latestTv)</td>
                        <td className="text-slate-400 p-2">latestMovie</td>
                      </tr>
                      <tr className="border-b border-slate-700">
                        <td className="text-slate-400 p-2">language</td>
                        <td className="text-slate-400 p-2">string</td>
                        <td className="text-slate-400 p-2">Language code</td>
                        <td className="text-slate-400 p-2">en-US</td>
                      </tr>
                      <tr className="border-b border-slate-700">
                        <td className="text-slate-400 p-2">page</td>
                        <td className="text-slate-400 p-2">number</td>
                        <td className="text-slate-400 p-2">Page number for pagination</td>
                        <td className="text-slate-400 p-2">1</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Integration Examples */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Integration Examples</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h3 className="text-white font-semibold">HTML Iframe</h3>
            <CodeBlock
              code={`<iframe 
  src="https://uembed.site/?id=550" 
  width="100%" 
  height="500" 
  frameborder="0" 
  allowfullscreen>
</iframe>`}
              id="html-example"
            />
          </div>
          <div className="space-y-2">
            <h3 className="text-white font-semibold">JavaScript</h3>
            <CodeBlock
              code={`const embedUrl = 'https://uembed.site/?id=550&lang=en&server=1';
const iframe = document.createElement('iframe');
iframe.src = embedUrl;
iframe.width = '100%';
iframe.height = '500';
iframe.frameBorder = '0';
iframe.allowFullscreen = true;
document.getElementById('player-container').appendChild(iframe);`}
              id="js-example"
            />
          </div>
        </CardContent>
      </Card>

      {/* Rate Limits */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Rate Limits & Pricing</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-700 rounded-lg">
              <h3 className="text-white font-semibold mb-2">Starter Plan</h3>
              <p className="text-slate-400 text-sm mb-2">$4 per 10,000 requests</p>
              <ul className="text-slate-400 text-sm space-y-1">
                <li>• Ad-free experience</li>
                <li>• Custom ads support</li>
                <li>• Multi-domain access</li>
              </ul>
            </div>
            <div className="p-4 bg-slate-700 rounded-lg">
              <h3 className="text-white font-semibold mb-2">Professional Plan</h3>
              <p className="text-slate-400 text-sm mb-2">$200/month (up to 1M requests)</p>
              <ul className="text-slate-400 text-sm space-y-1">
                <li>• All Starter features</li>
                <li>• Priority support</li>
                <li>• Advanced analytics</li>
              </ul>
            </div>
            <div className="p-4 bg-slate-700 rounded-lg">
              <h3 className="text-white font-semibold mb-2">Enterprise Plan</h3>
              <p className="text-slate-400 text-sm mb-2">$500/month (unlimited)</p>
              <ul className="text-slate-400 text-sm space-y-1">
                <li>• All Professional features</li>
                <li>• 24/7 dedicated support</li>
                <li>• White-label solution</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
