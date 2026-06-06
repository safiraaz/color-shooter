// game.js — state dan loop utama

const canvas = document.getElementById('gc');
const ctx = canvas.getContext('2d');
const overlay = document.getElementById('overlay');
const cpopEl = document.getElementById('cpop');
const colorDotsEl = document.getElementById('color-dots');

let W, H, SHOOTER_X, SHOOTER_Y;

const state = {
  running: false,
  score: 0,
  lives: 3,
  level: 1,
  colorIdx: 0,
  spawnTimer: 0,
  spawnInterval: 90,
  baseSpeed: 1.4,
  frame: 0,
  flashFrames: 0,
};

let comboTimer = null;

// ── Setup ──

function resize() {
  const wrap = document.getElementById('canvas-wrap');
  W = wrap.clientWidth;
  H = wrap.clientHeight;
  canvas.width = W;
  canvas.height = H;
  SHOOTER_X = W / 2;
  SHOOTER_Y = H - 52;
}

function buildColorDots() {
  colorDotsEl.innerHTML = '';
  COLORS.forEach((c, i) => {
    const dot = document.createElement('div');
    dot.className = 'color-dot' + (i === state.colorIdx ? ' active' : '');
    dot.style.background = c.hex;
    dot.style.color = c.hex;
    colorDotsEl.appendChild(dot);
  });
}

function updateDots() {
  const dots = colorDotsEl.querySelectorAll('.color-dot');
  dots.forEach((d, i) => d.classList.toggle('active', i === state.colorIdx));
}

function updateHUD() {
  document.getElementById('sv').textContent = state.score;
  document.getElementById('lv').textContent = hearts(state.lives);
  document.getElementById('lvv').textContent = state.level;
}

function hearts(n) {
  const map = { 3: '❤️❤️❤️', 2: '❤️❤️', 1: '❤️', 0: '💀' };
  return map[Math.max(0, n)] ?? '💀';
}

// ── Pop ──

function showPop(text) {
  cpopEl.textContent = text;
  cpopEl.style.opacity = '1';
  clearTimeout(comboTimer);
  comboTimer = setTimeout(() => (cpopEl.style.opacity = '0'), 900);
}

// ── Actions ──

function changeColor(dir) {
  if (!state.running) return;
  state.colorIdx = (state.colorIdx + dir + COLORS.length) % COLORS.length;
  state.flashFrames = 6;
  updateDots();
}

function shoot() {
  if (!state.running) return;
  spawnBullet(SHOOTER_X, SHOOTER_Y - 24, state.colorIdx);
}

// ── Game flow ──

function startGame() {
  resize();
  clearEntities();
  clearParticles();

  Object.assign(state, {
    running: true,
    score: 0,
    lives: 3,
    level: 1,
    colorIdx: 0,
    spawnTimer: 0,
    spawnInterval: 90,
    baseSpeed: 1.4,
    frame: 0,
    flashFrames: 0,
  });

  overlay.classList.remove('visible');
  buildColorDots();
  updateHUD();
  loop();
}

function triggerGameOver() {
  state.running = false;
  overlay.innerHTML = `
    <h1 class="game-title">GAME<br>OVER</h1>
    <p style="font-family:'Space Mono',monospace;font-size:14px;color:rgba(240,240,245,0.5);letter-spacing:0.05em">
      SKOR: <span style="color:#fff;font-weight:700">${state.score}</span>
    </p>
    <button id="sbstart" class="start-btn">MAIN LAGI</button>
  `;
  overlay.classList.add('visible');
  document.getElementById('sbstart').addEventListener('click', startGame);
}

// ── Main Loop ──

function loop() {
  if (!state.running) return;
  state.frame++;
  if (state.flashFrames > 0) state.flashFrames--;

  // Level up
  const newLevel = 1 + Math.floor(state.score / 200);
  if (newLevel !== state.level) {
    state.level = newLevel;
    state.baseSpeed = 1.4 + (newLevel - 1) * 0.28;
    state.spawnInterval = Math.max(30, 90 - (newLevel - 1) * 12);
    showPop('LEVEL ' + newLevel + '! 🔥');
    updateHUD();
  }

  // Spawn
  state.spawnTimer++;
  if (state.spawnTimer >= state.spawnInterval) {
    spawnEnemy(W, state.baseSpeed, state.level);
    state.spawnTimer = 0;
  }

  // Update
  updateEnemies(H, SHOOTER_Y, (e) => {
    // Enemy lolos
    state.lives = Math.max(0, state.lives - 1);
    spawnParticles(SHOOTER_X, SHOOTER_Y, COLORS[e.ci].hex, 10, false);
    updateHUD();
    if (state.lives <= 0) {
      renderFrame(ctx, W, H, SHOOTER_X, SHOOTER_Y, state.colorIdx, state.flashFrames);
      setTimeout(triggerGameOver, 350);
      return;
    }
  });

  updateBullets();

  checkCollisions(
    // Hit benar
    (e) => {
      state.score += 10;
      spawnParticles(e.x, e.y, COLORS[e.ci].hex, 16, true);
      showPop('+10');
      updateHUD();
    },
    // Hit salah → mati
    (b, e) => {
      state.lives = 0;
      spawnParticles(e.x, e.y, COLORS[e.ci].hex, 12, true);
      spawnParticles(SHOOTER_X, SHOOTER_Y, COLORS[b.ci].hex, 12, true);
      updateHUD();
      state.running = false;
      renderFrame(ctx, W, H, SHOOTER_X, SHOOTER_Y, state.colorIdx, state.flashFrames);
      updateParticles();
      drawParticles(ctx);
      setTimeout(triggerGameOver, 450);
    }
  );

  updateParticles();
  renderFrame(ctx, W, H, SHOOTER_X, SHOOTER_Y, state.colorIdx, state.flashFrames);

  if (state.running) requestAnimationFrame(loop);
}

// ── Init ──

document.getElementById('sbstart').addEventListener('click', startGame);
window.addEventListener('resize', () => {
  resize();
  if (!state.running) renderFrame(ctx, W, H, SHOOTER_X, SHOOTER_Y, state.colorIdx, 0);
});

// Tunggu layout selesai baru resize supaya W/H akurat
requestAnimationFrame(() => {
  resize();
  buildColorDots();
});
