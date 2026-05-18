## Summary

Revision of the desktop nav bar: column alignment (label + **PRÓXIMAMENTE**), **boxeadores first**, SVG logo hover, underline on fine pointer only, frosted scroll bar. Mobile: menu open drives the logo mark into the same hover crest state.

Assets: [pr-nav-patch-visuals](https://github.com/tonyblu331/la-velada-web-oficial/releases/tag/pr-nav-patch-visuals) (2560×1440 video, full-width context strips).

---

## Nav order

**Boxeadores** is the only live link; combates and pronósticos are **próximamente**. Active item first matches how people scan the bar and avoids hiding the working destination between two disabled slots.

| Before | After |
| --- | --- |
| combates → boxeadores → pronósticos | boxeadores → combates → pronósticos |
| <img src="https://github.com/tonyblu331/la-velada-web-oficial/releases/download/pr-nav-patch-visuals/before-header-context.png" width="100%" alt="before header" /> | <img src="https://github.com/tonyblu331/la-velada-web-oficial/releases/download/pr-nav-patch-visuals/after-header-context.png" width="100%" alt="after header" /> |

2560×160 context strip.

---

## Alignment

Equal-height columns (`items-stretch`), label + pill stacked with `gap-1`, boxeadores vertically centered against the combates block. `header-nav-alignment` e2e (±4px).

---

## Logo hover

| Before | After |
| --- | --- |
| <img src="https://github.com/tonyblu331/la-velada-web-oficial/releases/download/pr-nav-patch-visuals/before-logo-hover.png" width="100%" alt="before logo hover" /> | <img src="https://github.com/tonyblu331/la-velada-web-oficial/releases/download/pr-nav-patch-visuals/after-logo-hover.png" width="100%" alt="after logo hover" /> |

| | Before | After |
| --- | --- | --- |
| Behaviour | rotating `<img>` | motion mask + gradient path on the X |
| Video | [before-logo-hover.webm](https://github.com/tonyblu331/la-velada-web-oficial/releases/download/pr-nav-patch-visuals/before-logo-hover.webm) | [after-logo-hover.webm](https://github.com/tonyblu331/la-velada-web-oficial/releases/download/pr-nav-patch-visuals/after-logo-hover.webm) |

### Mobile menu → logo crest

Opening the menu sets `data-mobile-menu-open` on the header; the logo animates to the same hover draw state.

<img src="https://github.com/tonyblu331/la-velada-web-oficial/releases/download/pr-nav-patch-visuals/after-header-menu-open.png" width="100%" alt="mobile menu open with logo crest" />

---

## Nav hover (desktop)

| Before | After |
| --- | --- |
| <img src="https://github.com/tonyblu331/la-velada-web-oficial/releases/download/pr-nav-patch-visuals/before-header-nav.png" width="100%" alt="before nav hover" /> | <img src="https://github.com/tonyblu331/la-velada-web-oficial/releases/download/pr-nav-patch-visuals/after-header-nav.png" width="100%" alt="after nav hover" /> |

Underline: 6px gap, 150ms + 125ms delay; fine pointer only — not on mobile menu links.

| | Before | After |
| --- | --- | --- |
| Video | [before-nav-hover.webm](https://github.com/tonyblu331/la-velada-web-oficial/releases/download/pr-nav-patch-visuals/before-nav-hover.webm) | [after-nav-hover.webm](https://github.com/tonyblu331/la-velada-web-oficial/releases/download/pr-nav-patch-visuals/after-nav-hover.webm) |

### Mobile menu panel

<img src="https://github.com/tonyblu331/la-velada-web-oficial/releases/download/pr-nav-patch-visuals/after-mobile-menu.png" width="420" alt="mobile menu" />

---

## Frost

`data-scrolled="true"` + `backdrop-blur-md` with `backdrop-saturate-150 backdrop-contrast-125` on the same node.

---

## Test plan

- [ ] `pnpm test:e2e`
- [ ] desktop: logo draw + boxeadores underline
- [ ] mobile: open menu → logo crest + no link underline
- [ ] scroll → frosted bar
