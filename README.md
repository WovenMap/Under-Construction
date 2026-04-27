# WovenMap — Under Construction

The teaser site for **WovenMap™**.

This repository hosts the public "coming soon" page for WovenMap™.
The product itself is not described here, on purpose.

## Site

- **wovenmap.com** (canonical)
- wovenmap.net → redirects to .com
- wovenmap.co → redirects to .com

Hosted on [Vercel](https://vercel.com). The deployable site lives in
[`site/`](./site/).

## Stack

Static HTML + React (loaded via inline Babel) + Web3Forms for signup
delivery. No build step. Open `site/index.html` directly to develop.

## Deployment

```sh
cd site
npx vercel        # first deploy
npx vercel --prod # promote to production
```

The Vercel project's **Root Directory** must be set to `site/` so the
project-internal scratch folders (`scraps/`, `exports/`, etc.) are not
served.

## Signup capture

Form submissions are:

1. Saved to the visitor's `localStorage` (client-side backup, exportable
   from the hidden admin panel — `Ctrl/Cmd + Shift + E`).
2. Mirrored to **Web3Forms** via the access key in
   `site/index.html` → `window.WM_CONFIG.web3formsKey`, which emails the
   submission to the inbox tied to that key.

Honeypot field (`botcheck`) is included to drop obvious bot traffic.

## License

**This repository is source-available, not open-source.** All rights
reserved under the [Commercial Restricted License (CRL) v1.1](./LICENSE).

You may **view** the Work for personal, informational purposes. You may
**not** copy, modify, redistribute, train ML on, or use any portion in a
commercial product without prior written permission.

## Trademarks

**WovenMap™**, the WovenMap living-mark logo, the WovenMap wordmark, and
related marks are unregistered (common-law) trademarks of WovenMap.
See [TRADEMARKS.md](./TRADEMARKS.md) for the full notice.

## Contact

**hello@wovenmap.com**
