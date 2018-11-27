import React, { Component } from "react";
import { Link } from "react-router-dom";
import _ from "lodash";
import MapsService from "../services/mapsService";
import HotSpotsService from "../services/hotSpotsService";
import Images from "../services/imageService";
import HotSpotsTable from "./hotSpotsTable";
import Paginator from "./common/paginator";
import Pointer from "./common/pointer";
import AreYouSureModal from "./common/areYouSureModal";
import { pointerHotX, pointerHotY } from "../config";

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
    zoomUpId: "",
    showCircle: false,
    showDeleteModal: false,
    deleteModalMessage: "",
    hotSpotToDelete: null
  };

  async componentDidMount() {
    // download all of the maps the first time in
    const maps = await MapsService.getMaps();
    this.setState({ maps });

    this.initToCurrentMap(maps, this.props.match.params.id);
  }

  async componentWillReceiveProps(nextProps) {
    // skip this the first time in
    if (nextProps.match.params.id !== this.props.match.params.id)
      this.initToCurrentMap(this.state.maps, nextProps.match.params.id);
  }

  initToCurrentMap = (maps, id) => {
    try {
      const map = maps.find(m => m._id === id);
      if (!map) {
        this.props.history.replace("/notfound");
        return;
      }

      // find the current map
      map.hotSpots.map(h => (h.mapId = id));
      this.setState({ map });

      // find the parent's map
      const zoomUpMap = maps.find(m =>
        m.hotSpots.find(h => h.zoomName === map.name)
      );
      this.setState({ zoomUpId: zoomUpMap ? zoomUpMap._id : "" });

      // circle
      this.setState({ showCircle: false });
    } catch (ex) {
      console.log("ex", ex);
      this.props.history.replace("/notfound");
    }
  };

  handleImageClick = async event => {
    if (this.state.coordsTrackingOn && this.state.coordsTrackingHotSpot) {
      const myLeft = event.clientX - this.refs.image.x;
      const myTop = event.clientY - this.refs.image.y;

      // rebuild the hotSpot (dropping __v, which confuses the API, maybe should move to map/hs service)
      const hotSpot = {
        _id: this.state.coordsTrackingHotSpot._id,
        name: this.state.coordsTrackingHotSpot.name,
        description: this.state.coordsTrackingHotSpot.description,
        zoomName: this.state.coordsTrackingHotSpot.zoomName,
        zoomId: this.state.coordsTrackingHotSpot.zoomId,
        x: myLeft,
        y: myTop
      };

      await HotSpotsService.save(this.state.map._id, hotSpot);

      const new_map = this.copyMapWithoutHotSpot(hotSpot);

      new_map.hotSpots.push(hotSpot);
      const maps = this.replaceMapInMaps(new_map);
      this.setState({
        map: new_map,
        maps,
        coordsTrackingOn: false,
        coordsTrackingHotSpot: null
      });

      this.positionCircle(hotSpot);
    }
  };

  copyMapWithoutHotSpot = hotSpot => {
    const map = {
      ...this.state.map
    };

    map.hotSpots = this.state.map.hotSpots.filter(h => h._id !== hotSpot._id);
    return map;
  };

  replaceMapInMaps = map => {
    const maps = this.state.maps.filter(m => m._id !== map._id);
    maps.push(map);
    return maps;
  };

  handleSetCoordsBtnMouseOver = hotSpot => {
    this.positionCircle(hotSpot);
  };

  positionCircle = hotSpot => {
    var divimage = this.refs.divImage.getBoundingClientRect();

    // the coordinates are relative to the image
    // the circle is relative to the column div bounding both
    const xOffset = this.refs.image.x - divimage.x;
    const yOffset = this.refs.image.y - divimage.y;

    if (hotSpot.x && hotSpot.y)
      this.setState({
        circleCoords: {
          x: hotSpot.x - pointerHotX + xOffset,
          y: hotSpot.y - pointerHotY + yOffset
        },
        showCircle: true
      });
    else
      this.setState({
        circleCoords: { x: 0, y: 0 },
        showCircle: false
      });
  };

  handleSetCoordinates = hotSpot => {
    this.setState({ coordsTrackingOn: true, coordsTrackingHotSpot: hotSpot });
  };

  handleZoomDownClick = hotSpot => {
    this.props.history.push(`/hotspotseditor/${hotSpot.zoomId}`);
  };

  handleZoomUp = async () => {
    this.props.history.push(`/hotspotseditor/${this.state.zoomUpId}`);
  };

  handleCloseDeleteModal = () => {
    this.setState({ showDeleteModal: false });
  };

  handleDeleteWarning = async hotSpot => {
    this.setState({
      showDeleteModal: true,
      deleteModalMessage: `Are you sure you wish to delete ${
        hotSpot.name
      } on map ${this.state.map.name}?`,
      hotSpotToDelete: hotSpot
    });
  };

  handleDelete = async () => {
    // actually delete

    const originalMap = this.state.map;
    const originalMaps = this.state.maps;

    const map = this.copyMapWithoutHotSpot(this.state.hotSpotToDelete);

    // replace the map in the maps list
    this.setState({
      showDeleteModal: false,
      map,
      maps: this.replaceMapInMaps(map)
    });

    try {
      await HotSpotsService.deleteHotSpot(
        map._id,
        this.state.hotSpotToDelete._id
      );
    } catch (ex) {
      // restore
      this.setState({ map: originalMap, maps: originalMaps });
    }
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
    const name = this.state.map ? this.state.map.name : "no map!";
    const imageFilename = this.state.map ? this.state.map.imageFilename : "";
    const image = Images.get(imageFilename);

    const { itemCount, hotSpots } = this.getPagedData();

    return (
      <React.Fragment>
        <div ref="element">
          <div className="row">
            <div className="col">
              <h2>Hot Spots for {this.state.map.name}</h2>
            </div>
          </div>
          <div className="row">
            <div className="row">
              <div ref="divImage" className="col">
                <img
                  ref="image"
                  src={image}
                  alt={name}
                  width={320}
                  onMouseMove={this.onMouseMove}
                  onClick={this.handleImageClick}
                />
                <div
                  style={{
                    position: "absolute",
                    left: this.state.circleCoords.x,
                    top: this.state.circleCoords.y,
                    opacity: 0.7,
                    pointerEvents: "none",
                    display: this.state.showCircle ? "block" : "none"
                  }}
                >
                  <Pointer />
                </div>
              </div>
              <div className="col">
                <HotSpotsTable
                  hotSpots={hotSpots}
                  mapId={this.state.map ? this.state.map._id : null}
                  onDelete={this.handleDeleteWarning}
                  onSort={this.handleSort}
                  sortColumn={this.state.sortColumn}
                  onCoordinatesMouseOver={this.handleSetCoordsBtnMouseOver}
                  onSetCoordinatesClick={this.handleSetCoordinates}
                  coordsTrackingHotSpot={this.state.coordsTrackingHotSpot}
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
          <AreYouSureModal
            open={this.state.showDeleteModal}
            onClose={this.handleCloseDeleteModal}
            onTrigger={this.handleDelete}
            triggerLabel="Delete"
            modalMessage={this.state.deleteModalMessage}
          />
        </div>
      </React.Fragment>
    );
  }
}

export default HotSpotsEditor;
