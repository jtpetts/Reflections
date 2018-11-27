import React, { Component } from "react";
import AuthService from "../services/authService";
import LoginForm from "./loginForm";

class About extends Component {
  state = { showAdminLogin: false };

  handleGuestLogin = async () => {
    await AuthService.login("guest@guest.com", "guest");
    window.location = "/maps";
  };

  handleAdminLogin = () => {
    this.setState({ showAdminLogin: !this.state.showAdminLogin });
  };

  handleSuccessfulLogin = () => {
    const { state } = this.props.location;
    window.location = state ? state.from.pathname : "/";
  };

  render() {
    return (
      <React.Fragment>
        <div className="row">
          <div className="col w-100" style={{ backgroundColor: "ivory" }}>
            <center>
              <p>Reflections of the Lost</p>
              <p>A novel by John Petts and Sybil Harlow</p>
              <p>
                This site is an exploration of the locations featured in
                Sophie's adventure against the spriggans.
              </p>
            </center>
          </div>
        </div>
        <div className="row">
          <div className="col w-100" style={{ backgroundColor: "grey" }}>
            <p>This site was built with love for faeries and adventure.</p>
            <ul>
              <li>The frontend is JavaScript with REACT.</li>
              <li>The backend is JavaScript powered by NodeJS.</li>
              <li>The site was developed in Visual Studio Code.</li>
              <li>The database is MongoDB.</li>
              <li>Unit test performed with Jest.</li>
              <li>The site is hosted in Heroku.</li>
              <li>Sentry.IO provides client side error logging.</li>
              <li>
                <a
                  href="https://github.com/jtpetts/Reflections"
                  className="badge badge-primary"
                >
                  The source code for the site is available on GitHub.
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="row">
          <div className="col w-100" style={{ backgroundColor: "white" }}>
            <p>
              The site features a full editor for the map descriptions and hot
              spots. Guest access allows read only access to the editor.
            </p>
            <button onClick={this.handleGuestLogin} className="btn btn-primary">
              Guest Login
            </button>
          </div>
        </div>
        <div className="row">
          <div className="col w-100" style={{ backgroundColor: "ivory" }}>
            <p>Admin login is for authorized individuals only.</p>
            <button onClick={this.handleAdminLogin} className="btn btn-primary">
              Admin Login
            </button>

            {this.state.showAdminLogin && (
              <LoginForm onSuccessfulLogin={this.handleSuccessfulLogin} />
            )}
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default About;
