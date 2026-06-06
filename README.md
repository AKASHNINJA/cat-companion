# Cat Companion 🐱

A pixel-art cat companion that lives in your browser — inspired by [Comnyang](https://comnyang.com/).

![Cat Companion](https://img.shields.io/badge/Made%20with-%E2%9D%A4%EF%B8%8F-ff69b4)
![License](https://img.shields.io/badge/license-MIT-green)
![HTML](https://img.shields.io/badge/HTML-CSS-JS-blue)

## ✨ Features

- 🖱️ **Mouse Tracking** — Cat's eyes follow your cursor; flips direction to face you
- ⌨️ **Keyboard Reactions** — Cat bobs when you type, goes frantic during fast typing
- 📜 **Scroll Reactions** — Cat leans up or down as you scroll
- 🐾 **Click Interactions** — Click the cat for sparkle celebrations
- 🧘 **Stretch Reminders** — Configurable reminders to stand up and stretch
- 🍅 **Pomodoro Timer** — Built-in work/break cycle timer with configurable durations
- 🎨 **Full Customization** — 8 color palettes × 4 patterns = your own unique cat
- 💾 **Preferences Saved** — Color & pattern persist in localStorage
- 🖱️ **Draggable Widget** — Drag the cat anywhere on screen

## 🐱 Cat States

| State | Trigger |
|-------|---------|
| Idle | Default — gentle breathing + blink |
| Typing | Typing at normal speed |
| Hyper | Typing fast (>3 keys/sec) |
| Sleepy | 10s of inactivity |
| Scrolling | Mouse wheel movement |
| Stretching | Stretch reminder fires |
| Celebrating | Pomodoro session complete / cat click |
| Napping | Pomodoro break mode |

## 🎨 Color Palettes

Black · Orange · Grey · Cream · Siamese · Calico · Tuxedo · Lavender

## 🛠️ Tech Stack

Pure HTML + CSS + JavaScript — no frameworks, no dependencies.

## 🚀 Getting Started

Just open `index.html` in any modern browser. No build step required!

```bash
git clone https://github.com/AKASHNINJA/cat-companion.git
cd cat-companion
# Open index.html in your browser
```

Or serve it locally:
```bash
npx serve .
# → http://localhost:3000
```

## 📁 Project Structure

```
cat-companion/
├── index.html      # Main shell + UI layout
├── style.css       # Design system (dark theme, pixel aesthetic)
├── cat.js          # Pixel sprite renderer (Canvas API)
├── behaviors.js    # Mouse/keyboard/scroll state machine
├── pomodoro.js     # Pomodoro timer logic
├── reminders.js    # Stretch reminder system
├── customizer.js   # Color/pattern customization panel
└── app.js          # Orchestrator — wires everything together
```

## 🤝 Contributing

Pull requests welcome! Feel free to add new cat colors, patterns, or behaviors.

## 📄 License

MIT © [AKASHNINJA](https://github.com/AKASHNINJA)
