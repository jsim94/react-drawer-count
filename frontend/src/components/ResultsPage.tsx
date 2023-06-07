import { prettifyCurrencyNumber } from "../helpers/prettify";
import Loader from "./Loader";
import { CalcResult, DenominationResult } from "../types/CalcAppTypes";
import { useAppSelector } from "../hooks/useApp";
import { red } from "@mui/material/colors";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";

interface ResultDisplayProps {
  result: CalcResult;
  title: string;
  rows: DenominationResult;
}

const ResultDisplay = ({ result, title, rows }: ResultDisplayProps) => {
  return (
    <Paper>
      <Paper elevation={4}>
        <Typography align="center" py={1}>
          {title}
        </Typography>
      </Paper>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Quanity</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {result.values.map((val, idx) => (
              <TableRow key={val.name + title}>
                <TableCell>{val.name}</TableCell>
                <TableCell>
                  <strong>{rows.denominations[idx]}</strong>
                </TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell>Change</TableCell>
              <TableCell>
                <strong>
                  {prettifyCurrencyNumber(rows.changeTotal, result.symbol)}
                </strong>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Total</TableCell>
              <TableCell>
                <strong>{prettifyCurrencyNumber(rows.total, result.symbol)}</strong>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

const ResultPage = () => {
  const { result } = useAppSelector((state) => ({
    result: state.calcApp.result,
  }));

  if (!result) return <Loader />;

  const bgcolor =
    result.total === result.drawerValues.total + result.depositValues.total
      ? null
      : red.A700;

  return (
    <Box>
      <Grid container justifyContent={"center"} spacing={1} mb={2}>
        <Grid item sm={6} xs={6} p={{ sm: 1 }}>
          <ResultDisplay
            result={result}
            title="Drawer Values"
            rows={result.drawerValues}
          />
        </Grid>
        <Grid item sm={6} xs={6} p={{ sm: 1 }}>
          <ResultDisplay
            result={result}
            title="Deposit Values"
            rows={result.depositValues}
          />
        </Grid>
      </Grid>
      <Box
        mb={4}
        component={Paper}
        width={"100%"}
        p={1}
        elevation={4}
        bgcolor={bgcolor!}
      >
        <Typography align="center">
          Grand total: {prettifyCurrencyNumber(result.total, result.symbol)}
        </Typography>
      </Box>
    </Box>
  );
};

export default ResultPage;
