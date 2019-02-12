import React, { Component } from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import MapsService from "../services/mapsService";
import AuthService from "../services/authService";
import localStorageService from "../services/localStorageService";
import imageBackArrow from "../images/arrow back.png";
import AnnotatedMap from "./annotatedMap";
import Annotator from "./annotator";
import Explorations from "./explorations";
import { topMap, mapWidth } from "../config";

class Maps extends Component {
  state = {
    map: {},
    breadCrumbs: [],
    isAnnotationOn: true,
    imageDim: 10
  };

  // When absolute positioning is used, divs lose their dimensions.
  // Compute the maximum width of the screen and force the div that holds the
  // image to a minimum width and height so the image will occupy space properly.
  // This dimension is also needed to properly place the hotspots on the image.
  updateDimensions = () => {
    if (this.refs.imageDiv) {
      const rect = this.refs.imageDiv.getBoundingClientRect();
      this.setState({ imageDim: rect.width });
    }
  };

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions);
  }

  async componentDidMount() {
    // store the image width, it shifts as the browser is resized. Force a re-render by changing state.
    this.updateDimensions();
    window.addEventListener("resize", this.updateDimensions);

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

    // add this map to the found list
    if (map._id) localStorageService.foundMap(map._id);
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

    breadCrumbs.reverse(); // visually best with top of tree first
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

  handleHotSpotClick = closestHotspot => {
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

    const user = AuthService.getCurrentUser();

    const imageDim =
      this.state.imageDim > mapWidth * 2 ? mapWidth * 2 : this.state.imageDim;

    return (
      <div className="justify-content-center richBlue fullWorld">
        <div className="row">
          <div className="col">
            <h2 className="text-center">{name}</h2>
            <Explorations
              mapCount={this.state.maps ? this.state.maps.length : 0}
            />
          </div>
        </div>
        <div className="row">
          <div className="col centeredSingleColumn" ref="imageDiv">
            <div
              style={{
                width: `${imageDim}px`,
                height: `${imageDim}px`
              }}
            >
              <TransitionGroup className="relativeBasis">
                <CSSTransition
                  key={this.state.map._id}
                  timeout={1000}
                  classNames="fade"
                >
                  <AnnotatedMap
                    map={this.state.map}
                    selectedHotSpot={this.state.selectedHotSpot}
                    onZoomClick={this.handleZoomClick}
                    onHotSpotClick={this.handleHotSpotClick}
                    isAnnotationOn={this.state.isAnnotationOn}
                    imageDim={imageDim}
                  />
                </CSSTransition>
              </TransitionGroup>
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
                <button
                  key={b}
                  className="btn btn-primary btn-sm zoomButton buttonSpacing lowerSpacing"
                  onClick={() => this.handleBreadCrumb(b)}
                >
                  <img src={imageBackArrow} alt="backArrow" />
                  <span className="tinySpacing">{b}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col centeredSingleColumn">
            {user && (
              <button
                className="btn btn-primary btn-sm lowerSpacing"
                onClick={this.handleEdit}
              >
                Edit
              </button>
            )}
            <Annotator
              className={user ? "buttonSpacing lowerSpacing" : ""}
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
