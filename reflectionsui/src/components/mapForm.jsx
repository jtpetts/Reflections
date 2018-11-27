import React from "react";
import Joi from "joi-browser";
import queryString from "query-string";
import Form from "./common/form";
import MapsService from "../services/mapsService";

class MapForm extends Form {
  state = {
    data: { name: "", description: "" },
    imageFilename: "",
    errors: {},
    originalMap: {}
  };

  async componentDidMount() {
    // was ID provided? If so, acquire. If it is "new", then create a new one.
    const id = this.props.match.params.id;
    if (id === "New") {
      const { imageFilename } = queryString.parse(this.props.location.search);
      this.setState({ imageFilename });
    } else {
      try {
        const map = await MapsService.getMap(id);

        if (!map) {
          this.props.history.replace("/notfound");
          return;
        }

        this.setState({
          data: this.mapToViewModel(map),
          originalMap: map,
          imageFilename: map.imageFilename
        });
      } catch (ex) {
        // redirect to /not-found
        this.props.history.replace("/notfound");
      }
    }
  }

  mapToViewModel(map) {
    return {
      name: map.name,
      description: map.description
    };
  }

  schema = {
    name: Joi.string()
      .required()
      .label("Name"),
    description: Joi.string()
      .required()
      .label("Description")
  };

  doSubmit = async () => {
    // get the fields and submit to the service, will need auth first.
    // where to go after save? to hot spot form I should think.

    const map = {
      ...this.state.originalMap,
      name: this.state.data.name,
      description: this.state.data.description,
      imageFilename: this.state.imageFilename
    };

    const updatedMap = await MapsService.save(map);
    if (updatedMap)
      this.props.history.push(`/hotspotseditor/${updatedMap._id}`);
  };

  handleEditHotSpots = () => {
    const id = this.props.match.params.id;
    this.props.history.push(`/hotspotseditor/${id}`);
  };

  render() {
    const id = this.props.match.params.id;

    return (
      <div>
        <h2>Map</h2>
        <h4>Image Filename: {this.state.imageFilename}</h4>
        <form onSubmit={this.handleSubmit}>
          {this.renderInput("Name", "name")}
          {this.renderInput("Description", "description")}
          {this.renderSubmitButton("Submit")}
          {id && (
            <button
              className="btn btn-primary"
              onClick={this.handleEditHotSpots}
              style={{ marginLeft: "20px" }}
            >
              Jump to Hot Spots
            </button>
          )}
        </form>
      </div>
    );
  }
}

export default MapForm;
