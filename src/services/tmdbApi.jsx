const API_KEY = "0a4ac416a1229348c0a6d968b10a42da"
const BASE_URL = "https://api.themoviedb.org/3"

// Fetch trending media (movies and TV shows)
export const fetchTrending = async (page = 1) => {
  try {
    const response = await fetch(`${BASE_URL}/trending/all/week?api_key=${API_KEY}&page=${page}`)

    if (!response.ok) {
      throw new Error("Network response was not ok")
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching trending media:", error)
    throw error
  }
}

// Fetch media by category (movies or tv)
export const fetchByCategory = async (category, page = 1) => {
  try {
    const response = await fetch(`${BASE_URL}/${category}/popular?api_key=${API_KEY}&page=${page}`)

    if (!response.ok) {
      throw new Error("Network response was not ok")
    }

    return await response.json()
  } catch (error) {
    console.error(`Error fetching ${category}:`, error)
    throw error
  }
}

// Fetch media details
export const fetchMediaDetails = async (mediaType, mediaId) => {
  try {
    const response = await fetch(
      `${BASE_URL}/${mediaType}/${mediaId}?api_key=${API_KEY}&append_to_response=videos,similar`,
    )

    if (!response.ok) {
      throw new Error("Network response was not ok")
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching media details:", error)
    throw error
  }
}

// Search media
export const searchMedia = async (query, page = 1) => {
  try {
    const response = await fetch(
      `${BASE_URL}/search/multi?api_key=${API_KEY}&query=${encodeURIComponent(query)}&page=${page}`,
    )

    if (!response.ok) {
      throw new Error("Network response was not ok")
    }

    return await response.json()
  } catch (error) {
    console.error("Error searching media:", error)
    throw error
  }
}
