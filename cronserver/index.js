const express = require('express');
const cron = require('node-cron');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const https = require('https');
require("dotenv").config();

// cronserver/index.js
console.log("📅 Cronjob server starting...");

const app = express();
const PORT = 4000;

// Your token set in .env or directly here (MATCH the one Flask checks)
const ADMIN_TOKEN = process.env.ADMIN_TOKEN;

// Example: use it in a fetch call
const apiUrl = `https://vision-zero-insights.onrender.com/api/admin/upload?token=${ADMIN_TOKEN}`;
// Destination for downloaded CSV file (where your Flask backend expects it)
const CSV_PATH = path.join(__dirname, '../backend/crash_data_cleaned.csv');

// 1️⃣ Schedule job to run once a day at 6 AM (UTC)
cron.schedule('0 6 * * *', async () => {
  console.log("⏰ [Cron] Running daily NYC crash data update...");

  try {
    // Step 1: Download new CSV
    const file = fs.createWriteStream(CSV_PATH);
    const datasetUrl = "https://data.cityofnewyork.us/api/views/h9gi-nx95/rows.csv?accessType=DOWNLOAD";

    https.get(datasetUrl, response => {
      response.pipe(file);
      file.on('finish', () => {
        file.close(async () => {
          console.log("✅ NYC crash dataset downloaded");

          // Step 2: Call your Flask backend upload API
          try {
            const res = await axios.post(
              `https://vision-zero-insights.onrender.com/api/admin/upload?token=${ADMIN_TOKEN}`
            );
            console.log("✅ Crash data uploaded to Render DB:", res.data);
          } catch (uploadErr) {
            console.error("❌ Upload to backend failed:", uploadErr.response?.data || uploadErr.message);
          }
        });
      });
    });
  } catch (err) {
    console.error("❌ Cron job failed:", err.message);
  }
});

// Optional: Web server to confirm it's alive
app.get('/', (req, res) => {
  res.send('🟢 Cron server is running');
});

app.listen(PORT, () => {
  console.log(`🚀 Cron server listening at http://localhost:${PORT}`);
});
