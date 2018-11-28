import React, { Component } from "react";
import MapsService from "../services/mapsService";
import Images from "../services/imageService";
import AuthService from "../services/authService";
import Info from "./info";
import { mapWidth } from "../config";

class Maps extends Component {
  state = { map: {}, imageOffset: { x: 0, y: 0 }, breadCrumbs: [] };

  async componentDidMount() {
    const maps = await MapsService.getMaps();
    this.setState({ maps });

    await this.initMap(maps, this.props.match.params.mapName);
  }

  async componentWillReceiveProps(nextProps) {
    await this.initMap(this.state.maps, nextProps.match.params.mapName);
  }

  initMap = (maps, mapName) => {
    if (!mapName) mapName = "Two Cities"; // move to config

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
    this.props.history.push(`/maps/${breadCrumb}`);
  };

  handleEdit = () => {
    this.props.history.push(`/mapform/${this.state.map._id}`);
  };

  handleZoomClick = hotSpot => {
    this.props.history.push(`/maps/${hotSpot.zoomName}`);
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
    var divImageX = this.refs.imageXRelative.getBoundingClientRect();
    var divImageY = this.refs.imageYRelative.getBoundingClientRect();

    // the coordinates are relative to the image
    // the circle is relative to the column div bounding both
    const xOffset = this.refs.image.x - divImageX.x;
    const yOffset = this.refs.image.y - divImageY.y;

    this.setState({
      imageOffset: {
        x: this.refs.image.offsetLeft + xOffset,
        y: this.refs.image.offsetTop + yOffset
      }
    });

    const closestHotspot = this.findClosestHotspot(
      event.clientX - this.refs.image.x,
      event.clientY - this.refs.image.y
    );

    if (closestHotspot != null)
      this.setState({ selectedHotSpot: closestHotspot });
  };

  render() {
    // image on left - fake image service
    // edit and new buttons on the right
    // use one of the layout thingies

    const name = this.state.map.name
      ? this.state.map.name
      : "Loading maps, please wait.";
    const imageFilename = this.state.map ? this.state.map.imageFilename : "";
    const image = Images.get(imageFilename);

    const user = AuthService.getCurrentUser();

    return (
      <div>
        <div>
          <div ref="imageXRelative" className="row">
            <div className="col">
              <h2>{name}</h2>
              <div ref="imageYRelative" style={{ position: "relative" }}>
                <img
                  ref="image"
                  src={image}
                  alt={"Map"}
                  width={mapWidth}
                  onClick={this.handleMouseClick}
                />
                <Info
                  hotspot={this.state.selectedHotSpot}
                  offset={this.state.imageOffset}
                  onZoomClick={this.handleZoomClick}
                />
              </div>
            </div>
            <div className="col">
              {this.state.breadCrumbs.map(b => (
                <React.Fragment key={b}>
                  <button
                    className="btn btn-primary btn-sm"
                    style={{ marginBottom: "10px" }}
                    onClick={() => this.handleBreadCrumb(b)}
                  >
                    {b}
                  </button>
                  <br />
                </React.Fragment>
              ))}
            </div>
          </div>
          {user && (
            <div className="row">
              <div className="col">
                <button
                  className="btn btn-primary btn-sm"
                  onClick={this.handleEdit}
                >
                  Edit
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default Maps;
