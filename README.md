# TODO List

A simple TODO list PWA built with React, Vite, and TypeScript. Inspired by [Splendo](https://play.google.com/store/apps/details?id=com.splendapps.splendo&hl=en-US). Installable on mobile and desktop, works offline.

## Development

```bash
npm install
npm run dev
```

## Docker Deployment

### Build the image

```bash
docker build -t todolist .
```

### Run locally

```bash
docker run -d -p 8080:80 --name todolist todolist
```

The app will be available at `http://localhost:8080`.

### Stop and remove

```bash
docker stop todolist
docker rm todolist
```

### Deploy to a server

1. Build the image on the server (or push to a registry):

```bash
# Option A: build directly on the server
git clone <repo-url> && cd todolist
docker build -t todolist .

# Option B: use a registry
docker build -t your-registry.com/todolist:latest .
docker push your-registry.com/todolist:latest
# then on the server:
docker pull your-registry.com/todolist:latest
```

2. Run with auto-restart:

```bash
docker run -d -p 80:80 --restart unless-stopped --name todolist todolist
```

3. For HTTPS, put a reverse proxy (nginx, Caddy, Traefik) in front — PWA install and notifications require HTTPS in production.

## Build & sync to Android (Capacitor)

```bash
npm run build
npx cap sync
npx cap open android
```

## Planned Features

- [ ] **Color labels for lists** — assign colors to task lists for visual distinction
- [x] **Dark blue theme** — app-wide dark blue color scheme
- [x] **Notifications** — task time reminders and daily morning summary
- [ ] **Settings UI** — configure notification timing, quick-add behavior, task ordering
- [ ] **Export / Import** — export and import tasks to/from a JSON file (via menu)
- [ ] **Undo on complete** — show a brief undo snackbar after marking a task as completed
- [x] **IndexedDB storage** — persistent storage via idb-keyval
