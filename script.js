// ─── SCENE MANAGEMENT ───────────────────────────────────────
const SCENES = ['home', 'caso1', 'caso2', 'transicao', 'caso3', 'fechamento'];
let currentScene = 0;
let sceneRunning = false;

function showScene(index) {
  const prev = document.querySelector('.scene.active');
  if (prev) { prev.classList.remove('active'); prev.classList.add('exit'); setTimeout(() => prev.classList.remove('exit'), 900); }

  const next = document.getElementById(SCENES[index]);
  next.classList.add('active');
  next.scrollTop = 0;
  updateDots(index);
  updateProgress(index);
  sceneRunning = false;

  switch (SCENES[index]) {
    case 'caso1': animateCaso1(); break;
    case 'caso2': animateCaso2(); break;
    case 'transicao': animateTransicao(); break;
    case 'caso3': animateCaso3(); break;
    case 'fechamento': animateFechamento(); break;
  }

}

function updateDots(idx) {
  document.querySelectorAll('.dot').forEach((d, i) => d.classList.toggle('active', i === idx));
}
function updateProgress(idx) {
  document.getElementById('progress-bar').style.width = `${(idx / (SCENES.length - 1)) * 100}%`;
}

// ─── HOME ────────────────────────────────────────────────────
window.addEventListener('DOMContentLoaded', () => {
  updateDots(0); updateProgress(0);
  typewriterHome();
});

function typewriterHome() {
  const phrases = [
    'Você é ético…',
    '…ou só tem medo?'
  ];
  const el = document.getElementById('typing-text');
  let pi = 0, ci = 0, deleting = false, waiting = false;

  // type first phrase, pause, then add second phrase
  let full = phrases[0];
  let target = '';
  let phase = 0; // 0: type p1, 1: pause, 2: type p2, 3: done

  function tick() {
    if (phase === 0) {
      target += full[ci++];
      el.textContent = target;
      if (ci >= full.length) { phase = 1; setTimeout(tick, 1800); return; }
      setTimeout(tick, 55 + Math.random() * 40);
    } else if (phase === 1) {
      // add line break + start typing p2
      target += '\n';
      el.innerHTML = target.replace('\n', '<br/>');
      full = phrases[1]; ci = 0; phase = 2;
      setTimeout(tick, 400);
    } else if (phase === 2) {
      target += full[ci++];
      el.innerHTML = target.replace('\n', '<br/>');
      if (ci >= full.length) {
        phase = 3;
        setTimeout(() => {
          el.classList.add('done'); // hide cursor
          const btn = document.getElementById('btn-entrar');
          btn.classList.remove('hidden');
          btn.classList.add('visible');
        }, 700);
        return;
      }
      setTimeout(tick, 55 + Math.random() * 40);
    }
  }
  setTimeout(tick, 600);

  document.getElementById('btn-entrar').addEventListener('click', (e) => {
    e.preventDefault();
    currentScene = 1;
    showScene(currentScene);
  });
}

// ─── GENERIC LINE ANIMATOR ──────────────────────────────────
function animateLines(selector, delayBase = 400, interval = 420, onDone) {
  const lines = document.querySelectorAll(selector);
  lines.forEach((line, i) => {
    if (line.classList.contains('pause') || line.classList.contains('big-pause') ||
      line.classList.contains('pause-lg')) return;
    setTimeout(() => line.classList.add('shown'), delayBase + i * interval);
  });
  const total = lines.length;
  setTimeout(onDone || (() => { }), delayBase + total * interval + 300);
}

// ─── CASO 1 ──────────────────────────────────────────────────
function animateCaso1() {
  const h = document.querySelector('#caso1 h2');
  setTimeout(() => h.classList.add('shown'), 200);

  animateLines('#narrative-amanda .line', 600, 430, () => {
    const q = document.getElementById('q-amanda');
    q.classList.remove('hidden'); q.classList.add('visible');
  });

  document.getElementById('next-caso1').addEventListener('click', () => {
    currentScene = 2; showScene(currentScene);
  }, { once: true });
}

// ─── CASO 2 ──────────────────────────────────────────────────
function animateCaso2() {
  const h = document.querySelector('#caso2 h2');
  setTimeout(() => h.classList.add('shown'), 200);

  animateLines('#narrative-hytalo .line', 600, 430, () => {
    const q = document.getElementById('q-hytalo');
    q.classList.remove('hidden'); q.classList.add('visible');
  });

  document.getElementById('next-caso2').addEventListener('click', () => {
    currentScene = 3; showScene(currentScene);
  }, { once: true });
}

