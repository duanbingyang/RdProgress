import React, { Component } from 'react';
import FilterTable from './components/FilterTable';

export default class RdProgressList extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="rd-progress-list-page">
        {/* 附带筛选工具条的表格 */}
        <FilterTable />
      </div>
    );
  }
}
