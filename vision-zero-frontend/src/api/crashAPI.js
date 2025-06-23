// src/api/crashAPI.js
export async function fetchCrashData() {
  const res = await fetch("https://vision-zero-insights.onrender.com/api/crashes");
  if (!res.ok) {
    throw new Error("Failed to fetch crash data!!!!!!!!!!!");
  }
  console.log ("HELLO!!!")
  return res.json();
}