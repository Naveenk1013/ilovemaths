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
  const STORAGE_KEY = 'ilm-progress';

  /** Read saved progress */
  function _read() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : { completedTopics: [] };
    } catch {
      return { completedTopics: [] };
    }
  }

  /** Write progress */
  function _write(data) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch { /* quota exceeded or private mode */ }
  }

  return {
    /** Mark a topic as completed */
    markComplete(topicId) {
      const data = _read();
      if (!data.completedTopics.includes(topicId)) {
        data.completedTopics.push(topicId);
        _write(data);
      }
    },

    /** Mark a topic as not completed */
    markIncomplete(topicId) {
      const data = _read();
      data.completedTopics = data.completedTopics.filter(id => id !== topicId);
      _write(data);
    },

    /** Check if a topic is completed */
    isComplete(topicId) {
      return _read().completedTopics.includes(topicId);
    },

    /** Get all completed topic IDs */
    getCompleted() {
      return _read().completedTopics;
    },

    /** Get stats for a set of topics */
    getStats(topicIds) {
      const completed = _read().completedTopics;
      const done = topicIds
        ? topicIds.filter(id => completed.includes(id)).length
        : completed.length;
      return {
        completed: done,
        total: topicIds ? topicIds.length : done
      };
    },

    /** Reset all progress */
    reset() {
      _write({ completedTopics: [] });
    }
  };
})();
