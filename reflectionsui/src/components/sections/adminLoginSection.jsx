import React, { Component } from "react";
import LoginForm from "./../loginForm";

class adminLoginSection extends Component {
  state = { showAdminLogin: false };

  handleAdminLogin = () => {
    this.setState({ showAdminLogin: !this.state.showAdminLogin });
  };

  handleSuccessfulLogin = () => {
    const { state } = this.props.location;
    window.location = state ? state.from.pathname : "/";
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

        {this.state.showAdminLogin && (
          <LoginForm onSuccessfulLogin={this.handleSuccessfulLogin} />
        )}
      </section>
    );
  }
}

export default adminLoginSection;
