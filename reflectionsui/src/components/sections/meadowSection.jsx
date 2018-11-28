import React, { Component } from "react";
import Background from "./../../images/Meadow.jpg";

class MeadowSection extends Component {
  render() {
    return (
      <section
        className="fullSection"
        style={{
          backgroundImage: `url(${Background})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "100% 100%"
        }}
      >
        <div
          className="fullHeight"
          style={{
            display: "flex",
            paddingLeft: "10%",
            paddingRight: "10%"
          }}
        >
          <div style={{ color: "white" }}>
            <h2>The Meadow</h2>
            <p>Inspiration for the meadow in Eiserune.</p>
          </div>
        </div>
      </section>
    );
  }
}

export default MeadowSection;