// ─── TRANSIÇÃO ──────────────────────────────────────────────
function animateTransicao() {
  animateLines('#trans-lines .t-line', 300, 450, () => {
    const btn = document.getElementById('next-trans');
    btn.classList.remove('hidden'); btn.classList.add('visible');
  });

  document.getElementById('next-trans').addEventListener('click', () => {
    currentScene = 4; showScene(currentScene);
  }, { once: true });
}

// ─── CASO 3 ──────────────────────────────────────────────────
const THREE_PHRASES = [
  `"Você evita fazer o errado porque acredita que é errado…<br/><em>ou acredita que é errado porque aprendeu que será julgado?"</em>`,
  `"Você é contra o bullying porque dói…<br/><em>ou porque ensinaram que é feio admitir que você já riu?"</em>`,
  `"Se a ética só existe quando alguém pode te julgar…<br/><em>então você é ético… ou só tem medo?"</em>`
];

function animateCaso3() {
  const h = document.querySelector('#caso3 h2');
  setTimeout(() => h.classList.add('shown'), 200);
  setTimeout(() => document.querySelector('.fade-text').classList.add('shown'), 400);

  animateLines('#narrative-perfil .line', 900, 420, () => {
    const q = document.getElementById('q-perfil');
    q.classList.remove('hidden'); q.classList.add('visible');

    // inject eth phrases
    const container = document.getElementById('three-phrases');
    THREE_PHRASES.forEach((txt, i) => {
      const div = document.createElement('div');
      div.className = 'eth-phrase';
      div.innerHTML = txt;
      container.appendChild(div);
      setTimeout(() => div.classList.add('shown'), 500 + i * 700);
    });

    // desmonta
    setTimeout(() => {
      const dm = document.getElementById('desmonta');
      dm.classList.remove('hidden'); dm.classList.add('visible');
      document.querySelectorAll('.d-line').forEach((l, i) =>
        setTimeout(() => l.classList.add('shown'), 300 + i * 380)
      );
    }, 500 + THREE_PHRASES.length * 700 + 600);
  });

  document.getElementById('next-caso3').addEventListener('click', () => {
    currentScene = 5; showScene(currentScene);
  }, { once: true });
}

// ─── FECHAMENTO — 5 PHASES ────────────────────────────────────────────────
// PHASE 1: narrative lines
// PHASE 2a: calm MEDO (static, white, imóvel) + btn-ver — nothing auto-starts
// PHASE 2b: user clicks → fast red glitch (80ms cycle)
// PHASE 3: glitch stops, MEDO stabilizes red + grows
// PHASE 4: MEDO flood fills viewport
// PHASE 5: hard blackout, nothing more

const GLITCH_WORDS = ['MEDO', 'MORAL', 'ÉTICA', 'CULPA', 'RISOS', 'GRUPO', 'ACEITO', 'REJEIÇÃO', 'MEDO'];
let _glitchInterval = null;

function animateFechamento() {
  const lines = Array.from(document.querySelectorAll('#close-lines .c-line'));
  const interval = 560;
  let delay = 400;
  let finalWordDelay = 0;

  lines.forEach((line, i) => {
    if (line.classList.contains('pause-lg')) return;
    const d = delay + i * interval;
    setTimeout(() => line.classList.add('shown'), d);
    if (line.id === 'final-word') finalWordDelay = d;
  });

  // 2.5 s after "É medo." → show button
  setTimeout(() => {
    const btnBox = document.getElementById('box-continuar');
    btnBox.classList.remove('hidden');
    btnBox.classList.add('visible');

    document.getElementById('btn-narrative-next').addEventListener('click', () => {
      btnBox.classList.add('hidden');
      btnBox.classList.remove('visible');

      // Instead of going directly to calm MEDO, we intercept with the cinematic sequence
      showSilenceScreen(() => {
        showInteraction(() => {
          showCalmMedo();
        });
      });
    }, { once: true });
  }, finalWordDelay + 2500);
}

// ── PHASE 2a: calm, static MEDO ──────────────────────────────────────────
function showCalmMedo() {
  // fade out narrative
  document.getElementById('close-narrative').classList.add('fade-out');

  // reveal glitch-stage (which shows calm-phase by default)
  setTimeout(() => {
    document.getElementById('glitch-stage').classList.add('active');
    // wire btn-ver — nothing happens until user chooses to click
    document.getElementById('btn-ver').addEventListener('click', onVerClick, { once: true });
  }, 900);
}

