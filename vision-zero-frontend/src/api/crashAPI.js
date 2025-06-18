export async function fetchCrashData() {
    const res = await fetch('/api/crashes');
    if (!res.ok) throw new Error('Failed to fetch crash data');
    return res.json();
  }
  