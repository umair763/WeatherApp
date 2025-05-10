"use client";

import { useContext } from "react";
import { WeatherContext } from "../context/WeatherContext";
import { Sun, Cloud, CloudRain, CloudSnow, CloudFog, CloudLightning, Droplets, Wind, Umbrella } from "lucide-react";
import { getWeatherIcon, formatDate } from "../lib/api";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "./ui/chart";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, Area, AreaChart } from "recharts";

export function WeeklyForecast() {
	const { weatherData, convertTemp, tempUnit, windUnit, convertWind } = useContext(WeatherContext);

	if (!weatherData || !weatherData.forecast || !weatherData.forecast.forecastday) {
		return <div className="text-center py-4 text-slate-400">No forecast data available</div>;
	}

	const dailyForecast = weatherData.forecast.forecastday.slice(0, 7);

	// Map weather condition to icon
	const getWeatherIconComponent = (condition) => {
		if (!condition) return <Cloud className="h-8 w-8 text-blue-500" />;

		const text = condition.text?.toLowerCase() || "";
		const iconProps = { className: "h-8 w-8" };

		if (text.includes("sunny") || text.includes("clear")) {
			return (
				<Sun
					{...iconProps}
					className="h-8 w-8 text-yellow-500"
				/>
			);
		}
		if (text.includes("rain") || text.includes("drizzle")) {
			return (
				<CloudRain
					{...iconProps}
					className="h-8 w-8 text-blue-500"
				/>
			);
		}
		if (text.includes("snow") || text.includes("sleet")) {
			return (
				<CloudSnow
					{...iconProps}
					className="h-8 w-8 text-sky-400"
				/>
			);
		}
		if (text.includes("thunder") || text.includes("lightning")) {
			return (
				<CloudLightning
					{...iconProps}
					className="h-8 w-8 text-purple-500"
				/>
			);
		}
		if (text.includes("fog") || text.includes("mist")) {
			return (
				<CloudFog
					{...iconProps}
					className="h-8 w-8 text-slate-400"
				/>
			);
		}
		if (text.includes("cloud")) {
			return (
				<Cloud
					{...iconProps}
					className="h-8 w-8 text-slate-400"
				/>
			);
		}

		return (
			<Cloud
				{...iconProps}
				className="h-8 w-8 text-slate-400"
			/>
		);
	};

	// Helper function to format day name
	const formatDayName = (dateString) => {
		const date = new Date(dateString);
		return date.toLocaleDateString(undefined, { weekday: "short" });
	};

	// Helper function to get appropriate day number
	const formatDayNumber = (dateString) => {
		const date = new Date(dateString);
		return date.getDate();
	};

	// Prepare data for temperature chart
	const tempChartData = dailyForecast.map((day) => ({
		date: formatDayName(day.date),
		maxTemp: convertTemp(day.day.maxtemp_c),
		minTemp: convertTemp(day.day.mintemp_c),
		day: formatDayNumber(day.date),
		condition: day.day.condition?.text || "Clear",
	}));

	// Prepare data for precipitation chart
	const precipChartData = dailyForecast.map((day) => ({
		date: formatDayName(day.date),
		amount: day.day.totalprecip_mm || 0,
		day: formatDayNumber(day.date),
	}));

	return (
		<div className="space-y-8">
			{/* Weekly forecast cards */}
			<div className="grid grid-cols-1 md:grid-cols-7 gap-3">
				{dailyForecast.map((day, index) => {
					const isToday = index === 0;

					return (
						<div
							key={index}
							className={`rounded-xl p-4 transition-all ${
								isToday
									? "bg-gradient-to-b from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/20"
									: "border border-slate-200 dark:border-slate-800 hover:border-blue-200 dark:hover:border-blue-800 bg-white dark:bg-slate-950"
							}`}>
							<div className="flex flex-col h-full">
								{/* Day header */}
								<div
									className={`text-center mb-3 pb-2 ${
										isToday ? "border-b border-blue-500" : "border-b border-slate-100 dark:border-slate-800"
									}`}>
									<p className={`font-medium ${isToday ? "text-blue-100" : "text-slate-500 dark:text-slate-400"}`}>
										{formatDayName(day.date)}
									</p>
									<p className="text-xl font-bold">{formatDayNumber(day.date)}</p>
								</div>

								{/* Weather icon and condition */}
								<div className="flex-1 flex flex-col items-center justify-center text-center mb-3">
									<div className="mb-2">{getWeatherIconComponent(day.day.condition)}</div>
									<p className={`text-sm ${isToday ? "text-white" : ""}`}>{day.day.condition?.text || "Clear"}</p>
								</div>

								{/* Temperature */}
								<div className="flex justify-between items-center mt-auto pt-2">
									<div
										className={`text-sm font-medium ${
											isToday ? "text-blue-100" : "text-blue-500 dark:text-blue-400"
										}`}>
										{convertTemp(day.day.mintemp_c)}°
									</div>
									<div className="mx-1 border-r border-slate-200 dark:border-slate-700 h-4"></div>
									<div className="text-lg font-bold">{convertTemp(day.day.maxtemp_c)}°</div>
								</div>

								{/* Additional info */}
								<div
									className={`grid grid-cols-2 gap-1 mt-3 pt-3 ${
										isToday ? "border-t border-blue-500" : "border-t border-slate-100 dark:border-slate-800"
									}`}>
									<div className="flex items-center">
										<Droplets className={`h-3 w-3 mr-1 ${isToday ? "text-blue-200" : "text-blue-500"}`} />
										<span className="text-xs">{day.day.avghumidity || 0}%</span>
									</div>
									<div className="flex items-center">
										<Wind className={`h-3 w-3 mr-1 ${isToday ? "text-blue-200" : "text-green-500"}`} />
										<span className="text-xs">{convertWind(day.day.maxwind_kph || 0)}</span>
									</div>
									<div className="flex items-center col-span-2 mt-1">
										<Umbrella className={`h-3 w-3 mr-1 ${isToday ? "text-blue-200" : "text-indigo-500"}`} />
										<span className="text-xs">{day.day.totalprecip_mm || 0} mm</span>
									</div>
								</div>
							</div>
						</div>
					);
				})}
			</div>

			{/* Temperature trend chart */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				<div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-5">
					<h3 className="text-lg font-medium mb-4 flex items-center">
						<Sun className="h-5 w-5 text-orange-500 mr-2" />
						Temperature Trend
					</h3>
					<div className="h-64">
						<ChartContainer>
							<ResponsiveContainer
								width="100%"
								height="100%">
								<AreaChart
									data={tempChartData}
									margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
									<defs>
										<linearGradient
											id="colorMaxTemp"
											x1="0"
											y1="0"
											x2="0"
											y2="1">
											<stop
												offset="5%"
												stopColor="#FF9500"
												stopOpacity={0.2}
											/>
											<stop
												offset="95%"
												stopColor="#FF9500"
												stopOpacity={0}
											/>
										</linearGradient>
										<linearGradient
											id="colorMinTemp"
											x1="0"
											y1="0"
											x2="0"
											y2="1">
											<stop
												offset="5%"
												stopColor="#3b82f6"
												stopOpacity={0.2}
											/>
											<stop
												offset="95%"
												stopColor="#3b82f6"
												stopOpacity={0}
											/>
										</linearGradient>
									</defs>
									<XAxis
										dataKey="date"
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
										dataKey="maxTemp"
										stroke="#FF9500"
										strokeWidth={2}
										fillOpacity={1}
										fill="url(#colorMaxTemp)"
										activeDot={{ r: 6, strokeWidth: 0 }}
									/>
									<Area
										type="monotone"
										dataKey="minTemp"
										stroke="#3b82f6"
										strokeWidth={2}
										fillOpacity={1}
										fill="url(#colorMinTemp)"
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
						<CloudRain className="h-5 w-5 text-blue-500 mr-2" />
						Precipitation Forecast
					</h3>
					<div className="h-64">
						<ChartContainer>
							<ResponsiveContainer
								width="100%"
								height="100%">
								<AreaChart
									data={precipChartData}
									margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
									<defs>
										<linearGradient
											id="colorPrecip"
											x1="0"
											y1="0"
											x2="0"
											y2="1">
											<stop
												offset="5%"
												stopColor="#3b82f6"
												stopOpacity={0.8}
											/>
											<stop
												offset="95%"
												stopColor="#3b82f6"
												stopOpacity={0}
											/>
										</linearGradient>
									</defs>
									<XAxis
										dataKey="date"
										axisLine={false}
										tickLine={false}
										tick={{ fill: "#94a3b8", fontSize: 12 }}
									/>
									<YAxis
										tickFormatter={(value) => `${value}mm`}
										axisLine={false}
										tickLine={false}
										tick={{ fill: "#94a3b8", fontSize: 12 }}
									/>
									<Tooltip content={<CustomPrecipTooltip />} />
									<Area
										type="monotone"
										dataKey="amount"
										stroke="#3b82f6"
										strokeWidth={2}
										fillOpacity={1}
										fill="url(#colorPrecip)"
										activeDot={{ r: 6, strokeWidth: 0, fill: "#2563eb" }}
									/>
								</AreaChart>
							</ResponsiveContainer>
						</ChartContainer>
					</div>
				</div>
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
						<Sun className="h-3 w-3 mr-1" /> High: {payload[0].value}°{tempUnit}
					</div>
					<div className="text-sm font-medium text-blue-500 flex items-center">
						<CloudSnow className="h-3 w-3 mr-1" /> Low: {payload[1].value}°{tempUnit}
					</div>
				</ChartTooltipContent>
			</ChartTooltip>
		);
	}
	return null;
}

function CustomPrecipTooltip({ active, payload, label }) {
	if (active && payload && payload.length) {
		const amount = payload[0].value;
		let description = "No precipitation";

		if (amount > 10) {
			description = "Heavy rain expected";
		} else if (amount > 5) {
			description = "Moderate rain expected";
		} else if (amount > 0) {
			description = "Light rain possible";
		}

		return (
			<ChartTooltip>
				<ChartTooltipContent>
					<div className="font-medium border-b border-slate-100 dark:border-slate-700 pb-1 mb-1">{label}</div>
					<div className="text-sm font-medium text-blue-500 flex items-center">
						<CloudRain className="h-3 w-3 mr-1" /> {amount} mm
					</div>
					<div className="text-xs text-slate-500 dark:text-slate-400 mt-1">{description}</div>
				</ChartTooltipContent>
			</ChartTooltip>
		);
	}
	return null;
}
