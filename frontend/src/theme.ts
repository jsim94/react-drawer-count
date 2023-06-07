import { createContext, useState, useMemo } from "react";
import { ThemeOptions, createTheme } from "@mui/material/styles";
// import useMediaQuery from "@mui/material/useMediaQuery";
import { PaletteMode } from "@mui/material";

declare module "@mui/material/styles" {
  interface Theme {
    status: {
      danger: string;
    };
  }
  // allow configuration using `createTheme`
  interface ThemeOptions {
    status?: {
      danger?: string;
    };
  }
}

function getDesignTokens(mode: "dark" | "light"): ThemeOptions {
  return {
    palette: {
      mode: mode,
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
  // const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)")
  //   ? "dark"
  //   : "light";

  const [mode, setMode] = useState<"light" | "dark">("dark");

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () =>
        setMode((dark: PaletteMode) => (dark === "light" ? "dark" : "light")),
    }),
    []
  );

  const theme = useMemo(() => createTheme(getDesignTokens(mode)), [mode]);

  return [theme, colorMode] as const;
}

export { ColorModeContext, useTheme };
