# Nelios assessment — WP + Next.js (Docker)

### **URLs:** Frontend http://localhost:3000 · WP http://localhost:8080 · WP admin http://localhost:8080/wp-admin
### **WP credentials:** User `admin` / Pass `adminadmin123`

## Installation

The repo ships with a pre-populated WordPress database (`wordpress/data.sql`) and media (`wordpress/uploads/`). On the **first** `docker compose up`, MySQL auto-imports the DB and the uploads are bind-mounted into WordPress — no WP installer step is needed.

```bash
docker compose up --build
```

Open http://localhost:3000 (frontend) or http://localhost:8080/wp-admin (login above).

Stop:

```bash
docker compose down
```

Full reset (drops DB + WP volumes, re-imports `data.sql` on next up):

```bash
docker compose down -v
```

> Note: `data.sql` only runs when the MySQL data volume is **empty** (first boot or after `down -v`). If you already started the stack before this change, run `docker compose down -v` once to trigger the import.

## Project layout
- `wordpress/plugins/nelios-items` — custom plugin (CPT + REST)
- `wordpress/data.sql` — seed database dump
- `wordpress/uploads/` — media library (shipped with the repo)
- `nextjs/` — Next.js 15 App Router UI

## Stack
- WordPress (headless CMS) με custom post type για travel packages
- Next.js 15 App Router με Tailwind CSS v4
- MySQL 8
- Docker Compose
