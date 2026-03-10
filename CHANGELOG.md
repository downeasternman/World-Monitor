## Changelog

### Unreleased
- **Add backend RSS proxy**: Introduced a small Node/Express service in `proxy/` that exposes `GET /proxy?url=...` and fetches RSS XML server-side with CORS enabled for `http://localhost:8080`.
- **Wire frontend to backend proxy**: Updated `index.html` to fetch all RSS feeds via `http://localhost:4000/proxy` instead of public CORS proxies, keeping sessionStorage caching.
- **Loading shimmer on map**: Added `loadingCountries` / `failedCountries` tracking and CSS animations so countries shimmer while feeds are in-flight and show a red outline when all feeds fail.
- **Inline console panel**: Embedded a small console in the left sidebar to show map initialization, proxy fetches, and feed errors without opening browser devtools.
- **Priority-country and duplicate handling fixes**: Fixed edge cases in `loadPriorityCountries` and `loadCountryFeeds` so empty wire feeds fall back correctly, articles are deduplicated, and regional loads don’t double-count national feeds.
- **Translation temporarily disabled**: Replaced the MyMemory translation calls with a no-op `translateHeadline` implementation to avoid rate limits and simplify debugging.

### v1.0.0
- Initial world headlines dashboard:
  - Three-panel dark UI (topics, D3 world map, article feed).
  - `sources_v2.json` loader and country feed index.
  - Topic classification, tier badges, and topic chips.
  - Basic world map rendering with country-level click → article feed.

