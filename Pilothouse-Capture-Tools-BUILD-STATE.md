# Pilothouse Marine — Survey Capture Tools · Build State

> **What this is:** the single source of truth for a set of offline, browser-based field-capture tools being built for Pilothouse Marine Services. Drop this file into the Claude Project alongside the three HTML tools. Any future session — or Steve — can read this and be fully oriented without re-explaining anything.

---

## 1. Context

- **User:** Steve Smith, owner/sole operator, Pilothouse Marine Services, LLC (Beaufort, NC). Marine surveyor, ~200 surveys/year.
- **Hardware:** Apple ecosystem — iPhone, multiple iPads, Mac. Owns Cursor for local editing.
- **Report software:** Uses **InspectX** for report output. Critical constraint: **InspectX has no data import.** Everything is either re-typed by hand or copy/pasted in. Therefore **CSV / clean readable text is the universal handoff** — the tools never integrate with InspectX directly.

---

## 2. Core thesis — read this before changing anything

The tools all follow one philosophy. Preserve it:

- **Capture once, output many.** Data is tapped in once, aboard, and comes back as (1) a block to read-and-type or paste into InspectX, (2) copy/paste text for an AI tool to write prose, and (3) a printed slip where needed. Never make the surveyor handle the same datum twice.
- **Offline, single self-contained HTML file per tool.** No external fonts, CDNs, or libraries — must work aboard with zero signal. Saved to the iPhone home screen (Safari → Share → Add to Home Screen), each runs like an app.
- **Ephemeral / stateless.** No database, no persistence. State lives in memory only. A page refresh or the "New vessel" button wipes it — this is intentional (delete-and-restart per vessel). **Never add localStorage/sessionStorage** (also fails inside Claude artifacts).
- **Owned outright, zero recurring cost.** Files Steve possesses and edits. No subscriptions.
- **Proportionality.** Don't add steps or complexity that eliminate fewer than they introduce.

---

## 3. The three tools

### Tool 1 — Observation capture · `survey-findings-capture.html`

Captures raw field observations → exports for AI to write the formal findings, plus CSV, plus an on-deck debrief view.

**Terminology:** the raw captured items are **observations**; the AI writes the formal **findings** from them.

**Fields (in order):**

