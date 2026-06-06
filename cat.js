'use strict';

const PALETTES = {
  orange:   { body:'#E8803A', belly:'#FDDCB0', outline:'#7A3510', iris:'#27AE60', pupil:'#0a0a0a', nose:'#FF6B9D', innerEar:'#FFB5C8', stripe:'#C05A18', name:'Orange'  },
  black:    { body:'#2e2e2e', belly:'#555555', outline:'#0a0a0a', iris:'#4FC3F7', pupil:'#0a0a0a', nose:'#CC6688', innerEar:'#bb7799', stripe:'#111111', name:'Black'   },
  grey:     { body:'#8A8FA0', belly:'#CFD4E0', outline:'#3A3D50', iris:'#5B9BD5', pupil:'#0a0a0a', nose:'#CC6688', innerEar:'#FFB5C8', stripe:'#6A7080', name:'Grey'    },
  cream:    { body:'#F5E6C8', belly:'#FFFDF5', outline:'#8B7355', iris:'#8B4513', pupil:'#0a0a0a', nose:'#F48FB1', innerEar:'#FFD0DC', stripe:'#D4C4A0', name:'Cream'   },
  siamese:  { body:'#F5E0C3', belly:'#FFFCF5', outline:'#5D4037', iris:'#1565C0', pupil:'#0a0a0a', nose:'#F48FB1', innerEar:'#FFD0DC', stripe:'#8D6E63', name:'Siamese' },
  calico:   { body:'#F0D5A0', belly:'#FFFFFF', outline:'#333333', iris:'#4CAF50', pupil:'#0a0a0a', nose:'#F48FB1', innerEar:'#FFB5C8', stripe:'#E07020', name:'Calico'  },
  tuxedo:   { body:'#1a1a1a', belly:'#F5F5F5', outline:'#000000', iris:'#4CAF50', pupil:'#0a0a0a', nose:'#F48FB1', innerEar:'#994466', stripe:'#000000', name:'Tuxedo'  },
  lavender: { body:'#C9B8E8', belly:'#EDE8F7', outline:'#6A5ACD', iris:'#8B4513', pupil:'#0a0a0a', nose:'#F48FB1', innerEar:'#E8D0FF', stripe:'#9D88CC', name:'Lavender'},
};

const PATTERNS = {
  solid:   { name:'Solid'   },
  tabby:   { name:'Tabby'   },
  spotted: { name:'Spotted' },
  tuxedo:  { name:'Tuxedo'  },
};

const ANIMALS = {
  cat:     { name:'Cat',     emoji:'🐱' },
  dog:     { name:'Dog',     emoji:'🐶' },
  hamster: { name:'Hamster', emoji:'🐹' },
  parrot:  { name:'Parrot',  emoji:'🦜' },
};

const SPRITE_PARAMS = {
  idle_0:      { pose:'sit',     eyes:'open',    eyeShift:{x:0,y:0},  paws:'rest',    tailA:0.3,  mouth:'neutral', fx:[]        },
  idle_1:      { pose:'sit',     eyes:'open',    eyeShift:{x:0,y:0},  paws:'rest',    tailA:0.7,  mouth:'neutral', fx:[]        },
  blink:       { pose:'sit',     eyes:'closed',  eyeShift:{x:0,y:0},  paws:'rest',    tailA:0.5,  mouth:'neutral', fx:[]        },
  look_right:  { pose:'sit',     eyes:'open',    eyeShift:{x:4,y:0},  paws:'rest',    tailA:0.4,  mouth:'neutral', fx:[]        },
  look_left:   { pose:'sit',     eyes:'open',    eyeShift:{x:-4,y:0}, paws:'rest',    tailA:0.4,  mouth:'neutral', fx:[]        },
  type_0:      { pose:'sit',     eyes:'focused', eyeShift:{x:0,y:1},  paws:'type_r',  tailA:0.4,  mouth:'neutral', fx:[]        },
  type_1:      { pose:'sit',     eyes:'focused', eyeShift:{x:0,y:1},  paws:'type_l',  tailA:0.4,  mouth:'neutral', fx:[]        },
  excited_0:   { pose:'sit_up',  eyes:'wide',    eyeShift:{x:0,y:0},  paws:'up_r',    tailA:1.0,  mouth:'open',    fx:['steam'] },
  excited_1:   { pose:'sit_up',  eyes:'wide',    eyeShift:{x:0,y:0},  paws:'up_l',    tailA:-1.0, mouth:'open',    fx:['steam'] },
  sleep_0:     { pose:'curl',    eyes:'sleep',   eyeShift:{x:0,y:0},  paws:'tuck',    tailA:0.2,  mouth:'neutral', fx:[]        },
  sleep_1:     { pose:'curl',    eyes:'sleep',   eyeShift:{x:0,y:0},  paws:'tuck',    tailA:0.3,  mouth:'neutral', fx:['zzz']   },
  stretch:     { pose:'stretch', eyes:'squint',  eyeShift:{x:0,y:0},  paws:'extend',  tailA:1.0,  mouth:'open_sm', fx:[]        },
  celebrate:   { pose:'sit_up',  eyes:'happy',   eyeShift:{x:0,y:0},  paws:'both_up', tailA:1.0,  mouth:'smile',   fx:['stars'] },
  nap:         { pose:'curl',    eyes:'sleep',   eyeShift:{x:0,y:0},  paws:'tuck',    tailA:0.2,  mouth:'neutral', fx:['zzz_sm']},
  scroll_up:   { pose:'sit',     eyes:'open',    eyeShift:{x:0,y:-5}, paws:'rest',    tailA:0.4,  mouth:'neutral', fx:[]        },
  scroll_down: { pose:'sit',     eyes:'open',    eyeShift:{x:0,y:5},  paws:'rest',    tailA:0.4,  mouth:'neutral', fx:[]        },
  swipe:       { pose:'sit',     eyes:'wide',    eyeShift:{x:3,y:0},  paws:'swipe',   tailA:0.8,  mouth:'open',    fx:[]        },
};

class CatRenderer {
  constructor(canvas) {
    this.canvas  = canvas;
    this.ctx     = canvas.getContext('2d');
    this.palette = PALETTES.orange;
    this.pattern = 'solid';
    this.animal  = 'cat';
    this.currentSprite = 'idle_0';
    this.flipX   = false;

    const dpr = window.devicePixelRatio || 1;
    this.dpr = dpr;
    this.W = 110;
    this.H = 130;
    canvas.width  = this.W * dpr;
    canvas.height = this.H * dpr;
    canvas.style.width  = this.W + 'px';
    canvas.style.height = this.H + 'px';
    this.ctx.scale(dpr, dpr);
  }

