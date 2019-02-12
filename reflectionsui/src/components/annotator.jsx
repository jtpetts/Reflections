import React, { Component } from "react";
import AnnotationOn from "./../images/annotation on.png";
import AnnotationOff from "./../images/annotation off.png";

class Annotator extends Component {
  render() {
    if (true)
      // disabling the annotator toggle for now
      return <React.Fragment />;

    return (
      <button
        className={this.props.className}
        style={{
          backgroundImage: this.props.isAnnotationOn
            ? `url(${AnnotationOn})`
            : `url(${AnnotationOff})`
        }}
        onClick={this.props.onClick}
      >
        A
      </button>
    );
  }
}

export default Annotator;
