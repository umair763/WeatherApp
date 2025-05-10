"use client";

import { createContext, useState, useEffect, useContext } from "react";
import { getCurrentLocationCoords } from "../lib/api";
import { useToast } from "../hooks/use-toast";
import axios from "axios";

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

const dummyData = {
	location: {
		name: "London",
		country: "United Kingdom",
		lat: 51.5074,
		lon: -0.1278,
		localtime: new Date().toISOString(),
	},
	current: {
		temp_c: 20,
		temp_f: 68,
		condition: {
			text: "Partly cloudy",
			icon: "//cdn.weatherapi.com/weather/64x64/day/116.png",
		},
		wind_kph: 15,
		wind_mph: 9.3,
		humidity: 65,
		feelslike_c: 21,
		feelslike_f: 69.8,
		uv: 4,
		precip_mm: 0,
		precip_in: 0,
		cloud: 40,
		gust_kph: 25,
		gust_mph: 15.5,
	},
	forecast: {
		forecastday: [
			{
				date: new Date().toISOString(),
				day: {
					maxtemp_c: 22,
					mintemp_c: 15,
					avgtemp_c: 18.5,
					maxwind_kph: 20,
					totalprecip_mm: 0.2,
					avghumidity: 70,
					condition: {
						text: "Partly cloudy",
						icon: "//cdn.weatherapi.com/weather/64x64/day/116.png",
					},
				},
				astro: {
					sunrise: "06:45 AM",
					sunset: "07:30 PM",
					moonrise: "08:15 PM",
					moonset: "05:30 AM",
					moon_phase: "Waxing Gibbous",
				},
				hour: Array(24)
					.fill()
					.map((_, i) => ({
						time: `${i.toString().padStart(2, "0")}:00`,
						temp_c: 18 + Math.sin((i / 24) * Math.PI) * 4,
						condition: {
							text: i > 6 && i < 18 ? "Partly cloudy" : "Clear",
							icon:
								i > 6 && i < 18
									? "//cdn.weatherapi.com/weather/64x64/day/116.png"
									: "//cdn.weatherapi.com/weather/64x64/night/113.png",
						},
						wind_kph: 15,
						humidity: 65,
						chance_of_rain: i > 12 && i < 16 ? 30 : 0,
					})),
			},
			// Add 6 more days with slight variations
			...Array(6)
				.fill()
				.map((_, dayIndex) => ({
					date: new Date(Date.now() + (dayIndex + 1) * 24 * 60 * 60 * 1000).toISOString(),
					day: {
						maxtemp_c: 22 + Math.random() * 3,
						mintemp_c: 15 + Math.random() * 2,
						avgtemp_c: 18.5 + Math.random() * 2,
						maxwind_kph: 20 + Math.random() * 5,
						totalprecip_mm: Math.random() * 2,
						avghumidity: 70 + Math.random() * 10,
						condition: {
							text: ["Partly cloudy", "Sunny", "Cloudy"][Math.floor(Math.random() * 3)],
							icon: "//cdn.weatherapi.com/weather/64x64/day/116.png",
						},
					},
					astro: {
						sunrise: "06:45 AM",
						sunset: "07:30 PM",
						moonrise: "08:15 PM",
						moonset: "05:30 AM",
						moon_phase: "Waxing Gibbous",
					},
					hour: Array(24)
						.fill()
						.map((_, i) => ({
							time: `${i.toString().padStart(2, "0")}:00`,
							temp_c: 18 + Math.sin((i / 24) * Math.PI) * 4 + Math.random() * 2,
							condition: {
								text: i > 6 && i < 18 ? "Partly cloudy" : "Clear",
								icon:
									i > 6 && i < 18
										? "//cdn.weatherapi.com/weather/64x64/day/116.png"
										: "//cdn.weatherapi.com/weather/64x64/night/113.png",
							},
							wind_kph: 15 + Math.random() * 5,
							humidity: 65 + Math.random() * 10,
							chance_of_rain: i > 12 && i < 16 ? 30 : 0,
						})),
				})),
		],
	},
};

