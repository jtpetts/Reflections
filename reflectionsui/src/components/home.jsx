import React, { Component } from "react";
import SummarySection from "./sections/summarySection";
import MeadowSection from "./sections/meadowSection";

class Home extends Component {
  render() {
    return (
      <React.Fragment>
        <SummarySection />
        <MeadowSection />
      </React.Fragment>
    );
  }
}

export default Home;
