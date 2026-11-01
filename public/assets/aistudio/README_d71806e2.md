# FairHire AI (scaffold v0.1)
Deployable first slice: web + API + Postgres behind Caddy, CI/CD to a VPS, and an Android (TWA) wrapper pipeline.
NOT yet implemented: auth, RLS, uploads, parser sandbox, AI pipeline (see docs Part B). This scaffold exists so the
*delivery path* (build, scan, deploy, HTTPS, Play Store) works from day one.

Local:  cp .env.example .env && docker compose -f docker-compose.prod.yml up --build   (uses localhost, no TLS)
Server: scp scripts/bootstrap-server.sh root@HOST && run it, then push to main (see .github/workflows/ci-cd.yml)
Android: see android/ and .github/workflows/android-release.yml
All scripts are untested templates: run them on a throwaway server first.
