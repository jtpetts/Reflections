import React, { Component } from "react";
import _ from "lodash";
import MapsService from "../services/mapsService";
import ImagesService from "../services/imageService";
import ImagesTable from "./imagesTable";
import Paginator from "./common/paginator";

class Images extends Component {
  state = {
    activePage: 0,
    pageSize: 8,
    sortColumn: { path: "ImageFilename", order: "asc" },
    images: []
  };

  async componentDidMount() {
    try {
      const rawMaps = await MapsService.getMaps();

      const maps = rawMaps.map(m => ({
        name: m.name,
        imageFilename: m.imageFilename,
        _id: m._id,
        hotSpotCount: m.hotSpots ? m.hotSpots.length : 0
      }));

      const images = ImagesService.getImages();
      const blended = maps.concat(
        images
          .filter(i => !maps.find(m => m.imageFilename === i.imageFilename))
          .map(i => ({
            name: "",
            imageFilename: i.imageFilename,
            _id: "New",
            hotSpotCount: 0
          }))
      );

      this.setState({ images: blended });
    } catch (ex) {
      this.props.history.replace("/notfound");
    }
  }

  handleEdit = image => {
    this.props.history.push(`/mapForm/${image._id}`);
  };

  handleDelete = async image => {
    if (image._id) {
      const originalImages = this.state.images;

      try {
        const filteredImages = originalImages.filter(i => i._id !== image._id);
        this.setState({ images: filteredImages });

        await MapsService.deleteMap(image._id);
      } catch (ex) {
        this.setState({ images: originalImages });
      }
    }
  };

  handlePageChange = activePage => {
    this.setState({ activePage });
  };

  handleSort = sortColumn => {
    this.setState({ sortColumn });
  };

  getPagedData = () => {
    // filters, pages, and sorts the hot spots
    if (!this.state.images) return { itemCount: 0, images: [] };

    const start = this.state.activePage * this.state.pageSize;

    const pagedImages = _.slice(
      this.state.images,
      start,
      start + this.state.pageSize
    );

    return {
      itemCount: this.state.images.length,
      images: pagedImages
    };
  };

  render() {
    const { itemCount, images } = this.getPagedData();

    return (
      <React.Fragment>
        <div className="row">
          <div className="col">
            <h1>Images</h1>
          </div>
        </div>
        <div className="row">
          <div className="col">
            <ImagesTable
              images={images}
              onLike={this.handleLike}
              onDelete={this.handleDelete}
              onEdit={this.handleEdit}
              onSort={this.handleSort}
              sortColumn={this.state.sortColumn}
            />
            <Paginator
              itemCount={itemCount}
              pageSize={this.state.pageSize}
              activePage={this.state.activePage}
              onPageChange={this.handlePageChange}
            />
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Images;
