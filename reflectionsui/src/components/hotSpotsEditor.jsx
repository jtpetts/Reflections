import React, { Component } from "react";
import _ from "lodash";
import { toast } from "react-toastify";
import MapsService from "../services/mapsService";
import HotSpotsService from "../services/hotSpotsService";
import Images from "../services/imageService";
import HotSpotsTable from "./hotSpotsTable";
import Paginator from "./common/paginator";
import Pointer from "./common/pointer";
import AreYouSureModal from "./common/areYouSureModal";
import { mapWidth } from "../config";

//https://moduscreate.com/blog/animated_drag_and_drop_with_react_native/

class HotSpotsEditor extends Component {
  state = {
    activePage: 0,
    pageSize: 5,
    sortColumn: { path: "Name", order: "asc" },
    maps: [],
    map: { name: "", hotSpots: [] },
    hotSpotPointer: null,
    coordsTrackingOn: false,
    coordsTrackingHotSpot: null,
    zoomUpId: "",
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
      this.setState({ activePage: 0 });
    } catch (ex) {
      console.log("ex", ex);
      this.props.history.replace("/notfound");
    }
  };

  handleImageClick = async event => {
    if (this.state.coordsTrackingOn && this.state.coordsTrackingHotSpot) {
      try {
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
          coordsTrackingHotSpot: null,
          hotSpotPointer: hotSpot
        });
      } catch (ex) {
        this.toastException(ex);

        this.setState({
          coordsTrackingOn: false,
          coordsTrackingHotSpot: null,
          hotSpotPointer: null
        });
      }
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

  handleSetCoordsBtnMouseLeave = hotSpot => {
    if (!this.state.coordsTrackingOn) this.setState({ hotSpotPointer: null });
  };

  handleSetCoordsBtnMouseOver = hotSpot => {
    if (!this.state.coordsTrackingOn)
      this.setState({ hotSpotPointer: hotSpot });
  };

  handleSetCoordinates = hotSpot => {
    this.setState({ coordsTrackingOn: true, coordsTrackingHotSpot: hotSpot });
  };

  handleZoomDownClick = hotSpot => {
    this.props.history.push(`/hotspotseditor/${hotSpot.zoomId}`);
  };

  handleNewHotSpot = () => {
    this.props.history.push(`/hotSpotForm/${this.state.map._id}/hotSpot/New`);
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

  toastException = ex => {
    if (ex.response)
      if (ex.response.status >= 400 && ex.response.status < 500)
        toast.error(ex.response.data);
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
      this.toastException(ex);
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

    const showHotSpot = this.state.hotSpotPointer !== null;

    return (
      <React.Fragment>
        <div>
          <div className="row">
            <div className="col">
              <h2 className="text-center">
                Hot Spots for {this.state.map.name}
              </h2>
            </div>
          </div>
          <div className="row justify-content-center">
            <div className="row">
              <div className="col centeredSingleColumn">
                <div
                  className="relativeBasis"
                  style={{ width: mapWidth, height: mapWidth }}
                >
                  <img
                    ref="image"
                    src={image}
                    alt={name}
                    width={mapWidth}
                    onMouseMove={this.onMouseMove}
                    onClick={this.handleImageClick}
                  />
                  {showHotSpot && (
                    <Pointer
                      hotspot={this.state.hotSpotPointer}
                      type={this.state.hotSpotPointer.zoomId ? "zoom" : "info"}
                      size="pointer"
                    />
                  )}
                </div>
              </div>
              <div className="col">
                <HotSpotsTable
                  hotSpots={hotSpots}
                  mapId={this.state.map ? this.state.map._id : null}
                  onDelete={this.handleDeleteWarning}
                  onSort={this.handleSort}
                  sortColumn={this.state.sortColumn}
                  onSetCoordinatesMouseOver={this.handleSetCoordsBtnMouseOver}
                  onSetCoordinatesMouseLeave={this.handleSetCoordsBtnMouseLeave}
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
                    <button
                      className="btn btn-primary"
                      onClick={this.handleNewHotSpot}
                    >
                      New Hot Spot
                    </button>
                    {this.state.zoomUpId && (
                      <button
                        className="btn btn-primary buttonSpacing"
                        onClick={this.handleZoomUp}
                      >
                        Zoom Up
                      </button>
                    )}
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
