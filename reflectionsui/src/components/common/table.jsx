import React, { Component } from "react";
import TableHeader from "./tableHeader";
import TableBody from "./tableBody";

class Table extends Component {
  render() {
    const { data, columns, sortColumn, onSort } = this.props;

    return (
      <table className="table table-sm">
        <TableHeader
          onSort={onSort}
          sortColumn={sortColumn}
          columns={columns}
        />
        <TableBody columns={columns} data={data} />
      </table>
    );
  }
}

export default Table;
