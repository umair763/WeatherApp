import { WeatherProvider } from "./context/WeatherContext";
import { Toaster } from "./components/ui/toaster";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import { Settings } from "./pages/settings";
import { Favorites } from "./pages/favorites";
import { Home } from "./pages/home";
import NotFound from "./pages/not-found";
import {
	SettingsIcon,
	Heart,
	HomeIcon,
	SunIcon,
	MoonIcon,
	MenuIcon,
	CloudRainIcon,
	CalendarIcon,
	MapPinIcon,
	LogOutIcon,
} from "lucide-react";
import WeatherDisplay from "./components/WeatherDisplay";
import { useEffect, useState, useContext } from "react";
import { WeatherContext } from "./context/WeatherContext";
import "./index.css";

const App = () => {
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const { darkMode, toggleDarkMode } = useContext(WeatherContext);
	const location = useLocation();

	// Determine active route
	const isActive = (path) => location.pathname === path;

	// Set default background color based on dark mode in client-side code
	useEffect(() => {
		if (darkMode) {
			document.documentElement.classList.add("dark");
		} else {
			document.documentElement.classList.remove("dark");
		}
	}, [darkMode]);

	return (
		<WeatherProvider>
			<div className="flex flex-col md:flex-row min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100">
				{/* Mobile header */}
				<header className="md:hidden sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 py-3 flex items-center justify-between">
					<button
						onClick={() => setSidebarOpen(!sidebarOpen)}
						className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
						<MenuIcon className="h-5 w-5" />
					</button>
					<h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-blue-400 dark:to-cyan-300">
						SkyPulse
					</h1>
					<button
						onClick={toggleDarkMode}
						className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
						{darkMode ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
					</button>
				</header>

				{/* Sidebar */}
				<aside
					className={`
					fixed md:sticky top-0 left-0 z-40 md:z-0 h-full md:h-auto
					w-64 md:w-20 lg:w-64 flex-shrink-0
					bg-white/90 dark:bg-slate-900/90 backdrop-blur-md 
					border-r border-slate-200 dark:border-slate-800
					transform transition-transform duration-300 ease-in-out
					${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
				`}>
					<div className="flex flex-col h-full p-4">
						{/* Logo */}
						<div className="hidden md:flex items-center justify-center lg:justify-start space-x-2 mb-8">
							<CloudRainIcon className="h-8 w-8 text-blue-500" />
							<h1 className="hidden lg:block text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-blue-400 dark:to-cyan-300">
								SkyPulse
							</h1>
						</div>

						{/* Navigation */}
						<nav className="flex-1">
							<ul className="space-y-1">
								<li>
									<Link
										to="/"
										onClick={() => setSidebarOpen(false)}
										className={`
											flex items-center justify-center lg:justify-start gap-3 p-3 rounded-lg
											${
												isActive("/")
													? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
													: "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
											}
										`}>
										<HomeIcon className="h-5 w-5" />
										<span className="hidden lg:block">Dashboard</span>
									</Link>
								</li>
								<li>
									<Link
										to="/forecast"
										onClick={() => setSidebarOpen(false)}
										className={`
											flex items-center justify-center lg:justify-start gap-3 p-3 rounded-lg
											${
												isActive("/forecast")
													? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
													: "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
											}
										`}>
										<CalendarIcon className="h-5 w-5" />
										<span className="hidden lg:block">Forecast</span>
									</Link>
								</li>
								<li>
									<Link
										to="/favorites"
										onClick={() => setSidebarOpen(false)}
										className={`
											flex items-center justify-center lg:justify-start gap-3 p-3 rounded-lg
											${
												isActive("/favorites")
													? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
													: "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
											}
										`}>
										<Heart className="h-5 w-5" />
										<span className="hidden lg:block">Favorites</span>
									</Link>
								</li>
								<li>
									<Link
										to="/locations"
										onClick={() => setSidebarOpen(false)}
										className={`
											flex items-center justify-center lg:justify-start gap-3 p-3 rounded-lg
											${
												isActive("/locations")
													? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
													: "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
											}
										`}>
										<MapPinIcon className="h-5 w-5" />
										<span className="hidden lg:block">Locations</span>
									</Link>
								</li>
								<li>
									<Link
										to="/settings"
										onClick={() => setSidebarOpen(false)}
										className={`
											flex items-center justify-center lg:justify-start gap-3 p-3 rounded-lg
											${
												isActive("/settings")
													? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
													: "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
											}
										`}>
										<SettingsIcon className="h-5 w-5" />
										<span className="hidden lg:block">Settings</span>
									</Link>
								</li>
							</ul>
						</nav>

						{/* Dark mode toggle and profile */}
						<div className="mt-auto pt-4 border-t border-slate-200 dark:border-slate-800">
							<button
								onClick={toggleDarkMode}
								className="w-full flex items-center justify-center lg:justify-start gap-3 p-3 rounded-lg
									hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300">
								{darkMode ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
								<span className="hidden lg:block">{darkMode ? "Light Mode" : "Dark Mode"}</span>
							</button>

							<div className="hidden lg:flex items-center gap-3 p-3 mt-2">
								<div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500"></div>
								<div className="hidden lg:block">
									<p className="text-sm font-medium">User</p>
									<p className="text-xs text-slate-500 dark:text-slate-400">Free Plan</p>
								</div>
							</div>
						</div>
					</div>
				</aside>

				{/* Main content */}
				<main className="flex-1 flex flex-col">
					<div className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full">
						<Routes>
							<Route
								path="/"
								element={<Home />}
							/>
							<Route
								path="/forecast"
								element={<Home />}
							/>
							<Route
								path="/favorites"
								element={<Favorites />}
							/>
							<Route
								path="/locations"
								element={<Favorites />}
							/>
							<Route
								path="/settings"
								element={<Settings />}
							/>
							<Route
								path="*"
								element={<NotFound />}
							/>
						</Routes>
					</div>

					{/* Footer */}
					<footer className="mt-auto border-t border-slate-200 dark:border-slate-800 py-4">
						<div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-2">
							<p className="text-xs text-slate-500 dark:text-slate-400">
								© {new Date().getFullYear()} SkyPulse • Advanced Weather Intelligence
							</p>
							<div className="flex items-center gap-4">
								<a
									href="#"
									className="text-xs text-slate-500 dark:text-slate-400 hover:text-blue-500 dark:hover:text-blue-400">
									Privacy Policy
								</a>
								<a
									href="#"
									className="text-xs text-slate-500 dark:text-slate-400 hover:text-blue-500 dark:hover:text-blue-400">
									Terms of Service
								</a>
								<a
									href="#"
									className="text-xs text-slate-500 dark:text-slate-400 hover:text-blue-500 dark:hover:text-blue-400">
									Support
								</a>
							</div>
						</div>
					</footer>
				</main>

				{/* Overlay for mobile sidebar */}
				{sidebarOpen && (
					<div
						className="md:hidden fixed inset-0 bg-slate-900/50 z-30"
						onClick={() => setSidebarOpen(false)}
					/>
				)}
			</div>
			<Toaster />
			<WeatherDisplay />
		</WeatherProvider>
	);
};

export default App;
