/* =============================================
   FLORES MORADAS - script.js
   ============================================= */

(function () {
  'use strict';

  /* ─── DOM ─── */
  const starCanvas      = document.getElementById('starCanvas');
  const ctx             = starCanvas.getContext('2d');
  const petalsContainer = document.getElementById('petalsContainer');
  const introScreen     = document.getElementById('introScreen');
  const letterScreen    = document.getElementById('letterScreen');
  const envelopeWrapper = document.getElementById('envelopeWrapper');
  const bgMusic         = document.getElementById('bgMusic');
  const musicControl    = document.getElementById('musicControl');
  const musicIcon       = document.getElementById('musicIcon');
  const btnBack         = document.getElementById('btnBack');

  /* ─── ESTADO ─── */
  let musicPlaying = false;
  let stars        = [];
  let canOpen      = true; // evita doble clic

  /* ══════════════════════════════════
     1. CANVAS ESTRELLAS
  ══════════════════════════════════ */
  function resizeCanvas() {
    starCanvas.width  = window.innerWidth;
    starCanvas.height = window.innerHeight;
  }

  function createStars(count) {
    stars = [];
    for (let i = 0; i < count; i++) {
      stars.push({
        x:      Math.random() * starCanvas.width,
        y:      Math.random() * starCanvas.height,
        r:      Math.random() * 1.8 + 0.3,
        alpha:  Math.random(),
        dAlpha: (Math.random() * 0.012 + 0.004) * (Math.random() < 0.5 ? 1 : -1),
        color:  pickStarColor(),
      });
    }
  }

  function pickStarColor() {
    const palette = [
      'rgba(255,255,255,',
      'rgba(195,155,211,',
      'rgba(233,30,140,',
      'rgba(249,228,183,',
    ];
    return palette[Math.floor(Math.random() * palette.length)];
  }

  function drawStars() {
    ctx.clearRect(0, 0, starCanvas.width, starCanvas.height);

    // Fondo cósmico
    const grad = ctx.createRadialGradient(
      starCanvas.width * 0.5, starCanvas.height * 0.4, 0,
      starCanvas.width * 0.5, starCanvas.height * 0.5, starCanvas.width * 0.8
    );
    grad.addColorStop(0,   '#1a0a35');
    grad.addColorStop(0.5, '#0d0620');
    grad.addColorStop(1,   '#050210');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, starCanvas.width, starCanvas.height);

    // Nebulosa
    const neb = ctx.createRadialGradient(
      starCanvas.width * 0.3, starCanvas.height * 0.25, 0,
      starCanvas.width * 0.3, starCanvas.height * 0.25, starCanvas.width * 0.45
    );
    neb.addColorStop(0,   'rgba(142,68,173,0.12)');
    neb.addColorStop(0.5, 'rgba(125,60,152,0.06)');
    neb.addColorStop(1,   'transparent');
    ctx.fillStyle = neb;
    ctx.fillRect(0, 0, starCanvas.width, starCanvas.height);

    // Estrellas
    stars.forEach(s => {
      s.alpha += s.dAlpha;
      if (s.alpha >= 1)   { s.alpha = 1;   s.dAlpha = -s.dAlpha; }
      if (s.alpha <= 0.1) { s.alpha = 0.1; s.dAlpha = -s.dAlpha; }
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = s.color + s.alpha + ')';
      ctx.fill();
      if (s.r > 1.4) {
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = s.color + (s.alpha * 0.2) + ')';
        ctx.fill();
      }
    });

    requestAnimationFrame(drawStars);
  }

  function initStars() {
    resizeCanvas();
    createStars(250);
    drawStars();
  }

  window.addEventListener('resize', () => { resizeCanvas(); createStars(250); });

  /* ══════════════════════════════════
     2. PÉTALOS FLOTANTES
  ══════════════════════════════════ */
  const PETALS = ['🌸', '💜', '🌺', '✨', '💫', '🌷'];

  function createPetal() {
    const el = document.createElement('div');
    el.classList.add('petal');
    el.textContent = PETALS[Math.floor(Math.random() * PETALS.length)];
    el.style.left     = Math.random() * 100 + 'vw';
    el.style.fontSize = (Math.random() * 1.2 + 0.7) + 'rem';
    const dur = Math.random() * 8 + 8;
    el.style.animationDuration = dur + 's';
    el.style.animationDelay   = (Math.random() * dur) + 's';
    petalsContainer.appendChild(el);
    setTimeout(() => el.remove(), (dur * 2) * 1000);
  }

  function startPetals() {
    for (let i = 0; i < 14; i++) setTimeout(createPetal, i * 300);
    setInterval(() => { if (petalsContainer.children.length < 25) createPetal(); }, 1200);
  }

  /* ══════════════════════════════════
     3. ESTRELLAS FUGACES
  ══════════════════════════════════ */
  function spawnShootingStar() {
    const star = document.createElement('div');
    star.classList.add('shooting-star');
    star.style.left = Math.random() * (window.innerWidth * 0.7) + 'px';
    star.style.top  = Math.random() * (window.innerHeight * 0.4) + 'px';
    const dur = Math.random() * 1 + 0.8;
    star.style.animationDuration = dur + 's';
    document.body.appendChild(star);
    setTimeout(() => star.remove(), dur * 1000 + 200);
  }

  function startShootingStars() {
    spawnShootingStar();
    setInterval(() => { if (Math.random() < 0.6) spawnShootingStar(); }, 2500);
  }

  /* ══════════════════════════════════
     4. TRANSICIÓN INTRO → CARTA
  ══════════════════════════════════ */
  function openEnvelope() {
    if (!canOpen) return;
    canOpen = false;

    // Animación del sobre
    envelopeWrapper.classList.add('envelope-open');
    envelopeWrapper.style.cursor = 'default';

    // Iniciar música
    if (!musicPlaying) tryPlayMusic();

    // Esperar la animación del sobre y luego cambiar pantalla
    setTimeout(() => {
      // Ocultar intro con fade
      introScreen.classList.remove('active');

      // Mostrar carta tras el fade
      setTimeout(() => {
        // Importante: letterScreen usa position:relative + scroll
        // Necesitamos sacarlo del flujo fixed temporalmente
        letterScreen.style.position  = 'relative';
        letterScreen.style.minHeight = '100svh';
        letterScreen.classList.add('active');
        window.scrollTo({ top: 0, behavior: 'instant' });
      }, 700); // coincide con transition de opacity

    }, 900); // tiempo animación sobre
  }

  envelopeWrapper.addEventListener('click', openEnvelope);
  envelopeWrapper.addEventListener('touchend', (e) => {
    e.preventDefault();
    openEnvelope();
  });

  /* ══════════════════════════════════
     5. BOTÓN VOLVER
  ══════════════════════════════════ */
  btnBack.addEventListener('click', () => {
    // Ocultar carta
    letterScreen.classList.remove('active');

    setTimeout(() => {
      // Pausar música al volver
      bgMusic.pause();
      bgMusic.currentTime = 0;
      musicPlaying = false;
      musicControl.classList.add('paused');
      musicIcon.textContent = '🎵';

      // Resetear sobre
      envelopeWrapper.classList.remove('envelope-open');
      envelopeWrapper.style.cursor = 'pointer';
      canOpen = true;

      // Mostrar intro
      introScreen.classList.add('active');
      window.scrollTo({ top: 0, behavior: 'instant' });
    }, 700);
  });

  /* ══════════════════════════════════
     6. MÚSICA
  ══════════════════════════════════ */
  musicControl.addEventListener('click', toggleMusic);

  function toggleMusic() {
    if (musicPlaying) {
      bgMusic.pause();
      musicPlaying = false;
      musicControl.classList.add('paused');
      musicIcon.textContent = '🎵';
    } else {
      tryPlayMusic();
    }
  }

  function tryPlayMusic() {
    const promise = bgMusic.play();
    if (promise !== undefined) {
      promise.then(() => {
        musicPlaying = true;
        musicControl.classList.remove('paused');
        musicIcon.textContent = '🎵';
        fadeInMusic();
      }).catch(() => {
        musicPlaying = false;
      });
    }
  }

  function fadeInMusic() {
    bgMusic.volume = 0;
    let vol = 0;
    const fade = setInterval(() => {
      vol = Math.min(vol + 0.05, 0.5);
      bgMusic.volume = vol;
      if (vol >= 0.5) clearInterval(fade);
    }, 150);
  }

  /* ══════════════════════════════════
     7. PARTÍCULAS AL HACER CLIC
  ══════════════════════════════════ */
  const PARTICLE_STYLE_ID = 'particleStyle';
  if (!document.getElementById(PARTICLE_STYLE_ID)) {
    const s = document.createElement('style');
    s.id = PARTICLE_STYLE_ID;
    s.textContent = `
      @keyframes particleBurst {
        0%   { transform: translate(-50%,-50%) scale(1); opacity: 1; }
        100% { transform: translate(calc(-50% + var(--dx)), calc(-50% + var(--dy))) scale(0.3); opacity: 0; }
      }`;
    document.head.appendChild(s);
  }

  function spawnParticles(x, y) {
    const emojis = ['💜', '✨', '🌸', '⭐', '💫', '🌺'];
    for (let i = 0; i < 5; i++) {
      const p = document.createElement('div');
      p.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      p.style.cssText = `
        position:fixed; left:${x}px; top:${y}px;
        font-size:${Math.random()*1.2+0.7}rem;
        pointer-events:none; z-index:9999;
        transform:translate(-50%,-50%);
        animation:particleBurst ${Math.random()*0.6+0.8}s ease-out forwards;
        --dx:${(Math.random()-0.5)*120}px;
        --dy:${(Math.random()-0.8)*100}px;
      `;
      document.body.appendChild(p);
      setTimeout(() => p.remove(), 1400);
    }
  }

  document.addEventListener('click', e => spawnParticles(e.clientX, e.clientY));
  document.addEventListener('touchstart', e => {
    const t = e.touches[0];
    spawnParticles(t.clientX, t.clientY);
  }, { passive: true });

  /* ══════════════════════════════════
     8. FLORES LATERALES
  ══════════════════════════════════ */
  if (!document.getElementById('floatSideStyle')) {
    const s = document.createElement('style');
    s.id = 'floatSideStyle';
    s.textContent = `
      @keyframes floatSide {
        0%,100% { transform:translateY(0) rotate(0deg) scale(1); }
        33%      { transform:translateY(-20px) rotate(15deg) scale(1.1); }
        66%      { transform:translateY(10px) rotate(-10deg) scale(0.95); }
      }`;
    document.head.appendChild(s);
  }

  for (let i = 0; i < 10; i++) {
    const side = Math.random() < 0.5 ? 'left' : 'right';
    const el   = document.createElement('div');
    el.textContent = Math.random() < 0.5 ? '🌸' : '💜';
    el.style.cssText = `
      position:fixed; ${side}:${Math.random()*8+1}%; top:${Math.random()*80+10}%;
      font-size:${Math.random()*1.5+1}rem; pointer-events:none; z-index:3;
      animation:floatSide ${Math.random()*4+5}s ease-in-out infinite;
      animation-delay:${Math.random()*3}s;
      filter:drop-shadow(0 0 8px rgba(155,89,182,0.7)); opacity:0.8;
    `;
    document.body.appendChild(el);
  }

  /* ══════════════════════════════════
     9. INIT
  ══════════════════════════════════ */
  initStars();
  startPetals();
  startShootingStars();

  // En móvil intentar música al primer toque
  document.addEventListener('touchstart', function firstTouch() {
    if (!musicPlaying) tryPlayMusic();
    document.removeEventListener('touchstart', firstTouch);
  }, { once: true });

})();
