## Summary

Desktop header polish: nav columns align as one block (label + PRÓXIMAMENTE), BOXEADORES first, SVG logo hover draw, underline hover on fine pointer only, frosted blur via inline `backdrop-saturate` / `backdrop-contrast`. Mobile menu stays card-style (no underline).

## Nav alignment

| Before | After |
| --- | --- |
| Single flex row; pills absolutely positioned; BOXEADORES after COMBATES | Three equal columns (`items-stretch`); label + pill stack with `gap-1` |
| Labels misaligned vs logo / pill rows | Column centers line up; BOXEADORES vertically centered in the same height as COMBATES + pill |
| — | Playwright asserts column height + center Y (±4px) |

**Before:** `before/screenshots/01-header-default.png` · **After:** `after/screenshots/01-header-default.png`

## Logo hover

| | Before | After |
| --- | --- | --- |
| Mark | `03-logo-hover.png` (img) | `03-svg-logo-hover.png` + `03-logo-hover-framed.png` (9× zoom) |
| Video | `logo-hover.webm` | SVG path draw visible |

After: Motion mask + gradient trace on the X. Before: rotating `<img>`.

## Nav hover

| | Before | After |
| --- | --- | --- |
| Nav cell | `04-nav-hover.png` | `04-nav-underline-hover.png` (6× zoom) |
| Video | `nav-underline-hover.webm` | Underline expand visible |

After only: 6px underline gap, 150ms + 125ms delay; mobile menu has no underline.

## Blur / glass

`backdrop-blur-*` + `backdrop-saturate-150 backdrop-contrast-125` on the same node (Header DRY via `frost` const).

## Test plan

- [ ] `pnpm test:e2e` — alignment spec  
- [ ] Desktop: hover logo + BOXEADORES underline  
- [ ] Mobile: menu open, no underline on links  
- [ ] Scroll header → frosted bar  

## Assets

| | Screenshots | Video |
| --- | --- | --- |
| Before (`30adca4e`) | `before/screenshots/` | `before/videos/header-demo.webm` (+ `.mp4` if ffmpeg) |
| After (this branch) | `after/screenshots/` | `after/videos/logo-hover.webm`, `nav-underline-hover.webm` (+ `.mp4`) |

Captured with `pnpm capture:pr` (2560×1440, 2.5s hold, zoomed interaction tests). With `ffmpeg`: VP9 ~48 Mbit/s + H.264 ~40 Mbit/s for `logo-hover`, `nav-underline-hover`, and `overview` in each `videos/` folder.
