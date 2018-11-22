import React, { Component } from "react";
import Table from "./common/table";
//import AuthService from "./../services/authService";

class ImagesTable extends Component {
  render() {
    const columns = [
      { label: "Name", path: "name" },
      { label: "Image Filename", path: "imageFilename" },
      { label: "Hot Spot Count", path: "hotSpotCount" },
      {
        key: "Edit",
        content: image => (
          <button
            className="btn btn-primary"
            onClick={() => this.props.onEdit(image)}
          >
            Edit
          </button>
        )
      },
      {
        key: "Delete",
        content: image =>
          image.name ? ( // if no name, then there is no map to delete
            <button
              className="btn btn-danger"
              onClick={() => this.props.onDelete(image)}
            >
              Delete
            </button>
          ) : (
            ""
          )
      }
    ];
    return (
      <Table
        data={this.props.images}
        columns={columns}
        sortColumn={this.props.sortColumn}
        onSort={this.props.onSort}
      />
    );
  }
}

export default ImagesTable;
