"use client"

import { useState, useEffect, useContext } from "react"
import { useNavigate } from "react-router-dom"
import { fetchTrending } from "../services/tmdbApi"
import { MediaContext } from "../context/MediaContext"
import "./HeroBanner.css"

const HeroBanner = () => {
  const [featuredMovies, setFeaturedMovies] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useContext(MediaContext)
  const navigate = useNavigate()

  // Fetch trending movies for the banner
  useEffect(() => {
    const fetchFeaturedMovies = async () => {
      try {
        setIsLoading(true)
        const data = await fetchTrending(1)
        // Filter to get only items with backdrop images and good data
        const filteredResults = data.results
          .filter((item) => item.backdrop_path && (item.title || item.name))
          .slice(0, 5) // Limit to 5 items
        setFeaturedMovies(filteredResults)
        setIsLoading(false)
      } catch (error) {
        console.error("Error fetching featured movies:", error)
        setIsLoading(false)
      }
    }

    fetchFeaturedMovies()
  }, [])

  // Auto-rotate featured movies
  useEffect(() => {
    if (featuredMovies.length === 0) return

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % featuredMovies.length)
    }, 8000) // Change every 8 seconds

    return () => clearInterval(interval)
  }, [featuredMovies])

  const handleWatchlistToggle = (movie) => {
    const mediaType = movie.media_type || "movie"
    const mediaData = {
      id: movie.id,
      title: movie.title || movie.name,
      poster_path: movie.poster_path,
      backdrop_path: movie.backdrop_path,
      media_type: mediaType,
      overview: movie.overview,
    }

    if (isInWatchlist(movie.id)) {
      removeFromWatchlist(movie.id)
    } else {
      addToWatchlist(mediaData)
    }
  }

  const handlePlayTrailer = (movie) => {
    navigate(`/detail/${movie.id}?type=${movie.media_type || "movie"}`)
  }

  const handleMoreInfo = (movie) => {
    navigate(`/detail/${movie.id}?type=${movie.media_type || "movie"}`)
  }

  if (isLoading || featuredMovies.length === 0) {
    return <div className="hero-banner-skeleton"></div>
  }

  const currentMovie = featuredMovies[currentIndex]
  const backdropUrl = `https://image.tmdb.org/t/p/original${currentMovie.backdrop_path}`
  const inWatchlist = isInWatchlist(currentMovie.id)

  return (
    <div className="hero-banner" style={{ backgroundImage: `url(${backdropUrl})` }}>
      <div className="hero-overlay">
        <div className="hero-content">
          <div className="hero-info">
            <h1 className="hero-title">{currentMovie.title || currentMovie.name}</h1>

            <div className="hero-meta">
              <span className="hero-year">
                {(currentMovie.release_date || currentMovie.first_air_date || "").substring(0, 4)}
              </span>
              <span className="hero-rating">★ {currentMovie.vote_average.toFixed(1)}</span>
              {currentMovie.media_type && (
                <span className="hero-type">{currentMovie.media_type === "movie" ? "Movie" : "TV Show"}</span>
              )}
            </div>

            <p className="hero-overview">{currentMovie.overview}</p>

            <div className="hero-actions">
              <button className="hero-play-btn" onClick={() => handlePlayTrailer(currentMovie)}>
                ▶ Play Trailer
              </button>
              <button className="hero-info-btn" onClick={() => handleMoreInfo(currentMovie)}>
                ℹ More Info
              </button>
              <button
                className={`hero-watchlist-btn ${inWatchlist ? "in-watchlist" : ""}`}
                onClick={() => handleWatchlistToggle(currentMovie)}
              >
                {inWatchlist ? "✓ In Watchlist" : "+ Add to Watchlist"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="hero-indicators">
        {featuredMovies.map((_, index) => (
          <button
            key={index}
            className={`hero-indicator ${index === currentIndex ? "active" : ""}`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </div>
  )
}

export default HeroBanner
