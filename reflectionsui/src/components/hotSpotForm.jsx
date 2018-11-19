import React from "react";
import Joi from "joi-browser";
import Form from "./common/form";
import HotSpotsService from "../services/hotSpotsService";

class HotSpotForm extends Form {
  state = {
    data: { name: "", description: "", zoomName: "" },
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
    // get the fields and submit to the service, will need auth first.
    // where to go after save? to hot spot form I should think.

    // yank the hotspot out of the list
    // update

    const hotSpot = { ...this.state.originalHotSpot };

    hotSpot.name = this.state.data.name;
    hotSpot.description = this.state.data.description;
    hotSpot.zoomName = this.state.data.zoomName.trim();

    const mapId = this.props.match.params.mapId;
    await HotSpotsService.save(mapId, hotSpot);

    this.props.history.push(`/hotspotseditor/${mapId}`);
  };

  render() {
    return (
      <div>
        <h1>HotSpot Form</h1>
        <form onSubmit={this.handleSubmit}>
          {this.renderInput("Name", "name")}
          {this.renderInput("Description", "description")}
          {this.renderInput("Zoom Name", "zoomName")}
          {this.renderSubmitButton("Submit")}
        </form>
      </div>
    );
  }
}

export default HotSpotForm;
