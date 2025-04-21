"use client"

import { useContext } from "react"
import { Link } from "react-router-dom"
import { MediaContext } from "../context/MediaContext"
import "./MediaGrid.css"

const MediaGrid = ({ items, onLoadMore }) => {
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useContext(MediaContext)

  const handleWatchlistToggle = (e, media) => {
    e.preventDefault() // Prevent navigation
    e.stopPropagation() // Stop event bubbling

    if (isInWatchlist(media.id)) {
      removeFromWatchlist(media.id)
    } else {
      addToWatchlist(media)
    }
  }

  return (
    <div className="media-grid">
      {items.map((item) => {
        const mediaType = item.media_type || "movie"
        const inWatchlist = isInWatchlist(item.id)

        return (
          <div key={item.id} className="media-card">
            <Link to={`/detail/${item.id}?type=${mediaType}`} className="media-link">
              <div className="media-poster">
                {item.poster_path ? (
                  <img src={`https://image.tmdb.org/t/p/w500${item.poster_path}`} alt={item.title || item.name} />
                ) : (
                  <div className="no-poster">No Image</div>
                )}
                <button
                  className={`watchlist-btn ${inWatchlist ? "in-watchlist" : ""}`}
                  onClick={(e) =>
                    handleWatchlistToggle(e, {
                      id: item.id,
                      title: item.title || item.name,
                      poster_path: item.poster_path,
                      media_type: mediaType,
                      overview: item.overview,
                    })
                  }
                >
                  {inWatchlist ? "✓" : "+"}
                </button>
              </div>
              <div className="media-info">
                <h3>{item.title || item.name}</h3>
                <div className="media-meta">
                  <span className="media-year">{(item.release_date || item.first_air_date || "").substring(0, 4)}</span>
                  <span className="media-rating">★ {item.vote_average ? item.vote_average.toFixed(1) : "N/A"}</span>
                </div>
              </div>
            </Link>
          </div>
        )
      })}
      {onLoadMore && (
        <div className="load-more-container">
          <button className="load-more-btn" onClick={onLoadMore}>
            Load More
          </button>
        </div>
      )}
    </div>
  )
}

export default MediaGrid
