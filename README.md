# Get Living: Elephant Central conversion mockup

A working mockup of the Elephant Central neighbourhood page
(https://www.getliving.com/our-neighbourhoods/elephant-central/) showing twelve
changes Get Living could A/B test to improve conversion. Every change uses a
component the page already has; none is a new feature.

- **Live:** served by GitHub Pages from `docs/` (Settings → Pages → main, /docs)
- **Version:** 1, 22 October 2026
- **Prepared by:** ClerksWell

## Viewing

Open `docs/index.html` for the overview, or `docs/pages/elephant-central.html`
for the mockup. The bar at the top switches between Today and Proposed, the
Changes panel turns individual changes on and off, and Notes explains each one
(what it is, why it should help conversion, what to measure, likely effort).

Links can preselect changes: `pages/elephant-central.html?t=hero-cta,card-prices`,
`?t=all` or `?t=none`, and `&notes=1` to open with notes on.

## Structure

```
src/
  index.html                  overview, test rounds and the list of changes
  pages/elephant-central.html the mockup (Today and Proposed in one page)
  includes/header.html        mockup control bar
  css/mockup.css              Get Living and Elephant Central styling
  js/tweaks.js                the twelve changes: copy, effort, test round
  js/mockup.js                switching, notes, reordering, interactions
requirements/changes.md       numbered list of changes (T01 to T12)
docs/                         built output, served by GitHub Pages
```

Edit in `src/`, then build and check:

```
node build-includes.js && node validate.js
```

Photography and icons are Get Living's own, loaded from getliving.com once
they have loaded; anywhere they cannot load, a coloured placeholder shows.
Prices and availability are from Find a home on 22 October 2026.
