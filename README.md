## World Monitor — World News Dashboard

Single-page, client-side world news dashboard that visualizes live RSS headlines on a D3 world map, keyed by country and topic.

### Features

- **Three-panel layout**: topic filters (left), interactive world map (center), article feed (right).
- **D3 world map**: countries colored by dominant news topic; zoom and pan enabled.
- **RSS aggregation**: pulls all sources from `sources_v2.json` (countries, international, and single-topic beats).
- **Topic classification**: headlines classified into domains like military, politics, economy, climate, tech, etc.
- **On-page console**: inline log showing feed fetches, proxy fallbacks, and map/data initialization steps.
- **Session caching**: feed results and translations cached in `sessionStorage` to avoid refetching within a short window.

### Running Locally

Requirements: any modern browser and a simple static file server (no backend needed).

1. Open a terminal in the project directory:

   ```bash
   cd "C:\Users\mclancy\World Monitor"
   ```

2. Start a local HTTP server (pick one that works on your system):

   ```bash
   # Python 3
   python -m http.server 8080

   # or, on Windows if python is registered as py
   py -m http.server 8080
   ```

3. In your browser, open:

   ```text
   http://localhost:8080/index.html
   ```

Opening `index.html` directly via `file://` will fail because the app needs to `fetch("./sources_v2.json")` and call external RSS/translation APIs, which are blocked from `file://` origins by CORS.

### Data Source (`sources_v2.json`)

All news sources are defined in `sources_v2.json`, which includes:

- `countries`: per-country sources (national, sources, optional regions and metros).
- `international`: cross-border and industry feeds.
- `single_topic`: global beats (e.g., crypto, nuclear, organized crime, immigration).

The app never hardcodes RSS URLs; it always reads from this file and uses:

- `tier` (wire, independent, state, community, exile, foreign-funded, etc.).
- `bias` (left, center, right, state-narrative, etc.).
- `_meta` properties such as `name`, `rsf_rank`, and `language_default`.

### CORS and Proxies

The dashboard runs entirely in the browser, so RSS and some translation requests are proxied to avoid CORS issues:

- Primary: `https://api.allorigins.win/get?url=...` (JSON wrapper; returns `contents`).
- Fallback: `https://corsproxy.io/?...` (returns raw XML body).

If a feed fails on both proxies, it is logged in the inline console and quietly skipped; other feeds and countries continue to load.

### Development Notes

- No frameworks, no bundler, no build step — everything is in `index.html` (HTML, CSS, and JS inline).
- Map and UI are designed for a dark theme and desktop viewport.
- For debugging, use both:
  - The browser devtools console.
  - The on-page inline console in the left panel for a quick view of what the app is doing.

