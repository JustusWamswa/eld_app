import { createTheme } from "@mui/material/styles"

const lightPalette = {
  mode: "light",
  primary: {
    main: "#1B4242",
    light: "#2f6666",
    dark: "#102b2b",
    contrastText: "#ffffff",
  },
  secondary: {
    main: "#5C8374",
    light: "#80a899",
    dark: "#314d42",
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
    light: "#113a4f",
    dark: "#041924",
    contrastText: "#ffffff",
  },
  secondary: {
    main: "#1B4242",
    light: "#2d6161",
    dark: "#112e2e",
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

export const dateFormatter = (isoString) => {
  const date = new Date(isoString);

  // Extract day, month, and year
  const day = date.getDate();
  const month = date.toLocaleString(undefined, { month: 'long' }); 
  const year = date.getFullYear();

  // Extract local time in 12-hour format with AM/PM
  const options = { hour: '2-digit', minute: '2-digit', hour12: true };
  const time = new Intl.DateTimeFormat(undefined, options).format(date);

  // Get local timezone abbreviation
  const timeZone = new Intl.DateTimeFormat(undefined, { timeZoneName: 'short' })
      .formatToParts(date)
      .find(part => part.type === 'timeZoneName')?.value || '';

  return `${day} ${month} ${year} ${time} ${timeZone}`;
}
