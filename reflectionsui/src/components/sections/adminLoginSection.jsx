import React, { Component } from "react";
import LoginForm from "./../loginForm";

class adminLoginSection extends Component {
  state = { showAdminLogin: false };

  handleAdminLogin = () => {
    this.setState({ showAdminLogin: !this.state.showAdminLogin });
  };

  handleSuccessfulLogin = () => {
    window.location = "/maps";
  };

  render() {
    return (
      <section
        className="aboutSection"
        style={{ backgroundColor: "lightblue" }}
      >
        <center>
          <p>Admin login is for authorized individuals only.</p>

          <button onClick={this.handleAdminLogin} className="btn btn-primary">
            Admin Login
          </button>
        </center>
        <div className="row justify-content-center">
          <div className="col centeredSingleColumn">
            {this.state.showAdminLogin && (
              <LoginForm onSuccessfulLogin={this.handleSuccessfulLogin} />
            )}
          </div>
        </div>
      </section>
    );
  }
}

export default adminLoginSection;
