# PennyTrack — Offline Expense Tracker

## 1. Project Overview

**App name:** PennyTrack  
**Type:** Offline personal expense tracker  
**Target platforms:** Android, Windows, Linux  
**Primary goal:** Help users quickly record, organize, and understand their spending without requiring an internet connection or an account.

PennyTrack is a simple, fast, privacy-focused expense tracker. All user data is stored locally on the device.

The first version should focus on one thing: **making it extremely easy to record and understand everyday spending.**

---

# 2. The Problem

People often spend small amounts throughout the day but don't keep track of where their money goes.

Existing finance applications can be:

- Too complicated
- Full of unnecessary features
- Dependent on accounts or cloud services
- Difficult to use for quick expense tracking

PennyTrack solves this by providing:

- Fast expense entry
- Daily, weekly, and monthly spending summaries
- Expense categories
- Monthly budgets
- Simple statistics
- Completely offline operation
- Local data storage
- No account required

---

# 3. Target Users

The application is primarily designed for:

- Students
- Young adults
- People trying to control their spending
- People who prefer privacy
- People who want a simple finance application

The application should be understandable even for someone who has never used a budgeting application before.

---

# 4. Core Features — MVP

## 4.1 Dashboard

The dashboard is the main screen.

It should immediately answer:

> **How much have I spent?**

> **How much can I still spend?**

> **Where is my money going?**

Example:

```text
Good evening

THIS MONTH
1,850 MAD

Budget
3,000 MAD

Remaining
1,150 MAD

━━━━━━━━━━━━━━━━━━━━ 62%

Recent expenses

🍔  Lunch              35 MAD
🚌  Transport            8 MAD
☕  Coffee              15 MAD
🛒  Shopping            80 MAD
```

The dashboard should contain:

- Spending today
- Spending this week
- Spending this month
- Monthly budget
- Remaining budget
- Recent expenses
- Quick "Add Expense" button

---

# 5. Add Expense

Adding an expense is the most important action in the application.

The process should be extremely fast.

Example:

```text
Add Expense

Amount

        35.00 MAD

Category

        🍔 Food

Note

        Lunch

Date

        Today


       [ SAVE EXPENSE ]
```

The user can enter:

- Amount
- Category
- Optional note
- Date

The amount field should be the most visually prominent element.

---

# 6. Expense Categories

Default categories:

| Icon | Category |
|---|---|
| 🍔 | Food |
| 🚌 | Transport |
| 🛒 | Shopping |
| 💡 | Bills |
| 🎮 | Entertainment |
| 📚 | Education |
| 🏥 | Health |
| 🏠 | Home |
| 📱 | Subscriptions |
| 📦 | Other |

Later, users should be able to create custom categories.

---

# 7. Expense History

The History screen displays all expenses.

Example:

```text
TODAY

🍔 Lunch
Food
35 MAD

🚌 Bus
Transport
8 MAD

☕ Coffee
Food
15 MAD


YESTERDAY

🛒 Groceries
Shopping
120 MAD
```

Users should be able to:

- View expenses
- Edit expenses
- Delete expenses
- Search expenses
- Filter by category
- Filter by date

Expenses should be displayed newest first.

---

# 8. Budget

The user can define a monthly spending limit.

Example:

```text
MONTHLY BUDGET

Budget
3,000 MAD

Spent
1,850 MAD

Remaining
1,150 MAD

████████████░░░░░░
       62%
```

The application should warn the user when they approach their budget.

For example:

```text
⚠ You're close to your monthly budget.
You have 250 MAD remaining.
```

If the user exceeds the budget:

```text
⚠ Budget exceeded

You've spent 3,150 MAD
Your budget was 3,000 MAD.
```

---

# 9. Statistics

The Statistics screen provides simple visual information.

Examples:

### Spending by category

```text
Food             850 MAD
Transport        320 MAD
Shopping         280 MAD
Bills            250 MAD
Other            150 MAD
```

### Spending by day

```text
Mon     ███████       120
Tue     ████           70
Wed     █████████     160
Thu     ███            50
Fri     ████████      140
```

The first version should keep statistics simple.

Do not build a complicated financial analytics system for the MVP.

---

# 10. Local Storage

PennyTrack must be **offline-first**.

All important application data must be stored locally.

Store:

- Expenses
- Categories
- Budgets
- Settings

## Recommended database

Use:

**SQLite**

The UI should not communicate directly with SQLite.

Use a structure similar to:

```text
Flutter UI
    ↓
Repository / Service Layer
    ↓
SQLite Database
```

This keeps the application organized and makes it easier to change the storage system later.

---

# 11. Data Model

## Expense

