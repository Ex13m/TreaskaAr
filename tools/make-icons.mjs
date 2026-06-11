// Генератор PNG-иконок без зависимостей (zlib из node).
// node tools/make-icons.mjs  →  icon-192.png, icon-512.png
import { deflateSync } from 'node:zlib';
import { writeFileSync } from 'node:fs';

const crcTable = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();
const crc32 = buf => {
  let c = 0xffffffff;
  for (const b of buf) c = crcTable[(c ^ b) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
};
const chunk = (type, data) => {
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type), data]);
  const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(body));
  return Buffer.concat([len, body, crc]);
};
function png(size, px) {
  const raw = Buffer.alloc((size * 4 + 1) * size);
  for (let y = 0; y < size; y++) {
    raw[y * (size * 4 + 1)] = 0; // filter none
    for (let x = 0; x < size; x++) {
      const [r, g, b, a] = px(x, y);
      const o = y * (size * 4 + 1) + 1 + x * 4;
      raw[o] = r; raw[o + 1] = g; raw[o + 2] = b; raw[o + 3] = a;
    }
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0); ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; ihdr[9] = 6; // 8-bit RGBA
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0))
  ]);
}

// рисуем: тёмно-синий фон, неоновое кольцо прицела, бирюзовая рыба
function pixel(size) {
  const cx = size / 2, cy = size / 2, R = size / 2;
  return (x, y) => {
    const dx = (x - cx) / R, dy = (y - cy) / R;
    const d = Math.hypot(dx, dy);
    // фон-градиент
    let r = 5 + 14 * (1 - d), g = 13 + 24 * (1 - d), b = 26 + 40 * (1 - d);
    // кольцо прицела
    if (Math.abs(d - 0.78) < 0.035) { r = 25; g = 240; b = 255; }
    // засечки прицела
    if (d > 0.70 && d < 0.92 && (Math.abs(dx) < 0.03 || Math.abs(dy) < 0.03)) { r = 25; g = 240; b = 255; }
    // тело рыбы — эллипс
    const fx = dx / 0.46, fy = dy / 0.22;
    if (fx * fx + fy * fy < 1) {
      const top = dy < -0.02;
      r = top ? 32 : 220; g = top ? 200 : 245; b = top ? 190 : 250;
      // глаз
      if (Math.hypot(dx - 0.27, dy + 0.06) < 0.045) { r = 4; g = 10; b = 16; }
    }
    // хвост — треугольник слева
    if (dx < -0.40 && dx > -0.62 && Math.abs(dy) < (dx + 0.62) * 1.1) { r = 28; g = 180; b = 175; }
    return [Math.min(255, r | 0), Math.min(255, g | 0), Math.min(255, b | 0), 255];
  };
}

for (const s of [192, 512]) writeFileSync(`icon-${s}.png`, png(s, pixel(s)));
console.log('icons written');
