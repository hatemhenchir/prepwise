import React from "react";
import SigninForm from "./sign-in-form";
import RegisterForm from "./register-form";

interface AuthFormProps {
  type: "signin" | "register";
}

const AuthForm = ({ type }: AuthFormProps) => {
  if (type === "signin") {
    return <SigninForm />;
  }
  return <RegisterForm />;
};

export default AuthForm;
