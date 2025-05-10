"use client"

import { useContext } from "react"
import { WeatherContext } from "../context/WeatherContext"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Sun, Moon, Thermometer, Wind } from "lucide-react"

export function Settings() {
  const { tempUnit, windUnit, darkMode, toggleTempUnit, toggleWindUnit, toggleDarkMode } = useContext(WeatherContext)

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="bg-white/5 backdrop-blur-sm border-blue-900/20 text-white">
        <CardHeader>
          <CardTitle className="text-2xl">Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-blue-300">Units</h3>

            <div className="flex items-center justify-between p-4 rounded-lg bg-blue-900/20">
              <div className="flex items-center gap-3">
                <Thermometer className="h-5 w-5 text-blue-400" />
                <div>
                  <p className="font-medium">Temperature</p>
                  <p className="text-sm text-blue-300">Choose your preferred temperature unit</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={toggleTempUnit}
                  className={`px-3 py-1 rounded-md ${
                    tempUnit === "C" ? "bg-blue-600 text-white" : "bg-blue-900/30 text-blue-300"
                  }`}
                >
                  °C
                </button>
                <button
                  onClick={toggleTempUnit}
                  className={`px-3 py-1 rounded-md ${
                    tempUnit === "F" ? "bg-blue-600 text-white" : "bg-blue-900/30 text-blue-300"
                  }`}
                >
                  °F
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg bg-blue-900/20">
              <div className="flex items-center gap-3">
                <Wind className="h-5 w-5 text-blue-400" />
                <div>
                  <p className="font-medium">Wind Speed</p>
                  <p className="text-sm text-blue-300">Choose your preferred wind speed unit</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={toggleWindUnit}
                  className={`px-3 py-1 rounded-md ${
                    windUnit === "km/h" ? "bg-blue-600 text-white" : "bg-blue-900/30 text-blue-300"
                  }`}
                >
                  km/h
                </button>
                <button
                  onClick={toggleWindUnit}
                  className={`px-3 py-1 rounded-md ${
                    windUnit === "mph" ? "bg-blue-600 text-white" : "bg-blue-900/30 text-blue-300"
                  }`}
                >
                  mph
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium text-blue-300">Appearance</h3>

            <div className="flex items-center justify-between p-4 rounded-lg bg-blue-900/20">
              <div className="flex items-center gap-3">
                {darkMode ? <Moon className="h-5 w-5 text-blue-400" /> : <Sun className="h-5 w-5 text-blue-400" />}
                <div>
                  <p className="font-medium">Theme</p>
                  <p className="text-sm text-blue-300">Choose between light and dark mode</p>
                </div>
              </div>

              <button
                onClick={toggleDarkMode}
                className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-900/50"
              >
                <span
                  className={`${
                    darkMode ? "translate-x-6" : "translate-x-1"
                  } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                />
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
