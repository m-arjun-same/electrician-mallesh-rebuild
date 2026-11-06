/* Mallesh — own grain-name engine: names built from thousands of grains.
   Used twice: MALLESH (dawn, Bricolage) and Mallesh (finale, Instrument italic). */
(function () {
  'use strict';
  const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const INK = '244,240,232', COPPER = '226,164,88', EMBER = '240,178,126';

  function makeGrain(cv, text, fontFn) {
    if (!cv) return;
    const ctx = cv.getContext('2d');
    let grains = [], W = 0, H = 0, running = false;
    const mouse = { x: -9999, y: -9999 };

    function build() {
      const dpr = Math.min(2, devicePixelRatio || 1);
      const r = cv.getBoundingClientRect();
      W = r.width; H = r.height;
      cv.width = W * dpr; cv.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const off = document.createElement('canvas');
      off.width = W; off.height = H;
      const o = off.getContext('2d');
      const fs = fontFn(W, H);
      o.font = fs.font;
      o.textAlign = 'center'; o.textBaseline = 'middle';
      o.fillStyle = '#fff';
      o.fillText(text, W / 2, H / 2 + fs.lift);
      const data = o.getImageData(0, 0, W, H).data;
      const step = Math.max(3, Math.round(W / 340));
      grains = [];
      for (let y = 0; y < H; y += step) {
        for (let x = 0; x < W; x += step) {
          if (data[(y * W + x) * 4 + 3] > 128) {
            const roll = Math.random();
            grains.push({
              ox: x, oy: y, s: Math.random() * 1.9 + 0.7, ph: Math.random() * 6.28,
              c: roll < 0.14 ? COPPER : roll < 0.2 ? EMBER : INK,
            });
          }
        }
      }
    }

    function draw(t) {
      if (!running) return;
      ctx.clearRect(0, 0, W, H);
      for (const g of grains) {
        let x = g.ox + Math.sin(t * 0.0011 + g.ph) * 1.3;
        let y = g.oy + Math.cos(t * 0.0013 + g.ph * 1.7) * 1.3;
        const dx = x - mouse.x, dy = y - mouse.y, d2 = dx * dx + dy * dy;
        if (d2 < 8100) { const d = Math.sqrt(d2) || 1, f = (90 - d) * 0.24; x += dx / d * f; y += dy / d * f; }
        const tw = 0.55 + 0.45 * Math.sin(t * 0.002 + g.ph * 3.1);
        ctx.fillStyle = `rgba(${g.c},${0.35 + tw * 0.6})`;
        ctx.fillRect(x, y, g.s, g.s);
      }
      if (!RM) requestAnimationFrame(draw);
    }

    cv.addEventListener('pointermove', e => {
      const r = cv.getBoundingClientRect();
      mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top;
    });
    cv.addEventListener('pointerleave', () => { mouse.x = -9999; mouse.y = -9999; });

    const io = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting && !running) { running = true; requestAnimationFrame(draw); }
      if (!e.isIntersecting) running = false;
    }), { threshold: 0.02 });
    io.observe(cv);

    let rt;
    addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(build, 200); });
    build();
    if (RM) { running = true; draw(0); running = false; }
  }

  document.fonts.ready.then(() => {
    makeGrain(document.getElementById('grainCanvas'), 'MALLESH', (W, H) => {
      const fs = Math.min(H * 1.5, W / 4.1);
      return { font: `800 ${fs}px 'Bricolage Grotesque', sans-serif`, lift: fs * 0.04 };
    });
  });
})();
