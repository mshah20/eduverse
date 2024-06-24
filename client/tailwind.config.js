/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
        extend: {
            keyframes: {
                fadeInOut: {
                    '0%, 100%': { opacity: 0 },
                    '20%, 80%': { opacity: 1 }
                }
            },
            animation: {
                fadeInOut: 'fadeInOut 3s linear forwards'
            },
            dropShadow: {
                'md-blue': '0 4px 3px rgba(23, 37, 84, 0.5)'
            }
        },
    },
    plugins: [],
}

