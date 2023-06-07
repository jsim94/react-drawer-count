import Loader from "./Loader";
import AppForm from "./AppForm";
import { Box, Paper, Tab, Tabs } from "@mui/material";
import { useEffect, useState } from "react";
import ResultPage from "./ResultsPage";
import { useAppSelector } from "../hooks/useApp";
import ComponentChildren from "../types/ComponentChildren";

interface TabPanel {
  children: ComponentChildren;
  value: number;
  index: number;
  other?: any;
}

function TabPanel({ children, value, index, ...other }: TabPanel) {
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {children}
    </div>
  );
}

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
    else setTab(0);
  }, [result]);

  if (loading) return <Loader />;

  return (
    <Box position="relative">
      <Box
        component={Paper}
        elevation={15}
        mb={2}
        justifyContent="center"
        position={"sticky"}
        top={72}
        zIndex={"30"}
      >
        <Tabs value={tab} onChange={handleChange} variant="fullWidth">
          <Tab label="Input Form" />
          <Tab label="Results" disabled={!result} />
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
