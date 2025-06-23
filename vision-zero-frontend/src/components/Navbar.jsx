import { motion } from "framer-motion";

export default function Navbar({ onDownload, onRefresh, onTogglePredict }) {
  return (
    <motion.nav
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full h-16 bg-white shadow-md flex items-center justify-between px-6 fixed top-0 z-50"
    >
      <h1 className="text-xl font-bold text-blue-700">Vision Zero Insights</h1>

      <div className="flex space-x-4">
        <button onClick={onDownload} className="px-4 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200">
          📥 Download
        </button>
        <button onClick={onRefresh} className="px-4 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200">
          🔄 Refresh
        </button>
        <button onClick={onTogglePredict} className="px-4 py-1 bg-purple-100 text-purple-700 rounded hover:bg-purple-200">
          🔮 Predict
        </button>
      </div>
    </motion.nav>
  );
}