- **Severity** — chips A / B / C (short descriptor labels under each are **placeholders** pending Steve's definitions).
- **Category** — chips Safety / Defect / Maintenance (color-accented: Safety red, Defect amber, Maintenance green).
- **System** — dropdown.
- **Subsystem** — dropdown, cascades from System.
- **Component** — optional; currently **free-text** (will become a cascading pick-list once the master list arrives).
- **Observation** — textarea, built for iOS dictation.

**Outputs:**

- **CSV** (default): `Vessel, Severity, Category, System, Subsystem, Component, Observation`.
- **AI prompt:** grouped by system, each line tagged `[Severity · Category]`, subsystem/component folded in.
- **Debrief:** full-screen, glare-friendly reading view for verbally walking the buyer through findings. Tally header (total + A/B/C counts); groups **worst-first by severity** (toggle to **by system**); large type.

**Status:** working. Awaiting (a) A/B/C definitions, (b) component pick-lists.

### Tool 2 — Equipment / discrete-data capture · `survey-equipment-capture.html`

Captures heterogeneous equipment data (makes/models, quantities, ratings) → output to read/type into InspectX + CSV.

**Fields:**

- **System** — dropdown → suggests **Component** (text + per-system datalist; free entry allowed).
- **Make, Model, Serial/ID, Qty, Rating/capacity** (generic field absorbing BTU / A / GPH / HP / kW), **Location** (text + datalist), **Note**.
- Fill only what applies per item.

**Outputs:** **"For InspectX"** (grouped by system, attributes labeled and spaced for read-and-type) and **CSV**.

**Status:** working. Component/location suggestion lists are sensible defaults, to be tuned to Steve's book.

### Tool 3 — Engine / oil-sample capture · `survey-engine-oil-capture.html`

Captures repeating power units → three outputs including a print-ready oil-sample slip.

**Fields:**

- **Unit** — Engine / Transmission / Generator / Other.
- **Position** — chips Port / STBD / Center / Single / No. 1 / No. 2 (composes to "Port Engine," "Generator No. 2," etc.).
- **Make** (datalist of marine makes), **Model, Serial/SN, Total hours, Hrs since oil change, Oil sample date** (defaults to today), **Oil type** (optional).

**Twin-engine shortcut:** after "Add unit," the tool **keeps Unit, Make, Model, Oil type** and clears **Position, Serial, hours** — so a matched pair is a few taps.

**Outputs:** **"For InspectX"**, **CSV**, and **"Oil labels"** — one label-ready text block per *sampled* unit (a unit counts as sampled once it has a sample date, hours-since-change, or oil type), each ending with the surveyor contact block. Ready to copy into the printer's app.

**Config:** a `SURVEYOR` block at the top of the file (name/company pre-filled; **phone/email are placeholders to set once**).

**Status:** working. Printer purchase on hold. Minor pending tweak: relabel "Oil labels" → "Oil slips" to match the slip decision.

---

## 4. Shared design system

- **Brand:** navy `#00328A`, teal `#00A0A0`. "Instrument panel" aesthetic — dark navy header, teal accents, monospace for data readouts. **System fonts only** (offline requirement).
- **Common chrome:** vessel-name header + live count gauge; two-tap "New vessel" clear (guards against accidental wipe); bottom action bar; export bottom-sheet with a format toggle and a Copy button.
- **Mobile-first:** large tap targets, high contrast for sunlight, safe-area padding, works one-handed.

---

## 5. The taxonomy — how System / Subsystem / Component is stored and updated

- The taxonomy lives in a clearly-labeled `**SYSTEMS` object at the top of each file** (findings uses all three levels; equipment uses per-system component lists). It is **embedded, not loaded externally** — this is deliberate, and is what keeps each tool a single offline file. An external list would break offline use aboard.
- **To update:** either (a) send a revised master list and the file is regenerated, or (b) edit the `SYSTEMS` block directly in Cursor / any text editor. Because each tool is one file, "updating" = replacing that file on the devices.

**Master-list format expected from Steve (Excel or CSV):**

- **Three columns:** `System | Subsystem | Component`, one row per component.
- **Fill down** System and Subsystem on every row — **no merged cells** (they parse ambiguously).
- **Sheet/row order = display order** in the pick-lists.
- A subsystem with no components yet = one row with Component blank.
- A **two-column System/Subsystem** sheet is acceptable as a start; Component stays free-text until fleshed out.
- **One master list feeds both tools** — findings uses all three levels; equipment maps System + Component from the same source, keeping the taxonomy consistent.

---

## 6. Printer (deferred)

- **Requirement:** print a **slip** (not a sticker), ~58 mm wide, from the iPhone, in the truck, same day.
- **Key finding:** cheap consumer 58 mm Bluetooth receipt printers (Munbyn/NETUM/etc.) are **Android-only** and will not print from an iPhone. Reliable iPhone printing needs an MFi-grade unit.
- **Viable options:**
  - **Epson TM-P20II (Mobilink)** — buyable online via Square's hardware shop; rugged (IP54, ~6.9 ft drop), long battery, 58 mm; drives from Epson's own iOS apps (TM Print Assistant can print PDF/XML generated by a web app). ~$250–350.
  - **Star SM-L200** — cheaper (~$150) and iPhone-compatible, but sold through POS resellers/eBay, not Amazon.
- The engine tool already outputs slip-ready text to copy into the printer's app. A future native app could print via the printer's SDK (single button, no copy step).
- **Status:** on hold until the observation tool is tested and in real use.

---

## 7. Open threads / next steps

1. **Severity definitions** — Steve to provide exact A/B/C meanings → wire into chips and debrief headers.
2. **Master taxonomy list** — Steve to send Excel (§5 format) → wire into both tools; make Component a **cascading pick-list**.
3. **Terminology check** — records were renamed to "observations" app-wide (field + counter + exports). Confirm this is wanted, or revert to renaming only the field.
4. **Equipment lists** — tune component/location suggestions to Steve's actual book.
5. **Printer** — purchase decision deferred (see §6).
6. **Eventual merge** — combine the three tools into **one app with a shared vessel header and a combined export** (the fullest expression of "capture once" — vessel/engine details entered only once). Decide after all three are validated individually. This is the point at which maintaining it in Cursor pays off.
7. **Optional native app** — Steve owns the Apple Developer Program. A later SwiftUI build would enable single-button printing via a printer SDK and true single-entry across everything. Not needed yet.

---

## 8. Deliverable files (current)

- `survey-findings-capture.html` — Observation capture **(current)**
- `survey-equipment-capture.html` — Equipment / discrete-data capture
- `survey-engine-oil-capture.html` — Engine / oil-sample capture
- `Pilothouse-Capture-Tools-BUILD-STATE.md` — this document

---

## 9. Constraints for any future edit (do not violate)

- Single self-contained HTML per tool; **no external fonts, CDNs, or libraries**.
- **In-memory state only** — no localStorage/sessionStorage.
- Keep System/Subsystem strings **consistent between the findings and equipment tools**.
- Maintain the brand/design system in §4 so the tools stay a coherent family.
- Preserve the capture-once / offline / ephemeral thesis in §2.

---

## 10. How to run this Project

1. Create a Claude Project (e.g., "Pilothouse Capture Tools").
2. Upload the **three HTML files + this document** as Project knowledge.
3. Keep the HTML files in a **Cursor folder** as the working source of truth (optional version history).
4. To continue in any future chat inside the Project: name the tool, state the change (and paste the file if it was edited outside this thread). Context from this document carries the rest.