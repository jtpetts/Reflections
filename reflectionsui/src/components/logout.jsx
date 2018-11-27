import React, { Component } from "react";
import AuthService from "../services/authService";

class Logout extends Component {
  handleLogout = async () => {
    AuthService.logout();
    window.location = "/";
  };

  render() {
    return (
      <div>
        <p>Thank you for your visit!</p>
        <button className="btn btn-primary" onClick={this.handleLogout}>
          Logout
        </button>
      </div>
    );
  }
}

export default Logout;
