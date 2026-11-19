/** Palette drawn from the doctor's badge: navy ring, cyan wave, lavender hijab. */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0A2540",      // headings, footer
        deep: "#0B4A8F",     // primary actions
        cyan: { DEFAULT: "#12A4C6", soft: "#D9F1F7" }, // accent, highlights
        lilac: { DEFAULT: "#B79BDB", soft: "#EFE7F8" }, // secondary accent (hijab tone)
        mist: "#F3F8FC",     // section backgrounds
      },
      fontFamily: {
        display: ["'Bricolage Grotesque'", "system-ui", "sans-serif"],
        sans: ["Figtree", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
