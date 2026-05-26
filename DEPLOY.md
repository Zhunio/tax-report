# Deploy To Coolify

1. Create new `Project`: `tax-report`
2. Create new `Resource`
3. Select `Private Repository (with GitHub App)`
4. Select GitHub App: `zhunio-coolify`
5. Select repo: `tax-report`
6. Set the `Configuration`:
  - Branch: `main`
  - Build Pack: `Docker Compose`
  - Docker Compose Location: `/docker-compose.yml`
7. In `General`, Set:
  - `Name`: `tax-report-api`
  - `Domain`: `https://tax-report.example.com`
9. Deploy

