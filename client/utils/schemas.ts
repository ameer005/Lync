import * as yup from "yup";

export const schemaSignup = yup.object().shape({
  name: yup.string().required("Please provide name"),
  username: yup.string().required("Please provide username"),
  email: yup.string().email().required("Please provide email"),
  password: yup.string().min(8, "Too short").required(),
});

export const schemaLogin = yup.object().shape({
  email: yup.string().email().required("Please provide email"),
  password: yup.string().required(),
});

export const schemaActivateAccount = yup.object().shape({
  code: yup.string().required("Please provide otp"),
});

export const schemaForgotPassword = yup.object().shape({
  email: yup.string().email().required("Please provide email"),
});

export const schemaValidateForgotPassword = yup.object().shape({
  code: yup.string().required("Please provide otp"),
  newPassword: yup.string().min(8, "Too short").required(),
});

export const schemaCreateRoom = yup.object().shape({
  title: yup.string().required("required field"),
});