export const WeatherContext = createContext({
	loading: false,
	error: null,
	weatherData: null,
	location: "New York",
	activeTab: "week",
	tempUnit: "C",
	windUnit: "km/h",
	darkMode: false,
	favorites: [],
	setLocation: () => {},
	searchLocation: async () => {},
	getCurrentLocation: async () => {},
	setActiveTab: () => {},
	toggleTempUnit: () => {},
	toggleWindUnit: () => {},
	toggleDarkMode: () => {},
	convertTemp: (temp) => temp,
	convertWind: (wind) => wind,
	addToFavorites: () => {},
	removeFromFavorites: () => {},
	isUsingDummyData: false,
	fetchWeatherData: async () => {},
});

export const WeatherProvider = ({ children }) => {
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [weatherData, setWeatherData] = useState(null);
	const [location, setLocation] = useState("New York");
	const [activeTab, setActiveTab] = useState("week");
	const [tempUnit, setTempUnit] = useState("C");
	const [windUnit, setWindUnit] = useState("km/h");
	const [darkMode, setDarkMode] = useState(false);
	const [favorites, setFavorites] = useState([]);
	const [isUsingDummyData, setIsUsingDummyData] = useState(false);
	const { toast } = useToast();

	// Load saved preferences from localStorage
	useEffect(() => {
		const savedTempUnit = localStorage.getItem("tempUnit");
		const savedWindUnit = localStorage.getItem("windUnit");
		const savedDarkMode = localStorage.getItem("darkMode");
		const savedFavorites = localStorage.getItem("favorites");

		if (savedTempUnit) setTempUnit(savedTempUnit);
		if (savedWindUnit) setWindUnit(savedWindUnit);
		if (savedDarkMode) setDarkMode(savedDarkMode === "true");
		if (savedFavorites) setFavorites(JSON.parse(savedFavorites));

		// Apply dark mode if enabled
		if (savedDarkMode === "true") {
			document.documentElement.classList.add("dark");
		}
	}, []);

	// Temperature conversion
	const convertTemp = (temp) => {
		if (tempUnit === "F") {
			return Math.round((temp * 9) / 5 + 32);
		}
		return Math.round(temp);
	};

	// Wind speed conversion
	const convertWind = (wind) => {
		if (windUnit === "mph") {
			return Math.round(wind * 0.621371);
		}
		return Math.round(wind);
	};

	// Toggle temperature unit
	const toggleTempUnit = () => {
		const newUnit = tempUnit === "C" ? "F" : "C";
		setTempUnit(newUnit);
		localStorage.setItem("tempUnit", newUnit);
	};

	// Toggle wind speed unit
	const toggleWindUnit = () => {
		const newUnit = windUnit === "km/h" ? "mph" : "km/h";
		setWindUnit(newUnit);
		localStorage.setItem("windUnit", newUnit);
	};

	// Toggle dark mode
	const toggleDarkMode = () => {
		const newMode = !darkMode;
		setDarkMode(newMode);
		localStorage.setItem("darkMode", String(newMode));

		if (newMode) {
			document.documentElement.classList.add("dark");
		} else {
			document.documentElement.classList.remove("dark");
		}
	};

	// Add location to favorites
	const addToFavorites = (locationData) => {
		if (!locationData) return;

		const newFavorite = {
			id: Date.now(),
			name: locationData.name || location,
			coords: `${locationData.lat},${locationData.lon}`,
			lastTemp: weatherData?.current?.values?.temperature || 0,
			lastUpdated: new Date().toISOString(),
		};

		const updatedFavorites = [...favorites, newFavorite];
		setFavorites(updatedFavorites);
		localStorage.setItem("favorites", JSON.stringify(updatedFavorites));

		toast({
			title: "Added to favorites",
			description: `${newFavorite.name} has been added to your favorites.`,
		});
	};

	// Remove location from favorites
	const removeFromFavorites = (id) => {
		const updatedFavorites = favorites.filter((fav) => fav.id !== id);
		setFavorites(updatedFavorites);
		localStorage.setItem("favorites", JSON.stringify(updatedFavorites));

		toast({
			title: "Removed from favorites",
			description: "Location has been removed from your favorites.",
		});
	};

	// Replace the fetchWeatherData function with an improved version
	const fetchWeatherData = async (city) => {
		setLoading(true);
		setError(null);
		setIsUsingDummyData(false);

		if (!API_KEY) {
			console.error("API key is missing");
			setError("API key is missing. Using dummy data instead.");
			setWeatherData(dummyData);
			setIsUsingDummyData(true);
			setLoading(false);
			return;
		}

		try {
			const response = await axios.get(
				`https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${city}&days=7&aqi=no`
			);
			setWeatherData(response.data);
			setIsUsingDummyData(false);
		} catch (err) {
			console.error("Error fetching weather data:", err);
			let errorMessage = "Failed to fetch weather data. Using dummy data instead.";

			if (err.response) {
				switch (err.response.status) {
					case 403:
						errorMessage = "API key is invalid or expired. Using dummy data instead.";
						break;
					case 404:
						errorMessage = "Location not found. Using dummy data instead.";
						break;
					case 429:
						errorMessage = "API rate limit exceeded. Using dummy data instead.";
						break;
					default:
						errorMessage = `API error (${err.response.status}). Using dummy data instead.`;
				}
			}

			setError(errorMessage);
			setWeatherData(dummyData);
			setIsUsingDummyData(true);

			// Show toast notification
			toast({
				title: "Weather Data Unavailable",
				description: errorMessage,
				variant: "destructive",
			});
		} finally {
			setLoading(false);
		}
	};

	// Add a helper function to map weather condition text to our code format
	const mapWeatherConditionToCode = (conditionText) => {
		const lowerText = conditionText?.toLowerCase() || "";

		if (lowerText.includes("sunny") || lowerText.includes("clear")) return 1000;
		if (lowerText.includes("partly cloudy")) return 1101;
		if (lowerText.includes("cloudy")) return 1001;
		if (lowerText.includes("overcast")) return 1102;
		if (lowerText.includes("mist") || lowerText.includes("fog")) return 2000;
		if (lowerText.includes("drizzle")) return 4000;
		if (lowerText.includes("rain")) return 4001;
		if (lowerText.includes("snow")) return 5000;
		if (lowerText.includes("sleet")) return 6000;
		if (lowerText.includes("thunder")) return 8000;

		// Default
		return 1000;
	};

	// Search for a location
	const searchLocation = async (searchQuery) => {
		if (!searchQuery.trim()) return;
		setLocation(searchQuery);
		await fetchWeatherData(searchQuery);
	};

	// Get current location
	const getCurrentLocation = async () => {
		try {
			setLoading(true);
			const position = await getCurrentLocationCoords();
			const { latitude, longitude } = position.coords;
			const locationQuery = `${latitude},${longitude}`;
			setLocation(`Current Location (${latitude.toFixed(2)}, ${longitude.toFixed(2)})`);
			await fetchWeatherData(locationQuery);
			toast({
				title: "Success",
				description: "Weather updated for your current location.",
			});
		} catch (err) {
			console.error("Error getting current location:", err);
			setError("Could not access your location. Please check your browser permissions.");
			setLoading(false);
			toast({
				title: "Error",
				description: "Could not access your location. Please check browser permissions.",
				variant: "destructive",
			});
		}
	};

	// Initial data fetch
	useEffect(() => {
		fetchWeatherData("London"); // Default city
	}, []);

	return (
		<WeatherContext.Provider
			value={{
				loading,
				error,
				weatherData,
				location,
				activeTab,
				tempUnit,
				windUnit,
				darkMode,
				favorites,
				setLocation,
				searchLocation,
				getCurrentLocation,
				setActiveTab,
				toggleTempUnit,
				toggleWindUnit,
				toggleDarkMode,
				convertTemp,
				convertWind,
				addToFavorites,
				removeFromFavorites,
				isUsingDummyData,
				fetchWeatherData,
			}}>
			{children}
		</WeatherContext.Provider>
	);
};

export const useWeather = () => useContext(WeatherContext);
