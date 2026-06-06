// cat.js — Cute Cat Renderer using Canvas 2D API (crisp at any DPR)
'use strict';

const PALETTES = {
  orange:   { body:'#E8803A', belly:'#FDDCB0', outline:'#7A3510', iris:'#27AE60', pupil:'#0a0a0a', hilight:'#ffffff', nose:'#FF6B9D', innerEar:'#FFB5C8', stripe:'#C05A18', name:'Orange' },
  black:    { body:'#2e2e2e', belly:'#555555', outline:'#0a0a0a', iris:'#4FC3F7', pupil:'#0a0a0a', hilight:'#ffffff', nose:'#CC6688', innerEar:'#bb7799', stripe:'#111111', name:'Black'  },
  grey:     { body:'#8A8FA0', belly:'#CFD4E0', outline:'#3A3D50', iris:'#5B9BD5', pupil:'#0a0a0a', hilight:'#ffffff', nose:'#CC6688', innerEar:'#FFB5C8', stripe:'#6A7080', name:'Grey'   },
  cream:    { body:'#F5E6C8', belly:'#FFFDF5', outline:'#8B7355', iris:'#8B4513', pupil:'#0a0a0a', hilight:'#ffffff', nose:'#F48FB1', innerEar:'#FFD0DC', stripe:'#D4C4A0', name:'Cream'  },
  siamese:  { body:'#F5E0C3', belly:'#FFFCF5', outline:'#5D4037', iris:'#1565C0', pupil:'#0a0a0a', hilight:'#ffffff', nose:'#F48FB1', innerEar:'#FFD0DC', stripe:'#8D6E63', name:'Siamese'},
  calico:   { body:'#F0D5A0', belly:'#FFFFFF', outline:'#333333', iris:'#4CAF50', pupil:'#0a0a0a', hilight:'#ffffff', nose:'#F48FB1', innerEar:'#FFB5C8', stripe:'#E07020', name:'Calico' },
  tuxedo:   { body:'#1a1a1a', belly:'#F5F5F5', outline:'#000000', iris:'#4CAF50', pupil:'#0a0a0a', hilight:'#ffffff', nose:'#F48FB1', innerEar:'#994466', stripe:'#000000', name:'Tuxedo' },
  lavender: { body:'#C9B8E8', belly:'#EDE8F7', outline:'#6A5ACD', iris:'#8B4513', pupil:'#0a0a0a', hilight:'#ffffff', nose:'#F48FB1', innerEar:'#E8D0FF', stripe:'#9D88CC', name:'Lavender'},
};

const PATTERNS = {
  solid:   { name:'Solid'   },
  tabby:   { name:'Tabby'   },
  spotted: { name:'Spotted' },
  tuxedo:  { name:'Tuxedo'  },
};

// Each entry describes a drawing state (not a pixel frame)
const SPRITE_PARAMS = {
  idle_0:      { pose:'sit',     eyes:'open',    eyeShift:{x:0,y:0},  paws:'rest',     tailA:0.3,  mouth:'neutral', fx:[]           },
  idle_1:      { pose:'sit',     eyes:'open',    eyeShift:{x:0,y:0},  paws:'rest',     tailA:0.7,  mouth:'neutral', fx:[]           },
  blink:       { pose:'sit',     eyes:'closed',  eyeShift:{x:0,y:0},  paws:'rest',     tailA:0.5,  mouth:'neutral', fx:[]           },
  look_right:  { pose:'sit',     eyes:'open',    eyeShift:{x:4,y:0},  paws:'rest',     tailA:0.4,  mouth:'neutral', fx:[]           },
  look_left:   { pose:'sit',     eyes:'open',    eyeShift:{x:-4,y:0}, paws:'rest',     tailA:0.4,  mouth:'neutral', fx:[]           },
  type_0:      { pose:'sit',     eyes:'focused', eyeShift:{x:0,y:1},  paws:'type_r',   tailA:0.4,  mouth:'neutral', fx:[]           },
  type_1:      { pose:'sit',     eyes:'focused', eyeShift:{x:0,y:1},  paws:'type_l',   tailA:0.4,  mouth:'neutral', fx:[]           },
  excited_0:   { pose:'sit_up',  eyes:'wide',    eyeShift:{x:0,y:0},  paws:'up_r',     tailA:1.0,  mouth:'open',    fx:['steam']    },
  excited_1:   { pose:'sit_up',  eyes:'wide',    eyeShift:{x:0,y:0},  paws:'up_l',     tailA:-1.0, mouth:'open',    fx:['steam']    },
  sleep_0:     { pose:'curl',    eyes:'sleep',   eyeShift:{x:0,y:0},  paws:'tuck',     tailA:0.2,  mouth:'neutral', fx:[]           },
  sleep_1:     { pose:'curl',    eyes:'sleep',   eyeShift:{x:0,y:0},  paws:'tuck',     tailA:0.3,  mouth:'neutral', fx:['zzz']      },
  stretch:     { pose:'stretch', eyes:'squint',  eyeShift:{x:0,y:0},  paws:'extend',   tailA:1.0,  mouth:'open_sm', fx:[]           },
  celebrate:   { pose:'sit_up',  eyes:'happy',   eyeShift:{x:0,y:0},  paws:'both_up',  tailA:1.0,  mouth:'smile',   fx:['stars']    },
  nap:         { pose:'curl',    eyes:'sleep',   eyeShift:{x:0,y:0},  paws:'tuck',     tailA:0.2,  mouth:'neutral', fx:['zzz_sm']   },
  scroll_up:   { pose:'sit',     eyes:'open',    eyeShift:{x:0,y:-5}, paws:'rest',     tailA:0.4,  mouth:'neutral', fx:[]           },
  scroll_down: { pose:'sit',     eyes:'open',    eyeShift:{x:0,y:5},  paws:'rest',     tailA:0.4,  mouth:'neutral', fx:[]           },
  swipe:       { pose:'sit',     eyes:'wide',    eyeShift:{x:3,y:0},  paws:'swipe',    tailA:0.8,  mouth:'open',    fx:[]           },
};

