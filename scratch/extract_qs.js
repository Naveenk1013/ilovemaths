const fs = require('fs');
const topics = require('../data/topics.json');

const db = {};

topics.forEach(t => {
  if (t.path && fs.existsSync(t.path)) {
    const fullPath = t.path;
    const content = fs.readFileSync(fullPath, 'utf8');
    
    // Look for: const questions = [ ... ];
    const qMatch = content.match(/const questions = (\[[\s\S]*?\]);/);
    if (qMatch) {
      try {
        // Safe eval to parse JS array of objects
        const qArray = eval(qMatch[1]);
        db[t.id] = qArray;
        console.log('Extracted questions for ' + t.id);
      } catch (e) {
        console.error('Failed to parse questions for ' + t.id);
      }
    }
  }
});

fs.writeFileSync('./data/questions.json', JSON.stringify(db, null, 2));
console.log('Wrote questions.json');
