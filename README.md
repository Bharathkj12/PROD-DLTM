# SmartCoords

**SmartCoords** is a high-fidelity, production-grade coordinate conversion utility designed for surveying professionals. Built with a focus on mathematical precision and an unapologetic "Cartographic Brutalism / Industrial Utility" aesthetic, it provides fast, reliable conversions between global standard formats and localized metric grids.

## 🎯 Core Features

### 1. Multi-Directional Conversion
Perform mathematically robust transformations utilizing `proj4js`:
- **DLTM ↔ Lat/Lon** (Dubai Local Transverse Mercator to WGS84 Geodetic)
- **UTM ↔ Lat/Lon** (Universal Transverse Mercator to WGS84 Geodetic)
- *Includes dynamic input fields for UTM Zone and Hemisphere selection.*

### 2. "Plot My Location" (GPS Lock)
A tactical, field-ready feature that utilizes device geolocation (`navigator.geolocation`) to instantly pull your current coordinates into the input fields. Includes a satellite-lock visualization with rapid number scrambling and green lock-in pulses.

### 3. Session Manifest (History Log)
A terminal-style, persistent session history table that logs your last 10 conversions. 
- **Tap-to-Copy:** Click on any Input or Output coordinate in the log to instantly copy it to your clipboard.
- **Row Copy:** Copy the entire conversion string in one click.
- Clears automatically when the browser session ends, or via the manual clear button.

### 4. Interactive Data Sharing
- **Open in Google Maps**: Instantly plot the converted coordinates to verify visually.
- **WhatsApp Integration**: Generates a pre-formatted message containing both Grid & Lat/Lon coordinates along with a Google Maps link for rapid field-to-office communication.
- **Native OS Share**: Triggers the device's native share sheet.

### 5. Brutalist Luxury UI
An uncompromising design language utilizing deep contrasts, monospace typography (`JetBrains Mono`), bold grid structures, and micro-animations to mimic physical, military-grade hardware. 
- Fully responsive mobile-first architecture.
- Built-in Dark/Light theme toggling securely persisted via `localStorage`.
- Live `SYS.ONLINE` / `CALCULATING...` state indicator dot.

## 🛠 Tech Stack

- **HTML5 & Vanilla CSS3**: No CSS frameworks. Custom, localized design system using CSS variables.
- **Vanilla JavaScript (ES6)**: Zero-dependency DOM manipulation and state management.
- **Proj4js**: The industry standard projection library for pure mathematical coordinate geometry.

## 🚀 Running Locally

Because SmartCoords uses geolocation and clipboard APIs, it must be served over HTTP rather than opening the file directly (to prevent CORS/Security context issues).

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Bharathkj12/PROD-DLTM.git
   cd PROD-DLTM
   ```

2. **Serve the directory:**
   If you have Python installed:
   ```bash
   python3 -m http.server 8080
   ```
   Or using Node.js/npm:
   ```bash
   npx serve .
   ```

3. **Open in browser:**
   Navigate to `http://localhost:8080` (or the port provided by your server).

## 🤝 Contributing
Updates and pulls should be made against the `staging` branch. The `main` branch acts as the production-ready source of truth.

---
*Created by Bharath KJ | Powered By ARAR Utility*
