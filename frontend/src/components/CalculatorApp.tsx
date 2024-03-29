import AppForm from "./AppForm";
import { useEffect, useState } from "react";
import ResultPage from "./ResultsPage";
import { useAppSelector } from "../hooks/useApp";
import ComponentChildren from "../types/ComponentChildren";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

interface TabPanel {
  children: ComponentChildren;
  value: number;
  index: number;
  other?: any;
}

const TabPanel = ({ children, value, index, ...other }: TabPanel) => {
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {children}
    </div>
  );
};

export default function CalculatorApp() {
  const { loading, result } = useAppSelector((state) => ({
    loading: state.calcApp.loading,
    result: state.calcApp.result,
  }));

  const [tab, setTab] = useState<number>(0);

  const handleChange = (
    event: React.SyntheticEvent<Element, Event>,
    newValue: number
  ) => {
    setTab(newValue);
  };

  useEffect(() => {
    if (result) setTab(1);
  }, [result]);

  return (
    <Box position="relative">
      <Box
        component={Paper}
        elevation={13}
        mb={2}
        justifyContent="center"
        position={"sticky"}
        mt={1}
        top={65}
        zIndex={"30"}
      >
        <Tabs
          value={tab}
          onChange={handleChange}
          variant="fullWidth"
          sx={{ height: "40px", minHeight: "40px" }}
        >
          <Tab
            label="Input Form"
            disabled={loading}
            sx={{ height: "40px", minHeight: "40px" }}
          />
          <Tab
            label="Results"
            disabled={!result || loading}
            sx={{ height: "40px", minHeight: "40px" }}
          />
        </Tabs>
      </Box>
      <TabPanel value={tab} index={0}>
        <AppForm setTab={setTab} />
      </TabPanel>
      <TabPanel value={tab} index={1}>
        {!!result ? <ResultPage /> : null}
      </TabPanel>
    </Box>
  );
}
