import React, { Component } from "react";
import MapsService from "../services/mapsService";
import Images from "../services/imageService";
import AuthService from "../services/authService";
import Info from "./info";
import Annotator from "./annotator";
import VisibleHotSpot from "./visibleHotSpot";
import TutorialTip from "./tutorialTip";
import { mapWidth, topMap } from "../config";
import localStorageService from "../services/localStorageService";

class Maps extends Component {
  state = {
    map: {},
    // imageOffset: { x: 0, y: 0 },
    breadCrumbs: [],
    isAnnotationOn: true
  };

  async componentDidMount() {
    const maps = await MapsService.getMaps();
    this.setState({ maps });

    await this.initMap(maps, this.props.match.params.mapName);
  }

  async componentWillReceiveProps(nextProps) {
    await this.initMap(this.state.maps, nextProps.match.params.mapName);
  }

  initMap = (maps, mapName) => {
    if (!mapName) mapName = topMap;

    const map = maps.find(m => m.name === mapName);
    const breadCrumbs = this.locateBreadcrumbs(maps, map);

    this.setState({ breadCrumbs, map, selectedHotSpot: null });
  };

  findHotSpotWithZoomName = searchMapName => {
    return function findHotSpot(map) {
      const hotSpot = map.hotSpots.find(h => h.zoomName === searchMapName);
      return hotSpot ? map.name : false;
    };
  };

  locateBreadcrumbs = (maps, map) => {
    let searchMapName = map.name;
    const breadCrumbs = [];

    let parent;
    do {
      parent = maps.find(this.findHotSpotWithZoomName(searchMapName));
      if (parent) {
        breadCrumbs.push(parent.name);
        searchMapName = parent.name;
      }
      if (breadCrumbs.length > 10) break;
    } while (parent);

    breadCrumbs.reverse(); // visually best with top of tree on the top
    return breadCrumbs;
  };

  handleBreadCrumb = breadCrumb => {
    localStorageService.countZoomOutClick();
    this.props.history.push(`/maps/${breadCrumb}`);
  };

  handleEdit = () => {
    this.props.history.push(`/mapform/${this.state.map._id}`);
  };

  handleZoomClick = hotSpot => {
    this.props.history.push(`/maps/${hotSpot.zoomName}`);
  };

  handleAnnotatorClick = () => {
    this.setState({ isAnnotationOn: !this.state.isAnnotationOn });
  };

  computeDistance(x1, y1, x2, y2) {
    return Math.abs(Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2)));
  }

  findClosestHotspot(inX, inY) {
    var closestDist = 10000;
    var closestHotspot;

    this.state.map.hotSpots.forEach(hotspot => {
      var dist = this.computeDistance(hotspot.x, hotspot.y, inX, inY);
      if (dist < closestDist) {
        closestDist = dist;
        closestHotspot = hotspot;
      }
    });

    if (closestDist < 100) return closestHotspot;
    return null;
  }

  handleMouseClick = event => {
    // put up the info message if there is a close enough hotspot
    // clear the info if there is not
    const rect = this.refs.image.getBoundingClientRect();
    const imageCorner = {
      x: rect.x ? rect.x : rect.left, // browser compatibility, IE doesn't have x,y
      y: rect.y ? rect.y : rect.top
    };

    const closestHotspot = this.findClosestHotspot(
      event.clientX - imageCorner.x,
      event.clientY - imageCorner.y
    );

    // if clicked on same one, clear it
    if (closestHotspot === this.state.selectedHotSpot)
      this.setState({ selectedHotSpot: null });
    else this.setState({ selectedHotSpot: closestHotspot });

    // if the item is a zoom, zoom instead of showing info
    // if (closestHotspot)
    //   if (closestHotspot.zoomId)
    //     this.props.history.push(`/maps/${closestHotspot.zoomName}`);

    // clear tutorial tool tips
    if (closestHotspot) {
      if (closestHotspot.zoomId) localStorageService.countZoomInClick();
      else localStorageService.countDetailClick();
    }
  };

  render() {
    const name = this.state.map.name
      ? this.state.map.name
      : "Loading maps, please wait.";
    const imageFilename = this.state.map ? this.state.map.imageFilename : "";
    const image = Images.get(imageFilename);

    const user = AuthService.getCurrentUser();
    const showAnnotations =
      this.state.isAnnotationOn && this.state.map.hotSpots;

    return (
      <div className="justify-content-center richBlue fullHeight">
        <div className="row">
          <div className="col">
            <h2 className="text-center">{name}</h2>
          </div>
        </div>
        <div className="row">
          <div className="col centeredSingleColumn">
            <div className="relativeBasis">
              <img
                ref="image"
                src={image}
                alt={"Map"}
                width={mapWidth}
                onClick={this.handleMouseClick}
              />
              <Info
                onZoomClick={this.handleZoomClick}
                hotspot={this.state.selectedHotSpot}
              />
              {showAnnotations &&
                this.state.map.hotSpots.map(h => (
                  <VisibleHotSpot key={h._id} hotspot={h} />
                ))}
              {showAnnotations &&
                this.state.map.hotSpots.map(h => (
                  <TutorialTip
                    key={h._id}
                    type={h.zoomId ? "zoomIn" : "details"}
                    target={h}
                  />
                ))}
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col text-center">{this.state.map.description}</div>
        </div>
        <div className="row">
          <div className="col centeredSingleColumn">
            <div ref="breadcrumbRelative" className="relativeBasis">
              {this.state.breadCrumbs.map(b => (
                <React.Fragment key={b}>
                  <button
                    className="btn btn-primary btn-sm buttonSpacing lowerSpacing"
                    onClick={() => this.handleBreadCrumb(b)}
                  >
                    {b}
                  </button>
                </React.Fragment>
              ))}
              {this.state.breadCrumbs.length > 0 && (
                <TutorialTip type="zoomOut" target={{ x: 120, y: 15 }} />
              )}
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col centeredSingleColumn">
            {user && (
              <button
                className="btn btn-primary btn-sm"
                onClick={this.handleEdit}
              >
                Edit
              </button>
            )}
            <Annotator
              className={user ? "buttonSpacing" : ""}
              onClick={this.handleAnnotatorClick}
              isAnnotationOn={this.state.isAnnotationOn}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default Maps;
