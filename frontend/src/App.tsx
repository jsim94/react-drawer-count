import { useEffect } from "react";

import { Box } from "@mui/system";
import { CssBaseline, ThemeProvider } from "@mui/material";

import { ColorModeContext, useTheme } from "./theme";

import { authState, userLogin } from "./redux/slices/auth";

import Loader from "./components/Loader";
import AuthModal from "./components/auth/AuthModal";
import CalculatorApp from "./components/CalculatorApp";
import MainLayout from "./components/layout/MainLayout";

import "./App.css";
import { useAppDispatch, useAppSelector } from "./hooks/useApp";
import DrawerCounterApi from "./api/DrawerCounterApi";
import { TOKEN_KEY } from "./config";

export default function App() {
  const [theme, colorMode] = useTheme();
  const dispatch = useAppDispatch();

  const { loggedIn, loading } = useAppSelector((state) => ({
    loggedIn: state.auth.loggedIn,
    loading: state.auth.loading,
  }));

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      dispatch(authState.setLoading(false));
      return;
    }

    DrawerCounterApi.getInstance().token = token;
    dispatch(userLogin());
  }, []);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box className="App" sx={{ display: "flex" }}>
          {loading ? (
            <Loader fullscreen />
          ) : loggedIn ? (
            <MainLayout>
              <CalculatorApp />
            </MainLayout>
          ) : (
            <AuthModal />
          )}
        </Box>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}
