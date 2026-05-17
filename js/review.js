/**
 * review.js — Spaced Repetition System (SRS)
 * Pulls older questions and tests the user on them for maximum retention.
 */

(async function() {
  const REVIEW_INTERVAL = 24 * 60 * 60 * 1000; // 24 hours in ms
  const MAX_QUESTIONS = 5;

  let questionsDb = null;

  async function initReview() {
    // 1. Fetch questions db
    try {
      const res = await fetch('data/questions.json');
      questionsDb = await res.json();
    } catch(e) {
      console.warn("Could not load questions database.");
      return;
    }

    // 2. Identify topics due for review
    if (!window.ProgressTracker) return;
    
    const progressData = window.ProgressTracker.getAllData();
    const now = Date.now();
    const topicsDue = [];

    Object.keys(progressData).forEach(topicId => {
      const p = progressData[topicId];
      if (p.scorePct >= 80 && (now - p.lastPlayed > REVIEW_INTERVAL)) {
        topicsDue.push(topicId);
      }
    });

    // 3. Update the UI to show the Daily Review button if applicable
    const reviewBtn = document.getElementById('daily-review-btn');
    if (!reviewBtn) return;

    if (topicsDue.length === 0) {
      reviewBtn.classList.add('disabled');
      reviewBtn.textContent = 'All caught up! 🎉';
      reviewBtn.title = 'You have no topics due for review today. Check back tomorrow!';
      return;
    }

    reviewBtn.classList.remove('disabled');
    reviewBtn.textContent = `Daily Challenge (${topicsDue.length} Topics Due) 🔥`;
    
    reviewBtn.addEventListener('click', () => {
      startDailyChallenge(topicsDue);
    });
  }

  function startDailyChallenge(topicsDue) {
    // Pool questions from all due topics
    let pool = [];
    topicsDue.forEach(tid => {
      if(questionsDb[tid]) {
        pool = pool.concat(questionsDb[tid]);
      }
    });

    // Shuffle and pick 5
    pool = pool.sort(() => 0.5 - Math.random());
    const selected = pool.slice(0, Math.min(MAX_QUESTIONS, pool.length));

    if (selected.length === 0) return alert('No questions found!');

    // Show modal
    const modal = document.getElementById('review-modal');
    modal.style.display = 'flex';

    // Start quiz inside modal
    if (!window.QuizEngine) return;
    
    const reviewQuiz = new window.QuizEngine('review-qe-container', selected, {
      onComplete: (res) => {
        // When finished, update the lastPlayed timestamp for the due topics
        if (res.pct >= 80) {
          const currentData = window.ProgressTracker.getAllData();
          topicsDue.forEach(tid => {
            // Update lastPlayed without altering scorePct
            if(currentData[tid]) {
              window.ProgressTracker.markComplete(tid, currentData[tid].scorePct);
            }
          });
        }
        setTimeout(() => {
          modal.style.display = 'none';
          location.reload(); // Refresh to update heatmap/UI
        }, 3000);
      }
    });
    reviewQuiz.start();
  }

  // Auto init
  initReview();
})();
