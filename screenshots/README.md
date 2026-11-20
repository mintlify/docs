# Screenshot automation (prototype)

Regenerates docs screenshots from code so they can be updated in bulk after UI changes.

- `fixture/` is a small Mintlify site with the content the screenshots show. It's listed in the root `.mintignore`, so it never publishes.
- `manifest.yaml` lists each screenshot: the page, what to hide, any clicks before capture, and how to crop.
- `capture.mjs` starts `mint dev` on the fixture, captures every shot in light and dark mode at 2x, and overwrites the images in `images/`. Review the result in the git diff.

## Run it

```bash
cd screenshots
npm install
npx playwright install chromium
npm run capture
```

To regenerate one screenshot, pass part of its output path:

```bash
npm run capture -- changelog-filters
```

## Add a screenshot

1. Add or edit a page in `fixture/` with the content the screenshot needs. Use sample content, not real product claims.
2. Add an entry to `manifest.yaml`.
3. Run the capture and check both themes.

Unchanged UI produces byte-identical images, so only real changes show up in a diff.

## Limits

Covers screenshots of docs sites only. Dashboard screenshots need a signed-in test account with stable data, which this doesn't set up.
