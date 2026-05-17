/**
 * Quiz Engine — Reusable quiz system for I-Love-Maths
 * 
 * Usage:
 *   const quiz = new QuizEngine({
 *     containerId: 'quiz-container',
 *     questions: [...],
 *     onComplete: (results) => { ... }
 *   });
 *   quiz.start();
 * 
 * Question format:
 *   {
 *     q: "Question text",
 *     expr: "f(x) = x⁴",          // math expression (displayed prominently)
 *     opts: ["4x³", "4x⁵", ...],  // answer options
 *     ans: 0,                       // correct answer index
 *     diff: "easy",                 // "easy" | "medium" | "hard"
 *     exp: "Explanation text"       // shown after answering
 *   }
 */

class QuizEngine {
  constructor(containerId, questions, options = {}) {
    this.containerId = containerId;
    this.container = document.getElementById(containerId);
    this.allQuestions = questions;
    this.onComplete = options.onComplete || function () {};

    this.shuffled = [];
    this.current = 0;
    this.score = 0;
    this.answered = 0;
  }

  /** Shuffle array (Fisher-Yates) */
  _shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  /** Get difficulty badge class */
  _diffClass(diff) {
    return diff === 'easy' ? 'diff-easy' : diff === 'medium' ? 'diff-med' : 'diff-hard';
  }

  /** Trigger math rendering */
  _renderMath() {
    if (window.renderMathInElement) {
      renderMathInElement(this.container, {
        delimiters: [
          {left: '$$', right: '$$', display: true},
          {left: '$', right: '$', display: false},
          {left: '\\(', right: '\\)', display: false},
          {left: '\\[', right: '\\]', display: true}
        ]
      });
    }
  }

  /** Start or restart the quiz */
  start() {
    this.shuffled = this._shuffle(this.allQuestions);
    this.current = 0;
    this.score = 0;
    this.answered = 0;
    this._render();
  }

  /** Render the full quiz UI */
  _render() {
    this.container.innerHTML = `
      <div class="quiz-engine">
        <div class="qe-header">
          <h3 class="qe-title">Quiz</h3>
          <div class="qe-score-pill" id="qe-score">Score: 0 / 0</div>
        </div>
        <div class="qe-progress"><div class="qe-progress-fill" id="qe-prog"></div></div>
        <div id="qe-question-area"></div>
        <div class="qe-nav">
          <span class="qe-counter" id="qe-counter">Question 1 of ${this.shuffled.length}</span>
          <button class="btn btn-primary qe-next" id="qe-next" disabled>Next →</button>
        </div>
      </div>
      <div class="qe-result" id="qe-result" style="display:none"></div>
    `;

    document.getElementById('qe-next').addEventListener('click', () => this._next());
    this._renderQuestion();
  }

  /** Render current question */
  _renderQuestion() {
    const q = this.shuffled[this.current];
    const area = document.getElementById('qe-question-area');

    document.getElementById('qe-counter').textContent =
      `Question ${this.current + 1} of ${this.shuffled.length}`;
    document.getElementById('qe-prog').style.width =
      `${(this.current / this.shuffled.length) * 100}%`;
    document.getElementById('qe-next').disabled = true;

    // Reset next button text
    document.getElementById('qe-next').textContent = 'Next →';

    // Branch by question type
    const type = q.type || 'mcq';

    if (type === 'find-error') {
      this._renderFindError(area, q);
    } else if (type === 'step-by-step') {
      this._renderStepByStep(area, q);
    } else {
      this._renderMCQ(area, q);
    }

    // Render KaTeX for the new question
    this._triggerKaTeX();
  }

