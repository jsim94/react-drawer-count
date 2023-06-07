import * as Yup from "yup";

export const authValidation = Yup.object().shape({
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

export const updateValidation = Yup.object().shape({
  username: Yup.string()
    .required("Required")
    .matches(/^(?=[a-zA-Z0-9._]{4,30}$)(?!.*[_.]{2})[^_.].*[^_.]$/, {
      message: "Must be between 4-30 alphanumerics and . _",
    }),
  password: Yup.string().matches(/^(?=.*[a-z])(?=.*\d)[a-z\d]{8,64}$$/i, {
    message:
      "Password must be at least 8 digits and include at least one letter and one number",
  }),
});
