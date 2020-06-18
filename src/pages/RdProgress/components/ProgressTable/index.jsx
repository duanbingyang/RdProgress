
import React, { Component } from 'react'
//without 路由跳转依赖
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
//without 路由跳转依赖结束
import moment from 'moment'
import { Table, Progress, Pagination, Button, Dialog, Input, Message } from '@alifd/next'
import { Link } from 'react-router-dom'
import styles from  './index.module.scss'
import axios from 'axios'
import qs from 'qs'
import emitter from "./../../ev"
const rootUrl = 'http://localhost:3000'
const storage = window.sessionStorage;
//腾讯云服务地址
// const rootUrl = 'http://49.234.40.20:3000'

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
      projectAudit: this.props.projectAudit ? this.props.projectAudit : 0,
      input: '',
      projectInput: '',
      canEdit: false,
      visible: false,
      inputState: 'error',
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
      state: { 
        pageId: this.props.pageId,
        textCustomizedVisible: false,
        mainProjectName: this.props.mainProjectName,
        projectAudit: this.state.projectAudit
      }, 
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
        dataId: record.id,
        mainProjectName: this.props.mainProjectName,
        projectAudit: this.state.projectAudit
      }, 
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

  // deleteItem = (record, e) => {
  //   e.preventDefault();
  //   const _this = this
  //   let submitData = {
  //     'id': record.id
  //   }
  //   axios.post(`${rootUrl}/api/deleteProgressId`, qs.stringify(submitData))
  //     .then(res=>{
  //         _this.delete(record.id)
  //         emitter.emit("callMe", {'id':record.id, 'progressId': record.progressId, 'progress': record.progressPercent})
  //     })
  //     .catch(error=>{
  //         console.log('res=>',error);            
  //     })
  // };


  auditChange = (id, audit) => {
    let pageData = this.state.dataSource
    for(let i = 0; i < pageData.length; i++){
      if(pageData[i]['id'] == id) {
        pageData[i]['progressAudit'] = audit
      }
    }
    this.setState({
      dataSource: pageData
    })
  }

  auditClick = (record, e) => {
    e.preventDefault();
    const _this = this
    let value = {}
    value.id = record.id
    value.progressAudit = !record.progressAudit

    axios.post(`${rootUrl}/api/auth`, qs.stringify(value))
    .then(res=>{
      _this.auditChange(record.id, !record.progressAudit)    
    })
    .catch(error=>{
        console.log('res=>',error);            
    })
  }
  
  onOpen = () => {
    this.setState({
        visible: true
    });
  };
  
  onClose = () => {
    this.setState({
        visible: false
    });
  };

  onOk = () => {
    const _this = this
    if(this.state.input){
      // Message.loading('正在验证权限')
      Message.show({
        type: 'loading',
        content: '正在验证权限',
        duration: 0,
      })
      axios.get(`${rootUrl}/api/editCode?editCode=${this.state.input}`)
      .then(res=>{
        if(res.data.data && res.data.data[0]){
          _this.inputState(1)
          Message.success('编辑权限已开启')
          storage.setItem('editSign', 1);
        }else{
          Message.error('编辑码错误')
        }
      })
      .catch(error=>{
          console.log('res=>',error);
          Message.error('服务器错误，请联系信息中心技术人员')        
      })
    }else{
      Message.error('请输入编辑码')
    }
  };

  inputChange = (value)=> {
    this.setState({
      input: value
    })
  }

  projectInputChange = (input) => {
    this.setState({
      projectInput: input
    })
  }

  inputState = (state) => {
    let _canEdit = false
    let _visible = true
    if(state) {
      if(state == 1){
        _canEdit = true
        _visible = false
      }
    }else{
      _canEdit = true
    }
    this.setState({
      canEdit: _canEdit,
      visible: _visible
    })
  }

  editProgressNode = () => {
    const editSign = storage.getItem('editSign')
    if(editSign) {
      this.inputState(editSign)
    }else{
      this.setState({
        visible: true
      });
    }
  }

  renderProgressStatus= (value, index, record) => {
    const _data = this.state.dataSource[index]
    const _progressPlanTime = _data['progressTime']
    const _progressFinishTime = _data['progressDeadline'] && !isNaN(_data['progressDeadline']) ? _data['progressDeadline'] : 0
    const _progressPlanMoney = _data['progressMoney']
    const _progressrealMoney = _data['progressRealMoney']
    const _progressAudit = _data['progressAudit'] ? true : false
    const jsx = []
    let i = 0
    if(_progressAudit) {
      jsx.push(<span key={i} className={styles.auditTrue}>已审核</span>)
      i++
    }else{
      jsx.push(<span key={i} className={styles.auditFalse}>未审核</span>)
      i++
    }
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
    const _data = this.state.dataSource[index]
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
        <a 
          href='#' 
          className={styles.operationItem}
          onClick = {this.auditClick.bind(this, record)}
        >
          {_data.progressAudit ? '驳回' : '通过'}
        </a>
        {/* <a 
          href="#" 
          className={styles.operationItem}
          target="_blank"
          onClick={this.deleteItem.bind(this, record)}
        >
          删除
        </a> */}
      </div>
    );
  };

  onOpenTextCustomized = () => {
    this.setState({
        textCustomizedVisible: true
    });
  };

  onCloseTextCustomized = () => {
    this.setState({
        textCustomizedVisible: false
    });
  };

  onOkTextCustomized = () => {
    const _this = this
    const submitData = {
      id: this.props.pageId,
      projectAudit: 1
    }
    const editSign = storage.getItem('editSign')
    if(editSign) {
      _this.submitProjectAudit(submitData)
    }else{
      if(this.state.projectInput){
        Message.show({
          type: 'loading',
          content: '正在验证权限',
          duration: 0,
        })
        axios.get(`${rootUrl}/api/editCode?editCode=${this.state.projectInput}`)
        .then(res=>{
          if(res.data.data && res.data.data[0]){
            _this.submitProjectAudit(submitData)
          }else{
            Message.error('编辑码错误')
          }
        })
        .catch(error=>{
            console.log('res=>',error);
            Message.error('服务器错误，请联系信息中心技术人员')        
        })
      }else{
        Message.error('请输入编辑码')
      }
    }
  };
  onCancelTextCustomized = () => {
    const _this = this
    const submitData = {
      id: this.props.pageId,
      projectAudit: 2
    }
    const editSign = storage.getItem('editSign')
    if(editSign) {
      _this.submitProjectAudit(submitData)
    }else{
      if(this.state.projectInput){
        Message.show({
          type: 'loading',
          content: '正在验证权限',
          duration: 0,
        })
        axios.get(`${rootUrl}/api/editCode?editCode=${this.state.projectInput}`)
        .then(res=>{
          if(res.data.data && res.data.data[0]){
            _this.submitProjectAudit(submitData)
          }else{
            Message.error('编辑码错误')
          }
        })
        .catch(error=>{
            console.log('res=>',error);
            Message.error('服务器错误，请联系信息中心技术人员')        
        })
      }else{
        Message.error('请输入编辑码')
      }
    }
  };

  submitProjectAudit = (submitData) => {
    const _this = this
    Message.show({
      type: 'loading',
      content: '正在提交数据',
      duration: 0,
    })
    axios.post(`${rootUrl}/api/projectAudit`, qs.stringify(submitData))
    .then(res=>{
      this.setState({
        textCustomizedVisible: false,
        projectAudit: submitData.projectAudit
      });
      if(!res.code){
        _this.inputState(1)
        Message.success('审核完成')
        emitter.emit("callMe", {'projectAudit': submitData.projectAudit})
      }else{
        Message.error('审核失败')
      }
    })
    .catch(error=>{
        console.log('res=>',error);
        this.setState({
          textCustomizedVisible: false
        });
        Message.error('服务器错误，请联系信息中心技术人员')        
    })
  }

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
          <Button
            type="secondary"
            onClick={this.editProgressNode}
            style={{marginBottom: '20px'}}
          >
            编辑节点
          </Button>
          <Button
            type="primary"
            onClick={this.onOpenTextCustomized}
            style={{marginBottom: '20px',float: 'right'}}
          >
            项目委员会审核
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
              width={140} 
              cell={this.renderProgressStatus}
            />
            {this.state.canEdit || storage.getItem('editSign') ? 
            <Table.Column
              title="操作"
              dataIndex="operation"
              width={120}
              cell={this.renderOperations}
            /> : ''}
          </Table>
          <Dialog
            title="编辑节点"
            visible={this.state.visible}
            autoFocus
            onOk={this.onOk.bind(this, 'okClick')}
            onCancel={this.onClose.bind(this, 'cancelClick')}
            onClose={this.onClose}
            cancelProps={{'aria-label':'cancel'}}
            okProps={{'aria-label':'ok'}}>
            <Input 
              placeholder="请输入您的编辑码" 
              aria-label="Medium" 
              aria-labelledby="J_InputMedium" 
              onChange={this.inputChange.bind(this)}
              state={this.state.inputState}
            />
            </Dialog>
            <Dialog
              title="项目审核"
              visible={this.state.textCustomizedVisible}
              onOk={this.onOkTextCustomized}
              onCancel={this.onCancelTextCustomized}
              onClose={this.onCloseTextCustomized}
              okProps={{children: '通过', className: 'asdf'}}
              cancelProps={{children: '驳回'}}
              >
              <p>是否通过该项目的审核？（此项仅限【项目委员会成员】审核）</p>
              {storage.getItem('editSign') ? '' :
              <Input 
                placeholder="请输入您的编辑码" 
                aria-label="Medium" 
                aria-labelledby="J_InputMedium" 
                onChange={this.projectInputChange.bind(this)}
                state={this.state.inputState}
              />}
              <p></p>
              
            </Dialog>
        </div>
      </div>
    );
  }
}
