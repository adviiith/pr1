"use client"

import { useState, useEffect, useContext } from "react"
import { useParams, useSearchParams } from "react-router-dom"
import { fetchMediaDetails } from "../services/tmdbApi"
import { MediaContext } from "../context/MediaContext"
import TrailerModal from "../components/TrailerModal"
import "./DetailPage.css"

const DetailPage = () => {
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const mediaType = searchParams.get("type") || "movie"

  const [media, setMedia] = useState(null)
  const [trailerKey, setTrailerKey] = useState("")
  const [isTrailerOpen, setIsTrailerOpen] = useState(false)
  const { setLoading, setError, loading, error, addToWatchlist, removeFromWatchlist, isInWatchlist, addToHistory } =
    useContext(MediaContext)

  useEffect(() => {
    const getMediaDetails = async () => {
      try {
        setLoading(true)
        const data = await fetchMediaDetails(mediaType, id)
        setMedia(data)

        // Find trailer
        if (data.videos && data.videos.results) {
          const trailer =
            data.videos.results.find((video) => video.type === "Trailer" && video.site === "YouTube") ||
            data.videos.results[0]

          if (trailer) {
            setTrailerKey(trailer.key)
          }
        }

        // Add to watch history
        if (data) {
          addToHistory({
            id: data.id,
            title: data.title || data.name,
            poster_path: data.poster_path,
            media_type: mediaType,
            overview: data.overview,
          })
        }

        setLoading(false)
      } catch (err) {
        setError("Failed to fetch media details. Please try again later.")
        setLoading(false)
      }
    }

    getMediaDetails()
  }, [id, mediaType, setLoading, setError, addToHistory])

  const handleWatchlistToggle = () => {
    if (!media) return

    const mediaData = {
      id: media.id,
      title: media.title || media.name,
      poster_path: media.poster_path,
      media_type: mediaType,
      overview: media.overview,
    }

    if (isInWatchlist(media.id)) {
      removeFromWatchlist(media.id)
    } else {
      addToWatchlist(mediaData)
    }
  }

  const openTrailer = () => {
    setIsTrailerOpen(true)
  }

  const closeTrailer = () => {
    setIsTrailerOpen(false)
  }

  if (loading) {
    return <div className="loading-container">Loading...</div>
  }

  if (error) {
    return <div className="error-container">{error}</div>
  }

  if (!media) {
    return <div className="not-found-container">Media not found</div>
  }

  const inWatchlist = isInWatchlist(media.id)
  const backdropUrl = media.backdrop_path ? `https://image.tmdb.org/t/p/original${media.backdrop_path}` : null
  const posterUrl = media.poster_path ? `https://image.tmdb.org/t/p/w500${media.poster_path}` : null

  return (
    <div className="detail-page">
      {backdropUrl && <div className="backdrop" style={{ backgroundImage: `url(${backdropUrl})` }} />}

      <div className="detail-content">
        <div className="media-details">
          {posterUrl && (
            <div className="poster-container">
              <img src={posterUrl || "/placeholder.svg"} alt={media.title || media.name} className="poster" />
            </div>
          )}

          <div className="info-container">
            <h1 className="media-title">{media.title || media.name}</h1>

            <div className="media-meta">
              <span className="year">{(media.release_date || media.first_air_date || "").substring(0, 4)}</span>

              {media.runtime && (
                <span className="runtime">
                  {Math.floor(media.runtime / 60)}h {media.runtime % 60}m
                </span>
              )}

              {media.number_of_seasons && (
                <span className="seasons">
                  {media.number_of_seasons} Season{media.number_of_seasons !== 1 ? "s" : ""}
                </span>
              )}

              <span className="rating">★ {media.vote_average ? media.vote_average.toFixed(1) : "N/A"}</span>
            </div>

            <div className="genres">
              {media.genres &&
                media.genres.map((genre) => (
                  <span key={genre.id} className="genre-tag">
                    {genre.name}
                  </span>
                ))}
            </div>

            <p className="overview">{media.overview}</p>

            <div className="action-buttons">
              <button className="play-btn" onClick={openTrailer}>
                ▶ Play Trailer
              </button>

              <button className="play-btn" onClick={handleWatchlistToggle}>
                {inWatchlist ? "✓ In Watchlist" : "+ Add to Watchlist"}
              </button>
            </div>
          </div>
        </div>

        {media.videos && media.videos.results && media.videos.results.length > 0 && (
          <div className="videos-section">
            <h2 className="section-title">Videos</h2>
            <div className="videos-container">
              {media.videos.results.slice(0, 3).map((video) => (
                <div key={video.id} className="video-item">
                  <iframe
                    src={`https://www.youtube.com/embed/${video.key}`}
                    title={video.name}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              ))}
            </div>
          </div>
        )}

        {media.similar && media.similar.results && media.similar.results.length > 0 && (
          <div className="similar-section">
            <h2 className="section-title">Similar {mediaType === "movie" ? "Movies" : "Shows"}</h2>
            <div className="similar-container">
              {media.similar.results.slice(0, 6).map((item) => (
                <div key={item.id} className="similar-item">
                  <a href={`/detail/${item.id}?type=${mediaType}`} className="similar-link">
                    {item.poster_path ? (
                      <img
                        src={`https://image.tmdb.org/t/p/w200${item.poster_path}`}
                        alt={item.title || item.name}
                        className="similar-poster"
                      />
                    ) : (
                      <div className="no-poster">No Image</div>
                    )}
                    <div className="similar-info">
                      <h3 className="similar-title">{item.title || item.name}</h3>
                      <div className="similar-meta">
                        <span className="similar-year">
                          {(item.release_date || item.first_air_date || "").substring(0, 4)}
                        </span>
                        <span className="similar-rating">
                          ★ {item.vote_average ? item.vote_average.toFixed(1) : "N/A"}
                        </span>
                      </div>
                    </div>
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <TrailerModal isOpen={isTrailerOpen} onClose={closeTrailer} videoKey={trailerKey} />
    </div>
  )
}

export default DetailPage
