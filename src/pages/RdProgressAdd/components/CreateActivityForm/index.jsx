import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import axios from 'axios';
import qs from 'qs';
import moment from 'moment';
import styles from './index.module.scss';
import {
  Input,
  Button,
  Checkbox,
  Select,
  DatePicker,
  Switch,
  Radio,
  Grid,
  Form,
  NumberPicker,
} from '@alifd/next';
const rootUrl = 'http://localhost:3000'   
//腾讯云服务地址
// const rootUrl = 'http://49.234.40.20:3000'  

const { Row, Col } = Grid;

// FormBinder 用于获取表单组件的数据，通过标准受控 API value 和 onChange 来双向操作数据
const CheckboxGroup = Checkbox.Group;
const RadioGroup = Radio.Group;
const { RangePicker } = DatePicker;
const FormItem = Form.Item;

const formItemLayout = {
  labelCol: { xxs: "12", s: "4", l: "4", },
  wrapperCol: { s: "12", l: "10", }
};

@withRouter
export default class Index extends Component {
  static displayName = 'Index';

  static propTypes = {
    match: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
  }

  static defaultProps = {};

  constructor(props) {
    super(props);
    console.log(props)
    this.state = {
      pageId: '',
      mainProjectName: '',
      value: {
        projectName: '',
        progressId: '',
        progressTime: '',
        progressDetail: '',
        progressMoney: 0,
        progressRealMoney: 0,
        progressDeadline: '',
        progressDeadlineDetail: '',
        progressPercent: 0,
      },
    };
  }

  componentDidMount() {
    let id = this.props.location.state.pageId;
    let mainProjectName = this.props.location.state.mainProjectName;
    this.setState({
      pageId: id,
      mainProjectName: mainProjectName
    })
  }


  onFormChange = (value) => {
    this.setState({
      value,
    });
  };

  reset = () => {

  };

  
  pageJump = (obj) => {
    this.props.history.push(`/rdprogress?id=${obj.data.pageId}&name=${obj.data.mainProjectName}&projectAudit=${this.props.location.state.projectAudit}`)
    // this.props.history.push({
    //   pathname: `/rdprogress?id=${obj.data.pageId}&name=${obj.data.mainProjectName}&projectAudit=${this.props.location.state.projectAudit}`, // 待跳转的页面URL
    //   state: { 
    //     id: obj.data.pageId,
    //     name: obj.data.mainProjectName,
    //     projectAudit: this.props.location.state.projectAudit
    //   }, 
    // })
  }

  submit = (value, error) => {
    const _this = this
    if (error) {
      // 处理表单报错
    }else{
    // 提交当前填写的数据
      axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded';
      value.progressTime = moment(value.progressTime).unix()
      value.progressDeadline = moment(value.progressDeadline).unix()
      value.projectId = this.state.pageId
      axios.post(`${rootUrl}/api/progressNodeAdd`, qs.stringify(value))
      .then(res=>{
          console.log('res=>',res);
          _this.pageJump({
            url: '/rdprogress?id=' + _this.state.pageId,
            data: {
              pageId: _this.state.pageId,
              mainProjectName: _this.state.mainProjectName
            }
          })          
      })
      .catch(error=>{
          console.log('res=>',error);            
      })
    }
  };

  render() {
    return (
      <div className="create-activity-form">
        <div title="项目进度增加节点" className={styles.container}>
          <Form
            value={this.state.value}
            onChange={this.onFormChange}
          >
              <FormItem {...formItemLayout} label="节点名称："
                required
                requiredMessage="节点名称必须填写"
              >
                <Input name="projectName" className={styles.inputWidth} />
              </FormItem>

              <FormItem {...formItemLayout} label="节点序号："
                required
                requiredMessage="节点序号必须填写"
              >
                <Input name="progressId" className={styles.inputWidth} />
              </FormItem>

              <FormItem {...formItemLayout} label="计划完成时间：" 
                required
                requiredMessage="计划时间必须填写">
                <DatePicker style={{width: '100%'}} name="progressTime" />
              </FormItem>
              
              {/* <FormItem {...formItemLayout} label="项目节点计划时间：">
                <Select
                  name="area"
                  dataSource={[
                    { label: '区域一', value: 'location1' },
                    { label: '区域二', value: 'location2' },
                  ]}
                />
              </FormItem> */}


              {/* <FormItem {...formItemLayout} label="主要实施节点："
                required
                requiredMessage="主要实施节点必须填写"
                style={{display: 'none'}}
              >
                <Input name="progressDetail" className={styles.inputWidth} />
              </FormItem> */}

              <FormItem {...formItemLayout} label="计划费用："
                required
                requiredMessage="计划费用必须填写"
              >
                <Input name="progressMoney" className={styles.inputWidth} />
              </FormItem>

              <FormItem {...formItemLayout} label="实际费用："
              >
                <Input name="progressRealMoney" className={styles.inputWidth} />
              </FormItem>
              
              <FormItem {...formItemLayout} label="实际完成时间：" 
              >
                <DatePicker name="progressDeadline" style={{width: '100%'}} />
              </FormItem>
              
              <FormItem {...formItemLayout} label="完成情况："
              >
                <Input name="progressDeadlineDetail" className={styles.inputWidth} />
              </FormItem>

              <FormItem {...formItemLayout} label="完成百分比："
              >
                <NumberPicker min={0} max={100} name="progressPercent" />
              </FormItem>
              <FormItem {...formItemLayout} label=" ">
                <Form.Submit type="primary" validate onClick={this.submit}>
                  立即创建
                  </Form.Submit>
                <Form.Reset className={styles.resetBtn} onClick={this.reset}>
                  重置
                  </Form.Reset>
              </FormItem>
          </Form>
        </div>
      </div>
    );
  }
}


