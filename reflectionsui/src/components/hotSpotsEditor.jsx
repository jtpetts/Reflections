import React, { Component } from "react";
import { Link } from "react-router-dom";
import _ from "lodash";
import MapsService from "../services/mapsService";
import HotSpotsService from "../services/hotSpotsService";
import Images from "../services/imageService";
import HotSpotsTable from "./hotSpotsTable";
import Paginator from "./common/paginator";
import Circle from "./common/circle";
import { circleRadius } from "../config";

//https://moduscreate.com/blog/animated_drag_and_drop_with_react_native/

class HotSpotsEditor extends Component {
  state = {
    activePage: 0,
    pageSize: 5,
    sortColumn: { path: "Name", order: "asc" },
    maps: [],
    map: { name: "", hotSpots: [] },
    circleCoords: { x: 0, y: 0 },
    coordsTrackingOn: false,
    coordsTrackingHotSpot: null,
    zoomUpId: ""
  };

  async componentDidMount() {
    const maps = await MapsService.getMaps();
    this.setState({ maps });

    this.initToCurrentMap(maps, this.props.match.params.id);
  }

  async componentWillReceiveProps(nextProps) {
    if (this.state && this.state.maps)
      // skip this the first time in
      this.initToCurrentMap(this.state.maps, nextProps.match.params.id);
  }

  initToCurrentMap = (maps, id) => {
    try {
      const map = maps.find(m => m._id === id);
      if (!map) {
        this.props.history.replace("/notfound");
        return;
      }

      console.log("map x", map);

      map.hotSpots.map(h => (h.mapId = id));
      this.setState({ map });

      const zoomUpMap = maps.find(m =>
        m.hotSpots.find(h => h.zoomName === map.name)
      );

      this.setState({ zoomUpId: zoomUpMap ? zoomUpMap._id : "" });
    } catch (ex) {
      console.log("ex", ex);
      this.props.history.replace("/notfound");
    }
  };

  onMouseMove(event) {
    // var domrect = this.refs.element.getBoundingClientRect();
    // this.props.onMouseMove(event.clientX - domrect.left, event.clientY - domrect.top);
  }

  handleImageClick = async event => {
    if (this.state.coordsTrackingOn && this.state.coordsTrackingHotSpot) {
      const myLeft = event.clientX - this.refs.image.x;
      const myTop = event.clientY - this.refs.image.y;

      const hotSpot = {
        _id: this.state.coordsTrackingHotSpot._id,
        name: this.state.coordsTrackingHotSpot.name,
        description: this.state.coordsTrackingHotSpot.description,
        zoomName: this.state.coordsTrackingHotSpot.zoomName,
        zoomId: this.state.coordsTrackingHotSpot.zoomId,
        x: myLeft,
        y: myTop
      };

      // this.setState({
      //   positioning: `mouse: (${event.clientX},${
      //     event.clientY
      //   }  computed: (${myLeft},${myTop}))`
      // });

      await HotSpotsService.save(this.state.map._id, hotSpot);

      this.setState({ coordsTrackingHotSpot: hotSpot });

      // copy map, including all of the hot spots but the changed one
      const new_map = {
        ...this.state.map
      };

      // console.log("new_map", new_map);
      new_map.hotSpots = this.state.map.hotSpots.filter(
        h => h._id !== hotSpot._id
      );

      new_map.hotSpots.push(hotSpot);
      this.setState({ map: new_map });

      var divimage = this.refs.divImage.getBoundingClientRect();

      // the coordinates are relative to the image
      // the circle is relative to the column div bounding both
      const xOffset = this.refs.image.x - divimage.x;
      const yOffset = this.refs.image.y - divimage.y;

      if (hotSpot.x && hotSpot.y)
        this.setState({
          circleCoords: {
            x: hotSpot.x - circleRadius + xOffset,
            y: hotSpot.y - circleRadius + yOffset
          }
        });
    }
  };

