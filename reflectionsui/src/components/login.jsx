import React, { Component } from "react";
import AuthService from "../services/authService";

class Login extends Component {
  handleLogin = async () => {
    await AuthService.login("siby@gmail.com", "wierdisspelledwrong");
    window.location = "/maps";
  };

  render() {
    return (
      <button className="btn btn-primary" onClick={this.handleLogin}>
        Login
      </button>
    );
  }
}

export default Login;
