/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        Sunset: "url(https://sgjksnpjllcugasriejo.supabase.co/storage/v1/object/public/stand//photo-1534274988757-a28bf1a57c17.avif)",
        
      },
      screens: {
        hello: '1300px',
        turn: '200px'
      }
    },
    container: {
      padding: '10px',
      center: true,
      screens: {
        turn: '200px',
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1180px',
        hello: '1300px'
      }
    },
  },
  plugins: [],
}

