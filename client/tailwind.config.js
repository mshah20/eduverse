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
            }
        },
    },
    plugins: [],
}

