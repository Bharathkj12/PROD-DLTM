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
const btnShare = document.getElementById('btn-share');
const utmOptionsEl = document.getElementById('utm-options');
const utmZoneInput = document.getElementById('utm-zone');
const utmHemiSelect = document.getElementById('utm-hemi');
const sysStatus = document.getElementById('sys-status');
const sysStatusDot = sysStatus.querySelector('.status-dot');
const sysStatusText = document.getElementById('status-text');

function setSystemStatus(state) {
    if (!sysStatus || !sysStatusDot || !sysStatusText) return;
    sysStatus.className = 'sys-status ' + state;
    sysStatusDot.className = 'status-dot ' + state;
    if (state === 'online') {
        sysStatusText.textContent = 'SYS.ONLINE';
    } else if (state === 'calc') {
        sysStatusText.textContent = 'CALCULATING...';
    } else if (state === 'error') {
        sysStatusText.textContent = 'SYS.ERROR';
    }
}

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
    setSystemStatus('error');
}

function clearError() {
    errorEl.textContent = '';
    errorEl.classList.remove('visible');
}

function setActionButtons(enabled) {
    btnMaps.disabled = !enabled;
    btnWhatsApp.disabled = !enabled;
    btnShare.disabled = !enabled;
}

function resetResults() {
    result1El.textContent = '—';
    result2El.textContent = '—';
    resultsEl.classList.remove('visible');
    setActionButtons(false);
    clearError();
    currentLat = null;
    currentLng = null;
    setSystemStatus('online');
}

function isUtmMode() {
    return mode === 'utm-to-gps' || mode === 'gps-to-utm';
}

