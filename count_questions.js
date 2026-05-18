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

const report = [];

function processFile(filePath) {
  const fileName = path.basename(filePath);
  if (fileName === 'power-rule.html') {
    // Power rule has 3 manually written solved examples, let's see its quiz questions
    const content = fs.readFileSync(filePath, 'utf8');
    const questions = extractQuestions(content, fileName);
    report.push({ fileName, type: 'manual', count: 3, quizCount: questions ? questions.length : 0 });
    return;
  }

  const content = fs.readFileSync(filePath, 'utf8');
  const questions = extractQuestions(content, fileName);
  if (!questions) {
    report.push({ fileName, type: 'error', count: 0, quizCount: 0 });
  } else {
    report.push({ fileName, type: 'auto', count: questions.length, quizCount: questions.length });
  }
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

walkDir(topicsDir);

console.log('--- AUDIT REPORT ---');
let under5 = 0;
report.forEach(r => {
  console.log(`${r.fileName}: Solved Examples = ${r.count}, Quiz Questions = ${r.quizCount}`);
  if (r.count < 5) under5++;
});
console.log(`\nTotal files under 5 examples: ${under5} / ${report.length}`);
