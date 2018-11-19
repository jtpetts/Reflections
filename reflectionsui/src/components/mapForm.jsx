import React from "react";
import Joi from "joi-browser";
import Form from "./common/form";
import MapsService from "../services/mapsService";

class MapForm extends Form {
  state = {
    data: { name: "", description: "", imageFilename: "" },
    errors: {},
    originalMap: {}
  };

  async componentDidMount() {
    // was ID provided? If so, acquire. If it is "new", then create a new one.
    const id = this.props.match.params.id;
    if (id !== "New") {
      try {
        const map = await MapsService.getMap(id);

        if (!map) {
          this.props.history.replace("/notfound");
          return;
        }

        this.setState({ data: this.mapToViewModel(map), originalMap: map });
      } catch (ex) {
        // redirect to /not-found
        this.props.history.replace("/notfound");
      }
    }
  }

  mapToViewModel(map) {
    return {
      name: map.name,
      description: map.description,
      imageFilename: map.imageFilename ? map.imageFilename : ""
    };
  }

  schema = {
    name: Joi.string()
      .required()
      .label("Name"),
    description: Joi.string()
      .required()
      .label("Description"),
    imageFilename: Joi.string()
      .required()
      .label("Image Filename")
  };

  doSubmit = async () => {
    // get the fields and submit to the service, will need auth first.
    // where to go after save? to hot spot form I should think.

    const map = {
      ...this.state.originalMap,
      name: this.state.data.name,
      description: this.state.data.description,
      imageFilename: this.state.data.imageFilename
    };

    const updatedMap = await MapsService.save(map);
    if (updatedMap)
      this.props.history.push(`/hotspotseditor/${updatedMap._id}`);
  };

  handleEditHotSpots = () => {
    this.doSubmit();

    const id = this.props.match.params.id;
    this.props.history.push(`/hotspotseditor/${id}`);
  };

  render() {
    const id = this.props.match.params.id;

    return (
      <div>
        <h1>Map Form</h1>
        <form onSubmit={this.handleSubmit}>
          {this.renderInput("Name", "name")}
          {this.renderInput("Description", "description")}
          {this.renderInput("Image Filename", "imageFilename")}
          {this.renderSubmitButton("Submit")}
        </form>
        {id && (
          <button className="btn btn-primary" onClick={this.handleEditHotSpots}>
            Save and Edit Hot Spots
          </button>
        )}
      </div>
    );
  }
}

export default MapForm;
