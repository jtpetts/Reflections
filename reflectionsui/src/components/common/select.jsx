import React, { Component } from "react";

class Select extends Component {
  state = {};
  render() {
    const { name, label, error, ...rest } = this.props;

    return (
      <React.Fragment>
        <label>{label}</label>
        <div className="input-group mb-3">
          <select
            {...rest}
            id={name}
            name={name}
            className="custom-select"
            aria-label={`"Select of ${{ name }}"`}
          >
            <option value="">Choose...</option>
            {this.props.options.map(opt => (
              <option key={opt.id} value={opt.name}>
                {opt.name}
              </option>
            ))}
          </select>
        </div>
        {error && <div className="alert alert-danger">{error}</div>}
      </React.Fragment>
    );
  }
}

export default Select;
