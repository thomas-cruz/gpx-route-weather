# GPX Weather Planner

A React/Next.js application that helps outdoor enthusiasts plan activities by analyzing weather conditions along their planned routes.

## Overview

This project takes GPX route files and overlays weather forecasts to help cyclists, runners, and hikers understand what conditions they'll face throughout their journey. It calculates real-time wind conditions (headwinds, tailwinds, crosswinds) and displays hourly weather predictions at each checkpoint along your route.

The app includes a 3D Digital Twin visualization that renders your activity (cyclist or runner) in a Three.js scene, with dynamic weather effects including animated wind particles, rain, and UV-sensitive sun indicators.

## How It Works

### Core Functionality

1. **Route Upload**: Upload a `.gpx` file containing your planned route
2. **Activity Selection**: Choose between cycling, running, or hiking modes (each configures different sampling intervals and speeds)
3. **Start Time**: Set when you plan to start your activity
4. **Weather Analysis**: The app:
   - Parses your GPX route coordinates
   - Samples the route at regular intervals based on activity type
   - Fetches hourly weather data from Open-Meteo API for each location
   - Calculates your estimated arrival time at each checkpoint
   - Analyzes wind direction relative to your route bearing to classify wind conditions

### Wind Classification

The app identifies three wind types:
- **Headwind** 🔺 (red): Wind blowing against you — harder effort required
- **Tailwind** 🔻 (green): Wind pushing you — easier conditions
- **Crosswind** ➡️ (yellow): Wind hitting from the side

### What You See

- **Interactive Leaflet Map**: Shows your route with weather forecast markers at each checkpoint
- **Digital Twin 3D Scene**: A 3D visualization rendering:
  - Cyclist or runner model matching your selected activity
  - Animated wind particles showing wind direction and speed
  - Rain particles visualizing precipitation levels
  - Sun component that reacts to UV index
- **Color-coded Weather Cards**: Displaying:
  - Temperature ⚠️
  - Precipitation chances 🌧️
  - UV Index ☀️
  - Wind speed 💨
  - Wind direction
  - Wind type classification (Headwind/Tailwind/Crosswind)
- **Detailed Weather List Panel**: On the right side showing all checkpoints
- **Arrival Times**: Displayed in chronological order based on your estimated travel time

## Getting Started

First, install dependencies:

```bash
npm install
# or
pnpm install
# or
yarn install
# or
bun install
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Features

- ✅ Upload any GPX route file
- ✅ Real-time weather integration via Open-Meteo API
- ✅ Wind direction analysis relative to route bearing
- ✅ Activity-specific configurations (cycling, running, hiking)
- ✅ **3D Digital Twin Scene** with Three.js:
  - Real cyclist or runner GLB models
  - Dynamic wind particle system responding to wind data
  - Rain visualization based on precipitation forecasts
  - UV-reactive sun component
- ✅ Visual wind barb indicators
- ✅ Color-coded weather events
- ✅ Smooth reactive UI with Next.js

## Tech Stack

- **Framework**: Next.js 14+
- **UI Library**: React
- **Maps**: Leaflet.js with react-leaflet
- **3D Graphics**: Three.js with @react-three/fiber
- **Asset Loading**: @react-three/drei (useGLTF, OrbitControls)
- **GPX Parsing**: @mapbox/togeojson
- **Backend API**: Open-Meteo Weather API

## Project Structure

```
gpx-weather-planner/
├── app/                       # Next.js app router pages
├── components/                # Reusable React components
│   ├── digitalTwin/          # 3D Digital Twin visualization
│   │   ├── activityModel.tsx                    # Cyclist/runner GLB models
│   │   ├── windParticles.tsx                    # Animated wind effect
│   │   ├── rainParticles.tsx                    # Rain visualization
│   │   ├── sun.tsx                              # UV-reactive sun component
│   │   ├── digitalTwinScene.tsx                 # Main Three.js scene
│   │   └── digitalTwinPopupContent.tsx          # Popup content for twins
│   ├── mapClientWrapper.tsx # Main upload interface
│   ├── map.tsx              # Reactive Leaflet map with weather markers
│   └── routeWeatherSidebar.tsx       # Weather data listing panel
├── lib/                       # Utility functions
│   ├── parseGpx.ts               # GPX file parsing
│   ├── weather.ts                # Weather API calls
│   ├── wind.ts                   # Wind classification logic
│   ├── routeAnalysis.ts          # Distance/bearing calculations
│   ├── sampleRoute.ts            # Time-based route sampling
│   └── activityConfig.ts         # Activity-specific settings
└── types/                     # TypeScript type definitions
```

## Customization

You can modify various aspects:

- **Weather Grid Size**: Adjust how broadly weather stations cover areas in `map.tsx`
- **Sample Interval**: Configure distance between weather checkpoints
- **Activity Configurations**: Modify speeds and intervals in `activityConfig.ts`

## License

Unlicense

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
