import { useState } from "react";
import { Form, Formik } from "formik";

import { Box } from "@mui/system";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { authState, updateUser } from "../../redux/slices/auth";
import { updateValidation } from "../../validation";
import DrawerCounterApi from "../../api/DrawerCounterApi";
import { useAppDispatch, useAppSelector } from "../../hooks/useApp";
import { red } from "@mui/material/colors";

export default function ProfileItem() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => ({
    user: state.auth.user,
  }));

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [pwOpen, setPwOpen] = useState<boolean>(false);
  const [formError, setFormError] = useState<string | null>(null);

  const open = !!anchorEl;

  const handleOpen = (e: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(e.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
    setPwOpen(false);
  };

  const handleUpdate = () => {
    setPwOpen(true);
  };

  const handleLogout = () => {
    dispatch(authState.logout());
    setAnchorEl(null);
  };

  const handleSubmit = async (vals: any, props: any) => {
    const { validateForm, setSubmitting, setFieldError } = props;
    setSubmitting(true);
    await validateForm();

    if (vals.username !== user.username) {
      const respUser = await DrawerCounterApi.getInstance().checkUsername({
        username: vals.username,
      });
      if (respUser.found) {
        setFieldError("username", "Username already taken");
        setSubmitting(false);
        return;
      }
    }

    try {
      await new Promise(async (resolve, reject) => {
        let called = 0;

        const goodCallback = () => {
          called = -1;
        };

        const badCallback = () => {
          called = -2;
        };

        dispatch(
          updateUser({
            username: user.username!,
            data: { ...vals, password: vals.password || undefined },
            goodCallback,
            badCallback,
          })
        );

        while (called >= 0) {
          if (called > 50) {
            break;
          }
          await new Promise((r) => setTimeout(r, 100));

          if (called > -1) called++;
        }

        if (called === -1) {
          resolve("OK");
        }
        reject("An error has occured");
      });

      handleClose();
    } catch (e) {
      setFormError(e as string);
      return;
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box display="flex" alignItems="center">
      <Typography display="inline">Hello, {user.username}</Typography>
      <IconButton onClick={handleOpen}>
        <AccountCircleIcon />
      </IconButton>
      <Menu
        id="demo-positioned-menu"
        aria-labelledby="demo-positioned-button"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        <MenuItem onClick={handleUpdate}>Profile Settings</MenuItem>
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>
      <Dialog open={pwOpen} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle id="alert-dialog-title">Profile Settings</DialogTitle>
        <Formik
          initialValues={{ username: user.username, password: "" }}
          onSubmit={handleSubmit}
          validationSchema={updateValidation}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleSubmit,
            isSubmitting,
          }) => (
            <Form>
              <DialogContent>
                <FormControl fullWidth={true} sx={{ mt: 1 }}>
                  {/* UsernameField */}
                  <TextField
                    disabled={isSubmitting}
                    autoFocus
                    margin="dense"
                    id="username"
                    name="username"
                    label="Username"
                    error={!!errors.username && !!touched.username}
                    helperText={
                      errors.username && touched.username && errors.username
                    }
                    variant="outlined"
                    value={values.username}
                    onChange={handleChange}
                  />
                  {/* PasswordField */}
                  <>
                    <TextField
                      margin="dense"
                      id="password"
                      name="password"
                      label={"Password"}
                      error={!!errors.password && !!touched.password}
                      helperText={
                        errors.password && touched.password && errors.password
                      }
                      variant="outlined"
                      type="password"
                      value={values.password}
                      onChange={handleChange}
                    />
                  </>
                </FormControl>
                <Typography variant="subtitle1" color={red[500]}>
                  {formError}
                </Typography>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button
                  onClick={
                    handleSubmit as unknown as React.MouseEventHandler<HTMLButtonElement>
                  }
                  type="submit"
                >
                  Submit
                </Button>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </Dialog>
    </Box>
  );
}
