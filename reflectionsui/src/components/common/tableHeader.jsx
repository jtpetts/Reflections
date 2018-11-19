import React, { Component } from "react";
import PropTypes from "prop-types";

class TableHeader extends Component {
  raiseSort = path => {
    if (!path) return "";

    const sortColumn = { ...this.props.sortColumn };

    if (sortColumn.path === path) {
      sortColumn.order = sortColumn.order === "asc" ? "desc" : "asc";
    } else {
      sortColumn.path = path;
      sortColumn.order = "asc";
    }

    this.props.onSort(sortColumn);
  };

  renderSortIcon = column => {
    if (!column.path) return "";

    if (column.path !== this.props.sortColumn.path)
      return <i className="fa fa-sort" />;

    if (this.props.sortColumn.order === "asc")
      return <i className="fa fa-sort-up" />;
    else return <i className="fa fa-sort-down" />;
  };

  render() {
    return (
      <thead>
        <tr>
          {this.props.columns.map(column => (
            <th
              className="clickable"
              key={column.label || column.key}
              onClick={() => this.raiseSort(column.path)}
              scope="col"
            >
              {column.label} {this.renderSortIcon(column)}
            </th>
          ))}
        </tr>
      </thead>
    );
  }
}

TableHeader.propTypes = {
  onSort: PropTypes.func.isRequired,
  sortColumn: PropTypes.object.isRequired,
  columns: PropTypes.array.isRequired
};

export default TableHeader;
