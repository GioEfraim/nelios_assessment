# Nelios Assessment — Headless WordPress + Next.js

A headless WordPress + Next.js travel packages listing page, built with Docker.

---

## URLs

| Service | URL |
|---|---|
| Frontend | http://localhost:3000 |
| WordPress | http://localhost:8080 |
| WP Admin | http://localhost:8080/wp-admin |

**WP Credentials:** `admin` / `adminadmin123`

---

## Quick Start

The repo ships with a pre-populated database and media — no manual WP setup needed.

```bash
# Start
docker compose up --build

# Stop
docker compose down

# Reset (Warning: wipes all data)
docker compose down -v
```

---

## Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 15 (App Router) |
| Styling | Tailwind CSS v4 |
| CMS | WordPress (headless) |
| Database | MySQL 8 |
| Infrastructure | Docker Compose |

---

## Features

- Custom post type `nelios_item` with meta fields (price, duration, location, hotel stars)
- REST API via WordPress (`/wp-json/wp/v2/items`)
- Filtering by price range, hotel stars, and duration
- Responsive layout (mobile, tablet, desktop)
- Empty state when no results match filters
- Seed data included — works out of the box