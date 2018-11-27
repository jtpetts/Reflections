import React, { Component } from "react";
import Table from "./common/table";
import { Link } from "react-router-dom";
//import AuthService from "./../services/authService";

class ImagesTable extends Component {
  render() {
    const columns = [
      {
        label: "Name",
        key: "name",
        content: image => (
          <Link
            to={
              image.isImageOnly
                ? `/mapForm/New?imageFilename=${image.imageFilename}`
                : `/mapForm/${image._id}`
            }
          >
            {image.isImageOnly ? "Create Map Entry" : image.name}
          </Link>
        )
      },
      { label: "Image Filename", path: "imageFilename" },
      { label: "Hot Spot Count", path: "hotSpotCount" },
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
