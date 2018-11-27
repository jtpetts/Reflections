import React from "react";
import Joi from "joi-browser";
import { toast } from "react-toastify";
import authService from "../services/authService";
import Form from "./common/form";

class LoginForm extends Form {
  state = {
    data: { username: "", password: "" },
    errors: {}
  };

  schema = {
    username: Joi.string()
      .email()
      .required()
      .label("Username"),
    password: Joi.string()
      .alphanum()
      .min(3)
      .max(50)
      .required()
      .label("Password")
  };

  doSubmit = async () => {
    // call server, login!
    try {
      await authService.login(
        this.state.data.username,
        this.state.data.password
      );

      this.props.onSuccessfulLogin();
    } catch (ex) {
      if (ex.response && ex.response.status >= 400) {
        const errors = { ...this.state.errors };
        errors.username = ex.response.data;
        this.setState({ errors });

        toast.error(ex.response.data);
      }
    }
  };

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          {this.renderInput("Username", "username")}
          {this.renderInput("Password", "password", "password")}
          {this.renderSubmitButton("Login")}
        </form>
      </div>
    );
  }
}

export default LoginForm;
