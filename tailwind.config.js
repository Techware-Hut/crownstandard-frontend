/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                brand: {
                    gold: "#B9903C", // primary accent from the mock
                    dark: "#1F2937",
                },
            },
            boxShadow: {
                soft: "0 10px 30px rgba(0,0,0,0.08)",
            },
            maxWidth: {
                // content: "1150px",
            },
            screens: {
                '868': '868px', // 👈 custom breakpoint
                '3xl': '1600px',
            },
        },
    },
    plugins: [],
};
