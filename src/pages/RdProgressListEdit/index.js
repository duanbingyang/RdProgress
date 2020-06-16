import React, { Component } from 'react';
import CreateActivityForm from './components/CreateActivityForm';

export default class RdProgressListEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="rd-progress-list-edit-page">
        {/* 创建活动的表单 */}
        <CreateActivityForm />
      </div>
    );
  }
}
