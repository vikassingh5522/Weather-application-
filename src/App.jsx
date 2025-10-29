import React, { useState } from 'react'
import WeatherCard from './components/WeatherCard'

const GEO_API = 'https://geocoding-api.open-meteo.com/v1/search'
const FORECAST_API = 'https://api.open-meteo.com/v1/forecast'

const App = () => {
  const [city, setCity] = useState('')
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Fetch coordinates from city name
  const getCoordinates = async (cityName) => {
    const res = await fetch(`${GEO_API}?name=${encodeURIComponent(cityName)}&count=1`)
    if (!res.ok) throw new Error('Geocoding request failed')
    const data = await res.json()
    if (data.results && data.results.length > 0) {
      const { latitude, longitude, name, country } = data.results[0]
      return { latitude, longitude, name, country }
    }
    throw new Error('City not found')
  }

  // Fetch weather data
  const getWeather = async () => {
    try {
      setError('')
      setWeather(null)

      if (!city.trim()) {
        setError('Please enter a city name')
        return
      }

      setLoading(true)

      const { latitude, longitude, name, country } = await getCoordinates(city.trim())

      // Request current weather + hourly humidity
      const params = new URLSearchParams({
        latitude: String(latitude),
        longitude: String(longitude),
        current_weather: 'true',
        hourly: 'relativehumidity_2m',
        timezone: 'auto',
      })

      const res = await fetch(`${FORECAST_API}?${params.toString()}`)
      if (!res.ok) throw new Error('Weather request failed')
      const data = await res.json()

      const current = data.current_weather // temperature, windspeed, weathercode, time

      // Match humidity for the current time
      let humidity = null
      if (data.hourly && data.hourly.time && data.hourly.relativehumidity_2m) {
        const idx = data.hourly.time.indexOf(current.time)
        if (idx !== -1) humidity = data.hourly.relativehumidity_2m[idx]
      }

      setWeather({
        temperature: current.temperature,
        windspeed: current.windspeed,
        weathercode: current.weathercode,
        time: current.time,
        humidity: humidity ?? 'N/A',
      })

      // Use canonical city name
      setCity(`${name}${country ? ', ' + country : ''}`)
    } catch (err) {
      console.error(err)
      setError(err.message || 'Unable to fetch weather data')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-start p-6">
      <h1 className="text-4xl font-bold mb-6 text-blue-800 drop-shadow-lg">🌤️ Weather Now</h1>

      <div className="flex flex-col sm:flex-row items-center gap-3 mb-6">
        <input
          type="text"
          placeholder="Enter city (e.g. London)"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none w-64"
        />
        <button
          onClick={getWeather}
          disabled={loading}
          className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-60"
        >
          {loading ? 'Loading...' : 'Get Weather'}
        </button>
      </div>

      {error && <p className="text-red-500 mb-3">{error}</p>}

      <WeatherCard weatherData={weather} city={city} />

      <p className="text-sm text-gray-500 mt-6 max-w-xl text-center">
        Uses Open-Meteo (no API key required). Deployable to CodeSandbox / StackBlitz / Vercel.
      </p>
    </div>
  )
}

export default App
