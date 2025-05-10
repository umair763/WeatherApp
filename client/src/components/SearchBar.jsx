"use client";

import { useState, useContext, useRef, useEffect } from "react";
import { WeatherContext } from "../context/WeatherContext";
import { searchLocationsAutocomplete } from "../lib/api";
import { MapPin, Search, Loader2, History, X, Navigation } from "lucide-react";

export function SearchBar() {
	const { searchLocation, getCurrentLocation, location, isUsingDummyData } = useContext(WeatherContext);
	const [searchQuery, setSearchQuery] = useState("");
	const [suggestions, setSuggestions] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [showSuggestions, setShowSuggestions] = useState(false);
	const [recentSearches, setRecentSearches] = useState([]);
	const suggestionRef = useRef(null);
	const inputRef = useRef(null);

	// Load recent searches from localStorage
	useEffect(() => {
		const saved = localStorage.getItem("recentSearches");
		if (saved) {
			try {
				setRecentSearches(JSON.parse(saved).slice(0, 5));
			} catch (err) {
				console.error("Error parsing recent searches:", err);
			}
		}
	}, []);

	// Save recent search
	const saveRecentSearch = (query) => {
		if (!query) return;

		const newRecent = {
			query,
			timestamp: new Date().toISOString(),
		};

		const updated = [newRecent, ...recentSearches.filter((item) => item.query !== query)].slice(0, 5);
		setRecentSearches(updated);
		localStorage.setItem("recentSearches", JSON.stringify(updated));
	};

	// Handle click outside to close suggestions
	useEffect(() => {
		function handleClickOutside(event) {
			if (suggestionRef.current && !suggestionRef.current.contains(event.target)) {
				setShowSuggestions(false);
			}
		}

		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	// Fetch location suggestions when search query changes
	useEffect(() => {
		const fetchSuggestions = async () => {
			if (searchQuery.length < 2) {
				setSuggestions([]);
				return;
			}

			setIsLoading(true);
			try {
				const results = await searchLocationsAutocomplete(searchQuery);
				setSuggestions(results);
			} catch (error) {
				console.error("Error fetching suggestions:", error);
				// Show dummy suggestions if we're in demo mode
				if (isUsingDummyData) {
					setSuggestions(
						[
							{ name: "New York", country: "United States", lat: 40.7128, lon: -74.006 },
							{ name: "London", country: "United Kingdom", lat: 51.5074, lon: -0.1278 },
							{ name: "Tokyo", country: "Japan", lat: 35.6762, lon: 139.6503 },
							{ name: "Paris", country: "France", lat: 48.8566, lon: 2.3522 },
						].filter((s) => s.name.toLowerCase().includes(searchQuery.toLowerCase()))
					);
				}
			} finally {
				setIsLoading(false);
			}
		};

		const timer = setTimeout(fetchSuggestions, 300);
		return () => clearTimeout(timer);
	}, [searchQuery, isUsingDummyData]);

	const handleSubmit = (e) => {
		e.preventDefault();
		if (searchQuery.trim()) {
			searchLocation(searchQuery);
			saveRecentSearch(searchQuery);
			setSearchQuery("");
			setShowSuggestions(false);
		}
	};

	const handleSuggestionClick = (suggestion) => {
		const locationString = `${suggestion.name}, ${suggestion.country}`;
		searchLocation(`${suggestion.lat},${suggestion.lon}`);
		saveRecentSearch(locationString);
		setSearchQuery("");
		setShowSuggestions(false);
	};

	const handleRecentSearchClick = (recentSearch) => {
		searchLocation(recentSearch.query);
		setSearchQuery("");
		setShowSuggestions(false);
	};

	const clearSearch = () => {
		setSearchQuery("");
		inputRef.current?.focus();
	};

	return (
		<div
			className="relative w-full"
			ref={suggestionRef}>
			<form
				onSubmit={handleSubmit}
				className="flex w-full">
				<div className="relative flex-grow">
					<div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400">
						<Search className="h-4 w-4" />
					</div>

					<input
						ref={inputRef}
						type="text"
						value={searchQuery}
						onChange={(e) => {
							setSearchQuery(e.target.value);
							setShowSuggestions(true);
						}}
						onFocus={() => setShowSuggestions(true)}
						placeholder="Search for a city or location..."
						className="w-full pl-10 pr-10 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 transition-all"
					/>

					{searchQuery && (
						<button
							type="button"
							onClick={clearSearch}
							className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-500 dark:hover:text-slate-300 p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700">
							<X className="h-4 w-4" />
						</button>
					)}

					{isLoading && (
						<div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-500">
							<Loader2 className="h-4 w-4 animate-spin" />
						</div>
					)}

					{showSuggestions && (searchQuery.length > 0 || recentSearches.length > 0) && (
						<div className="absolute z-20 w-full mt-1 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
							{searchQuery.length > 0 && suggestions.length > 0 && (
								<>
									<div className="px-3 py-2 text-xs font-medium text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-700">
										Search Results
									</div>
									<div className="max-h-60 overflow-auto">
										{suggestions.map((suggestion, index) => (
											<div
												key={index}
												className="px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer text-slate-900 dark:text-slate-100 flex items-center gap-2 transition-colors"
												onClick={() => handleSuggestionClick(suggestion)}>
												<MapPin className="h-4 w-4 text-blue-500 flex-shrink-0" />
												<div>
													<div className="font-medium">{suggestion.name}</div>
													<div className="text-xs text-slate-500 dark:text-slate-400">{suggestion.country}</div>
												</div>
											</div>
										))}
									</div>
								</>
							)}

							{searchQuery.length === 0 && recentSearches.length > 0 && (
								<>
									<div className="px-3 py-2 text-xs font-medium text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-700">
										Recent Searches
									</div>
									<div className="max-h-60 overflow-auto">
										{recentSearches.map((recent, index) => (
											<div
												key={index}
												className="px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer text-slate-900 dark:text-slate-100 flex items-center gap-2 transition-colors"
												onClick={() => handleRecentSearchClick(recent)}>
												<History className="h-4 w-4 text-slate-400 flex-shrink-0" />
												<span>{recent.query}</span>
											</div>
										))}
									</div>
								</>
							)}

							{searchQuery.length > 0 && suggestions.length === 0 && (
								<div className="px-4 py-3 text-slate-500 dark:text-slate-400 text-center">
									No locations found matching "{searchQuery}"
								</div>
							)}
						</div>
					)}
				</div>

				<button
					type="button"
					onClick={getCurrentLocation}
					className="ml-2 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-800/40 text-blue-600 dark:text-blue-400 p-3 rounded-lg flex items-center justify-center border border-blue-200 dark:border-blue-800 transition-colors"
					aria-label="Get current location"
					title="Use current location">
					<Navigation className="h-5 w-5" />
				</button>
			</form>

			{isUsingDummyData && (
				<div className="mt-2 text-amber-500 dark:text-amber-400 text-xs">
					Note: Location search results are simulated in demo mode
				</div>
			)}
		</div>
	);
}
