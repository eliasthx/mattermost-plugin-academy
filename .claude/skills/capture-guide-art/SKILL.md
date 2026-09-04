---
name: capture-guide-art
description: Capture or refresh the step screenshots for a Mattermost Academy guide using the Playwright harness in capture/. Use when a guide's steps have no images, when replacing hand-drawn SVG art with real captures of the product, when re-capturing after a Mattermost UI change, or when adding a new guide that needs art. Covers local fixture-based captures and --remote captures for licensed products such as Playbooks.
---

# Capturing guide art

The harness in `capture/` seeds a local Mattermost dev server with invented fixtures, drives
Playwright through a declarative shot list, and writes clipped WebP files into
`public/guides/assets/<guideId>/`. This skill is the procedure and the judgment around it.

`capture/README.md` is the reference — shot API, verified selectors, the determinism list, the
Chromium repair. Read it rather than restating it. This file is about *what to do in what order*
and *what goes wrong*.

## Before writing any shots: triage

Most wasted effort in this harness comes from building a shot that could never have worked. Check
these first.

**Is the step worth a screenshot?** Not every step is. Skip steps that are pure concept ("know
what notifies you by default"), keyboard-only ("learn the three shortcuts"), or already served by
another shot's screen. A guide where four adjacent steps show the same picture reads as padding.
Aim for: *does an image teach something the sentence cannot?*

**Can the block even hold an image?** Only `Step` has a `media` field. `ChecklistItem` does not —
`webapp/src/content/types.ts`. A checklist item's title and description look identical to a step's
in the content file, so title-keyed wiring will match it and then fail to typecheck. Check the
block type before promising art for it.

**Is the feature available on this server?** Read the client config, not the docs:

```bash
curl -s -H "Authorization: Bearer $MM_ADMIN_TOKEN" \
  "$MM_SERVICESETTINGS_SITEURL/api/v4/config/client?format=old" | python3 -m json.tool | grep -i <feature>
```

A flag that is *absent* is off. Known unavailable on an unlicensed server: `ScheduledPosts`
(requires `license.IsLicensed`), `PostAcknowledgements`. `PostPriority` *is* available.

**Is the guide plugin-gated?** `webapp/src/content/plugins.ts` maps the ids. The plugin must be
installed *and actually start*: Playbooks exits with "this plugin requires a professional license
or higher" on an unlicensed server, so no version of it runs locally. Those guides need
`--remote` (below).

**Is it an admin-audience guide?** Then a fixture user cannot see it, and verification needs an
admin session plus Academy Test Mode:

```bash
# testMode lives *inside* useraccessconfig, not at the top level
# PluginSettings.Plugins["com.mattermost.academy"].useraccessconfig.testMode = true
```

## Local captures

1. **Add fixtures** if the shot needs content that does not exist — `capture/seed.js`, or a
   `fixture_*.js` module for anything substantial (see `fixture_files.js`, `fixture_boards.js`).
   Fixtures must be **idempotent and reconciled**: if a shot's fixture moves from one message to
   another, the seed has to *un-do* it on the old one. Pins, saves and reactions all persist
   server-side, and a stale "Pinned • Saved" banner is exactly the kind of thing that quietly
   ends up in shipped art.

2. **Write the shot** in `capture/shots.js`. Prefer role and text locators for anything a user
   clicks; reserve structural selectors for `clip`. Every `setup` that navigates must end with
   `settle(page)`.

3. **Run it alone first**, which is much faster than the whole list:

   ```bash
   make capture ARGS=--only=<shot-id>
   make capture ARGS="--only=<shot-id> --keep-png"   # PNGs land in capture/png/ (gitignored)
   ```

   On failure, read `capture/failures/<shot>.png` before changing the selector. It usually shows
   the real problem — a tour dialog, an unbooted app, the wrong tab.

4. **Then run the whole list.** Shots that pass alone can still fail together: the formatting
   shots type into a channel's composer, server-synced drafts keep that text across page loads,
   and a later shot inherits it. Order-dependent breakage only shows up in a full run.

## Remote captures, for licensed products

```bash
export MM_REMOTE_URL=https://your-test-server.example.com
export MM_REMOTE_TOKEN=...          # Profile → Security → Personal Access Tokens
make capture ARGS=--remote
```

Mark those shots `source: 'remote'`. Remote and local sets are mutually exclusive — a fixture
shot cannot find its channels on another server, and a remote shot has nothing to match locally.

**Nothing is seeded in this mode, by construction.** Seeding lives in the local branch of
`capture.js` and is never reached. Do not "fix" that by calling `seed()` from the remote path:
`seed.js` creates users, channels and posts, and pointing it at a shared server writes fixture
clutter into a workspace we do not own.

Remote runs get a fresh browser context per shot and one retry, because reusing a page across a
long remote run degrades — the first five or six shots land and everything after them times out
on content that loaded fine earlier.

## Framing: the part that decides whether the art is any good

`.academy-step__media img` caps rendered height (480px) and scales width to match. **Empty space
at the bottom of a capture costs rendered width.** A full-height sidebar is 264×850 but its
content ends around 550; shipping the whole element rendered it 114px wide, too narrow to read.

- Give tall clips a `maxHeight` **measured** against the content, and cut at a natural boundary
  (a category edge) rather than through one.
- Panes that anchor content to the *bottom* — the thread viewer, the Agents pane — photograph as
  an empty rectangle if you clip from the top. Mark the inner container instead.
- Open menus are portalled to `<body>`, so they are not inside the element they belong to. Use an
  array `clip` for the union, and `all: true` when a submenu adds a second popover.
- Always look at the result at the size the guide renders it, not at full size. A shot can pass
  every check and still be unreadable in place.

## Wiring and verification

```bash
node capture/wire_media.mjs <guide-id>     # inserts media blocks, keyed on step title
```

Alt text is read out of `shots.js` so the capture and the guide cannot drift. Add the guide's
step-title → shot-id map to `GUIDES` in that file first.

Then:

```bash
make deploy
```

Verify **in-product**, not just that files exist: every image loads, none collapsed, all centred.
Check `tsc` shows only the failures already on `master`, and that jest still passes. Confirm no
asset 404s. An unused `.webp` in the asset tree means a mapping is missing; a missing file means a
mapping is wrong.

Finally, run the capture twice and compare hashes. Runs are visually identical and almost always
byte-identical; the exception is Chromium rasterization occasionally moving **one** pixel by
**1/255**, which is invisible but changes the hash. Do not chase that — the WebP encoder is
deterministic.

## The guards, and why not to weaken them

Three checks in `capture.js` exist because each one caught a real defect that had already shipped
or was about to:

- **Localhost only** for seeded runs. The output goes into an Apache-2.0 plugin.
- **`assertNotBlank`** rejects a near-uniform capture. A shot of the app's boot overlay reports
  success like any other, and a blank `sidebar-overview.webp` shipped that way once.
- **`assertNoOperatorIdentity`** rejects the machine hostname, and on local runs the admin
  username. Channel intros say "created by \<admin\>", join messages say "\<admin\> added you to
  the channel", and About Mattermost prints `Hostname: <your-machine>.local` a few lines under the
  version. All three sit exactly where a shot lands by default.

If a guard fires, it is usually right. Fix the shot — crop tighter, seed more history so the
intro scrolls out of frame — rather than the guard.

## Common failures

| Symptom | Cause |
| --- | --- |
| Capture is a blank hexagon wash | `#initialPageLoadingScreen` overlays the mounted app; `settle()` waits it out |
| Click times out on a visible element | It is `0×0` until hovered — category "…" buttons need their *header* hovered, not the group |
| Whole app in frame instead of a dialog | `#browseChannelsModal` is a full-viewport wrapper; `.modal-content` is the card |
| Menu missing from a menu shot | Menus are MuiPopover, portalled outside the clipped element |
| Sidebar clip 40px short | The notification-permission bar; the context must grant `notifications` |
| Shot differs run to run | An unhidden relative timestamp, or drifting presence — pin it in the seed |
| `playwright install` leaves a 432KB stub | Its extract step hangs; unpack the intact zip from `$TMPDIR` by hand (README) |
| Passes alone, fails in a full run | State inherited from an earlier shot — usually a server-synced draft |
