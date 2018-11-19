import React, { Component } from "react";
import PropTypes from "prop-types";
import _ from "lodash";

class Paginator extends Component {
  state = {};
  render() {
    const { itemCount, pageSize } = this.props;
    const thumbnailCount = Math.ceil(itemCount / pageSize);

    if (thumbnailCount < 2) return null;

    const pages = _.range(0, thumbnailCount);

    return (
      <nav aria-label="The Page Navigator">
        <ul className="pagination">
          {pages.map(page => (
            <li
              className={this.getClassName(page, this.props.activePage)}
              key={page}
            >
              <a
                className="page-link"
                onClick={() => this.props.onPageChange(page)}
              >
                {page + 1}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    );
  }

  getClassName = (page, activePage) => {
    if (page === activePage) return "page-item active";
    else return "page-item";
  };
}

Paginator.propTypes = {
  itemCount: PropTypes.number.isRequired,
  pageSize: PropTypes.number.isRequired,
  activePage: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired
};

export default Paginator;
