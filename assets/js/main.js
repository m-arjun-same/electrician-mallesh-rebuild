/* Mallesh — own site logic v2: smooth scroll, mask reveals, sticky-cover parallax,
   hover previews, counters — all hand-written. */
(function () {
  'use strict';
  const $ = (s, el) => (el || document).querySelector(s);
  const $$ = (s, el) => [...(el || document).querySelectorAll(s)];
  const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const TOUCH = matchMedia('(hover: none)').matches;

  const SERVICES = [
    ['wiring', 'House wiring', 'Wiring', 'Complete wiring for homes and flats: load, structure and a clear plan for every circuit.'],
    ['lighting', 'Lighting & fans', 'Lighting', 'Lights, fans and fittings fitted by hand: straight, level and silent.'],
    ['inverter', 'Inverter & UPS', 'Backup', 'Sized to your home: backup for lights, fans and Wi-Fi first, with honest battery care built in.'],
    ['repair', 'Fault repair', 'Repair', 'One fault, one cause, one fix: tripping, sparking and dead points traced properly and fixed the same visit.*'],
    ['boards', 'Boards & MCB', 'Boards', 'Boards that protect: MCBs, RCCBs, labelling and load balancing that make faults easy to find.'],
    ['earthing', 'Earthing & safety', 'Safety', 'Earthing, bonding and leakage protection: the invisible layer that keeps you safe.'],
    ['safety', 'Safety check', 'Check', 'A full-home electrical health check: insulation, leakage, load and protection, in plain words.'],
    ['rewire', 'Full rewire', 'Rewire', 'Old wires out, safe circuits in — a whole home rewired in planned stages, tested room by room.'],
  ];
  const PLACES = ['homes', 'flats', 'shops', 'offices', 'salons', 'cafes', 'clinics', 'schools', 'studios', 'bakeries', 'pharmacy', 'hotels', 'pgrooms', 'halls', 'hostels', 'banks'];
  const CAPS = [
    ['Fan fitting & repair', 'ceiling, wall and exhaust fans'], ['Chandelier & decor lights', 'fitted level, wired safe'],
    ['TV & appliance points', 'points where you need them'], ['Geyser & heater points', 'with the right MCB rating'],
    ['Doorbell & intercom', 'wired and wireless'], ['CCTV power lines', 'clean power for cameras'],
    ['Stabiliser fitting', 'for fridges and full homes'], ['Generator changeover', 'manual and automatic'],
    ['Load balancing', 'phases shared, no more trips'], ['Surge protection', 'for boards and devices'],
    ['Smart switches', 'Wi-Fi switches and dimmers'], ['Motion-sensor lights', 'stairs, gates, parking'],
    ['Garden & gate lights', 'weather-safe fittings'], ['Festive lighting', 'safe temporary wiring'],
    ['Fuse to MCB upgrades', 'old boards made modern'], ['Meter board work', 'tidy, labelled, sealed right'],
    ['Underground cable faults', 'traced without digging blind'], ['Water-level controllers', 'for tanks and sumps'],
    ['Exhaust & ventilation', 'kitchens and bathrooms'], ['Emergency call-out', 'sparking, burning smell, no power'],
    ['Annual maintenance', 'a yearly check that prevents faults'], ['Rental-ready checks', 'before a tenant moves in'],
    ['New-home handover checks', 'every point tested, in writing'], ['Energy-saving refits', 'LED and load audits'],
    ['After-care visits', 'small fixes, honestly priced'],
  ];
  const WALL = [
    ['In the bag', ['Multimeter', 'Tester', 'Wire stripper', 'Crimping tool', 'Insulation tape', 'Screwdriver set']],
    ['On the belt', ['Combination pliers', 'Nose pliers', 'Adjustable wrench', 'Allen keys', 'Spirit level', 'Tape measure']],
    ['For wiring', ['Fish tape', 'Cable ties', 'Conduit & casing', 'Junction boxes', 'Connectors', 'Heat-shrink']],
    ['For boards', ['MCBs', 'RCCBs', 'Distribution boards', 'Busbars', 'DIN rails', 'Labels']],
    ['Wire stock', ['1.0 sq mm', '1.5 sq mm', '2.5 sq mm', '4.0 sq mm', 'Earth wire', 'Flexible cord']],
    ['Safety first', ['Insulated gloves', 'Safety shoes', 'Voltage detector', 'Earth tester', 'First-aid kit', 'Torch']],
    ['Testing', ['Clamp meter', 'Megger', 'Continuity tester', 'Phase tester', 'Socket tester', 'Load calculator']],
    ['Finishing', ['Switch plates', 'Modular switches', 'Cable clips', 'Screws & plugs', 'Sealant', 'Cleaning kit']],
  ];
  const STEPS = [
    ['Book', 'Call or send the form. Tell me what stopped working.'],
    ['Check', 'I visit, check the board and find the real cause.'],
    ['Quote', 'A clear price on site, agreed before any work.'],
    ['Plan', 'Points, runs and materials planned with you.'],
    ['Wire', 'Neat runs, right sizes, nothing hidden or loose.'],
    ['Fit', 'Switches, lights and boards fitted level and clean.'],
    ['Test', 'Every point tested live, protection checked.'],
    ['Handover', 'Walkthrough at the board — you see it all working.'],
  ];

  /* ---------- build sections ---------- */
  $('#stamps').innerHTML = SERVICES.map(s => `<span class="stamp">${s[1]}</span>`).join('');
  $('#covers').innerHTML = SERVICES.map((s, i) => `
    <article class="cover">
      <div class="cover-media"><img src="assets/img/work/${s[0]}/still.webp" srcset="assets/img/work/${s[0]}/still-s.webp 1280w, assets/img/work/${s[0]}/still.webp 1920w, assets/img/work/${s[0]}/still-xl.webp 2560w" sizes="100vw" alt="${s[1]}" loading="${i < 1 ? 'eager' : 'lazy'}"></div>
      <div class="cover-top"><span class="no">№ ${i + 1} / 8</span><span class="stamp">${s[2]}</span></div>
      <div class="cover-bot"><h3>${s[1]}</h3>
        <div class="cover-row"><p>${s[3]}</p><a href="#book" data-goto>Book this job →</a></div>
      </div>
    </article>`).join('');
  const half = PLACES.map(p => `<img src="assets/img/clients/${p}.webp" alt="" loading="lazy">`).join('');
  $('#marqueeIn').innerHTML = half + half;
  $('#rows').innerHTML = SERVICES.slice(0, 7).map((s, i) => `
    <div class="row reveal" data-slug="${s[0]}"><span class="row__n">0${i + 1}</span><span class="row__t">${s[1]}</span><span class="row__d">${s[3]}</span><span class="row__a">→</span></div>`).join('');
  $('#capsList').innerHTML = CAPS.map(c => `<li class="reveal">${c[0]}<span>${c[1]}</span></li>`).join('');
  $('#wall').innerHTML = WALL.map(g => `
    <div class="wall__g reveal"><b>${g[0]}</b>${g[1].map(t => `<span class="tag">${t}</span>`).join('')}</div>`).join('');
  $('#steps').innerHTML = STEPS.map(s => `
    <li class="step reveal"><h4>${s[0]}</h4><p>${s[1]}</p></li>`).join('');

  /* ---------- word-mask splitting ---------- */
  function splitMask(el) {
    let d = 0;
    const wrap = (node) => {
      const w = document.createElement('span'); w.className = 'w';
      const i = document.createElement('i'); i.style.setProperty('--d', (d++ * 0.028) + 's');
      i.appendChild(node); w.appendChild(i); return w;
    };
    [...el.childNodes].forEach(node => {
      if (node.nodeType === 3) {
        const frag = document.createDocumentFragment();
        node.textContent.split(/(\s+)/).forEach(part => {
          if (!part) return;
          frag.appendChild(/^\s+$/.test(part) ? document.createTextNode(' ') : wrap(document.createTextNode(part)));
        });
        el.replaceChild(frag, node);
      } else if (node.nodeType === 1) {
        el.replaceChild(wrap(node.cloneNode(true)), node);
      }
    });
  }
  $$('.mask').forEach(splitMask);

  /* ---------- reveals + counters ---------- */
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }), { threshold: 0.08, rootMargin: '0px 0px -6% 0px' });
  $$('.reveal, .mask').forEach(el => io.observe(el));
  /* safety net: nothing already on screen may stay hidden */
  setTimeout(() => $$('.reveal:not(.in), .mask:not(.in)').forEach(el => {
    const r = el.getBoundingClientRect();
    if (r.top < innerHeight * 1.05 && r.bottom > -80) el.classList.add('in');
  }), 1400);
  const cio = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target, end = +el.dataset.count, t0 = performance.now();
    (function tick(t) {
      const p = Math.min(1, (t - t0) / 950), ease = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(end * ease);
      if (p < 1) requestAnimationFrame(tick);
    })(t0);
    cio.unobserve(el);
  }), { threshold: 0.5 });
  $$('[data-count]').forEach(el => cio.observe(el));

  /* ---------- own smooth scroll (wheel lerp; native on touch / RM) ---------- */
  const smooth = !RM && !TOUCH;
  let target = scrollY, lastY = scrollY, wheelAt = 0;
  if (smooth) {
    addEventListener('wheel', e => {
      if (document.body.classList.contains('menu-open') || e.ctrlKey) return;
      e.preventDefault();
      wheelAt = performance.now();
      target += (e.deltaMode === 1 ? e.deltaY * 16 : e.deltaY);
      target = Math.max(0, Math.min(target, document.body.scrollHeight - innerHeight));
    }, { passive: false });
    (function loop() {
      const diff = target - scrollY;
      if (Math.abs(diff) > 0.4) scrollTo(0, scrollY + diff * 0.115);
      else if (performance.now() - wheelAt > 220 && Math.abs(scrollY - target) > 320) { target = scrollY; }
      requestAnimationFrame(loop);
    })();
  }
  addEventListener('scroll', () => {
    if (!smooth) target = scrollY;
    const y = scrollY, hdr = $('.hdr');
    if (y > lastY + 5 && y > 340 && !document.body.classList.contains('menu-open')) hdr.classList.add('hide');
    else if (y < lastY - 4) hdr.classList.remove('hide');
    lastY = y;
    /* cover parallax */
    $$('.cover-media img').forEach(img => {
      const r = img.closest('.cover').getBoundingClientRect();
      if (r.bottom < 0 || r.top > innerHeight) return;
      img.style.transform = `translateY(${(-r.top * 0.07).toFixed(1)}px)`;
    });
  }, { passive: true });

  /* ---------- anchors via the same engine ---------- */
  function goto(sel) {
    const el = sel === '#top' ? document.body : $(sel);
    if (!el) return;
    document.body.classList.remove('menu-open');
    const y = sel === '#top' ? 0 : el.getBoundingClientRect().top + scrollY - 6;
    if (smooth) { target = y; }
    else {
      const start = scrollY, dist = y - start, t0 = performance.now(), dur = Math.min(1300, 450 + Math.abs(dist) * 0.32);
      (function step(t) {
        const p = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - p, 4);
        scrollTo(0, start + dist * e);
        if (p < 1) requestAnimationFrame(step);
      })(t0);
    }
  }
  $$('[data-goto]').forEach(a => a.addEventListener('click', e => {
    const href = a.getAttribute('href');
    if (href && href.startsWith('#')) { e.preventDefault(); goto(href); }
  }));

  /* ---------- menu ---------- */
  $('#menuBtn').addEventListener('click', () => {
    const open = document.body.classList.toggle('menu-open');
    $('#menu').setAttribute('aria-hidden', String(!open));
  });

  /* ---------- now rotator ---------- */
  const names = SERVICES.map(s => s[1]);
  let ni = 0;
  const rot = $('#nowRot');
  setInterval(() => {
    rot.style.opacity = 0;
    setTimeout(() => { ni = (ni + 1) % names.length; rot.textContent = names[ni]; rot.style.opacity = 1; }, 260);
  }, 2600);

  /* ---------- paper row hover preview ---------- */
  const prev = $('#rowPreview'), pimg = prev.querySelector('img');
  let px = 0, py = 0, tx2 = 0, ty2 = 0;
  $$('.row').forEach(r => r.addEventListener('mouseenter', () => {
    pimg.src = `assets/img/services/${r.dataset.slug}.webp`;
    prev.classList.add('on');
  }));
  $('.paper').addEventListener('mousemove', e => { tx2 = e.clientX + 26; ty2 = e.clientY - 100; });
  $('.paper').addEventListener('mouseleave', () => prev.classList.remove('on'));
  (function follow() {
    px += (tx2 - px) * 0.16; py += (ty2 - py) * 0.16;
    prev.style.left = px + 'px'; prev.style.top = py + 'px';
    requestAnimationFrame(follow);
  })();

  /* ---------- snake: side-scrolling plane (own engine) ---------- */
  const snakeSec = $('#snake'), plane = $('#snakePlane'), cam = $('#snakeCam'), map = $('#snakeMap');
  if (snakeSec && plane && !RM && !matchMedia('(max-width: 820px)').matches) {
    const path = map.querySelector('path'), dot = $('#snakeDot');
    const pathLen = path.getTotalLength();
    let travel = 0;
    function measure() {
      travel = Math.max(0, plane.scrollWidth - innerWidth);
      snakeSec.style.height = (travel + innerHeight) + 'px';
    }
    measure();
    addEventListener('resize', measure);
    addEventListener('scroll', () => {
      const r = snakeSec.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, -r.top / (travel || 1)));
      plane.style.transform = `translateX(${(-travel * p).toFixed(1)}px)`;
      cam.style.transform = `scale(${(0.965 + 0.035 * Math.sin(p * Math.PI)).toFixed(4)}) rotate(${(-1 + 2 * p).toFixed(3)}deg)`;
      const pt = path.getPointAtLength(p * pathLen);
      dot.setAttribute('cx', pt.x); dot.setAttribute('cy', pt.y);
      map.classList.toggle('is-on', r.top < innerHeight * 0.5 && r.bottom > innerHeight * 0.5);
    }, { passive: true });
  }

  /* ---------- preloader ---------- */
  const pre = $('#preloader'), bar = $('#preBar'), pct = $('#prePct');
  let lp = 0;
  const iv = setInterval(() => {
    lp = Math.min(100, lp + 4 + Math.random() * 9);
    bar.style.width = lp + '%'; pct.textContent = Math.floor(lp) + '%';
    if (lp >= 100) {
      clearInterval(iv);
      setTimeout(() => { pre.classList.add('done'); setTimeout(() => pre.remove(), 1100); }, 180);
    }
  }, 66);

  /* ---------- form ---------- */
  $('#bookForm').addEventListener('submit', e => {
    e.preventDefault();
    $('#formOk').hidden = false;
    e.target.querySelector('.form__send').textContent = 'Request noted ✓';
  });
})();
