# SmartCoords – The Ultimate Coordinate Conversion Tool

**SmartCoords** is a modern, web-based utility designed to seamlessly bridge the gap between local grid systems (Dubai DLTM & Global UTM) and standard GPS coordinates used by Google Maps and navigation apps.

This guide explains why SmartCoords is essential for your workflow and how to use its powerful features.

---

## Why Use SmartCoords?

### 1. **Accuracy & Precision**
Typical online converters use generic algorithms. **SmartCoords** uses the industry-standard `proj4` library with the specific projection parameters for **Dubai DLTM** and global **UTM zones (1-60)**, ensuring survey-grade accuracy for plot locations.

### 2. **Bidirectional Conversion**
Unlike simple tools, SmartCoords works both ways:
- **DLTM/UTM → GPS**: Perfect for locating a plot on Google Maps from a site plan.
- **GPS → DLTM/UTM**: Ideal for surveyors needing grid coordinates from a pinned location.

### 3. **Instant Sharing & Navigation**
No more manually typing coordinates into WhatsApp or Maps. SmartCoords provides one-tap buttons to:
- **Open in Google Maps**: Instantly view the location.
- **Share via WhatsApp**: Send a formatted message with coordinates and a map link to clients/colleagues.
- **Native Share**: Use your device's native share sheet (Email, Telegram, AirDrop, etc.).

### 4. **Mobile-First Design**
Built with a responsive, dark-themed UI that works perfectly on smartphones and tablets in the field, as well as desktop computers in the office.

---

## Features Overview

| Feature | Description | Benefit |
| :--- | :--- | :--- |
| **4-Mode Selector** | Switch between DLTM↔GPS and UTM↔GPS. | Handles both local Dubai projects and international UTM-based work. |
| **UTM Support** | Select Zone (1-60) and Hemisphere (N/S). | Full global coverage for engineering projects worldwide. |
| **Smart Inputs** | Dynamic labels and placeholders based on mode. | Prevents confusion (e.g., asking for "Easting" vs "Latitude"). |
| **Interactive Results** | Tap-to-copy buttons for every value. | Eliminate transcription errors. |
| **Data Privacy** | Runs entirely in your browser. | No coordinate data is sent to any server. |

---

## How to Use

### 1. Select Your Mode
Tap the toggle bar at the top to choose your conversion type:
- **DLTM → GPS**: Use for Dubai land plots (Easting/Northing).
- **GPS → DLTM**: Convert a Google Maps pin to Dubai grid coordinates.
- **UTM → GPS**: Use for international projects (requires Zone selection).
- **GPS → UTM**: Convert a GPS location to UTM grid coordinates.

### 2. Enter Coordinates
- **For DLTM/UTM**: Enter the **Easting (X)** and **Northing (Y)** values from your site plan.
- **For GPS**: Enter the **Latitude** and **Longitude**.
- *Tip: You can press "Enter" on your keyboard to trigger conversion.*

### 3. Create & Share
Tap **Convert Coordinates**. The results will appear instantly.
- **Copy**: Tap the copy icon next to any value.
- **Google Maps**: Tap "Open in Google Maps" to visualize the location.
- **Share**: Tap "Share on WhatsApp" or "Share" to send the location details.

---

## Technical Specifications
- **Projection Engine**: `proj4js` v2.9.0
- **Grid Systems**:
    - **Dubai DLTM**: `+proj=tmerc +lat_0=0 +lon_0=55.333...`
    - **UTM**: Universal Transverse Mercator (Zones 1-60, N/S)
    - **GPS**: WGS84 (EPSG:4326)
- **Compatibility**: Chrome, Safari, Firefox, Edge (Desktop & Mobile)
