import HistoryListItem from "./HistoryListItem";
import Loader from "../../Loader";
import { useAppSelector } from "../../../hooks/useApp";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";

export default function HistoryList() {
  const { historyList, loadingList } = useAppSelector((state) => ({
    historyList: state.calcApp.historyList,
    loadingList: state.calcApp.loadingList,
  }));

  if (loadingList) return <Loader />;

  return (
    <>
      {historyList.length > 0 ? (
        <List>
          {historyList.map((item) => (
            <HistoryListItem item={item} key={item.id} />
          ))}
        </List>
      ) : (
        <Typography p={2}>No history at this time</Typography>
      )}
    </>
  );
}
