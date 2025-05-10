"use client"

import { useContext, useState } from "react"
import { WeatherContext } from "../context/WeatherContext"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { MapPin, Trash2, RefreshCw, Plus } from "lucide-react"
import { formatDate } from "../lib/api"

export function Favorites() {
  const { favorites, removeFromFavorites, searchLocation, weatherData, addToFavorites, convertTemp, tempUnit } =
    useContext(WeatherContext)

  const [refreshing, setRefreshing] = useState({})

  const handleRefresh = async (coords) => {
    setRefreshing((prev) => ({ ...prev, [coords]: true }))
    await searchLocation(coords)
    setRefreshing((prev) => ({ ...prev, [coords]: false }))
  }

  const handleAddCurrent = () => {
    if (weatherData && weatherData.location) {
      addToFavorites(weatherData.location)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="bg-white/5 backdrop-blur-sm border-blue-900/20 text-white">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl">Favorite Locations</CardTitle>

          <button
            onClick={handleAddCurrent}
            disabled={!weatherData}
            className="flex items-center gap-1 px-3 py-1.5 rounded-md bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="h-4 w-4" />
            <span>Add Current</span>
          </button>
        </CardHeader>

        <CardContent>
          {favorites.length === 0 ? (
            <div className="text-center py-8 text-blue-300">
              <MapPin className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>You haven't added any favorite locations yet.</p>
              <p className="text-sm mt-2">Search for a location and add it to your favorites to see it here.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {favorites.map((favorite) => (
                <div key={favorite.id} className="p-4 rounded-lg bg-blue-900/20 hover:bg-blue-900/30 transition-colors">
                  <div className="flex justify-between items-start">
                    <div className="cursor-pointer" onClick={() => searchLocation(favorite.coords)}>
                      <h3 className="font-medium text-lg flex items-center gap-1">
                        <MapPin className="h-4 w-4 text-blue-400" />
                        {favorite.name}
                      </h3>

                      <div className="mt-2 flex items-center gap-4">
                        <div className="text-2xl font-bold">
                          {convertTemp(favorite.lastTemp)}°{tempUnit}
                        </div>
                        <div className="text-sm text-blue-300">Last updated: {formatDate(favorite.lastUpdated)}</div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleRefresh(favorite.coords)}
                        className="p-1.5 rounded-full hover:bg-blue-800/50"
                        disabled={refreshing[favorite.coords]}
                      >
                        <RefreshCw
                          className={`h-4 w-4 text-blue-300 ${refreshing[favorite.coords] ? "animate-spin" : ""}`}
                        />
                      </button>

                      <button
                        onClick={() => removeFromFavorites(favorite.id)}
                        className="p-1.5 rounded-full hover:bg-red-800/50"
                      >
                        <Trash2 className="h-4 w-4 text-red-400" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
