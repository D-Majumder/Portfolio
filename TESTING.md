# Startup regression report — 22 October 2026

## Confirmed failure

A controlled browser server returned the earlier, pre-Studio `shared.js` for the unversioned script URL, while serving the current desktop script. Submitting the name with the arrow produced a blank home and `ReferenceError: studioHomeHTML is not defined`. The same server with the patched, content-versioned asset URLs opened the home on the first attempt with no JavaScript errors.

A clean session on the published pre-fix site opened normally, so the cached-asset failure is conditional rather than universal.

Two regression tests were also run against the committed pre-fix boot code: the early submission test and the test requiring the boot screen to remain visible during initialization both failed. Both pass with the fix.

## Fix

- Content hashes on every local JS/CSS URL; regenerate with `node scripts/version-assets.cjs`.
- Arrow and Enter handlers attach before the welcome animation, preserving early submissions.
- Startup completes before the boot overlay disappears.
- Initialization failures leave a visible message and a working Continue retry.
- Both handlers are removed after successful entry, preventing stale listeners across logout/reboot.

## Automated checks

`node --test tests/boot.test.cjs tests/portfolio.test.cjs` — 12 passing tests:

1. First arrow submission and boot visibility during initialization.
2. Early arrow/Enter submission during animation.
3. Duplicate arrow/Enter submissions initialize only once.
4. Blank-name Guest fallback; ordinary keys do not submit.
5. Four alternating arrow/Enter entry cycles with listener cleanup.
6. Initialization failure and successful retry.
7. Asynchronous initialization completes before dismissal.
8. GitHub merge, deduplication, pinning, and visibility filtering.
9. Partial GitHub outage retains successful results.
10. Complete GitHub outage shows a direct profile link.
11. Desktop/mobile shared content.
12. Home action dispatch and replacement of reboot listeners.

`node scripts/version-assets.cjs --check`, `node --check` on the application scripts, and `git diff --check` also pass.

## Browser coverage

Desktop first-entry arrow, ordinary page reload with Enter, logout/re-entry, project navigation, and 390px mobile first-entry arrow and ordinary reload/Enter. The cached-script comparison above uses an isolated local server; no production cache or account settings were changed. The mobile test uses a browser iframe viewport, not physical phone hardware. Full cross-browser/device certification is outside these checks.