  setPalette(name) { if (PALETTES[name]) { this.palette = PALETTES[name]; this.render(); } }
  setPattern(name) { if (PATTERNS[name]) { this.pattern = name; this.render(); } }
  setAnimal(name)  { if (ANIMALS[name])  { this.animal  = name;  this.render(); } }
  setSprite(name)  { if (SPRITE_PARAMS[name]) { this.currentSprite = name; this.render(); } }
  setFlip(flip)    { this.flipX = flip; this.render(); }

  render() {
    const ctx = this.ctx;
    const { W, H, flipX } = this;
    const p = SPRITE_PARAMS[this.currentSprite] || SPRITE_PARAMS.idle_0;
    ctx.clearRect(0, 0, W, H);
    if (flipX) { ctx.save(); ctx.translate(W, 0); ctx.scale(-1, 1); }
    switch (this.animal) {
      case 'dog':     this._renderDog(ctx, p);     break;
      case 'hamster': this._renderHamster(ctx, p); break;
      case 'parrot':  this._renderParrot(ctx, p);  break;
      default:        this._renderCat(ctx, p);     break;
    }
    this._effects(ctx, p);
    if (flipX) ctx.restore();
  }

  /* ── Shared helpers ──────────────────────────────────── */
  _rr(ctx, x, y, w, h, r) {
    r = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x+w, y,   x+w, y+h, r);
    ctx.arcTo(x+w, y+h, x,   y+h, r);
    ctx.arcTo(x,   y+h, x,   y,   r);
    ctx.arcTo(x,   y,   x+w, y,   r);
    ctx.closePath();
  }

  _tabby(ctx, x, y, w, h, color) {
    ctx.save(); ctx.globalAlpha = 0.38; ctx.fillStyle = color;
    for (let i = 0; i < 3; i++) ctx.fillRect(x+6, y+5+i*13, w-12, 5);
    ctx.restore();
  }

  _spots(ctx, x, y, w, h, color) {
    ctx.save(); ctx.globalAlpha = 0.45; ctx.fillStyle = color;
    [{cx:x+18,cy:y+12,r:8},{cx:x+52,cy:y+9,r:6},{cx:x+70,cy:y+22,r:7},{cx:x+32,cy:y+30,r:6}]
      .forEach(s => { ctx.beginPath(); ctx.arc(s.cx,s.cy,s.r,0,Math.PI*2); ctx.fill(); });
    ctx.restore();
  }

  /* ════════════════════════════════════════════════════════
     CAT
  ════════════════════════════════════════════════════════ */
  _renderCat(ctx, p) {
    const { palette: pal, pattern: pat } = this;
    this._catTail(ctx, p, pal);
    this._catBody(ctx, p, pal, pat);
    this._catHead(ctx, p, pal, pat);
    this._catEars(ctx, p, pal);
    this._catPaws(ctx, p, pal);
    this._catEyes(ctx, p, pal);
    this._catNose(ctx, p, pal);
    this._catMouth(ctx, p, pal);
    this._catWhiskers(ctx, p, pal);
  }

  _catTail(ctx, p, pal) {
    if (p.pose === 'curl') return;
    const { body, outline } = pal;
    const a = p.tailA;
    const sx=88,sy=108, cx=108+a*10,cy=82+a*8, ex=100+a*4,ey=62-a*10;
    ctx.lineCap = 'round';
    ctx.strokeStyle=outline; ctx.lineWidth=10;
    ctx.beginPath(); ctx.moveTo(sx,sy); ctx.quadraticCurveTo(cx,cy,ex,ey); ctx.stroke();
    ctx.strokeStyle=body; ctx.lineWidth=7;
    ctx.beginPath(); ctx.moveTo(sx,sy); ctx.quadraticCurveTo(cx,cy,ex,ey); ctx.stroke();
    ctx.fillStyle=body; ctx.strokeStyle=outline; ctx.lineWidth=2;
    ctx.beginPath(); ctx.arc(ex,ey,6,0,Math.PI*2); ctx.fill(); ctx.stroke();
  }

  _catBody(ctx, p, pal, pat) {
    const { body, belly, outline, stripe } = pal;
    if (p.pose === 'curl') {
      ctx.fillStyle=body; ctx.strokeStyle=outline; ctx.lineWidth=3;
      ctx.beginPath(); ctx.ellipse(55,108,42,26,0,0,Math.PI*2); ctx.fill(); ctx.stroke();
      if (pat==='tabby')   this._tabby(ctx,14,85,82,48,stripe);
      if (pat==='spotted') this._spots(ctx,14,85,82,48,stripe);
      ctx.fillStyle=belly;
      ctx.beginPath(); ctx.ellipse(55,110,25,16,0,0,Math.PI*2); ctx.fill();
      ctx.lineCap='round';
      ctx.strokeStyle=outline; ctx.lineWidth=9;
      ctx.beginPath(); ctx.arc(55,108,36,0.35,Math.PI*1.65); ctx.stroke();
      ctx.strokeStyle=body; ctx.lineWidth=6;
      ctx.beginPath(); ctx.arc(55,108,36,0.35,Math.PI*1.65); ctx.stroke();
      return;
    }
    if (p.pose === 'stretch') {
      ctx.fillStyle=body; ctx.strokeStyle=outline; ctx.lineWidth=3;
      this._rr(ctx,4,86,102,44,13); ctx.fill(); ctx.stroke();
      if (pat==='tabby')   this._tabby(ctx,4,86,102,44,stripe);
      if (pat==='spotted') this._spots(ctx,4,86,102,44,stripe);
      ctx.fillStyle=belly;
      ctx.beginPath(); ctx.ellipse(55,106,30,18,0,0,Math.PI*2); ctx.fill();
      return;
    }
    const by = p.pose==='sit_up' ? 86 : 90;
    ctx.fillStyle=body; ctx.strokeStyle=outline; ctx.lineWidth=3;
    this._rr(ctx,18,by,74,40,14); ctx.fill(); ctx.stroke();
    if (pat==='tabby')   this._tabby(ctx,18,by,74,40,stripe);
    if (pat==='spotted') this._spots(ctx,18,by,74,40,stripe);
    if (pat==='tuxedo') { ctx.fillStyle=belly; ctx.beginPath(); ctx.ellipse(55,by+16,15,22,0,0,Math.PI*2); ctx.fill(); }
    ctx.fillStyle=belly;
    ctx.beginPath(); ctx.ellipse(55,by+22,22,15,0,0,Math.PI*2); ctx.fill();
  }

  _catHead(ctx, p, pal, pat) {
    const { body, outline, stripe } = pal;
    if (p.pose === 'curl') {
      ctx.save(); ctx.translate(57,95); ctx.rotate(0.15); ctx.translate(-57,-95);
      ctx.fillStyle=body; ctx.strokeStyle=outline; ctx.lineWidth=3;
      this._rr(ctx,24,70,64,52,18); ctx.fill(); ctx.stroke();
      if (pat==='tabby') {
        ctx.save(); ctx.globalAlpha=0.38; ctx.fillStyle=stripe;
        ctx.fillRect(28,74,56,4); ctx.fillRect(28,83,48,4); ctx.restore();
      }
      ctx.restore(); return;
    }
    ctx.fillStyle=body; ctx.strokeStyle=outline; ctx.lineWidth=3;
    this._rr(ctx,8,22,94,70,22); ctx.fill(); ctx.stroke();
    if (pat==='tabby') {
      ctx.save(); ctx.globalAlpha=0.38; ctx.fillStyle=stripe;
      ctx.fillRect(28,26,54,4); ctx.fillRect(24,34,62,4); ctx.restore();
    }
  }

  _catEars(ctx, p, pal) {
    const { body, outline, innerEar } = pal;
    const drawEar = (tip, b1, b2) => {
      ctx.fillStyle=body; ctx.strokeStyle=outline; ctx.lineWidth=2.5;
      ctx.beginPath(); ctx.moveTo(b1[0],b1[1]); ctx.lineTo(tip[0],tip[1]); ctx.lineTo(b2[0],b2[1]); ctx.closePath();
      ctx.fill(); ctx.stroke();
      const pad=0.28, ix=(b1[0]+b2[0]+tip[0])/3, iy=(b1[1]+b2[1]+tip[1])/3;
      const lerp=(a,b,t)=>a+(b-a)*t;
      ctx.fillStyle=innerEar;
      ctx.beginPath();
      ctx.moveTo(lerp(b1[0],ix,pad),lerp(b1[1],iy,pad));
      ctx.lineTo(lerp(tip[0],ix,0.15),lerp(tip[1],iy,0.15));
      ctx.lineTo(lerp(b2[0],ix,pad),lerp(b2[1],iy,pad));
      ctx.closePath(); ctx.fill();
    };
    if (p.pose==='curl') {
      ctx.save(); ctx.translate(57,95); ctx.rotate(0.15); ctx.translate(-57,-95);
      drawEar([30,70],[24,80],[48,76]); drawEar([76,70],[60,76],[82,80]);
      ctx.restore(); return;
    }
    drawEar([22,4],[8,28],[42,26]);
    drawEar([88,4],[68,26],[102,28]);
  }

  _catPaws(ctx, p, pal) {
    const { body, outline } = pal;
    if (p.pose==='curl') {
      ctx.fillStyle=body; ctx.strokeStyle=outline; ctx.lineWidth=2;
      this._rr(ctx,30,125,20,12,6); ctx.fill(); ctx.stroke();
      this._rr(ctx,60,125,20,12,6); ctx.fill(); ctx.stroke();
      return;
    }
    const drawPaw = (x, y, rotDeg=0, liftPx=0) => {
      ctx.save();
      const cx=x+11, cy=y+7;
      ctx.translate(cx,cy-liftPx); ctx.rotate(rotDeg*Math.PI/180); ctx.translate(-cx,-cy+liftPx);
      ctx.fillStyle=body; ctx.strokeStyle=outline; ctx.lineWidth=2.5;
      this._rr(ctx,x,y-liftPx,22,14,7); ctx.fill(); ctx.stroke();
      ctx.strokeStyle=outline; ctx.lineWidth=1.2; ctx.globalAlpha=0.38; ctx.lineCap='round';
      [x+6,x+11,x+16].forEach(tx=>{ ctx.beginPath(); ctx.moveTo(tx,y-liftPx+2); ctx.lineTo(tx,y-liftPx+10); ctx.stroke(); });
      ctx.globalAlpha=1; ctx.restore();
    };
    const lx=p.pose==='stretch'?2:14, rx=p.pose==='stretch'?86:74;
    const py=124;
    switch(p.paws) {
      case 'type_r':  drawPaw(lx,py); drawPaw(rx,py,-30,14); break;
      case 'type_l':  drawPaw(lx,py,30,14); drawPaw(rx,py); break;
      case 'up_r':    drawPaw(lx,py); drawPaw(rx,py,-25,18); break;
      case 'up_l':    drawPaw(lx,py,25,18); drawPaw(rx,py); break;
      case 'both_up': drawPaw(lx,py,-30,20); drawPaw(rx,py,30,20); break;
      case 'swipe':   drawPaw(lx,py); drawPaw(rx+6,py-20,-40,0); break;
      default:        drawPaw(lx,py); drawPaw(rx,py);
    }
  }

  _catEyes(ctx, p, pal) {
    const { iris, outline, body } = pal;
    const { eyes, eyeShift:s, pose } = p;
    let lx=33, rx=77, ey=52;
    if (pose==='curl') { lx=44; rx=66; ey=98; }

    if (eyes==='sleep'||eyes==='closed') {
      const drawClosed = ex => {
        ctx.strokeStyle=outline; ctx.lineWidth=2.5; ctx.lineCap='round';
        ctx.beginPath(); ctx.arc(ex,ey+2,8,Math.PI*1.1,Math.PI*1.9); ctx.stroke();
        ctx.lineWidth=1.5; ctx.globalAlpha=0.55;
        ctx.beginPath(); ctx.moveTo(ex-8,ey-1); ctx.lineTo(ex-11,ey-5); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(ex+8,ey-1); ctx.lineTo(ex+11,ey-5); ctx.stroke();
        ctx.globalAlpha=1;
      };
      drawClosed(lx); drawClosed(rx); return;
    }
    if (eyes==='happy') {
      [lx,rx].forEach(ex=>{
        ctx.strokeStyle=outline; ctx.lineWidth=3; ctx.lineCap='round';
        ctx.beginPath(); ctx.arc(ex,ey+6,9,Math.PI*1.12,Math.PI*1.88); ctx.stroke();
        ctx.strokeStyle=iris; ctx.lineWidth=2;
        ctx.beginPath(); ctx.arc(ex,ey+6,7,Math.PI*1.18,Math.PI*1.82); ctx.stroke();
        ctx.fillStyle='#FFD700'; ctx.beginPath(); ctx.arc(ex,ey-4,2,0,Math.PI*2); ctx.fill();
      }); return;
    }
    const eyeR=eyes==='wide'?13:11, pupR=eyes==='focused'?4:eyes==='wide'?8:6;
    [lx,rx].forEach(ex=>{
      ctx.fillStyle='#fffef8'; ctx.strokeStyle=outline; ctx.lineWidth=2.5;
      ctx.beginPath(); ctx.arc(ex,ey,eyeR,0,Math.PI*2); ctx.fill(); ctx.stroke();
      ctx.fillStyle=iris;
      ctx.beginPath(); ctx.arc(ex+s.x,ey+s.y,pupR+2.5,0,Math.PI*2); ctx.fill();
      ctx.save(); ctx.translate(ex+s.x,ey+s.y);
      ctx.fillStyle=pal.pupil;
      ctx.beginPath(); ctx.ellipse(0,0,eyes==='focused'?pupR*0.3:pupR*0.55,pupR,0,0,Math.PI*2); ctx.fill();
      ctx.restore();
      ctx.fillStyle='#ffffff';
      ctx.beginPath(); ctx.arc(ex+s.x+3,ey+s.y-3,2.5,0,Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(ex+s.x-2,ey+s.y+3,1.5,0,Math.PI*2); ctx.fill();
    });
    if (eyes==='squint'||eyes==='focused') {
      ctx.fillStyle=body; ctx.globalAlpha=0.45;
      [lx,rx].forEach(ex=>{ ctx.beginPath(); ctx.arc(ex,ey-4,eyeR+1,Math.PI,0); ctx.fill(); });
      ctx.globalAlpha=1;
    }
  }

  _catNose(ctx, p, pal) {
    const { nose } = pal;
    let nx=55, ny=68;
    if (p.pose==='curl') { nx=57; ny=108; }
    ctx.fillStyle=nose;
    ctx.beginPath();
    ctx.moveTo(nx,ny+6); ctx.lineTo(nx-5.5,ny);
    ctx.quadraticCurveTo(nx-2.5,ny-3,nx,ny+1);
    ctx.quadraticCurveTo(nx+2.5,ny-3,nx+5.5,ny);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle='rgba(255,255,255,0.5)';
    ctx.beginPath(); ctx.arc(nx-1.5,ny+1,1.5,0,Math.PI*2); ctx.fill();
  }

  _catMouth(ctx, p, pal) {
    if (p.pose==='curl') return;
    const { outline } = pal;
    ctx.strokeStyle=outline; ctx.lineWidth=2; ctx.lineCap='round';
    const mx=55, my=78;
    if (p.mouth==='smile') {
      ctx.beginPath(); ctx.arc(mx,my+2,8,0.15,Math.PI-0.15); ctx.stroke();
      ctx.fillStyle='rgba(255,150,150,0.45)';
      ctx.beginPath(); ctx.ellipse(mx-16,my,6,4,0,0,Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(mx+16,my,6,4,0,0,Math.PI*2); ctx.fill();
    } else if (p.mouth==='open') {
      ctx.fillStyle='#3a1010'; ctx.strokeStyle=outline; ctx.lineWidth=1.5;
      ctx.beginPath(); ctx.ellipse(mx,my+3,7,5.5,0,0,Math.PI*2); ctx.fill(); ctx.stroke();
      ctx.fillStyle='#FF8888';
      ctx.beginPath(); ctx.ellipse(mx,my+6,3.5,2.5,0,0,Math.PI); ctx.fill();
    } else if (p.mouth==='open_sm') {
      ctx.fillStyle='#3a1010';
      ctx.beginPath(); ctx.ellipse(mx,my+2,4.5,3.5,0,0,Math.PI*2); ctx.fill();
    } else {
      ctx.beginPath();
      ctx.moveTo(mx-7,my); ctx.quadraticCurveTo(mx-3,my+5,mx,my+2);
      ctx.quadraticCurveTo(mx+3,my+5,mx+7,my); ctx.stroke();
    }
  }

  _catWhiskers(ctx, p, pal) {
    if (p.pose==='curl') return;
    ctx.strokeStyle=pal.outline; ctx.globalAlpha=0.5; ctx.lineWidth=1.1; ctx.lineCap='round';
    [{bx:28,by:66,dir:-1},{bx:82,by:66,dir:1}].forEach(({bx,by,dir})=>{
      [-8,0,8].forEach(dy=>{
        const angle=dy*0.025*dir;
        ctx.beginPath(); ctx.moveTo(bx,by+dy);
        ctx.lineTo(bx+dir*24*Math.cos(angle),by+dy+dir*24*Math.sin(angle)); ctx.stroke();
      });
    });
    ctx.globalAlpha=1;
  }

  /* ════════════════════════════════════════════════════════
     DOG
  ════════════════════════════════════════════════════════ */
  _renderDog(ctx, p) {
    const { palette:pal, pattern:pat } = this;
    this._dogTail(ctx, p, pal);
    this._dogBody(ctx, p, pal, pat);
    this._dogHead(ctx, p, pal, pat);
    this._dogEars(ctx, p, pal);
    this._catPaws(ctx, p, pal);
    this._dogEyes(ctx, p, pal);
    this._dogNose(ctx, p, pal);
    this._dogMouth(ctx, p, pal);
  }

  _dogTail(ctx, p, pal) {
    if (p.pose==='curl') return;
    const { body, outline } = pal;
    const a=p.tailA, sx=90,sy=105, cx=106+a*6,cy=88, ex=103+a*8,ey=72-a*8;
    ctx.lineCap='round';
    ctx.strokeStyle=outline; ctx.lineWidth=12;
    ctx.beginPath(); ctx.moveTo(sx,sy); ctx.quadraticCurveTo(cx,cy,ex,ey); ctx.stroke();
    ctx.strokeStyle=body; ctx.lineWidth=9;
    ctx.beginPath(); ctx.moveTo(sx,sy); ctx.quadraticCurveTo(cx,cy,ex,ey); ctx.stroke();
  }

  _dogBody(ctx, p, pal, pat) {
    const { body, belly, outline, stripe } = pal;
    if (p.pose==='curl') {
      ctx.fillStyle=body; ctx.strokeStyle=outline; ctx.lineWidth=3;
      ctx.beginPath(); ctx.ellipse(55,108,44,26,0,0,Math.PI*2); ctx.fill(); ctx.stroke();
      if (pat==='spotted') this._spots(ctx,12,84,86,50,stripe);
      ctx.fillStyle=belly; ctx.beginPath(); ctx.ellipse(55,110,26,16,0,0,Math.PI*2); ctx.fill();
      return;
    }
    if (p.pose==='stretch') {
      ctx.fillStyle=body; ctx.strokeStyle=outline; ctx.lineWidth=3;
      this._rr(ctx,4,84,102,46,13); ctx.fill(); ctx.stroke();
      if (pat==='spotted') this._spots(ctx,4,84,102,46,stripe);
      if (pat==='tabby')   this._tabby(ctx,4,84,102,46,stripe);
      ctx.fillStyle=belly; ctx.beginPath(); ctx.ellipse(55,104,30,18,0,0,Math.PI*2); ctx.fill();
      return;
    }
    const by=p.pose==='sit_up'?84:88;
    ctx.fillStyle=body; ctx.strokeStyle=outline; ctx.lineWidth=3;
    this._rr(ctx,16,by,78,42,14); ctx.fill(); ctx.stroke();
    if (pat==='spotted') this._spots(ctx,16,by,78,42,stripe);
    if (pat==='tabby')   this._tabby(ctx,16,by,78,42,stripe);
    if (pat==='tuxedo')  { ctx.fillStyle=belly; ctx.beginPath(); ctx.ellipse(55,by+16,18,24,0,0,Math.PI*2); ctx.fill(); }
    ctx.fillStyle=belly; ctx.beginPath(); ctx.ellipse(55,by+24,24,16,0,0,Math.PI*2); ctx.fill();
  }

  _dogHead(ctx, p, pal, pat) {
    const { body, belly, outline, stripe } = pal;
    if (p.pose==='curl') {
      ctx.save(); ctx.translate(57,95); ctx.rotate(0.1); ctx.translate(-57,-95);
      ctx.fillStyle=body; ctx.strokeStyle=outline; ctx.lineWidth=3;
      this._rr(ctx,22,68,68,56,18); ctx.fill(); ctx.stroke();
      ctx.restore(); return;
    }
    // Main head — wider and slightly squarer than cat
    ctx.fillStyle=body; ctx.strokeStyle=outline; ctx.lineWidth=3;
    this._rr(ctx,6,18,98,74,20); ctx.fill(); ctx.stroke();
    // Muzzle area
    ctx.fillStyle=belly; ctx.strokeStyle=outline; ctx.lineWidth=2;
    this._rr(ctx,30,52,50,34,12); ctx.fill(); ctx.stroke();
    if (pat==='spotted') {
      ctx.save(); ctx.globalAlpha=0.4; ctx.fillStyle=stripe;
      ctx.beginPath(); ctx.arc(26,32,10,0,Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(74,28,8,0,Math.PI*2); ctx.fill();
      ctx.restore();
    }
    if (pat==='tabby') {
      ctx.save(); ctx.globalAlpha=0.35; ctx.fillStyle=stripe;
      ctx.fillRect(26,22,58,4); ctx.fillRect(22,30,66,4); ctx.restore();
    }
  }

  _dogEars(ctx, p, pal) {
    const { body, outline, innerEar } = pal;
    const drawFloppyEar = (x, side) => {
      const f = side==='left' ? -1 : 1;
      ctx.fillStyle=body; ctx.strokeStyle=outline; ctx.lineWidth=2.5;
      ctx.beginPath();
      ctx.moveTo(x, 26);
      ctx.quadraticCurveTo(x+f*5, 38, x+f*7, 60);
      ctx.quadraticCurveTo(x+f*3, 72, x-f*5, 66);
      ctx.quadraticCurveTo(x-f*8, 46, x-f*2, 26);
      ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.fillStyle=innerEar; ctx.globalAlpha=0.55;
      ctx.beginPath();
      ctx.moveTo(x, 30);
      ctx.quadraticCurveTo(x+f*3, 42, x+f*4, 56);
      ctx.quadraticCurveTo(x+f*1, 64, x-f*3, 60);
      ctx.quadraticCurveTo(x-f*5, 44, x-f*0, 30);
      ctx.closePath(); ctx.fill();
      ctx.globalAlpha=1;
    };
    if (p.pose==='curl') {
      ctx.save(); ctx.translate(57,95); ctx.rotate(0.1); ctx.translate(-57,-95);
      drawFloppyEar(30,'left'); drawFloppyEar(80,'right');
      ctx.restore(); return;
    }
    drawFloppyEar(10,'left');
    drawFloppyEar(100,'right');
  }

  _dogEyes(ctx, p, pal) {
    const { iris, outline, body } = pal;
    const { eyes, eyeShift:s, pose } = p;
    let lx=38, rx=72, ey=42;
    if (pose==='curl') { lx=44; rx=66; ey=96; }

    if (eyes==='sleep'||eyes==='closed') {
      [lx,rx].forEach(ex=>{
        ctx.strokeStyle=outline; ctx.lineWidth=2.5; ctx.lineCap='round';
        ctx.beginPath(); ctx.arc(ex,ey+2,7,Math.PI*1.1,Math.PI*1.9); ctx.stroke();
      }); return;
    }
    if (eyes==='happy') {
      [lx,rx].forEach(ex=>{
        ctx.strokeStyle=outline; ctx.lineWidth=3; ctx.lineCap='round';
        ctx.beginPath(); ctx.arc(ex,ey+6,9,Math.PI*1.12,Math.PI*1.88); ctx.stroke();
        ctx.fillStyle='#FFD700'; ctx.beginPath(); ctx.arc(ex,ey-2,2,0,Math.PI*2); ctx.fill();
      }); return;
    }
    const eyeR=eyes==='wide'?12:10, pupR=eyes==='focused'?5:eyes==='wide'?7:6;
    [lx,rx].forEach(ex=>{
      ctx.fillStyle='#fffef8'; ctx.strokeStyle=outline; ctx.lineWidth=2.5;
      ctx.beginPath(); ctx.arc(ex,ey,eyeR,0,Math.PI*2); ctx.fill(); ctx.stroke();
      ctx.fillStyle=iris;
      ctx.beginPath(); ctx.arc(ex+s.x,ey+s.y,pupR+1,0,Math.PI*2); ctx.fill();
      // Round pupil (dogs don't have slit pupils)
      ctx.fillStyle='#0a0a0a';
      ctx.beginPath(); ctx.arc(ex+s.x,ey+s.y,pupR*0.65,0,Math.PI*2); ctx.fill();
      ctx.fillStyle='#ffffff';
      ctx.beginPath(); ctx.arc(ex+s.x+2,ey+s.y-2,2,0,Math.PI*2); ctx.fill();
    });
    if (eyes==='squint'||eyes==='focused') {
      ctx.fillStyle=body; ctx.globalAlpha=0.4;
      [lx,rx].forEach(ex=>{ ctx.beginPath(); ctx.arc(ex,ey-4,eyeR+1,Math.PI,0); ctx.fill(); });
      ctx.globalAlpha=1;
    }
  }

  _dogNose(ctx, p, pal) {
    let nx=55, ny=65;
    if (p.pose==='curl') { nx=55; ny=105; }
    ctx.fillStyle='#2a1a1a'; ctx.strokeStyle='#0a0a0a'; ctx.lineWidth=1.5;
    ctx.beginPath(); ctx.ellipse(nx,ny,11,8,0,0,Math.PI*2); ctx.fill(); ctx.stroke();
    ctx.fillStyle='#0a0a0a';
    ctx.beginPath(); ctx.ellipse(nx-4,ny+1,2.5,1.8,0.2,0,Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(nx+4,ny+1,2.5,1.8,-0.2,0,Math.PI*2); ctx.fill();
    ctx.fillStyle='rgba(255,255,255,0.4)';
    ctx.beginPath(); ctx.arc(nx-2,ny-2,2.5,0,Math.PI*2); ctx.fill();
  }

  _dogMouth(ctx, p, pal) {
    if (p.pose==='curl') return;
    const { outline } = pal;
    ctx.strokeStyle=outline; ctx.lineWidth=2.2; ctx.lineCap='round';
    const mx=55, my=76;
    if (p.mouth==='smile'||p.mouth==='open'||p.mouth==='open_sm') {
      // Happy dog — open mouth with tongue
      ctx.beginPath(); ctx.arc(mx,my+2,11,0.1,Math.PI-0.1); ctx.stroke();
      ctx.fillStyle='#c02040';
      ctx.beginPath(); ctx.ellipse(mx,my+9,8,9,0,0,Math.PI); ctx.fill();
      ctx.fillStyle='#ff4466';
      ctx.beginPath(); ctx.ellipse(mx,my+14,5,5,0,0,Math.PI); ctx.fill();
      if (p.mouth==='smile') {
        ctx.fillStyle='rgba(255,150,150,0.4)';
        ctx.beginPath(); ctx.ellipse(mx-20,my-1,7,5,0,0,Math.PI*2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(mx+20,my-1,7,5,0,0,Math.PI*2); ctx.fill();
      }
    } else {
      ctx.beginPath();
      ctx.moveTo(mx-9,my+1); ctx.quadraticCurveTo(mx,my+7,mx+9,my+1); ctx.stroke();
    }
  }

  /* ════════════════════════════════════════════════════════
     HAMSTER
  ════════════════════════════════════════════════════════ */
  _renderHamster(ctx, p) {
    const { palette:pal, pattern:pat } = this;
    this._hamsterTailStub(ctx, p, pal);
    this._hamsterBody(ctx, p, pal, pat);
    this._hamsterHead(ctx, p, pal);
    this._hamsterEars(ctx, p, pal);
    this._hamsterPaws(ctx, p, pal);
    this._hamsterEyes(ctx, p, pal);
    this._hamsterNose(ctx, p, pal);
    this._hamsterMouth(ctx, p, pal);
  }

  _hamsterTailStub(ctx, p, pal) {
    if (p.pose==='curl') return;
    ctx.fillStyle=pal.belly; ctx.strokeStyle=pal.outline; ctx.lineWidth=1.5;
    ctx.beginPath(); ctx.ellipse(91,108,6,4,0.3,0,Math.PI*2); ctx.fill(); ctx.stroke();
  }

  _hamsterBody(ctx, p, pal, pat) {
    const { body, belly, outline, stripe } = pal;
    if (p.pose==='curl') {
      ctx.fillStyle=body; ctx.strokeStyle=outline; ctx.lineWidth=3;
      ctx.beginPath(); ctx.ellipse(55,108,46,26,0,0,Math.PI*2); ctx.fill(); ctx.stroke();
      ctx.fillStyle=belly; ctx.beginPath(); ctx.ellipse(55,112,28,16,0,0,Math.PI*2); ctx.fill();
      return;
    }
    const by=p.pose==='sit_up'?80:84;
    // Extra-chubby rounded body
    ctx.fillStyle=body; ctx.strokeStyle=outline; ctx.lineWidth=3;
    ctx.beginPath(); ctx.ellipse(55,by+26,44,32,0,0,Math.PI*2); ctx.fill(); ctx.stroke();
    if (pat==='spotted') this._spots(ctx,12,by,86,56,stripe);
    if (pat==='tabby')   this._tabby(ctx,12,by,86,56,stripe);
    ctx.fillStyle=belly;
    ctx.beginPath(); ctx.ellipse(55,by+30,26,22,0,0,Math.PI*2); ctx.fill();
  }

  _hamsterHead(ctx, p, pal) {
    const { body, belly, outline } = pal;
    if (p.pose==='curl') {
      ctx.save(); ctx.translate(55,95); ctx.rotate(0.1); ctx.translate(-55,-95);
      ctx.fillStyle=body; ctx.strokeStyle=outline; ctx.lineWidth=3;
      ctx.beginPath(); ctx.arc(55,88,26,0,Math.PI*2); ctx.fill(); ctx.stroke();
      ctx.restore(); return;
    }
    // Very round head
    ctx.fillStyle=body; ctx.strokeStyle=outline; ctx.lineWidth=3;
    ctx.beginPath(); ctx.arc(55,46,32,0,Math.PI*2); ctx.fill(); ctx.stroke();
    // Signature chubby cheek pouches
    ctx.fillStyle=belly; ctx.strokeStyle=outline; ctx.lineWidth=2;
    ctx.beginPath(); ctx.ellipse(22,55,15,13,-0.15,0,Math.PI*2); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.ellipse(88,55,15,13,0.15,0,Math.PI*2); ctx.fill(); ctx.stroke();
  }

  _hamsterEars(ctx, p, pal) {
    const { body, outline, innerEar } = pal;
    const drawEar = (cx, cy) => {
      ctx.fillStyle=body; ctx.strokeStyle=outline; ctx.lineWidth=2.5;
      ctx.beginPath(); ctx.arc(cx,cy,12,0,Math.PI*2); ctx.fill(); ctx.stroke();
      ctx.fillStyle=innerEar;
      ctx.beginPath(); ctx.arc(cx,cy,7,0,Math.PI*2); ctx.fill();
    };
    if (p.pose==='curl') {
      ctx.save(); ctx.translate(55,95); ctx.rotate(0.1); ctx.translate(-55,-95);
      drawEar(34,64); drawEar(76,64); ctx.restore(); return;
    }
    drawEar(30,18); drawEar(80,18);
  }

  _hamsterPaws(ctx, p, pal) {
    const { body, outline } = pal;
    if (p.pose==='curl') {
      ctx.fillStyle=body; ctx.strokeStyle=outline; ctx.lineWidth=2;
      ctx.beginPath(); ctx.ellipse(40,128,10,7,0,0,Math.PI*2); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.ellipse(70,128,10,7,0,0,Math.PI*2); ctx.fill(); ctx.stroke();
      return;
    }
    const by=p.pose==='sit_up'?80:84;
    const drawSmPaw = (cx, cy, lifted) => {
      ctx.fillStyle=body; ctx.strokeStyle=outline; ctx.lineWidth=2;
      ctx.beginPath(); ctx.ellipse(cx,cy-(lifted?16:0),10,7,lifted?-0.4:0,0,Math.PI*2);
      ctx.fill(); ctx.stroke();
    };
    if (p.paws==='both_up') { drawSmPaw(26,by+8,true);  drawSmPaw(84,by+8,true);  }
    else if (p.paws==='up_r') { drawSmPaw(26,by+14,false); drawSmPaw(84,by+8,true);  }
    else if (p.paws==='up_l') { drawSmPaw(26,by+8,true);  drawSmPaw(84,by+14,false); }
    else                      { drawSmPaw(26,by+14,false); drawSmPaw(84,by+14,false); }
    // Feet
    ctx.fillStyle=body; ctx.strokeStyle=outline; ctx.lineWidth=2;
    ctx.beginPath(); ctx.ellipse(37,by+56,15,9,0,0,Math.PI*2); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.ellipse(73,by+56,15,9,0,0,Math.PI*2); ctx.fill(); ctx.stroke();
  }

  _hamsterEyes(ctx, p, pal) {
    const { outline } = pal;
    const { eyes, eyeShift:s, pose } = p;
    let lx=40, rx=70, ey=42;
    if (pose==='curl') { lx=44; rx=66; ey=94; }

    if (eyes==='sleep'||eyes==='closed') {
      [lx,rx].forEach(ex=>{
        ctx.strokeStyle=outline; ctx.lineWidth=2; ctx.lineCap='round';
        ctx.beginPath(); ctx.arc(ex,ey+2,6,Math.PI*1.1,Math.PI*1.9); ctx.stroke();
      }); return;
    }
    if (eyes==='happy') {
      [lx,rx].forEach(ex=>{
        ctx.strokeStyle=outline; ctx.lineWidth=2.5; ctx.lineCap='round';
        ctx.beginPath(); ctx.arc(ex,ey+5,8,Math.PI*1.1,Math.PI*1.9); ctx.stroke();
        ctx.fillStyle='#FFD700'; ctx.beginPath(); ctx.arc(ex,ey-4,2,0,Math.PI*2); ctx.fill();
      }); return;
    }
    const eyeR=eyes==='wide'?11:9;
    [lx,rx].forEach(ex=>{
      // Large shiny dark eyes
      ctx.fillStyle='#180808'; ctx.strokeStyle=outline; ctx.lineWidth=2;
      ctx.beginPath(); ctx.arc(ex,ey,eyeR,0,Math.PI*2); ctx.fill(); ctx.stroke();
      ctx.fillStyle='#ffffff';
      ctx.beginPath(); ctx.arc(ex+s.x+3,ey+s.y-3,3,0,Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(ex+s.x-2,ey+s.y+2,1.5,0,Math.PI*2); ctx.fill();
    });
  }

  _hamsterNose(ctx, p, pal) {
    if (p.pose==='curl') return;
    ctx.fillStyle=pal.nose||'#FF9EAF';
    ctx.beginPath(); ctx.ellipse(55,57,4,3,0,0,Math.PI*2); ctx.fill();
    ctx.fillStyle='rgba(255,255,255,0.5)';
    ctx.beginPath(); ctx.arc(53,56,1.2,0,Math.PI*2); ctx.fill();
  }

  _hamsterMouth(ctx, p, pal) {
    if (p.pose==='curl') return;
    ctx.strokeStyle=pal.outline; ctx.lineWidth=1.8; ctx.lineCap='round';
    const mx=55, my=63;
    if (p.mouth==='smile'||p.mouth==='open') {
      ctx.beginPath(); ctx.arc(mx,my+2,7,0.1,Math.PI-0.1); ctx.stroke();
      ctx.fillStyle='rgba(255,150,150,0.45)';
      ctx.beginPath(); ctx.ellipse(mx-14,my,5,4,0,0,Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(mx+14,my,5,4,0,0,Math.PI*2); ctx.fill();
    } else {
      ctx.beginPath();
      ctx.moveTo(mx-5,my); ctx.quadraticCurveTo(mx,my+4,mx+5,my); ctx.stroke();
    }
  }

  /* ════════════════════════════════════════════════════════
     PARROT
  ════════════════════════════════════════════════════════ */
  _renderParrot(ctx, p) {
    const { palette:pal, pattern:pat } = this;
    this._parrotPerch(ctx, p);
    this._parrotTailFeathers(ctx, p, pal);
    this._parrotBody(ctx, p, pal, pat);
    this._parrotWings(ctx, p, pal);
    this._parrotHead(ctx, p, pal);
    this._parrotCrest(ctx, p, pal);
    this._parrotFeet(ctx, p, pal);
    this._parrotEye(ctx, p, pal);
    this._parrotBeak(ctx, p, pal);
  }

  _parrotPerch(ctx, p) {
    if (p.pose==='curl') return;
    ctx.strokeStyle='#7A5010'; ctx.lineWidth=6; ctx.lineCap='round';
    ctx.beginPath(); ctx.moveTo(4,118); ctx.lineTo(106,118); ctx.stroke();
    ctx.strokeStyle='#5A3A08'; ctx.lineWidth=2;
    ctx.beginPath(); ctx.moveTo(4,118); ctx.lineTo(106,118); ctx.stroke();
  }

  _parrotTailFeathers(ctx, p, pal) {
    if (p.pose==='curl') return;
    const { body, outline, stripe } = pal;
    const a=p.tailA;
    // Three long pointed tail feathers
    [[-8,0],[0,4],[8,0]].forEach(([ox,extra],i)=>{
      const len=24+extra+a*4;
      ctx.strokeStyle=outline; ctx.lineWidth=7; ctx.lineCap='round';
      ctx.beginPath(); ctx.moveTo(55+ox,112); ctx.lineTo(55+ox*1.4,112+len); ctx.stroke();
      ctx.strokeStyle=i===1?stripe:body; ctx.lineWidth=5;
      ctx.beginPath(); ctx.moveTo(55+ox,112); ctx.lineTo(55+ox*1.4,112+len); ctx.stroke();
    });
  }

  _parrotBody(ctx, p, pal, pat) {
    const { body, belly, outline, stripe } = pal;
    if (p.pose==='curl') {
      ctx.fillStyle=body; ctx.strokeStyle=outline; ctx.lineWidth=3;
      ctx.beginPath(); ctx.ellipse(55,100,36,28,0,0,Math.PI*2); ctx.fill(); ctx.stroke();
      ctx.fillStyle=belly; ctx.beginPath(); ctx.ellipse(55,102,20,18,0,0,Math.PI*2); ctx.fill();
      return;
    }
    const by=p.pose==='sit_up'?72:76;
    ctx.fillStyle=body; ctx.strokeStyle=outline; ctx.lineWidth=3;
    ctx.beginPath(); ctx.ellipse(55,by+26,32,30,0,0,Math.PI*2); ctx.fill(); ctx.stroke();
    // Feather band patterns
    if (pat==='tabby'||pat==='tuxedo') {
      ctx.save(); ctx.globalAlpha=0.35; ctx.fillStyle=stripe;
      ctx.beginPath(); ctx.ellipse(55,by+18,26,8,0,0,Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(55,by+30,24,7,0,0,Math.PI*2); ctx.fill();
      ctx.restore();
    }
    if (pat==='spotted') this._spots(ctx,24,by,62,50,stripe);
    ctx.fillStyle=belly;
    ctx.beginPath(); ctx.ellipse(55,by+28,16,20,0,0,Math.PI*2); ctx.fill();
  }

  _parrotWings(ctx, p, pal) {
    if (p.pose==='curl') return;
    const { body, outline, stripe } = pal;
    const by=p.pose==='sit_up'?72:76;
    const flap=(p.paws==='both_up'||p.paws==='up_r'||p.paws==='up_l')?-14:0;

    ['left','right'].forEach(side=>{
      const f=side==='left'?-1:1;
      ctx.fillStyle=body; ctx.strokeStyle=outline; ctx.lineWidth=2;
      ctx.beginPath();
      ctx.moveTo(55+f*18,by+10);
      ctx.quadraticCurveTo(55+f*44,by+flap, 55+f*40,by+22);
      ctx.quadraticCurveTo(55+f*38,by+42, 55+f*16,by+46);
      ctx.closePath(); ctx.fill(); ctx.stroke();
      // Wing stripe
      ctx.save(); ctx.globalAlpha=0.4; ctx.strokeStyle=stripe; ctx.lineWidth=2.5; ctx.lineCap='round';
      ctx.beginPath();
      ctx.moveTo(55+f*20,by+14);
      ctx.quadraticCurveTo(55+f*40,by+flap+10, 55+f*36,by+30);
      ctx.stroke(); ctx.restore();
    });
  }

  _parrotHead(ctx, p, pal) {
    const { body, outline } = pal;
    if (p.pose==='curl') {
      ctx.save(); ctx.translate(55,90); ctx.rotate(0.15); ctx.translate(-55,-90);
      ctx.fillStyle=body; ctx.strokeStyle=outline; ctx.lineWidth=3;
      ctx.beginPath(); ctx.arc(55,78,22,0,Math.PI*2); ctx.fill(); ctx.stroke();
      ctx.restore(); return;
    }
    ctx.fillStyle=body; ctx.strokeStyle=outline; ctx.lineWidth=3;
    ctx.beginPath(); ctx.arc(55,40,28,0,Math.PI*2); ctx.fill(); ctx.stroke();
  }

  _parrotCrest(ctx, p, pal) {
    if (p.pose==='curl') return;
    const { stripe, outline } = pal;
    [[-10,0],[0,-6],[10,0]].forEach(([ox,extra])=>{
      ctx.fillStyle=stripe; ctx.strokeStyle=outline; ctx.lineWidth=1.5;
      ctx.beginPath();
      ctx.moveTo(55+ox-3,14);
      ctx.quadraticCurveTo(55+ox,3+extra,55+ox+3,14);
      ctx.closePath(); ctx.fill(); ctx.stroke();
    });
  }

  _parrotFeet(ctx, p, pal) {
    if (p.pose==='curl') return;
    ctx.strokeStyle='#8B6010'; ctx.lineWidth=2.5; ctx.lineCap='round';
    [42,68].forEach(x=>{
      ctx.beginPath(); ctx.moveTo(x,108); ctx.lineTo(x,118); ctx.stroke();
      // Three toes on perch
      [[-9,123],[-2,124],[8,122]].forEach(([dx,ty])=>{
        ctx.beginPath(); ctx.moveTo(x,118); ctx.lineTo(x+dx,ty); ctx.stroke();
      });
    });
  }

  _parrotEye(ctx, p, pal) {
    const { iris, outline } = pal;
    const { eyes, eyeShift:s, pose } = p;
    let ex=64, ey=36;
    if (pose==='curl') { ex=60; ey=78; }

    if (eyes==='sleep'||eyes==='closed') {
      ctx.strokeStyle=outline; ctx.lineWidth=2; ctx.lineCap='round';
      ctx.beginPath(); ctx.arc(ex,ey+2,6,Math.PI*1.1,Math.PI*1.9); ctx.stroke(); return;
    }
    if (eyes==='happy') {
      ctx.strokeStyle=outline; ctx.lineWidth=2.5; ctx.lineCap='round';
      ctx.beginPath(); ctx.arc(ex,ey+5,7,Math.PI*1.1,Math.PI*1.9); ctx.stroke();
      ctx.fillStyle='#FFD700'; ctx.beginPath(); ctx.arc(ex,ey-3,2,0,Math.PI*2); ctx.fill(); return;
    }
    // White eye-ring (bird characteristic)
    ctx.fillStyle='#f0ead2'; ctx.strokeStyle=outline; ctx.lineWidth=1.5;
    ctx.beginPath(); ctx.arc(ex,ey,10,0,Math.PI*2); ctx.fill(); ctx.stroke();
    ctx.fillStyle=iris;
    ctx.beginPath(); ctx.arc(ex+s.x,ey+s.y,7,0,Math.PI*2); ctx.fill();
    ctx.fillStyle='#0a0a0a';
    ctx.beginPath(); ctx.arc(ex+s.x,ey+s.y,4,0,Math.PI*2); ctx.fill();
    ctx.fillStyle='#ffffff';
    ctx.beginPath(); ctx.arc(ex+s.x+2,ey+s.y-2,1.8,0,Math.PI*2); ctx.fill();
  }

  _parrotBeak(ctx, p, pal) {
    if (p.pose==='curl') return;
    const open=p.mouth==='open'||p.mouth==='open_sm'||p.mouth==='smile';
    // Upper hooked beak
    ctx.fillStyle='#DEB030'; ctx.strokeStyle='#8B6010'; ctx.lineWidth=1.5;
    ctx.beginPath();
    ctx.moveTo(67,44);
    ctx.quadraticCurveTo(86,40,84,52);
    ctx.quadraticCurveTo(80,60,70,58);
    ctx.quadraticCurveTo(67,52,67,44);
    ctx.closePath(); ctx.fill(); ctx.stroke();
    // Lower beak
    ctx.fillStyle=open?'#C49020':'#C89020'; ctx.strokeStyle='#8B6010'; ctx.lineWidth=1.5;
    ctx.beginPath();
    ctx.moveTo(70,56);
    ctx.quadraticCurveTo(77,open?62:58,82,56);
    ctx.quadraticCurveTo(80,open?66:60,74,open?66:60);
    ctx.closePath(); ctx.fill(); ctx.stroke();
  }

  /* ── Effects ─────────────────────────────────────────── */
  _effects(ctx, p) {
    const { fx } = p;
    if (fx.includes('zzz')||fx.includes('zzz_sm')) {
      const sm=fx.includes('zzz_sm');
      ctx.font=`bold ${sm?11:14}px sans-serif`;
      ctx.fillStyle='#a8d8f0'; ctx.strokeStyle='#2a5070'; ctx.lineWidth=2;
      ctx.strokeText('z',86,46); ctx.fillText('z',86,46);
      if (!sm) { ctx.font='bold 10px sans-serif'; ctx.strokeText('z',96,34); ctx.fillText('z',96,34); }
    }
    if (fx.includes('steam')) {
      ctx.fillStyle='#FFE08A'; ctx.font='14px serif';
      ctx.fillText('!',97,17); ctx.fillText('!',8,22);
    }
    if (fx.includes('stars')) {
      ctx.font='12px serif';
      ctx.fillText('⭐',4,22); ctx.fillText('✨',88,16); ctx.fillText('💫',46,7);
    }
  }
}

window.CatRenderer  = CatRenderer;
window.CAT_PALETTES = PALETTES;
window.CAT_PATTERNS = PATTERNS;
window.CAT_ANIMALS  = ANIMALS;
