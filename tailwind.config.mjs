/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ["class"],
    content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
  		colors: {
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
		  keyframes: {
			neonGradientGlow: {
			  "0%": { borderColor: "rgba(255, 0, 102, 0.7)", boxShadow: "0 0 10px rgba(255, 0, 102, 0.5)" }, /* Reddish-Pink */
			  "50%": { borderColor: "rgba(0, 102, 255, 0.8)", boxShadow: "0 0 20px rgba(0, 102, 255, 0.6)" }, /* Electric Blue */
			  "100%": { borderColor: "rgba(128, 0, 128, 0.7)", boxShadow: "0 0 10px rgba(128, 0, 128, 0.5)" }, /* Deep Purple */
			},
		  },
		  animation: {
			"gradient-neon": "neonGradientGlow 4s ease-in-out infinite",
		  },
		  boxShadow: {
			"neon-gradient-soft": "0 0 15px rgba(255, 0, 102, 0.6), 0 0 20px rgba(0, 102, 255, 0.5), 0 0 25px rgba(128, 0, 128, 0.4)",
		  },
  	}
  },
  plugins: [require("tailwindcss-animate")],
};
