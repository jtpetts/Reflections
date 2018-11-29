import React, { Component } from "react";
import Background from "./../../images/Waterfall.png";

class AboutSection extends Component {
  state = {};
  render() {
    return (
      <section
        className="aboutSection"
        style={{ backgroundImage: `url(${Background})` }}
      >
        <center style={{ fontSize: "130%" }}>
          <h4>Reflections of the Lost</h4>
          <p>A novel by John Petts and Sybil Harlow</p>
          <p>
            This site is an exploration of the locations featured in Sophie's
            adventure against the spriggans.
          </p>
        </center>
      </section>
    );
  }
}

export default AboutSection;
