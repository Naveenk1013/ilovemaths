/**
 * Theme Manager — Light / Dark / Auto (System) toggle
 * Persists user choice in localStorage.
 * 
 * Usage: Include this script in <head> or early in <body>.
 * It auto-initializes and looks for a .theme-toggle container.
 */

(function () {
  const STORAGE_KEY = 'ilm-theme';
  const MODES = ['light', 'auto', 'dark'];

  /** Get saved preference or default to 'auto' */
  function getSaved() {
    try {
      const val = localStorage.getItem(STORAGE_KEY);
      return MODES.includes(val) ? val : 'auto';
    } catch {
      return 'auto';
    }
  }

  /** Resolve what the actual theme should be (light or dark) */
  function resolve(mode) {
    if (mode === 'light' || mode === 'dark') return mode;
    // Auto: follow system
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  /** Apply theme to the document */
  function apply(mode) {
    const resolved = resolve(mode);
    document.documentElement.setAttribute('data-theme', resolved);
    document.documentElement.setAttribute('data-theme-mode', mode);

    // Update toggle buttons if they exist
    document.querySelectorAll('.theme-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.mode === mode);
    });
  }

  /** Save and apply */
  function setTheme(mode) {
    try {
      localStorage.setItem(STORAGE_KEY, mode);
    } catch { /* ignore */ }
    apply(mode);
  }

  /** Initialize theme toggle buttons */
  function initToggle() {
    document.querySelectorAll('.theme-toggle').forEach(container => {
      // Only initialize once
      if (container.dataset.init) return;
      container.dataset.init = 'true';

      const current = getSaved();

      const svgSun = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>';
      const svgMonitor = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>';
      const svgMoon = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';

      const buttons = [
        { mode: 'light', icon: svgSun,     label: 'Light' },
        { mode: 'auto',  icon: svgMonitor,  label: 'Auto' },
        { mode: 'dark',  icon: svgMoon,     label: 'Dark' },
      ];

      buttons.forEach(({ mode, icon, label }) => {
        const btn = document.createElement('button');
        btn.className = `theme-btn${mode === current ? ' active' : ''}`;
        btn.dataset.mode = mode;
        btn.setAttribute('aria-label', `${label} theme`);
        btn.setAttribute('title', `${label} mode`);
        btn.innerHTML = `<span class="theme-btn-icon">${icon}</span><span class="theme-btn-label">${label}</span>`;
        btn.addEventListener('click', () => setTheme(mode));
        container.appendChild(btn);
      });
    });
  }

  // Apply immediately (prevents flash)
  apply(getSaved());

  // Listen for system theme changes (matters when mode is 'auto')
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    const mode = getSaved();
    if (mode === 'auto') {
      apply('auto');
    }
  });

  // Initialize toggle buttons when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initToggle);
  } else {
    initToggle();
  }

  // Expose globally for manual use
  window.ThemeManager = { setTheme, getSaved, resolve };
})();
