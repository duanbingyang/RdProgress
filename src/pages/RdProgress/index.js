import React, { Component } from 'react'
import axios from 'axios'
import URL from 'url'
//without 路由跳转依赖
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
//without 路由跳转依赖结束
import SimpleStep from './components/SimpleStep'
import ProgressTable from './components/ProgressTable'
// const rootUrl = 'http://192.168.31.59:3000'   
//腾讯云服务地址
const rootUrl = 'http://49.234.40.20:3000'  
let pageData = ''

@withRouter
export default class RdPrograss extends Component {

  static propTypes = {
    match: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    console.log(props, '=================')
    this.state = {
      value: '',
      pageId: URL.parse(this.props.location.search, true).query.id,
      projectName: URL.parse(this.props.location.search, true).query.name,
      projectAudit: URL.parse(this.props.location.search, true).query.projectAudit,
      currentStep: 0
    };
  }

  async componentWillMount () {
    const _this = this;
    await axios.get(`${rootUrl}/api/progressNodeUseId?id=${this.state.pageId}`)
        .then(function (response) {
           pageData = response.data.data
            _this.setState({
              value: response.data.data,
            });
        })
        .catch(function (error) {
            console.log(error);
            _this.setState({
                isLoaded: false,
                error: error
            })
        })
  }

  nodeNumCallback(nodeNum) {
    this.setState({
      currentStep: nodeNum
    })
  }

  render() {
    return (
      !this.state.value ? "loading" : <div className="rd-prograss-page">
        <SimpleStep 
          componentData={this.state.value} 
          projectAudit={this.state.projectAudit}
          mainProjectName={this.state.projectName}
          pageId={this.state.pageId}
          nodeClickCallback={this.nodeNumCallback.bind(this)}
        />
        {/* 进度条表格 */}
        <ProgressTable
          componentData={this.state.value}
          projectAudit={this.state.projectAudit}
          mainProjectName={this.state.projectName}
          pageId={this.state.pageId}
        />
      </div>
    );
  }
}