```text
Expense
--------
id
amount
categoryId
note
date
createdAt
```

## Category

```text
Category
--------
id
name
icon
isDefault
```

## Budget

```text
Budget
--------
id
month
year
amount
```

## Settings

```text
Settings
--------
currency
theme
firstDayOfWeek
```

---

# 12. Currency

The default currency should be:

**MAD — Moroccan Dirham**

However, the currency must be configurable.

Possible currencies:

- MAD
- EUR
- USD
- GBP
- Other

The selected currency should be stored locally.

---

# 13. Visual Design

## Design Direction

PennyTrack should use a:

**Modern Dark Finance Dashboard**

The visual style should feel:

- Modern
- Minimal
- Clean
- Professional
- Slightly futuristic
- Calm
- Privacy-focused

It should **not** look like an old banking application.

It should also avoid excessive animations, gradients, and decorative elements.

The goal is:

> **Information first, decoration second.**

---

# 14. Color Palette

Use a dark charcoal interface rather than pure black.

Suggested palette:

```text
Background:       #101114
Surface:          #181A1F
Elevated Surface: #20232A

Primary Text:     #F5F7FA
Secondary Text:   #9AA0AA

Accent:           #7C5CFF

Success:          #32D583
Warning:          #F5B942
Danger:           #FF5C6C

Border:           #2A2D35
```

### Accent color

Use the purple accent primarily for:

- Primary buttons
- Selected navigation
- Important UI elements
- Progress indicators
- Focus states

Do not use the accent color everywhere.

---

# 15. Typography

Recommended font:

**Inter**

Typography hierarchy:

```text
Large financial number
32–40px / Bold

Screen title
24–28px / Semibold

Section title
18–20px / Semibold

Normal text
14–16px

Secondary text
12–14px
```

The interface should have generous spacing.

Avoid putting too much information on one screen.

---

# 16. Cards

Use rounded cards for important information.

Example:

```text
┌─────────────────────────────────────┐
│ THIS MONTH                          │
│                                     │
│ 1,850 MAD                           │
│                                     │
│ █████████████░░░░                   │
│ 62% of budget                       │
└─────────────────────────────────────┘
```

Recommended:

```text
Corner radius: 12–16px
```

Cards should have subtle contrast rather than heavy shadows.

---

# 17. Navigation

The application should adapt its navigation to the screen size.

## Android

Use bottom navigation:

```text
┌─────────────────────────────────────┐
│                                     │
│              CONTENT                │
│                                     │
├─────────────────────────────────────┤
│ Home  History   +   Stats  Settings │
└─────────────────────────────────────┘
```

The `+` button should make adding an expense extremely accessible.

---

## Windows / Linux

Use a sidebar:

```text
┌──────────────┬─────────────────────────────┐
│ PennyTrack   │                             │
│              │          Dashboard          │
│ 🏠 Home      │                             │
│ 💳 Expenses  │          CONTENT             │
│ 📊 Statistics│                             │
│ 💰 Budget    │                             │
│ ⚙ Settings  │                             │
│              │                             │
└──────────────┴─────────────────────────────┘
```

The desktop interface should take advantage of the larger screen.

---

# 18. Responsive Design

The application must work on:

### Android

Small touch screens.

### Windows

Desktop and laptop screens.

### Linux

Desktop and laptop screens.

The application should use responsive layouts.

Do **not** simply stretch the mobile interface across a desktop window.

For example:

```text
Small screen
    ↓
Single-column layout

Large screen
    ↓
Sidebar
+
Multiple dashboard cards
+
Larger content area
```

---

# 19. Technology

Recommended technology stack:

```text
Framework:
Flutter

Language:
Dart

Local Database:
SQLite

Platforms:
Android
Windows
Linux
```

The project should use a shared codebase.

Conceptually:

```text
                 Flutter
                    │
          ┌─────────┼─────────┐
          ↓         ↓         ↓
       Android    Windows    Linux
```

Avoid platform-specific code unless it is necessary.

---

# 20. Offline Requirement

PennyTrack must continue working when:

```text
Wi-Fi        OFF
Mobile Data  OFF
Internet     unavailable
```

The user must still be able to:

- Add expenses
- Edit expenses
- Delete expenses
- View history
- View statistics
- Set budgets
- Change settings

No login should be required.

No cloud server is needed for Version 1.

---

# 21. Privacy

Financial information is personal.

Version 1 should follow a simple privacy principle:

> **Your expenses stay on your device.**

The application should not require:

- An account
- A cloud database
- Internet access
- Analytics

Expense data should not be sent anywhere.

Future versions can optionally provide encrypted backups or synchronization.