class CatRenderer {
  constructor(canvas) {
    this.canvas  = canvas;
    this.ctx     = canvas.getContext('2d');
    this.palette = PALETTES.orange;
    this.pattern = 'solid';
    this.currentSprite = 'idle_0';
    this.flipX   = false;

    // HiDPI support — canvas drawn at device resolution, CSS at logical size
    const dpr = window.devicePixelRatio || 1;
    this.dpr = dpr;
    this.W = 110; // logical CSS pixels
    this.H = 130;

    canvas.width  = this.W * dpr;
    canvas.height = this.H * dpr;
    canvas.style.width  = this.W + 'px';
    canvas.style.height = this.H + 'px';
    this.ctx.scale(dpr, dpr);
  }

  setPalette(name) { if (PALETTES[name]) { this.palette = PALETTES[name]; this.render(); } }
  setPattern(name) { if (PATTERNS[name]) { this.pattern = name; this.render(); } }
  setSprite(name)  { if (SPRITE_PARAMS[name]) { this.currentSprite = name; this.render(); } }
  setFlip(flip)    { this.flipX = flip; this.render(); }

  render() {
    const ctx = this.ctx;
    const { W, H, palette, pattern, flipX } = this;
    const p = SPRITE_PARAMS[this.currentSprite] || SPRITE_PARAMS.idle_0;

    ctx.clearRect(0, 0, W, H);

    if (flipX) { ctx.save(); ctx.translate(W, 0); ctx.scale(-1, 1); }

    this._tail(ctx, p, palette);
    this._body(ctx, p, palette, pattern);
    this._head(ctx, p, palette, pattern);
    this._ears(ctx, p, palette);
    this._paws(ctx, p, palette);
    this._eyes(ctx, p, palette);
    this._nose(ctx, p, palette);
    this._mouth(ctx, p, palette);
    this._whiskers(ctx, p, palette);
    this._effects(ctx, p);

    if (flipX) ctx.restore();
  }

  /* ── Helpers ─────────────────────────────────────────── */

