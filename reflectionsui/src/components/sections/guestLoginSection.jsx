import React, { Component } from "react";
import AuthService from "../../services/authService";

class GuestLoginSection extends Component {
  handleGuestLogin = async () => {
    await AuthService.login("guest@guest.com", "guest");
    window.location = "/maps";
  };
  render() {
    return (
      <section className="aboutSection" style={{ backgroundColor: "ivory" }}>
        <center>
          <p>
            The site features a full editor for the map descriptions and hot
            spots. The guest login provides read only access to the editor.
          </p>
          <button onClick={this.handleGuestLogin} className="btn btn-primary">
            Login as Guest
          </button>
        </center>
      </section>
    );
  }
}

export default GuestLoginSection;
