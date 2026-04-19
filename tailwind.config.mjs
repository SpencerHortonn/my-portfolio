/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        // Single warm-paper palette — one strip, no alternation
        'f-white':   '#E5DCC8', // THE site background — warm film-paper beige
        'f-cream':   '#E5DCC8', // alias: kept so existing classes don't break
        'f-blue-pl': '#E5DCC8', // alias: same
        'f-blue':    '#A8C8DC', // faded sky blue accent
        'f-blue-lt': '#D0E5F0', // lighter blue (pull-quotes, accents)
        'f-sand':    '#C4B5A5', // warm sand tone
        'f-ink':     '#2B2825', // body text — deep warm charcoal
        'f-head':    '#1F1C18', // headings — slightly deeper
        'f-gray':    '#6B6357', // muted secondary text
        'f-border':  '#BFB39C', // hairline dividers — warm, not cool
      },
      fontFamily: {
        serif: ['Fraunces', 'Georgia', 'serif'],
        sans:  ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
