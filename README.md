# Juniper’s Allergen Index

Single-page, broadcast-style allergen board for **Bexar** (left) and **Travis** (right) counties, Central Texas. UI is **CSS + type only** — no map images or county artwork.

**Repo:** [github.com/VesperRun/Junipers-Allergen-Index](https://github.com/VesperRun/Junipers-Allergen-Index)

**Live (after Pages is on):** [vesperrun.github.io/Junipers-Allergen-Index/](https://vesperrun.github.io/Junipers-Allergen-Index/)

**Subtitle:** Travis · Bexar

Standalone side project — informational glance at pollen levels, not medical advice. v1 uses **sample JSON** on the board; live feeds come later.

## Quick start

From this folder:

```powershell
python -m http.server 8080
```

Open [http://localhost:8080](http://localhost:8080). Or double-click [`serve.bat`](serve.bat). Do not open `index.html` via `file://` — the browser will block loading `data/latest.json`.

### GitHub Pages

1. Push `main` to GitHub.
2. Repo **Settings → Pages → Build and deployment → Source:** choose **GitHub Actions** (not “Deploy from a branch”). If this is skipped, the `Deploy GitHub Pages` workflow fails in email with “all jobs have failed.”
3. **Actions** tab → re-run **Deploy GitHub Pages** (or push again).
4. Site: [vesperrun.github.io/Junipers-Allergen-Index/](https://vesperrun.github.io/Junipers-Allergen-Index/)

## Edit the board

Change numbers and copy in [`data/latest.json`](data/latest.json). Refresh the page.

Each county block:

- `updated_at` — ISO 8601 (shown in America/Chicago)
- `note` — optional one-liner under the county name
- `allergens` — `level`: `Low` | `Moderate` | `High` | `Very high` | `No data`; `value` number or `null`; `unit` e.g. `index`

## Allergen rows (v1)

1. Mountain cedar (juniper)
2. Oak
3. Ragweed
4. Grass
5. Mold — sample file uses **No data** (no invented count)

Hemp/cannabis omitted until a citable source exists.

## Cedar season copy

December–February, a short seasonal line appears on the page (informational, not medical guidance). Off-season it stays hidden.

## Live data (later, not built)

Reasonable next step for US coverage: [Google Pollen API](https://developers.google.com/maps/documentation/pollen) at Austin + San Antonio coordinates, labeled **metro estimate**. Open-Meteo pollen is Europe-only. NAB station data is authoritative but not a simple public live feed.

When added: a small fetch script, `.env.example` for keys, cron every 6–24h, overwrite `data/latest.json`.

## Disclaimer

County-level estimates. Your neighborhood may differ. Not medical advice. Sample data is labeled on the page until live providers are wired.
