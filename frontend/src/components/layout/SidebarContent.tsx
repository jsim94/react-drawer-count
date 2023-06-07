import Options from "./history/Options";
import HistoryList from "./history/HistoryList";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";

export default function SidebarContent() {
  return (
    <Box>
      {" "}
      <Grid
        container
        component={Paper}
        spacing={2}
        paddingBottom={2}
        justifyContent="center"
        position={"sticky"}
        top={0}
        zIndex={"30"}
      >
        <Options />
      </Grid>
      <Box mt={3}>
        <HistoryList />
      </Box>
    </Box>
  );
}
