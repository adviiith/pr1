import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { MediaProvider } from "./context/MediaContext"
import Navbar from "./components/Navbar"
import BrowsePage from "./pages/BrowsePage"
import DetailPage from "./pages/DetailPage"
import WatchlistPage from "./pages/WatchlistPage"
import ProfilePage from "./pages/ProfilePage"
import SearchPage from "./pages/SearchPage"
import "./App.css"

function App() {
  return (
    <MediaProvider>
      <Router>
        <div className="app">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<BrowsePage />} />
              <Route path="/detail/:id" element={<DetailPage />} />
              <Route path="/watchlist" element={<WatchlistPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/search" element={<SearchPage />} />
            </Routes>
          </main>
        </div>
      </Router>
    </MediaProvider>
  )
}

export default App
