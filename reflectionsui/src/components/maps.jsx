import React, { Component } from "react";
import MapsService from "../services/mapsService";
import Images from "../services/imageService";
import AuthService from "../services/authService";
import Info from "./info";

class Maps extends Component {
  state = { map: {}, imageOffset: { x: 0, y: 0 } };

  async componentDidMount() {
    await this.initMap(this.props.match.params.mapName);
  }

  async componentWillReceiveProps(nextProps) {
    await this.initMap(nextProps.match.params.mapName);

    this.setState({ selectedHotSpot: null });
  }

  initMap = async mapName => {
    if (!mapName) mapName = "Two Cities"; // move to config

    const map = await MapsService.getMapByName(mapName);
    // if it failed to get the map go to not found
    this.setState({ map });
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
    const domrect = this.refs.element.getBoundingClientRect();

    this.setState({
      imageOffset: {
        x: this.refs.image.offsetLeft,
        y: this.refs.image.offsetTop
      }
    });

    const closestHotspot = this.findClosestHotspot(
      event.clientX - domrect.left - this.refs.image.offsetLeft,
      event.clientY - domrect.top - this.refs.image.offsetTop
    );

    if (closestHotspot != null)
      this.setState({ selectedHotSpot: closestHotspot });
  };

  render() {
    // image on left - fake image service
    // edit and new buttons on the right
    // use one of the layout thingies

    const name = this.state.map ? this.state.map.name : "no map!";
    const imageFilename = this.state.map ? this.state.map.imageFilename : "";
    const image = Images.get(imageFilename);

    const user = AuthService.getCurrentUser();

    return (
      <div ref="element">
        <div>
          <div className="row">
            <div className="col">
              <h2>{name}</h2>
              <span>
                <img
                  ref="image"
                  src={image}
                  alt={name}
                  width={500}
                  onClick={this.handleMouseClick}
                />
                <Info
                  style={{ pointerEvents: "none" }}
                  hotspot={this.state.selectedHotSpot}
                  offset={this.state.imageOffset}
                  onZoomClick={this.handleZoomClick}
                />
              </span>
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
