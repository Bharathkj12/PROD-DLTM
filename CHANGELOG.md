# Changelog

All notable changes to this project will be documented in this file.

## [1.1.0] - 2026-02-19
### Added
- **Bidirectional Conversion**: Added a toggle bar to switch between **DLTM → GPS** and **GPS → DLTM** conversion modes.
- **Dynamic UI**: Input labels, placeholders, and result labels now update automatically based on the selected mode.

---

## [1.0.0] - 2026-02-19
### Added
- **Dubai DLTM to GPS Conversion**: Implemented core logic to convert Dubai Local Transverse Mercator (DLTM) coordinates (Easting/Northing) to standard GPS/WGS84 coordinates (Latitude/Longitude) using `proj4.js`.
- **User Interface**:
    - Created a responsive, dark-themed UI with a glassmorphism card design.
    - Added input fields for Easting and Northing with validation.
    - Displayed conversion results clearly.
- **Google Maps Integration**: Added a "Open in Google Maps" button that links directly to the converted coordinates.
- **WhatsApp Sharing**: Added a "Share on WhatsApp" button to easily share the location via WhatsApp.
- **Input Validation**: Added error handling for invalid or missing inputs (e.g., non-numeric values, negative numbers).
- **Keyboard Shortcut**: Enabled "Enter" key support to trigger conversion.