  /** Standard MCQ render */
  _renderMCQ(area, q) {
    area.innerHTML = `
      <div class="qe-card">
        <div class="qe-meta">
          <span class="qe-qnum">Q${this.current + 1}</span>
          <span class="qe-diff ${this._diffClass(q.diff)}">${q.diff}</span>
        </div>
        <div class="qe-text">${q.q}</div>
        <span class="qe-expr">${q.expr || ''}</span>
        <div class="qe-options" id="qe-opts">
          ${q.opts.map((o, i) =>
      `<button class="qe-opt" data-idx="${i}" id="qe-opt-${i}">${o}</button>`
    ).join('')}
        </div>
        <div class="qe-feedback" id="qe-fb"></div>
      </div>
    `;

    document.querySelectorAll('.qe-opt').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this._pick(parseInt(e.target.dataset.idx));
      });
    });
  }

  /** "Find the Error" question type
   *  q.steps = ["Step 1: ...", "Step 2: ...", ...]
   *  q.ans = index of the incorrect step
   */
  _renderFindError(area, q) {
    area.innerHTML = `
      <div class="qe-card">
        <div class="qe-meta">
          <span class="qe-qnum">Q${this.current + 1}</span>
          <span class="qe-diff ${this._diffClass(q.diff)}">${q.diff}</span>
          <span class="qe-type-badge error-badge">🔍 Find the Error</span>
        </div>
        <div class="qe-text">${q.q}</div>
        <p class="qe-instruction">A student solved this problem. One step has a mistake. Click the wrong step.</p>
        <div class="qe-steps" id="qe-steps">
          ${q.steps.map((s, i) =>
      `<div class="qe-step-line" data-idx="${i}" id="qe-step-${i}">
        <span class="qe-step-num">Step ${i + 1}</span>
        <span class="qe-step-content">${s}</span>
      </div>`
    ).join('')}
        </div>
        <div class="qe-feedback" id="qe-fb"></div>
      </div>
    `;

    document.querySelectorAll('.qe-step-line').forEach(line => {
      line.addEventListener('click', () => {
        this._pickFindError(parseInt(line.dataset.idx));
      });
    });
  }

  /** "Step-by-Step" question type
   *  q.scenario = "Problem statement"
   *  q.opts = ["Do X", "Do Y", ...] — choices for the NEXT step
   *  q.ans = index of correct next step
   */
  _renderStepByStep(area, q) {
    area.innerHTML = `
      <div class="qe-card">
        <div class="qe-meta">
          <span class="qe-qnum">Q${this.current + 1}</span>
          <span class="qe-diff ${this._diffClass(q.diff)}">${q.diff}</span>
          <span class="qe-type-badge step-badge">🧩 Next Step</span>
        </div>
        <div class="qe-text">${q.q}</div>
        <div class="qe-scenario">${q.scenario || ''}</div>
        <p class="qe-instruction">What is the correct next step?</p>
        <div class="qe-options" id="qe-opts">
          ${q.opts.map((o, i) =>
      `<button class="qe-opt" data-idx="${i}" id="qe-opt-${i}">${o}</button>`
    ).join('')}
        </div>
        <div class="qe-feedback" id="qe-fb"></div>
      </div>
    `;

    document.querySelectorAll('.qe-opt').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this._pick(parseInt(e.target.dataset.idx));
      });
    });
  }

  /** Trigger KaTeX rendering on the quiz container */
  _triggerKaTeX() {
    if (window.renderMathInElement) {
      const el = this.container || document.getElementById(this.containerId);
      if (el) {
        renderMathInElement(el, {
          delimiters: [
            {left: '$$', right: '$$', display: true},
            {left: '$', right: '$', display: false},
            {left: '\\(', right: '\\)', display: false},
            {left: '\\[', right: '\\]', display: true}
          ]
        });
      }
    }
  }

  /** Handle standard MCQ / step-by-step answer selection */
  _pick(idx) {
    const q = this.shuffled[this.current];
    const fb = document.getElementById('qe-fb');

    // Disable all options
    document.querySelectorAll('.qe-opt').forEach(o => {
      o.classList.add('disabled');
      o.style.pointerEvents = 'none';
    });

    // Highlight correct answer
    document.getElementById(`qe-opt-${q.ans}`).classList.add('correct');

    if (idx === q.ans) {
      this.score++;
      fb.className = 'qe-feedback show ok';
      fb.innerHTML = `✓ <strong>Correct!</strong> ${q.exp}`;
    } else {
      document.getElementById(`qe-opt-${idx}`).classList.add('wrong');
      fb.className = 'qe-feedback show bad';
      fb.innerHTML = `✗ <strong>Not quite.</strong> The correct answer is <strong>${q.opts[q.ans]}</strong>. ${q.exp}`;
    }

    this.answered++;
    document.getElementById('qe-score').textContent = `Score: ${this.score} / ${this.answered}`;
    document.getElementById('qe-next').disabled = false;

    if (this.current === this.shuffled.length - 1) {
      document.getElementById('qe-next').textContent = 'See Results';
    }

    // Render KaTeX for feedback
    this._triggerKaTeX();
  }

  /** Handle "Find the Error" answer selection */
  _pickFindError(idx) {
    const q = this.shuffled[this.current];
    const fb = document.getElementById('qe-fb');

    // Disable all step lines
    document.querySelectorAll('.qe-step-line').forEach(s => {
      s.style.pointerEvents = 'none';
      s.classList.add('disabled');
    });

    // Highlight the actual wrong step
    document.getElementById(`qe-step-${q.ans}`).classList.add('step-error');

    if (idx === q.ans) {
      this.score++;
      fb.className = 'qe-feedback show ok';
      fb.innerHTML = `✓ <strong>Sharp eye!</strong> ${q.exp}`;
      document.getElementById(`qe-step-${idx}`).classList.add('step-found');
    } else {
      document.getElementById(`qe-step-${idx}`).classList.add('step-wrong-pick');
      fb.className = 'qe-feedback show bad';
      fb.innerHTML = `✗ <strong>Not that one.</strong> The mistake is in Step ${q.ans + 1}. ${q.exp}`;
    }

    // Mark all correct steps
    q.steps.forEach((_, i) => {
      if (i !== q.ans) {
        document.getElementById(`qe-step-${i}`).classList.add('step-ok');
      }
    });

    this.answered++;
    document.getElementById('qe-score').textContent = `Score: ${this.score} / ${this.answered}`;
    document.getElementById('qe-next').disabled = false;

    if (this.current === this.shuffled.length - 1) {
      document.getElementById('qe-next').textContent = 'See Results';
    }

    this._triggerKaTeX();
  }

  /** Go to next question or show results */
  _next() {
    this.current++;
    if (this.current >= this.shuffled.length) {
      this._showResult();
      return;
    }
    this._renderQuestion();
  }

  /** Show the results screen */
  _showResult() {
    const total = this.shuffled.length;
    const wrong = total - this.score;
    const pct = Math.round((this.score / total) * 100);

    document.getElementById('qe-prog').style.width = '100%';

    // Determine feedback level
    let grade, label;
    if (pct >= 80) {
      grade = 'A'; label = 'Excellent — you\'ve nailed it.';
    } else if (pct >= 50) {
      grade = 'B'; label = 'Good work — keep practicing.';
    } else {
      grade = 'C'; label = 'Review the reference and try again.';
    }

    // Hide quiz, show result
    document.querySelector('.quiz-engine').style.display = 'none';
    const rs = document.getElementById('qe-result');
    rs.style.display = 'block';
    rs.innerHTML = `
      <div class="qe-result-inner">
        <div class="qe-result-grade">${grade}</div>
        <div class="qe-result-score">${this.score} / ${total}</div>
        <div class="qe-result-label">${label}</div>
        <div class="qe-result-bars">
          <div class="qe-rbar green">
            <div class="qe-rbar-num">${this.score}</div>
            <div class="qe-rbar-label">Correct</div>
          </div>
          <div class="qe-rbar red">
            <div class="qe-rbar-num">${wrong}</div>
            <div class="qe-rbar-label">Wrong</div>
          </div>
          <div class="qe-rbar">
            <div class="qe-rbar-num">${pct}%</div>
            <div class="qe-rbar-label">Accuracy</div>
          </div>
        </div>
        <button class="btn btn-primary" id="qe-retry">Retry Quiz ↺</button>
      </div>
    `;

    document.getElementById('qe-retry').addEventListener('click', () => {
      rs.style.display = 'none';
      this.start();
    });

    // Callback
    this.onComplete({ score: this.score, total, pct });
  }
}

// Explicitly bind to window for global access across ES6 scripts
window.QuizEngine = QuizEngine;

