# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

### Added

- Task CRUD — create, edit, toggle complete, and delete tasks
- Multiline task description field
- Due date and due time support for tasks
- Date format displayed as "Mon, 18 May"
- Task list view grouped by date sections: Overdue, Today, Tomorrow, weekday names, Next week, Next month, Later, No date
- Tasks with a set time sorted first within each date section
- Multiple task lists — create, rename, and delete lists
- List selector dropdown in the header
- Completed list — virtual list showing all completed tasks across lists with original list name preserved for reopening
- Quick-add bar at the bottom for fast task entry with today's date
- FAB button (+) to open full task creation modal with all fields
- Three-dot menu button in the header (empty, placeholder for future options)
- Blue color theme inspired by the original Splendo app
- Capacitor Android platform configured
- Zustand store with localStorage persistence
