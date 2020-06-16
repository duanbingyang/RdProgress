import React, { Component } from 'react'
import axios from 'axios'
import URL from 'url'
import SimpleStep from './components/SimpleStep'
import ProgressTable from './components/ProgressTable'
// const rootUrl = 'http://192.168.31.59:3000'   
//腾讯云服务地址
const rootUrl = 'http://49.234.40.20:3000'  
let pageData = ''

export default class RdPrograss extends Component {
  constructor(props) {
    super(props);
    console.log(props)
    this.state = {
      value: '',
      pageId: URL.parse(this.props.location.search, true).query.id,
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
        <SimpleStep componentData={this.state.value} pageId={this.state.pageId} nodeClickCallback={this.nodeNumCallback.bind(this)}/>
        {/* 进度条表格 */}
        <ProgressTable componentData={this.state.value} pageId={this.state.pageId} />
      </div>
    );
  }
}
