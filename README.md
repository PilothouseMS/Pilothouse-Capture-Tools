# Pilothouse Capture Tools

Mirror of `github.com/PilothouseMS/Pilothouse-Capture-Tools`, kept here so a
session can read and edit the tools through the vault instead of asking Steve to
upload them. **Edit here, then push to GitHub.**

## Files

| File | Purpose |
|---|---|
| `index.html` | hub — links to the three tools |
| `survey-findings-capture.html` | **observation** capture (the AI writes *findings* from them) |
| `survey-engine-oil-capture.html` | engine / oil-sample capture, lab slips |
| `survey-equipment-capture.html` | equipment capture — **on hold**, becoming the field collection tool |
| `sw.js` | offline cache. **Bump `CACHE = 'pilothouse-vN'` on every release** or phones keep the old version |
| `Pilothouse-Capture-Tools-BUILD-STATE.md` | the spec. Read it before changing anything |

## The taxonomy is generated — do not hand-edit it

Each tool embeds a `const TAX = {...}` block. That embedding is deliberate: a
tool must be one self-contained file that works aboard with no signal.

The cost is duplication, and in August 2026 the copies drifted — one file said
`Fuel Tanks`, another said `Fuel Tankage`, and lookups silently missed. So the
block is now generated:

```
master   50-Findings-Engine/taxonomy/survey-taxonomy.json
build    python3 50-Findings-Engine/bin/build_capture_tools.py
verify   python3 50-Findings-Engine/bin/build_capture_tools.py --check
```

It also runs inside `50-Findings-Engine/bin/build.sh`, so a taxonomy change and
a stale tool cannot both survive a build.

Tool-specific keys are preserved — the equipment tool's `equipment` and
`locations` lists are its own and are carried through untouched.

## Release checklist

1. Change the master taxonomy, or edit a tool's markup/behaviour here.
2. `python3 50-Findings-Engine/bin/build_capture_tools.py`
3. **Bump the `CACHE` version in `sw.js`.**
4. Push all changed files to GitHub.
5. On the phone: delete the Home Screen icon and re-add, or the service worker
   serves the cached copy.
