import Box from "@mui/material/Box";
import useTheme from "@mui/material/styles/useTheme";
import PuffLoader from "react-spinners/PuffLoader";

interface LoaderProps {
  fullscreen?: boolean;
}

export default function Loader({ fullscreen }: LoaderProps) {
  const theme = useTheme();

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    zIndex: "13000",
  };

  const boxedStyle = {
    position: "relative",
    marginTop: "60px",
  };

  const fullscreenStyle = {
    width: "100vw",
    height: "100vh",
    background: theme.palette.background.default,
    zIndex: "13000",
  };

  if (fullscreen)
    return (
      <Box sx={fullscreenStyle}>
        <Box sx={style}>
          <PuffLoader color="#33cfff" />
        </Box>
      </Box>
    );

  return (
    <Box sx={boxedStyle}>
      <Box sx={style}>
        <PuffLoader color="#33cfff" />
      </Box>
    </Box>
  );
}
