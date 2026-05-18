/**
 * I Love Maths — Cognitive Game Zone Engine
 * Scientifically aligned, fully-featured cognitive feedback and gaming loops.
 */

(function () {
  // ── Global GZ State & Local Storage ──
  const STORAGE_KEY = 'ilovemaths_gamezone';
  let gzState = {
    xp: 0,
    level: 1,
    streak: 0,
    lastPlayed: '',
    highScores: {
      'speed-math': 0,
      'pattern-matrix': 0,
      'sequence-recall': 0,
      'focus-filter': 0
    },
    history: [] // [{ date: 'YYYY-MM-DD', game: 'id', score: 100, accuracy: 95 }]
  };

  // Load state from local storage
  function loadGZState() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        gzState = { ...gzState, ...parsed };
      }
    } catch (e) {
      console.warn("Could not load Game Zone state", e);
    }
  }

  // Save state to local storage
  function saveGZState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(gzState));
    } catch (e) {
      console.warn("Could not save Game Zone state", e);
    }
  }

  // ── Theme configuration mapping ──
  function getThemeColors() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    if (isDark) {
      return {
        bg: '#1a1d23',
        grid: '#2d3140',
        line: '#3b82f6',
        glow: 'rgba(59, 130, 246, 0.2)',
        text: '#9ba1b5',
        accent: '#8b5cf6'
      };
    } else {
      return {
        bg: '#ffffff',
        grid: '#e8eaef',
        line: '#2563eb',
        glow: 'rgba(37, 99, 235, 0.1)',
        text: '#5a6072',
        accent: '#8b5cf6'
      };
    }
  }

  // ── Render Dynamic Cognitive Chart ──
  function drawChart() {
    const canvas = document.getElementById('gz-chart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const colors = getThemeColors();
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.parentNode.getBoundingClientRect();
    const W = rect.width || 480;
    const H = rect.height || 180;

    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';
    ctx.scale(dpr, dpr);

    ctx.clearRect(0, 0, W, H);

    // Get last 7 days of dates
    const dates = [];
    const scores = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const iso = d.toISOString().split('T')[0];
      dates.push(iso);

      // Sum scores for this day
      const daySessions = gzState.history.filter(h => h.date === iso);
      const dayTotal = daySessions.reduce((sum, s) => sum + s.score, 0);
      scores.push(dayTotal);
    }

    const pL = 36, pR = 12, pT = 16, pB = 22, pW = W - pL - pR, pH = H - pT - pB;
    const maxScore = Math.max(100, ...scores) * 1.15;

    // Draw grid lines
    ctx.strokeStyle = colors.grid;
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= 3; i++) {
      const y = pT + (pH * i) / 3;
      ctx.beginPath();
      ctx.moveTo(pL, y);
      ctx.lineTo(pL + pW, y);
      ctx.stroke();

      // Axis label
      ctx.fillStyle = colors.text;
      ctx.font = '9px JetBrains Mono, monospace';
      ctx.textAlign = 'right';
      const val = maxScore - (maxScore * i) / 3;
      ctx.fillText(Math.round(val), pL - 6, y + 3);
    }

    // Draw day labels
    dates.forEach((d, i) => {
      const x = pL + (pW * i) / 6;
      ctx.fillStyle = colors.text;
      ctx.font = '9px Inter, sans-serif';
      ctx.textAlign = 'center';
      const label = d.substring(5); // MM-DD
      ctx.fillText(label, x, pT + pH + 14);
    });

    // Draw progression line
    ctx.beginPath();
    scores.forEach((s, i) => {
      const x = pL + (pW * i) / 6;
      const y = pT + pH - (s / maxScore) * pH;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.strokeStyle = colors.line;
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Fill area below line
    ctx.lineTo(pL + pW, pT + pH);
    ctx.lineTo(pL, pT + pH);
    ctx.closePath();
    const grad = ctx.createLinearGradient(0, pT, 0, pT + pH);
    grad.addColorStop(0, colors.glow);
    grad.addColorStop(1, 'transparent');
    ctx.fillStyle = grad;
    ctx.fill();

    // Draw nodes
    scores.forEach((s, i) => {
      const x = pL + (pW * i) / 6;
      const y = pT + pH - (s / maxScore) * pH;
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fillStyle = colors.line;
      ctx.fill();
      ctx.beginPath();
      ctx.arc(x, y, 2, 0, Math.PI * 2);
      ctx.fillStyle = colors.bg;
      ctx.fill();
    });
  }

  // ── Particle Explosion Canvas Engine ──
  let particles = [];
  let particleAnimationId = null;

  function initParticles() {
    const canvas = document.getElementById('gz-particle-canvas');
    if (!canvas) return;
    const rect = canvas.parentNode.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
  }

  function spawnExplosion(x, y, isSuccess = true) {
    const canvas = document.getElementById('gz-particle-canvas');
    if (!canvas) return;
    const count = isSuccess ? 18 : 8;
    const colors = isSuccess 
      ? ['#10b981', '#34d399', '#3b82f6', '#60a5fa', '#f59e0b'] 
      : ['#ef4444', '#f87171', '#b91c1c'];

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 4 + 2;
      particles.push({
        x: x || canvas.width / 2,
        y: y || canvas.height / 2,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - (isSuccess ? 1.5 : 0.5),
        radius: Math.random() * 4 + 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 1,
        decay: Math.random() * 0.03 + 0.015
      });
    }

    if (!particleAnimationId) {
      animateParticles();
    }
  }

  function animateParticles() {
    const canvas = document.getElementById('gz-particle-canvas');
    if (!canvas) {
      particleAnimationId = null;
      return;
    }
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      particleAnimationId = null;
      return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.06; // gravity
      p.alpha -= p.decay;

      if (p.alpha <= 0) {
        particles.splice(i, 1);
        continue;
      }

      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.shadowBlur = 8;
      ctx.shadowColor = p.color;
      ctx.fill();
      ctx.restore();
    }

    if (particles.length > 0) {
      particleAnimationId = requestAnimationFrame(animateParticles);
    } else {
      particleAnimationId = null;
    }
  }

  // ── Sync UI elements ──
  function syncDashboardUI() {
    loadGZState();

    // Stats Profile level
    const lvlEl = document.getElementById('gz-profile-level');
    const xpEl = document.getElementById('gz-profile-xp');
    const streakEl = document.getElementById('gz-profile-streak');

    if (lvlEl) lvlEl.textContent = gzState.level;
    if (xpEl) xpEl.textContent = `${gzState.xp} XP`;
    if (streakEl) streakEl.textContent = `${gzState.streak} Day Streak 🔥`;

    // Dynamic XP progress fill ring
    const fillEl = document.getElementById('gz-level-fill');
    if (fillEl) {
      // Linear formula: level threshold = (level - 1) * 150
      const currentLevelBase = (gzState.level - 1) * 150;
      const nextLevelThreshold = gzState.level * 150;
      const progressInLevel = gzState.xp - currentLevelBase;
      const pct = Math.min(100, Math.max(0, (progressInLevel / 150) * 100));

      const circumference = 2 * Math.PI * 58; // r=58
      const offset = circumference - (pct / 100) * circumference;
      fillEl.style.strokeDashoffset = offset;
    }

    // High Scores
    Object.entries(gzState.highScores).forEach(([gameId, score]) => {
      const el = document.getElementById(`hs-${gameId}`);
      if (el) el.textContent = score;
    });

    // Mastery Gauges & Insights
    const mathHs = gzState.highScores['speed-math'] || 0;
    const logicHs = gzState.highScores['pattern-matrix'] || 0;
    const memHs = gzState.highScores['sequence-recall'] || 0;
    const focHs = gzState.highScores['focus-filter'] || 0;

    const mathPct = Math.min(100, Math.round((mathHs / 800) * 100));
    const logicPct = Math.min(100, Math.round((logicHs / 600) * 100));
    const memPct = Math.min(100, Math.round((memHs / 700) * 100));
    const focPct = Math.min(100, Math.round((focHs / 800) * 100));

    const fillNum = document.getElementById('gz-mastery-num-fill');
    const fillLog = document.getElementById('gz-mastery-log-fill');
    const fillMem = document.getElementById('gz-mastery-mem-fill');
    const fillFoc = document.getElementById('gz-mastery-foc-fill');

    if (fillNum) { fillNum.style.width = mathPct + '%'; document.getElementById('gz-mastery-num-pct').textContent = mathPct + '%'; }
    if (fillLog) { fillLog.style.width = logicPct + '%'; document.getElementById('gz-mastery-log-pct').textContent = logicPct + '%'; }
    if (fillMem) { fillMem.style.width = memPct + '%'; document.getElementById('gz-mastery-mem-pct').textContent = memPct + '%'; }
    if (fillFoc) { fillFoc.style.width = focPct + '%'; document.getElementById('gz-mastery-foc-pct').textContent = focPct + '%'; }

    // Analytics Insight Box Text
    const insightEl = document.getElementById('gz-insights-text');
    if (insightEl) {
      if (gzState.history.length === 0) {
        insightEl.textContent = "Play games in any cognitive domain to begin recording and charting your performance trends.";
      } else {
        const lastSession = gzState.history[gzState.history.length - 1];
        insightEl.innerHTML = `<strong>Insight:</strong> Your last session in <em>${lastSession.game.replace('-', ' ')}</em> gained <strong>+${Math.round(lastSession.score / 5)} XP</strong>. Keep training daily to prevent cognitive skill decay!`;
      }
    }

    // Chart redraw
    drawChart();
  }

  // ── Streak Engine ──
  function checkAndUpdateStreak() {
    const today = new Date().toISOString().split('T')[0];
    if (gzState.lastPlayed === today) return; // already played today

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    if (gzState.lastPlayed === yesterdayStr) {
      // played yesterday, streak continues!
      gzState.streak++;
    } else if (gzState.lastPlayed === '') {
      // first time
      gzState.streak = 1;
    } else {
      // broken streak
      gzState.streak = 1;
    }
    gzState.lastPlayed = today;
    saveGZState();
  }

  // Add XP and handle levels
  function addXP(amount) {
    gzState.xp += amount;
    // XP boundary level formula: (level) * 150 = XP needed to unlock next level
    let tempLvl = 1;
    while (gzState.xp >= tempLvl * 150) {
      tempLvl++;
    }
    if (tempLvl > gzState.level) {
      gzState.level = tempLvl;
      // level up sound/visuals could go here!
    }
    saveGZState();
  }

  // ── Unified Game Launcher & Modes ──
  let activeGameId = '';
  let activeMode = 'practice'; // practice, timed, challenge
  let gameScore = 0;
  let gameCombo = 1;
  let gameConsecutiveCorrect = 0;
  let gameTotalQuestions = 0;
  let gameCorrectAnswers = 0;
  let gameStartMs = 0;
  let responseTimes = [];
  let gameTimerId = null;
  let gameTimeRemaining = 30.0;
  const gameTimeMax = 30.0;

  const gameInfo = {
    'speed-math': {
      title: 'Speed Arithmetic',
      category: 'Numerical',
      desc: 'Rapid-fire equations covering addition, division remainders, exponential multiplication, and algebraic signs. Type the answer quickly using your numpad or keyboard.',
      outcome: 'Mental calculation speed, visual digit matching'
    },
    'pattern-matrix': {
      title: 'Pattern Matrix',
      category: 'Logical',
      desc: 'Determine structural relationships in shape matrices. Spot the logic linking colors, rotative offsets, and symbol sizing, then choose the missing cell.',
      outcome: 'Pattern deduction, visual-spatial reasoning'
    },
    'sequence-recall': {
      title: 'Matrix Recall',
      category: 'Memory',
      desc: 'A spatial pattern flashes across a glassmorphic grid. Tap the exact squares in sequence. Sequence grows with every success, testing active working memory capacity.',
      outcome: 'Working memory retention, spatial chunking'
    },
    'focus-filter': {
      title: 'Focus Filter',
      category: 'Attention',
      desc: 'Rapid selective attention training. A color-word displays (e.g. word "BLUE" styled red). Identify if the NAME of the color matches the color of the text rapidly. Suppress reading impulses.',
      outcome: 'Impulse control, Selective attention, Stroop resistance'
    }
  };

  window.openGame = function (gameId) {
    activeGameId = gameId;
    activeMode = 'practice';

    const info = gameInfo[gameId];
    if (!info) return;

    // Set Launchpad details
    document.getElementById('info-game-cat').textContent = info.category;
    document.getElementById('info-game-title').textContent = info.title;
    document.getElementById('info-game-desc').innerHTML = `${info.desc}<br><br><strong>Cognitive Focus:</strong> ${info.outcome}.`;

    // Reset buttons
    document.querySelectorAll('.gz-mode-select-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById('mode-practice').classList.add('active');

    // Show Launchpad overlay
    document.getElementById('gz-overlay').style.display = 'flex';
    document.getElementById('screen-info').classList.add('active');
    document.getElementById('screen-play').classList.remove('active');
    document.getElementById('screen-summary').classList.remove('active');
  };

  window.closeGameOverlay = function () {
    // Terminate loops
    clearInterval(gameTimerId);
    gameTimerId = null;

    document.getElementById('gz-overlay').style.display = 'none';
    syncDashboardUI();
  };

  window.setMode = function (mode) {
    activeMode = mode;
    document.querySelectorAll('.gz-mode-select-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(`mode-${mode}`).classList.add('active');
  };

  window.startGame = function () {
    document.getElementById('screen-info').classList.remove('active');
    document.getElementById('screen-play').classList.add('active');

    // Reset gameplay trackers
    gameScore = 0;
    gameCombo = 1;
    gameConsecutiveCorrect = 0;
    gameTotalQuestions = 0;
    gameCorrectAnswers = 0;
    responseTimes = [];
    gameTimeRemaining = gameTimeMax;

    // Reset HUD
    document.getElementById('hud-mode-text').textContent = activeMode.toUpperCase();
    document.getElementById('hud-combo').textContent = 'x1 🔥';
    document.getElementById('hud-score').textContent = '0000';

    const track = document.getElementById('timer-track');
    const fill = document.getElementById('timer-fill');

    if (activeMode === 'timed') {
      track.style.visibility = 'visible';
      fill.style.width = '100%';
      fill.className = 'gz-timer-bar';
      startTimer();
    } else {
      track.style.visibility = 'hidden';
    }

    // Load active game engine
    initParticles();
    loadActiveGameContent();
  };

  window.restartActiveGame = function () {
    document.getElementById('screen-summary').classList.remove('active');
    window.startGame();
  };

  // Timer loop
  function startTimer() {
    clearInterval(gameTimerId);
    gameStartMs = Date.now();
    
    gameTimerId = setInterval(() => {
      gameTimeRemaining -= 0.1;
      const fill = document.getElementById('timer-fill');
      if (fill) {
        const pct = Math.min(100, Math.max(0, (gameTimeRemaining / gameTimeMax) * 100));
        fill.style.width = pct + '%';

        if (pct < 30) {
          fill.className = 'gz-timer-bar danger';
        } else if (pct < 60) {
          fill.className = 'gz-timer-bar warning';
        } else {
          fill.className = 'gz-timer-bar';
        }
      }

      if (gameTimeRemaining <= 0) {
        clearInterval(gameTimerId);
        endGame();
      }
    }, 100);
  }

  // Handle answers correct/incorrect
  function handleSessionResponse(isCorrect, reactionTimeMs) {
    gameTotalQuestions++;
    if (reactionTimeMs) responseTimes.push(reactionTimeMs);

    const playBoard = document.getElementById('play-board');
    const rect = playBoard.getBoundingClientRect();
    
    if (isCorrect) {
      gameCorrectAnswers++;
      gameConsecutiveCorrect++;
      
      // Calculate XP/Combos
      if (gameConsecutiveCorrect >= 6) gameCombo = 3;
      else if (gameConsecutiveCorrect >= 3) gameCombo = 2;
      else gameCombo = 1;

      // Add points
      const points = 10 * gameCombo;
      gameScore += points;

      // Time boost in Timed mode
      if (activeMode === 'timed') {
        gameTimeRemaining = Math.min(gameTimeMax, gameTimeRemaining + 1.5);
      }

      // HUD update
      document.getElementById('hud-score').textContent = String(gameScore).padStart(4, '0');
      document.getElementById('hud-combo').textContent = `x${gameCombo} 🔥`;

      // Success explosion
      spawnExplosion(null, null, true);
    } else {
      gameConsecutiveCorrect = 0;
      gameCombo = 1;

      document.getElementById('hud-combo').textContent = 'x1 🔥';

      // Time penalty in Timed mode
      if (activeMode === 'timed') {
        gameTimeRemaining = Math.max(0, gameTimeRemaining - 3.0);
      }

      // Red flash visual warning
      spawnExplosion(null, null, false);
      
      // If challenge mode, one strike = dead!
      if (activeMode === 'challenge') {
        clearInterval(gameTimerId);
        setTimeout(endGame, 400);
        return;
      }
    }

    // Load next step
    setTimeout(loadActiveGameContent, 150);
  }

  function endGame() {
    clearInterval(gameTimerId);
    document.getElementById('screen-play').classList.remove('active');
    document.getElementById('screen-summary').classList.add('active');

    // Calculate Analytics
    const accuracy = gameTotalQuestions > 0 ? Math.round((gameCorrectAnswers / gameTotalQuestions) * 100) : 0;
    const avgResponse = responseTimes.length > 0 ? Math.round(responseTimes.reduce((s, x) => s + x, 0) / responseTimes.length) : 0;
    
    // Earn XP based on score
    const xpGained = Math.round(gameScore / 5);
    addXP(xpGained);
    checkAndUpdateStreak();

    // Check High score
    let isNewHigh = false;
    if (gameScore > (gzState.highScores[activeGameId] || 0)) {
      gzState.highScores[activeGameId] = gameScore;
      isNewHigh = true;
    }

    // Push into history logs
    const today = new Date().toISOString().split('T')[0];
    gzState.history.push({
      date: today,
      game: activeGameId,
      score: gameScore,
      accuracy: accuracy,
      reactionTime: avgResponse
    });
    saveGZState();

    // Sync summary view
    document.getElementById('sum-score').textContent = gameScore;
    document.getElementById('sum-xp').textContent = `+${xpGained} XP`;
    document.getElementById('sum-accuracy').textContent = `${accuracy}%`;
    document.getElementById('sum-speed').textContent = `${avgResponse || '—'}ms`;

    const phraseEl = document.getElementById('summary-phrase');
    const insightEl = document.getElementById('sum-insight');

    if (isNewHigh) {
      phraseEl.innerHTML = "🎉 <strong>New High Score!</strong> Excellent cognitive growth!";
    } else {
      phraseEl.textContent = "Training Session Complete! Keep up the daily workouts.";
    }

    insightEl.innerHTML = `<strong>Session Report:</strong> Your reaction speed was <strong>${avgResponse || '—'}ms</strong> with <strong>${accuracy}%</strong> accuracy. ` +
      (accuracy >= 80 ? "Superb selective attention filtering!" : "Take your time to focus on accuracy to stabilize combos.");
  }

  // ── Dynamic Sub-Game Architectures ──
  function loadActiveGameContent() {
    const board = document.getElementById('play-board');
    if (!board) return;

    // Clean previous components but keep particle canvas
    const canvas = document.getElementById('gz-particle-canvas');
    board.innerHTML = '';
    if (canvas) board.appendChild(canvas);

    const startQuestionTime = Date.now();

    if (activeGameId === 'speed-math') {
      loadSpeedMath(board, startQuestionTime);
    } else if (activeGameId === 'pattern-matrix') {
      loadPatternMatrix(board, startQuestionTime);
    } else if (activeGameId === 'sequence-recall') {
      loadSequenceRecall(board, startQuestionTime);
    } else if (activeGameId === 'focus-filter') {
      loadFocusFilter(board, startQuestionTime);
    }
  }

  /* ──────────────────────────────────────────────────────────
     1. Speed Arithmetic Engine
     ────────────────────────────────────────────────────────── */
  function loadSpeedMath(container, startMs) {
    // Generate random equation based on player streak / current session scores
    const level = Math.min(6, Math.floor(gameScore / 100) + 1);
    let num1 = 0, num2 = 0, op = '+', ans = 0, problemStr = '';

    if (level === 1) {
      // Basic Single digits
      num1 = Math.floor(Math.random() * 8) + 2;
      num2 = Math.floor(Math.random() * 8) + 2;
      op = Math.random() > 0.5 ? '+' : '-';
      if (op === '-') {
        // ensure positive
        const max = Math.max(num1, num2);
        const min = Math.min(num1, num2);
        num1 = max; num2 = min;
      }
      ans = op === '+' ? num1 + num2 : num1 - num2;
      problemStr = `${num1} ${op} ${num2}`;
    } else if (level === 2) {
      // Addition / Subtraction with double digits
      num1 = Math.floor(Math.random() * 30) + 10;
      num2 = Math.floor(Math.random() * 20) + 5;
      op = Math.random() > 0.5 ? '+' : '-';
      if (op === '-') {
        const max = Math.max(num1, num2);
        const min = Math.min(num1, num2);
        num1 = max; num2 = min;
      }
      ans = op === '+' ? num1 + num2 : num1 - num2;
      problemStr = `${num1} ${op} ${num2}`;
    } else if (level === 3) {
      // Multiplications up to 10
      num1 = Math.floor(Math.random() * 8) + 3;
      num2 = Math.floor(Math.random() * 8) + 3;
      ans = num1 * num2;
      problemStr = `${num1} × ${num2}`;
    } else if (level === 4) {
      // Division with integer yields
      num2 = Math.floor(Math.random() * 8) + 3;
      ans = Math.floor(Math.random() * 8) + 2;
      num1 = num2 * ans;
      problemStr = `${num1} ÷ ${num2}`;
    } else if (level === 5) {
      // Exponential Squares and simple remainder algebra
      if (Math.random() > 0.5) {
        num1 = Math.floor(Math.random() * 7) + 6; // 6-12
        ans = num1 * num1;
        problemStr = `${num1}²`;
      } else {
        num1 = Math.floor(Math.random() * 40) + 10;
        num2 = Math.floor(Math.random() * 9) + 2;
        ans = num1 % num2;
        problemStr = `${num1} mod ${num2}`;
      }
    } else {
      // Advanced operations
      num1 = Math.floor(Math.random() * 8) + 2;
      num2 = Math.floor(Math.random() * 8) + 2;
      const num3 = Math.floor(Math.random() * 8) + 2;
      ans = num1 * num2 + num3;
      problemStr = `(${num1} × ${num2}) + ${num3}`;
    }

    const mathWrap = document.createElement('div');
    mathWrap.style.textAlign = 'center';
    mathWrap.innerHTML = `
      <div class="gz-math-prob">${problemStr} = ?</div>
      <div class="gz-math-input-wrapper" style="margin: 0 auto;">
        <input type="text" id="math-ans-input" class="gz-math-input" autocomplete="off" autofocus>
      </div>
    `;
    container.appendChild(mathWrap);

    const input = document.getElementById('math-ans-input');
    if (input) {
      input.focus();
      // Listen for text inputs
      input.addEventListener('input', () => {
        const val = parseInt(input.value);
        if (!isNaN(val) && val === ans) {
          handleSessionResponse(true, Date.now() - startMs);
        }
      });
      // Fallback enter key check
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          const val = parseInt(input.value);
          if (val === ans) {
            handleSessionResponse(true, Date.now() - startMs);
          } else {
            handleSessionResponse(false, Date.now() - startMs);
          }
        }
      });
    }
  }

  /* ──────────────────────────────────────────────────────────
     2. Pattern Matrix Engine (Logical Reasoning)
     ────────────────────────────────────────────────────────── */
  function loadPatternMatrix(container, startMs) {
    const level = Math.min(4, Math.floor(gameScore / 150) + 1);

    // Dynamic procedural SVG generator for options
    const shapes = ['circle', 'rect', 'star', 'triangle'];
    const colors = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b'];

    // Generate random matrices rules
    const ruleType = Math.random() > 0.5 ? 'count' : 'color'; // count progression or color shift
    const baseShape = shapes[Math.floor(Math.random() * shapes.length)];
    const baseColor = colors[Math.floor(Math.random() * colors.length)];

    let gridData = []; // array of 9 elements representing cells
    let correctAnswerIndex = 0;
    let optionSVGs = [];

    function makeSVG(shape, count, color, rot = 0) {
      let inner = '';
      const stroke = `stroke="${color}" stroke-width="2" fill="none"`;
      
      if (shape === 'circle') {
        if (count === 1) inner = `<circle cx="20" cy="20" r="10" ${stroke}/>`;
        else if (count === 2) inner = `<circle cx="13" cy="20" r="7" ${stroke}/><circle cx="27" cy="20" r="7" ${stroke}/>`;
        else inner = `<circle cx="12" cy="13" r="6" ${stroke}/><circle cx="28" cy="13" r="6" ${stroke}/><circle cx="20" cy="28" r="6" ${stroke}/>`;
      } else if (shape === 'rect') {
        if (count === 1) inner = `<rect x="10" y="10" width="20" height="20" ${stroke}/>`;
        else if (count === 2) inner = `<rect x="6" y="12" width="12" height="16" ${stroke}/><rect x="22" y="12" width="12" height="16" ${stroke}/>`;
        else inner = `<rect x="6" y="6" width="10" height="10" ${stroke}/><rect x="24" y="6" width="10" height="10" ${stroke}/><rect x="15" y="22" width="10" height="10" ${stroke}/>`;
      } else if (shape === 'star') {
        inner = `<polygon points="20,5 24,15 35,15 26,22 30,32 20,26 10,32 14,22 5,15 16,15" ${stroke}/>`;
      } else { // triangle
        if (count === 1) inner = `<polygon points="20,8 8,32 32,32" ${stroke}/>`;
        else if (count === 2) inner = `<polygon points="12,12 4,28 20,28" ${stroke}/><polygon points="28,12 20,28 36,28" ${stroke}/>`;
        else inner = `<polygon points="20,6 12,20 28,20" ${stroke}/><polygon points="10,22 2,36 18,36" ${stroke}/><polygon points="30,22 22,36 38,36" ${stroke}/>`;
      }

      return `<svg viewBox="0 0 40 40" style="transform: rotate(${rot}deg);">${inner}</svg>`;
    }

    if (ruleType === 'count') {
      // Row 1: 1, 2, 3 shapes
      // Row 2: 1, 2, 3 shapes (different shape/color)
      // Row 3: 1, 2, ? shapes
      const shapesRow = [shapes[0], shapes[1], shapes[2]];
      gridData = [
        { shape: shapesRow[0], count: 1, color: colors[0] },
        { shape: shapesRow[0], count: 2, color: colors[0] },
        { shape: shapesRow[0], count: 3, color: colors[0] },
        
        { shape: shapesRow[1], count: 1, color: colors[1] },
        { shape: shapesRow[1], count: 2, color: colors[1] },
        { shape: shapesRow[1], count: 3, color: colors[1] },
        
        { shape: shapesRow[2], count: 1, color: colors[2] },
        { shape: shapesRow[2], count: 2, color: colors[2] },
        { shape: shapesRow[2], count: 3, color: colors[2] } // Index 8 is missing
      ];
    } else {
      // Color shift
      // Row 1: C1, C2, C3
      // Row 2: C2, C3, C1
      // Row 3: C3, C1, ? (answer: C2)
      gridData = [
        { shape: baseShape, count: 1, color: colors[0] },
        { shape: baseShape, count: 1, color: colors[1] },
        { shape: baseShape, count: 1, color: colors[2] },
        
        { shape: baseShape, count: 2, color: colors[1] },
        { shape: baseShape, count: 2, color: colors[2] },
        { shape: baseShape, count: 2, color: colors[0] },
        
        { shape: baseShape, count: 3, color: colors[2] },
        { shape: baseShape, count: 3, color: colors[0] },
        { shape: baseShape, count: 3, color: colors[1] } // Index 8 is missing
      ];
    }

    const missingCell = gridData[8];
    correctAnswerIndex = Math.floor(Math.random() * 4);

    // Generate 4 randomized options
    for (let i = 0; i < 4; i++) {
      if (i === correctAnswerIndex) {
        optionSVGs.push(makeSVG(missingCell.shape, missingCell.count, missingCell.color));
      } else {
        // wrong answer with modified count or color
        const badCount = (missingCell.count % 3) + 1 + (i === 1 ? 0 : 1);
        const badColor = colors[(colors.indexOf(missingCell.color) + i + 1) % 4];
        optionSVGs.push(makeSVG(missingCell.shape, Math.min(3, badCount), badColor));
      }
    }

    // Build grid HTML
    const patternWrap = document.createElement('div');
    patternWrap.className = 'gz-pattern-container';
    
    let cellsHTML = '';
    for (let i = 0; i < 9; i++) {
      if (i === 8) {
        cellsHTML += `<div class="gz-pattern-cell missing"></div>`;
      } else {
        cellsHTML += `<div class="gz-pattern-cell">${makeSVG(gridData[i].shape, gridData[i].count, gridData[i].color)}</div>`;
      }
    }

    let optionsHTML = '';
    optionSVGs.forEach((svg, idx) => {
      optionsHTML += `<div class="gz-pattern-option" data-idx="${idx}">${svg}</div>`;
    });

    patternWrap.innerHTML = `
      <div class="gz-stroop-question">Find the shape that completes the logical sequence:</div>
      <div class="gz-pattern-grid">${cellsHTML}</div>
      <div class="gz-pattern-options-row">${optionsHTML}</div>
    `;
    container.appendChild(patternWrap);

    // Attach click triggers
    patternWrap.querySelectorAll('.gz-pattern-option').forEach(opt => {
      opt.addEventListener('click', () => {
        const idx = parseInt(opt.dataset.idx);
        if (idx === correctAnswerIndex) {
          handleSessionResponse(true, Date.now() - startMs);
        } else {
          handleSessionResponse(false, Date.now() - startMs);
        }
      });
    });
  }

  /* ──────────────────────────────────────────────────────────
     3. Spatial Grid Sequence Recall (Memory Training)
     ────────────────────────────────────────────────────────── */
  let seqTarget = [];
  let seqPlayerIndex = 0;
  let seqLength = 3; // start length

  function loadSequenceRecall(container, startMs) {
    // Spatial Grid setup
    const seqWrap = document.createElement('div');
    seqWrap.className = 'gz-pattern-container';
    
    let tilesHTML = '';
    for (let i = 1; i <= 16; i++) {
      tilesHTML += `<div class="gz-sequence-tile" id="seq-tile-${i}" data-tile="${i}"></div>`;
    }

    seqWrap.innerHTML = `
      <div class="gz-stroop-question" id="seq-inst">Watch the pattern grid carefully...</div>
      <div class="gz-sequence-grid">${tilesHTML}</div>
    `;
    container.appendChild(seqWrap);

    // If gameScore is 0 (first step of session), reset seqLength
    if (gameScore === 0 && gameTotalQuestions === 0) {
      seqLength = 3;
    }

    // Generate random pattern
    seqTarget = [];
    for (let i = 0; i < seqLength; i++) {
      const tile = Math.floor(Math.random() * 16) + 1;
      seqTarget.push(tile);
    }

    seqPlayerIndex = 0;

    // Block interaction during flash
    const tiles = seqWrap.querySelectorAll('.gz-sequence-tile');
    tiles.forEach(t => t.style.pointerEvents = 'none');

    // Flash pattern sequential loop
    setTimeout(() => {
      playSequence(0, tiles, startMs);
    }, 600);
  }

  function playSequence(idx, tiles, startMs) {
    if (idx >= seqTarget.length) {
      // Done flashing, prompt user to repeat
      const inst = document.getElementById('seq-inst');
      if (inst) inst.textContent = "Your turn! Repeat the pattern sequence:";
      tiles.forEach(t => t.style.pointerEvents = 'auto');
      
      // Attach click events
      tiles.forEach(tile => {
        tile.onclick = () => {
          const val = parseInt(tile.dataset.tile);
          
          if (val === seqTarget[seqPlayerIndex]) {
            // Flash successful tap
            tile.classList.add('flash');
            setTimeout(() => tile.classList.remove('flash'), 150);
            
            seqPlayerIndex++;

            if (seqPlayerIndex >= seqTarget.length) {
              // Sequence complete! Increase length!
              seqLength++;
              setTimeout(() => {
                handleSessionResponse(true, Date.now() - startMs);
              }, 300);
            }
          } else {
            // Wrong tile tapped! Flash error red!
            tile.classList.add('error-flash');
            setTimeout(() => tile.classList.remove('error-flash'), 250);

            // Decrease length to adapt down difficulty
            seqLength = Math.max(3, seqLength - 1);
            setTimeout(() => {
              handleSessionResponse(false, Date.now() - startMs);
            }, 400);
          }
        };
      });
      return;
    }

    // Flash single tile
    const tileNum = seqTarget[idx];
    const tileEl = document.getElementById(`seq-tile-${tileNum}`);
    if (tileEl) {
      tileEl.classList.add('flash');
      setTimeout(() => {
        tileEl.classList.remove('flash');
        setTimeout(() => {
          playSequence(idx + 1, tiles, startMs);
        }, 150);
      }, 350);
    }
  }

  /* ──────────────────────────────────────────────────────────
     4. Focus Filter Engine (Stroop Match)
     ────────────────────────────────────────────────────────── */
  function loadFocusFilter(container, startMs) {
    const colorNames = ['RED', 'BLUE', 'GREEN', 'YELLOW'];
    const colorValues = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b'];

    // Select random name and style hue
    const nameIdx = Math.floor(Math.random() * colorNames.length);
    const styleIdx = Math.floor(Math.random() * colorValues.length);

    const name = colorNames[nameIdx];
    const color = colorValues[styleIdx];

    // Determine query: 50% "Does name match text color?"
    // 50% "Select matching answer"
    const displayWord = colorNames[nameIdx];
    const displayColor = colorValues[styleIdx];
    
    // Choose whether to make it match or mismatch
    const isMatchQuery = Math.random() > 0.5;
    const isCorrectMatch = (nameIdx === styleIdx);

    const stroopWrap = document.createElement('div');
    stroopWrap.className = 'gz-stroop-wrapper';
    stroopWrap.innerHTML = `
      <div class="gz-stroop-question">Does the NAME of the color match the font color of the text?</div>
      <div class="gz-stroop-word" style="color: ${displayColor};">${displayWord}</div>
      <div class="gz-stroop-btn-row">
        <button class="gz-stroop-btn match-yes" id="btn-stroop-yes">YES</button>
        <button class="gz-stroop-btn match-no" id="btn-stroop-no">NO</button>
      </div>
    `;
    container.appendChild(stroopWrap);

    const btnYes = document.getElementById('btn-stroop-yes');
    const btnNo = document.getElementById('btn-stroop-no');

    const handleAnswer = (userSaidYes) => {
      const isCorrect = (userSaidYes === isCorrectMatch);
      handleSessionResponse(isCorrect, Date.now() - startMs);
    };

    if (btnYes) btnYes.onclick = () => handleAnswer(true);
    if (btnNo) btnNo.onclick = () => handleAnswer(false);

    // Support keyboard arrows left/right as shortcuts
    const handleKey = (e) => {
      if (e.key === 'ArrowLeft') {
        handleAnswer(true);
        window.removeEventListener('keydown', handleKey);
      } else if (e.key === 'ArrowRight') {
        handleAnswer(false);
        window.removeEventListener('keydown', handleKey);
      }
    };
    window.addEventListener('keydown', handleKey);
  }

  // ── Initialization Hooks ──
  window.addEventListener('load', () => {
    syncDashboardUI();

    // Listen for manual theme toggling changes
    const observer = new MutationObserver(() => {
      drawChart();
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  });

  window.addEventListener('resize', drawChart);

})();
