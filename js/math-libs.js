/**
 * Math Library Loader
 * Dynamically loads required mathematical and visualization libraries
 * to keep HTML files clean while providing professional-grade rendering.
 */
(function() {
  const CDNS = {
    css: [
      // KaTeX CSS
      'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css'
    ],
    js: [
      // Math computations
      'https://cdnjs.cloudflare.com/ajax/libs/mathjs/12.4.0/math.min.js',
      'https://cdnjs.cloudflare.com/ajax/libs/decimal.js/10.4.3/decimal.min.js',
      
      // Math rendering (KaTeX is usually faster, MathJax is a solid fallback)
      'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js',
      'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/contrib/auto-render.min.js',
      
      // Visualizations
      'https://cdn.jsdelivr.net/npm/chart.js',
      'https://d3js.org/d3.v7.min.js'
    ]
  };

  // Configure MathJax before loading it
  window.MathJax = {
    tex: {
      inlineMath: [['$', '$'], ['\\(', '\\)']],
      displayMath: [['$$', '$$'], ['\\[', '\\]']]
    },
    svg: { fontCache: 'global' }
  };

  // Add MathJax explicitly
  CDNS.js.push('https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js');

  // Load CSS
  CDNS.css.forEach(href => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    document.head.appendChild(link);
  });

  // Load JS synchronously to ensure they are available when scripts run
  CDNS.js.forEach(src => {
    const script = document.createElement('script');
    script.src = src;
    script.defer = true;
    
    // Auto-render KaTeX once it's loaded
    if (src.includes('auto-render')) {
      script.onload = () => {
        if (window.renderMathInElement) {
          renderMathInElement(document.body, {
            delimiters: [
              {left: '$$', right: '$$', display: true},
              {left: '$', right: '$', display: false},
              {left: '\\(', right: '\\)', display: false},
              {left: '\\[', right: '\\]', display: true}
            ]
          });
        }
      };
    }
    
    document.head.appendChild(script);
  });
})();
