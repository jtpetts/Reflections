import React, { Component } from "react";

class architectureSection extends Component {
  render() {
    return (
      <section className="aboutSection richBlue">
        <div className="row">
          <div className="col">
            <center className="lowerSpacing">
              <h4>This site was built with love for faeries and adventure.</h4>
            </center>
          </div>
        </div>
        <div className="row justify-content-center">
          <div className="col centeredSingleColumn">
            <ul
              style={{
                margin: "auto",
                textAlign: "left",
                listStylePosition: "inside"
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
        </div>
      </section>
    );
  }
}

export default architectureSection;
