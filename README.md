# Mattermost Academy

A Mattermost plugin that provides interactive learning guides as a full-screen product (like Boards / Playbooks / Weave).

## Features

- **Academy** entry in the product switcher
- App Bar / channel header button opens the full-screen Academy product
- `/learn` slash command — posts an ephemeral link to `/academy`
- React catalog, guides, and lessons with real URL routing under `/academy`
- Profile badges and admin completion reporting

## Requirements

- Mattermost server **6.2.1+**
- Go **1.25+**
- Node **16+** / npm **8+**

## Develop & deploy

```bash
export MM_SERVICESETTINGS_SITEURL=http://localhost:8065
export MM_ADMIN_USERNAME=<admin>
export MM_ADMIN_PASSWORD=<password>
make deploy
```

Hard-refresh the browser after deploy.

Build only:

```bash
make
```

Produces `dist/com.mattermost.academy-*.tar.gz` for manual upload in **System Console → Plugins**.

## Project layout

| Path | Purpose |
|------|---------|
| `webapp/` | Product UI, catalog/guides/lessons, badges, admin sections |
| `webapp/src/content/` | Guide/module content (TypeScript) |
| `public/guides/assets/` | Lesson images and UI mock SVGs |
| `server/command/` | `/learn` slash command |
| `server/progress/` | Progress / completion API |
| `plugin.json` | Plugin id, name, and bundle paths |

Plugin id: `com.mattermost.academy`

## Product routes

| Path | Page |
|------|------|
| `/academy` | Guide catalog |
| `/academy/guides/:guideId` | Redirect to first incomplete module |
| `/academy/guides/:guideId/modules/:moduleId` | Lesson |
| `/academy/guides/:guideId/done` | Completion / badge |