// ── PHASE 2b: user clicked → trigger fast red glitch ─────────────────────
function onVerClick() {
  const calmPhase = document.getElementById('calm-phase');
  const glitchWord = document.getElementById('glitch-word');

  // fade calm-phase out
  calmPhase.classList.add('fade-out');

  // after calm fades, activate glitch word
  setTimeout(() => {
    glitchWord.classList.add('glitching');

    // rapid red word cycling — 80 ms, almost uncomfortable
    let wi = 0;
    _glitchInterval = setInterval(() => {
      wi = (wi + 1) % GLITCH_WORDS.length;
      const w = GLITCH_WORDS[wi];
      glitchWord.textContent = w;
      glitchWord.setAttribute('data-text', w);
    }, 80);

    // after 1.2 s of glitch → stabilize
    setTimeout(stabilizeMedo, 1200);
  }, 500);
}

// ── PHASE 3: stabilize ────────────────────────────────────────────────────
function stabilizeMedo() {
  clearInterval(_glitchInterval);
  const glitchWord = document.getElementById('glitch-word');
  glitchWord.textContent = 'MEDO';
  glitchWord.setAttribute('data-text', 'MEDO');
  glitchWord.classList.remove('glitching');
  glitchWord.classList.add('stable');

  // after word grows → flood
  setTimeout(startMedoFlood, 1000);
}

// ── PHASE 4: MEDO flood ───────────────────────────────────────────────────
function startMedoFlood() {
  document.body.classList.add('shaking'); // Start subtle screen shake

  const flood = document.getElementById('medo-flood');
  const TOTAL = 65;
  const SPACING = 2000 / TOTAL;   // fill viewport in ~2 s

  for (let i = 0; i < TOTAL; i++) {
    setTimeout(() => {
      const el = document.createElement('span');
      el.className = 'medo-copy';
      el.textContent = 'MEDO';
      const size = 1.0 + Math.random() * 6.5;
      const op = 0.12 + Math.random() * 0.88;
      el.style.fontSize = `${size}rem`;
      el.style.left = `${Math.random() * 100}%`;
      el.style.top = `${Math.random() * 100}%`;
      el.style.setProperty('--target-opacity', op);
      el.style.animationDelay = `${Math.random() * 0.15}s`;
      flood.appendChild(el);
    }, i * SPACING);
  }

  // ── PHASE 5: hard blackout after ~3.5 s ──────────────────────────────
  setTimeout(() => {
    document.body.classList.remove('shaking');
    document.getElementById('blackout').classList.add('active');
    setTimeout(() => {
      flood.innerHTML = '';

      // Reveal the true final message
      document.getElementById('final-message').classList.add('visible');
      const fLines = document.querySelectorAll('.final-line');
      fLines.forEach((fl, idx) => {
        setTimeout(() => fl.classList.add('visible'), 500 + (idx * 1200));
      });
      // Show "Baseado em casos reais" last
      setTimeout(() => {
        document.querySelector('.final-sub').classList.add('visible');
      }, 500 + (fLines.length * 1200) + 800);

    }, 900);
  }, 3500);
}

// ─── RESTART ──────────────────────────────────────────────────────────────
window.restartSite = function () {
  clearInterval(_glitchInterval);
  _glitchInterval = null;

  // reset glitch elements
  const gw = document.getElementById('glitch-word');
  gw.textContent = 'MEDO';
  gw.setAttribute('data-text', 'MEDO');
  gw.classList.remove('glitching', 'stable');

  // reset calm-phase
  document.getElementById('calm-phase').classList.remove('fade-out');

  // reset btn-ver animation (force reflow)
  const bv = document.getElementById('btn-ver');
  bv.style.animation = 'none'; bv.offsetHeight; bv.style.animation = '';

  document.getElementById('glitch-stage').classList.remove('active');
  document.getElementById('close-narrative').classList.remove('fade-out');
  document.getElementById('medo-flood').innerHTML = '';
  document.getElementById('blackout').classList.remove('active');

  // reset all scenes
  document.querySelectorAll('.scene').forEach(s => s.classList.remove('active', 'exit'));
  document.querySelectorAll('.line, .t-line, .c-line, .d-line, .eth-phrase').forEach(el => el.classList.remove('shown'));
  document.querySelectorAll('h2.reveal, .fade-text').forEach(el => el.classList.remove('shown'));
  document.querySelectorAll('.questions, .desmonta, .restart').forEach(el => { el.classList.add('hidden'); el.classList.remove('visible'); });
  document.getElementById('next-trans').classList.add('hidden');
  document.getElementById('next-trans').classList.remove('visible');
  document.getElementById('three-phrases').innerHTML = '';
  document.body.classList.remove('shaking');

  // reset cinematic overlays
  document.getElementById('final-message').classList.remove('visible');
  document.querySelectorAll('.final-line, .final-sub').forEach(el => el.classList.remove('visible'));
  document.getElementById('interaction-screen').classList.remove('active');
  document.getElementById('interaction-question').style.transition = 'none';
  document.getElementById('interaction-question').style.opacity = '0';
  document.getElementById('interaction-buttons').style.transition = 'none';
  document.getElementById('interaction-buttons').style.opacity = '0';
  document.getElementById('interaction-response').classList.remove('revealed');

  // reset home
  const typingEl = document.getElementById('typing-text');
  typingEl.innerHTML = '';
  typingEl.classList.remove('done');
  document.getElementById('btn-entrar').classList.add('hidden');
  document.getElementById('btn-entrar').classList.remove('visible');

  currentScene = 0;
  document.getElementById('home').classList.add('active');
  updateDots(0);
  updateProgress(0);
  typewriterHome();
};