  _rr(ctx, x, y, w, h, r) {
    r = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y,     x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x,     y + h, r);
    ctx.arcTo(x,     y + h, x,     y,     r);
    ctx.arcTo(x,     y,     x + w, y,     r);
    ctx.closePath();
  }

  /* ── Tail ────────────────────────────────────────────── */
  _tail(ctx, p, palette) {
    if (p.pose === 'curl') return;
    const { body, outline } = palette;
    const a = p.tailA;
    const sx = 88, sy = 108;
    const cx = 108 + a * 10, cy = 82 + a * 8;
    const ex = 100 + a * 4,  ey = 62 - a * 10;

    ctx.lineCap = 'round';

    ctx.strokeStyle = outline; ctx.lineWidth = 10;
    ctx.beginPath(); ctx.moveTo(sx, sy); ctx.quadraticCurveTo(cx, cy, ex, ey); ctx.stroke();

    ctx.strokeStyle = body; ctx.lineWidth = 7;
    ctx.beginPath(); ctx.moveTo(sx, sy); ctx.quadraticCurveTo(cx, cy, ex, ey); ctx.stroke();

    // Fluffy tip
    ctx.fillStyle = body; ctx.strokeStyle = outline; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(ex, ey, 6, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  }

  /* ── Body ────────────────────────────────────────────── */
  _body(ctx, p, palette, pattern) {
    const { body, belly, outline, stripe } = palette;

    /* Curl (sleeping) */
    if (p.pose === 'curl') {
      ctx.fillStyle = body; ctx.strokeStyle = outline; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.ellipse(55, 108, 42, 26, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

      if (pattern === 'tabby')   this._tabby(ctx, 14, 85, 82, 48, stripe);
      if (pattern === 'spotted') this._spots(ctx, 14, 85, 82, 48, stripe);

      ctx.fillStyle = belly;
      ctx.beginPath(); ctx.ellipse(55, 110, 25, 16, 0, 0, Math.PI * 2); ctx.fill();

      // Curl tail drawn over body
      ctx.lineCap = 'round';
      ctx.strokeStyle = outline; ctx.lineWidth = 9;
      ctx.beginPath(); ctx.arc(55, 108, 36, 0.35, Math.PI * 1.65); ctx.stroke();
      ctx.strokeStyle = body; ctx.lineWidth = 6;
      ctx.beginPath(); ctx.arc(55, 108, 36, 0.35, Math.PI * 1.65); ctx.stroke();
      return;
    }

    /* Stretch */
    if (p.pose === 'stretch') {
      ctx.fillStyle = body; ctx.strokeStyle = outline; ctx.lineWidth = 3;
      this._rr(ctx, 4, 86, 102, 44, 13); ctx.fill(); ctx.stroke();
      if (pattern === 'tabby')   this._tabby(ctx, 4, 86, 102, 44, stripe);
      if (pattern === 'spotted') this._spots(ctx, 4, 86, 102, 44, stripe);
      ctx.fillStyle = belly;
      ctx.beginPath(); ctx.ellipse(55, 106, 30, 18, 0, 0, Math.PI * 2); ctx.fill();
      return;
    }

    /* Normal sit / sit_up */
    const by = p.pose === 'sit_up' ? 86 : 90;
    ctx.fillStyle = body; ctx.strokeStyle = outline; ctx.lineWidth = 3;
    this._rr(ctx, 18, by, 74, 40, 14); ctx.fill(); ctx.stroke();

    if (pattern === 'tabby')   this._tabby(ctx, 18, by, 74, 40, stripe);
    if (pattern === 'spotted') this._spots(ctx, 18, by, 74, 40, stripe);
    if (pattern === 'tuxedo') {
      ctx.fillStyle = palette.belly;
      ctx.beginPath(); ctx.ellipse(55, by + 16, 15, 22, 0, 0, Math.PI * 2); ctx.fill();
    }

    ctx.fillStyle = belly;
    ctx.beginPath(); ctx.ellipse(55, by + 22, 22, 15, 0, 0, Math.PI * 2); ctx.fill();
  }

  _tabby(ctx, x, y, w, h, color) {
    ctx.save(); ctx.globalAlpha = 0.38; ctx.fillStyle = color;
    for (let i = 0; i < 3; i++) ctx.fillRect(x + 6, y + 5 + i * 13, w - 12, 5);
    ctx.restore();
  }

  _spots(ctx, x, y, w, h, color) {
    ctx.save(); ctx.globalAlpha = 0.45; ctx.fillStyle = color;
    [{cx:x+18,cy:y+12,r:8},{cx:x+52,cy:y+9,r:6},{cx:x+70,cy:y+22,r:7},{cx:x+32,cy:y+30,r:6}]
      .forEach(s => { ctx.beginPath(); ctx.arc(s.cx,s.cy,s.r,0,Math.PI*2); ctx.fill(); });
    ctx.restore();
  }

  /* ── Head ────────────────────────────────────────────── */
  _head(ctx, p, palette, pattern) {
    const { body, outline, stripe } = palette;

    if (p.pose === 'curl') {
      // Slightly tilted head tucked on body
      ctx.save(); ctx.translate(57, 95); ctx.rotate(0.15); ctx.translate(-57, -95);
      ctx.fillStyle = body; ctx.strokeStyle = outline; ctx.lineWidth = 3;
      this._rr(ctx, 24, 70, 64, 52, 18); ctx.fill(); ctx.stroke();
      if (pattern === 'tabby') {
        ctx.save(); ctx.globalAlpha = 0.38; ctx.fillStyle = stripe;
        ctx.fillRect(28, 74, 56, 4); ctx.fillRect(28, 83, 48, 4);
        ctx.restore();
      }
      ctx.restore();
      return;
    }

    ctx.fillStyle = body; ctx.strokeStyle = outline; ctx.lineWidth = 3;
    this._rr(ctx, 8, 22, 94, 70, 22); ctx.fill(); ctx.stroke();

    if (pattern === 'tabby') {
      ctx.save(); ctx.globalAlpha = 0.38; ctx.fillStyle = stripe;
      ctx.fillRect(28, 26, 54, 4);
      ctx.fillRect(24, 34, 62, 4);
      ctx.restore();
    }
  }

  /* ── Ears ────────────────────────────────────────────── */
  _ears(ctx, p, palette) {
    const { body, outline, innerEar } = palette;

    const drawEar = (tip, b1, b2) => {
      ctx.fillStyle = body; ctx.strokeStyle = outline; ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.moveTo(b1[0],b1[1]); ctx.lineTo(tip[0],tip[1]); ctx.lineTo(b2[0],b2[1]); ctx.closePath();
      ctx.fill(); ctx.stroke();
      // Inner ear (inset triangle)
      const pad = 0.28;
      const [ix,iy] = [(b1[0]+b2[0]+tip[0])/3, (b1[1]+b2[1]+tip[1])/3];
      const lerp = (a,b,t) => a+(b-a)*t;
      ctx.fillStyle = innerEar;
      ctx.beginPath();
      ctx.moveTo(lerp(b1[0],ix,pad),  lerp(b1[1],iy,pad));
      ctx.lineTo(lerp(tip[0],ix,0.15),lerp(tip[1],iy,0.15));
      ctx.lineTo(lerp(b2[0],ix,pad),  lerp(b2[1],iy,pad));
      ctx.closePath(); ctx.fill();
    };

    if (p.pose === 'curl') {
      ctx.save(); ctx.translate(57, 95); ctx.rotate(0.15); ctx.translate(-57, -95);
      drawEar([30,70], [24,80], [48,76]);
      drawEar([76,70], [60,76], [82,80]);
      ctx.restore();
      return;
    }

    drawEar([22,4],  [8,28],  [42,26]); // left
    drawEar([88,4],  [68,26], [102,28]); // right
  }

  /* ── Paws ────────────────────────────────────────────── */
  _paws(ctx, p, palette) {
    const { body, outline } = palette;

    if (p.pose === 'curl') {
      ctx.fillStyle = body; ctx.strokeStyle = outline; ctx.lineWidth = 2;
      this._rr(ctx, 30, 125, 20, 12, 6); ctx.fill(); ctx.stroke();
      this._rr(ctx, 60, 125, 20, 12, 6); ctx.fill(); ctx.stroke();
      return;
    }

    const drawPaw = (x, y, rotDeg = 0, liftPx = 0) => {
      ctx.save();
      const cx = x + 11, cy = y + 7;
      ctx.translate(cx, cy - liftPx); ctx.rotate(rotDeg * Math.PI / 180); ctx.translate(-cx, -cy + liftPx);
      ctx.fillStyle = body; ctx.strokeStyle = outline; ctx.lineWidth = 2.5;
      this._rr(ctx, x, y - liftPx, 22, 14, 7); ctx.fill(); ctx.stroke();
      // Toe dividers
      ctx.strokeStyle = outline; ctx.lineWidth = 1.2; ctx.globalAlpha = 0.38; ctx.lineCap = 'round';
      [x+6,x+11,x+16].forEach(tx => { ctx.beginPath(); ctx.moveTo(tx,y-liftPx+2); ctx.lineTo(tx,y-liftPx+10); ctx.stroke(); });
      ctx.globalAlpha = 1;
      ctx.restore();
    };

    const lx = p.pose==='stretch'?2:14, rx = p.pose==='stretch'?86:74;
    const py = p.pose==='stretch'?126:p.pose==='sit_up'?124:124;

    switch (p.paws) {
      case 'rest':     drawPaw(lx,py); drawPaw(rx,py); break;
      case 'type_r':   drawPaw(lx,py); drawPaw(rx,py,-30,14); break;
      case 'type_l':   drawPaw(lx,py,30,14); drawPaw(rx,py); break;
      case 'up_r':     drawPaw(lx,py); drawPaw(rx,py,-25,18); break;
      case 'up_l':     drawPaw(lx,py,25,18); drawPaw(rx,py); break;
      case 'both_up':  drawPaw(lx,py,-30,20); drawPaw(rx,py,30,20); break;
      case 'swipe':    drawPaw(lx,py); drawPaw(rx+6,py-20,-40,0); break;
      case 'extend':   drawPaw(lx,py); drawPaw(rx,py); break;
      default:         drawPaw(lx,py); drawPaw(rx,py);
    }
  }

  /* ── Eyes ────────────────────────────────────────────── */
  _eyes(ctx, p, palette) {
    const { iris, pupil, hilight, outline, body } = palette;
    const { eyes, eyeShift: s, pose } = p;

    // Curl: smaller head, eyes shifted
    let lx = 33, rx = 77, ey = 52;
    if (pose === 'curl') { lx = 44; rx = 66; ey = 98; }

    /* Closed / sleeping */
    if (eyes === 'sleep' || eyes === 'closed') {
      const drawClosed = (ex) => {
        ctx.strokeStyle = outline; ctx.lineWidth = 2.5; ctx.lineCap = 'round';
        // Cute closed-eye arc (bottom arc = looks like happy closed eyes)
        ctx.beginPath(); ctx.arc(ex, ey + 2, 8, Math.PI * 1.1, Math.PI * 1.9); ctx.stroke();
        // Small lashes
        ctx.lineWidth = 1.5; ctx.globalAlpha = 0.55;
        ctx.beginPath(); ctx.moveTo(ex-8,ey-1); ctx.lineTo(ex-11,ey-5); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(ex+8,ey-1); ctx.lineTo(ex+11,ey-5); ctx.stroke();
        ctx.globalAlpha = 1;
      };
      drawClosed(lx); drawClosed(rx);
      return;
    }

    /* Happy ^ eyes */
    if (eyes === 'happy') {
      [lx, rx].forEach(ex => {
        ctx.strokeStyle = outline; ctx.lineWidth = 3; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.arc(ex, ey + 6, 9, Math.PI * 1.12, Math.PI * 1.88); ctx.stroke();
        ctx.strokeStyle = iris; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(ex, ey + 6, 7, Math.PI * 1.18, Math.PI * 1.82); ctx.stroke();
        // Sparkle dot above
        ctx.fillStyle = '#FFD700';
        ctx.beginPath(); ctx.arc(ex, ey - 4, 2, 0, Math.PI * 2); ctx.fill();
      });
      return;
    }

    const eyeR = eyes === 'wide' ? 13 : 11;
    const pupR  = eyes === 'focused' ? 4 : eyes === 'wide' ? 8 : 6;
    const sx = s.x, sy = s.y;

    [lx, rx].forEach(ex => {
      // Sclera
      ctx.fillStyle = '#fffef8'; ctx.strokeStyle = outline; ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.arc(ex, ey, eyeR, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

      // Iris
      ctx.fillStyle = iris;
      ctx.beginPath(); ctx.arc(ex + sx, ey + sy, pupR + 2.5, 0, Math.PI * 2); ctx.fill();

      // Pupil — vertical slit (cat-like!)
      ctx.save();
      ctx.translate(ex + sx, ey + sy);
      ctx.fillStyle = pupil;
      ctx.beginPath();
      ctx.ellipse(0, 0, eyes === 'focused' ? pupR * 0.3 : pupR * 0.55, pupR, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Shine highlights
      ctx.fillStyle = '#ffffff';
      ctx.beginPath(); ctx.arc(ex + sx + 3, ey + sy - 3, 2.5, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(ex + sx - 2, ey + sy + 3, 1.5, 0, Math.PI * 2); ctx.fill();
    });

    // Upper eyelid cover for squint/focused
    if (eyes === 'squint' || eyes === 'focused') {
      ctx.fillStyle = body; ctx.globalAlpha = 0.45;
      [lx, rx].forEach(ex => {
        ctx.beginPath(); ctx.arc(ex, ey - 4, eyeR + 1, Math.PI, 0); ctx.fill();
      });
      ctx.globalAlpha = 1;
    }
  }

  /* ── Nose ────────────────────────────────────────────── */
  _nose(ctx, p, palette) {
    const { nose } = palette;
    let nx = 55, ny = 68;
    if (p.pose === 'curl') { nx = 57; ny = 108; }

    // Small pink heart-shaped nose (triangle with indent)
    ctx.fillStyle = nose;
    ctx.beginPath();
    ctx.moveTo(nx, ny + 6);
    ctx.lineTo(nx - 5.5, ny);
    ctx.quadraticCurveTo(nx - 2.5, ny - 3, nx, ny + 1);
    ctx.quadraticCurveTo(nx + 2.5, ny - 3, nx + 5.5, ny);
    ctx.closePath();
    ctx.fill();

    // Shine
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.beginPath(); ctx.arc(nx - 1.5, ny + 1, 1.5, 0, Math.PI * 2); ctx.fill();
  }

  /* ── Mouth ───────────────────────────────────────────── */
  _mouth(ctx, p, palette) {
    if (p.pose === 'curl') return;
    const { outline } = palette;
    ctx.strokeStyle = outline; ctx.lineWidth = 2; ctx.lineCap = 'round';
    const mx = 55, my = 78;

    if (p.mouth === 'smile') {
      ctx.beginPath(); ctx.arc(mx, my + 2, 8, 0.15, Math.PI - 0.15); ctx.stroke();
      // Cheek blush dots
      ctx.fillStyle = 'rgba(255,150,150,0.45)';
      ctx.beginPath(); ctx.ellipse(mx - 16, my, 6, 4, 0, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(mx + 16, my, 6, 4, 0, 0, Math.PI * 2); ctx.fill();
    } else if (p.mouth === 'open') {
      ctx.fillStyle = '#3a1010'; ctx.strokeStyle = outline; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.ellipse(mx, my + 3, 7, 5.5, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#FF8888';
      ctx.beginPath(); ctx.ellipse(mx, my + 6, 3.5, 2.5, 0, 0, Math.PI); ctx.fill();
    } else if (p.mouth === 'open_sm') {
      ctx.fillStyle = '#3a1010';
      ctx.beginPath(); ctx.ellipse(mx, my + 2, 4.5, 3.5, 0, 0, Math.PI * 2); ctx.fill();
    } else {
      // ω neutral mouth
      ctx.beginPath();
      ctx.moveTo(mx - 7, my);
      ctx.quadraticCurveTo(mx - 3, my + 5, mx,     my + 2);
      ctx.quadraticCurveTo(mx + 3, my + 5, mx + 7, my);
      ctx.stroke();
    }
  }

  /* ── Whiskers ────────────────────────────────────────── */
  _whiskers(ctx, p, palette) {
    if (p.pose === 'curl') return;
    ctx.strokeStyle = palette.outline;
    ctx.globalAlpha = 0.5; ctx.lineWidth = 1.1; ctx.lineCap = 'round';

    const sides = [
      { bx:28, by:66, dir:-1 },
      { bx:82, by:66, dir: 1 },
    ];
    const offsets = [-8, 0, 8]; // vertical spread

    sides.forEach(({ bx, by, dir }) => {
      offsets.forEach(dy => {
        const angle = dy * 0.025 * dir;
        ctx.beginPath();
        ctx.moveTo(bx, by + dy);
        ctx.lineTo(bx + dir * 24 * Math.cos(angle), by + dy + dir * 24 * Math.sin(angle));
        ctx.stroke();
      });
    });
    ctx.globalAlpha = 1;
  }

  /* ── Effects ─────────────────────────────────────────── */
  _effects(ctx, p) {
    const { fx } = p;

    if (fx.includes('zzz') || fx.includes('zzz_sm')) {
      const sm = fx.includes('zzz_sm');
      ctx.font       = `bold ${sm ? 11 : 14}px sans-serif`;
      ctx.fillStyle  = '#a8d8f0';
      ctx.strokeStyle = '#2a5070';
      ctx.lineWidth  = 2;
      ctx.strokeText('z', 86, 46); ctx.fillText('z', 86, 46);
      if (!sm) {
        ctx.font = 'bold 10px sans-serif';
        ctx.strokeText('z', 96, 34); ctx.fillText('z', 96, 34);
      }
    }

    if (fx.includes('steam')) {
      ctx.fillStyle = '#FFE08A'; ctx.font = '14px serif';
      ctx.fillText('!', 97, 17);
      ctx.fillText('!', 8,  22);
    }

    if (fx.includes('stars')) {
      ctx.font = '12px serif';
      ctx.fillText('⭐', 4,  22);
      ctx.fillText('✨', 88, 16);
      ctx.fillText('💫', 46, 7);
    }
  }
}

window.CatRenderer = CatRenderer;
window.CAT_PALETTES = PALETTES;
window.CAT_PATTERNS = PATTERNS;
