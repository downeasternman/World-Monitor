const express = require('express');

const app = express();
const PORT = process.env.PORT || 4000;
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || 'http://localhost:8080')
  .split(',')
  .map(o => o.trim())
  .filter(Boolean);

// Simple CORS middleware
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin && (ALLOWED_ORIGINS.length === 0 || ALLOWED_ORIGINS.includes(origin))) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  res.header('Vary', 'Origin');
  res.header('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});

function isValidTarget(url) {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

app.get('/proxy', async (req, res) => {
  const target = req.query.url;
  if (!target || !isValidTarget(target)) {
    return res.status(400).json({ error: 'Invalid or missing url parameter' });
  }

  try {
    const controller = new AbortController();
    const timeoutMs = Number(process.env.UPSTREAM_TIMEOUT_MS || 10000);
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    const upstream = await fetch(target, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'WorldMonitorProxy/1.0 (+https://github.com/downeasternman/World-Monitor)'
      }
    });

    clearTimeout(timeout);

    if (!upstream.ok) {
      const text = await upstream.text().catch(() => '');
      return res.status(502).json({
        error: 'Upstream response not OK',
        status: upstream.status,
        bodyPreview: text.slice(0, 200)
      });
    }

    const body = await upstream.text();
    res.set('Content-Type', 'text/xml; charset=utf-8');
    return res.send(body);
  } catch (err) {
    if (err.name === 'AbortError') {
      return res.status(504).json({ error: 'Upstream timeout' });
    }
    return res.status(502).json({ error: 'Upstream fetch failed', detail: err.message || String(err) });
  }
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`World Monitor RSS proxy listening on http://localhost:${PORT}`);
});

