# Nelios assessment — WP + Next.js (Docker)

**URLs:** Frontend http://localhost:3000 · WP http://localhost:8080
**WP admin:** http://localhost:8080/wp-admin · **admin** / **adminadmin123** — complete the WP installer on first visit (use these credentials), then activate **Nelios Items** under Plugins.

```bash
cp .env.example .env
docker compose up --build
```

```bash
docker compose down
```

```bash
docker compose down -v   # reset: drops MySQL + WP volumes
```

`wordpress/plugins/nelios-items` = CPT + REST · `nextjs` = App Router UI · Details: `plan.md`.

## Stack
- WordPress (headless CMS) με custom post type για travel packages
- Next.js 15 App Router με Tailwind CSS v4
- MySQL 8
- Docker Compose