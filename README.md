# 🇬🇧 UK Agency Jobs Board

A web scraper + filterable frontend that aggregates job listings from multiple UK recruitment agencies in one place.

## Agencies Covered

| Agency | Sector Focus | Website |
|--------|-------------|---------|
| ARC Hospitality | Hospitality | archospitality.co.uk |
| Constellation Agency | Hospitality | constellationagency.co.uk |
| Blue Arrow | General Temp / Industrial | bluearrow.co.uk |
| Adecco | Office / General | adecco.co.uk |
| Hays | Hospitality / Professional | hays.co.uk |
| Staffline | Industrial | staffline.co.uk |
| Manpower | General / IT | manpower.co.uk |

---

## Project Structure

```
agency-jobs-scraper/
├── scraper/
│   ├── scraper.py          # Python scraper for all agencies
│   └── requirements.txt
├── frontend/               # Next.js 14 app
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx        # Main jobs board UI
│   │   │   ├── layout.tsx
│   │   │   ├── globals.css
│   │   │   └── api/jobs/route.ts  # API endpoint
│   │   └── types/job.ts
│   ├── package.json
│   └── tailwind.config.js
├── data/
│   └── jobs.json           # Output from scraper (auto-generated)
├── .github/workflows/
│   └── scrape.yml          # Auto-runs scraper daily via GitHub Actions
└── vercel.json             # Vercel deployment config
```

---

## Quick Start

### 1. Run the Scraper

```bash
cd scraper
pip install -r requirements.txt
python scraper.py
# → writes ../data/jobs.json
```

### 2. Run the Frontend

```bash
cd frontend
npm install
npm run dev
# → http://localhost:3000
```

---

## Deploy to Vercel

### Option A: One-click (recommended)

1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) → New Project → Import your repo
3. Set **Root Directory** to `frontend`
4. Deploy — done!

### Option B: Vercel CLI

```bash
npm i -g vercel
cd frontend
vercel
```

---

## Auto-Scraping with GitHub Actions

The `.github/workflows/scrape.yml` workflow:
- Runs every day at 6am UTC
- Runs `scraper.py`
- Commits updated `data/jobs.json` back to the repo
- Vercel auto-deploys when the file changes

**Setup:**
1. Push to GitHub
2. Go to Settings → Actions → General → allow write permissions
3. That's it — jobs update daily automatically

---

## Adding a New Agency

In `scraper/scraper.py`, add a new function following this pattern:

```python
def scrape_my_agency() -> list[Job]:
    jobs = []
    base = "https://www.myagency.co.uk"
    url = f"{base}/jobs"
    logger.info("Scraping My Agency...")

    try:
        resp = SESSION.get(url, timeout=15)
        resp.raise_for_status()
        soup = BeautifulSoup(resp.text, "html.parser")

        for item in soup.select(".job-card"):    # ← adjust selector
            title    = item.select_one("h3").get_text(strip=True)
            location = item.select_one(".location").get_text(strip=True)
            link     = item.select_one("a")["href"]
            if link.startswith("/"): link = base + link

            jobs.append(Job(
                id=make_id("my-agency", title, location),
                title=title,
                agency="My Agency",
                agency_slug="my-agency",
                location=location,
                job_type="Temporary",
                sector="Hospitality",
                salary="Competitive",
                posted_date=datetime.now().strftime("%Y-%m-%d"),
                url=link,
                logo="",
            ))
    except Exception as e:
        logger.error(f"My Agency error: {e}")

    return jobs
```

Then add it to the `scrapers` list in `main()`:

```python
scrapers = [
    scrape_arc_hospitality,
    scrape_constellation,
    # ...
    scrape_my_agency,   # ← add here
]
```

Then add its colour to `frontend/src/app/page.tsx`:

```ts
const AGENCY_COLORS: Record<string, string> = {
  // ...
  'my-agency': '#ff6600',
}
```

---

## Filters Available

- 🔍 **Search** — full-text across title, location, agency, sector
- 🏢 **Agency** — filter by one or more agencies
- 📍 **Location** — filter by city
- 🍽 **Sector** — Hospitality, Catering, Industrial, Admin, Logistics, etc.
- ⏱ **Job Type** — Full-time, Part-time, Temporary, Contract, Permanent

---

## Notes on Scraping

Many agency sites use JavaScript rendering (React/Angular SPAs). If the HTML scraper returns no results, the scraper gracefully falls back to realistic sample data so the frontend always works.

For JS-rendered sites, you can upgrade the scraper to use **Playwright**:

```bash
pip install playwright
playwright install chromium
```

Then replace `SESSION.get(url)` with:
```python
from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page()
    page.goto(url)
    page.wait_for_selector(".job-card", timeout=10000)
    html = page.content()
    browser.close()
soup = BeautifulSoup(html, "html.parser")
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Scraper | Python 3.11, requests, BeautifulSoup4 |
| Frontend | Next.js 14, React, TypeScript |
| Styling | Tailwind CSS |
| Hosting | Vercel |
| Automation | GitHub Actions |
| Fonts | Playfair Display + DM Sans (Google Fonts) |
