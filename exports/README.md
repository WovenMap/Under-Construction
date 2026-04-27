# WovenMap · Logo Assets

The locked WovenMap brand mark, in every format you'll need.

## What's in this folder

```
svg/                       Master vector files — scale infinitely, edit in Figma/Illustrator
  wovenmap-mark-night.svg          The mark on midnight (champagne ink, soft haze)
  wovenmap-mark-day.svg            The mark on bone (rust ink, soft haze)
  wovenmap-mark-champagne.svg      Mark only · champagne · transparent
  wovenmap-mark-cream.svg          Mark only · cream · transparent (for dark surfaces)
  wovenmap-mark-ink.svg            Mark only · single ink · transparent (mono reproduction)
  wovenmap-lockup-night.svg        Horizontal lockup · night
  wovenmap-lockup-day.svg          Horizontal lockup · day
  wovenmap-lockup-stacked-night.svg
  wovenmap-lockup-stacked-day.svg

png/                       Rasters at 1×, 2×, 3×
  mark/                    256, 512, 1024, 2048 px (square)
  lockup/                  1×, 2×, 3× horizontal · 1×, 2× stacked

favicon/                   Browser & platform icons
  favicon.ico              Multi-resolution (16/32/48) — drop in site root
  favicon-{16,32}.png      Simplified mark (4-thread cardinal cross)
  favicon-{48,64,96,192,512}.png   Full mark
  favicon-*.svg            Source SVGs for each size
  apple-touch-icon.png     180×180, no rounding (iOS rounds for you)
  icon-maskable-512.png    Android adaptive icon · safe zone padding included

WovenMap-Brand.html        Single self-contained file — open in a browser, no install
```

## The locked logo

| Element | Spec |
|---|---|
| **Mark** | Canonical 8-thread starburst — 4 cardinal threads (N/E/S/W) longer than 4 diagonals, all bowed in the same rotational direction (slight clockwise pinwheel) |
| **Wordmark** | Inter, weight 200, Title case ("WovenMap"), letter-spacing −0.04em |
| **Color** | Two-tone — "Woven" in cream/ink, "Map" in champagne/rust |
| **Mark color** | Champagne (night) / Rust (day) |

## Palettes

| Token | Night | Day |
|---|---|---|
| Background | `#0e1729` | `#faf6ee` |
| Ink (wordmark base) | `#f4ede0` cream | `#1a1612` ink |
| Accent (wordmark + mark) | `#c9a16a` champagne | `#c2761b` rust |

## HTML embed

```html
<link rel="icon" type="image/x-icon" href="/favicon.ico">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png">
<link rel="icon" type="image/png" sizes="192x192" href="/favicon-192.png">
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">

<!-- Lockup -->
<img src="/wovenmap-lockup-night.svg" alt="WovenMap" width="320" height="96">
```

## Print

For print/spot reproduction, use `wovenmap-mark-ink.svg` (single ink, transparent) and set the wordmark in Inter 200 with the same two-tone color split.

—
Locked: canonical · Inter 200 · Title case · night & day.
