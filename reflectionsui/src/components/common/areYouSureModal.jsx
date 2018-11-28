import React, { Component } from "react";
import Modal from "react-responsive-modal";

class AreYouSureModal extends Component {
  render() {
    return (
      <Modal open={this.props.open} onClose={this.props.onClose} center>
        <h2>Are you sure?</h2>
        <p>{this.props.modalMessage}</p>
        <button className="btn btn-danger" onClick={this.props.onTrigger}>
          {this.props.triggerLabel}
        </button>
        <button
          className="btn btn-primary"
          style={{ marginLeft: "20px" }}
          onClick={this.props.onClose}
        >
          Cancel
        </button>
      </Modal>
    );
  }
}

export default AreYouSureModal;
