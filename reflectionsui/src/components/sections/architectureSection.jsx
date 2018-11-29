import React, { Component } from "react";

class architectureSection extends Component {
  state = {};
  render() {
    return (
      <section
        className="aboutSection"
        style={{ backgroundColor: "#333A4C", color: "white" }}
      >
        <div>
          <center style={{ marginBottom: "20px" }}>
            <h4>This site was built with love for faeries and adventure.</h4>
          </center>
          <ul
            style={{
              maxWidth: "400px",
              margin: "auto",
              textAlign: "left"
            }}
          >
            <li>The frontend is JavaScript with React.</li>
            <li>The backend is JavaScript powered by NodeJS.</li>
            <li>Visual Studio Code is the editor.</li>
            <li>The database is MongoDB.</li>
            <li>Unit testing is performed with Jest.</li>
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
      </section>
    );
  }
}

export default architectureSection;
