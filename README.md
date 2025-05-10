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
-  **API Integration**: Tomorrow.io Weather API

## 📦 Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/WeatherApp.git
cd WeatherApp
```

2. Install dependencies:

```bash
cd client
npm install
```

3. Create a `.env` file in the client directory and add your API key:

```env
VITE_WEATHER_API_KEY=your_api_key_here
```

4. Start the development server:

```bash
npm run dev
```

## 🔑 API Key Configuration

### Getting an API Key

1. Visit [Tomorrow.io](https://www.tomorrow.io/)
2. Create a free account
3. Navigate to the developer dashboard
4. Create a new API key
5. Copy the API key

### Configuring API Key Locally

Create a `.env` file in the `client` directory:

```
VITE_WEATHER_API_KEY=your_api_key_here
```

### Configuring API Key on Vercel

1. Go to your Vercel project dashboard
2. Navigate to Settings > Environment Variables
3. Add a new environment variable:
   -  Name: `VITE_WEATHER_API_KEY`
   -  Value: your API key from Tomorrow.io
4. Save and redeploy your application

**Note**: If you deploy without an API key, the application will run in demo mode with simulated data.

## 🔧 Configuration

The application requires the following environment variables:

-  `VITE_WEATHER_API_KEY`: Your Tomorrow.io Weather API key

## 🛠️ Development

-  `npm run dev`: Start development server
-  `npm run build`: Build for production
-  `npm run preview`: Preview production build
-  `npm run lint`: Run ESLint
-  `npm run format`: Format code with Prettier

## 📱 Deployment

### Vercel Deployment

To deploy to Vercel and fix the 404 routing issue:

1. Ensure you have a `vercel.json` file in the root directory:

```json
{
	"version": 2,
	"framework": "vite",
	"buildCommand": "cd client && npm install && npm run build",
	"outputDirectory": "client/dist",
	"rewrites": [
		{
			"source": "/(.*)",
			"destination": "/index.html"
		}
	]
}
```

2. Set up your environment variables on Vercel (see API Key Configuration above)

3. Deploy to Vercel:

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
