import React from "react";
import Joi from "joi-browser";
import _ from "lodash";
import Form from "./common/form";
import HotSpotsService from "../services/hotSpotsService";
import MapsService from "../services/mapsService";

class HotSpotForm extends Form {
  state = {
    data: { name: "", description: "", zoomName: "" },
    zoomableMaps: [],
    mapName: "",
    errors: {}
  };

  async componentDidMount() {
    // was ID provided? If so, acquire. If it is "new", then create a new one.
    const mapId = this.props.match.params.mapId;
    const hotSpotId = this.props.match.params.hotSpotId;
    if (hotSpotId !== "New") {
      try {
        const hotSpot = await HotSpotsService.get(mapId, hotSpotId);
        if (!hotSpot) {
          this.props.history.replace("/notfound");
          return;
        }
        this.setState({
          data: this.hotSpotToViewModel(hotSpot),
          originalHotSpot: hotSpot
        });
      } catch (ex) {
        this.props.history.replace("/notfound");
      }
    }

    const { zoomNames, currentMapName } = await this.getZoomableMaps();
    this.setState({
      zoomableMaps: zoomNames,
      mapName: currentMapName
    });
  }

  hotSpotToViewModel(hotSpot) {
    return {
      name: hotSpot.name,
      description: hotSpot.description,
      zoomName: hotSpot.zoomName ? hotSpot.zoomName : ""
    };
  }

  schema = {
    name: Joi.string()
      .required()
      .label("Name"),
    description: Joi.string()
      .required()
      .label("Description"),
    zoomName: Joi.string()
      .allow("")
      .label("Zoom Name")
  };

  doSubmit = async () => {
    const hotSpot = { ...this.state.originalHotSpot };

    hotSpot.name = this.state.data.name;
    hotSpot.description = this.state.data.description;
    hotSpot.zoomName = this.state.data.zoomName.trim();

    // if the zoomname changed, then wipe out the zoom id because it is pointing to the wrong image
    if (
      this.state.originalHotSpot &&
      this.state.originalHotSpot.zoomName !== hotSpot.zoomName
    )
      hotSpot.zoomId = null;

    const mapId = this.props.match.params.mapId;

    try {
      await HotSpotsService.save(mapId, hotSpot);

      this.props.history.push(`/hotspotseditor/${mapId}`);
    } catch (ex) {
      const errorMessage = ex.response.data;
      const isZoomError = errorMessage.search("zoom") >= 0;

      const errors = { ...this.state.errors };
      errors[isZoomError ? "zoomName" : "name"] = errorMessage;
      this.setState({ errors });
    }
  };

  getZoomableMaps = async () => {
    const maps = await MapsService.getMaps();
    let zoomNames = maps.map(m => ({ name: m.name, id: m._id }));

    // exclude the current map's name
    const mapId = this.props.match.params.mapId;
    const currentMap = maps.find(m => m._id === mapId);
    zoomNames = zoomNames.filter(n => n.name !== currentMap.name);

    // locate the map that zooms to this one and exclude that too
    // it won't eliminate all possible circular loops, but it'll help
    const zoomParent = maps.find(m =>
      m.hotSpots.find(h => h.zoomName === currentMap.name)
    );
    if (zoomParent)
      zoomNames = zoomNames.filter(n => n.name !== zoomParent.name);

    const sortedZoomNames = _.orderBy(zoomNames, "name", "asc");

    return { zoomNames: sortedZoomNames, currentMapName: currentMap.name };
    // can go crazier and eliminate all zooms from any hot spot of parent
    // can also go parent of parent
  };

  render() {
    return (
      <div>
        <h2>Hot Spot for {this.state.mapName}</h2>
        <form onSubmit={this.handleSubmit}>
          {this.renderInput("Name", "name")}
          {this.renderInput("Description", "description")}
          {this.renderSelect("Zoom Name", "zoomName", this.state.zoomableMaps)}
          {this.renderSubmitButton("Submit")}
          <button
            className="btn btn-primary buttonSpacing"
            onClick={() =>
              this.props.history.replace(
                `/hotspotseditor/${this.props.match.params.mapId}`
              )
            }
          >
            Cancel
          </button>
        </form>
      </div>
    );
  }
}

export default HotSpotForm;
