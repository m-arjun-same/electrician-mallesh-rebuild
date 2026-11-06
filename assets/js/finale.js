/* Mallesh — own ink-signature finale: grains scatter, then sign "Mallesh"
   left to right as you hold on the line; the seal stamps when it's done. */
(function () {
  'use strict';
  const stage = document.getElementById('inkStage');
  const cv = document.getElementById('finaleCanvas');
  if (!stage || !cv) return;
  const ctx = cv.getContext('2d');
  const hint = document.getElementById('inkHint');
  const doneBtn = document.getElementById('inkDone');
  const againBtn = document.getElementById('inkAgain');
  const seal = document.getElementById('seal');
  const touch = document.getElementById('inkTouch');
  const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const INK = '244,240,232', COPPER = '226,164,88', EMBER = '240,178,126';

  let grains = [], W = 0, H = 0, progress = 0, holding = false, sealed = false;
  let demo = 0, demoDone = false, pen = { x: -100, y: -100, on: false };
  let lastT = 0;

  function build() {
    const dpr = Math.min(2, devicePixelRatio || 1);
    const r = cv.getBoundingClientRect();
    W = r.width; H = r.height;
    cv.width = W * dpr; cv.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const off = document.createElement('canvas');
    off.width = W; off.height = H;
    const o = off.getContext('2d');
    const fs = Math.min(H * 1.55, W / 3.3);
    o.font = `italic 400 ${fs}px 'Instrument Serif', serif`;
    o.textAlign = 'center'; o.textBaseline = 'middle';
    o.fillStyle = '#fff';
    o.fillText('Mallesh', W / 2, H * 0.44);
    const data = o.getImageData(0, 0, W, H).data;
    const step = Math.max(3, Math.round(W / 330));
    grains = [];
    for (let y = 0; y < H; y += step) {
      for (let x = 0; x < W; x += step) {
        if (data[(y * W + x) * 4 + 3] > 128) {
          const roll = Math.random();
          grains.push({
            tx: x, ty: y,
            sx: Math.random() * W, sy: Math.random() * H,
            d: (x / W) * 0.55,                       /* sign left → right */
            s: Math.random() * 1.9 + 0.7, ph: Math.random() * 6.28,
            c: roll < 0.14 ? COPPER : roll < 0.2 ? EMBER : INK,
          });
        }
      }
    }
    if (RM) { progress = 1; sealIn(); }
  }

  const ease = t => 1 - Math.pow(1 - t, 3);
  const clamp01 = v => Math.min(1, Math.max(0, v));

  function draw(t) {
    const dt = Math.min(50, t - lastT); lastT = t;
    /* auto-demo: a ghost pen signs most of it once, when it first appears */
    if (!demoDone && !holding && progress < 0.85) {
      demo += dt / 2600;
      if (demo >= 1) { demoDone = true; }
      progress = Math.max(progress, ease(Math.min(1, demo)) * 0.85);
      pen.x = W * (0.16 + 0.68 * Math.min(1, demo)); pen.y = H * 0.68; pen.on = demo < 1;
    }
    if (holding && !sealed) progress = Math.min(1, progress + dt / 1500);
    if (progress >= 0.995 && !sealed) sealIn();

    ctx.clearRect(0, 0, W, H);
    for (const g of grains) {
      const lp = ease(clamp01((progress - g.d) / 0.45));
      let x = g.sx + (g.tx - g.sx) * lp;
      let y = g.sy + (g.ty - g.sy) * lp;
      if (lp > 0.97) { x += Math.sin(t * 0.0016 + g.ph) * 0.8; y += Math.cos(t * 0.0019 + g.ph) * 0.8; }
      const a = 0.1 + lp * 0.85;
      ctx.fillStyle = `rgba(${g.c},${a})`;
      ctx.fillRect(x, y, g.s, g.s);
    }
    touch.style.opacity = pen.on || holding ? 1 : 0;
    if (pen.on || holding) touch.style.transform = `translate(${pen.x}px, ${pen.y}px)`;
    hint.classList.toggle('is-on', !sealed && progress < 0.9 && demoDone);
    doneBtn.classList.toggle('is-on', !sealed && progress > 0.25);
    requestAnimationFrame(draw);
  }

  function sealIn() {
    sealed = true;
    stage.classList.add('is-sealed');
    seal.classList.add('stamp-in');
    hint.classList.remove('is-on');
    doneBtn.classList.remove('is-on');
  }
  function reset() {
    sealed = false; progress = 0; demo = 0; demoDone = false;
    stage.classList.remove('is-sealed');
    seal.classList.remove('stamp-in');
  }

  const pos = e => {
    const r = stage.getBoundingClientRect();
    pen.x = e.clientX - r.left; pen.y = e.clientY - r.top;
  };
  stage.addEventListener('pointerdown', e => { pos(e); holding = true; pen.on = true; });
  stage.addEventListener('pointermove', pos);
  addEventListener('pointerup', () => { holding = false; });
  stage.addEventListener('pointerleave', () => { pen.on = false; });
  doneBtn.addEventListener('click', () => { progress = 1; });
  againBtn.addEventListener('click', reset);

  let rt;
  addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(build, 200); });
  document.fonts.ready.then(() => { build(); requestAnimationFrame(draw); });
})();
