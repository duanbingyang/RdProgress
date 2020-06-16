import React, { Component } from 'react';
import URL from 'url'
import CreateActivityForm from './components/CreateActivityForm';

export default class RdProgressEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageData: ''
    };
  }

  componentWillMount () {
    const pageData = URL.parse(this.props.location.search, true).query
    console.log(pageData)
    this.setState({
      pageData: pageData
    })
  }


  render() {
    return (
      <div className="rd-progress-edit-page">
        {/* 创建活动的表单 */}
        <CreateActivityForm pageData = {this.state.pageData}/>
      </div>
    );
  }
}
