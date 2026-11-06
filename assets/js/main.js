/* Mallesh — own site logic: build sections from data, preloader, menu, reveals, rotator. */
(function () {
  'use strict';
  const $ = (s, el) => (el || document).querySelector(s);
  const $$ = (s, el) => [...(el || document).querySelectorAll(s)];

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

  /* covers */
  $('#covers').innerHTML = SERVICES.map((s, i) => `
    <a class="cover reveal" href="#book" data-goto>
      <img src="assets/img/work/${s[0]}/still.webp" srcset="assets/img/work/${s[0]}/still-s.webp 1280w, assets/img/work/${s[0]}/still.webp 1920w, assets/img/work/${s[0]}/still-xl.webp 2560w" sizes="(max-width:820px) 100vw, 50vw" alt="${s[1]}" loading="${i < 2 ? 'eager' : 'lazy'}">
      <span class="cover__n">№ ${i + 1}</span>
      <span class="cover__meta"><span class="cover__t">${s[1]}</span><span class="cover__k">${s[2]}</span></span>
    </a>`).join('');

  /* marquee (two identical halves for the loop) */
  const half = PLACES.map(p => `<img src="assets/img/clients/${p}.webp" alt="" loading="lazy">`).join('');
  $('#marqueeIn').innerHTML = half + half;

  /* service rows */
  $('#rows').innerHTML = SERVICES.slice(0, 7).map((s, i) => `
    <div class="row reveal"><span class="row__n">0${i + 1}</span><span class="row__t">${s[1]}</span><span class="row__d">${s[3]}</span><span class="row__a">→</span></div>`).join('');

  /* caps */
  $('#capsList').innerHTML = CAPS.map(c => `<li class="reveal">${c[0]}<span>${c[1]}</span></li>`).join('');

  /* toolkit wall */
  $('#wall').innerHTML = WALL.map(g => `
    <div class="wall__g reveal"><b>${g[0]}</b>${g[1].map(t => `<span class="tag">${t}</span>`).join('')}</div>`).join('');

  /* steps */
  $('#steps').innerHTML = STEPS.map((s, i) => `
    <li class="step reveal"><b>Step ${i + 1}</b><h4>${s[0]}</h4><p>${s[1]}</p></li>`).join('');

  /* now rotator */
  const names = SERVICES.map(s => s[1]);
  let ni = 0;
  const rot = $('#nowRot');
  setInterval(() => {
    rot.style.opacity = 0;
    setTimeout(() => { ni = (ni + 1) % names.length; rot.textContent = names[ni]; rot.style.opacity = 1; }, 260);
  }, 2600);
  rot.style.transition = 'opacity .26s';

  /* reveals */
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }), { threshold: 0.12 });
  $$('.reveal').forEach(el => io.observe(el));

  /* menu */
  const menuBtn = $('#menuBtn');
  menuBtn.addEventListener('click', () => {
    const open = document.body.classList.toggle('menu-open');
    $('#menu').setAttribute('aria-hidden', String(!open));
  });

  /* smooth anchors (own easing scroll) */
  function goto(target) {
    const el = typeof target === 'string' ? $(target) : target;
    if (!el) return;
    document.body.classList.remove('menu-open');
    const y = el.getBoundingClientRect().top + scrollY - 10;
    const start = scrollY, dist = y - start, t0 = performance.now(), dur = Math.min(1400, 500 + Math.abs(dist) * 0.35);
    (function step(t) {
      const p = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - p, 4);
      scrollTo(0, start + dist * e);
      if (p < 1) requestAnimationFrame(step);
    })(t0);
  }
  $$('[data-goto]').forEach(a => a.addEventListener('click', e => {
    const href = a.getAttribute('href');
    if (href && href.startsWith('#')) { e.preventDefault(); goto(href === '#top' ? document.body : href); }
  }));

  /* preloader */
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

  /* form */
  $('#bookForm').addEventListener('submit', e => {
    e.preventDefault();
    $('#formOk').hidden = false;
    e.target.querySelector('.form__send').textContent = 'Request noted ✓';
  });
})();
