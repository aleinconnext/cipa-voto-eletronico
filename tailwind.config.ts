import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				// Urna specific colors
				urna: {
					screen: 'hsl(var(--urna-screen))',
					'screen-foreground': 'hsl(var(--urna-screen-foreground))',
					'button-white': 'hsl(var(--urna-button-white))',
					'button-white-foreground': 'hsl(var(--urna-button-white-foreground))',
					'button-orange': 'hsl(var(--urna-button-orange))',
					'button-orange-foreground': 'hsl(var(--urna-button-orange-foreground))',
					body: 'hsl(var(--urna-body))'
				},
				// Jurunense colors
				jurunense: {
					primary: '#131D52',
					secondary: '#FE3B1F',
					gray: '#BDBDBD'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'pulse-button': {
					'0%, 100%': {
						boxShadow: '0 0 0 0 hsl(var(--primary) / 0.7)'
					},
					'50%': {
						boxShadow: '0 0 0 10px hsl(var(--primary) / 0)'
					}
				},
				'vote-confirm': {
					'0%': { transform: 'scale(1)' },
					'50%': { transform: 'scale(1.05)' },
					'100%': { transform: 'scale(1)' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'pulse-button': 'pulse-button 2s infinite',
				'vote-confirm': 'vote-confirm 0.3s ease-out'
			},
			backgroundImage: {
				'gradient-primary': 'var(--gradient-primary)',
				'gradient-secondary': 'var(--gradient-secondary)',
				'gradient-urna': 'var(--gradient-urna)'
			},
			boxShadow: {
				'urna': 'var(--shadow-urna)',
				'screen': 'var(--shadow-screen)',
				'button': 'var(--shadow-button)'
			},
			transitionTimingFunction: {
				'urna': 'var(--transition-urna)'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
