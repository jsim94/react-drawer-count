import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import { CssBaseline, ThemeProvider } from "@mui/material";

import MuiNavbar from "./components/MuiNavbar";
import Signup from "./routes/Signup";
import { ColorModeContext, useTheme } from "./theme";

import "./App.css";
import HistorySidebar from "./components/HistorySidebar";
import { Box } from "@mui/system";
import Sidebar from "./components/MuiNavbar";

export default function App() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [theme, colorMode] = useTheme();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box className="App" sx={{ display: "flex" }}>
          <Sidebar />
          <MuiNavbar toggleDrawer={handleDrawerToggle} mobileOpen={mobileOpen} />
          <HistorySidebar
            mobileOpen={mobileOpen}
            toggleDrawer={handleDrawerToggle}
          />
          <Box component="main">
            <Routes>
              <Route path="/" element={<h1>test</h1>} />
              <Route exact path="/signup" element={<Signup />} />
              <Route exact path="*" element={<h1>Hi</h1>} />
            </Routes>
          </Box>
        </Box>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}
