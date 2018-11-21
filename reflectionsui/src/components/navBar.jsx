import React, { Component } from "react";
import { Link, NavLink } from "react-router-dom";
import AuthService from "../services/authService";

class NavBar extends Component {
  state = { isCollapsed: true };

  handleToggle = () => {
    this.setState({ isCollapsed: !this.state.isCollapsed });
  };

  render() {
    const classNavbar = this.state.isCollapsed
      ? "collapse navbar-collapse"
      : "collapse navbar-collapse show";
    const classToggleButton = this.state.isCollapsed
      ? "navbar-toggler navbar-toggler-right collapsed"
      : "navbar-toggler navbar-toggler-right";

    const user = AuthService.getCurrentUser();

    return (
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <Link className="navbar-brand" to="/">
          Reflections
        </Link>
        <button
          className={classToggleButton}
          onClick={this.handleToggle}
          type="button"
          data-toggle="collapse"
          data-target="#navbarNavAltMarkup"
          aria-controls="navbarNavAltMarkup"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div className={classNavbar} id="navbarNavAltMarkup">
          <div className="navbar-nav">
            <NavLink className="nav-item nav-link active" to="/">
              Home <span className="sr-only">(current)</span>
            </NavLink>
            <NavLink className="nav-item nav-link" to="/maps">
              Maps
            </NavLink>
            {user && (
              <NavLink className="nav-item nav-link" to="/images">
                Images
              </NavLink>
            )}
            <NavLink className="nav-item nav-link" to="/about">
              About
            </NavLink>
            {!user && (
              <NavLink className="nav-item nav-link" to="/login">
                Login
              </NavLink>
            )}
          </div>
        </div>
      </nav>
    );
  }
}

export default NavBar;
