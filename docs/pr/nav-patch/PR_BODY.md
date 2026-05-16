## Summary

Desktop header polish: nav columns align as one block (label + PRÓXIMAMENTE), BOXEADORES first, SVG logo hover draw, underline hover on fine pointer only, frosted blur via inline `backdrop-saturate` / `backdrop-contrast`. Mobile menu stays card-style (no underline).

## Nav alignment

| Before | After |
| --- | --- |
| Single flex row; pills absolutely positioned; BOXEADORES after COMBATES | Three equal columns (`items-stretch`); label + pill stack with `gap-1` |
| Labels misaligned vs logo / pill rows | Column centers line up; BOXEADORES vertically centered in the same height as COMBATES + pill |
| — | Playwright asserts column height + center Y (±4px) |

**Before:** `docs/pr/nav-patch/before/screenshots/01-header-default.png`  
**After:** `docs/pr/nav-patch/after/screenshots/01-header-default.png`

## Logo hover (after only)

Replaces rotating `<img>` with `LogoHomeLink` (Motion): mask reveals OKLCH gradient along the X path; trace stroke on hover; holds while hovered; reverses on leave. `prefers-reduced-motion` → static cream fill.

**Hover:** `03-logo-hover.png` · **Video:** `after/videos/header-demo.webm`

## Nav underline (desktop, fine pointer only)

- 6px gap (`-bottom-1.5`) under label  
- 150ms transform, **125ms delay** on hover in (no delay on hover out)  
- Not used on mobile menu (tap cards + `active:` only)

**Hover:** `04-boxeadores-hover.png`

## Blur / glass

No shared utilities — existing `backdrop-blur-*` plus `backdrop-saturate-150 backdrop-contrast-125` on the same elements (header scrolled, menu, play chips, etc.).

## Test plan

- [ ] `pnpm test:e2e` — alignment spec  
- [ ] Desktop: hover logo + BOXEADORES underline  
- [ ] Mobile: menu open, no underline on links  
- [ ] Scroll header → frosted bar  

## Assets

| | Screenshots | Video |
| --- | --- | --- |
| Before (`30adca4e`) | `docs/pr/nav-patch/before/screenshots/` | `before/videos/header-demo.webm` |
| After (this branch) | `docs/pr/nav-patch/after/screenshots/` | `after/videos/header-demo.webm` |

Captured with `pnpm capture:pr` (Playwright; plain scroll/hover, no effects). Install `ffmpeg` locally to convert webm → mp4 if needed.
