"use client"

import { useContext } from "react"
import { MediaContext } from "../context/MediaContext"
import MediaGrid from "../components/MediaGrid"
import "./ProfilePage.css"

const ProfilePage = () => {
  const { watchHistory } = useContext(MediaContext)

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div className="profile-avatar">
          <span>U</span>
        </div>
        <div className="profile-info">
          <h1 className="profile-name">User</h1>
          <p className="profile-stats">
            <span>{watchHistory.length} items in watch history</span>
          </p>
        </div>
      </div>

      <div className="profile-section">
        <h2 className="section-title">Watch History</h2>

        {watchHistory.length === 0 ? (
          <div className="empty-history">
            <p>Your watch history is empty.</p>
            <p>Movies and TV shows you view will appear here.</p>
          </div>
        ) : (
          <MediaGrid items={watchHistory} />
        )}
      </div>
    </div>
  )
}

export default ProfilePage
