import { Box } from "@mui/system";
import Options from "./history/Options";
import HistoryList from "./history/HistoryList";

export default function SidebarContent() {
  return (
    <Box>
      <Options />
      <HistoryList />
    </Box>
  );
}
