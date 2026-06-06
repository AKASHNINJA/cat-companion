// app.js — Main orchestrator
'use strict';

document.addEventListener('DOMContentLoaded', () => {

  // ── Cat Renderer ──────────────────────────────────────────────
  const canvas = document.getElementById('cat-canvas');
  const cat = new CatRenderer(canvas);

  // ── Behavior Engine ───────────────────────────────────────────
  const behavior = new BehaviorEngine(cat);

  // ── Customizer ────────────────────────────────────────────────
  const customizer = new CatCustomizer(cat);

  // ── Stretch Reminder ──────────────────────────────────────────
  const reminder = new StretchReminder({
    onStretch: () => {
      behavior.triggerStretch();
      showStretchToast();
    }
  });

  // ── Pomodoro Timer ────────────────────────────────────────────
  const pomEl = {
    display: document.getElementById('pomo-time'),
    label: document.getElementById('pomo-label'),
    startBtn: document.getElementById('pomo-start'),
    resetBtn: document.getElementById('pomo-reset'),
    skipBtn: document.getElementById('pomo-skip'),
    sessions: document.getElementById('pomo-sessions'),
    progress: document.getElementById('pomo-progress'),
  };

  const pomo = new PomodoroTimer({
    onTick(remaining, isBreak) {
      if (pomEl.display) pomEl.display.textContent = pomo.formatTime(remaining);
      if (pomEl.label) pomEl.label.textContent = isBreak ? 'BREAK' : 'FOCUS';
      if (pomEl.label) pomEl.label.className = 'pomo-label' + (isBreak ? ' break' : ' focus');

      const total = isBreak ? pomo.breakDuration : pomo.workDuration;
      const pct = ((total - remaining) / total) * 100;
      if (pomEl.progress) pomEl.progress.style.setProperty('--pct', pct + '%');
    },
    onComplete(count) {
      behavior.triggerCelebrate();
      showToast(`🎉 Session ${count} complete! Take a break.`, 'success');
      if (pomEl.sessions) pomEl.sessions.textContent = count;
    },
    onBreakStart() {
      behavior.triggerNap();
      if (pomEl.startBtn) pomEl.startBtn.textContent = 'PAUSE';
    },
    onBreakEnd() {
      showToast('⏰ Break over! Back to work.', 'info');
      if (pomEl.startBtn) pomEl.startBtn.textContent = 'PAUSE';
    },
  });

  // Pomodoro button handlers
  if (pomEl.startBtn) {
    pomEl.startBtn.addEventListener('click', () => {
      if (pomo.isRunning) {
        pomo.pause();
        pomEl.startBtn.textContent = 'START';
      } else {
        pomo.start();
        pomEl.startBtn.textContent = 'PAUSE';
      }
    });
  }
  if (pomEl.resetBtn) {
    pomEl.resetBtn.addEventListener('click', () => {
      pomo.reset();
      if (pomEl.startBtn) pomEl.startBtn.textContent = 'START';
    });
  }
  if (pomEl.skipBtn) {
    pomEl.skipBtn.addEventListener('click', () => pomo.skip());
  }

  // Pomodoro settings
  const workInput = document.getElementById('pomo-work-input');
  const breakInput = document.getElementById('pomo-break-input');
  if (workInput) {
    workInput.value = pomo.workDuration / 60;
    workInput.addEventListener('change', () => {
      const v = Math.max(1, Math.min(90, parseInt(workInput.value) || 25));
      workInput.value = v;
      pomo.setWorkDuration(v);
    });
  }
  if (breakInput) {
    breakInput.value = pomo.breakDuration / 60;
    breakInput.addEventListener('change', () => {
      const v = Math.max(1, Math.min(30, parseInt(breakInput.value) || 5));
      breakInput.value = v;
      pomo.setBreakDuration(v);
    });
  }

  // Stretch reminder settings
  const stretchInput = document.getElementById('stretch-interval-input');
  if (stretchInput) {
    stretchInput.value = 30;
    stretchInput.addEventListener('change', () => {
      const v = Math.max(5, Math.min(120, parseInt(stretchInput.value) || 30));
      stretchInput.value = v;
      reminder.setInterval(v);
    });
  }

  // Test stretch button
  const testStretchBtn = document.getElementById('test-stretch-btn');
  if (testStretchBtn) {
    testStretchBtn.addEventListener('click', () => {
      behavior.triggerStretch();
      showStretchToast();
    });
  }

  // ── Settings Panel Toggle ─────────────────────────────────────
  const settingsBtn = document.getElementById('settings-btn');
  const settingsPanel = document.getElementById('settings-panel');
  if (settingsBtn && settingsPanel) {
    settingsBtn.addEventListener('click', () => {
      const isOpen = settingsPanel.classList.toggle('open');
      settingsBtn.setAttribute('aria-expanded', isOpen);
      settingsBtn.classList.toggle('active', isOpen);
    });
    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!settingsPanel.contains(e.target) && !settingsBtn.contains(e.target)) {
        settingsPanel.classList.remove('open');
        settingsBtn.setAttribute('aria-expanded', false);
        settingsBtn.classList.remove('active');
      }
    });
  }

  // ── Toast Notifications ───────────────────────────────────────
  function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    container.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('visible'));
    setTimeout(() => {
      toast.classList.remove('visible');
      setTimeout(() => toast.remove(), 400);
    }, 4000);
  }

  function showStretchToast() {
    const messages = [
      '🐱 Time to stretch! Your cat demands it.',
      '🐈 Meow! Stand up and stretch your body.',
      '😸 Your pixel cat says: Take a stretch break!',
      '🐾 Paws for a moment — stretch time!',
    ];
    showToast(messages[Math.floor(Math.random() * messages.length)], 'stretch');
  }

  // ── Cat widget drag (make it draggable) ──────────────────────
  const catWidget = document.getElementById('cat-widget');
  if (catWidget) {
    let isDragging = false, startX, startY, origLeft, origBottom;
    catWidget.addEventListener('mousedown', (e) => {
      if (e.target.closest('button')) return;
      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
      const rect = catWidget.getBoundingClientRect();
      origLeft = rect.left;
      origBottom = window.innerHeight - rect.bottom;
      catWidget.style.transition = 'none';
      e.preventDefault();
    });
    document.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      catWidget.style.left = Math.max(0, Math.min(window.innerWidth - catWidget.offsetWidth, origLeft + dx)) + 'px';
      catWidget.style.bottom = Math.max(0, Math.min(window.innerHeight - catWidget.offsetHeight, origBottom - dy)) + 'px';
      catWidget.style.right = 'auto';
    });
    document.addEventListener('mouseup', () => {
      isDragging = false;
      catWidget.style.transition = '';
    });
  }

  // ── Particle / sparkle on cat click ──────────────────────────
  canvas.addEventListener('click', (e) => {
    spawnSparkles(e.clientX, e.clientY);
    behavior.triggerCelebrate();
  });

  function spawnSparkles(x, y) {
    const emojis = ['✨','⭐','🐾','💫','🌟'];
    for (let i = 0; i < 6; i++) {
      const el = document.createElement('div');
      el.className = 'sparkle';
      el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      el.style.cssText = `left:${x}px;top:${y}px;--dx:${(Math.random()-0.5)*80}px;--dy:${-Math.random()*80-20}px`;
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 1000);
    }
  }

  // ── Mood indicator ────────────────────────────────────────────
  const moodEl = document.getElementById('cat-mood');
  setInterval(() => {
    if (!moodEl) return;
    const moods = {
      idle: '😊 Content', typing: '😤 Focused', excited: '🤩 Hyper!',
      sleeping: '😴 Sleepy', stretching: '🧘 Stretching', celebrating: '🎉 Happy!',
      napping: '💤 Napping', scroll_up: '👆 Curious', scroll_down: '👇 Curious',
      swipe: '🐾 Playful',
    };
    moodEl.textContent = moods[behavior.state] || '😊 Content';
  }, 500);

  // Initial render
  cat.render();
});
