"use client"

import { useState, useEffect, useContext, useCallback, useRef } from "react"
import { fetchTrending, fetchByCategory } from "../services/tmdbApi"
import { MediaContext } from "../context/MediaContext"
import MediaGrid from "../components/MediaGrid"
import HeroBanner from "../components/HeroBanner"
import "./BrowsePage.css"

const BrowsePage = () => {
  const [mediaItems, setMediaItems] = useState([])
  const [category, setCategory] = useState("trending")
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const { setLoading, setError, loading, error } = useContext(MediaContext)
  const observer = useRef()

  // Function to fetch media based on selected category
  const fetchMedia = useCallback(
    async (reset = false) => {
      const currentPage = reset ? 1 : page

      try {
        setLoading(true)
        let data

        if (category === "trending") {
          data = await fetchTrending(currentPage)
        } else {
          data = await fetchByCategory(category, currentPage)
        }

        if (data.results.length === 0) {
          setHasMore(false)
        } else {
          if (reset) {
            setMediaItems(data.results)
          } else {
            setMediaItems((prev) => [...prev, ...data.results])
          }
          setPage(currentPage + 1)
        }

        setLoading(false)
      } catch (err) {
        setError("Failed to fetch media. Please try again later.")
        setLoading(false)
      }
    },
    [category, page, setLoading, setError],
  )

  // Initial fetch
  useEffect(() => {
    setPage(1)
    setHasMore(true)
    fetchMedia(true)
  }, [category])

  // Setup for infinite scroll
  const lastMediaElementRef = useCallback(
    (node) => {
      if (loading) return

      if (observer.current) observer.current.disconnect()

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          fetchMedia()
        }
      })

      if (node) observer.current.observe(node)
    },
    [loading, hasMore, fetchMedia],
  )

  // Handle category change
  const handleCategoryChange = (newCategory) => {
    setCategory(newCategory)
  }

  return (
    <div className="browse-page">
      <HeroBanner />

      <div className="category-tabs">
        <button
          className={`category-tab ${category === "trending" ? "active" : ""}`}
          onClick={() => handleCategoryChange("trending")}
        >
          Trending
        </button>
        <button
          className={`category-tab ${category === "movie" ? "active" : ""}`}
          onClick={() => handleCategoryChange("movie")}
        >
          Movies
        </button>
        <button
          className={`category-tab ${category === "tv" ? "active" : ""}`}
          onClick={() => handleCategoryChange("tv")}
        >
          TV Shows
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <MediaGrid items={mediaItems} />

      {loading && <div className="loading-spinner">Loading...</div>}

      {/* Invisible element for intersection observer */}
      {hasMore && !loading && <div ref={lastMediaElementRef} className="load-trigger"></div>}

      {!hasMore && !loading && mediaItems.length > 0 && <div className="end-message">You've reached the end!</div>}
    </div>
  )
}

export default BrowsePage
