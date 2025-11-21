/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Map `primary` to Tailwind blue shades; DEFAULT uses blue-900
        primary: { light: '#60A5FA', DEFAULT: '#1E3A8A', dark: '#172554' },
        secondary: { light: '#F472B6', DEFAULT: '#EC4899', dark: '#BE185D' },
        accent: { light: '#FACC15', DEFAULT: '#EAB308', dark: '#CA8A04' },
      },
      fontFamily: { heading: ['Poppins', 'ui-sans-serif', 'system-ui'] },
      boxShadow: {
        card: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)',
        button: '0 4px 6px -1px rgba(0,0,0,0.1)',
      },
      borderRadius: { xl: '1rem' },
    },
  },
  plugins: [],
}
