'use strict';

class CatCustomizer {
  constructor(catRenderer, { onChange } = {}) {
    this.cat = catRenderer;
    this.onChange = onChange || (() => {});
    this.currentPalette = 'orange';
    this.currentPattern = 'solid';
    this.currentAnimal  = 'cat';
    this._loadPrefs();
    this._buildPanel();
    this._applyToRenderer();
  }

  _loadPrefs() {
    try {
      const saved = JSON.parse(localStorage.getItem('cat-companion-prefs') || '{}');
      if (saved.palette && window.CAT_PALETTES[saved.palette]) this.currentPalette = saved.palette;
      if (saved.pattern && window.CAT_PATTERNS[saved.pattern]) this.currentPattern = saved.pattern;
      if (saved.animal  && window.CAT_ANIMALS[saved.animal])   this.currentAnimal  = saved.animal;
    } catch(e) {}
  }

  _savePrefs() {
    localStorage.setItem('cat-companion-prefs', JSON.stringify({
      palette: this.currentPalette,
      pattern: this.currentPattern,
      animal:  this.currentAnimal,
    }));
  }

  _applyToRenderer() {
    this.cat.setAnimal(this.currentAnimal);
    this.cat.setPalette(this.currentPalette);
    this.cat.setPattern(this.currentPattern);
    this.cat.render();
    this.onChange({ palette: this.currentPalette, pattern: this.currentPattern, animal: this.currentAnimal });
  }

  _buildPanel() {
    const panel = document.getElementById('settings-panel');
    if (!panel) return;

    // Animal picker
    const animalGrid = panel.querySelector('#animal-grid');
    if (animalGrid) {
      animalGrid.innerHTML = '';
      for (const [key, anim] of Object.entries(window.CAT_ANIMALS)) {
        const btn = document.createElement('button');
        btn.className = 'animal-btn' + (key === this.currentAnimal ? ' active' : '');
        btn.id = `animal-${key}`;
        btn.innerHTML = `<span class="animal-emoji">${anim.emoji}</span><span class="animal-label">${anim.name}</span>`;
        btn.setAttribute('aria-label', `${anim.name} companion`);
        btn.addEventListener('click', () => {
          this.currentAnimal = key;
          document.querySelectorAll('.animal-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          this._applyToRenderer();
          this._savePrefs();
        });
        animalGrid.appendChild(btn);
      }
    }

    // Color swatches
    const colorGrid = panel.querySelector('#color-grid');
    if (colorGrid) {
      colorGrid.innerHTML = '';
      for (const [key, pal] of Object.entries(window.CAT_PALETTES)) {
        const swatch = document.createElement('button');
        swatch.className = 'color-swatch' + (key === this.currentPalette ? ' active' : '');
        swatch.id = `swatch-${key}`;
        swatch.title = pal.name;
        swatch.style.background = `linear-gradient(135deg, ${pal.body} 50%, ${pal.belly} 50%)`;
        swatch.setAttribute('aria-label', `${pal.name} color`);
        swatch.addEventListener('click', () => {
          this.currentPalette = key;
          document.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('active'));
          swatch.classList.add('active');
          this._applyToRenderer();
          this._savePrefs();
        });
        colorGrid.appendChild(swatch);
      }
    }

    // Pattern buttons
    const patternGrid = panel.querySelector('#pattern-grid');
    if (patternGrid) {
      patternGrid.innerHTML = '';
      for (const [key, pat] of Object.entries(window.CAT_PATTERNS)) {
        const btn = document.createElement('button');
        btn.className = 'pattern-btn' + (key === this.currentPattern ? ' active' : '');
        btn.id = `pattern-${key}`;
        btn.textContent = pat.name;
        btn.setAttribute('aria-label', `${pat.name} pattern`);
        btn.addEventListener('click', () => {
          this.currentPattern = key;
          document.querySelectorAll('.pattern-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          this._applyToRenderer();
          this._savePrefs();
        });
        patternGrid.appendChild(btn);
      }
    }
  }
}

window.CatCustomizer = CatCustomizer;