// ─────────────────────────────────────────────────────────────
// CINEMATIC UX MODULE (Silence, Interaction)
// ─────────────────────────────────────────────────────────────
function showSilenceScreen(onComplete) {
  const silence = document.getElementById('silence-screen');
  silence.classList.add('active');

  setTimeout(() => {
    silence.classList.remove('active');
    setTimeout(onComplete, 600);
  }, 2500);
}

function showInteraction(onComplete) {
  const screen = document.getElementById('interaction-screen');
  const q = document.getElementById('interaction-question');
  const btns = document.getElementById('interaction-buttons');
  const resp = document.getElementById('interaction-response');

  screen.classList.add('active');

  // Restore transitions
  q.style.transition = '';
  btns.style.transition = '';

  const handleAnswer = () => {
    btns.style.pointerEvents = 'none';
    btns.style.opacity = '0';
    q.style.opacity = '0';

    setTimeout(() => {
      resp.classList.add('revealed');

      setTimeout(() => {
        screen.classList.remove('active');
        setTimeout(onComplete, 800);
      }, 2500);
    }, 800);
  };

  document.getElementById('btn-sim').addEventListener('click', handleAnswer, { once: true });
  document.getElementById('btn-nao').addEventListener('click', handleAnswer, { once: true });
}


// ─────────────────────────────────────────────────────────────
// CUSTOM CURSOR — cinematic scanner / lente de observação
// ─────────────────────────────────────────────────────────────
(function () {
  const cursor = document.getElementById('custom-cursor');
  const ring = document.getElementById('cursor-ring');
  const dot = document.getElementById('cursor-dot');

  // Real pointer position (instant)
  let mx = window.innerWidth / 2;
  let my = window.innerHeight / 2;

  // Smoothed ring position (lerped — gives cinematic lag)
  let rx = mx;
  let ry = my;

  const LERP = 0.10; // 0 = completely stuck, 1 = instant

  // Track raw mouse for the dot (exact follow)
  document.addEventListener('mousemove', (e) => {
    mx = e.clientX;
    my = e.clientY;
  });

  // Smooth ring follow via requestAnimationFrame
  function rafLoop() {
    rx += (mx - rx) * LERP;
    ry += (my - ry) * LERP;

    // Ring trails behind (lerped)
    ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;

    // Dot snaps to exact pointer
    dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;

    requestAnimationFrame(rafLoop);
  }
  requestAnimationFrame(rafLoop);

  // ── Hover detection — shows "focus/analyse" state ─────────
  const HOVER_SELECTORS = [
    'button', 'a', '.nav-btn', '.btn-enter',
    '.q-item', '.question-lead', '.phrase-final',
    '.eth-phrase', '.line', '.t-line', '.c-line',
    '.d-line', '.memory-line', '.sub-question',
    '#btn-ver', '#calm-word', '#glitch-word',
    '.victim-photo-wrap', '.tone-drop'
  ].join(', ');

  document.addEventListener('mouseover', (e) => {
    if (e.target.matches(HOVER_SELECTORS) || e.target.closest?.(HOVER_SELECTORS)) {
      cursor.classList.add('hovering');
    }
  });

  document.addEventListener('mouseout', (e) => {
    if (e.target.matches(HOVER_SELECTORS) || e.target.closest?.(HOVER_SELECTORS)) {
      cursor.classList.remove('hovering');
    }
  });

  // ── Subtle periodic glitch (psychological discomfort) ─────
  function scheduleGlitch() {
    const delay = 3000 + Math.random() * 4000; // every 3-7 s
    setTimeout(() => {
      cursor.classList.add('glitching');
      // 3 iterations × 80ms = 240ms + buffer
      setTimeout(() => {
        cursor.classList.remove('glitching');
        scheduleGlitch();
      }, 360);
    }, delay);
  }
  scheduleGlitch();

  // ── Hide when mouse leaves the window ────────────────────
  document.addEventListener('mouseleave', () => { cursor.style.opacity = '0'; });
  document.addEventListener('mouseenter', () => { cursor.style.opacity = '1'; });
})();
