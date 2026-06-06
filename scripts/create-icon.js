'use strict';
// Generates build/icon.png (512x512) and build/icon.ico (Windows)
// using jimp (pure-JS, no native deps).

const Jimp = require('jimp');
const fs   = require('fs');
const path = require('path');

const OUT = path.join(__dirname, '..', 'build');
fs.mkdirSync(OUT, { recursive: true });

const S = 512;

async function main() {
  const img = new Jimp(S, S, 0x00000000); // fully transparent

  const col = {
    bg:      0x1a1a26ff, // dark panel bg
    ring:    0xf5c842ff, // gold accent ring
    body:    0xe8803aff, // orange body
    belly:   0xfddcb0ff, // cream belly
    outline: 0x7a3510ff, // dark outline
    iris:    0x27ae60ff, // green iris
    pupil:   0x0a0a0aff,
    nose:    0xff6b9dff,
    innerEar:0xffb5c8ff,
  };

  const fill = (cx, cy, r, c) => {
    const r2 = r * r;
    for (let dy = -r; dy <= r; dy++) {
      for (let dx = -r; dx <= r; dx++) {
        if (dx*dx + dy*dy <= r2) {
          const x = Math.round(cx + dx), y = Math.round(cy + dy);
          if (x >= 0 && x < S && y >= 0 && y < S) img.setPixelColor(c, x, y);
        }
      }
    }
  };

  const ring = (cx, cy, r, t, c) => {
    const outer = r * r, inner = (r-t) * (r-t);
    for (let dy = -r; dy <= r; dy++) {
      for (let dx = -r; dx <= r; dx++) {
        const d2 = dx*dx + dy*dy;
        if (d2 <= outer && d2 >= inner) {
          const x = Math.round(cx + dx), y = Math.round(cy + dy);
          if (x >= 0 && x < S && y >= 0 && y < S) img.setPixelColor(c, x, y);
        }
      }
    }
  };

  const rect = (x, y, w, h, c) => {
    for (let py = y; py < y+h; py++)
      for (let px = x; px < x+w; px++)
        if (px >= 0 && px < S && py >= 0 && py < S) img.setPixelColor(c, px, py);
  };

  // Background circle
  fill(S/2, S/2, S/2 - 10, col.bg);
  // Gold ring border
  ring(S/2, S/2, S/2 - 10, 14, col.ring);

  // ── Draw a cute cat face ─────────────────────────────────
  const hx = S/2, hy = S*0.44;   // head center
  const hr = S*0.21;              // head radius

  // Head
  fill(hx, hy, hr + 4, col.outline);
  fill(hx, hy, hr,     col.body);

  // Ears (pointy triangles)
  const ear = (ex, ey) => {
    for (let y = 0; y < S*0.14; y++) {
      const hw = Math.round((S*0.14 - y) * 0.52);
      rect(Math.round(ex - hw), Math.round(ey + y), hw*2, 1, col.outline);
    }
    for (let y = 0; y < S*0.12; y++) {
      const hw = Math.round((S*0.12 - y) * 0.4);
      rect(Math.round(ex - hw), Math.round(ey + y + S*0.01), hw*2, 1, col.body);
    }
    // Inner ear
    for (let y = 0; y < S*0.07; y++) {
      const hw = Math.round((S*0.07 - y) * 0.3);
      rect(Math.round(ex - hw), Math.round(ey + y + S*0.03), hw*2, 1, col.innerEar);
    }
  };
  ear(hx - S*0.13, hy - hr - S*0.09);
  ear(hx + S*0.05, hy - hr - S*0.09);

  // Re-draw head on top of ear roots
  fill(hx, hy, hr,     col.body);

  // Eyes
  const lx = hx - S*0.08, rx = hx + S*0.08, ey2 = hy - S*0.02;
  fill(lx, ey2, S*0.05, col.outline);
  fill(rx, ey2, S*0.05, col.outline);
  fill(lx, ey2, S*0.04, 0xfffef8ff); // sclera
  fill(rx, ey2, S*0.04, 0xfffef8ff);
  fill(lx, ey2, S*0.025, col.iris);
  fill(rx, ey2, S*0.025, col.iris);
  fill(lx, ey2, S*0.015, col.pupil);
  fill(rx, ey2, S*0.015, col.pupil);
  fill(lx + S*0.012, ey2 - S*0.012, S*0.008, 0xffffffff); // shine
  fill(rx + S*0.012, ey2 - S*0.012, S*0.008, 0xffffffff);

  // Nose (heart-shaped, approximate with circle)
  fill(hx, hy + S*0.055, S*0.025, col.nose);

  // Belly (body)
  const by = S*0.73, br = S*0.17;
  fill(hx, by, br + 3, col.outline);
  fill(hx, by, br,     col.body);
  fill(hx, by + S*0.02, br * 0.6, col.belly);

  // ── Save PNG ─────────────────────────────────────────────
  const pngPath = path.join(OUT, 'icon.png');
  await img.writeAsync(pngPath);
  console.log('✓ build/icon.png (512×512)');

  // ── Save ICO (Windows) ───────────────────────────────────
  // Generate multiple sizes and pack into .ico
  try {
    const sizes  = [256, 128, 64, 48, 32, 16];
    const frames = await Promise.all(sizes.map(async (sz) => {
      const resized = img.clone().resize(sz, sz);
      return resized.getBufferAsync(Jimp.MIME_PNG);
    }));
    const icoBuffer = packIco(frames, sizes);
    fs.writeFileSync(path.join(OUT, 'icon.ico'), icoBuffer);
    console.log('✓ build/icon.ico (multi-size)');
  } catch (e) {
    console.warn('⚠ Could not create icon.ico:', e.message);
  }
}

// Minimal ICO packer — enough for electron-builder
function packIco(pngBuffers, sizes) {
  const n     = pngBuffers.length;
  const hdr   = 6;                  // ICONDIR
  const entry = 16;                 // ICONDIRENTRY per image
  const dataOffset = hdr + entry * n;

  const parts = [];
  // ICONDIR
  const iconDir = Buffer.alloc(hdr);
  iconDir.writeUInt16LE(0, 0);      // reserved
  iconDir.writeUInt16LE(1, 2);      // type: ICO
  iconDir.writeUInt16LE(n, 4);      // image count
  parts.push(iconDir);

  // Compute offsets
  let off = dataOffset;
  const entries = pngBuffers.map((buf, i) => {
    const sz = sizes[i];
    const e = Buffer.alloc(entry);
    e.writeUInt8(sz >= 256 ? 0 : sz, 0); // width (0 = 256)
    e.writeUInt8(sz >= 256 ? 0 : sz, 1); // height
    e.writeUInt8(0, 2);                   // color count
    e.writeUInt8(0, 3);                   // reserved
    e.writeUInt16LE(1, 4);                // color planes
    e.writeUInt16LE(32, 6);               // bits per pixel
    e.writeUInt32LE(buf.length, 8);       // image size
    e.writeUInt32LE(off, 12);             // offset
    off += buf.length;
    return e;
  });
  entries.forEach(e => parts.push(e));
  pngBuffers.forEach(b => parts.push(b));
  return Buffer.concat(parts);
}

main().catch(e => { console.error(e); process.exit(1); });
