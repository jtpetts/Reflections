import React, { Component } from "react";
import Table from "./common/table";
import { Link } from "react-router-dom";
//import AuthService from "./../services/authService";

class MoviesTable extends Component {
  render() {
    const columns = [
      {
        label: "Name",
        content: hotSpot => (
          <Link to={`/hotSpotForm/${hotSpot.mapId}/hotSpot/${hotSpot._id}`}>
            {hotSpot.name}
          </Link>
        )
      },
      {
        key: "Coordinates",
        content: hotSpot => (
          <button
            onMouseOver={() => this.props.onCoordinatesMouseOver(hotSpot)}
            onClick={() => this.props.onSetCoordinatesClick(hotSpot)}
            className="btn btn-primary"
          >
            Set Coordinates
          </button>
        )
      },
      {
        key: "Zoom",
        content: hotSpot =>
          hotSpot.zoomName ? (
            <button
              className="btn btn-primary"
              onClick={() => this.props.onZoomDownClick(hotSpot)}
            >
              Zoom to {hotSpot.zoomName}
            </button>
          ) : (
            ""
          )
      },
      {
        key: "Delete",
        content: hotSpot => <button className="btn btn-danger">Delete</button>
      }
    ];

    return (
      <Table
        data={this.props.hotSpots}
        columns={columns}
        sortColumn={this.props.sortColumn}
        onSort={this.props.onSort}
      />
    );
  }
}

export default MoviesTable;
