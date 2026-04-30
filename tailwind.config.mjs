/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        // Strict two-tone palette — warm beige + charcoal, no blue
        'f-white':      '#E8DFD0', // main bg — unbleached linen
        'f-cream':      '#E8DFD0', // alias
        'f-paper-warm': '#EEE6D6', // soft lift, polaroid card bg
        'f-paper-deep': '#DCD0BA', // warm pressed/hover state
        'f-ink':        '#2B2B2B', // body text + accents
        'f-ink-deep':   '#1F1C18', // headings, strongest
        'f-gray':       '#6B6357', // warm mid-gray, secondary
        'f-mid-soft':   '#9A9186', // disabled, very muted
        'f-border':     '#BFB39C', // hairline dividers — warm, not cool
        'f-head':       '#1F1C18', // heading alias
        'f-night':      '#1F1B16', // warm near-black panel
      },
      fontFamily: {
        serif: ['Fraunces', 'Georgia', 'serif'],
        sans:  ['Inter', 'system-ui', 'sans-serif'],
        mono:  ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [],
};
