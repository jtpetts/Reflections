import React, { Component } from "react";
import Table from "./common/table";
import { Link } from "react-router-dom";
//import AuthService from "./../services/authService";

class HotSpotsTable extends Component {
  render() {
    const columns = [
      {
        label: "Name",
        content: hotSpot =>
          this.props.mapId ? (
            <Link
              to={`/hotSpotForm/${this.props.mapId}/hotSpot/${hotSpot._id}`}
            >
              {hotSpot.name}
            </Link>
          ) : (
            ""
          )
      },
      {
        label: "Set Coordinates",
        key: "Coordinates",
        content: hotSpot => (
          <button
            onMouseOver={() => this.props.onSetCoordinatesMouseOver(hotSpot)}
            onMouseLeave={() => this.props.onSetCoordinatesMouseLeave(hotSpot)}
            onClick={() => this.props.onSetCoordinatesClick(hotSpot)}
            className={
              this.props.coordsTrackingHotSpot &&
              hotSpot._id === this.props.coordsTrackingHotSpot._id
                ? "btn btn-success"
                : "btn btn-primary"
            }
          >
            Set Coordinates
          </button>
        )
      },
      {
        label: "Zoom?",
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
        label: "Delete?",
        key: "Delete",
        content: hotSpot => (
          <button
            className="btn btn-danger"
            onClick={() => this.props.onDelete(hotSpot)}
          >
            Delete
          </button>
        )
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

export default HotSpotsTable;
