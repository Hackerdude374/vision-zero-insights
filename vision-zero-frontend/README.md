# 💻 Frontend - React + Vite + Mapbox

---

## 🌐 Stack

- React
- Vite
- TailwindCSS
- Axios
- Mapbox GL JS

---

## 📁 Key Structure

```
src/
├── App.jsx
├── api/
│   └── crashAPI.js
├── components/
│   └── CrashMap.jsx
```

---

## 🧭 Map Rendering

### CrashMap.jsx

```jsx
mapboxgl.accessToken = "YOUR_TOKEN"

useEffect(() => {
  const map = new mapboxgl.Map({...})
  fetchCrashData().then(data => {
    data.forEach(crash => {
      new mapboxgl.Marker().setLngLat([...])
    })
  })
}, [])
```

---

## 🌐 API Integration

### `crashAPI.js`

```js
export async function fetchCrashData() {
  const res = await fetch("/api/crashes")
  return res.json()
}
```

---

## 🎨 Tailwind Setup

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### `index.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@import 'mapbox-gl/dist/mapbox-gl.css';
```

---

## 🚀 Vercel Deployment

```bash
vercel login
vercel deploy
```

Set `VITE_API_BASE_URL` in `.env` for production proxying if needed.

---

## 🧪 Dev Server

```bash
npm install
npm run dev
```

Runs on: `http://localhost:5173`

---

## 🔥 Live Preview

```bash
npm run build
```

Builds production-ready frontend for Vercel