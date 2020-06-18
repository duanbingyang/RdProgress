/* eslint no-underscore-dangle: 0 */
import React, { Component } from 'react'
//without 路由跳转依赖
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
//without 路由跳转依赖结束
import moment from 'moment'
import axios from 'axios'
import { Table, Pagination, Dialog, Input } from '@alifd/next'
import styles from './index.module.scss'
// const rootUrl = 'http://localhost:3000'
//腾讯云服务地址
const rootUrl = 'http://49.234.40.20:3000'  

@withRouter
export default class EnhanceTable extends Component {

  static propTypes = {
    match: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      input: '',
      value: [],
    };
  }

  componentWillMount() {
  }

  componentDidMount() {
    // this.axiosForList()
    if(this.props.location.state && this.props.location.state.viewCode) {
      this.axiosForList(this.props.location.state.viewCode)
    }else{
      this.setState({
        visible: true
      })
    }
  }

  axiosForList = (viewCode) => {
    const _this = this;
    const { history } = this.props;
    const getUrl = viewCode ? `${rootUrl}/api/projectListUseId?viewCode=` + viewCode : `${rootUrl}/api/projectList`
    axios.get(getUrl)
        .then(function (response) {
            _this.setState({
              value: response.data.data,
            });
            // history.push({
            //   pathname: `/rdprogress?id=${response.data.data[0]['id']}`, // 待跳转的页面URL
            //   state: { 
            //     id: response.data.data[0]['id']
            //   }, 
            // })
            // history.push(`/rdprogress?id=${response.data.data[0]['id']}&name=${response.data.data[0]['projectName']}&projectAudit=${response.data.data[0]['audit']}`) 
            history.push({
              pathname: `/rdprogress?id=${response.data.data[0]['id']}&name=${response.data.data[0]['projectName']}`, // 待跳转的页面URL
              state: { 
                id: response.data.data[0]['id'],
                name: response.data.data[0]['projectName'],
                projectAudit: response.data.data[0]['audit']
              }, 
            }) 
        })
        .catch(function (error) {
            console.log(error);
            _this.setState({
                isLoaded: false,
                error: error
            })
        })
  }

  renderTime = (value, index, record) => {
    return (
      <div className={styles.titleWrapper}>
        <span className={styles.title}>{moment(parseInt(record.initTime)*1000).format("YYYY-MM-DD")}</span>
      </div>
    );
  };

  renderDepartment = (value, index, record) => {
    return <span className={styles.title}>{this.optionsParse(record.department)}</span>
  };

  editItem = (record, e) => {
    e.preventDefault();
    // TODO: record 为该行所对应的数据，可自定义操作行为
  };

  // detailClick = (record, e) => {
  //   e.preventDefault();
  //   this.props.history.push('/rdprogress?id=' + record.id)
  // }

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
    this.setState({
        visible: false
    });
    this.state.input ? this.axiosForList(this.state.input) : false
  };

  renderOperations = (value, index, record) => {
    return (
      <div
        className="filter-table-operation"
        className={styles.filterTableOperation}
      >
        {/* <a
          href="#"
          className={styles.operationItem}
          target="_blank"
          onClick={this.editItem.bind(this, record)}
        >
          解决
        </a> */}
        {/* <a href={'/#/rdprogress?id=' + record.id} className={styles.operationItem}>
          详情
        </a> */}
        {/* <a 
          // href={'/#/rdprogress?id=' + record.id} 
          href='#'
          onClick={this.detailClick.bind(this, record)}
          className={styles.operationItem}
        >
          详情
        </a> */}
        {/* <a href="#" className={styles.operationItem} target="_blank">
          分类
        </a> */}
      </div>
    );
  };
  
  optionsParse = (data) => {
    const model = {
      location1: '制剂研发部',
      location2: '包材研发部',
      location3: '合成研发部'
    }
    return model[data]
  }

  inputChange = (value)=> {
    this.setState({
      input: value
    })
  }

  render() {
    return (
      <div className="filter-table">
        {/* <div title="项目筛选">
          <FilterForm
            onChange={this.filterFormChange}
            onSubmit={this.filterTable}
            onReset={this.resetFilter}
          />
        </div> */}
        <div>
          <Table
            dataSource={this.state.value}
            className="basic-table"
            style={styles.basicTable}
            hasBorder={false}
          >
            <Table.Column
              title="项目id"
              dataIndex="id"
              width={60}
            />
            <Table.Column
              title="项目名"
              dataIndex="projectName"
              width={320}
            />
            <Table.Column 
              title="申请日期" 
              cell={this.renderTime} 
              width={85} 
            />
            <Table.Column
              title="所属部门"
              dataIndex="department"
              cell={this.renderDepartment} 
              width={150}
            />
            <Table.Column
              title="提交人"
              dataIndex="submitPerson"
              width={100}
            />
            <Table.Column
              title="项目经理"
              dataIndex="projectManager"
              width={100}
            />
            <Table.Column
              title="研发平台负责人"
              dataIndex="RD_Manager"
              width={100}
            />
            <Table.Column
              title="项目预算"
              dataIndex="money"
              width={120}
            />
            <Table.Column
              title="操作"
              dataIndex="operation"
              width={80}
              cell={this.renderOperations}
            />
          </Table>
          <Dialog
            title="查看项目"
            visible={this.state.visible}
            autoFocus
            onOk={this.onOk.bind(this, 'okClick')}
            onCancel={this.onClose.bind(this, 'cancelClick')}
            onClose={this.onClose}
            cancelProps={{'aria-label':'cancel'}}
            okProps={{'aria-label':'ok'}}>
            <Input 
              placeholder="请输入【云之家单据】中的查看码" 
              aria-label="Medium" 
              aria-labelledby="J_InputMedium" 
              onChange={this.inputChange.bind(this)}
            />
          </Dialog>
          {/* <div className={styles.paginationWrapper}>
            <Pagination />
          </div> */}
        </div>
      </div>
    );
  }
}