export default function Navbar() {
    return (
      <nav className="bg-gray-900 text-white p-4 shadow-md flex justify-between items-center">
        <h1 className="text-xl font-bold">🚦 Vision Zero Insights</h1>
        <div className="space-x-4">
          <button className="hover:underline">Map</button>
          <button className="hover:underline">Predictions</button>
          <button className="hover:underline">Heatmap</button>
        </div>
      </nav>
    )
  }
  