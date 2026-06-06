// pomodoro.js — Pomodoro Timer
'use strict';

class PomodoroTimer {
  constructor({ onComplete, onTick, onBreakStart, onBreakEnd }) {
    this.workDuration = 25 * 60; // seconds
    this.breakDuration = 5 * 60;
    this.remaining = this.workDuration;
    this.isRunning = false;
    this.isBreak = false;
    this.sessionCount = 0;
    this.interval = null;

    this.onComplete = onComplete || (() => {});
    this.onTick = onTick || (() => {});
    this.onBreakStart = onBreakStart || (() => {});
    this.onBreakEnd = onBreakEnd || (() => {});
  }

  setWorkDuration(minutes) {
    this.workDuration = minutes * 60;
    if (!this.isRunning) {
      this.remaining = this.isBreak ? this.breakDuration : this.workDuration;
      this.onTick(this.remaining, this.isBreak);
    }
  }

  setBreakDuration(minutes) {
    this.breakDuration = minutes * 60;
    if (!this.isRunning && this.isBreak) {
      this.remaining = this.breakDuration;
      this.onTick(this.remaining, this.isBreak);
    }
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.interval = setInterval(() => this._tick(), 1000);
  }

  pause() {
    this.isRunning = false;
    clearInterval(this.interval);
  }

  reset() {
    this.pause();
    this.isBreak = false;
    this.remaining = this.workDuration;
    this.onTick(this.remaining, this.isBreak);
  }

  skip() {
    this._complete();
  }

  _tick() {
    this.remaining--;
    this.onTick(this.remaining, this.isBreak);
    if (this.remaining <= 0) {
      this._complete();
    }
  }

  _complete() {
    clearInterval(this.interval);
    this.isRunning = false;

    if (!this.isBreak) {
      this.sessionCount++;
      this.onComplete(this.sessionCount);
      this.isBreak = true;
      this.remaining = this.breakDuration;
      this.onBreakStart(this.sessionCount);
    } else {
      this.isBreak = false;
      this.remaining = this.workDuration;
      this.onBreakEnd();
    }

    this.onTick(this.remaining, this.isBreak);
    // Auto-start next phase
    this.start();
  }

  formatTime(seconds) {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }
}

window.PomodoroTimer = PomodoroTimer;
