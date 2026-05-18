/**
 * Progress Tracker — localStorage-based topic completion tracking
 * 
 * Usage:
 *   ProgressTracker.markComplete('diff-calculus');
 *   ProgressTracker.isComplete('diff-calculus'); // true
 *   ProgressTracker.getCompleted(); // ['diff-calculus']
 *   ProgressTracker.getStats(); // { completed: 1, total: 35 }
 */

const ProgressTracker = (function () {
  const STORAGE_KEY = 'ilm-progress-v2';
  const LEGACY_KEY = 'ilm-progress';

  /** Read saved progress */
  function _read() {
    try {
      let data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        if (!parsed.activityLog) parsed.activityLog = {};
        return parsed;
      }
      
      // Migrate legacy array if exists
      const legacy = localStorage.getItem(LEGACY_KEY);
      if (legacy) {
        const parsed = JSON.parse(legacy);
        const migrated = { topics: {}, activityLog: {} };
        if (parsed.completedTopics) {
          parsed.completedTopics.forEach(id => {
            migrated.topics[id] = { scorePct: 100, lastPlayed: Date.now(), attempts: 1 };
          });
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated));
        localStorage.removeItem(LEGACY_KEY);
        return migrated;
      }
      return { topics: {}, activityLog: {} };
    } catch {
      return { topics: {}, activityLog: {} };
    }
  }

  /** Write progress */
  function _write(data) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch { /* quota exceeded or private mode */ }
  }

  return {
    /** Mark a topic as completed with a score */
    markComplete(topicId, scorePct = 100) {
      if (!topicId || topicId === '') {
        try {
          const path = window.location.pathname;
          const file = path.substring(path.lastIndexOf('/') + 1);
          let parsed = file.replace('.html', '');
          if (parsed === 'foundation') parsed = 'basic-foundation';
          if (parsed === 'symbols') parsed = 'story-of-symbols';
          topicId = parsed || 'basic-foundation';
        } catch (e) {
          topicId = 'basic-foundation';
        }
      }

      const data = _read();
      
      // Log topic score
      if (!data.topics[topicId]) {
        data.topics[topicId] = { scorePct, lastPlayed: Date.now(), attempts: 1 };
      } else {
        data.topics[topicId].scorePct = Math.max(data.topics[topicId].scorePct, scorePct);
        data.topics[topicId].lastPlayed = Date.now();
        data.topics[topicId].attempts++;
      }

      // Log daily activity for heatmap
      const today = new Date().toISOString().split('T')[0];
      data.activityLog[today] = (data.activityLog[today] || 0) + 1;

      _write(data);
    },

    /** Mark a topic as not completed */
    markIncomplete(topicId) {
      const data = _read();
      delete data.topics[topicId];
      _write(data);
    },

    /** Check if a topic is completed (score >= 80) */
    isComplete(topicId) {
      const t = _read().topics[topicId];
      return t ? t.scorePct >= 80 : false;
    },

    /** Get stats object for a specific topic */
    getTopicData(topicId) {
      return _read().topics[topicId] || null;
    },

    /** Get the daily activity log */
    getActivityLog() {
      return _read().activityLog;
    },

    /** Get all completed topic IDs */
    getCompleted() {
      const topics = _read().topics;
      return Object.keys(topics).filter(id => topics[id].scorePct >= 80);
    },

    /** Get stats for a set of topics */
    getStats(topicIds) {
      const topics = _read().topics;
      const completed = Object.keys(topics).filter(id => topics[id].scorePct >= 80);
      const done = topicIds
        ? topicIds.filter(id => completed.includes(id)).length
        : completed.length;
      return {
        completed: done,
        total: topicIds ? topicIds.length : done
      };
    },

    /** Get the raw topics object */
    getAllData() {
      return _read().topics;
    },

    /** Reset all progress */
    reset() {
      _write({ topics: {} });
    }
  };
})();

// Explicitly bind to window for global access across ES6 scripts
window.ProgressTracker = ProgressTracker;

