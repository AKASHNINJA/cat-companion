// reminders.js — Stretch reminder system
'use strict';

class StretchReminder {
  constructor({ onStretch }) {
    this.interval = 30 * 60 * 1000; // 30 minutes default
    this.lastActivity = Date.now();
    this.lastReminder = Date.now();
    this.activityTimer = null;
    this.onStretch = onStretch || (() => {});
    this.enabled = true;
    this._startTracking();
  }

  setInterval(minutes) {
    this.interval = minutes * 60 * 1000;
    this.lastReminder = Date.now(); // reset
  }

  setEnabled(enabled) {
    this.enabled = enabled;
  }

  recordActivity() {
    this.lastActivity = Date.now();
  }

  _startTracking() {
    // Check every minute
    setInterval(() => {
      if (!this.enabled) return;
      const now = Date.now();
      const timeSinceReminder = now - this.lastReminder;
      const timeSinceActivity = now - this.lastActivity;

      // Only remind if user has been active AND interval has passed
      if (timeSinceReminder >= this.interval && timeSinceActivity < 5 * 60 * 1000) {
        this.lastReminder = now;
        this.onStretch();
      }
    }, 60 * 1000);

    // Also track activity
    document.addEventListener('mousemove', () => this.recordActivity(), { passive: true });
    document.addEventListener('keydown', () => this.recordActivity());
  }
}

window.StretchReminder = StretchReminder;