---

# 22. Backup — Future Feature

Local-only storage creates one important problem:

If the user loses their device or deletes the application, their data could be lost.

Therefore, a future version should support:

```text
Export
   ↓
JSON / CSV backup
```

And:

```text
Import
   ↓
Restore expenses
```

This should not be required for the MVP, but the architecture should leave room for it.

---

# 23. Screens

The MVP should contain these screens:

```text
1. Dashboard
2. Add Expense
3. Expense History
4. Edit Expense
5. Statistics
6. Budget
7. Settings
```

Keep navigation simple.

---

# 24. User Flow

The primary user flow:

```text
Open App
    ↓
Dashboard
    ↓
Press "+"
    ↓
Enter Amount
    ↓
Choose Category
    ↓
Optional Note
    ↓
Save
    ↓
Dashboard Updates
    ↓
Expense Appears in History
    ↓
Statistics Update
```

Recording a normal expense should take only a few seconds.

---

# 25. MVP Requirements

The MVP is complete when the user can:

- Launch the application
- Create an expense
- Save it locally
- View it on the dashboard
- View it in history
- Edit it
- Delete it
- Create a monthly budget
- See budget usage
- View basic statistics
- Close and reopen the application without losing data
- Use the application completely offline
- Run the application on Android
- Run the application on Windows
- Run the application on Linux

---

# 26. Development Roadmap

Build the project incrementally.

## Phase 1 — Project Setup

```text
Create Flutter project
Configure Android
Configure Windows
Configure Linux
Create project structure
```

## Phase 2 — UI

```text
Create dark theme
Create navigation
Create dashboard
Create Add Expense screen
Create History screen
```

## Phase 3 — Database

```text
Create SQLite database
Create Expense model
Create Category model
Create Budget model
Implement database operations
```

## Phase 4 — Expense System

```text
Add expense
Read expenses
Edit expense
Delete expense
Search
Filter
```

## Phase 5 — Dashboard

```text
Today's spending
Weekly spending
Monthly spending
Budget remaining
Recent expenses
```

## Phase 6 — Statistics

```text
Category statistics
Daily statistics
Monthly statistics
Charts
```

## Phase 7 — Settings

```text
Currency
Theme
Preferences
```

## Phase 8 — Testing

Test:

```text
Android
Windows
Linux
Offline operation
Database persistence
Large number of expenses
Invalid input
Deleting expenses
Editing expenses
```

---

# 27. Future Roadmap

After the MVP:

## Version 1.1

- Custom categories
- Search
- Advanced filters
- Better charts
- CSV export

## Version 1.2

- Recurring expenses
- Category budgets
- Multiple wallets/accounts
- Monthly reports

## Version 2.0

- Encrypted database
- Backup and restore
- Optional cloud synchronization
- Cross-device synchronization
- Advanced financial analytics

These features should not be added until the basic application is stable.

---

# 28. Architecture Principle

Keep the application separated into layers.

A possible structure:

```text
lib/
│
├── main.dart
│
├── models/
│   ├── expense.dart
│   ├── category.dart
│   └── budget.dart
│
├── database/
│   └── database_helper.dart
│
├── repositories/
│   ├── expense_repository.dart
│   ├── category_repository.dart
│   └── budget_repository.dart
│
├── screens/
│   ├── dashboard/
│   ├── expenses/
│   ├── statistics/
│   ├── budget/
│   └── settings/
│
├── widgets/
│   ├── expense_card.dart
│   ├── budget_card.dart
│   └── ...
│
└── services/
    └── ...
```

The exact architecture can evolve as the project grows.

---

# 29. Design Philosophy

PennyTrack should follow five principles:

### 1. Fast

Adding an expense should take seconds.

### 2. Simple

The user should not need to understand finance terminology.

### 3. Private

Data stays locally on the device.

### 4. Clear

The user should immediately understand their spending.

### 5. Cross-platform

One Flutter project should provide the Android, Windows, and Linux applications.

---

# 30. Definition of Success

PennyTrack should feel like a small, polished real-world product rather than a programming exercise.

When the user opens the application, they should immediately understand:

> **How much did I spend?**

> **Where did I spend it?**

> **How much can I still spend?**

The application should prioritize:

**Speed → Clarity → Privacy → Simplicity**

over unnecessary features.

---

# 31. MVP Rule

When deciding whether to add a feature, ask:

> **Does this help the user track their expenses?**

If the answer is no, postpone it.

Do not add:

- Social features
- Chat
- AI
- Cloud accounts
- Cryptocurrency
- Complex investments
- Banking integrations
- Complicated financial forecasting

until the core expense tracker is already working well.