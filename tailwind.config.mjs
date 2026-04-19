/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        // Surfer / 35mm film palette — sun-bleached, coastal, analog
        'f-white':  '#F5F2EC', // main background: warm off-white like aged paper
        'f-cream':  '#EBE7DF', // alt background: slightly deeper cream
        'f-blue':   '#A8C8DC', // primary accent: faded sky blue (sun-bleached denim)
        'f-blue-lt':'#D0E5F0', // lighter blue
        'f-blue-pl':'#E8F1F7', // palest blue (section wash)
        'f-sand':   '#C4B5A5', // warm sandy accent
        'f-ink':    '#2A2825', // text: warm dark charcoal (not pure black)
        'f-gray':   '#706B65', // secondary text: muted warm gray
        'f-border': '#D8D3CB', // borders / dividers
      },
      fontFamily: {
        serif: ['Fraunces', 'Georgia', 'serif'],
        sans:  ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
