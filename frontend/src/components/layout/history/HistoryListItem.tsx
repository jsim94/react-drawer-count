import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

import CircleIcon from "@mui/icons-material/Circle";
import { HistoryItem } from "../../../types/CalcAppTypes";
import { useAppDispatch } from "../../../hooks/useApp";
import { fetchHistory } from "../../../redux/slices/calculatorApp";

export default function HistoryListItem({ item }: { item: HistoryItem }) {
  const dispatch = useAppDispatch();

  const handleClick = () => {
    dispatch(fetchHistory(item.id));
  };

  return (
    <ListItem disablePadding onClick={handleClick} sx={{ marginY: "10px" }}>
      <ListItemButton>
        <ListItemIcon sx={{ minWidth: "45px" }}>
          <CircleIcon style={{ color: `hsl(${item.historyColor},60%,70%)` }} />
        </ListItemIcon>
        <ListItemText
          primary={`${new Date(item.createdAt).toLocaleString("en-us", {
            dateStyle: "short",
            timeStyle: "short",
          })}`}
        />
      </ListItemButton>
    </ListItem>
  );
}
