"use client"

import { useEffect, useState, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, ArrowUp, Check, ChevronDown, Copy, Diamond, DollarSign, Download, FileText, Globe, Layers, MessageSquare, Play, Search, Shield, Subtitles, GlobeIcon as World } from 'lucide-react'

export default function Home() {
  // State for mobile menu
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [showBackToTop, setShowBackToTop] = useState(false)

  // State for embed demo
  const [selectedType, setSelectedType] = useState("movie")
  const [tmdbId, setTmdbId] = useState("1102493")
  const [season, setSeason] = useState("1")
  const [episode, setEpisode] = useState("1")
  const [embedUrl, setEmbedUrl] = useState("https://uembed.site/?id=1399&season=1&episode=1")

  // Refs for copy buttons
  const copyBtnRefs = useRef<{ [key: string]: { element: HTMLButtonElement | null; text: string } }>({
    movieEmbed: { element: null, text: "https://uembed.site/?id={tmdb_id}" },
    tvEmbed: {
      element: null,
      text: "https://uembed.site/?id={tmdb_id}&season={season_number}&episode={episode_number}",
    },
    apiList: { element: null, text: "https://madplay.site/api/backendfetch?requestID={type}&language=en-US&page=1" },
  })

  // Update embed URL when parameters change
  useEffect(() => {
    let url = `https://uembed.site/?id=${tmdbId}`

    if (selectedType === "tv") {
      url += `/${season}/${episode}`
    }

    setEmbedUrl(url)
  }, [tmdbId, season, episode, selectedType])

  // Scroll event handlers
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop

      setIsScrolled(scrollTop > 50)
      setShowBackToTop(scrollTop > 300)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    // Only prevent scrolling when menu is open
    if (!isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }

  // Scroll to top
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  // Copy to clipboard
  const copyToClipboard = (text: string, buttonRef: HTMLButtonElement | null) => {
    if (!buttonRef) return

    navigator.clipboard
      .writeText(text)
      .then(() => {
        // Change icon to checkmark
        buttonRef.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>`

        // Reset after 2 seconds
        setTimeout(() => {
          buttonRef.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>`
        }, 2000)
      })
      .catch((err) => {
        console.error("Could not copy text: ", err)
      })
  }

  return (
    <div className="madplay-container">
      {/* Header */}
      <header className={`header ${isScrolled ? "scrolled" : ""}`}>
        <div className="container">
          <div className="header-content">
            <Link href="#" className="logo">
              <span className="logo-text">
                U<span className="accent">EMBED</span>
              </span>
            </Link>

            <button
              className={`mobile-menu-toggle ${isMenuOpen ? "active" : ""}`}
              aria-label="Toggle menu"
              onClick={toggleMobileMenu}
            >
              <span></span>
              <span></span>
              <span></span>
            </button>

            <nav className={`nav ${isMenuOpen ? "active" : ""}`}>
              <ul className="nav-list">
                <li>
                  <Link href="#home" className="nav-link active" onClick={() => isMenuOpen && toggleMobileMenu()}>
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="#features" className="nav-link" onClick={() => isMenuOpen && toggleMobileMenu()}>
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="/login" className="nav-link" onClick={() => isMenuOpen && toggleMobileMenu()}>
                    Pricing
                  </Link>
                </li>
                <li className="dropdown">
                  {/* <Link href="#" className="nav-link dropdown-toggle">
                    Embed Themes
                    <ChevronDown className="w-4 h-4" />
                  </Link> */}
                  <ul className="dropdown-menu">
                    <li>
                      <Link href="#" onClick={() => isMenuOpen && toggleMobileMenu()}>Dooplay</Link>
                    </li>
                    <li>
                      <Link href="#" onClick={() => isMenuOpen && toggleMobileMenu()}>Watchug</Link>
                    </li>
                    <li>
                      <Link href="#" onClick={() => isMenuOpen && toggleMobileMenu()}>Fmovies</Link>
                    </li>
                    <li>
                      <Link href="#" onClick={() => isMenuOpen && toggleMobileMenu()}>ZetaFlix</Link>
                    </li>
                    <li>
                      <Link href="#" onClick={() => isMenuOpen && toggleMobileMenu()}>PsyPlay</Link>
                    </li>
                    <li>
                      <Link href="#" onClick={() => isMenuOpen && toggleMobileMenu()}>Anime</Link>
                    </li>
                    <li>
                      <Link href="#" onClick={() => isMenuOpen && toggleMobileMenu()}>Request Theme</Link>
                    </li>
                  </ul>
                </li>
                <li>
                  <Link href="https://telegram.me/uembedsite" className="nav-link" onClick={() => isMenuOpen && toggleMobileMenu()}>
                    Support
                  </Link>
                </li>
              </ul>

              <div className="nav-actions">
                <Link href="https://telegram.me/uembedsite" className="telegram-link" onClick={() => isMenuOpen && toggleMobileMenu()}>
                  Telegram
                </Link>
                <Link href="/login" className="btn btn-primary neon-glow" onClick={() => isMenuOpen && toggleMobileMenu()}>
                  Login
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </nav>
          </div>
        </div>
      </header>

      <main className="main-content">
        {/* Hero Section */}
        <section id="home" className="hero">
          <div className="container">
            <div className="hero-content">
              <span className="badge">
                <Diamond className="w-4 h-4" />
                Next generation Video Streaming API for Your Web & App!
              </span>

              <h1>World's Biggest collection of Movies & Series with minimal ads</h1>

              <p>Now Available in Multiple Languages Like Hindi, English, Tamil, Telugu and so on.</p>

              <Link href="#api-docs" className="btn btn-hero neon-glow">
                Let's Start Embedding in your website!
              </Link>
            </div>

            <div className="hero-image">
              <Image
                src="/assets/logo.png"
                alt="Streaming API illustration"
                width={400}
                height={400}
              />
            </div>
          </div>
        </section>

        {/* Embed Demo Section */}
        <section id="embed-demo" className="embed-demo">
          <div className="container">
            <div className="embed-controls">
              <div className="type-toggle">
                <button
                  id="movie-btn"
                  className={`toggle-btn ${selectedType === "movie" ? "active" : ""}`}
                  onClick={() => {
                    setSelectedType("movie")
                    setTmdbId("1102493")
                  }}
                >
                  Movie
                </button>
                <button
                  id="tv-btn"
                  className={`toggle-btn ${selectedType === "tv" ? "active" : ""}`}
                  onClick={() => {
                    setSelectedType("tv")
                    setTmdbId("60574")
                  }}
                >
                  TV
                </button>
              </div>

              <div className="embed-url-builder">
                <span className="url-prefix">https://uembed.site/?id=</span>
                <input type="text" value={tmdbId} onChange={(e) => setTmdbId(e.target.value)} className="id-input" />

                {selectedType === "tv" && (
                  <>
                    <span id="slash-season" className="separator">
                      /
                    </span>
                    <input
                      type="number"
                      value={season}
                      onChange={(e) => setSeason(e.target.value)}
                      className="season-input"
                    />

                    <span id="slash-episode" className="separator">
                      /
                    </span>
                    <input
                      type="number"
                      value={episode}
                      onChange={(e) => setEpisode(e.target.value)}
                      className="episode-input"
                    />
                  </>
                )}

                <button id="play-btn" className="play-btn">
                  <Play className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="embed-preview">
              <iframe id="embed-frame" src={embedUrl || ""}  frameBorder="0" allowFullScreen></iframe>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="features">
          <div className="container">
            <div className="section-header">
              <span className="badge">
                <Diamond className="w-4 h-4" />
                Some of Main Features of Our API
              </span>
              <h2>Key Features of Our Tool</h2>
              <p>
                Our API provides Movies, Series, WebShows, Cartoons, Anime, Kdrama, Hentai & More Content in These
                Languages With SUB!
                <br /> English | Korean | Japanese | French | Spanish | Hindi | Bengali | Telugu | Marathi | Tamil |
                Urdu | Gujarati | Kannada | Malayalam!
              </p>
            </div>

            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon">
                  <FileText className="w-6 h-6" />
                </div>
                <h3>Fast & Responsive</h3>
                <p>Our Embed is Fast, Responsive, Secure & Easy To USE!</p>
              </div>

              <div className="feature-card">
                <div className="feature-icon">
                  <Globe className="w-6 h-6" />
                </div>
                <h3>Daily Updates</h3>
                <p>Our API Provides Daily Updates & Smooth Experience!</p>
              </div>

              <div className="feature-card">
                <div className="feature-icon">
                  <Search className="w-6 h-6" />
                </div>
                <h3>TMDB & IMDB Support</h3>
                <p>Our API Supports TMDB and IMDB id to fetch data based on it.</p>
              </div>

              <div className="feature-card">
                <div className="feature-icon">
                  <Layers className="w-6 h-6" />
                </div>
                <h3>Multi Dubbed!</h3>
                <p>Provides Multi Language Choice to watch in your preferred language</p>
              </div>

              <div className="feature-card">
                <div className="feature-icon">
                  <Subtitles className="w-6 h-6" />
                </div>
                <h3>Subtitles</h3>
                <p>Our API Provides Subtitles in 50+ Languages!</p>
              </div>

              <div className="feature-card">
                <div className="feature-icon">
                  <Download className="w-6 h-6" />
                </div>
                <h3>Download Option</h3>
                <p>This feature will Available Soon!</p>
              </div>
            </div>

            {/* <div className="feature-highlight">
              <div className="highlight-content">
                <span className="badge">
                  <Check className="w-4 h-4" />
                  24/7 Online
                </span>
                <h3>Not Only an API</h3>
                <p>
                  If you can't find any movie, series, or other content you're looking for, feel free to request it! We
                  will add your requested content within just a few hours.
                </p>
                <Link href="#" className="btn btn-secondary neon-glow">
                  Telegram
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="highlight-image">
                <Image src="../assets/logo.png" width={400} height={400} alt="API Support" />
              </div>
            </div> */}

            <div className="feature-cards">
              <div className="feature-card-alt">
                <div className="feature-icon">
                  <Check className="w-6 h-6" />
                </div>
                <h3>Auto Updates</h3>
                <p>Our Embed Target Non-Playable Content After Some Requests Server Add Content Automatic.</p>
              </div>

              <div className="feature-card-alt">
                <div className="feature-icon">
                  <Shield className="w-6 h-6" />
                </div>
                <h3>Trusted & Secured</h3>
                <p>Get Trusted & Secured Embed.</p>
              </div>
            </div>
          </div>
        </section>

        {/* API Documentation Section */}
        <section id="api-docs" className="api-docs">
          <div className="container">
            <div className="section-header">
              <h2>API Documentation</h2>
              <p>
                Explore the StreamFusion API to access detailed information on methods, request formats, and parameters.
              </p>
            </div>

            <div className="api-sections">
              <div className="api-section">
                <h3>1. Movie Embed URL</h3>
                <p>
                  Use <strong>TMDB or IMDB ID</strong> to generate the movie embed URL.
                </p>
                <div className="endpoint">
                  <span className="endpoint-label">Endpoint</span>
                  <div className="endpoint-box">
                    <code>https://uembed.site/?id={"{tmdb_id}"}</code>
                    <button
                      className="copy-btn"
                      ref={(el) => (copyBtnRefs.current.movieEmbed.element = el)}
                      onClick={() =>
                        copyToClipboard(copyBtnRefs.current.movieEmbed.text, copyBtnRefs.current.movieEmbed.element)
                      }
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="endpoint-box">
                    <code>https://uembed.site/?id={"{imdb_id}"}</code>
                    <button
                      className="copy-btn"
                      ref={(el) => (copyBtnRefs.current.movieEmbed.element = el)}
                      onClick={() =>
                        copyToClipboard(copyBtnRefs.current.movieEmbed.text, copyBtnRefs.current.movieEmbed.element)
                      }
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>

                </div>
              </div>

              <div className="api-section">
                <h3>2. TV Show Embed URL</h3>
                <p>
                  Use <strong>TMDB or IMDB ID</strong> along with season and episode numbers for the TV show.
                </p>
                <div className="endpoint">
                  <span className="endpoint-label">Endpoint</span>
                  <div className="endpoint-box">
                    <code>
                      https://uembed.site/?id={"{tmdb_id}"}&season={"{season_number}"}&episode=
                      {"{episode_number}"}
                    </code>
                    <button
                      className="copy-btn"
                      ref={(el) => (copyBtnRefs.current.tvEmbed.element = el)}
                      onClick={() =>
                        copyToClipboard(copyBtnRefs.current.tvEmbed.text, copyBtnRefs.current.tvEmbed.element)
                      }
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="endpoint-box">
                    <code>
                      https://uembed.site/?id={"{imdb_id}"}&season={"{season_number}"}&episode=
                      {"{episode_number}"}
                    </code>
                    <button
                      className="copy-btn"
                      ref={(el) => (copyBtnRefs.current.tvEmbed.element = el)}
                      onClick={() =>
                        copyToClipboard(copyBtnRefs.current.tvEmbed.text, copyBtnRefs.current.tvEmbed.element)
                      }
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="api-section">
                <h3>3. Change Language</h3>
                <p>
                  Set Language Default based on your preference. Use the <strong>lang</strong> parameter in the API request.
                </p>
                <div className="endpoint">
                  <span className="endpoint-label">Default English, lang=hi for Hindi</span>
                  <div className="endpoint-box">
                    <code>
                      https://uembed.site/?id=1399&season=1&episode=1&lang=hi
                    </code>
                    <button
                      className="copy-btn"
                      ref={(el) => (copyBtnRefs.current.tvEmbed.element = el)}
                      onClick={() =>
                        copyToClipboard(copyBtnRefs.current.tvEmbed.text, copyBtnRefs.current.tvEmbed.element)
                      }
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>         


              <div className="api-section">
                <h3>4. Change Server</h3>
                <p>
                  You can select default server by <strong>server</strong> parameter in the API request.
                </p>
                <div className="endpoint">
                  <span className="endpoint-label">Default server=0, change it to 1,2,3 as your preference</span>
                  <div className="endpoint-box">
                    <code>
                      https://uembed.site/?id=1399&season=1&episode=1&server=1
                    </code>
                    <button
                      className="copy-btn"
                      ref={(el) => (copyBtnRefs.current.tvEmbed.element = el)}
                      onClick={() =>
                        copyToClipboard(copyBtnRefs.current.tvEmbed.text, copyBtnRefs.current.tvEmbed.element)
                      }
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>    

              <div className="api-section">
                <h3>5. List All Movies & Series</h3>
                <p>
                  <strong>{"{type}"}</strong> is required - specify "tv" for TV shows or "movie" for movies.
                </p>
                <div className="endpoint">
                  <span className="endpoint-label">Endpoint</span>
                  <div className="endpoint-box">
                    <code>https://madplay.site/api/backendfetch?requestID={"{type}"}&language=en-US&page=1</code>
                    <button
                      className="copy-btn"
                      ref={(el) => (copyBtnRefs.current.apiList.element = el)}
                      onClick={() =>
                        copyToClipboard(copyBtnRefs.current.apiList.text, copyBtnRefs.current.apiList.element)
                      }
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <p className="examples">Examples:</p>
                <ul className="example-list">
                  <li>
                    <code>https://madplay.site/api/backendfetch?requestID=latestMovie&language=en-US&page=1</code>
                  </li>
                  <li>
                    <code>https://madplay.site/api/backendfetch?requestID=latestTv&language=en-US&page=1</code>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        {/* <section id="pricing" className="pricing">
          <div className="container">
            <div className="section-header">
              <span className="badge">
                <DollarSign className="w-4 h-4" />
                Get access
              </span>
              <h2>Our Pricing Plan</h2>
              <p>
                If You Want To Install Player Or Want To Build a Custom Player According To Your Web/App Or Want Direct
                API Access To Build Your Own Player With Your Own Logo Ads. Here Are Few Plans, If You Are Interested{" "}
                <br />
                <strong>Let Us Know!</strong>
              </p>
            </div>

            <div className="pricing-cards">
              <div className="pricing-card">
                <div className="pricing-header">
                  <h3>Starter</h3>
                  <div className="price">
                    <span className="amount">$12</span>
                    <span className="period">/month</span>
                  </div>
                </div>

                <ul className="pricing-features">
                  <li>
                    <Check className="w-4 h-4" />
                    10,000+ API Calls
                  </li>
                  <li>
                    <Check className="w-4 h-4" />
                    Get 12/7 Support
                  </li>
                  <li>
                    <Check className="w-4 h-4" />
                    Build Custom Player
                  </li>
                  <li>
                    <Check className="w-4 h-4" />
                    Ad's Player Installation
                  </li>
                  <li>
                    <Check className="w-4 h-4" />
                    Use Own Logo & Ad's
                  </li>
                  <li>
                    <Check className="w-4 h-4" />
                    Get 2 Domain's Support
                  </li>
                </ul>

                <Link href="#" className="btn btn-pricing neon-glow">
                  Get the plan
                </Link>
                <p className="pricing-note">No extra hidden charge</p>
              </div>

              <div className="pricing-card featured">
                <div className="pricing-header">
                  <h3>Medium</h3>
                  <div className="price">
                    <span className="amount">$35</span>
                    <span className="period">
                      /month
                      <br />
                      (Billed Trimester)
                    </span>
                  </div>
                </div>

                <ul className="pricing-features">
                  <li>
                    <Check className="w-4 h-4" />
                    30,000+ API Calls
                  </li>
                  <li>
                    <Check className="w-4 h-4" />
                    Get 24/7 Support
                  </li>
                  <li>
                    <Check className="w-4 h-4" />
                    Build Custom Theme Player
                  </li>
                  <li>
                    <Check className="w-4 h-4" />
                    Ad's Player Installation
                  </li>
                  <li>
                    <Check className="w-4 h-4" />
                    Use Own Logo, Color Theme & Ad's
                  </li>
                  <li>
                    <Check className="w-4 h-4" />5 Domain's Support
                  </li>
                </ul>

                <Link href="#" className="btn btn-pricing neon-glow">
                  Get the plan
                </Link>
                <p className="pricing-note">No extra hidden charge</p>
              </div>

              <div className="pricing-card">
                <div className="pricing-header">
                  <h3>Business</h3>
                  <div className="price">
                    <span className="amount">$70</span>
                    <span className="period">
                      /month
                      <br />
                      (Billed Semiannual)
                    </span>
                  </div>
                </div>

                <ul className="pricing-features">
                  <li>
                    <Check className="w-4 h-4" />
                    80,000+ API Calls
                  </li>
                  <li>
                    <Check className="w-4 h-4" />
                    Get 24/7 Support
                  </li>
                  <li>
                    <Check className="w-4 h-4" />
                    Build Custom Theme Player
                  </li>
                  <li>
                    <Check className="w-4 h-4" />
                    Ad's Player Installation
                  </li>
                  <li>
                    <Check className="w-4 h-4" />
                    Use Own Logo, Color Theme & Ad's
                  </li>
                  <li>
                    <Check className="w-4 h-4" />
                    10 Domain's Support
                  </li>
                </ul>

                <Link href="#" className="btn btn-pricing neon-glow">
                  Get the plan
                </Link>
                <p className="pricing-note">No extra hidden charge</p>
              </div>
            </div>
          </div>
        </section> */}


        {/* Support Section */}
        <section id="support" className="support">
          <div className="container">
            <div className="section-header">
              <span className="badge">
                <MessageSquare className="w-4 h-4" />
                Need Any Help?
              </span>
              <h2>Contact With Us</h2>
              <p>Message Us If You Need Any Help. We Will Answer You As Soon As Possible!</p>
            </div>


            <div className="contact-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">Name</label>
                  <input type="text" id="name" placeholder="Enter your Name" />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input type="email" id="email" placeholder="Enter your Email" />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea id="message" rows={6} placeholder="Type your message"></textarea>
              </div>

              <button type="submit" className="btn btn-hero neon-glow">
                Send Message
              </button>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <Link href="#" className="logo">
                <span className="logo-text">
                  U<span className="accent">EMBED</span>
                </span>
              </Link>
              <p>Let's Make Your Web Cool!! Use UEMBED Get More as You Want!</p>
              <p className="copyright">UEMBED 2025. NO rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>

      <button
        id="back-to-top"
        className={`back-to-top ${showBackToTop ? "visible" : ""}`}
        aria-label="Back to top"
        onClick={scrollToTop}
      >
        <ArrowUp className="w-5 h-5" />
      </button>
    </div>
  )
}
