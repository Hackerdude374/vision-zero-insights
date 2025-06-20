export async function fetchCrashData() {
  const response = await fetch('/api/crashes');
  if (!response.ok) throw new Error("Network error");
  return response.json();
}
