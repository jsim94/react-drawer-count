import Options from "./history/Options";
import HistoryList from "./history/HistoryList";
import Box from "@mui/material/Box";

export default function SidebarContent() {
  return (
    <Box>
      <Options />
      <HistoryList />
    </Box>
  );
}
