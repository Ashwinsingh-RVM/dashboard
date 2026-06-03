import purgeCss from '@fullhuman/postcss-purgecss';

// PurgeCSS runs only on production builds. We scan both index.html and app.js
// because class names commonly live inside JS template literals (innerHTML).
const isProd = process.env.NODE_ENV === 'production';

export default {
  plugins: isProd
    ? [
        purgeCss({
          content: ['./index.html', './app.js'],
          // Default extractor handles standard tokens. The pattern catches
          // class names, IDs, and tag tokens in HTML and JS strings.
          defaultExtractor: (content) => content.match(/[A-Za-z0-9_-]+/g) || [],
          safelist: {
            // Keep classes added at runtime by libraries we can't statically scan.
            standard: [
              /^leaflet-/,        // Leaflet adds these to map containers
              /^chartjs-/,        // Chart.js tooltip / legend classes
              'active', 'on', 'off', 'open', 'expanded', 'collapsed',
              'is-active', 'is-open', 'is-loading', 'is-error',
              'hover', 'focus', 'focused', 'selected',
            ],
            // Keep entire dynamic family names regardless of what follows.
            // Be conservative — these patterns match dynamically-built class names.
            greedy: [
              /^v\d+-/,           // the v14..v48 accretion: keep until manual review
              /^kpi-/, /^pchip-/, /^badge-/, /^pill-/, /^chip-/,
              /^status-/, /^severity-/, /^stage-/, /^state-/,
            ],
            // Keep deep descendants of safelisted parents
            deep: [/^leaflet-/, /^chartjs-/],
            keyframes: true,
            variables: true,
          },
        }),
      ]
    : [],
};
