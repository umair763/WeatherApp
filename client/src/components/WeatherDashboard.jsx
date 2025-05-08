import React, { useState, useEffect } from "react";

export const WeatherDashboard = () => {
	const [location, setLocation] = useState("London");
	const [searchInput, setSearchInput] = useState("");
	const [weatherData, setWeatherData] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	// Fetch weather data using Open-Meteo API
	useEffect(() => {
		const fetchWeatherData = async () => {
			setLoading(true);
			setError(null);
			try {
				// Get coordinates for the location
				const geoRes = await fetch(
					`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(location)}`
				);
				const geoData = await geoRes.json();
				if (!geoData.results || !geoData.results[0]) {
					throw new Error("Location not found");
				}
				const { latitude, longitude, name, country } = geoData.results[0];

				// Fetch weather data
				const weatherRes = await fetch(
					`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,wind_speed_10m&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m`
				);
				const weather = await weatherRes.json();

				setWeatherData({
					...weather,
					location: { name, country, latitude, longitude },
				});
			} catch (err) {
				setError(err.message || "Failed to fetch weather data.");
			} finally {
				setLoading(false);
			}
		};
		fetchWeatherData();
	}, [location]);

	const handleSearch = (e) => {
		e.preventDefault();
		if (searchInput.trim()) {
			setLocation(searchInput.trim());
			setSearchInput("");
		}
	};

	// Helper for temperature
	const [tempUnit, setTempUnit] = useState("C");
	const convertTemp = (temp) => (tempUnit === "F" ? Math.round((temp * 9) / 5 + 32) : Math.round(temp));

	// Render loading/error states
	if (loading) return <div className="p-8 text-center">Loading...</div>;
	if (error)
		return (
			<div className="p-8 text-center text-red-600">
				{error}
				<button
					className="ml-4 underline"
					onClick={() => setLocation("London")}>
					Reset
				</button>
			</div>
		);
	if (!weatherData) return <div className="p-8 text-center">No data.</div>;

	// Prepare current and hourly data
	const { current, hourly, location: loc } = weatherData;
	const currentTime = current?.time ? new Date(current.time) : null;

	return (
		<div className="max-w-xl mx-auto p-4">
			<form
				onSubmit={handleSearch}
				className="mb-4 flex">
				<input
					className="flex-1 border rounded-l px-2 py-1"
					value={searchInput}
					onChange={(e) => setSearchInput(e.target.value)}
					placeholder="Search for city..."
				/>
				<button
					className="bg-blue-500 text-white px-4 rounded-r"
					type="submit">
					Search
				</button>
			</form>
			<div className="bg-white rounded shadow p-6">
				<div className="mb-2 text-lg font-bold">
					{loc?.name}, {loc?.country}
				</div>
				<div className="mb-2">
					<span className="text-4xl font-bold">
						{current?.temperature_2m !== undefined ? convertTemp(current.temperature_2m) : "--"}°{tempUnit}
					</span>
					<button
						className="ml-2 px-2 py-1 border rounded"
						onClick={() => setTempUnit(tempUnit === "C" ? "F" : "C")}>
						°{tempUnit === "C" ? "F" : "C"}
					</button>
				</div>
				<div className="mb-2">
					<span>Wind: {current?.wind_speed_10m !== undefined ? current.wind_speed_10m + " km/h" : "--"}</span>
				</div>
				<div className="mb-2 text-gray-600">
					{currentTime
						? currentTime.toLocaleString(undefined, {
								weekday: "long",
								hour: "2-digit",
								minute: "2-digit",
						  })
						: "--"}
				</div>
				<div className="mt-4">
					<div className="font-semibold mb-2">Next 6 hours</div>
					<div className="grid grid-cols-3 gap-2">
						{hourly?.time?.slice(0, 6).map((t, idx) => (
							<div
								key={t}
								className="p-2 border rounded text-center bg-blue-50">
								<div className="text-xs">
									{new Date(t).toLocaleTimeString(undefined, {
										hour: "2-digit",
										minute: "2-digit",
									})}
								</div>
								<div>
									{hourly.temperature_2m?.[idx] !== undefined ? convertTemp(hourly.temperature_2m[idx]) : "--"}°
									{tempUnit}
								</div>
								<div className="text-xs">
									RH:{" "}
									{hourly.relative_humidity_2m?.[idx] !== undefined ? hourly.relative_humidity_2m[idx] + "%" : "--"}
								</div>
								<div className="text-xs">
									Wind: {hourly.wind_speed_10m?.[idx] !== undefined ? hourly.wind_speed_10m[idx] + " km/h" : "--"}
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
};
