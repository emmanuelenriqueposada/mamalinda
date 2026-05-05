/* =============================================
   FLORES MORADAS - script.js
   Animaciones: estrellas, pétalos, sobre,
   carta, música, estrellas fugaces
   ============================================= */

(function () {
  'use strict';

  /* ─── REFERENCIAS DOM ─── */
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
  let animFrameId  = null;
  let stars        = [];

  /* ══════════════════════════════════════
     1. CANVAS ESTRELLAS
  ══════════════════════════════════════ */
  function resizeCanvas() {
    starCanvas.width  = window.innerWidth;
    starCanvas.height = window.innerHeight;
  }

  function createStars(count) {
    stars = [];
    for (let i = 0; i < count; i++) {
      stars.push({
        x:       Math.random() * starCanvas.width,
        y:       Math.random() * starCanvas.height,
        r:       Math.random() * 1.8 + 0.3,
        alpha:   Math.random(),
        dAlpha:  (Math.random() * 0.012 + 0.004) * (Math.random() < 0.5 ? 1 : -1),
        color:   pickStarColor(),
      });
    }
  }

  function pickStarColor() {
    const palette = [
      'rgba(255,255,255,',
      'rgba(195,155,211,',   // purple-glow
      'rgba(233,30,140,',    // pink
      'rgba(249,228,183,',   // gold
    ];
    return palette[Math.floor(Math.random() * palette.length)];
  }

  function drawStars() {
    ctx.clearRect(0, 0, starCanvas.width, starCanvas.height);

    // Fondo degradado cósmico
    const grad = ctx.createRadialGradient(
      starCanvas.width * 0.5, starCanvas.height * 0.4, 0,
      starCanvas.width * 0.5, starCanvas.height * 0.5, starCanvas.width * 0.8
    );
    grad.addColorStop(0,   '#1a0a35');
    grad.addColorStop(0.5, '#0d0620');
    grad.addColorStop(1,   '#050210');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, starCanvas.width, starCanvas.height);

    // Nebulosa sutil
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

      // Brillo extra en estrellas grandes
      if (s.r > 1.4) {
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = s.color + (s.alpha * 0.2) + ')';
        ctx.fill();
      }
    });

    animFrameId = requestAnimationFrame(drawStars);
  }

  function initStars() {
    resizeCanvas();
    createStars(250);
    drawStars();
  }

  window.addEventListener('resize', () => {
    resizeCanvas();
    createStars(250);
  });

  /* ══════════════════════════════════════
     2. PÉTALOS FLOTANTES
  ══════════════════════════════════════ */
  const PETALS = ['🌸', '💜', '🌺', '✨', '🫧', '💫', '🌷'];

  function createPetal() {
    const el = document.createElement('div');
    el.classList.add('petal');
    el.textContent = PETALS[Math.floor(Math.random() * PETALS.length)];
    el.style.left     = Math.random() * 100 + 'vw';
    el.style.fontSize = (Math.random() * 1.2 + 0.7) + 'rem';

    const dur = Math.random() * 8 + 8;
    el.style.animationDuration = dur + 's';
    el.style.animationDelay   = (Math.random() * dur) + 's';
    el.style.opacity = (Math.random() * 0.5 + 0.5).toString();

    petalsContainer.appendChild(el);

    // Eliminar después de que termine la animación
    setTimeout(() => el.remove(), (dur + dur) * 1000);
  }

  function startPetals() {
    // Crear varios al inicio
    for (let i = 0; i < 14; i++) {
      setTimeout(createPetal, i * 300);
    }
    // Generar continuamente
    setInterval(() => {
      if (petalsContainer.children.length < 25) createPetal();
    }, 1200);
  }

  /* ══════════════════════════════════════
     3. ESTRELLAS FUGACES
  ══════════════════════════════════════ */
  function spawnShootingStar() {
    const star = document.createElement('div');
    star.classList.add('shooting-star');

    // Posición aleatoria superior
    const startX = Math.random() * (window.innerWidth * 0.7);
    const startY = Math.random() * (window.innerHeight * 0.4);
    star.style.left = startX + 'px';
    star.style.top  = startY + 'px';

    const dur = Math.random() * 1 + 0.8;
    star.style.animationDuration = dur + 's';

    document.body.appendChild(star);
    setTimeout(() => star.remove(), dur * 1000 + 200);
  }

  function startShootingStars() {
    spawnShootingStar();
    setInterval(() => {
      if (Math.random() < 0.6) spawnShootingStar();
    }, 2500);
  }

  /* ══════════════════════════════════════
     4. SOBRE ANIMADO → ABRIR CARTA
  ══════════════════════════════════════ */
  envelopeWrapper.addEventListener('click', openEnvelope);
  envelopeWrapper.addEventListener('touchend', (e) => {
    e.preventDefault();
    openEnvelope();
  });

  function openEnvelope() {
    // Evitar doble clic
    envelopeWrapper.removeEventListener('click', openEnvelope);

    // 1. Animación de solapa
    envelopeWrapper.classList.add('envelope-open');

    // 2. Añadir clase de "abriendo" en el sobre
    envelopeWrapper.style.cursor = 'default';

    // 3. Reproducir música si no está sonando
    if (!musicPlaying) tryPlayMusic();

    // 4. Transición a pantalla de carta tras un delay
    setTimeout(() => {
      introScreen.classList.add('exit');
      introScreen.classList.remove('active');

      setTimeout(() => {
        introScreen.style.display = 'none';
        letterScreen.classList.add('active');
      }, 800);
    }, 900);
  }

  /* ══════════════════════════════════════
     5. BOTÓN VOLVER
  ══════════════════════════════════════ */
  btnBack.addEventListener('click', goBack);

  function goBack() {
    letterScreen.classList.remove('active');
    letterScreen.classList.add('exit');

    setTimeout(() => {
      letterScreen.classList.remove('exit');
      introScreen.style.display = '';
      introScreen.classList.remove('exit');
      introScreen.classList.add('active');

      // Resetear sobre
      envelopeWrapper.classList.remove('envelope-open');
      envelopeWrapper.style.cursor = 'pointer';
      envelopeWrapper.addEventListener('click', openEnvelope);
    }, 800);
  }

  /* ══════════════════════════════════════
     6. CONTROL DE MÚSICA
  ══════════════════════════════════════ */
  musicControl.addEventListener('click', toggleMusic);

  function toggleMusic() {
    if (musicPlaying) {
      bgMusic.pause();
      musicPlaying = false;
      musicControl.classList.add('paused');
      musicIcon.textContent = '🔇';
    } else {
      tryPlayMusic();
    }
  }

  function tryPlayMusic() {
    bgMusic.volume = 0.5;
    const promise = bgMusic.play();
    if (promise !== undefined) {
      promise.then(() => {
        musicPlaying = true;
        musicControl.classList.remove('paused');
        musicIcon.textContent = '🎵';
        fadeInMusic();
      }).catch(() => {
        // Autoplay bloqueado, esperar interacción
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

  /* ══════════════════════════════════════
     7. PARTÍCULAS MÁGICAS AL HACER CLIC
  ══════════════════════════════════════ */
  document.addEventListener('click', spawnParticles);
  document.addEventListener('touchstart', (e) => {
    const t = e.touches[0];
    spawnParticles({ clientX: t.clientX, clientY: t.clientY });
  }, { passive: true });

  function spawnParticles(e) {
    const emojis = ['💜', '✨', '🌸', '⭐', '💫', '🌺'];
    const count  = 5;
    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      p.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      p.style.cssText = `
        position: fixed;
        left: ${e.clientX}px;
        top: ${e.clientY}px;
        font-size: ${Math.random() * 1.2 + 0.7}rem;
        pointer-events: none;
        z-index: 9999;
        transform: translate(-50%, -50%);
        animation: particleBurst ${Math.random() * 0.6 + 0.8}s ease-out forwards;
        --dx: ${(Math.random() - 0.5) * 120}px;
        --dy: ${(Math.random() - 0.8) * 100}px;
      `;
      document.body.appendChild(p);
      setTimeout(() => p.remove(), 1400);
    }
  }

  // Keyframes para partículas (inyectados dinámicamente)
  if (!document.getElementById('particleStyle')) {
    const s = document.createElement('style');
    s.id = 'particleStyle';
    s.textContent = `
      @keyframes particleBurst {
        0%   { transform: translate(-50%, -50%) scale(1); opacity: 1; }
        100% { transform: translate(calc(-50% + var(--dx)), calc(-50% + var(--dy))) scale(0.3); opacity: 0; }
      }
    `;
    document.head.appendChild(s);
  }

  /* ══════════════════════════════════════
     8. FLORES LATERALES ANIMADAS (JS)
     Flores adicionales flotando a los lados
  ══════════════════════════════════════ */
  function createSideFlower() {
    const side = Math.random() < 0.5 ? 'left' : 'right';
    const el   = document.createElement('div');
    el.textContent = Math.random() < 0.5 ? '🌸' : '💜';
    el.style.cssText = `
      position: fixed;
      ${side}: ${Math.random() * 8 + 1}%;
      top: ${Math.random() * 80 + 10}%;
      font-size: ${Math.random() * 1.5 + 1}rem;
      pointer-events: none;
      z-index: 3;
      animation: floatSide ${Math.random() * 4 + 5}s ease-in-out infinite;
      animation-delay: ${Math.random() * 3}s;
      filter: drop-shadow(0 0 8px rgba(155,89,182,0.7));
      opacity: 0.8;
    `;
    document.body.appendChild(el);
  }

  if (!document.getElementById('floatSideStyle')) {
    const s = document.createElement('style');
    s.id = 'floatSideStyle';
    s.textContent = `
      @keyframes floatSide {
        0%, 100% { transform: translateY(0) rotate(0deg) scale(1); }
        33%       { transform: translateY(-20px) rotate(15deg) scale(1.1); }
        66%       { transform: translateY(10px) rotate(-10deg) scale(0.95); }
      }
    `;
    document.head.appendChild(s);
  }

  for (let i = 0; i < 10; i++) createSideFlower();

  /* ══════════════════════════════════════
     9. INICIAR TODO
  ══════════════════════════════════════ */
  initStars();
  startPetals();
  startShootingStars();

  // Intentar música al primer toque/clic en móvil
  document.addEventListener('touchstart', function firstTouch() {
    if (!musicPlaying) tryPlayMusic();
    document.removeEventListener('touchstart', firstTouch);
  }, { once: true });

})();
