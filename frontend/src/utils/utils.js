import { createTheme } from "@mui/material/styles"

const lightPalette = {
  mode: "light",
  primary: {
    main: "#1B4242",
    light: "#5C8374",
    dark: "#092635",
    contrastText: "#ffffff",
  },
  secondary: {
    main: "#5C8374",
    light: "#ff5983",
    dark: "#9a0036",
    contrastText: "#ffffff",
  },
  background: {
    default: "#EFF3EA",
    paper: "#ffffff",
  },
  text: {
    primary: "#000000",
    secondary: "#555555",
  },
}

const darkPalette = {
  mode: "dark",
  primary: {
    main: "#092635",
    light: "#e3f2fd",
    dark: "#42a5f5",
    contrastText: "#ffffff",
  },
  secondary: {
    main: "#1B4242",
    light: "#f8bbd0",
    dark: "#c2185b",
    contrastText: "#ffffff",
  },
  background: {
    default: "#121212",
    paper: "#1e1e1e",
  },
  text: {
    primary: "#ffffff",
    secondary: "#bbbbbb",
  },
}

export const getTheme = (mode) => {
  return createTheme({
    palette: mode === "dark" ? darkPalette : lightPalette,
    typography: {
      fontFamily: "Roboto, Arial, sans-serif",
    },
  })
}
