// Tomorrow.io API key
const API_KEY = "iCyTzE4qS2PwgkdkbAIwp4Fn1bOwI26w";
const BASE_URL = "https://api.tomorrow.io/v4/weather";

/**
 * Fetch weather data from Tomorrow.io API by location name or coordinates
 * @param {string} location - Location name or "lat,lon" string
 * @returns {Promise<Object>} Weather data
 */
export const fetchWeatherByLocation = async (location) => {
  try {
    // Check if location is coordinates (lat,lon format)
    const isCoordinates = /^-?\d+(\.\d+)?,-?\d+(\.\d+)?$/.test(location)

    let queryParam
    if (isCoordinates) {
      queryParam = `location=${location}`
    } else {
      queryParam = `location=${encodeURIComponent(location)}`
    }

    // Fetch current weather data
    const currentResponse = await fetch(`${BASE_URL}/realtime?${queryParam}&apikey=${API_KEY}&units=metric`)

    if (!currentResponse.ok) {
      throw new Error(`API error: ${currentResponse.status}`)
    }

    const currentData = await currentResponse.json()

    // Fetch forecast data
    const forecastResponse = await fetch(`${BASE_URL}/forecast?${queryParam}&apikey=${API_KEY}&units=metric`)

    if (!forecastResponse.ok) {
      throw new Error(`API error: ${forecastResponse.status}`)
    }

    const forecastData = await forecastResponse.json()

    return {
      current: currentData.data,
      forecast: forecastData.timelines,
      location: currentData.location,
    }
  } catch (error) {
    console.error("Error fetching weather data:", error)
    throw error
  }
}

/**
 * Get current location coordinates using browser geolocation
 * @returns {Promise<GeolocationPosition>}
 */
export const getCurrentLocationCoords = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by your browser"))
      return
    }

    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    })
  })
}

/**
 * Search for locations with autocomplete
 * @param {string} query - Search query
 * @returns {Promise<Array>} Array of location suggestions
 */
export const searchLocationsAutocomplete = async (query) => {
  if (!query || query.length < 2) return []

  try {
    const response = await fetch(
      `https://api.tomorrow.io/v4/locations?query=${encodeURIComponent(query)}&apikey=${API_KEY}`,
    )

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    const data = await response.json()
    return data.locations || []
  } catch (error) {
    console.error("Error searching locations:", error)
    return []
  }
}

/**
 * Get weather icon based on weather code
 * @param {number} weatherCode - Weather code from Tomorrow.io API
 * @returns {string} Icon name
 */
export const getWeatherIcon = (weatherCode) => {
  const codeMap = {
    0: "sun", // Clear, Sunny
    1000: "sun", // Clear, Sunny
    1100: "sun-cloud", // Mostly Clear
    1101: "cloud-sun", // Partly Cloudy
    1102: "cloud", // Mostly Cloudy
    1001: "cloud", // Cloudy
    2000: "fog", // Fog
    2100: "fog", // Light Fog
    4000: "cloud-drizzle", // Drizzle
    4001: "cloud-rain", // Rain
    4200: "cloud-rain", // Light Rain
    4201: "cloud-rain-heavy", // Heavy Rain
    5000: "cloud-snow", // Snow
    5001: "cloud-snow", // Flurries
    5100: "cloud-snow", // Light Snow
    5101: "cloud-snow-heavy", // Heavy Snow
    6000: "cloud-sleet", // Freezing Drizzle
    6001: "cloud-sleet", // Freezing Rain
    6200: "cloud-sleet", // Light Freezing Rain
    6201: "cloud-sleet", // Heavy Freezing Rain
    7000: "cloud-hail", // Ice Pellets
    7101: "cloud-hail", // Heavy Ice Pellets
    7102: "cloud-hail", // Light Ice Pellets
    8000: "cloud-lightning", // Thunderstorm
  }

  return codeMap[weatherCode] || "cloud-question"
}

/**
 * Format date to display in UI
 * @param {string} dateString - ISO date string
 * @param {string} format - Format type ('day', 'hour', 'full')
 * @returns {string} Formatted date string
 */
export const formatDate = (dateString, format = "full") => {
  const date = new Date(dateString)

  if (format === "day") {
    return date.toLocaleDateString("en-US", { weekday: "short" })
  } else if (format === "hour") {
    return date.toLocaleTimeString("en-US", { hour: "numeric", hour12: true })
  } else if (format === "time") {
    return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })
  } else {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    })
  }
}
