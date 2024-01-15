const { NonceAccount } = require("@solana/web3.js");

module.exports = {
  darkMode: ["class"],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
    './src/modules/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brandblack: "#1F2125",
        transparent: 'transparent',
        transparentwhite: "rgba(255, 255, 255, 0.4)",
        darkcharcoal: "#2F3336",
        borderwidget: "rgba(37, 51, 65, 0.5)",
        gray: {
          950: "#8899A6",
        },
        current: 'currentColor',
        'white': '#fff',
        'black': '#000',
        'grey': 'var(--grey-color)',
        'focus': 'var(--focus-color)',
        'focusbackground': 'var(--focusbackground-color)',
        'primary': 'var(--primary-color)',
        'lightprimary': 'var(--lightprimary-color)',
        'darkprimary': 'var(--darkprimary-color)',
        'secondary': 'var(--secondary-color)',
        'footer': 'var(--footer-color)',
        'content': '#cecece',
        'darkGreen': "#162724",
        // kisikbo5 wrote this
        'globalBgColor': '#131314',
        'semiSplitter' : '#1d1f1f',
        'panelBgColor': '#181818'
        // end of kisikbo5
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--gradient-color-stops))',
        'light-gradient-radial': 'radial-gradient(var(--light-gradient-color-stops))',
        'gradient-linear': 'linear-gradient(var(--gradient-linear-stops))',
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
    screens: {
      'xs' : '220px',
      'sm' : '640px',
      'md' : '768px',
      'lg' : '1024px',
      'xl' : '1280px',
      'custom-2xl' : '1680px'
    },
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
  safelist: [
    {
      pattern: /(mt|mb|mr|ml|my|mx|px|py|pt|pb|pl|pr)-[0-9]+/
    },
    {
      pattern: /flex-.*/
    },
    {
      pattern: /(bottom|right|top|left)-[0-9]+/
    },
    {
      pattern: /(w|h)-[0-9]+/
    }
  ]
}