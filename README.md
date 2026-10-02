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

The workflow publishes static files to the **`gh-pages`** branch. GitHub cannot enable Pages from Actions alone (`Get Pages site failed` / `Not Found` until you do this once):

1. Open [Settings → Pages](https://github.com/VesperRun/Junipers-Allergen-Index/settings/pages).
2. **Build and deployment → Source:** **Deploy from a branch**.
3. **Branch:** `gh-pages` · **Folder:** `/ (root)` · **Save**.
4. Push to `main` (or **Actions → Deploy GitHub Pages → Run workflow**).
5. Live: [vesperrun.github.io/Junipers-Allergen-Index/](https://vesperrun.github.io/Junipers-Allergen-Index/)

Private repos may need a paid plan for Pages; a **public** repo gets a free user site.

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

## License

**Proprietary — all rights reserved.** See [LICENSE](LICENSE). No use, copy, or distribution without written permission from the copyright holder.
