// Procedural artwork for publication thumbnails.
// Each element with [data-art] gets a deterministic geometric SVG seeded by
// the data-art string (normally the paper title) in the palette named by
// data-theme. Add data-seed-offset="1" (any integer) to reroll a single
// composition without changing the title.
(function () {
  const PALETTES = {
    analyze: { bg: '#FAECE7', tones: ['#F0997B', '#D85A30', '#993C1D'], dark: '#4A1B0C' },
    improve: { bg: '#E1F5EE', tones: ['#5DCAA5', '#1D9E75', '#0F6E56'], dark: '#04342C' },
    extend: { bg: '#FAEEDA', tones: ['#FAC775', '#EF9F27', '#854F0B'], dark: '#412402' },
  };

  function hash(str) {
    let h = 2166136261;
    for (let i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  }

  function rng(seed) {
    return function () {
      seed |= 0;
      seed = (seed + 0x6d2b79f5) | 0;
      let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function art(seed, theme) {
    const p = PALETTES[theme] || PALETTES.analyze;
    const r = rng(hash(seed));
    const pick = (arr) => arr[Math.floor(r() * arr.length)];
    const grid = (n) => Math.round(n * 50);
    const W = 200;
    const H = 150;
    let s =
      '<svg viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true" focusable="false"><rect width="200" height="150" fill="' +
      p.bg +
      '"/>';
    const archetype = Math.floor(r() * 4);
    if (archetype === 0) {
      const cx = grid(1 + Math.floor(r() * 2));
      const cy = grid(1 + Math.floor(r() * 1.5));
      s += '<circle cx="' + cx + '" cy="' + cy + '" r="' + (35 + r() * 25) + '" fill="' + pick(p.tones) + '"/>';
      s += '<rect x="0" y="' + (H - grid(1)) + '" width="200" height="' + grid(1) + '" fill="' + pick(p.tones) + '"/>';
      s += '<circle cx="' + (W - grid(1)) + '" cy="' + grid(1) + '" r="10" fill="' + p.dark + '"/>';
    } else if (archetype === 1) {
      const cx = r() < 0.5 ? 0 : W;
      const cy = r() < 0.5 ? 0 : H;
      for (let i = 4; i >= 1; i--) {
        s += '<circle cx="' + cx + '" cy="' + cy + '" r="' + i * 28 + '" fill="' + (i % 2 ? pick(p.tones) : p.bg) + '"/>';
      }
      s += '<rect x="' + grid(0.5) + '" y="' + grid(0.5) + '" width="14" height="14" fill="' + p.dark + '"/>';
    } else if (archetype === 2) {
      const n = 2 + Math.floor(r() * 2);
      const w = W / (n * 2);
      const tilt = r() < 0.5 ? -14 : 14;
      for (let i = 0; i < n; i++) {
        s +=
          '<rect x="' + (i * 2 * w + w / 2) + '" y="-40" width="' + w + '" height="260" fill="' + pick(p.tones) +
          '" transform="rotate(' + tilt + ' 100 75)"/>';
      }
      s += '<circle cx="' + grid(0.7) + '" cy="' + (H - grid(0.7)) + '" r="16" fill="' + p.dark + '"/>';
    } else {
      const tone = pick(p.tones);
      for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 4; j++) {
          if (r() < 0.55) s += '<circle cx="' + (25 + i * 37) + '" cy="' + (22 + j * 35) + '" r="6" fill="' + tone + '"/>';
        }
      }
      s += '<circle cx="' + (40 + r() * 120) + '" cy="' + (35 + r() * 80) + '" r="' + (24 + r() * 14) + '" fill="' + pick(p.tones) + '"/>';
    }
    return s + '</svg>';
  }

  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('[data-art]').forEach(function (el) {
      const offset = el.getAttribute('data-seed-offset') || '';
      el.innerHTML = art(el.getAttribute('data-art') + offset, el.getAttribute('data-theme'));
    });
  });
})();
