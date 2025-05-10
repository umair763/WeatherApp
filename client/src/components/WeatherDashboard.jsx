"use client";

import { useContext, useState, useEffect } from "react";
import { WeatherContext } from "../context/WeatherContext";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { SearchBar } from "./SearchBar";
import { CurrentWeather } from "./CurrentWeather";
import { WeeklyForecast } from "./WeeklyForecast";
import { HourlyForecast } from "./HourlyForecast";
import { Loader } from "./ui/loader";
import {
	AlertCircle,
	Droplets,
	Wind,
	Thermometer,
	Sun,
	Cloud,
	CloudLightning,
	CloudRain,
	CloudSnow,
	Compass,
	Eye,
	BarChart3,
	CalendarClock,
	Clock,
	RefreshCw,
	MapPin,
} from "lucide-react";

// Helper function to get time-based greeting
const getGreeting = () => {
	const hour = new Date().getHours();
	if (hour < 12) return "Good morning";
	if (hour < 18) return "Good afternoon";
	return "Good evening";
};

// Helper function to get appropriate weather icon based on condition
const getWeatherIcon = (condition, size = 6) => {
	const iconProps = { className: `h-${size} w-${size}` };

	if (!condition) return <Cloud {...iconProps} />;

	const text = condition.text?.toLowerCase() || "";

	if (text.includes("sunny") || text.includes("clear")) return <Sun {...iconProps} />;
	if (text.includes("rain") || text.includes("drizzle")) return <CloudRain {...iconProps} />;
	if (text.includes("snow") || text.includes("sleet")) return <CloudSnow {...iconProps} />;
	if (text.includes("thunder") || text.includes("lightning")) return <CloudLightning {...iconProps} />;
	if (text.includes("cloud")) return <Cloud {...iconProps} />;

	return <Cloud {...iconProps} />;
};

