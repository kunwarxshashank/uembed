"use client"

import { useEffect, useState, useRef } from "react"
import { useSearchParams } from "next/navigation"
import dynamic from "next/dynamic"
import Script from 'next/script'
import ServerPopup from "@/components/player/server-popup"
import ResumeToast from "@/components/player/resume-toast"
import StreamOptions from "@/components/player/stream-options"
import Loading from "@/components/player/loading"
import NotFound from "@/components/player/notfound"
import Noembed from "@/components/player/noembed"
import { useAuth } from "@/contexts/auth-context"
import VidstackPlayer from "@/components/player/Player"

/*
This page handle basic working of Player
it fetch api and handle it 
*/




export default function VideoPlayer() { 
  // get these values from params
  const searchParams = useSearchParams();
  const id = searchParams.get("id") || ""
  const season = searchParams.get("season") || ""
  const episode = searchParams.get("episode") || ""
  const adstype = searchParams.get("adstype")
  const lang = searchParams.get("lang")
  const logo = searchParams.get("logo")
  const apikey = searchParams.get("apikey")
  const color = searchParams.get("color")


  /*
  External settings from database ===> PlayerSettings
  Priority given to external settings
  */

  const [externalSettings, setExternalSettings] = useState(null)
  const [externalUser, setExternalUser] = useState(null)
  const [settingsError, setSettingsError] = useState(null)


  const servers = useRef([]) // Use `useRef` to store server data
  const attemptedServers = useRef(new Set()) // Track attempted servers
  const [currentStreams, setCurrentStreams] = useState([])
  const [currentCaptions, setCurrentCaptions] = useState([])
  const [currentUrl, setCurrentUrl] = useState(null)
  const [currentStreamUrl, setCurrentStreamUrl] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAdsEnabled, setisAdsEnabled] = useState(false)
  const [isNotFound, setisNotFound] = useState(false)
  const [showPlayer, setShowPlayer] = useState(false)
  const [showServerPopup, setShowServerPopup] = useState(false)
  const [showResumeToast, setShowResumeToast] = useState(false)
  const [savedTime, setSavedTime] = useState(0)
  const playerRef = useRef(null)
  const [selectedServer, setSelectedServer] = useState(0)
  const [poster, setPoster] = useState("")
  const [isblockdirect, setisBlockdirect] = useState("");



  // Fetch settings by apikey if present
  useEffect(() => {
    const fetchSettingsByApiKey = async () => {
      if (apikey) {
        try {
          const res = await fetch("/api/apisettings", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ apikey }),
          })
          const data = await res.json();
          if (res.ok) {
            setExternalSettings(data.playerSettings)
            setExternalUser(data.user)
          } else {
            setSettingsError(data.error || "Failed to fetch settings")
          }
        } catch (err) {
          setSettingsError("Failed to fetch settings")
        }
      }
    }
    fetchSettingsByApiKey()
  }, [apikey])



  useEffect(() => {
    const fetchImdbData = async () => {
      if (id.startsWith("tt")) {
        try {
          const response = await fetch(
            `https://api.themoviedb.org/3/find/${id}?api_key=8d6d91941230817f7807d643736e8a49&external_source=imdb_id`
          )
          const data = await response.json()
          let tmdb_id

          if (data.movie_results && data.movie_results.length > 0) {
            tmdb_id = data.movie_results[0].id
          } else if (data.tv_results && data.tv_results.length > 0) {
            tmdb_id = data.tv_results[0].id
          }

          if (tmdb_id) {
            fetchServers(String(tmdb_id), season, episode)
          } else {
            console.error("No movie or TV results found for the given ID")
          }
        } catch (error) {
          console.error("Error fetching IMDB data:", error)
        }
      } else {
        fetchServers(id, season, episode)
      }
    }
    handleAdsToggle()
    fetchImdbData()
  }, [id, season, episode])



  useEffect(() => {
    const getData = async () => {
      const id = searchParams.get("id") || ""
      const season = searchParams.get("season") || ""
      const episode = searchParams.get("episode") || ""
      const apiurl = season && episode
        ? `https://api.themoviedb.org/3/tv/${id}?api_key=8d6d91941230817f7807d643736e8a49`
        : `https://api.themoviedb.org/3/movie/${id}?api_key=8d6d91941230817f7807d643736e8a49`

      const response = await fetch(apiurl)
      const data = await response.json()
      setPoster(`https://image.tmdb.org/t/p/original/${data.backdrop_path}`)
    }

    getData()
    
  }, [searchParams])


  
  const fetchServers = async (id, season, episode) => {
    const masterApiUrl =
      lang === "hi"
        ? "https://raw.githubusercontent.com/kunwarxshashank/rogplay_addons/refs/heads/main/cinema/hindi.json"
        : "https://raw.githubusercontent.com/kunwarxshashank/rogplay_addons/refs/heads/main/cinema/english.json"
    setIsLoading(true)

    try {
      const response = await fetch(masterApiUrl)
      const data = await response.json()

      servers.current = data.map((entry) => ({
        tv: entry.tvurl
          .replace("${tmdb}", id)
          .replace("${season}", season || "")
          .replace("${episode}", episode || ""),
        movie: entry.movieurl.replace("${tmdb}", id),
        title: entry.server,
      }))

      if (servers.current.length > 0) {
        // Check for &server= param
        const serverParam = searchParams.get("server")
        const serverIndex = serverParam && !isNaN(Number(serverParam)) ? Number(serverParam) : 0
        switchServer(serverIndex)
      } else {
        console.error("No servers available")
      }
    } catch (error) {
      console.error("Error fetching server data:", error)
    }
  }



  const fetchSubtitles = async (id, season, episode) => {
    const suburl =
      season && episode
        ? `https://madplay.site/api/subtitle?id=${id}&season=${season}&episode=${episode}`
        : `https://madplay.site/api/subtitle?id=${id}`

    try {
      const response = await fetch(suburl)
      if (!response.ok) return []

      const subjson = await response.json()
      return subjson.map((sub, index) => ({
        key: `captions-${sub.language || 'unknown'}-${index}`,
        file: sub.url || sub.file || "",
        label: sub.display || sub.label || `Subtitle ${index + 1}`,
        language: sub.language,
        kind: "captions",
      }));


    } catch (error) {
      console.error("Subtitle fetch error:", error)
      return []
    }
  }



  const switchServer = async (index) => {
    attemptedServers.current.add(index) // Mark this server as attempted
    const newUrl = season && episode ? servers.current[index].tv : servers.current[index].movie
    setCurrentUrl(newUrl)
    await setupPlayer(newUrl)
  }




  const setupPlayer = async (url) => {
    if (!url) return
    setIsLoading(true)

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Fetch timed out")), 10000)
    )

    const newurl = season && episode ? `https://madplay.site/api/vidz?id=${id}&season=${season}&episode=${episode}` : `https://madplay.site/api/vidz?id=${id}`;

    const fetchPromise = fetch(url).then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }
      return response.json()
    })

    try {
      const data = await Promise.race([fetchPromise, timeoutPromise])
      if (data?.length > 0) {
        setCurrentStreams(data)

        // Find a valid stream URL
        let streamlink = null
        for (const item of data) {
          if (item.file) {
            streamlink = item.file
            break
          } else if (item.url) {
            streamlink = item.url
            break
          }
        }

        if (streamlink) {
          setCurrentStreamUrl(streamlink)
          setIsLoading(false)
          setShowPlayer(true)

          // Check for saved progress
          const storageKey = `madflix_progress_${url}`
          const savedProgress = localStorage.getItem(storageKey)
          console.log("Saved progress:", savedProgress) // Debug log
          
          if (savedProgress) {
            const savedTime = Number.parseFloat(savedProgress)
            console.log("Parsed saved time:", savedTime) // Debug log
            if (savedTime > 10) {
              setSavedTime(savedTime)
              setShowResumeToast(true)
              console.log("Showing resume toast") // Debug log
            }
          }

          const fetchedCaptions = await fetchSubtitles(id, season, episode)
          if (fetchedCaptions.length > 0) {
            setCurrentCaptions(fetchedCaptions)
          }
        } else {
          console.error("No valid stream URL found in index")
          tryNextServer()
        }
      } else {
        console.error("No streams found in data")
        tryNextServer()
      }
    } catch (error) {
      console.error("Error fetching stream URL:", error)
      tryNextServer()
    }
  }

  // Add useEffect to monitor resume toast state
  useEffect(() => {
    console.log("Resume toast state:", showResumeToast)
    console.log("Saved time:", savedTime)
  }, [showResumeToast, savedTime])

  const handleTimeUpdate = (position) => {
    if (position > 10 && currentUrl) {
      const storageKey = `madflix_progress_${currentUrl}`
      localStorage.setItem(storageKey, position.toString())
      console.log("Saving progress:", position) // Debug log
    }
  }

  
  const tryNextServer = () => {
    const currentIndex = servers.current.findIndex((s) => currentUrl === (season ? s.tv : s.movie))
    let nextIndex = (currentIndex + 1) % servers.current.length
    let attempts = 0

    // Find the next unattempted server
    while (attemptedServers.current.has(nextIndex)) {
      nextIndex = (nextIndex + 1) % servers.current.length
      attempts++
      if (attempts >= servers.current.length) {
        setisNotFound(true)
        setIsLoading(false)
        console.error("No stream found: all servers have been attempted")
        return
      }
    }
    switchServer(nextIndex)
  }



  const handleStreamChange = (index) => {
    const selected = currentStreams[index]
    setCurrentStreamUrl(selected.file || selected.url || null)
  }


  const closeNotFound = () => {
    setisNotFound(false)
  }


  const handleAdsToggle = () => {
    if (adstype === "adsoff") {
      setisAdsEnabled(false)
    } else {
      setisAdsEnabled(true)
    }
  }


  const handleResumeYes = () => {
    if (currentUrl && playerRef.current) {
      const storageKey = `madflix_progress_${currentUrl}`
      const saved = localStorage.getItem(storageKey)
      if (saved) {
        // Add a small delay to ensure player is ready
        setTimeout(() => {
          playerRef.current.seek(Number(saved))
        }, 1000)
      }
    }
    setShowResumeToast(false)
  }


  const handleResumeNo = () => {
    const storageKey = `madflix_progress_${currentUrl}`
    localStorage.removeItem(storageKey)
    setShowResumeToast(false)
  }

  
  const handleComplete = () => {
    if (currentUrl) {
      const storageKey = `madflix_progress_${currentUrl}`
      localStorage.removeItem(storageKey)
    }
  }

  
  const handleError = () => {
    tryNextServer()
  }


  return (
    <>
      <div className="relative w-full h-screen bg-black">
        {isLoading && <Loading poster={poster} color={externalSettings?.playerColor} />}
        {isNotFound && <NotFound onClose={closeNotFound} />}
        {isblockdirect && <NotFound onClose={closeNotFound} />}
        {showPlayer && (
          <div className="absolute inset-0 overflow-hidden">
            <VidstackPlayer
              logo={externalSettings?.playerLogoLink || logo}
              poster={poster || ""}
              color={externalSettings?.playerColor || color || "white"}
              streamUrl={currentStreamUrl}
              captions={currentCaptions}
              defaultSubtitlesLanguage={externalSettings?.defaultSubtitlesLanguage}
              onTimeUpdate={handleTimeUpdate}
              onComplete={handleComplete}
              onError={handleError}
              onServerChange={() => {
                setShowServerPopup(true)
              }}
              ref={playerRef}
            />
            <StreamOptions streams={currentStreams} onStreamChange={handleStreamChange} />
            {showResumeToast && <ResumeToast time={savedTime} onYes={handleResumeYes} onNo={handleResumeNo} />}
            {showServerPopup && (
              <ServerPopup
                servers={servers.current}
                selected={selectedServer}
                onServerSelect={(index) => {
                  setSelectedServer(index)
                  switchServer(index)
                  setShowServerPopup(false)
                }}
                onClose={() => setShowServerPopup(false)}
              />
            )}
          </div>
        )}

        
        {adstype !== "noads" && (
          <>
            {adstype === "popunder" && (
              <Script
                src="//tuckbrows.com/25/27/e5/2527e50c78c665244781c6f5a6c247e3.js"
                strategy="lazyOnload"
              />
            )}

            {(adstype === "popup" || !adstype || adstype !== "popunder") && (
              <Script
                src="//tuckbrows.com/69/6e/02/696e0265b08521f28685df214f0520a0.js"
                strategy="lazyOnload"
              />
            )}
          </>
        )}





      </div>
    </>
  )
}