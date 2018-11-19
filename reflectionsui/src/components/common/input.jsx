import React, { Component } from "react";

class CInput extends Component {
  render() {
    // props: can yank down all the standard input fields
    // really, we want to have handlechange here set the state above.
    // but handle change can only edit that state variable if its above
    // need to do something with AutoFocus
    // default type to text?
    const { name, label, error, ...rest } = this.props;

    return (
      <div className="form-group">
        <label htmlFor={name}>{label}</label>
        <input {...rest} name={name} id={name} className="form-control" />
        {error && <div className="alert alert-danger">{error}</div>}
      </div>
    );
  }
}

export default CInput;
