# PennyTrack — UI Design Specification

A dark-themed personal expense-tracking app. This document describes the two captured screens — **Dashboard** and **Recent Expenses** — in enough detail to reproduce the design.

---

## 1. Global Style

| Property | Value |
|---|---|
| Theme | Dark mode |
| Background (app) | Near-black, `#111114`–`#151517` range |
| Background (cards) | Slightly lighter charcoal, `#1C1C21`–`#202024`, subtle 1px lighter border (`#2A2A30`) |
| Primary accent | Purple/violet, `#6C4CE0`–`#7B5CFA` range |
| Success/positive | Green, `#3ECF6E`–`#4ADE80` range (progress bar) |
| Text — primary | Off-white, `#F5F5F7` |
| Text — secondary/muted | Grey, `#9A9AA2`–`#8B8B93` |
| Negative amount text | White/light grey with leading minus sign, not red (neutral tone) |
| Corner radius | Large, consistent rounding — ~16–20px on cards, ~24px (pill) on buttons |
| Icon style | Line/outline icons, muted grey by default, colored inside tinted square badges for expense categories |
| Font | Modern geometric sans-serif (system UI style — e.g. Inter/SF Pro) |

---

## 2. Top App Bar

- **Left:** App icon — a rounded-square purple badge containing a wallet/card glyph — followed by the wordmark **"PennyTrack"** in bold white text.
- **Right:** A grey outline **gear/settings icon**, no label.
- Thin horizontal divider line separates the app bar from the page content below.

---

## 3. Dashboard Screen

### 3.1 Page Header
- **Title:** "Dashboard" — large, bold, white (~28–32px).
- **Subtitle:** Current date, muted grey, e.g. "Thursday, 10 September 2026".
- **Primary action button** (top right, pill-shaped, solid purple fill): a "+" icon plus label **"Add expense"**, white text/icon.

### 3.2 Summary Card Row (3 equal-width cards)
Each card: dark card background, rounded corners, left-aligned content, small icon + label at top.

1. **Today**
   - Icon: card/wallet outline
   - Label: "Today" (muted)
   - Value: **"MAD 222.00"** (large, bold, white)
   - Caption: "Thu, 10 Sep" (muted, small)

2. **This week**
   - Icon: calendar outline
   - Label: "This week"
   - Value: **"MAD 797.40"**
   - Caption: "Monday to today"

3. **This month**
   - Icon: calendar outline (filled variant)
   - Label: "This month"
   - Value: **"MAD 2,310.40"**
   - Caption: "September 2026"

### 3.3 Budget Card
Full-width card below the summary row.

- **Header row:** "Budget · September" (muted, left) — "Manage →" link (white/light, right, with trailing arrow icon).
- **Big remaining amount:** **"MAD 689.60"** — very large, bold, white.
- **Sub-caption:** "left of MAD 3,000.00" (muted, directly under the big number).
- **Progress bar:** full-width horizontal rounded bar, track in dark grey, filled portion in **green** representing amount spent (~77%).
- **Footer caption below bar:** "MAD 2,310.40 spent · 77% used" (muted, small).

### 3.4 Recent Expenses (preview, cut off at bottom of Dashboard)
- **Header row:** "Recent expenses" (muted label, left) — "View all →" link (right).
- List begins below; continues onto the second screen (see Section 4).

### 3.5 Bottom Navigation Bar
Fixed bottom bar with 5 items, icon above label, muted grey by default:

1. **History** — clock/history icon
2. **Statistics** — bar chart icon
3. **(center) Add** — large circular purple button with a "+" icon, elevated above the bar, no text label
4. **Budget** — target/bullseye icon

(Order as shown left→right: History, Statistics, [+ center], Budget)

- **Floating utility cluster** (bottom-left, overlapping the nav bar): a small rounded white/light pill containing 3 icons — refresh/sync, grid/apps, and camera — appears to be a separate floating toolbar (possibly a widget/dev overlay), sitting above the main nav.

---

## 4. Recent Expenses List (Screen 2 — scrolled view)

Same app bar as Dashboard. Below it is the continuation of the **Recent expenses** card from the Dashboard, now fully visible.

- **Header row:** "Recent expenses" (muted, left) — "View all →" (right).
- **List of 6 transaction rows**, each with:
  - **Left:** a small rounded-square icon badge, background tinted to match the category, containing a white category icon.
  - **Middle:** Expense title (white, medium weight) on top line; date + category on the muted grey line below, separated by "·".
  - **Right:** Amount in the format **"−MAD XX.XX"**, white/light text, right-aligned.
- No dividing lines between rows — spacing alone separates them.

### Row-by-row data

| Icon badge color | Title | Date · Category | Amount |
|---|---|---|---|
| Amber/orange (crossed utensils) | Coffee and a croissant | Today · Food & drinks | −MAD 42.00 |
| Blue (car) | Fuel top-up | Today · Transport | −MAD 180.00 |
| Green (shopping cart) | Weekly groceries | Yesterday · Groceries | −MAD 356.50 |
| Pink/magenta (clapperboard/film) | Cinema tickets | Tuesday, 8 Sep · Entertainment | −MAD 129.00 |
| Amber/orange (crossed utensils) | Lunch with colleagues | Monday, 7 Sep · Food & drinks | −MAD 89.90 |
| Red/terracotta (document/bill) | Electricity bill | Sunday, 6 Sep · Bills & utilities | −MAD 620.00 |

**Category → icon/color mapping observed:**
- Food & drinks → amber background, crossed fork/knife-style icon
- Transport → blue background, car icon
- Groceries → green background, shopping cart icon
- Entertainment → magenta/pink background, film/clapperboard icon
- Bills & utilities → red/terracotta background, document/bill icon

Same bottom navigation bar as the Dashboard screen, in the same state.

---

## 5. Component Inventory (for design system / dev handoff)

- **Top App Bar** — logo + wordmark, settings icon
- **Page Header** — title + subtitle + primary CTA button
- **Stat Card (x3)** — icon, label, big value, caption
- **Budget Card** — label + link header, big value, caption, progress bar, footer stat
- **List Section Header** — muted label + "View all" link
- **Expense List Row** — category icon badge, title, meta line, amount
- **Bottom Tab Bar** — 4 tabs + center FAB (floating action button)
- **Floating mini-toolbar** — 3-icon pill overlay (bottom-left)

## 6. Currency & Locale Notes
- Currency: **MAD** (Moroccan Dirham), formatted as "MAD 1,234.56" with comma thousands separator and 2 decimal places, prefixed (not suffixed).
- Date format: long form "Thursday, 10 September 2026" for headers; short form "Thu, 10 Sep" / "Tuesday, 8 Sep" for captions.
