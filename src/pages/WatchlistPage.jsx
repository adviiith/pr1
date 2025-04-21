"use client"

import { useContext } from "react"
import { MediaContext } from "../context/MediaContext"
import MediaGrid from "../components/MediaGrid"
import "./WatchlistPage.css"

const WatchlistPage = () => {
  const { watchlist } = useContext(MediaContext)

  return (
    <div className="watchlist-page">
      <h1 className="page-title">My Watchlist</h1>

      {watchlist.length === 0 ? (
        <div className="empty-watchlist">
          <p>Your watchlist is empty.</p>
          <p>Add movies and TV shows to keep track of what you want to watch.</p>
        </div>
      ) : (
        <MediaGrid items={watchlist} />
      )}
    </div>
  )
}

export default WatchlistPage
