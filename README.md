
# Vision Zero Insights - Project Overview

Vision Zero Insights is a full-stack crash data analysis and visualization dashboard that helps track and map NYC traffic incidents using machine learning and mapping tools. It’s designed to assist policy makers and analysts in identifying dangerous zones and contributing factors in accidents.

## 🌐 Tech Stack
- **Frontend**: React + Vite + TailwindCSS + Mapbox
- **Backend**: Flask + PostgreSQL + PostGIS + scikit-learn
- **Database**: Render PostgreSQL (remote)
- **Deployment**:
  - Backend → Render
  - Frontend → Vercel

## 🎯 Real-World Problem Solved
NYC crash data is complex and hard to visualize. This project simplifies access, visualization, and ML-based interpretation of the data to improve safety decision-making.

## 📁 Main Directories
- `/vision-zero-frontend`: React code for map and UI
- `/backend`: Flask API, ML model, and database connectors

## 🚀 Features
- Mapbox-powered interactive crash map
- Live crash data from PostgreSQL
- ML model predicts severity
- Filter and browse crash info by borough and factors
