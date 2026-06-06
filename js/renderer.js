// renderer.js — semua drawing ke canvas

function drawBackground(ctx, W, H) {
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = '#07070e';
  ctx.fillRect(0, 0, W, H);

  // grid lines vertikal subtle
  ctx.strokeStyle = 'rgba(255,255,255,0.025)';
  ctx.lineWidth = 1;
  const cols = 6;
  for (let i = 1; i < cols; i++) {
    const x = (W / cols) * i;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, H);
    ctx.stroke();
  }
}

function drawLane(ctx, W, H) {
  // garis putus2 vertikal tengah
  ctx.strokeStyle = 'rgba(255,255,255,0.05)';
  ctx.lineWidth = 1;
  ctx.setLineDash([6, 14]);
  ctx.beginPath();
  ctx.moveTo(W / 2, 0);
  ctx.lineTo(W / 2, H);
  ctx.stroke();
  ctx.setLineDash([]);
}

function drawShooter(ctx, cx, cy, colorIdx, flashFrames) {
  const c = COLORS[colorIdx];
  const W2 = 26, H2 = 20, R = 8;
  const flash = flashFrames > 0;

  // barrel (pointing up)
  ctx.fillStyle = flash ? '#fff' : c.hex;
  ctx.fillRect(cx - 5, cy - H2 - 14, 10, 16);

  // body
  ctx.fillStyle = flash ? '#fff' : c.hex;
  ctx.beginPath();
  ctx.roundRect(cx - W2, cy - H2, W2 * 2, H2 * 2, R);
  ctx.fill();

  // label
  ctx.fillStyle = flash ? c.hex : '#fff';
  ctx.font = '700 10px "Space Mono", monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(c.name.slice(0, 3), cx, cy + 1);
}

function renderFrame(ctx, W, H, SHOOTER_X, SHOOTER_Y, colorIdx, flashFrames) {
  drawBackground(ctx, W, H);
  drawLane(ctx, W, H);
  drawEnemies(ctx);
  drawBullets(ctx);
  drawShooter(ctx, SHOOTER_X, SHOOTER_Y, colorIdx, flashFrames);
  drawParticles(ctx);
}
