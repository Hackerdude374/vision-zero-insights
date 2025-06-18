
# Frontend - React + Vite + TailwindCSS + Mapbox

## 🔧 Purpose
Visualizes NYC crash data on an interactive map and connects to the Flask backend for live data.

## 🗂️ Important Files
- `src/components/CrashMap.jsx`: Displays Mapbox map + crash markers
- `src/api/crashAPI.js`: Fetches crash data from Flask
- `App.jsx`: Main app structure
- `tailwind.config.js`, `postcss.config.js`: Tailwind setup
- `vite.config.js`: Proxy config for local backend API calls

## 🗺️ Mapbox Integration
```jsx
mapboxgl.accessToken = "your_token";
const map = new mapboxgl.Map({ ... })
new mapboxgl.Marker().setLngLat([lng, lat]).addTo(map)
```

## 🔁 API Usage
```javascript
fetch("/api/crashes")
  .then(res => res.json())
  .then(data => console.log(data))
```

## ✅ Setup Steps
1. `npm install`
2. `npm run dev`
3. Deploy to Vercel for free hosting
