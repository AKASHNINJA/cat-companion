# Cat Companion

![Platform](https://img.shields.io/badge/platform-Windows%20%7C%20macOS-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Electron](https://img.shields.io/badge/built%20with-Electron-47848f)
![Release](https://img.shields.io/github/v/release/AKASHNINJA/cat-companion?include_prereleases)

A pixel-art desktop companion that floats over every app on your screen — always on top, always adorable. Pick your animal, pick your colors, and let your new desk buddy keep you company while you work.

---

## About

Cat Companion is a lightweight **Electron desktop widget** that renders a pixel-art animal directly on your screen as a transparent, always-on-top overlay. It reacts to what you do — typing, scrolling, idle moments, Pomodoro sessions — so it feels alive without ever getting in your way. Click through it, drag it anywhere, and customize it to match your vibe.

Built with pure HTML + Canvas 2D — no framework overhead, no telemetry, no internet required after install.

---

## Features

| | Feature | Details |
|---|---|---|
| 🐱 | **Multiple companions** | Cat, Dog, Hamster, Parrot — each with unique pixel art |
| 🖱️ | **Mouse tracking** | Eyes follow your cursor; sprite flips to always face you |
| ⌨️ | **Keyboard reactions** | Bobs while typing, goes hyper during fast bursts |
| 📜 | **Scroll reactions** | Leans up or down as you scroll |
| 🐾 | **Click interactions** | Tap your companion for sparkle celebrations |
| 🧘 | **Stretch reminders** | Configurable nudges to stand up and move |
| 🍅 | **Pomodoro timer** | Built-in work/break cycle — companion naps on breaks |
| 🎨 | **Full customization** | 8 color palettes × 4 patterns = your own unique pet |
| 💾 | **Saved preferences** | Position, color, pattern all persist between sessions |
| 🖥️ | **True floating widget** | Transparent overlay, always on top, click-through background |
| 🌙 | **Mood display** | Live mood label: Content / Focused / Sleepy / Hyper / Celebrating |

### Companion Moods

| Mood | What triggers it |
|------|-----------------|
| 😊 Content | Default — gentle breathing + slow blink |
| 😤 Focused | Typing at normal speed |
| 🤩 Hyper | Typing fast (>3 keys/sec) |
| 😴 Sleepy | 10 seconds of inactivity |
| 👆👇 Curious | Mouse wheel scroll |
| 🧘 Stretching | Stretch reminder fires |
| 🎉 Celebrating | Pomodoro complete / companion clicked |
| 💤 Napping | Pomodoro break mode |

### Color Palettes

Black · Orange · Grey · Cream · Siamese · Calico · Tuxedo · Lavender

---

## How to Install

### Windows

1. Go to the [**Releases**](https://github.com/AKASHNINJA/cat-companion/releases/latest) page
2. Download `Pixel-Companion-Setup-x.x.x.exe`
3. Run the installer — choose your install location
4. Launch **Pixel Companion** from the Start Menu or Desktop shortcut
5. Your companion appears in the bottom-right corner — drag it anywhere!

> Windows may show a SmartScreen warning on first launch (unsigned build). Click **More info → Run anyway**.

### macOS

1. Go to the [**Releases**](https://github.com/AKASHNINJA/cat-companion/releases/latest) page
2. Download `Pixel-Companion-x.x.x.dmg`
3. Open the DMG and drag **Pixel Companion** to your Applications folder
4. On first launch: right-click the app → **Open** (bypasses Gatekeeper for unsigned builds)
5. The companion floats on your desktop — visible over every app

> Supports both Intel and Apple Silicon (M1/M2/M3) Macs.

### Build from Source

```bash
git clone https://github.com/AKASHNINJA/cat-companion.git
cd cat-companion
npm install
npm start                # run in development
npm run build:win        # build Windows .exe
npm run build:mac        # build macOS .dmg  (requires macOS)
```

---

## Project Structure

```
cat-companion/
├── main.js          Electron main process — transparent always-on-top window
├── preload.js       Context bridge — secure IPC between main and renderer
├── companion.html   Floating widget UI shell
├── cat.js           Pixel sprite renderer (Canvas 2D API, HiDPI aware)
├── behaviors.js     Mouse / keyboard / scroll state machine
├── customizer.js    Color & pattern picker panel
├── pomodoro.js      Pomodoro timer logic
├── reminders.js     Stretch reminder scheduler
├── scripts/
│   └── create-icon.js   Generates build/icon.png + icon.ico via Jimp
├── build/           Generated app icons (auto-created on build)
└── .github/
    └── workflows/
        └── build.yml    CI: builds .exe (Windows) + .dmg (macOS) on tag push
```

---

## Contributing

Pull requests welcome! Great areas to contribute:

- New animal sprites (snake? fox? penguin?)
- Additional color palettes or patterns
- New behavior states
- Accessibility improvements

---

## License

MIT © [AKASHNINJA](https://github.com/AKASHNINJA)
