const express = require('express');
const cron = require('node-cron');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const https = require('https');
require('dotenv').config();

const app = express();
const PORT = 4000;

// ✅ Your secret token (ensure it matches the one used in Flask backend)
const ADMIN_TOKEN = process.env.ADMIN_TOKEN;
if (!ADMIN_TOKEN) {
  console.error("❌ ADMIN_TOKEN is missing from .env file");
  process.exit(1);
}

// ✅ Full API URL for triggering upload
const apiUrl = `https://vision-zero-insights.onrender.com/api/admin/upload?token=${ADMIN_TOKEN}`;

// ✅ CSV file path (your Flask backend expects this to exist)
const CSV_PATH = path.join(__dirname, '../backend/crash_data_cleaned.csv');

// ✅ Dataset URL (NYC Open Data crash dataset)
const datasetUrl = "https://data.cityofnewyork.us/api/views/h9gi-nx95/rows.csv?accessType=DOWNLOAD";

console.log("📅 Cronjob server starting...");

// 🕓 Run once a day at 6AM UTC (2AM EST/EDT)
cron.schedule('0 6 * * *', () => {
  console.log("⏰ [Cron] Running daily crash data update...");

  // Step 1: Download CSV
  const file = fs.createWriteStream(CSV_PATH);

  https.get(datasetUrl, response => {
    if (response.statusCode !== 200) {
      console.error(`❌ Failed to download CSV. Status: ${response.statusCode}`);
      return;
    }

    response.pipe(file);

    file.on('finish', () => {
      file.close(async () => {
        console.log("✅ NYC crash dataset downloaded");

        // Step 2: Trigger backend upload
        try {
          const res = await axios.post(apiUrl);
          console.log("✅ Upload to Render DB complete:", res.data);
        } catch (uploadErr) {
          console.error("❌ Upload to backend failed:", uploadErr.response?.data || uploadErr.message);
        }
      });
    });
  }).on('error', err => {
    console.error("❌ Download error:", err.message);
  });
});

// Optional: Health check endpoint
app.get('/', (req, res) => {
  res.send('🟢 Cron server is running');
});

app.listen(PORT, () => {
  console.log(`🚀 Cron server listening at http://localhost:${PORT}`);
});
