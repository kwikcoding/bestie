# Bestie Birthday Surprise — Static HTML Edition

This version uses plain HTML, Tailwind CSS via CDN, GSAP and ScrollTrigger. No React, npm or build command is required.

## Open the website

Double-click `index.html` or upload the folder to Cloudflare Pages, Netlify, Hostinger or any static web host.

An internet connection is required for Tailwind, GSAP and the demo placeholder photos because they are loaded from CDNs.

## Replace the 30 photos

1. Put your photos inside `assets/photos/` and name them `01.jpg` through `30.jpg`.
2. Open `script.js`.
3. Replace the `src` value in the `memories` line with:

```js
src: `assets/photos/${String(i + 1).padStart(2, '0')}.jpg`
```

You can also change the five photo captions in the `labels` array.

## Personalize the message

Open `index.html` and replace “Bestie,” the birthday letter, the reasons and the final wish with your own content.

## Files

- `index.html` — complete page structure and text
- `styles.css` — gift box, envelope, confetti and custom styling
- `script.js` — GSAP animation, sequential photos, music and interactions
- `assets/photos/` — location for your 30 real photos
