module.exports = {
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      zIndex: {
        "-10": "-10",
      },
      fontSize: {
        bigger: "65px",
        big: "50px",
        signCont: "49px",
        17: "17px",
      },
      width: {
        30: "30%",
        70: "70%",
        77: "77%",
        35: "35%",
        1080: "1080px",
      },
      height: {
        99: "99%",
      },
      screens: {
        mediumForHiddenBtn: "815px",
        desktop: "1280px",
        extralarge: "1920px",
      },
    },

    colors: {
      primary: "#07A098",
      secondary: "#1984FF",
      white: "#FFFFFF",
      border: "#0EB4F6",
      inputField: "#F0F0F0",
      textBody: "#686868",
      black: "#000000",
      boldtext: "011B25",
      desc: "#9D9D9D",
      footer: "#FCFCFC",
      btnText: "#C1C1C1",
      red: "#FF0000",
      placeholder: "#001E2F",
      dashBtn: "#f9f9f9",
      scoresBtn: " #ecf4f4",
      saveBtn: "#eaeaea",
      favourite: "#DD2E44",
    },
    fontFamily: {
      Poppins: "Poppins",
    },
  },
  variants: {
    extend: {
      colors: ["disabled"],

      cursor: ["disabled"],
      appearance: ["hover", "focus"],
    },
  },
  plugins: [],
};
