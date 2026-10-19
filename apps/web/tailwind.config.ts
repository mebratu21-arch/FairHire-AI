import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        card: 'var(--card)',
        'card-foreground': 'var(--card-foreground)',
        primary: {
          DEFAULT: '#3b82f6',
          hover: '#2563eb',
          subtle: 'rgba(59, 130, 246, 0.1)',
        },
        surface: {
          50: '#0f172a',
          100: '#1e293b',
          200: '#334155',
          300: '#475569',
        },
        accent: {
          emerald: '#10b981',
          amber: '#f59e0b',
          rose: '#f43f5e',
          indigo: '#6366f1',
        },
      },
      fontFamily: {
        latin: ['var(--font-latin)', 'sans-serif'],
        hebrew: ['var(--font-he)', 'sans-serif'],
        ethiopic: ['var(--font-am)', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