  handleCoordinatesMouseOver = hotSpot => {
    var divimage = this.refs.divImage.getBoundingClientRect();

    // the coordinates are relative to the image
    // the circle is relative to the column div bounding both
    const xOffset = this.refs.image.x - divimage.x;
    const yOffset = this.refs.image.y - divimage.y;

    if (hotSpot.x && hotSpot.y)
      this.setState({
        circleCoords: {
          x: hotSpot.x - circleRadius + xOffset,
          y: hotSpot.y - circleRadius + yOffset
        }
      });
    else
      this.setState({
        circleCoords: { x: 0, y: 0 }
      });
  };

  handleSetCoordinates = hotSpot => {
    if (this.state.coordsTrackingHotSpot) {
      // turn off other one
    }

    this.setState({ coordsTrackingOn: true, coordsTrackingHotSpot: hotSpot });
  };

  handleZoomDownClick = hotSpot => {
    this.props.history.push(`/hotspotseditor/${hotSpot.zoomId}`);
  };

  handleZoomUp = async () => {
    this.props.history.push(`/hotspotseditor/${this.state.zoomUpId}`);
  };

  handlePageChange = activePage => {
    this.setState({ activePage });
  };

  handleSort = sortColumn => {
    this.setState({ sortColumn });
  };

  getPagedData = () => {
    const sortedHotSpots = _.sortBy(this.state.map.hotSpots, "name", "asc");

    // filters, pages, and sorts the hot spots
    const start = this.state.activePage * this.state.pageSize;

    const pagedHotSpots = _.slice(
      sortedHotSpots,
      start,
      start + this.state.pageSize
    );

    if (this.state.map)
      return {
        itemCount: this.state.map.hotSpots.length,
        hotSpots: pagedHotSpots
      };
    else return { itemCount: 0, hotSpots: [] };
  };

  render() {
    //http://localhost:3001/hotspoteditor/5bd25fdcbfa01e6d10d738ba
    const name = this.state.map ? this.state.map.name : "no map!";
    const imageFilename = this.state.map ? this.state.map.imageFilename : "";
    const image = Images.get(imageFilename);

    const { itemCount, hotSpots } = this.getPagedData();

    return (
      <React.Fragment>
        <div ref="element" style={{ border: "1px solid red" }}>
          <div className="row">
            <div className="col">
              <h2>Hot Spots for {this.state.map.name}</h2>
            </div>
          </div>
          <div className="row">
            <div className="row">
              <div
                ref="divImage"
                className="col"
                style={{ border: "1px solid red" }}
              >
                <img
                  ref="image"
                  style={{ border: "1px solid red" }}
                  src={image}
                  alt={name}
                  width={500}
                  onMouseMove={this.onMouseMove}
                  onClick={this.handleImageClick}
                />
                <Circle
                  left={this.state.circleCoords.x}
                  top={this.state.circleCoords.y}
                />
              </div>
              <div className="col">
                <HotSpotsTable
                  hotSpots={hotSpots}
                  onLike={this.handleLike}
                  onDelete={this.handleDelete}
                  onSort={this.handleSort}
                  sortColumn={this.state.sortColumn}
                  onCoordinatesMouseOver={this.handleCoordinatesMouseOver}
                  onSetCoordinatesClick={this.handleSetCoordinates}
                  onZoomDownClick={this.handleZoomDownClick}
                />
                <Paginator
                  itemCount={itemCount}
                  pageSize={this.state.pageSize}
                  activePage={this.state.activePage}
                  onPageChange={this.handlePageChange}
                />
                <div className="row">
                  <div className="col">
                    <h3>
                      <Link
                        className="badge badge-primary"
                        to={`/hotSpotForm/${this.state.map._id}/hotSpot/New`}
                      >
                        New Hot Spot
                      </Link>
                      {this.state.zoomUpId && (
                        <button
                          className="btn btn-primary"
                          onClick={this.handleZoomUp}
                        >
                          Zoom Up
                        </button>
                      )}
                    </h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default HotSpotsEditor;
