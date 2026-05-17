/**
 * sandbox.js — Interactive Math Visualization Engine
 * 
 * Provides plug-and-play sandboxes for different math topics.
 * Usage: MathSandbox.create(containerId, type, options)
 * 
 * Types: 'linear', 'unitcircle', 'derivative'
 */

const MathSandbox = (function () {

  // ── Shared canvas drawing utilities ──
  function createCanvas(container, w, h) {
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    canvas.style.width = '100%';
    canvas.style.borderRadius = '8px';
    container.appendChild(canvas);
    return { canvas, ctx: canvas.getContext('2d') };
  }

  function getThemeColor(name) {
    const style = getComputedStyle(document.documentElement);
    const map = {
      bg: style.getPropertyValue('--color-surface').trim() || '#1a1a2e',
      text: style.getPropertyValue('--color-text-primary').trim() || '#f1f5f9',
      grid: style.getPropertyValue('--color-border').trim() || '#334155',
      primary: '#3b82f6',
      accent: '#8b5cf6',
      success: '#22c55e',
      warning: '#f59e0b',
    };
    return map[name] || '#888';
  }

  // ── Map math coords to canvas pixels ──
  function toPixel(x, y, origin, scale) {
    return {
      px: origin.x + x * scale,
      py: origin.y - y * scale
    };
  }

  // ── Draw a clean axis grid ──
  function drawAxes(ctx, origin, scale, w, h, steps = 10) {
    ctx.strokeStyle = getThemeColor('grid');
    ctx.lineWidth = 0.5;
    ctx.fillStyle = getThemeColor('text');
    ctx.font = '10px Inter, sans-serif';
    ctx.textAlign = 'center';

    // Grid lines & tick labels
    for (let i = -steps; i <= steps; i++) {
      const px = origin.x + i * scale;
      const py = origin.y - i * scale;

      // Vertical grid lines
      ctx.beginPath();
      ctx.moveTo(px, 0);
      ctx.lineTo(px, h);
      ctx.stroke();

      // Horizontal grid lines
      ctx.beginPath();
      ctx.moveTo(0, py);
      ctx.lineTo(w, py);
      ctx.stroke();

      // Labels
      if (i !== 0) {
        ctx.fillText(i, px, origin.y + 14);
        ctx.textAlign = 'right';
        ctx.fillText(i, origin.x - 4, py + 4);
        ctx.textAlign = 'center';
      }
    }

    // Main axes (bolder)
    ctx.strokeStyle = getThemeColor('text');
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, origin.y); ctx.lineTo(w, origin.y); // X axis
    ctx.moveTo(origin.x, 0); ctx.lineTo(origin.x, h); // Y axis
    ctx.stroke();

    // Arrow tips
    ctx.fillStyle = getThemeColor('text');
    ctx.beginPath();
    ctx.moveTo(w, origin.y);
    ctx.lineTo(w - 8, origin.y - 4);
    ctx.lineTo(w - 8, origin.y + 4);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(origin.x, 0);
    ctx.lineTo(origin.x - 4, 8);
    ctx.lineTo(origin.x + 4, 8);
    ctx.fill();

    // Axis labels
    ctx.font = 'bold 13px Inter, sans-serif';
    ctx.fillText('x', w - 10, origin.y - 10);
    ctx.fillText('y', origin.x + 12, 12);
  }

  // ══════════════════════════════════════════════
  //  SANDBOX TYPE: Linear  y = mx + b
  // ══════════════════════════════════════════════
  function buildLinear(container) {
    container.innerHTML = `
      <div class="sandbox-inner">
        <div class="sandbox-controls">
          <div class="sandbox-control-group">
            <label class="sandbox-label">Slope (m) = <span id="sb-m-val">1</span></label>
            <input type="range" id="sb-m" class="sandbox-slider" min="-5" max="5" step="0.1" value="1">
          </div>
          <div class="sandbox-control-group">
            <label class="sandbox-label">Intercept (b) = <span id="sb-b-val">0</span></label>
            <input type="range" id="sb-b" class="sandbox-slider" min="-8" max="8" step="0.5" value="0">
          </div>
          <div class="sandbox-equation" id="sb-equation">y = 1x + 0</div>
        </div>
        <div id="sb-canvas-wrap"></div>
      </div>`;

    const W = 420, H = 380;
    const origin = { x: W / 2, y: H / 2 };
    const scale = 30;

    const { canvas, ctx } = createCanvas(container.querySelector('#sb-canvas-wrap'), W, H);

    function draw(m, b) {
      ctx.clearRect(0, 0, W, H);
      // Background
      ctx.fillStyle = getThemeColor('bg');
      ctx.fillRect(0, 0, W, H);
      drawAxes(ctx, origin, scale, W, H, 7);

      // Draw line y = mx + b
      ctx.strokeStyle = getThemeColor('primary');
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      const x1 = -15, x2 = 15;
      const p1 = toPixel(x1, m * x1 + b, origin, scale);
      const p2 = toPixel(x2, m * x2 + b, origin, scale);
      ctx.moveTo(p1.px, p1.py);
      ctx.lineTo(p2.px, p2.py);
      ctx.stroke();

      // Draw y-intercept dot
      const yInt = toPixel(0, b, origin, scale);
      ctx.beginPath();
      ctx.arc(yInt.px, yInt.py, 6, 0, Math.PI * 2);
      ctx.fillStyle = getThemeColor('accent');
      ctx.fill();
    }

    function update() {
      const m = parseFloat(document.getElementById('sb-m').value);
      const b = parseFloat(document.getElementById('sb-b').value);
      document.getElementById('sb-m-val').textContent = m;
      document.getElementById('sb-b-val').textContent = b;
      const sign = b >= 0 ? '+' : '-';
      document.getElementById('sb-equation').textContent = `y = ${m}x ${sign} ${Math.abs(b)}`;
      draw(m, b);
    }

    document.getElementById('sb-m').addEventListener('input', update);
    document.getElementById('sb-b').addEventListener('input', update);
    update();
  }

  // ══════════════════════════════════════════════
  //  SANDBOX TYPE: Unit Circle (Trigonometry)
  // ══════════════════════════════════════════════
  function buildUnitCircle(container) {
    container.innerHTML = `
      <div class="sandbox-inner">
        <div class="sandbox-controls">
          <div class="sandbox-control-group">
            <label class="sandbox-label">Angle (θ) = <span id="uc-angle-val">0°</span></label>
            <input type="range" id="uc-angle" class="sandbox-slider" min="0" max="360" step="1" value="0">
          </div>
          <div class="sandbox-readout">
            <div class="sandbox-readout-item" style="color: var(--color-primary)">sin(θ) = <span id="uc-sin">0.00</span></div>
            <div class="sandbox-readout-item" style="color: var(--color-accent)">cos(θ) = <span id="uc-cos">1.00</span></div>
            <div class="sandbox-readout-item">tan(θ) = <span id="uc-tan">0.00</span></div>
          </div>
        </div>
        <div id="uc-canvas-wrap"></div>
      </div>`;

    const W = 420, H = 380;
    const cx = W / 2, cy = H / 2;
    const R = 140; // unit circle radius in px

    const { canvas, ctx } = createCanvas(container.querySelector('#uc-canvas-wrap'), W, H);

    function draw(deg) {
      const rad = (deg * Math.PI) / 180;
      const cosA = Math.cos(rad);
      const sinA = Math.sin(rad);
      const px = cx + R * cosA;
      const py = cy - R * sinA;

      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = getThemeColor('bg');
      ctx.fillRect(0, 0, W, H);

      // Axes
      ctx.strokeStyle = getThemeColor('grid');
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(0, cy); ctx.lineTo(W, cy); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx, 0); ctx.lineTo(cx, H); ctx.stroke();

      // Unit circle
      ctx.strokeStyle = getThemeColor('grid');
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.stroke();

      // Arc for angle
      ctx.strokeStyle = getThemeColor('warning');
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(cx, cy, 30, 0, -rad, rad < 0);
      ctx.stroke();

      // Radius line
      ctx.strokeStyle = getThemeColor('text');
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(cx, cy); ctx.lineTo(px, py);
      ctx.stroke();

      // cos line (horizontal - blue)
      ctx.strokeStyle = getThemeColor('accent');
      ctx.lineWidth = 2.5;
      ctx.setLineDash([4, 3]);
      ctx.beginPath();
      ctx.moveTo(cx, py); ctx.lineTo(px, py);
      ctx.stroke();
      ctx.setLineDash([]);

      // sin line (vertical - primary)
      ctx.strokeStyle = getThemeColor('primary');
      ctx.lineWidth = 2.5;
      ctx.setLineDash([4, 3]);
      ctx.beginPath();
      ctx.moveTo(px, cy); ctx.lineTo(px, py);
      ctx.stroke();
      ctx.setLineDash([]);

      // Point on circle
      ctx.beginPath();
      ctx.arc(px, py, 7, 0, Math.PI * 2);
      ctx.fillStyle = getThemeColor('success');
      ctx.fill();

      // Labels
      ctx.font = 'bold 12px Inter, sans-serif';
      ctx.fillStyle = getThemeColor('text');
      ctx.fillText(`(${cosA.toFixed(2)}, ${sinA.toFixed(2)})`, px + 10, py - 10);
    }

    function update() {
      const deg = parseFloat(document.getElementById('uc-angle').value);
      const rad = (deg * Math.PI) / 180;
      document.getElementById('uc-angle-val').textContent = deg + '°';
      document.getElementById('uc-sin').textContent = Math.sin(rad).toFixed(3);
      document.getElementById('uc-cos').textContent = Math.cos(rad).toFixed(3);
      const tan = Math.tan(rad);
      document.getElementById('uc-tan').textContent = Math.abs(tan) > 1000 ? '∞' : tan.toFixed(3);
      draw(deg);
    }

    document.getElementById('uc-angle').addEventListener('input', update);
    update();
  }

  // ══════════════════════════════════════════════
  //  SANDBOX TYPE: Derivative (Tangent Line)
  // ══════════════════════════════════════════════
  function buildDerivative(container) {
    container.innerHTML = `
      <div class="sandbox-inner">
        <div class="sandbox-controls">
          <div class="sandbox-control-group">
            <label class="sandbox-label">Point x = <span id="dv-x-val">1</span></label>
            <input type="range" id="dv-x" class="sandbox-slider" min="-3.5" max="3.5" step="0.1" value="1">
          </div>
          <div class="sandbox-readout">
            <div class="sandbox-readout-item">f(x) = x³ − 3x</div>
            <div class="sandbox-readout-item" style="color: var(--color-primary)">f'(x) = 3x² − 3</div>
            <div class="sandbox-readout-item">Slope at x = <span id="dv-slope">0.00</span></div>
          </div>
          <p style="font-size:0.8rem;color:var(--color-text-secondary);margin-top:0.5rem;">Drag the slider to move the tangent line along the curve.</p>
        </div>
        <div id="dv-canvas-wrap"></div>
      </div>`;

    const W = 420, H = 380;
    const origin = { x: W / 2, y: H / 2 };
    const scale = 50;

    const { canvas, ctx } = createCanvas(container.querySelector('#dv-canvas-wrap'), W, H);

    function f(x) { return x * x * x - 3 * x; }
    function df(x) { return 3 * x * x - 3; }

    function draw(xVal) {
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = getThemeColor('bg');
      ctx.fillRect(0, 0, W, H);
      drawAxes(ctx, origin, scale, W, H, 5);

      // Draw cubic curve f(x) = x³ - 3x
      ctx.strokeStyle = getThemeColor('accent');
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      let first = true;
      for (let x = -6; x <= 6; x += 0.02) {
        const p = toPixel(x, f(x), origin, scale);
        if (first) { ctx.moveTo(p.px, p.py); first = false; }
        else ctx.lineTo(p.px, p.py);
      }
      ctx.stroke();

      // Draw tangent line at xVal
      const m = df(xVal);
      const b = f(xVal) - m * xVal;
      ctx.strokeStyle = getThemeColor('primary');
      ctx.lineWidth = 2;
      const tx1 = xVal - 2.5, tx2 = xVal + 2.5;
      const tp1 = toPixel(tx1, m * tx1 + b, origin, scale);
      const tp2 = toPixel(tx2, m * tx2 + b, origin, scale);
      ctx.beginPath();
      ctx.moveTo(tp1.px, tp1.py);
      ctx.lineTo(tp2.px, tp2.py);
      ctx.stroke();

      // Point on curve
      const pointPx = toPixel(xVal, f(xVal), origin, scale);
      ctx.beginPath();
      ctx.arc(pointPx.px, pointPx.py, 7, 0, Math.PI * 2);
      ctx.fillStyle = getThemeColor('success');
      ctx.fill();
    }

    function update() {
      const xVal = parseFloat(document.getElementById('dv-x').value);
      document.getElementById('dv-x-val').textContent = xVal.toFixed(1);
      document.getElementById('dv-slope').textContent = df(xVal).toFixed(3);
      draw(xVal);
    }

    document.getElementById('dv-x').addEventListener('input', update);
    update();
  }

  // ── Public API ──
  return {
    create(containerId, type) {
      const container = document.getElementById(containerId);
      if (!container) return;
      container.classList.add('sandbox-container');
      if (type === 'linear') buildLinear(container);
      else if (type === 'unitcircle') buildUnitCircle(container);
      else if (type === 'derivative') buildDerivative(container);
    }
  };
})();
