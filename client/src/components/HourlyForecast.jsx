"use client";

import { useContext } from "react";
import { WeatherContext } from "../context/WeatherContext";
import { Sun, Cloud, CloudRain, CloudSnow, CloudFog, CloudLightning, Droplets, Umbrella, Thermometer } from "lucide-react";
import { formatDate } from "../lib/api";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "./ui/chart";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, AreaChart, Area } from "recharts";

export function HourlyForecast() {
	const { weatherData, convertTemp, tempUnit } = useContext(WeatherContext);

	if (!weatherData || !weatherData.forecast || !weatherData.forecast.forecastday) {
		return <div className="text-center py-4 text-slate-400">No hourly forecast available</div>;
	}

	// Get the hourly forecast for today
	const todayHours = weatherData.forecast.forecastday[0]?.hour || [];
	const hourlyForecast = todayHours.filter((hour) => new Date(hour.time) >= new Date());

	// If not enough hours left today, add some from tomorrow
	if (hourlyForecast.length < 12 && weatherData.forecast.forecastday.length > 1) {
		const tomorrowHours = weatherData.forecast.forecastday[1]?.hour || [];
		const neededHours = 12 - hourlyForecast.length;
		hourlyForecast.push(...tomorrowHours.slice(0, neededHours));
	}

	// Ensure we have at least some hours to display
	if (hourlyForecast.length === 0) {
		hourlyForecast.push(...todayHours.slice(-12));
	}

	// Take the next 24 hours at most
	const nextHours = hourlyForecast.slice(0, 24);

	// Helper function to get weather icon
	const getWeatherIconComponent = (condition) => {
		if (!condition) return <Cloud className="h-6 w-6 text-slate-400" />;

		const text = condition.text?.toLowerCase() || "";

		if (text.includes("sunny") || text.includes("clear")) {
			return <Sun className="h-6 w-6 text-yellow-500" />;
		}
		if (text.includes("rain") || text.includes("drizzle")) {
			return <CloudRain className="h-6 w-6 text-blue-500" />;
		}
		if (text.includes("snow") || text.includes("sleet")) {
			return <CloudSnow className="h-6 w-6 text-sky-400" />;
		}
		if (text.includes("thunder") || text.includes("lightning")) {
			return <CloudLightning className="h-6 w-6 text-purple-500" />;
		}
		if (text.includes("fog") || text.includes("mist")) {
			return <CloudFog className="h-6 w-6 text-slate-400" />;
		}
		if (text.includes("cloud")) {
			return <Cloud className="h-6 w-6 text-slate-400" />;
		}

		return <Cloud className="h-6 w-6 text-slate-400" />;
	};

	// Format time
	const formatHourTime = (timeString) => {
		const date = new Date(timeString);
		return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true }).toLowerCase();
	};

	// Check if is current hour
	const isCurrentHour = (timeString) => {
		const now = new Date();
		const hourTime = new Date(timeString);
		return (
			now.getHours() === hourTime.getHours() &&
			now.getDate() === hourTime.getDate() &&
			now.getMonth() === hourTime.getMonth()
		);
	};

	// Prepare data for chart
	const chartData = nextHours.map((hour) => ({
		time: formatHourTime(hour.time),
		temp: convertTemp(hour.temp_c),
		chanceOfRain: hour.chance_of_rain,
		condition: hour.condition?.text || "Clear",
		hourString: hour.time,
	}));

	return (
		<div className="space-y-8">
			{/* Hourly forecast cards */}
			<div className="relative">
				<div className="overflow-x-auto pb-4">
					<div className="flex space-x-3 min-w-max">
						{nextHours.map((hour, index) => {
							const current = isCurrentHour(hour.time);

							return (
								<div
									key={index}
									className={`transition-all rounded-lg p-3 flex flex-col items-center min-w-[70px] ${
										current
											? "bg-gradient-to-b from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/20"
											: "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
									}`}>
									<div
										className={`text-sm font-medium ${
											current ? "text-white" : "text-slate-700 dark:text-slate-200"
										}`}>
										{formatHourTime(hour.time)}
									</div>
									<div className="my-2">{getWeatherIconComponent(hour.condition)}</div>
									<div
										className={`text-lg font-semibold ${
											current ? "text-white" : "text-slate-900 dark:text-slate-50"
										}`}>
										{convertTemp(hour.temp_c).toFixed(3)}°
									</div>
									<div
										className={`flex items-center gap-1 text-xs mt-1 ${
											current ? "text-blue-100" : "text-slate-500 dark:text-slate-400"
										}`}>
										<Droplets className="h-3 w-3" />
										<span>{Number(hour.chance_of_rain).toFixed(3)}%</span>
									</div>
								</div>
							);
						})}
					</div>
				</div>
				{/* Gradient fades for horizontal scrolling */}
				<div className="pointer-events-none absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-white dark:from-slate-950 to-transparent"></div>
			</div>

			{/* Dual charts */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				{/* Temperature chart */}
				<div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-5">
					<h3 className="text-lg font-medium mb-4 flex items-center">
						<Thermometer className="h-5 w-5 text-orange-500 mr-2" />
						Temperature Trend
					</h3>
					<div className="h-60">
						<ChartContainer>
							<ResponsiveContainer
								width="100%"
								height="100%">
								<AreaChart
									data={chartData}
									margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
									<defs>
										<linearGradient
											id="colorTemp"
											x1="0"
											y1="0"
											x2="0"
											y2="1">
											<stop
												offset="5%"
												stopColor="#FF9500"
												stopOpacity={0.3}
											/>
											<stop
												offset="95%"
												stopColor="#FF9500"
												stopOpacity={0}
											/>
										</linearGradient>
									</defs>
									<XAxis
										dataKey="time"
										axisLine={false}
										tickLine={false}
										tick={{ fill: "#94a3b8", fontSize: 12 }}
									/>
									<YAxis
										tickFormatter={(value) => `${value}°`}
										axisLine={false}
										tickLine={false}
										tick={{ fill: "#94a3b8", fontSize: 12 }}
									/>
									<Tooltip content={<CustomTempTooltip tempUnit={tempUnit} />} />
									<Area
										type="monotone"
										dataKey="temp"
										stroke="#FF9500"
										strokeWidth={2}
										fillOpacity={1}
										fill="url(#colorTemp)"
										activeDot={{ r: 6, strokeWidth: 0 }}
									/>
								</AreaChart>
							</ResponsiveContainer>
						</ChartContainer>
					</div>
				</div>

				{/* Precipitation chart */}
				<div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-5">
					<h3 className="text-lg font-medium mb-4 flex items-center">
						<Umbrella className="h-5 w-5 text-blue-500 mr-2" />
						Precipitation Chance
					</h3>
					<div className="h-60">
						<ChartContainer>
							<ResponsiveContainer
								width="100%"
								height="100%">
								<AreaChart
									data={chartData}
									margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
									<defs>
										<linearGradient
											id="colorRain"
											x1="0"
											y1="0"
											x2="0"
											y2="1">
											<stop
												offset="5%"
												stopColor="#3b82f6"
												stopOpacity={0.3}
											/>
											<stop
												offset="95%"
												stopColor="#3b82f6"
												stopOpacity={0}
											/>
										</linearGradient>
									</defs>
									<XAxis
										dataKey="time"
										axisLine={false}
										tickLine={false}
										tick={{ fill: "#94a3b8", fontSize: 12 }}
									/>
									<YAxis
										tickFormatter={(value) => `${value}%`}
										axisLine={false}
										tickLine={false}
										tick={{ fill: "#94a3b8", fontSize: 12 }}
										domain={[0, 100]}
									/>
									<Tooltip content={<CustomRainTooltip />} />
									<Area
										type="monotone"
										dataKey="chanceOfRain"
										stroke="#3b82f6"
										strokeWidth={2}
										fillOpacity={1}
										fill="url(#colorRain)"
										activeDot={{ r: 6, strokeWidth: 0, fill: "#2563eb" }}
									/>
								</AreaChart>
							</ResponsiveContainer>
						</ChartContainer>
					</div>
				</div>
			</div>

			{/* Weather conditions summary */}
			<div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-5">
				<h3 className="text-lg font-medium mb-4">Today's Weather Pattern</h3>
				<p className="text-slate-600 dark:text-slate-300">
					{nextHours.some((h) => h.chance_of_rain > 50)
						? "Precipitation is likely during parts of the day. Consider bringing an umbrella when heading out."
						: nextHours.some((h) => h.chance_of_rain > 20)
						? "There's a slight chance of precipitation at certain hours. It might be wise to check the forecast before heading out."
						: "Dry conditions are expected throughout the period with little to no chance of precipitation."}{" "}
					{nextHours.some((h) => h.temp_c > 28)
						? "Temperatures will rise significantly during the day. Stay hydrated and avoid prolonged sun exposure."
						: nextHours.some((h) => h.temp_c < 10)
						? "Cool temperatures are expected. Consider dressing warmly when going outside."
						: "Temperature conditions will be moderate and comfortable throughout the day."}
				</p>
			</div>
		</div>
	);
}

