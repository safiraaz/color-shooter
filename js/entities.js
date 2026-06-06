// entities.js — musuh dan peluru

const enemies = [];
const bullets = [];

// ── Enemies ──

function spawnEnemy(W, baseSpeed, level) {
  const ci = Math.floor(Math.random() * COLORS.length);
  const x = W / 2; // satu jalur di tengah
  const speed = baseSpeed + (level - 1) * 0.28;
  enemies.push({ x, y: -24, ci, speed });
}

function updateEnemies(H, SHOOTER_Y, onReach) {
  for (let i = enemies.length - 1; i >= 0; i--) {
    const e = enemies[i];
    e.y += e.speed;
    if (e.y > SHOOTER_Y - 20) {
      onReach(e);
      enemies.splice(i, 1);
    }
  }
}

function drawEnemies(ctx) {
  const ER = 20;
  for (const e of enemies) {
    const c = COLORS[e.ci];
    // glow
    ctx.fillStyle = c.hex + '28';
    ctx.beginPath();
    ctx.arc(e.x, e.y, ER + 5, 0, Math.PI * 2);
    ctx.fill();
    // body
    ctx.fillStyle = c.hex;
    ctx.beginPath();
    ctx.arc(e.x, e.y, ER, 0, Math.PI * 2);
    ctx.fill();
    // arrow down inside
    drawArrowShape(ctx, e.x, e.y, ER * 0.55, 'rgba(0,0,0,0.45)', 1);
    // label
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 8px "Space Mono", monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(c.name.slice(0, 3), e.x, e.y + 1);
  }
}

// ── Bullets ──

function spawnBullet(x, y, ci) {
  bullets.push({ x, y, ci, vy: -13 });
}

function updateBullets() {
  for (let i = bullets.length - 1; i >= 0; i--) {
    bullets[i].y += bullets[i].vy;
    if (bullets[i].y < -20) bullets.splice(i, 1);
  }
}

function drawBullets(ctx) {
  for (const b of bullets) {
    const c = COLORS[b.ci];
    ctx.shadowColor = c.hex;
    ctx.shadowBlur = 10;
    drawArrowShape(ctx, b.x, b.y, 11, c.hex, -1);
    ctx.shadowBlur = 0;
  }
}

// ── Collision ──

function checkCollisions(onHit, onMiss) {
  const ER = 20, BR = 9;
  for (let bi = bullets.length - 1; bi >= 0; bi--) {
    const b = bullets[bi];
    for (let ei = enemies.length - 1; ei >= 0; ei--) {
      const e = enemies[ei];
      const dx = b.x - e.x, dy = b.y - e.y;
      if (Math.sqrt(dx * dx + dy * dy) < BR + ER) {
        if (b.ci === e.ci) {
          onHit(e);
        } else {
          onMiss(b, e);
        }
        bullets.splice(bi, 1);
        enemies.splice(ei, 1);
        break;
      }
    }
  }
}

function clearEntities() {
  enemies.length = 0;
  bullets.length = 0;
}

// ── Helper ──

function drawArrowShape(ctx, x, y, size, color, dir) {
  // dir: -1 = pointing up (bullet), 1 = pointing down (enemy)
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(x, y + dir * size);
  ctx.lineTo(x + size * 0.6, y - dir * size * 0.4);
  ctx.lineTo(x, y - dir * size * 0.1);
  ctx.lineTo(x - size * 0.6, y - dir * size * 0.4);
  ctx.closePath();
  ctx.fill();
}
