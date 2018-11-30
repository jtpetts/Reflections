import React, { Component } from "react";
import _ from "lodash";
import { toast } from "react-toastify";
import MapsService from "../services/mapsService";
import ImagesService from "../services/imageService";
import ImagesTable from "./imagesTable";
import Paginator from "./common/paginator";
import AreYouSureModal from "./common/areYouSureModal";

class Images extends Component {
  state = {
    activePage: 0,
    pageSize: 8,
    sortColumn: { path: "name", order: "asc" },
    images: [],
    showDeleteModal: false,
    deleteModalMessage: "",
    imageToDelete: null
  };

  async componentDidMount() {
    try {
      await this.blendImagesWithMapDb();
    } catch (ex) {
      this.props.history.replace("/notfound");
    }
  }

  blendImagesWithMapDb = async () => {
    const rawMaps = await MapsService.getMaps();

    const maps = rawMaps.map(m => ({
      name: m.name,
      imageFilename: m.imageFilename,
      _id: m._id,
      hotSpotCount: m.hotSpots ? m.hotSpots.length : 0,
      isImageOnly: false
    }));

    const images = ImagesService.getImages();
    const blended = maps.concat(
      images
        .filter(i => !maps.find(m => m.imageFilename === i.imageFilename))
        .map(i => ({
          name: "",
          imageFilename: i.imageFilename,
          _id: i.imageFilename,
          hotSpotCount: 0,
          isImageOnly: true
        }))
    );

    this.setState({ images: blended });
  };

  handleEdit = image => {
    if (image._id === image.imageFilename)
      this.props.history.push(
        `/mapForm/New?imageFilename=${image.imageFilename}`
      );
    else this.props.history.push(`/mapForm/${image._id}`);
  };

  handleDeleteWarning = image => {
    this.setState({
      showDeleteModal: true,
      deleteModalMessage: `Are you sure you want to delete the map and hotspot records for ${
        image.name
      }`,
      imageToDelete: image
    });
  };

  handleDelete = async () => {
    const image = this.state.imageToDelete;

    if (image._id) {
      const originalImages = this.state.images;

      try {
        this.setState({ showDeleteModal: false });
        await MapsService.deleteMap(image._id);

        // sorting out the blended images with the maps is more trouble than its worth,
        // especially considering how rare delete will be. I've chosen to refresh from
        // database.
        await this.blendImagesWithMapDb();
      } catch (ex) {
        if (ex.response)
          if (ex.response.status >= 400 && ex.response.status < 500)
            toast.error(ex.response.data);

        this.setState({ images: originalImages });
      }
    }
  };

  handleCloseDeleteModal = () => {
    this.setState({ showDeleteModal: false });
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

    const sortedImages = _.orderBy(
      this.state.images,
      this.state.sortColumn.path,
      this.state.sortColumn.order
    );

    const start = this.state.activePage * this.state.pageSize;

    const pagedImages = _.slice(
      sortedImages,
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
            <h2>Images</h2>
          </div>
        </div>
        <div className="row">
          <div className="col">
            <ImagesTable
              images={images}
              onLike={this.handleLike}
              onDelete={this.handleDeleteWarning}
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
        <AreYouSureModal
          open={this.state.showDeleteModal}
          onClose={this.handleCloseDeleteModal}
          onTrigger={this.handleDelete}
          triggerLabel="Delete"
          modalMessage={this.state.deleteModalMessage}
        />
      </React.Fragment>
    );
  }
}

export default Images;
