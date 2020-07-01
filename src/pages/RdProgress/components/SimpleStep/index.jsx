import React, { Component } from 'react'
import { Step, Button, Dialog } from '@alifd/next'
import styles from './index.module.scss'
import emitter from "./../../ev"
import URL from 'url'

const { Item: StepItem } = Step;
const { Group: ButtonGroup } = Button;

export default class SimpleStep extends Component {
  static displayName = 'SimpleStep';

  static propTypes = {};

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      totalFinishSign: true,
      itemFinishSign: true,
      pageData: this.props.componentData,
      projectMoney: 0,
      projectAudit: 0,
      activeKey: [
        [
          {
            id:1,
            progressId: '1.1',
            progress: 100,
            projectName: 'aaa',
          },{
            id:2,
            progressId: '1.2',
            progress: 30,
            projectName: 'bbb'
          }
        ],[
            {
            id:3,
            progressId: '2',
            progress: 100,
            projectName: 'ccc',
          }
        ],[
          {
            id:1,
            progressId: '1.1',
            progress: 100,
            projectName: 'aaa',
          },{
            id:2,
            progressId: '1.2',
            progress: 30,
            projectName: 'bbb'
          }
        ],[
          {
            id:1,
            progressId: '1.1',
            progress: 100,
            projectName: 'aaa',
          },{
            id:2,
            progressId: '1.2',
            progress: 30,
            projectName: 'bbb'
          }
        ]
      ],
    };
  }

  componentDidMount() {
    const _this = this;
    // 声明一个自定义事件
    // 在组件装载完成以后
    // 删除节点监听
    // this.eventEmitter = emitter.addListener("callMe", (obj)=>{
    //   console.log(obj)
    //   let Arr = []
    //   let _progressIdSplit = obj.progressId.split('.')
    //   for(let i = 0; i < this.state.activeKey.length; i++){
    //     let newData = this.state.activeKey[i].filter(function(item) {
    //       return item['id'] != obj.id;
    //     });
    //     if(newData && newData.length) {
    //       Arr.push(newData)
    //     }
    //   }
    //   this.setState({
    //     activeKey: Arr,
    //   })
    // });
    // 删除节点监听结束
    
    this.eventEmitter = emitter.addListener("callMe", (obj)=>{
      let Arr = []
      this.setState({
        projectAudit: obj.projectAudit,
      })
    });
    this.initData(this.state.pageData)
  }

    // 组件销毁前移除事件监听
  componentWillUnmount(){
      emitter.removeListener('callMe', this.eventEmitter._events.callMe);
  }

  initData(arr) {
    let initArr = []
    let itemArr = []
    let _projectMoney = 0
    for(let i = 0; i < arr.length; i++) {
      let arrItem = arr[i]
      let progressId = arrItem['progressId']
      let progressIdSplit = progressId.split('.')
      let nextArrItem = i < arr.length-1 ? arr[i + 1] : []
      let nextProgressId = i < arr.length-1 ? nextArrItem['progressId'] : ''
      let nextProgressIdSplit = i < arr.length-1 ?  nextProgressId.split('.') : []

      if(progressIdSplit[1]) {
        _projectMoney = _projectMoney + parseInt(arrItem.progressMoney)
      }

      itemArr.push({
        'id': arrItem.id,
        'progressId': arrItem.progressId,
        'progressPercent': arrItem.progressPercent,
        'projectName': arrItem.projectName
      })

      if( !progressIdSplit[1] ){
        //主节点
        if( arrItem.progressPercent == 100 ) {
          //完成的主节点
          if(progressIdSplit[0] != nextProgressIdSplit[0]) {
            //无子节点的主节点
            
            initArr.push(itemArr)
            itemArr = []
          }
        }else{
          //未完成的主节点
          if(progressIdSplit[0] != nextProgressIdSplit[0]) {
            initArr.push(itemArr)
            itemArr = []
          }
        }
      }else{
        //子节点
          if(arrItem.progressPercent == 100) {
            //完成的子节点
            if(progressIdSplit[0] == nextProgressIdSplit[0]) {
              //不是最后一个子节点
            }else{
              //最后一个子节点
              initArr.push(itemArr)
              itemArr = []
            }
            
          }else{
            //未完成的子节点
            if(progressIdSplit[0] == nextProgressIdSplit[0]) {
            //不是最后一个子节点
            }else{
              //最后一个子节点
              initArr.push(itemArr)
              itemArr = []
            }
            
        }
      }
    }
    this.setState({
      activeKey: initArr,
      projectMoney: _projectMoney,
      projectAudit: this.props.projectAudit
    })
  }

  mainProgress = (arr) => {
    let Options =arr.map((station, i)=> {
      let _thisMainProgressData = parseInt(station[0].progressPercent)
      return <StepItem className={_thisMainProgressData == 100 ? 'mainProgressNodeDone' : _thisMainProgressData > 0 ? 'mainProgressNodeDoing' : 'mainProgressNode'} title={station[0]['progressId'] + ' ' + station[0]['projectName']} key={i} />
    })
    return (
      <div className='mainProgressComp'>
        <Step
          readOnly
          style={{marginBottom: '6px'}}
        >
          {Options}
        </Step>
      </div>
    )
  }

  childProgress = (arr) => {
    let Options = []
    let childProgressItem = arr.map((station, i) => {
      if( station.length > 1){
        Options.push(
          <div key={'childProgress' + i} 
            className="RdStepBox" 
            style={{
              display: 'inline-block', 
              verticalAlign: 'top', 
              width: i==arr.length-1 ? 'auto' : parseInt(100/arr.length) + '%'
            }}
          >
            <Step 
              readOnly
              shape="dot" 
              direction="ver"
            >
              {station.map((indexData, i) => {
                let progress = indexData.progressPercent ? parseInt(indexData.progressPercent) : 0
                if(!station[i]['progressId'].split('.')[1]){
                }else{
                  return <StepItem 
                    className={progress == 100 ? 'progressChildNodeDone' : progress > 0 ? 'progressChildNodeDoing' : 'progressChildNode'}
                    key={'node' + i} 
                    title={indexData.progressId + ' ' + indexData.projectName} 
                  />
                  }
                }
              )}
            </Step>
          </div>
        )
      }else{
        Options.push(<div key={'childProgress' + i} className="RdStepBox" style={{display: 'inline-block', verticalAlign: 'top', visibility:'hidden', width: i==arr.length-1 ? 'auto' : parseInt(100/arr.length) + '%'}}><Step shape="dot" direction="ver" ></Step></div>)
      }
    })
    return Options
  }

  render() {

    return (
      <div title="项目节点">
        <div className={styles.projectBox}>
          <p className={styles.title}>
            {this.props.mainProjectName}
            {
              this.state.projectAudit == 1 ? 
              <span className={styles.auditPass}>审核通过</span> : 
              this.state.projectAudit == 2 ? <span className={styles.auditNopass}>被驳回</span> :
              <span className={styles.auditWait}>待审核</span>}
          </p>
          <p className={styles.money}>项目预算：{this.state.projectMoney}</p>
        </div>
        <div className={styles.pageBox}>
          {this.mainProgress(this.state.activeKey)}
          <div style={{textAlign: 'center'}} className={styles.nextStep}> 
            {this.childProgress(this.state.activeKey)}
          </div>
          <div className={styles.legendBox}>
            <span className={styles.legend1}><i className={styles.finishIcon}></i><span>已完成</span></span>
            <span className={styles.legend2}><i className={styles.doingIcon}></i><span>进行中</span></span>
            <span className={styles.legend3}><i className={styles.icon}></i><span>未开始</span></span>
          </div>
        </div>
      </div>
    );
  }
}


