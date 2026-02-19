// ── Dubai DLTM Projection Definition ──────────────────
const DUBAI_DLTM =
    '+proj=tmerc +lat_0=0 +lon_0=55.3333333333333 +k=1 +x_0=500000 +y_0=0 +datum=WGS84 +units=m +no_defs';
const WGS84 = 'EPSG:4326'; // standard lat/lon

// ── State ─────────────────────────────────────────────
let mode = 'dltm-to-gps';
let currentLat = null;
let currentLng = null;

// ── DOM refs ──────────────────────────────────────────
const input1 = document.getElementById('input1');
const input2 = document.getElementById('input2');
const label1 = document.getElementById('label1');
const label2 = document.getElementById('label2');
const result1El = document.getElementById('result1');
const result2El = document.getElementById('result2');
const resultLabel1 = document.getElementById('result-label1');
const resultLabel2 = document.getElementById('result-label2');
const resultsEl = document.getElementById('results');
const errorEl = document.getElementById('error');
const btnMaps = document.getElementById('btn-maps');
const btnWhatsApp = document.getElementById('btn-whatsapp');
const utmOptionsEl = document.getElementById('utm-options');
const utmZoneInput = document.getElementById('utm-zone');
const utmHemiSelect = document.getElementById('utm-hemi');

// Mode buttons
const modeBtns = {
    'dltm-to-gps': document.getElementById('mode-dltm-to-gps'),
    'gps-to-dltm': document.getElementById('mode-gps-to-dltm'),
    'utm-to-gps': document.getElementById('mode-utm-to-gps'),
    'gps-to-utm': document.getElementById('mode-gps-to-utm'),
};

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

function resetResults() {
    result1El.textContent = '—';
    result2El.textContent = '—';
    resultsEl.classList.remove('visible');
    setActionButtons(false);
    clearError();
    currentLat = null;
    currentLng = null;
}

function isUtmMode() {
    return mode === 'utm-to-gps' || mode === 'gps-to-utm';
}

function getUtmProj() {
    const zone = parseInt(utmZoneInput.value, 10);
    const hemi = utmHemiSelect.value;
    if (isNaN(zone) || zone < 1 || zone > 60) return null;
    const south = hemi === 'south' ? ' +south' : '';
    return `+proj=utm +zone=${zone}${south} +datum=WGS84 +units=m +no_defs`;
}

// ── Mode Switching ────────────────────────────────────
function setMode(newMode) {
    if (mode === newMode) return;
    mode = newMode;

    // Toggle active button
    Object.entries(modeBtns).forEach(([key, btn]) => {
        btn.classList.toggle('active', key === mode);
    });

    // Show/hide UTM options
    if (isUtmMode()) {
        utmOptionsEl.classList.add('visible');
    } else {
        utmOptionsEl.classList.remove('visible');
    }

    // Swap labels and placeholders
    if (mode === 'dltm-to-gps') {
        label1.textContent = 'Easting (X)';
        label2.textContent = 'Northing (Y)';
        input1.placeholder = '500000';
        input2.placeholder = '2780000';
        resultLabel1.textContent = 'Latitude';
        resultLabel2.textContent = 'Longitude';
    } else if (mode === 'gps-to-dltm') {
        label1.textContent = 'Latitude';
        label2.textContent = 'Longitude';
        input1.placeholder = '25.2048';
        input2.placeholder = '55.2708';
        resultLabel1.textContent = 'Easting (X)';
        resultLabel2.textContent = 'Northing (Y)';
    } else if (mode === 'utm-to-gps') {
        label1.textContent = 'Easting (X)';
        label2.textContent = 'Northing (Y)';
        input1.placeholder = '326000';
        input2.placeholder = '2790000';
        resultLabel1.textContent = 'Latitude';
        resultLabel2.textContent = 'Longitude';
    } else if (mode === 'gps-to-utm') {
        label1.textContent = 'Latitude';
        label2.textContent = 'Longitude';
        input1.placeholder = '25.2048';
        input2.placeholder = '55.2708';
        resultLabel1.textContent = 'Easting (X)';
        resultLabel2.textContent = 'Northing (Y)';
    }

    // Clear previous inputs and results
    input1.value = '';
    input2.value = '';
    resetResults();
}

// ── Convert ───────────────────────────────────────────
function convert() {
    clearError();

    const raw1 = input1.value.trim();
    const raw2 = input2.value.trim();

    // Validate presence
    if (!raw1 || !raw2) {
        showError('Please enter both coordinate values.');
        resultsEl.classList.remove('visible');
        setActionButtons(false);
        return;
    }

    const val1 = parseFloat(raw1);
    const val2 = parseFloat(raw2);

    if (isNaN(val1) || isNaN(val2)) {
        showError('Coordinates must be valid numbers.');
        resultsEl.classList.remove('visible');
        setActionButtons(false);
        return;
    }

    try {
        if (mode === 'dltm-to-gps') {
            if (val1 < 0 || val2 < 0) {
                showError('Easting and Northing must be positive values.');
                resultsEl.classList.remove('visible');
                setActionButtons(false);
                return;
            }
            const [lng, lat] = proj4(DUBAI_DLTM, WGS84, [val1, val2]);
            currentLat = lat;
            currentLng = lng;
            result1El.textContent = lat.toFixed(8);
            result2El.textContent = lng.toFixed(8);

        } else if (mode === 'gps-to-dltm') {
            const [easting, northing] = proj4(WGS84, DUBAI_DLTM, [val2, val1]);
            currentLat = val1;
            currentLng = val2;
            result1El.textContent = easting.toFixed(4);
            result2El.textContent = northing.toFixed(4);

        } else if (mode === 'utm-to-gps') {
            const utmProj = getUtmProj();
            if (!utmProj) {
                showError('Please enter a valid UTM zone (1–60).');
                return;
            }
            if (val1 < 0 || val2 < 0) {
                showError('Easting and Northing must be positive values.');
                resultsEl.classList.remove('visible');
                setActionButtons(false);
                return;
            }
            const [lng, lat] = proj4(utmProj, WGS84, [val1, val2]);
            currentLat = lat;
            currentLng = lng;
            result1El.textContent = lat.toFixed(8);
            result2El.textContent = lng.toFixed(8);

        } else if (mode === 'gps-to-utm') {
            const utmProj = getUtmProj();
            if (!utmProj) {
                showError('Please enter a valid UTM zone (1–60).');
                return;
            }
            const [easting, northing] = proj4(WGS84, utmProj, [val2, val1]);
            currentLat = val1;
            currentLng = val2;
            result1El.textContent = easting.toFixed(4);
            result2El.textContent = northing.toFixed(4);
        }

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

    let message;
    if (mode === 'gps-to-dltm' || mode === 'gps-to-utm') {
        const easting = result1El.textContent;
        const northing = result2El.textContent;
        const coordType = mode === 'gps-to-dltm' ? 'DLTM' : 'UTM';
        message = `Here is the plot location:\n${coordType} Easting: ${easting}\n${coordType} Northing: ${northing}\nGoogle Maps: ${mapsUrl}`;
    } else {
        message = `Here is the plot location: ${mapsUrl}`;
    }

    const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
}

// ── Allow Enter key to trigger conversion ─────────────
input1.addEventListener('keydown', (e) => { if (e.key === 'Enter') convert(); });
input2.addEventListener('keydown', (e) => { if (e.key === 'Enter') convert(); });
