
import React, { Component } from 'react'
//without 路由跳转依赖
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
//without 路由跳转依赖结束
import moment from 'moment'
import { Table, Progress, Pagination, Button } from '@alifd/next'
import { Link } from 'react-router-dom'
import styles from  './index.module.scss'
import axios from 'axios'
import qs from 'qs'
import emitter from "./../../ev"
// const rootUrl = 'http://localhost:3000'   
//腾讯云服务地址
const rootUrl = 'http://49.234.40.20:3000'  

@withRouter
export default class ProgressTable extends Component {
  static displayName = 'ProgressTable';

  static propTypes = {
    match: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      dataSource: props.componentData,
    };
  }

  renderCellProgress = (value) => (
    <Progress percent={parseInt(value, 10)} />
  );

  addProgressNode = () => {
    const { history } = this.props;
    history.push({
      pathname: '/rdprogressadd', // 待跳转的页面URL
      state: { pageId: this.props.pageId }, // 跳转时传入的参数
    })
  }

  renderTime = (value) => {
    return (
      <div className={styles.titleWrapper}>
        <span className={styles.title}>{value && !isNaN(value)? moment(parseInt(value)*1000).format("YYYY-MM-DD") : ''}</span>
      </div>
    );
  };
  
  editItem = (record, e) => {
    e.preventDefault();
    const { history } = this.props;
    history.push({
      pathname: '/rdprogressEdit', // 待跳转的页面URL
      state: { 
        pageId: this.props.pageId,
        progressId: record.progressId,
        dataId: record.id
      }, // 跳转时传入的参数
    })
  };

  delete = (id) => {
    let pageData = this.state.dataSource
    
    for(let i = 0; i < pageData.length; i++){
      if(pageData[i]['id'] == id) {
        pageData.splice(i, 1)
      }
    }


    this.setState({
      dataSource: pageData
    })
  }

  deleteItem = (record, index, e) => {
    e.preventDefault();
    const _this = this
    let submitData = {
      'id': record.id
    }
    axios.post(`${rootUrl}/api/deleteProgressId`, qs.stringify(submitData))
      .then(res=>{
          console.log('res=>',res);
          _this.delete(record.id)
          emitter.emit("callMe", {'id':record.id, 'progressId': record.progressId, 'progress': record.progressPercent})
      })
      .catch(error=>{
          console.log('res=>',error);            
      })
  };

  detailClick = (record, e) => {
    e.preventDefault();
    this.props.history.push('/rdprogress?id=' + record.id)
  }

  renderProgressStatus= (value, index, record) => {
    const _progressPlanTime = this.state.dataSource[index]['progressTime']
    const _progressFinishTime = this.state.dataSource[index]['progressDeadline'] && !isNaN(this.state.dataSource[index]['progressDeadline']) ? this.state.dataSource[index]['progressDeadline'] : 0
    const _progressPlanMoney = this.state.dataSource[index]['progressMoney']
    const _progressrealMoney = this.state.dataSource[index]['progressRealMoney']
    const jsx = []
    let i = 0
    if(_progressPlanMoney - _progressrealMoney < 0) {
      jsx.push(<span key={i} className={styles.overMoney}>超预算</span>)
      i++
    }
    if(_progressPlanTime - _progressFinishTime <= 0){
      jsx.push(<span key={i} className={styles.overTime}>延期</span>)
      i++
    }
    return (
    <div>{jsx}</div>
    )
  }

  renderOperations = (value, index, record) => {
    return (
      <div
        className="filter-table-operation"
        className={styles.filterTableOperation}
      >
        <a
          href="#"
          className={styles.operationItem}
          target="_blank"
          onClick={this.editItem.bind(this, record)}
        >
          编辑
        </a>
        {/* <a href={'/#/rdprogress?id=' + record.id} className={styles.operationItem}>
          详情
        </a> */}
        {/* <a 
          href='#' 
          className={styles.operationItem}
          onClick = {this.detailClick.bind(this, record)}
        >
          详情
        </a> */}
        <a 
          href="#" 
          className={styles.operationItem}
          target="_blank"
          onClick={this.deleteItem.bind(this, record, index)}
        >
          删除
        </a>
      </div>
    );
  };

  render() {
    const {location} = this.props
    return (
      <div className="progress-table">
        <div className="tab-card" title="项目节点信息">
          <Button
            onClick={this.addProgressNode}
            style={{marginBottom: '20px'}}
          >
            增加节点
          </Button>
          <Table
            rowProps={(record, index) => {
              return {
                className: `progress-table-tr progress-table-tr${index}`
              };
            }}
            dataSource={this.state.dataSource}
          >
            <Table.Column title="序号" dataIndex="progressId" width={80} />
            <Table.Column title="节点名" dataIndex="projectName" width={200} />
            <Table.Column title="计划完成时间"
              dataIndex="progressTime"
              width={160}
              cell={this.renderTime}
            />
            <Table.Column title="实际完成时间"
              dataIndex="progressDeadline"
              width={160}
              cell={this.renderTime}
            />
            <Table.Column title="计划费用" dataIndex="progressMoney" width={140} />
            <Table.Column title="实际费用" dataIndex="progressRealMoney" width={140} />
            <Table.Column title="完成情况" dataIndex="progressDeadlineDetail" width={140} />
            <Table.Column
              title="节点进度"
              dataIndex="progressPercent"
              cell={this.renderCellProgress}
              width={300}
            />
            <Table.Column 
              title="节点状态" 
              dataIndex="progressDetail" 
              width={140} 
              cell={this.renderProgressStatus}
            />
            <Table.Column
              title="操作"
              dataIndex="operation"
              width={120}
              cell={this.renderOperations}
            />
          </Table>
        </div>
      </div>
    );
  }
}
