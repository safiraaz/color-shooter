// particles.js — sistem partikel efek ledakan

const particles = [];

function spawnParticles(x, y, colorHex, count = 14, big = true) {
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 1.5 + Math.random() * (big ? 4.5 : 2.5);
    particles.push({
      x, y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      col: colorHex,
      life: big ? 40 : 22,
      max: big ? 40 : 22,
      r: big ? 3 + Math.random() * 4 : 2 + Math.random() * 2,
    });
  }
}

function updateParticles() {
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.vx *= 0.91;
    p.vy *= 0.91;
    p.life--;
    if (p.life <= 0) particles.splice(i, 1);
  }
}

function drawParticles(ctx) {
  for (const p of particles) {
    ctx.globalAlpha = p.life / p.max;
    ctx.fillStyle = p.col;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

function clearParticles() {
  particles.length = 0;
}
