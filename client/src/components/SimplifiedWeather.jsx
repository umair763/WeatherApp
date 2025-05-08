import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";

export const SimplifiedWeather = () => {
	const [data, setData] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [tempUnit, setTempUnit] = useState("C");

	// Toggle temperature unit
	const toggleTempUnit = () => {
		setTempUnit(tempUnit === "C" ? "F" : "C");
	};

	// Convert temperature based on selected unit
	const convertTemp = (temp) => {
		if (tempUnit === "F") {
			return Math.round((temp * 9) / 5 + 32);
		}
		return Math.round(temp);
	};

	useEffect(() => {
		const fetchData = async () => {
			try {
				setLoading(true);
				const response = await axios.get("/api/weather", {
					params: {
						location: "London",
					},
				});
				console.log("Simplified weather response:", response.data);
				setData(response.data);
				setLoading(false);
			} catch (err) {
				console.error("Error in simplified fetch:", err);
				setError("Failed to fetch weather data");
				setLoading(false);
			}
		};

		fetchData();
	}, []);

	if (loading)
		return (
			<div className="p-4 bg-white shadow rounded">
				<div className="animate-pulse">
					<div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
					<div className="h-24 bg-gray-200 rounded w-1/2 mx-auto mb-4"></div>
					<div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
					<div className="h-4 bg-gray-200 rounded w-5/6 mb-2"></div>
					<div className="h-4 bg-gray-200 rounded w-4/6"></div>
				</div>
			</div>
		);

	if (error) return <div className="p-4 bg-red-100 text-red-800 shadow rounded">Error: {error}</div>;

	if (!data) return <div className="p-4 bg-white shadow rounded">No weather data available</div>;

	return (
		<div className="p-6 bg-white shadow-lg rounded-xl max-w-md mx-auto">
			<div className="flex justify-between items-center mb-6">
				<h2 className="text-2xl font-bold">{data.location.name}</h2>
				<div className="flex space-x-2">
					<button
						className={`${
							tempUnit === "C" ? "bg-blue-500 text-white" : "bg-gray-200"
						} px-3 py-1 rounded transition-colors`}
						onClick={toggleTempUnit}>
						°C
					</button>
					<button
						className={`${
							tempUnit === "F" ? "bg-blue-500 text-white" : "bg-gray-200"
						} px-3 py-1 rounded transition-colors`}
						onClick={toggleTempUnit}>
						°F
					</button>
				</div>
			</div>

			<motion.div
				className="text-center mb-8"
				initial={{ scale: 0.9, opacity: 0 }}
				animate={{ scale: 1, opacity: 1 }}
				transition={{ duration: 0.5 }}>
				<img
					src={data.current.weather_icons[0]}
					alt={data.current.weather_descriptions[0]}
					className="w-24 h-24 mx-auto mb-4"
				/>
				<h1 className="text-5xl font-bold mb-2">
					{convertTemp(data.current.temperature)}°{tempUnit}
				</h1>
				<p className="text-xl text-gray-600 mb-1">{data.current.weather_descriptions[0]}</p>
				<p className="text-sm text-gray-500">
					{new Date(data.location.localtime).toLocaleDateString("en-US", {
						weekday: "long",
						month: "long",
						day: "numeric",
					})}
				</p>
			</motion.div>

			<div className="grid grid-cols-2 gap-4">
				<div className="bg-gray-50 p-3 rounded-lg">
					<p className="text-gray-500 text-sm mb-1">Feels Like</p>
					<p className="font-semibold">
						{convertTemp(data.current.feelslike)}°{tempUnit}
					</p>
				</div>
				<div className="bg-gray-50 p-3 rounded-lg">
					<p className="text-gray-500 text-sm mb-1">Humidity</p>
					<p className="font-semibold">{data.current.humidity}%</p>
				</div>
				<div className="bg-gray-50 p-3 rounded-lg">
					<p className="text-gray-500 text-sm mb-1">Wind</p>
					<p className="font-semibold">
						{data.current.wind_speed} km/h ({data.current.wind_dir})
					</p>
				</div>
				<div className="bg-gray-50 p-3 rounded-lg">
					<p className="text-gray-500 text-sm mb-1">UV Index</p>
					<p className="font-semibold">{data.current.uv_index}</p>
				</div>
			</div>
		</div>
	);
};