function CustomTempTooltip({ active, payload, label, tempUnit }) {
	if (active && payload && payload.length) {
		return (
			<ChartTooltip>
				<ChartTooltipContent>
					<div className="font-medium border-b border-slate-100 dark:border-slate-700 pb-1 mb-1">{label}</div>
					<div className="text-sm font-medium text-orange-500 flex items-center">
						<Thermometer className="h-3 w-3 mr-1" /> {payload[0].value}°{tempUnit}
					</div>
				</ChartTooltipContent>
			</ChartTooltip>
		);
	}
	return null;
}

function CustomRainTooltip({ active, payload, label }) {
	if (active && payload && payload.length) {
		const chance = payload[0].value;
		let description = "No precipitation expected";

		if (chance > 70) {
			description = "High chance of precipitation";
		} else if (chance > 40) {
			description = "Moderate chance of precipitation";
		} else if (chance > 20) {
			description = "Low chance of precipitation";
		}

		return (
			<ChartTooltip>
				<ChartTooltipContent>
					<div className="font-medium border-b border-slate-100 dark:border-slate-700 pb-1 mb-1">{label}</div>
					<div className="text-sm font-medium text-blue-500 flex items-center">
						<Umbrella className="h-3 w-3 mr-1" /> {chance}% chance
					</div>
					<div className="text-xs text-slate-500 dark:text-slate-400 mt-1">{description}</div>
				</ChartTooltipContent>
			</ChartTooltip>
		);
	}
	return null;
}
