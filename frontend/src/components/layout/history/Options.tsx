import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";

import { updateUser } from "../../../redux/slices/auth";
import { deleteAllHistory } from "../../../redux/slices/calculatorApp";
import { useAppDispatch, useAppSelector } from "../../../hooks/useApp";
import { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Popover from "@mui/material/Popover";
import Box from "@mui/material/Box";

export default function Options() {
  const dispatch = useAppDispatch();
  const { amount, currency, username, loading } = useAppSelector((state) => ({
    amount: state.auth.user.amount,
    currency: state.auth.user.currency,
    username: state.auth.user.username!,
    loading: state.calcApp.deleteLoading,
  }));

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const open = Boolean(anchorEl);

  const [formAmount, setFormAmount] = useState<number>(+(amount / 100).toFixed(0));
  const [formCurrency, setFormCurrency] = useState(currency);

  useEffect(() => {
    setFormCurrency(currency);
  }, [currency]);

  useEffect(() => {
    setFormAmount(+(amount / 100).toFixed(0));
  }, [amount]);

  const handleUpdate = (data: any) => {
    dispatch(updateUser({ username, data }));
  };

  const handleAmountOnBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (amount === 0 || +e.target.value === amount) setFormAmount(amount);
    else handleUpdate({ amount: +(formAmount * 100).toFixed(0) });
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || /^[0-9\b]{1,4}$/.test(value)) setFormAmount(+value);
  };

  const handleCurrencyChange = (e: SelectChangeEvent<HTMLInputElement>) => {
    handleUpdate({ currency: e.target.value });
  };

  const handleDelete = () => {
    dispatch(deleteAllHistory());
    handleDeleteClose();
  };

  const handleDeleteConfirmClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(e.currentTarget);
  };

  const handleDeleteClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Grid item xs="auto" mb={1}>
        <FormControl>
          <InputLabel id="currency-code-label">Currency</InputLabel>
          <Select
            labelId="currency-code-label"
            id="currency-code"
            name="currencyCode"
            value={formCurrency as any}
            label="Currency"
            onChange={handleCurrencyChange}
            sx={{ width: "100px" }}
          >
            <MenuItem value={"USD"}>USD</MenuItem>
            <MenuItem value={"GBP"}>GBP</MenuItem>
            <MenuItem value={"EUR"}>EUR</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={5}>
        <FormControl>
          <TextField
            id="drawer-amount"
            name="drawerAmount"
            label="Drawer Amount"
            value={formAmount}
            onChange={handleAmountChange}
            onBlur={handleAmountOnBlur}
          />
        </FormControl>
      </Grid>
      <Grid>
        <Button variant="outlined" color="error" onClick={handleDeleteConfirmClick}>
          Delete History
        </Button>
        <Popover
          open={open}
          anchorEl={anchorEl}
          onClose={handleDeleteClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
        >
          <Box>
            <Button
              variant="contained"
              color="error"
              disabled={loading}
              onClick={handleDelete}
            >
              Are you sure?
            </Button>
          </Box>
        </Popover>
      </Grid>
    </>
  );
}
