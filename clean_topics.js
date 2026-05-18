const fs = require('fs');
const path = require('path');

const topicsDir = 'c:\\Users\\NAVEEN\\Desktop\\BCA\\maths\\I-love-maths\\topics';

// Helper to extract questions from script contents
function extractQuestions(content, fileName) {
  const match = content.match(/(?:const|let|var)\s+(\w*[qQ]uestions)\s*=\s*(\[[^]*?\])\s*;/);
  if (!match) {
    return null;
  }
  
  const arrayStr = match[2];
  try {
    const getQuestions = new Function(`return ${arrayStr};`);
    return getQuestions();
  } catch (err) {
    return null;
  }
}

function generateStepsHtml(questions) {
  return questions.map((q, idx) => {
    if (!q || !q.q) return '';
    const opts = q.opts || ['Yes', 'No'];
    
    // Generate beautiful list of choices for Step 1
    const optionsList = opts.map((opt, oIdx) => {
      const label = String.fromCharCode(65 + oIdx); // A, B, C, D...
      return `<li style="margin-bottom:0.4rem;text-align:left;"><strong>Option ${label}:</strong> ${opt}</li>`;
    }).join('');
    
    const ansIdx = typeof q.ans === 'number' ? q.ans : 0;
    const correctLabel = String.fromCharCode(65 + ansIdx);
    const correctOptionText = opts[ansIdx] || 'Correct Option';

    return `
          <!-- Example ${idx + 1} -->
          <div class="solved-example-card">
            <div class="solved-example-header">
              <span class="solved-badge">Example ${idx + 1} · Concept Application</span>
              <div class="solved-timer" id="timer-${idx + 1}">
                <span class="timer-display">00:00</span>
                <button class="timer-btn" onclick="toggleTimer(${idx + 1})">Start Timer ⏱️</button>
              </div>
            </div>
            <div class="solved-question">
              ${q.q}
              ${q.expr ? `<div style="margin-top:0.5rem;font-size:1.15rem;font-weight:600;">${q.expr}</div>` : ''}
            </div>
            <div class="solved-solution-wrap" id="solution-${idx + 1}">
              <button class="btn btn-primary btn-reveal" onclick="revealSolution(${idx + 1})">Reveal Step-by-Step Solution 👁️</button>
              <div class="solved-steps" style="display: none;">
                
                <div class="solved-step">
                  <div class="step-num">Step 1</div>
                  <div class="step-content">
                    <div class="step-desc">
                      Analyze the given options:
                      <ul style="margin-top:0.5rem; padding-left:1.2rem; list-style-type: none;">
                        ${optionsList}
                      </ul>
                    </div>
                  </div>
                </div>

                <div class="solved-step">
                  <div class="step-num">Step 2</div>
                  <div class="step-content">
                    <div class="step-math">$$\\text{Apply Core Principles}$$</div>
                    <div class="step-desc">${q.exp}</div>
                  </div>
                </div>

                <div class="solved-step">
                  <div class="step-num">Step 3</div>
                  <div class="step-content">
                    <div class="step-desc">
                      Cross-reference choices to select the valid deduction. Option <strong>${correctLabel}</strong> perfectly aligns with the principles analyzed.
                    </div>
                  </div>
                </div>

                <div class="solved-success-box">
                  <strong>Final Answer:</strong> Option ${correctLabel} (${correctOptionText})
                </div>
              </div>
            </div>
          </div>`;
  }).join('\n');
}

function processFile(filePath) {
  const fileName = path.basename(filePath);
  let content = fs.readFileSync(filePath, 'utf8');

  // Extract questions
  const questions = extractQuestions(content, fileName);
  if (!questions || questions.length === 0) {
    console.log(`[Error] No questions found in ${fileName}`);
    return;
  }

  // Generate clean dynamic solved examples HTML
  const stepsHtml = generateStepsHtml(questions);
  const cleanPaneSolvedHtml = `<!-- SOLVED EXAMPLES -->
        <div class="tab-pane" id="pane-solved">
          <div class="solved-examples-container">
            ${stepsHtml}
          </div>
        </div>`;

  // Regex to match from the start of the solved examples block up to the quiz pane opening tag
  const targetRegex = /(?:<!-- SOLVED EXAMPLES -->|<div class="tab-pane"\s+id="pane-solved">)[^]*?(?=<div class="tab-pane"\s+id="pane-quiz">)/;
  
  if (targetRegex.test(content)) {
    content = content.replace(targetRegex, cleanPaneSolvedHtml + '\n        ');
    console.log(`[Success] Cleaned and rebuilt solved examples section in ${fileName}`);
  } else {
    // If not found, attempt a fallback injection just before the quiz tab pane
    const quizPanePattern = /<div class="tab-pane"\s+id="pane-quiz">/;
    if (quizPanePattern.test(content)) {
      content = content.replace(quizPanePattern, `${cleanPaneSolvedHtml}\n        <div class="tab-pane" id="pane-quiz">`);
      console.log(`[Fallback] Injected clean solved examples in ${fileName}`);
    } else {
      console.log(`[Error] Could not locate insertion point in ${fileName}`);
      return;
    }
  }

  fs.writeFileSync(filePath, content, 'utf8');
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walkDir(fullPath);
    } else if (file.endsWith('.html')) {
      processFile(fullPath);
    }
  });
}

console.log('Running comprehensive DOM nesting repair on all topic pages...');
walkDir(topicsDir);
console.log('Finished DOM nesting repair!');
