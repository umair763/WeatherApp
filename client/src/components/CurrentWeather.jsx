"use client";

import { useContext } from "react";
import { WeatherContext } from "../context/WeatherContext";
import { Card, CardContent } from "./ui/card";
import { Sun, Cloud, CloudRain, CloudSnow, CloudFog, CloudLightning, Wind, Droplets, Umbrella } from "lucide-react";
import { getWeatherIcon, formatDate } from "../lib/api";

export function CurrentWeather() {
	const { weatherData, convertTemp, tempUnit } = useContext(WeatherContext);

	if (!weatherData || !weatherData.current) {
		return null;
	}

	const { current, location } = weatherData;
	const weatherCode = current.values.weatherCode;

	// Map weather code to icon
	const getWeatherIconComponent = (code) => {
		const iconName = getWeatherIcon(code);
		const iconProps = { className: "h-16 w-16 text-white" };

		switch (iconName) {
			case "sun":
				return <Sun {...iconProps} />;
			case "sun-cloud":
			case "cloud-sun":
				return (
					<Cloud
						{...iconProps}
						color="#f0f9ff"
					/>
				);
			case "cloud":
				return <Cloud {...iconProps} />;
			case "cloud-rain":
			case "cloud-rain-heavy":
				return <CloudRain {...iconProps} />;
			case "cloud-snow":
			case "cloud-snow-heavy":
				return <CloudSnow {...iconProps} />;
			case "fog":
				return <CloudFog {...iconProps} />;
			case "cloud-lightning":
				return <CloudLightning {...iconProps} />;
			default:
				return <Cloud {...iconProps} />;
		}
	};

	return (
		<Card className="w-full overflow-hidden bg-gradient-to-br from-blue-600 to-blue-800 text-white border-none shadow-lg">
			<CardContent className="p-6">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div className="space-y-4">
						<div>
							<h2 className="text-3xl font-bold">{location?.name || "Current Location"}</h2>
							<p className="text-blue-100">{formatDate(current.time)}</p>
						</div>

						<div className="flex items-center">
							{getWeatherIconComponent(weatherCode)}
							<div className="ml-4">
								<div className="text-5xl font-bold">
									{convertTemp(current.values.temperature)}°{tempUnit}
								</div>
								<div className="text-xl text-blue-100">
									{current.values.weatherCode === 1000
										? "Clear"
										: current.values.weatherCode === 1001
										? "Cloudy"
										: current.values.weatherCode === 4001
										? "Rain"
										: current.values.weatherCode === 5001
										? "Snow"
										: "Mixed"}
								</div>
							</div>
						</div>
					</div>

					<div className="grid grid-cols-2 gap-4">
						<div className="bg-white/10 p-3 rounded-lg flex items-center">
							<Wind className="h-8 w-8 mr-3 text-blue-200" />
							<div>
								<p className="text-blue-100 text-sm">Wind</p>
								<p className="text-xl font-semibold">{current.values.windSpeed} km/h</p>
							</div>
						</div>

						<div className="bg-white/10 p-3 rounded-lg flex items-center">
							<Droplets className="h-8 w-8 mr-3 text-blue-200" />
							<div>
								<p className="text-blue-100 text-sm">Humidity</p>
								<p className="text-xl font-semibold">{current.values.humidity}%</p>
							</div>
						</div>

						<div className="bg-white/10 p-3 rounded-lg flex items-center">
							<Sun className="h-8 w-8 mr-3 text-blue-200" />
							<div>
								<p className="text-blue-100 text-sm">UV Index</p>
								<p className="text-xl font-semibold">{current.values.uvIndex}</p>
							</div>
						</div>

						<div className="bg-white/10 p-3 rounded-lg flex items-center">
							<Umbrella className="h-8 w-8 mr-3 text-blue-200" />
							<div>
								<p className="text-blue-100 text-sm">Precipitation</p>
								<p className="text-xl font-semibold">{current.values.precipitationProbability}%</p>
							</div>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
