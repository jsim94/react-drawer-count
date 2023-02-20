import { createContext, useState, useMemo } from "react";
import { createTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

function getDesignTokens(mode) {
  return {
    palette: {
      mode: mode ? "dark" : "light",
      ...(mode === "light"
        ? {
            // palette values for light mode
          }
        : {
            // palette values for dark mode
          }),
    },
  };
}

// context for color mode
const ColorModeContext = createContext({
  toggleColorMode: () => {},
});

function useTheme() {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  const [darkMode, setDarkMode] = useState(prefersDarkMode);

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => setDarkMode((dark) => (dark ? false : true)),
    }),
    []
  );

  const theme = useMemo(() => createTheme(getDesignTokens(darkMode)), [darkMode]);

  return [theme, colorMode];
}

export { ColorModeContext, useTheme };
