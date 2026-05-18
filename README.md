# TODO List

A simple TODO list mobile app built with React, Vite, and Capacitor. Inspired by [Splendo](https://play.google.com/store/apps/details?id=com.splendapps.splendo&hl=en-US).

## Development

```bash
npm install
npm run dev
```

## Build & sync to Android

```bash
npm run build
npx cap sync
npx cap open android
```

## Planned Features

- [ ] **Color labels for lists** — assign colors to task lists for visual distinction
- [ ] **Dark blue theme** — app-wide dark blue color scheme
- [ ] **Notifications**
  - [ ] Notify at the set time for tasks with a due time
  - [ ] Notify at 7:00 AM for all-day tasks
- [ ] **Settings**
  - [ ] Configure whether tasks without a date appear at the beginning or end of the list
  - [ ] Configure whether quick-add creates tasks for today or without a date
  - [ ] Configure how long before a task's due time to show a notification
  - [ ] Configure when to display the daily task summary notification
- [ ] **Export / Import** — export and import tasks to/from a file (via menu)
