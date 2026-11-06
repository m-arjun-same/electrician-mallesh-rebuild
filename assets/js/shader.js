/* Mallesh — own WebGL "oceanic waves" background for section 1.
   Written from scratch: domain-warped sine swells + value-noise fbm,
   coloured on the 4-stop ramp Dinesh picked (#031C26, #1B6CA8, #5AD2F4, #EAF9FF).
   Pauses off-screen; reduced motion gets one still frame; no WebGL → CSS fallback. */
(function () {
  'use strict';
  const cv = document.getElementById('dawnShader');
  if (!cv) return;
  const gl = cv.getContext('webgl', { alpha: false, antialias: false });
  if (!gl) return; /* CSS gradient on .dawn remains as the fallback */

  const VS = `
    attribute vec2 p; varying vec2 vUv;
    void main(){ vUv = p * .5 + .5; gl_Position = vec4(p, 0., 1.); }`;
  const FS = `
    precision highp float;
    varying vec2 vUv; uniform float uT; uniform vec2 uR;
    float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }
    float noise(vec2 p){
      vec2 i = floor(p), f = fract(p);
      vec2 u = f * f * (3. - 2. * f);
      return mix(mix(hash(i), hash(i + vec2(1., 0.)), u.x),
                 mix(hash(i + vec2(0., 1.)), hash(i + vec2(1., 1.)), u.x), u.y);
    }
    float fbm(vec2 p){
      float v = 0., a = .5;
      mat2 m = mat2(1.6, 1.2, -1.2, 1.6);
      for (int i = 0; i < 5; i++){ v += a * noise(p); p = m * p; a *= .5; }
      return v;
    }
    void main(){
      vec2 uv = vUv;
      vec2 p = vec2(uv.x * uR.x / uR.y, uv.y) * 2.2;
      float t = uT * .55;
      /* domain warp: the swell pushes the small waves around */
      float warp = fbm(p * 1.35 + vec2(t * .07, t * .045));
      float h = 0.;
      h += sin(p.x * 2.1 + t * .5 + warp * 3.1) * .34;
      h += sin(p.y * 3.4 - t * .34 + warp * 2.2) * .21;
      h += sin((p.x + p.y) * 1.35 + t * .24) * .17;
      h += fbm(p * 2.9 - vec2(0., t * .09)) * .55;
      h = h * .5 + .5;
      vec3 deep = vec3(.012, .110, .149);   /* #031C26 */
      vec3 mid  = vec3(.106, .424, .659);   /* #1B6CA8 */
      vec3 glow = vec3(.353, .824, .957);   /* #5AD2F4 */
      vec3 foam = vec3(.918, .976, 1.000);  /* #EAF9FF */
      vec3 c = mix(deep, mid, smoothstep(.12, .55, h));
      c = mix(c, glow, smoothstep(.55, .84, h));
      c = mix(c, foam, smoothstep(.84, .985, h) * .8);
      /* sparkle on the crests + a breath of light from the lower left */
      float sp = noise(p * 26. + t * .8);
      c += vec3(.9, .97, 1.) * step(.93, sp) * smoothstep(.6, .95, h) * .12;
      c *= .82 + .3 * (1. - uv.y) * (0.4 + 0.6 * uv.x);
      gl_FragColor = vec4(c, 1.);
    }`;

  function sh(type, src) {
    const s = gl.createShader(type);
    gl.shaderSource(s, src); gl.compileShader(s);
    return s;
  }
  const prog = gl.createProgram();
  gl.attachShader(prog, sh(gl.VERTEX_SHADER, VS));
  gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FS));
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
  gl.useProgram(prog);
  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, 'p');
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  const uT = gl.getUniformLocation(prog, 'uT');
  const uR = gl.getUniformLocation(prog, 'uR');

  function size() {
    const dpr = Math.min(1.5, devicePixelRatio || 1);
    const w = cv.clientWidth * dpr, h = cv.clientHeight * dpr;
    if (cv.width !== w || cv.height !== h) {
      cv.width = w; cv.height = h;
      gl.viewport(0, 0, w, h);
      gl.uniform2f(uR, w, h);
    }
  }
  const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let visible = true, raf = 0;
  const t0 = performance.now();
  function frame() {
    size();
    gl.uniform1f(uT, (performance.now() - t0) / 1000);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    if (!RM && visible) raf = requestAnimationFrame(frame);
  }
  if (RM) { size(); gl.uniform1f(uT, 9.0); gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4); }
  else {
    new IntersectionObserver(en => {
      const v = en[0].isIntersecting;
      if (v && !visible) { visible = true; raf = requestAnimationFrame(frame); }
      visible = v;
      if (!v) cancelAnimationFrame(raf);
    }).observe(cv);
    raf = requestAnimationFrame(frame);
  }
  addEventListener('resize', () => { if (RM) { size(); gl.uniform1f(uT, 9.0); gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4); } });
})();
