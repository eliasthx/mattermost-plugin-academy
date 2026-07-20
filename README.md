# Mattermost Academy

A Mattermost plugin that opens interactive learning guides (starting with **AI Quick Start**) in an overlay inside Channels.

## Features

- **Mattermost Academy** button in the channel header / App Bar
- `/learn` slash command — posts an ephemeral link that opens the guide
- Full-bleed HTML learning modules served from `public/modules/`

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
| `webapp/` | App Bar button, overlay, iframe shell |
| `public/modules/` | Learning HTML modules |
| `server/command/` | `/learn` slash command |
| `plugin.json` | Plugin id, name, and bundle paths |

Plugin id: `com.mattermost.academy`