export function WeatherDashboard() {
	const {
		loading,
		error,
		weatherData,
		activeTab,
		setActiveTab,
		location,
		isUsingDummyData,
		tempUnit,
		windUnit,
		convertTemp,
		convertWind,
		fetchWeatherData,
	} = useContext(WeatherContext);

	const [lastUpdated, setLastUpdated] = useState(new Date());
	const [animateRefresh, setAnimateRefresh] = useState(false);

	const handleRefresh = () => {
		setAnimateRefresh(true);
		fetchWeatherData(location);
		setLastUpdated(new Date());
		setTimeout(() => setAnimateRefresh(false), 1000);
	};

	// Data for the weather metrics cards
	const getMetricsData = () => {
		if (!weatherData || !weatherData.current) return [];

		const { current } = weatherData;

		return [
			{
				title: "Humidity",
				value: `${current.humidity}%`,
				icon: <Droplets className="h-5 w-5 text-blue-500" />,
				description:
					current.humidity > 80
						? "Very humid"
						: current.humidity > 60
						? "Humid"
						: current.humidity > 30
						? "Comfortable"
						: "Dry",
				color: "from-blue-500 to-cyan-500",
			},
			{
				title: "Wind Speed",
				value: `${convertWind(current.wind_kph)} ${windUnit}`,
				icon: <Wind className="h-5 w-5 text-emerald-500" />,
				description: current.wind_kph > 40 ? "Strong winds" : current.wind_kph > 20 ? "Moderate breeze" : "Light breeze",
				color: "from-emerald-500 to-green-500",
			},
			{
				title: "Feels Like",
				value: `${convertTemp(current.feelslike_c)}°${tempUnit}`,
				icon: <Thermometer className="h-5 w-5 text-orange-500" />,
				description:
					current.feelslike_c > 30
						? "Hot"
						: current.feelslike_c > 20
						? "Warm"
						: current.feelslike_c > 10
						? "Mild"
						: "Cold",
				color: "from-orange-500 to-red-500",
			},
			{
				title: "UV Index",
				value: current.uv || "0",
				icon: <Sun className="h-5 w-5 text-yellow-500" />,
				description:
					current.uv > 7 ? "High protection needed" : current.uv > 3 ? "Protection advised" : "Low UV exposure",
				color: "from-yellow-500 to-amber-500",
			},
		];
	};

	return (
		<div className="space-y-6">
			{/* Header with location and refresh button */}
			<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
				<div>
					<h1 className="text-2xl font-bold tracking-tight">{getGreeting()}</h1>
					<p className="text-sm text-slate-500 dark:text-slate-400">Here's your weather overview for today</p>
				</div>

				<div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
					{weatherData && (
						<>
							<MapPin className="h-4 w-4" />
							<span>
								{weatherData.location?.name}, {weatherData.location?.country}
							</span>
							<button
								onClick={handleRefresh}
								className="ml-2 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
								title="Refresh data">
								<RefreshCw className={`h-4 w-4 ${animateRefresh ? "animate-spin" : ""}`} />
							</button>
							<span className="text-xs ml-1">
								Updated {lastUpdated.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
							</span>
						</>
					)}
				</div>
			</div>

			{/* Search bar */}
			<SearchBar />

			{/* Loading state */}
			{loading ? (
				<Card className="w-full">
					<CardContent className="flex flex-col justify-center items-center min-h-[300px]">
						<Loader size="lg" />
						<p className="mt-4 text-slate-500 dark:text-slate-400">Loading weather data...</p>
					</CardContent>
				</Card>
			) : error && !weatherData ? (
				<Card className="w-full border-red-200 dark:border-red-800 bg-red-50/50 dark:bg-red-900/20">
					<CardContent className="flex items-center gap-3 text-red-700 dark:text-red-400 p-6">
						<AlertCircle className="h-5 w-5" />
						<p>{error}</p>
					</CardContent>
				</Card>
			) : weatherData ? (
				<>
					{/* Main weather display */}
					<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
						{/* Left column - Current weather */}
						<Card className="lg:col-span-2 overflow-hidden">
							<div className="flex flex-col md:flex-row">
								{/* Current weather overview */}
								<div className="flex-1 p-6 bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
									<div className="flex flex-col h-full">
										<div className="flex items-center justify-between">
											<div>
												<h2 className="text-3xl font-bold">{weatherData.location?.name || location}</h2>
												<p className="text-blue-100">
													{new Date().toLocaleDateString(undefined, {
														weekday: "long",
														month: "long",
														day: "numeric",
													})}
												</p>
											</div>
											<div className="text-right">
												<div className="text-5xl font-bold">
													{convertTemp(weatherData.current.temp_c)}°{tempUnit}
												</div>
												<div className="text-blue-100">{weatherData.current.condition?.text || "Clear"}</div>
											</div>
										</div>

										<div className="flex justify-center items-center flex-1 py-6">
											{getWeatherIcon(weatherData.current.condition, 24)}
										</div>

										<div className="grid grid-cols-2 gap-4 mt-auto">
											<div className="bg-white/10 p-3 rounded-lg flex items-center">
												<Wind className="h-6 w-6 mr-3 text-blue-200" />
												<div>
													<p className="text-blue-100 text-sm">Wind</p>
													<p className="text-xl font-semibold">
														{convertWind(weatherData.current.wind_kph)} {windUnit}
													</p>
												</div>
											</div>
											<div className="bg-white/10 p-3 rounded-lg flex items-center">
												<Droplets className="h-6 w-6 mr-3 text-blue-200" />
												<div>
													<p className="text-blue-100 text-sm">Humidity</p>
													<p className="text-xl font-semibold">{weatherData.current.humidity}%</p>
												</div>
											</div>
										</div>
									</div>
								</div>

								{/* Right side - Additional info */}
								<div className="w-full md:max-w-xs border-l border-slate-200 dark:border-slate-800 p-6">
									<h3 className="font-medium mb-4 flex items-center gap-2">
										<CalendarClock className="h-4 w-4 text-slate-500" />
										Today's Highlights
									</h3>

									<div className="space-y-4">
										<div className="flex justify-between">
											<div className="text-sm text-slate-500 dark:text-slate-400">Feels like</div>
											<div className="font-medium">
												{convertTemp(weatherData.current.feelslike_c)}°{tempUnit}
											</div>
										</div>

										<div className="flex justify-between">
											<div className="text-sm text-slate-500 dark:text-slate-400">UV Index</div>
											<div className="font-medium">
												{weatherData.current.uv || "0"}{" "}
												{parseInt(weatherData.current.uv) > 7
													? "🔴"
													: parseInt(weatherData.current.uv) > 3
													? "🟠"
													: "🟢"}
											</div>
										</div>

										<div className="flex justify-between">
											<div className="text-sm text-slate-500 dark:text-slate-400">Precipitation</div>
											<div className="font-medium">{weatherData.current.precip_mm || 0} mm</div>
										</div>

										<div className="flex justify-between">
											<div className="text-sm text-slate-500 dark:text-slate-400">Visibility</div>
											<div className="font-medium">{weatherData.current.cloud || 0}%</div>
										</div>

										<div className="flex justify-between">
											<div className="text-sm text-slate-500 dark:text-slate-400">Pressure</div>
											<div className="font-medium">{weatherData.current.gust_kph || 0} km/h</div>
										</div>

										{isUsingDummyData && (
											<div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
												<div className="text-xs text-amber-500 dark:text-amber-400 flex items-center gap-1">
													<AlertCircle className="h-3 w-3" />
													<span>Demo data is being displayed</span>
												</div>
											</div>
										)}
									</div>
								</div>
							</div>
						</Card>

						{/* Right column - Weather metrics */}
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4">
							{getMetricsData().map((metric, index) => (
								<Card
									key={index}
									className="overflow-hidden">
									<div className={`bg-gradient-to-r ${metric.color} h-1`} />
									<CardContent className="p-4">
										<div className="flex justify-between items-start">
											<div className="space-y-1">
												<div className="flex items-center gap-2">
													{metric.icon}
													<h3 className="font-medium">{metric.title}</h3>
												</div>
												<p className="text-3xl font-bold">{metric.value}</p>
											</div>
											<div className="text-xs px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
												{metric.description}
											</div>
										</div>
									</CardContent>
								</Card>
							))}
						</div>
					</div>

					{/* Weather forecast tabs */}
					<Tabs
						defaultValue={activeTab}
						onValueChange={setActiveTab}
						className="w-full">
						<TabsList className="w-full grid grid-cols-2">
							<TabsTrigger
								value="hourly"
								className="flex items-center gap-2">
								<Clock className="h-4 w-4" />
								Hourly Forecast
							</TabsTrigger>
							<TabsTrigger
								value="week"
								className="flex items-center gap-2">
								<CalendarClock className="h-4 w-4" />
								7-Day Forecast
							</TabsTrigger>
						</TabsList>

						<TabsContent
							value="hourly"
							className="mt-4">
							<Card>
								<CardHeader className="pb-0">
									<CardTitle className="text-xl flex items-center gap-2">
										<Clock className="h-5 w-5 text-blue-500" />
										Hourly Weather Forecast
									</CardTitle>
								</CardHeader>
								<CardContent className="pt-6">
									<HourlyForecast />
								</CardContent>
								<CardFooter className="text-xs text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-slate-800 pt-3">
									Hourly forecast data updated every 3 hours
								</CardFooter>
							</Card>
						</TabsContent>

						<TabsContent
							value="week"
							className="mt-4">
							<Card>
								<CardHeader className="pb-0">
									<CardTitle className="text-xl flex items-center gap-2">
										<CalendarClock className="h-5 w-5 text-blue-500" />
										7-Day Weather Forecast
									</CardTitle>
								</CardHeader>
								<CardContent className="pt-6">
									<WeeklyForecast />
								</CardContent>
								<CardFooter className="text-xs text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-slate-800 pt-3">
									Long-range forecasts are subject to change
								</CardFooter>
							</Card>
						</TabsContent>
					</Tabs>

					{/* Additional weather insights */}
					<Card>
						<CardHeader>
							<CardTitle className="text-xl flex items-center gap-2">
								<BarChart3 className="h-5 w-5 text-blue-500" />
								Weather Insights
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
								<div className="space-y-2">
									<h3 className="font-medium">Temperature Trend</h3>
									<p className="text-sm text-slate-500 dark:text-slate-400">
										Temperature will{" "}
										{weatherData.forecast?.forecastday[0]?.day?.maxtemp_c >
										weatherData.forecast?.forecastday[1]?.day?.maxtemp_c
											? "decrease"
											: "increase"}{" "}
										over the next few days.
										{weatherData.forecast?.forecastday[0]?.day?.maxtemp_c > 25
											? " Stay hydrated and avoid prolonged exposure to the sun."
											: weatherData.forecast?.forecastday[0]?.day?.maxtemp_c < 10
											? " Dress warmly and be prepared for cold conditions."
											: " Conditions are moderate and comfortable."}
									</p>
								</div>

								<div className="space-y-2">
									<h3 className="font-medium">Precipitation Outlook</h3>
									<p className="text-sm text-slate-500 dark:text-slate-400">
										{weatherData.current?.precip_mm > 0
											? "Active precipitation is occurring. Expect wet conditions to continue."
											: weatherData.forecast?.forecastday[0]?.day?.daily_chance_of_rain > 50
											? "High chance of precipitation later today. Consider bringing an umbrella."
											: "Low probability of precipitation. Dry conditions expected."}
									</p>
								</div>

								<div className="space-y-2">
									<h3 className="font-medium">Air Quality</h3>
									<p className="text-sm text-slate-500 dark:text-slate-400">
										{weatherData.current?.cloud < 30
											? "Clear skies and good visibility. Excellent conditions for outdoor activities."
											: weatherData.current?.cloud > 70
											? "Overcast conditions may affect visibility and outdoor comfort."
											: "Partly cloudy conditions with moderate visibility."}
									</p>
								</div>
							</div>
						</CardContent>
					</Card>
				</>
			) : null}
		</div>
	);
}
