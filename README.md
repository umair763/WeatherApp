# SkyPulse - Advanced Weather Intelligence Platform

SkyPulse is a modern, responsive weather application built with React that provides real-time weather data, forecasts, and detailed meteorological insights. The application features a beautiful UI with dark mode support and comprehensive weather information.

## 🌟 Features

-  **Real-time Weather Data**: Get current weather conditions for any location
-  **Detailed Forecasts**:
   -  Hourly forecasts for the next 24 hours
   -  7-day weather predictions
   -  Temperature trends and precipitation chances
-  **Interactive Charts**: Visual representation of temperature and precipitation data
-  **Location Search**:
   -  Search for any city worldwide
   -  Recent searches history
   -  Current location detection
-  **Responsive Design**:
   -  Mobile-first approach
   -  Beautiful dark/light mode
   -  Adaptive layouts for all screen sizes
-  **Weather Insights**:
   -  Temperature trends
   -  Precipitation outlook
   -  Air quality information
-  **User Preferences**:
   -  Temperature unit conversion (Celsius/Fahrenheit)
   -  Wind speed unit preferences
   -  Dark/Light theme toggle

## 🚀 Tech Stack

-  **Frontend**: React.js
-  **Routing**: React Router
-  **Styling**: Tailwind CSS
-  **Charts**: Recharts
-  **Icons**: Lucide Icons
-  **State Management**: React Context API
-  **API Integration**: Weather API

## 📦 Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/WeatherApp.git
cd WeatherApp
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory and add your API key:

```env
VITE_WEATHER_API_KEY=your_api_key_here
```

4. Start the development server:

```bash
npm run dev
```

## 🔧 Configuration

The application requires the following environment variables:

-  `VITE_WEATHER_API_KEY`: Your Weather API key
-  `VITE_API_BASE_URL`: Base URL for the weather API (optional)

## 🛠️ Development

-  `npm run dev`: Start development server
-  `npm run build`: Build for production
-  `npm run preview`: Preview production build
-  `npm run lint`: Run ESLint
-  `npm run format`: Format code with Prettier

## 📱 Deployment

### Vercel Deployment

To deploy to Vercel and fix the 404 routing issue:

1. Create a `vercel.json` file in the root directory:

```json
{
	"rewrites": [
		{
			"source": "/(.*)",
			"destination": "/index.html"
		}
	]
}
```

2. Deploy to Vercel:

```bash
vercel
```

### Other Platforms

For other platforms, ensure to configure the server to handle client-side routing by redirecting all requests to `index.html`.

## 🎨 UI Components

The application uses a custom UI component library built with Tailwind CSS, including:

-  Cards
-  Charts
-  Search Bar
-  Weather Icons
-  Navigation
-  Tabs
-  Tooltips

## 📊 Data Visualization

-  Temperature trends using area charts
-  Precipitation probability charts
-  Weather condition icons
-  Interactive tooltips

---
## 🌐 Live Demo

Check out the live application here: [SkyPulse Live App](https://weather-app-three-rose-71.vercel.app/)