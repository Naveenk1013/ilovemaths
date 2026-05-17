const fs = require('fs');
const topics = require('../data/topics.json');

topics.forEach(t => {
  if (t.path && fs.existsSync("../" + t.path)) {
    const fullPath = "../" + t.path;
    let content = fs.readFileSync(fullPath, 'utf8');
    // We want to replace: ProgressTracker.markComplete('', res.pct)
    // with: ProgressTracker.markComplete('topic-id', res.pct)
    content = content.replace(/ProgressTracker\.markComplete\(\s*['"](.*?)['"]\s*,\s*res\.pct\)/g, `ProgressTracker.markComplete('${t.id}', res.pct)`);
    fs.writeFileSync(fullPath, content);
  }
});
console.log('Fixed IDs');
