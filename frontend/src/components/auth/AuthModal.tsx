import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  TextField,
} from "@mui/material";
import { Form, Formik, FormikHelpers } from "formik";
import * as Yup from "yup";

import { userLogin, userRegister } from "../../redux/slices/auth";
import DrawerCounterApi from "../../api/DrawerCounterApi";
import { useAppDispatch } from "../../hooks/useApp";
import { useState } from "react";

export default function AuthModal() {
  const dispatch = useAppDispatch();
  const [page, setPage] = useState<number>(0);

  const api = DrawerCounterApi.getInstance();

  const validation = Yup.object().shape({
    username: Yup.string()
      .required("Required")
      .matches(/^(?=[a-zA-Z0-9._]{4,30}$)(?!.*[_.]{2})[^_.].*[^_.]$/, {
        message: "Must be between 4-30 alphanumerics and . _",
      }),
    loginPassword: Yup.string(),
    registerPassword: Yup.string().matches(/^(?=.*[a-z])(?=.*\d)[a-z\d]{8,64}$$/i, {
      message:
        "Password must be at least 8 digits and include at least one letter and one number",
    }),
  });

  const handleBack = () => {
    setPage(0);
  };

  const handleUsernameSubmit = async (
    data: {
      username: string;
      loginPassword: string;
      registerPassword: string;
    },
    props: FormikHelpers<{
      username: string;
      loginPassword: string;
      registerPassword: string;
    }>
  ) => {
    const { setFieldError, setTouched, validateField } = props;

    validateField("username");

    api
      .checkUsername(data)
      .then((resp) => {
        if (resp.found) {
          if (resp.password) {
            setPage(1);
          } else {
            handleLogin(data, props);
          }
        } else setPage(2);
      })
      .catch((errors) => {
        setFieldError(
          "username",
          "Connection problem, try again later or contact admin"
        );
      });
  };

  const handleLogin = async (
    vals: {
      username: string;
      loginPassword: string;
      registerPassword: string;
    },
    {
      setFieldError,
      validateField,
    }: FormikHelpers<{
      username: string;
      loginPassword: string;
      registerPassword: string;
    }>
  ) => {
    validateField("loginPassword");
    dispatch(userLogin({ username: vals.username, password: vals.loginPassword }));
  };

  const handleRegister = async (vals: {
    username: string;
    loginPassword: string;
    registerPassword: string;
  }) => {
    dispatch(
      userRegister({
        username: vals.username,
        password: vals.registerPassword || undefined,
      })
    );
  };

  const handleFormSubmit = async (
    vals: {
      username: string;
      loginPassword: string;
      registerPassword: string;
    },
    props: FormikHelpers<{
      username: string;
      loginPassword: string;
      registerPassword: string;
    }>
  ) => {
    props.setSubmitting(true);
    switch (page) {
      case 0:
        await handleUsernameSubmit(vals, props);
        break;
      case 1:
        handleLogin(vals, props);
        break;
      case 2:
        handleRegister(vals);
        break;
    }
    props.setSubmitting(false);
  };

  return (
    <Dialog
      open={true}
      maxWidth="md"
      fullWidth
      BackdropProps={{
        style: {
          backgroundColor: "transparent",
        },
      }}
    >
      <DialogTitle id="alert-dialog-title">Welcome to Drawer Counter</DialogTitle>
      <Formik
        initialValues={{ username: "", loginPassword: "", registerPassword: "" }}
        onSubmit={handleFormSubmit}
        validationSchema={validation}
      >
        {({ values, errors, touched, handleChange, handleSubmit, isSubmitting }) => (
          <Form>
            <DialogContent>
              <FormControl fullWidth={true} sx={{ mt: 1 }}>
                {/* UsernameInputField */}
                {page === 0 ? (
                  <TextField
                    disabled={isSubmitting}
                    autoFocus
                    id="username"
                    name="username"
                    label="Enter Username"
                    error={touched.username && Boolean(errors.username)}
                    helperText={touched.username && errors.username}
                    variant="filled"
                    value={values.username}
                    onChange={handleChange}
                  />
                ) : null}
                {/* PasswordField */}
                {page > 0 ? (
                  <TextField
                    autoFocus
                    id={page === 1 ? "loginPassword" : "registerPassword"}
                    name={page === 1 ? "loginPassword" : "registerPassword"}
                    label={"Enter Password" + (page === 2 ? " (optional)" : "")}
                    error={
                      (page === 1
                        ? errors.loginPassword && touched.loginPassword
                        : errors.registerPassword &&
                          touched.registerPassword) as boolean
                    }
                    helperText={
                      page === 1
                        ? errors.loginPassword &&
                          touched.loginPassword &&
                          errors.loginPassword
                        : errors.registerPassword &&
                          touched.registerPassword &&
                          errors.registerPassword
                    }
                    variant="filled"
                    type="password"
                    value={values[page === 1 ? "loginPassword" : "registerPassword"]}
                    onChange={handleChange}
                  />
                ) : null}
              </FormControl>
            </DialogContent>
            <DialogActions>
              {page > 0 ? <Button onClick={handleBack}>Back</Button> : null}
              <Button
                onClick={
                  handleSubmit as unknown as React.MouseEventHandler<HTMLElement>
                }
              >
                {page > 0 ? "Submit" : "Next"}
              </Button>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
}
