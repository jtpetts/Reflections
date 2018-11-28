import React, { Component } from "react";
import Background from "./../../images/Sunset.jpg";

class SummarySection extends Component {
  render() {
    return (
      <section
        className="fullSection"
        style={{ backgroundImage: `url(${Background})` }}
      >
        <div className="fullSection centeredSectionText">
          <center>
            <h2>Reflections of the Lost</h2>
            <font style={{ fontSize: "130%" }}>
              <p>
                Ever meet faeries when you were a small child? Sophie did. She
                has seen them many times since, but they have been too skittish
                about her approaches.
              </p>
              <p>
                That is, until nightmarish fey kidnap a neighbor child. One she
                babysat often. Now, pursued by the same fey, she enters a
                dangerous world where faeries fear knife wielding creatures that
                can command the very earth she walks upon.
              </p>
              <p>
                She must avoid their curses, their attempts to steal her person
                and her memories all to rescue a small child that no one, not
                even her parents, knows is missing.
              </p>
            </font>
          </center>
        </div>
      </section>
    );
  }
}

export default SummarySection;
