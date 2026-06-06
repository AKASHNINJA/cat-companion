// behaviors.js — Cat behavior state machine
'use strict';

class BehaviorEngine {
  constructor(catRenderer) {
    this.cat = catRenderer;
    this.state = 'idle';
    this.mouseX = 0;
    this.mouseY = 0;
    this.lastMouseX = 0;
    this.lastMouseY = 0;
    this.mouseVelocity = 0;
    this.typingRate = 0; // keystrokes per second
    this.keystrokeBuffer = [];
    this.lastScrollTime = 0;
    this.scrollDir = 0;
    this.scrollVelocity = 0;
    this.idleTimer = 0;
    this.animFrame = 0;
    this.stateTimer = 0;
    this.blinkTimer = Math.random() * 200 + 100;
    this.isBlinking = false;
    this.frameCount = 0;
    this.lastStateLock = 0; // prevent rapid state switches

    this._bindEvents();
    this._loop();
  }

  _bindEvents() {
    // Mouse tracking
    document.addEventListener('mousemove', (e) => {
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;
    });

    document.addEventListener('click', () => {
      if (this.state !== 'excited' && this.state !== 'celebrating' && this.state !== 'stretching') {
        this._setState('swipe', 40);
      }
    });

    // Keyboard tracking
    document.addEventListener('keydown', (e) => {
      const now = Date.now();
      this.keystrokeBuffer.push(now);
      // Keep only last 3 seconds
      this.keystrokeBuffer = this.keystrokeBuffer.filter(t => now - t < 3000);
      this.typingRate = this.keystrokeBuffer.length / 3;
      this.idleTimer = 0;
    });

    // Scroll tracking
    window.addEventListener('wheel', (e) => {
      this.scrollDir = e.deltaY > 0 ? 1 : -1;
      this.scrollVelocity = Math.abs(e.deltaY);
      this.lastScrollTime = Date.now();
      this.idleTimer = 0;
    }, { passive: true });
  }

  _setState(state, lockFrames = 0) {
    if (this.frameCount < this.lastStateLock) return;
    this.state = state;
    this.animFrame = 0;
    this.stateTimer = 0;
    if (lockFrames > 0) {
      this.lastStateLock = this.frameCount + lockFrames;
    }
  }

  _forcState(state) {
    this.state = state;
    this.animFrame = 0;
    this.stateTimer = 0;
    this.lastStateLock = this.frameCount;
  }

  // Called externally to trigger stretch
  triggerStretch() {
    this._forcState('stretching');
    this.lastStateLock = this.frameCount + 120;
  }

  // Called externally to trigger celebration
  triggerCelebrate() {
    this._forcState('celebrating');
    this.lastStateLock = this.frameCount + 100;
  }

  // Called externally to trigger nap (break mode)
  triggerNap() {
    this._forcState('napping');
    this.lastStateLock = 0;
  }

  _update() {
    this.frameCount++;
    this.stateTimer++;

    // Mouse velocity
    const dx = this.mouseX - this.lastMouseX;
    const dy = this.mouseY - this.lastMouseY;
    this.mouseVelocity = Math.sqrt(dx * dx + dy * dy);
    this.lastMouseX = this.mouseX;
    this.lastMouseY = this.mouseY;

    // Idle tracking
    if (this.typingRate < 0.1 && this.mouseVelocity < 2 && Date.now() - this.lastScrollTime > 3000) {
      this.idleTimer++;
    } else {
      this.idleTimer = 0;
    }

    // State machine
    if (this.frameCount >= this.lastStateLock) {
      // Scroll reactions (take priority)
      const timeSinceScroll = Date.now() - this.lastScrollTime;
      if (timeSinceScroll < 500) {
        if (this.scrollDir < 0) {
          this._setState('scroll_up', 30);
        } else {
          this._setState('scroll_down', 30);
        }
      }
      // Typing reactions
      else if (this.typingRate > 3) {
        this._setState('excited', 0);
      } else if (this.typingRate > 0.5) {
        this._setState('typing', 0);
      }
      // Idle / sleep
      else if (this.idleTimer > 600) { // 10 seconds at 60fps
        this._setState('sleeping', 0);
      } else {
        this._setState('idle', 0);
      }
    }

    // Determine mouse direction for cat flip
    const catEl = document.getElementById('cat-widget');
    if (catEl) {
      const rect = catEl.getBoundingClientRect();
      const catCenterX = rect.left + rect.width / 2;
      this.cat.setFlip(this.mouseX < catCenterX);
    }

    // Blink logic (only in idle/looking states)
    if (['idle', 'look_left', 'look_right'].includes(this.state)) {
      this.blinkTimer--;
      if (this.blinkTimer <= 0) {
        this.isBlinking = true;
        this.blinkTimer = Math.random() * 200 + 100;
        setTimeout(() => { this.isBlinking = false; }, 150);
      }
    }

    // Render appropriate sprite
    this._renderState();
  }

  _renderState() {
    const f = this.animFrame;

    if (this.isBlinking) {
      this.cat.setSprite('blink');
      return;
    }

    switch (this.state) {
      case 'idle':
        this.cat.setSprite(f < 30 ? 'idle_0' : 'idle_1');
        if (f >= 60) this.animFrame = 0;
        break;

      case 'typing':
        this.cat.setSprite(f < 10 ? 'type_0' : 'type_1');
        if (f >= 20) this.animFrame = 0;
        break;

      case 'excited':
        this.cat.setSprite(f < 8 ? 'excited_0' : 'excited_1');
        if (f >= 16) this.animFrame = 0;
        break;

      case 'swipe':
        this.cat.setSprite('swipe');
        if (f >= 40) this._setState('idle');
        break;

      case 'scroll_up':
        this.cat.setSprite('scroll_up');
        break;

      case 'scroll_down':
        this.cat.setSprite('scroll_down');
        break;

      case 'sleeping':
        this.cat.setSprite(f < 60 ? 'sleep_0' : 'sleep_1');
        if (f >= 120) this.animFrame = 0;
        break;

      case 'stretching':
        this.cat.setSprite('stretch');
        if (f >= 120) this._setState('idle');
        break;

      case 'celebrating':
        this.cat.setSprite(f < 15 ? 'celebrate' : f < 30 ? 'idle_0' : f < 45 ? 'celebrate' : 'idle_0');
        if (f >= 100) this._setState('idle');
        break;

      case 'napping':
        this.cat.setSprite(f < 60 ? 'nap' : 'sleep_0');
        if (f >= 120) this.animFrame = 0;
        break;

      default:
        this.cat.setSprite('idle_0');
    }

    this.animFrame++;
  }

  _loop() {
    this._update();
    requestAnimationFrame(() => this._loop());
  }
}

window.BehaviorEngine = BehaviorEngine;
