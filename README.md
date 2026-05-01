# ⚡ DevTab

Your new tab shouldn't be a billboard. **DevTab** is a brutally minimal, zero-dependency dashboard built specifically for developers who want focus, not friction.

No scrolling. No trackers. No bloated frameworks. Just a perfectly balanced 2x2 grid that adapts to your system theme and puts the tools you actually use right in front of you.

![DevTab Screenshot Interface](/screenshot.png)
_Screenshot_

## ✨ Features

DevTab is built around five core modules, seamlessly integrated into a single, non-scrollable view.

### ⏱️ Fluid Time Manager

A seamless, keyboard-friendly productivity timer.

- **Inline Editing:** Click the time directly, type `15`, press enter. No popups, no clunky modals.
- **Three Modes:** Pomodoro, Custom Timer, and Stopwatch.
- **Synthesized Audio:** Uses the native Web Audio API to generate a clean, non-intrusive double-chime when your time is up. No heavy `.mp3` files required.

### 🛠️ The Dev Toolkit

Stop opening new tabs to Google these basic utilities.

- **Live Unix Epoch:** Always ticking, one click to copy.
- **UUIDv4 Generator:** Generate and copy secure UUIDs instantly.
- **JSON Formatter:** Paste ugly, minified JSON payloads, hit format, and it validates, indents, and copies it back to your clipboard automatically.

### 🧠 Brain Dump

A distraction-free, auto-saving scratchpad. Whether you are holding onto a curl command or just writing down a quick thought, it instantly saves to local storage. Close the tab, open a new one, and it’s right where you left it.

### 🕰️ Contextual Clock

A massive, fluid-typography clock with a contextual greeting based on your local time. Sharp, monospace digits to keep you anchored.

### 💬 Everyday Fun

Because you can't write code 24/7. A lighthearted quote generator that fetches random, often funny quotes from a fast, free JSON API to keep you sane between commits.

## 🏗️ Under the Hood

DevTab is a love letter to native web standards.

- **Zero Dependencies:** No React, no Tailwind, no build steps.
- **Raw CSS:** Built with pure CSS variables, modern CSS Grid, and fluid typography (`clamp()`) to ensure the layout never breaks or spawns a scrollbar, regardless of your monitor size.
- **Auto-Theming:** Automatically reads your OS/Browser `@media (prefers-color-scheme)` to switch instantly between a high-contrast Light mode and a brutalist Zinc Dark mode.

## 🚀 Installation (Local)

Currently, DevTab is designed to be run locally as an unpacked extension on any Chromium-based browser (Chrome, Brave, Edge, Vivaldi).

1. Clone or download this repository to your local machine.
2. Open your browser and navigate to the extensions page:
   - Chrome/Brave: `chrome://extensions/`
   - Edge: `edge://extensions/`
3. Toggle **Developer mode** in the top right corner.
4. Click **Load unpacked** and select the folder containing the DevTab files.
5. Open a new tab.

## 🤝 Contributing

This is a local, personal-focused tool, but if you have a cool idea for replacing a widget or improving the CSS grid, feel free to fork it, rice it, and submit a PR.

---

_Keep pushing forward._
