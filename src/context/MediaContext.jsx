"use client"

import { createContext, useState, useEffect, useCallback } from "react"

export const MediaContext = createContext()

export const MediaProvider = ({ children }) => {
  const [watchlist, setWatchlist] = useState([])
  const [watchHistory, setWatchHistory] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Load watchlist and history from localStorage on mount
  useEffect(() => {
    const savedWatchlist = localStorage.getItem("watchlist")
    const savedHistory = localStorage.getItem("watchHistory")

    if (savedWatchlist) setWatchlist(JSON.parse(savedWatchlist))
    if (savedHistory) setWatchHistory(JSON.parse(savedHistory))
  }, [])

  // Save to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("watchlist", JSON.stringify(watchlist))
  }, [watchlist])

  useEffect(() => {
    localStorage.setItem("watchHistory", JSON.stringify(watchHistory))
  }, [watchHistory])

  // Add to watchlist
  const addToWatchlist = useCallback((media) => {
    setWatchlist((prev) => {
      // Check if already in watchlist
      if (prev.some((item) => item.id === media.id)) {
        return prev
      }
      return [...prev, media]
    })
  }, [])

  // Remove from watchlist
  const removeFromWatchlist = useCallback((mediaId) => {
    setWatchlist((prev) => prev.filter((item) => item.id !== mediaId))
  }, [])

  // Add to watch history
  const addToHistory = useCallback((media) => {
    setWatchHistory((prev) => {
      // Remove if already exists (to move to top)
      const filtered = prev.filter((item) => item.id !== media.id)
      return [media, ...filtered].slice(0, 50) // Keep last 50 items
    })
  }, [])

  // Check if media is in watchlist
  const isInWatchlist = useCallback(
    (mediaId) => {
      return watchlist.some((item) => item.id === mediaId)
    },
    [watchlist],
  )

  return (
    <MediaContext.Provider
      value={{
        watchlist,
        watchHistory,
        loading,
        error,
        setLoading,
        setError,
        addToWatchlist,
        removeFromWatchlist,
        addToHistory,
        isInWatchlist,
      }}
    >
      {children}
    </MediaContext.Provider>
  )
}
