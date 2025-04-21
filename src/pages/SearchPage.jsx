"use client"

import { useState, useEffect, useContext, useCallback, useRef } from "react"
import { useSearchParams } from "react-router-dom"
import { searchMedia } from "../services/tmdbApi"
import { MediaContext } from "../context/MediaContext"
import MediaGrid from "../components/MediaGrid"
import "./SearchPage.css"

const SearchPage = () => {
  const [searchParams] = useSearchParams()
  const query = searchParams.get("q") || ""

  const [results, setResults] = useState([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const { setLoading, setError, loading, error } = useContext(MediaContext)
  const observer = useRef()

  // Function to search media
  const performSearch = useCallback(
    async (reset = false) => {
      if (!query) return

      const currentPage = reset ? 1 : page

      try {
        setLoading(true)
        const data = await searchMedia(query, currentPage)

        if (data.results.length === 0) {
          setHasMore(false)
        } else {
          if (reset) {
            setResults(data.results)
          } else {
            setResults((prev) => [...prev, ...data.results])
          }
          setPage(currentPage + 1)
        }

        setLoading(false)
      } catch (err) {
        setError("Failed to search. Please try again later.")
        setLoading(false)
      }
    },
    [query, page, setLoading, setError],
  )

  // Initial search when query changes
  useEffect(() => {
    setPage(1)
    setHasMore(true)
    setResults([])
    if (query) {
      performSearch(true)
    }
  }, [query])

  // Setup for infinite scroll
  const lastResultElementRef = useCallback(
    (node) => {
      if (loading) return

      if (observer.current) observer.current.disconnect()

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          performSearch()
        }
      })

      if (node) observer.current.observe(node)
    },
    [loading, hasMore, performSearch],
  )

  return (
    <div className="search-page">
      <h1 className="search-title">{query ? `Search results for "${query}"` : "Search for movies and TV shows"}</h1>

      {error && <div className="error-message">{error}</div>}

      {results.length === 0 && !loading && query ? (
        <div className="no-results">
          <p>No results found for "{query}"</p>
          <p>Try different keywords or check your spelling</p>
        </div>
      ) : (
        <MediaGrid items={results} />
      )}

      {loading && <div className="loading-spinner">Loading...</div>}

      {/* Invisible element for intersection observer */}
      {hasMore && !loading && <div ref={lastResultElementRef} className="load-trigger"></div>}

      {!hasMore && !loading && results.length > 0 && (
        <div className="end-message">You've reached the end of search results</div>
      )}
    </div>
  )
}

export default SearchPage
