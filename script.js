// ── Dubai DLTM Projection Definition ──────────────────
const DUBAI_DLTM =
    '+proj=tmerc +lat_0=0 +lon_0=55.3333333333333 +k=1 +x_0=500000 +y_0=0 +datum=WGS84 +units=m +no_defs';
const WGS84 = 'EPSG:4326'; // standard lat/lon

// ── State ─────────────────────────────────────────────
let currentLat = null;
let currentLng = null;

// ── DOM refs ──────────────────────────────────────────
const eastingInput = document.getElementById('easting');
const northingInput = document.getElementById('northing');
const latEl = document.getElementById('lat');
const lngEl = document.getElementById('lng');
const resultsEl = document.getElementById('results');
const errorEl = document.getElementById('error');
const btnMaps = document.getElementById('btn-maps');
const btnWhatsApp = document.getElementById('btn-whatsapp');

// ── Helpers ───────────────────────────────────────────
function showError(msg) {
    errorEl.textContent = msg;
    errorEl.classList.add('visible');
}

function clearError() {
    errorEl.textContent = '';
    errorEl.classList.remove('visible');
}

function setActionButtons(enabled) {
    btnMaps.disabled = !enabled;
    btnWhatsApp.disabled = !enabled;
}

// ── Convert ───────────────────────────────────────────
function convert() {
    clearError();

    const eastingRaw = eastingInput.value.trim();
    const northingRaw = northingInput.value.trim();

    // Validate presence
    if (!eastingRaw || !northingRaw) {
        showError('Please enter both Easting and Northing values.');
        resultsEl.classList.remove('visible');
        setActionButtons(false);
        return;
    }

    // Parse as floats
    const easting = parseFloat(eastingRaw);
    const northing = parseFloat(northingRaw);

    // Validate numbers
    if (isNaN(easting) || isNaN(northing)) {
        showError('Coordinates must be valid numbers.');
        resultsEl.classList.remove('visible');
        setActionButtons(false);
        return;
    }

    // Basic sanity range checks for Dubai DLTM
    if (easting < 0 || northing < 0) {
        showError('Easting and Northing must be positive values.');
        resultsEl.classList.remove('visible');
        setActionButtons(false);
        return;
    }

    try {
        // proj4 returns [longitude, latitude]
        const [lng, lat] = proj4(DUBAI_DLTM, WGS84, [easting, northing]);

        currentLat = lat;
        currentLng = lng;

        latEl.textContent = lat.toFixed(8);
        lngEl.textContent = lng.toFixed(8);

        resultsEl.classList.add('visible');
        setActionButtons(true);
    } catch (err) {
        showError('Conversion failed. Check your coordinates.');
        resultsEl.classList.remove('visible');
        setActionButtons(false);
    }
}

// ── Google Maps ───────────────────────────────────────
function openGoogleMaps() {
    if (currentLat === null || currentLng === null) return;
    const url = `https://www.google.com/maps?q=${currentLat},${currentLng}`;
    window.open(url, '_blank');
}

// ── WhatsApp ──────────────────────────────────────────
function shareWhatsApp() {
    if (currentLat === null || currentLng === null) return;
    const mapsUrl = `https://www.google.com/maps?q=${currentLat},${currentLng}`;
    const message = `Here is the plot location: ${mapsUrl}`;
    const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
}

// ── Allow Enter key to trigger conversion ─────────────
eastingInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') convert(); });
northingInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') convert(); });
