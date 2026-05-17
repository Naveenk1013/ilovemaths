/**
 * App.js — Dynamic landing page logic
 * Fetches topics.json and courses.json, renders topic grid,
 * handles course filtering, and updates stats.
 */

(async function () {
  let allTopics = [];
  let allCourses = [];
  let activeFilter = 'all';

  // ── Fetch data ──
  try {
    const [topicsRes, coursesRes] = await Promise.all([
      fetch('data/topics.json'),
      fetch('data/courses.json')
    ]);
    allTopics = await topicsRes.json();
    allCourses = await coursesRes.json();
  } catch (err) {
    const grid = document.getElementById('topics-grid');
    if (grid) grid.innerHTML = '<p style="text-align:center;color:var(--color-text-tertiary);padding:2rem 0;">Could not load topic data.</p>';
    return;
  }

  // ── Category icons map (fallback) ──
  const categoryOrder = [
    'Foundation', 'Algebra', 'Trigonometry', 'Discrete',
    'Linear Algebra', 'Geometry', 'Calculus', 'Applied', 'Statistics'
  ];

  // ── Filter topics ──
  function getFilteredTopics(courseId) {
    if (courseId === 'all') return allTopics;
    const course = allCourses.find(c => c.courseId === courseId);
    if (!course) return allTopics;
    return allTopics.filter(t => course.topics.includes(t.id));
  }

  // ── Group by category ──
  function groupByCategory(topics) {
    const groups = {};
    topics.forEach(t => {
      if (!groups[t.category]) groups[t.category] = [];
      groups[t.category].push(t);
    });
    // Sort by category order
    const sorted = {};
    categoryOrder.forEach(cat => {
      if (groups[cat]) sorted[cat] = groups[cat];
    });
    // Add any remaining
    Object.keys(groups).forEach(cat => {
      if (!sorted[cat]) sorted[cat] = groups[cat];
    });
    return sorted;
  }

  // ── Render single topic card ──
  function renderCard(topic) {
    const isLive = topic.status === 'live';
    const tag = isLive ? 'a' : 'div';
    const href = isLive ? ` href="${topic.path}"` : '';
    const soonClass = isLive ? '' : ' coming-soon';
    const badgeClass = isLive ? 'badge-active' : 'badge-soon';
    const badgeText = isLive ? 'Live' : 'Coming Soon';
    const questions = topic.questionsCount > 0
      ? `<span class="topic-questions">${topic.questionsCount} questions</span>` : '';

    let masteryHtml = '';
    if (isLive && window.ProgressTracker) {
      const pData = window.ProgressTracker.getTopicData(topic.id);
      if (pData && pData.scorePct >= 80) {
        if (pData.scorePct === 100) masteryHtml = `<span class="mastery-badge gold" title="100% Score">🥇 Gold</span>`;
        else if (pData.scorePct >= 90) masteryHtml = `<span class="mastery-badge silver" title="${pData.scorePct}% Score">🥈 Silver</span>`;
        else masteryHtml = `<span class="mastery-badge bronze" title="${pData.scorePct}% Score">🥉 Bronze</span>`;
      }
    }

    return `
      <${tag}${href} class="topic-card${soonClass}" id="topic-${topic.id}">
        <div class="topic-card-icon">${topic.icon}</div>
        <div class="topic-card-title">${topic.title}</div>
        <div class="topic-card-desc">${topic.description}</div>
        <div class="topic-card-meta">
          <span class="topic-badge ${badgeClass}">${badgeText}</span>
          ${questions}
          ${masteryHtml}
        </div>
      </${tag}>
    `;
  }

  // ── Render entire topics grid ──
  function renderTopics() {
    const filtered = getFilteredTopics(activeFilter);
    const grouped = groupByCategory(filtered);
    const grid = document.getElementById('topics-grid');
    if (!grid) return;

    let html = '';
    Object.entries(grouped).forEach(([category, topics]) => {
      html += `
        <div class="category-group">
          <div class="category-group-label">${category}</div>
          <div class="topics-grid">
            ${topics.map(renderCard).join('')}
          </div>
        </div>
      `;
    });

    grid.innerHTML = html;

    // Update stats
    updateStats(filtered);
  }

  // ── Update stats bar ──
  function updateStats(topics) {
    const live = topics.filter(t => t.status === 'live').length;
    const totalQ = topics.reduce((sum, t) => sum + (t.questionsCount || 0), 0);

    const statTopics = document.getElementById('stat-topics');
    const statLive = document.getElementById('stat-live');
    const statQuestions = document.getElementById('stat-questions');

    if (statTopics) statTopics.textContent = topics.length;
    if (statLive) statLive.textContent = live;
    if (statQuestions) statQuestions.textContent = totalQ > 0 ? `${totalQ}+` : '0';
  }

  // ── Build course filter pills ──
  function renderFilters() {
    const container = document.getElementById('course-filters');
    if (!container) return;

    let html = `<button class="filter-pill active" data-course="all">All Topics</button>`;
    allCourses.forEach(c => {
      html += `<button class="filter-pill" data-course="${c.courseId}">${c.title}</button>`;
    });
    container.innerHTML = html;

    // Attach listeners
    container.querySelectorAll('.filter-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        activeFilter = pill.dataset.course;
        container.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        renderTopics();
      });
    });
  }

  // ── Render Activity Heatmap ──
  function renderHeatmap() {
    const grid = document.getElementById('heatmap-grid');
    const streakEl = document.getElementById('heatmap-streak');
    if (!grid || !window.ProgressTracker) return;

    const log = window.ProgressTracker.getActivityLog();
    const DAYS = 98; // 14 weeks
    const today = new Date();
    
    // Normalize today to start of day
    today.setHours(0, 0, 0, 0);

    let html = '';
    let currentStreak = 0;
    let streakActive = true;

    // Calculate dates backwards
    const dates = [];
    for (let i = DAYS - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const iso = d.toISOString().split('T')[0];
      dates.push(iso);
    }

    // Determine current streak by checking backwards from today
    for (let i = dates.length - 1; i >= 0; i--) {
      const dateStr = dates[i];
      const count = log[dateStr] || 0;
      
      // If it's today and count is 0, we don't break the streak immediately
      // (they have all day to finish it), but if yesterday was 0, it's broken.
      if (i === dates.length - 1 && count === 0) {
        continue;
      }
      
      if (count > 0) {
        currentStreak++;
      } else {
        break; // streak broken
      }
    }

    if (streakEl) {
      streakEl.textContent = `${currentStreak} Day Streak 🔥`;
    }

    // Render cells
    dates.forEach(dateStr => {
      const count = log[dateStr] || 0;
      let level = 0;
      if (count > 0) level = 1;
      if (count > 2) level = 2;
      if (count > 4) level = 3;
      if (count > 6) level = 4;

      html += `<div class="heatmap-cell level-${level}" title="${dateStr}: ${count} quizzes"></div>`;
    });

    grid.innerHTML = html;
  }

  // ── Initialize ──
  renderFilters();
  renderTopics();
  renderHeatmap();
})();
