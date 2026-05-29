import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0f172a',
        mist: '#eef2ff',
        accent: '#0f766e',
        warm: '#f59e0b',
      },
    },
  },
  plugins: [],
};

export default config;
