"use client";

import { useContext } from "react";
import { WeatherContext } from "../context/WeatherContext";
import { AlertTriangle, X } from "lucide-react";
import { useState, useEffect } from "react";

const WeatherDisplay = () => {
	const { isUsingDummyData, error } = useContext(WeatherContext);
	const [dismissed, setDismissed] = useState(false);
	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		if (isUsingDummyData) {
			setIsVisible(true);
			setDismissed(false);
		}
	}, [isUsingDummyData]);

	// Only show the banner if we're using dummy data and user hasn't dismissed it
	if (!isUsingDummyData || dismissed || !isVisible) return null;

	return (
		<div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-yellow-500/90 dark:bg-yellow-600/90 backdrop-blur-sm text-yellow-950 dark:text-yellow-100 shadow-lg border-t border-yellow-400 dark:border-yellow-700 animate-in slide-in-from-bottom duration-300">
			<div className="container mx-auto flex items-center justify-between">
				<div className="flex items-center gap-2">
					<AlertTriangle className="h-5 w-5 flex-shrink-0" />
					<div>
						<p className="font-medium">You're viewing sample weather data</p>
						<p className="text-sm text-yellow-900/80 dark:text-yellow-200/80">
							{error || "The API is currently unavailable or API key is missing."} Try again later.
						</p>
					</div>
				</div>
				<button
					onClick={() => setDismissed(true)}
					className="p-1 rounded-full hover:bg-yellow-600/20 text-yellow-950 dark:text-yellow-200"
					aria-label="Dismiss">
					<X className="h-5 w-5" />
				</button>
			</div>
		</div>
	);
};

export default WeatherDisplay;
