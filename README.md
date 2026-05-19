# TODO List

A simple TODO list PWA built with React, Vite, and TypeScript. Inspired by [Splendo](https://play.google.com/store/apps/details?id=com.splendapps.splendo&hl=en-US). Installable on mobile and desktop, works offline.

## Development

```bash
npm install
npm run dev
```

## Docker deployment

```bash
docker build -t todolist .
docker run -d -p 8080:80 todolist
```

The app will be available at `http://localhost:8080`.

## Build & sync to Android (Capacitor)

```bash
npm run build
npx cap sync
npx cap open android
```

## Planned Features

- [ ] **Color labels for lists** — assign colors to task lists for visual distinction
- [x] **Dark blue theme** — app-wide dark blue color scheme
- [ ] **Notifications**
  - [ ] Notify at the set time for tasks with a due time
  - [ ] Notify at 7:00 AM for all-day tasks
- [ ] **Settings**
  - [ ] Configure whether tasks without a date appear at the beginning or end of the list
  - [ ] Configure whether quick-add creates tasks for today or without a date
  - [ ] Configure how long before a task's due time to show a notification
  - [ ] Configure when to display the daily task summary notification
- [ ] **Export / Import** — export and import tasks to/from a JSON file (via menu)
- [ ] **Undo on complete** — show a brief undo snackbar after marking a task as completed
- [ ] **JSON storage on device** — persist data to a local JSON file instead of (or alongside) localStorage
- [ ] Storage - IndexedDB
