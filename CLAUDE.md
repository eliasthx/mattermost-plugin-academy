# mattermost-plugin-academy — working notes

Fork of `esethna/mattermost-plugin-academy`. Mattermost plugin (`com.mattermost.academy`) serving
interactive learning guides at `/academy`, plus a `/learn` slash command.

Remotes: `origin` → `eliasthx/...`, `upstream` → `esethna/...`

## Where things stand

**`master`** — at upstream v0.3.0 (`8bd21ea`), plus uncommitted work: the `capture/` harness,
a `make capture` target, and two `.gitignore` lines.

**`scene-media`** (parked, one commit) — replaces all 16 static step SVGs with themed inline SVG
"scenes" rendered from shared primitives, with callouts declared as data. Built against v0.2.0 and
**not yet rebased onto v0.3.0**. Deliberately parked, not abandoned: the capture work needs two
pieces of it (see below).

## Current task: Playwright screenshot capture

Goal: replace hand-drawn step art with real captures of the product. Full design rationale,
including why this was originally deferred and what the measured tradeoffs were, is in
`.dev/playwright-plan-alternative.md`. `capture/README.md` documents the harness itself.

Target: **Mattermost Basics** first (first in the catalog, 7 modules / 36 steps, currently zero
screenshots, and needs no plugins). Then AI Quick Start, which needs the Agents plugin installed
and its AI service mocked for deterministic replies.

### Status

**Mattermost Basics is done.** 23 shots capture cleanly and byte-identically across runs, and all
23 are wired into `mattermost_basics.ts` and deployed. 11 of the guide's 34 steps have no art —
see below.

- Token auth (`MM_ADMIN_TOKEN`), and the system-admin check
- Seeding: Northwind team, 3 fixture users, 6 channels (one private), a DM, a 7-reply thread, a
  draft, pinned/saved/reacted fixtures — all idempotent *and reconciled*, so moving a fixture in
  `seed.js` un-does it on the old post rather than leaving both decorated
- Guards: localhost-only, placeholder/bracketed credential rejection, blank-capture rejection,
  and an admin-identity check (below)
- Captures run as a **fixture user** (`CAPTURE_AS` in `seed.js`), not the admin

### Steps with no art, and why

- **Composing → "Schedule a message for later"** and **"Request an acknowledgement"**: not
  capturable on this server. `ScheduledPosts` and `PostAcknowledgements` are absent from
  `/api/v4/config/client`; scheduled posts require `license.IsLicensed === 'true'` and this is
  an unlicensed Team Edition build. Needs a licensed server.
- **Composing → "Send persistent notifications"**: config allows it, but it hangs off an Urgent
  message and was not worth a shot of its own next to `message-priority`.
- Concept-only steps where a screenshot adds nothing: "Know what notifies you by default",
  "Learn the three shortcuts you'll use constantly", "Type markdown directly" (it already has a
  syntax reference table under it), "Clear the backlog", "Control notifications thread by
  thread", "Mark a message unread", "Copy a permanent link", "Learn a handful of shortcuts".
  The last three are all the same message-actions menu that `message-actions-menu` already shows.

### If Chromium will not launch

`playwright install` hangs on this machine at the *extraction* step — it downloads the full
archive, then never unpacks it, leaving a ~432KB stub with `Chromium Framework` missing. The
launch then fails with SIGABRT or `Executable doesn't exist`, which looks like a corrupt download
but is not: the zip is intact in `$TMPDIR`. Unpack it by hand rather than re-downloading. Full
commands are in `capture/README.md` under "If Chromium will not launch". Headless runs need the
separate `chromium_headless_shell-<build>` package unpacked the same way. Fallback:
`PW_CHANNEL=chrome make capture`.

### Run it

```bash
export MM_SERVICESETTINGS_SITEURL=http://localhost:8065
export MM_ADMIN_TOKEN=...        # Profile → Security → Personal Access Tokens
make capture ARGS=--headed
```

Never pass credentials as `<bracketed>` values — `<` is shell redirection and `$NAME` expands
before the script sees it. The script rejects such values with an explanation.

## Hard constraints

- **Captures run against localhost only.** Enforced in `capture.js`. Output ships inside an
  Apache-2.0 plugin, so no real user, channel, or message content may end up in a screenshot.
  Fixtures in `capture/seed.js` are entirely invented. A populated demo server is fine as a
  *visual reference*; it is not a capture source.
