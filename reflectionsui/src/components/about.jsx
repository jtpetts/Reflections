import React, { Component } from "react";
import AboutSection from "./sections/aboutSection";
import AdminLoginSection from "./sections/adminLoginSection";
import ArchitectureSection from "./sections/architectureSection";
import GuestLoginSection from "./sections/guestLoginSection";

class About extends Component {
  render() {
    return (
      <React.Fragment>
        <AboutSection />
        <ArchitectureSection />
        <GuestLoginSection />
        <AdminLoginSection />
      </React.Fragment>
    );
  }
}

export default About;