function getUtmProj() {
    const zone = Number.parseInt(utmZoneInput.value, 10);
    const hemi = utmHemiSelect.value;
    if (Number.isNaN(zone) || zone < 1 || zone > 60) return null;
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
    if (mode === 'dltm-to-gps' || mode === 'utm-to-gps') {
        label1.textContent = 'Easting (X)';
        label2.textContent = 'Northing (Y)';
        input1.placeholder = mode === 'dltm-to-gps' ? '500000' : '326000';
        input2.placeholder = mode === 'dltm-to-gps' ? '2780000' : '2790000';
        resultLabel1.textContent = 'Latitude';
        resultLabel2.textContent = 'Longitude';
    } else if (mode === 'gps-to-dltm' || mode === 'gps-to-utm') {
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

    // Show/hide GPS Lock button (only in Lat/Lon input modes)
    const btnGpsLock = document.getElementById('btn-gps-lock');
    if (mode === 'gps-to-dltm' || mode === 'gps-to-utm') {
        btnGpsLock.classList.remove('hidden');
    } else {
        btnGpsLock.classList.add('hidden');
    }
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

    const val1 = Number.parseFloat(raw1);
    const val2 = Number.parseFloat(raw2);

    if (Number.isNaN(val1) || Number.isNaN(val2)) {
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
        console.error("Conversion error:", err);
        showError('Conversion failed. Check your coordinates.');
        resultsEl.classList.remove('visible');
        setActionButtons(false);
    }
}

// ── GPS Lock (Get My Location) ────────────────────────
function gpsLock() {
    if (!navigator.geolocation) {
        showError('Geolocation not supported by your browser.');
        return;
    }

    const btnGpsLock = document.getElementById('btn-gps-lock');
    const gpsLockText = document.getElementById('gps-lock-text');

    // Enter acquiring state
    btnGpsLock.classList.add('acquiring');
    btnGpsLock.disabled = true;
    gpsLockText.textContent = 'PLOTTING...';
    setSystemStatus('calc');

    // Start number scramble animation on both inputs
    const scrambleInterval1 = startScramble(input1, 6);
    const scrambleInterval2 = startScramble(input2, 7);

    navigator.geolocation.getCurrentPosition(
        (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;

            // Let scramble run for a bit, then lock
            setTimeout(() => {
                clearInterval(scrambleInterval1);
                clearInterval(scrambleInterval2);

                // Final lock-in animation
                lockInValue(input1, lat.toFixed(8));
                lockInValue(input2, lon.toFixed(8));

                // Reset button state
                btnGpsLock.classList.remove('acquiring');
                btnGpsLock.disabled = false;
                gpsLockText.textContent = 'PLOTTED \u2713';
                setSystemStatus('online');

                setTimeout(() => {
                    gpsLockText.textContent = 'PLOT MY LOCATION';
                }, 2000);
            }, 500);
        },
        (err) => {
            clearInterval(scrambleInterval1);
            clearInterval(scrambleInterval2);
            input1.value = '';
            input2.value = '';
            btnGpsLock.classList.remove('acquiring');
            btnGpsLock.disabled = false;
            gpsLockText.textContent = 'PLOT MY LOCATION';
            showError('GPS lock failed: ' + err.message);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
}

function startScramble(inputEl, digits) {
    return setInterval(() => {
        let scrambled = '';
        for (let i = 0; i < digits; i++) {
            scrambled += Math.floor(Math.random() * 10);
            if (i === 1) scrambled += '.';
        }
        inputEl.value = scrambled;
    }, 40);
}

function lockInValue(inputEl, finalValue) {
    inputEl.value = finalValue;
    // Brief visual flash effect
    inputEl.style.borderColor = 'var(--accent-green)';
    inputEl.style.boxShadow = '0 0 8px rgba(37, 211, 102, 0.4)';
    setTimeout(() => {
        inputEl.style.borderColor = '';
        inputEl.style.boxShadow = '';
    }, 600);
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
        const lat = result1El.textContent;
        const lng = result2El.textContent;
        message = `Here is the plot location:\nLatitude: ${lat}\nLongitude: ${lng}\nGoogle Maps: ${mapsUrl}`;
    }

    const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
}

// ── Copy to Clipboard ─────────────────────────────────
function copyToClipboard(text) {
    // Try modern Clipboard API first
    if (navigator.clipboard?.writeText) {
        return navigator.clipboard.writeText(text).catch(() => fallbackCopy(text));
    }
    // Fallback for file:// or non-HTTPS contexts
    return fallbackCopy(text);
}

function fallbackCopy(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    try {
        document.execCommand('copy');
    } catch (e) {
        console.warn('Fallback copy failed', e);
    }
    textarea.remove();
    return Promise.resolve();
}

function copyResult(id) {
    const el = document.getElementById(id);
    const text = el.textContent;
    if (!text || text === '—') return;
    copyToClipboard(text).then(() => {
        const btn = el.closest('.result-value-wrapper').querySelector('.copy-btn');
        btn.classList.add('copied');
        setTimeout(() => btn.classList.remove('copied'), 1000);
    });
}

// ── Native Share ──────────────────────────────────────
function shareNative() {
    if (currentLat === null || currentLng === null) return;
    const mapsUrl = `https://www.google.com/maps?q=${currentLat},${currentLng}`;

    let text;
    if (mode === 'gps-to-dltm' || mode === 'gps-to-utm') {
        const easting = result1El.textContent;
        const northing = result2El.textContent;
        const coordType = mode === 'gps-to-dltm' ? 'DLTM' : 'UTM';
        text = `Here is the plot location:\n${coordType} Easting: ${easting}\n${coordType} Northing: ${northing}\nGoogle Maps: ${mapsUrl}`;
    } else {
        const lat = result1El.textContent;
        const lng = result2El.textContent;
        text = `Here is the plot location:\nLatitude: ${lat}\nLongitude: ${lng}\nGoogle Maps: ${mapsUrl}`;
    }

    if (navigator.share) {
        navigator.share({ title: 'SmartCoords Location', text: text }).catch((err) => { console.warn("Share failed:", err); });
    } else {
        // Fallback: copy to clipboard
        copyToClipboard(text).then(() => {
            alert('Link copied to clipboard!');
        });
    }
}

// ── Allow Enter key to trigger conversion ─────────────
input1.addEventListener('keydown', (e) => { if (e.key === 'Enter') convert(); });
input2.addEventListener('keydown', (e) => { if (e.key === 'Enter') convert(); });

// ── Theme Toggle ──────────────────────────────────────
const iconSun = document.getElementById('icon-sun');
const iconMoon = document.getElementById('icon-moon');
const themeColorMeta = document.querySelector('meta[name="theme-color"]');

function applyTheme(theme) {
    document.documentElement.dataset.theme = theme;
    document.body.dataset.theme = theme;
    if (theme === 'light') {
        iconSun.style.display = 'none';
        iconMoon.style.display = 'block';
        if (themeColorMeta) themeColorMeta.content = '#F0EDE6';
    } else {
        iconSun.style.display = 'block';
        iconMoon.style.display = 'none';
        if (themeColorMeta) themeColorMeta.content = '#0A0A0A';
    }
}

function toggleTheme() {
    const current = document.documentElement.dataset.theme || 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    localStorage.setItem('smartcoords-theme', next);
}

// Initialize theme from localStorage
(function initTheme() {
    const saved = localStorage.getItem('smartcoords-theme') || 'light';
    applyTheme(saved);
})();

// ── Session-Based Visitor Count (JSON/sessionStorage) ─
(function initVisitorCount() {
    const STORAGE_KEY = 'smartcoords-visits';
    const SESSION_FLAG = 'smartcoords-session-active';
    let visitData;

    try {
        visitData = JSON.parse(localStorage.getItem(STORAGE_KEY));
    } catch (e) {
        console.warn("Failed to parse visit data:", e);
        visitData = null;
    }

    if (!visitData || typeof visitData.visits !== 'number') {
        visitData = { visits: 1, startedAt: new Date().toISOString() };
    } else if (!sessionStorage.getItem(SESSION_FLAG)) {
        // Only increment if this is a new session
        visitData.visits += 1;
        visitData.lastVisitAt = new Date().toISOString();
    }

    // Persist count to localStorage, mark session as active
    localStorage.setItem(STORAGE_KEY, JSON.stringify(visitData));
    sessionStorage.setItem(SESSION_FLAG, 'true');

    const el = document.getElementById('visitor-count');
    if (el) {
        el.textContent = `SESSION: ${visitData.visits}`;
    }
})();

// ── Conversion History (The Manifest) ─────────────────
const HISTORY_KEY = 'smartcoords-history';
const MAX_HISTORY = 10;
const historyTbody = document.getElementById('history-tbody');
const historyEmpty = document.getElementById('history-empty');
const historyTableWrapper = document.getElementById('history-table-wrapper');
const historyCountEl = document.getElementById('history-count');

function getHistory() {
    try {
        return JSON.parse(sessionStorage.getItem(HISTORY_KEY)) || [];
    } catch (e) {
        console.warn("Failed to parse history data:", e);
        return [];
    }
}

function saveHistory(entries) {
    sessionStorage.setItem(HISTORY_KEY, JSON.stringify(entries));
}

function addHistoryEntry(modeLabel, inputText, outputText) {
    const entries = getHistory();
    entries.unshift({ mode: modeLabel, input: inputText, output: outputText, ts: Date.now() });
    if (entries.length > MAX_HISTORY) entries.length = MAX_HISTORY;
    saveHistory(entries);
    renderHistory();
}

function clearHistory() {
    sessionStorage.removeItem(HISTORY_KEY);
    renderHistory();
}

function copyHistoryRow(idx) {
    const entries = getHistory();
    if (!entries[idx]) return;
    const e = entries[idx];
    const text = `${e.mode} | IN: ${e.input} | OUT: ${e.output}`;
    copyToClipboard(text).then(() => {
        const btn = document.querySelector(`[data-history-copy="${idx}"]`);
        if (btn) {
            btn.classList.add('copied');
            setTimeout(() => btn.classList.remove('copied'), 1000);
        }
    });
}

function copyCoordCell(cell, text) {
    copyToClipboard(text).then(() => {
        cell.classList.add('copied');
        setTimeout(() => cell.classList.remove('copied'), 800);
    });
}

function renderHistory() {
    const entries = getHistory();
    historyCountEl.textContent = `${entries.length} / ${MAX_HISTORY}`;

    if (entries.length === 0) {
        historyTableWrapper.style.display = 'none';
        historyEmpty.style.display = 'block';
        return;
    }

    historyTableWrapper.style.display = 'block';
    historyEmpty.style.display = 'none';

    const escapeHTML = (str) => String(str).replaceAll(/[&<>'"]/g,
        tag => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            "'": '&#39;',
            '"': '&quot;'
        }[tag] || tag)
    );

    historyTbody.innerHTML = entries.map((e, i) => `
        <tr>
            <td>${String(i + 1).padStart(2, '0')}</td>
            <td><span class="history-mode">${e.mode}</span></td>
            <td class="history-cell-copy" data-val="${escapeHTML(e.input)}" onclick="copyCoordCell(this, this.getAttribute('data-val'))" title="Tap to copy"><span class="history-coords">${escapeHTML(e.input)}</span></td>
            <td class="history-cell-copy" data-val="${escapeHTML(e.output)}" onclick="copyCoordCell(this, this.getAttribute('data-val'))" title="Tap to copy"><span class="history-coords">${escapeHTML(e.output)}</span></td>
            <td>
                <button class="history-row-copy" data-history-copy="${i}" onclick="copyHistoryRow(${i})" title="Copy row">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                    </svg>
                </button>
            </td>
        </tr>
    `).join('');
}

// Initialize history on load
renderHistory();

// ── Hook into convert() to log history ────────────────
const _originalConvert = convert;
convert = function () {
    setSystemStatus('calc');

    // Tiny delay to ensure the 'calc' pulse animation renders
    setTimeout(() => {
        _originalConvert();

        // Only log if conversion was successful (results visible)
        if (!resultsEl.classList.contains('visible')) return;

        setSystemStatus('online');

        const modeLabels = {
            'dltm-to-gps': 'DLTM→Lat/Lon',
            'gps-to-dltm': 'Lat/Lon→DLTM',
            'utm-to-gps': 'UTM→Lat/Lon',
            'gps-to-utm': 'Lat/Lon→UTM',
        };

        const inputText = `${input1.value}, ${input2.value}`;
        const outputText = `${result1El.textContent}, ${result2El.textContent}`;
        addHistoryEntry(modeLabels[mode] || mode, inputText, outputText);
    }, 400);
}