- **The capturing account must not appear in the output.** This is easy to violate without
  noticing: channel intros read "created by \<admin\>" and join messages read "\<admin\> added
  you to the channel", and both sit at the top of a channel's history where a shot of the
  message list lands by default. Three things keep it out: captures run as a fixture user, the
  seed deletes system join messages and seeds enough history to push the intro out of frame, and
  `assertNoAdminIdentity` in `capture.js` fails any shot whose clipped, unoccluded region
  contains the admin's username. Do not weaken the last one — it is the only automatic check.
- **Step art is framed for the guide's renderer, not for the screen.** `.academy-step__media img`
  caps rendered height (480px) and scales width to match, so empty space at the bottom of a
  capture costs rendered *width*. Give tall clips a `maxHeight` trimmed to the content's own
  extent. A full-height sidebar shipped once at 114px wide, too narrow to read.
- **Do not run `npm install` in `capture/` or `webapp/` from a Linux environment.** Both
  `node_modules` trees live in a folder shared with macOS and hold darwin-arm64 binaries
  (`sharp`, Playwright). Installing from Linux overwrites them and breaks local runs.
- `webapp/src/manifest.ts` and `server/manifest.go` are generated by `make apply` (Go). Without
  them `tsc` and webpack fail on `Cannot find module 'manifest'`. `.dev/manifest-webapp.js` is a
  Node stand-in for the webapp half, for environments without Go.

## Known pre-existing issues (not ours)

- `npm run lint` fails — `eslint` is not a devDependency in `webapp/package.json`, only
  `@mattermost/eslint-plugin`. So `make check-style` cannot run lint on a fresh clone.
- Two typecheck failures on pristine v0.3.0: a missing `minutes` in `content/availability.test.ts`
  and a store-type mismatch in `index.tsx`. `make deploy` does not typecheck, so they do not block
  deploys, but `make check-style` fails.
- Conditional React hooks and a double blank line in `components/academy/module_page.tsx`.

## What the parked branch still owes the capture work

Two pieces of `scene-media` are prerequisites for captures being more than a one-theme
proof-of-concept, so the branches are not alternatives:

1. **Theme resolver.** v0.3.0 renders media as a bare `<img>`, which cannot adapt to the user's
   theme. Captures are currently denim-only because capturing five themes before the renderer can
   choose between them would only add unused binaries.
2. **Annotation overlay.** Callout arrows and highlight rings belong over the image as data, not
   drawn into it — otherwise every copy edit or translation forces a recapture.

`scene-media` also keeps `StepMedia` a discriminated union, which is where a `capture` variant
would attach.

## Layout

| Path | Purpose |
| --- | --- |
| `capture/` | Playwright capture harness (`mm.js` API client, `seed.js` fixtures, `shots.js` shot list, `capture.js` driver) |
| `webapp/src/content/` | `types.ts`, `index.ts` (registry, gating, URL helpers), `guides/*.ts` (8 guides) |
| `webapp/src/components/academy/` | Catalog, guide layout, `module_page.tsx`, `module_blocks.tsx` (renders step media) |
| `public/guides/assets/<guideId>/` | Step art, served at `/plugins/com.mattermost.academy/public/...` |
| `server/` | `/learn` command, progress API, access control, config |
| `.dev/` | Untracked notes: `LOCAL_SETUP.md`, `playwright-plan-alternative.md`, `manifest-webapp.js` |

## Server and deploy

Local dev server: `cd ~/Projects/mattermost/server && make run` (use `make run`, not
`run-server` — the latter never builds the webapp and every page 500s). Details and gotchas in
`.dev/LOCAL_SETUP.md`.

Deploy: `make deploy`. Plugin uploads must be enabled, and `pluginctl` authenticates over the
local-mode socket so `MM_ADMIN_*` is ignored locally.

**v0.3.0 gates guides on installed plugins** — AI Quick Start needs `mattermost-ai`, Boards needs
`focalboard`, Playbooks needs `playbooks`. Four of eight guides are hidden on a vanilla server.
Enable **System Console → Plugins → Mattermost Academy → Access → Test Mode** to see them all.
