/*eslint-disable*/

import React, { useReducer, useState, useEffect, useRef, useMemo } from 'react'
import useMount from '@/hooks/useMount'
import { Button, Radio, Tooltip, Icon, Input, Spin } from 'antd'
import TravelPage from "../aiDiagoleModal";
// import TravelPage from "../aiDiagoleModal/indexV2";
import TravelPageImg from "../workTable/index";
import JoLPlayer from "jol-player";
import {
  Player,
  ControlBar,
  PlayToggle, // PlayToggle 播放/暂停按钮 若需禁止加 disabled
  ReplayControl, // 后退按钮
  ForwardControl,  // 前进按钮
  CurrentTimeDisplay,
  TimeDivider,
  PlaybackRateMenuButton,  // 倍速播放选项
  VolumeMenuButton
} from 'video-react';
import "video-react/dist/video-react.css"; 

const { Search } = Input;

import { ANNOUNCEMENT } from '@/config'
import useFetchLesson from '@/hooks/useFetchLesson'
import { withRouter } from 'react-router-dom'
import axios from '@/utils/axios'
import { LogoutOutlined, CloseOutline } from "@ant-design/icons";

import { Modal, Toast } from 'antd-mobile';
import 'antd-mobile/lib/modal/style/css';
import 'antd-mobile/lib/toast/style/css';
import './index.less';

function Lesson(props) {
  // let isBuyed = false
  useMount(() => {
    try {
      const search = props.location.search
      const _array = search.split('?')
      const _value = _array[1]
      const _param = _value.split('=')[1]
      setCatIndex(_param)
    } catch (e) {
      console.log(e)
    }
    // axios
    //   .get('https://www.coffeebeats.cn/getPinOrdersByOnlinelessonid', {
    //     params: {
    //       openid: userInfo ? JSON.parse(userInfo).openid : '',
    //       online_lesson_id: props.match.params.id,
    //     }
    //   })
    //   .then(response => {
    //     if (response.resultLists.length > 0) {
    //       isBuyed = true
    //       setTimeout(() => {
    //         var ele = document.querySelector('.app-main')
    //         if (!ele) {
    //           return
    //         }
    //         ele.scrollTop = ele.scrollHeight
    //       }, 200)
    //     } else {
    //       Message.error('您未购买该课程！')
    //       setTimeout(() => {
    //         window.history.back(-1)
    //       }, 2500)
    //     }
    //   })
  })

  const videoRef = React.useRef(null);

  const defaultRadio = 0
  const [radio, setRadio] = useState(defaultRadio)
  const [loading, showLoading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [aiInput, setAiInput] = useState(false);
  const [showDiaModal, setShowDiaModal] = useState(false);
  const [showImgModal, setShowImgModal] = useState(false);


  const [openingUrl, setOpeningUrl] = useState("");
  const [chosenType, setChosenYype]=  useState("");
  const [aiImg, aiImgSetter] = useState('')


  const [duomeitiArr, setDuomeitiArr] = useState([])
  const [chosenFlag, setChosenFlag] = useState(false)
  const [classOver, setClassOver] = useState(false)
  const [processIndex, setProcessIndex] = useState(0)
  const [catIndex, setCatIndex] = useState(0)
  const [title, setTitle] = useState('')
  const userInfo = window.localStorage.getItem('onlineUser')

  const onChange = e => {
    console.log(e.target.value, processIndex, chosenFlag)
    setChosenFlag(true)
    setRadio(e.target.value)
  }

  const { dataList: initData } = useFetchLesson({
    withLoading: false,
    requestUrl: 'https://www.coffeebeats.cn/getOnlineLessonV2ById',
    queryParams: {
      id: props.match.params.id,
      catIndex: window.location.href.split('=')[1],
    }
  })

  // const dataList = []

  const [dataList, setDataList] = useState(initData)

  useEffect(() => {
    setDuomeitiArr((dataList || []).filter(x => {
      return x.type !== 1; 
    }))
    setDataList(initData);
  }, [initData])

  const duomeitiArrV2 = useMemo(() => {
    return (dataList || []).filter(x => {
      return x.type !== 1; 
    })
  }, [dataList.length])

  // const toggleAiImg = () => {
  //   setAiInput(!aiInput)
  // }

  const toggleAiImg = () => {
    // setAiInput(!aiInput)
    // props.history.push(`/workTable`)
    setShowImgModal(true);
  }

  const toggleAiDialog = () => {
    // props.history.push(`/aiDiagole`)
    setShowDiaModal(true);
  }

  const getAiImg = async (word) => {
    // const newDataList = JSON.parse(JSON.stringify(dataList))

    // newDataList.splice(processIndex + 1, 0, {
    //   type: 1,
    //   value: '123123',
    //   shown: true,
    //   // type: 2,
    //   // value: `data:image/png;base64,${res.data.ResultImage}`
    // })
    // setDataList(newDataList)
    // return
    showLoading(true);
    axios
      .post('https://www.coffeebeats.cn/tencent/wordToImg', {
        "prompt": word,
        "Styles": [
            "101"
        ]
      }).then(res => {
        showLoading(false);
        console.log(res, '===res==')
        if (!res.data.ResultImage) {
          Toast.fail('请稍等再试');
          return
        }
        const newDataList = JSON.parse(JSON.stringify(dataList))
        newDataList.splice(processIndex, 0, {          
          type: 2,
          shown: true,
          value: `data:image/png;base64,${res.data.ResultImage}`
        })
        setDataList(newDataList)
        // aiImgSetter(`data:image/png;base64,${res.data.ResultImage}`)
      }).catch(e => {
        showLoading(false);
      })
  }

  // debugger

  const onButtonClick = () => {
    // const targetList = JSON.parse(JSON.stringify(dataList))
    for (let i = 0; i < dataList.length - 1; i++) {
      if (!dataList[i].shown) {
        dataList[i].shown = true
        setProcessIndex(i)
        videoRef.current && videoRef.current.load()
        break
      } else if (dataList[i].shown && !dataList[i + 1].shown) {
        if (dataList[i].type === 4 && !chosenFlag) {
          // if (dataList[i + 1].type !== 4) {
          //   setChosenFlag(false)
          // }
          return
        } else {
          setChosenFlag(false)
          dataList[i + 1].shown = true
          setProcessIndex(i + 1)
        }
        break
      }
    }
    if (dataList[dataList.length - 1] && dataList[dataList.length - 1].shown && !classOver) {
      // Message.success('课程结束, 请点击返回键')
      const catIndex = parseInt(window.location.href.split('=')[1]);
      const nextSectionInfo = JSON.parse(window.localStorage.getItem('nextSectionInfo') || '{}');
      Modal.alert(
        '您已阅读完本章节的内容',
        '请选择是否返回目录',
        [
          {
            text: '否', onPress: () => {
              // console.log('cancel')
              // if (catIndex > 0) {
              //   setTimeout(() => {
              //     location.reload();
              //   }, 300)
              // } else {
              //   Toast.fail('没有上一节内容');
              // }
            }
          },
          {
            text: '是', onPress: () => {
              console.log('cancel')
              window.history.go(-1);
              // setTimeout(() => {
              //   location.reload();
              // }, 300)
            }
          },
        ]
      )
      setClassOver(true)

    }
    let initData = window.localStorage.getItem('historyData') || '[]'
    initData = JSON.parse(initData)
    if (initData.length === undefined) {
      initData = []
    }
    const historyData = {
      id: props.match.params.id,
      // catIndex: catIndex,
      version: window.localStorage.getItem('currentLessonVersion') || '1',
      dataList: dataList,
      classOver: classOver,
    }
    const _targetIndex = initData.findIndex(item => item.id === props.match.params.id)
    if (_targetIndex >= 0) {
      initData[_targetIndex] = historyData
    } else {
      initData.push(historyData)
    }
    window.localStorage.setItem('historyData', JSON.stringify(initData))
    setDataList(dataList)
    setTitle(title + ' ')
    setTimeout(() => {
      var ele = document.querySelector('.app-main');
      if (!ele) {
        return
      }
      ele.scrollTop = ele.scrollHeight
    }, 200)
  }
  // const [state, dispatch] = useReducer(reducer, { list: dataList })

  console.log(dataList, '=====dataList====')

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    console.log(998)
    setIsModalOpen(false);
  };

  const getType = (value) => {

    const a = [
      {
        value: 1,
        name: "文字"
      },
      {
        value: 2,
        name: "图片"
      },
      {
        value: 3,
        name: "视频"
      },
      {
        value: 4,
        name: "选择题"
      },
      {
        value: 5,
        name: "音频"
      },
      {
        value: 6,
        name: "下载文件"
      }
    ];
    return a.find(x => x.value === value).name || ""
  }

  const getName = (url) => {
    "https://www.coffeebeats.cn/uploads/1694660404866-图片：小猫毛料与成品料对比.jpg"
    const a = url.split('-');
    if (a[1]) {
      return a[1].split('.')[0]
    }
    return url;
  }
  return (
    <div className="wrapper" style={{maxWidth: '80%', marginTop: '60px', marginLeft: '24px', marginBottom: '100px'}}>
      { loading ? <div className="loadingWrapper">
        <Spin />
      </div> : null}
    

      <div style={{}}>
        {/* {userInfo && userInfo.user_name && <div>欢迎{userInfo.user_name}登录</div>}
        {props.children} */}
        {dataList && dataList.map((item, index) => (
          item.shown && (item.type === 1 ?
            <div key={index} className='show_words'>
              <div style={{ marginRight: 20 }}>{item.value}</div>
              <span onClick={() => {
                props.history.push(`/lesson/${props.match.params.id}/remark/${index}?cat=${window.location.href.split('=')[1]}`)
              }} style={{ position: 'absolute', top: '50%', right: '-10px', transform: 'translate(-50%, -50%)' }}>
                {/* <Icon type="question-circle" /> */}
                </span>
              {item.mp3FilePath ?  <audio controls="controls" id="audioId" width="100" height="100" style={{ marginTop: '12px' }} src={item.mp3FilePath}></audio> : null}
            </div>
            : item.type === 2 ? <img key={index} className='show_pics' src={item.value}></img>
              : item.type === 3 ? 
              <Player
                ref={c => {
                  // this.player = c;
                }}
                autoPlay='false'
                startTime={0}
                style={{ width: '80%' }}
                playsInline ='true'
                src={item.value}
              >
                
                <ControlBar autoHide={false} disableDefaultControls={false}>
                  <ReplayControl seconds={10} order={1.1} />
                  <PlayToggle />
                  <CurrentTimeDisplay order={4.1} />
                  <TimeDivider order={4.2} />
                  <PlaybackRateMenuButton rates={[5, 2, 1.5, 1, 0.5]} order={7.1} />
                  <VolumeMenuButton />
                </ControlBar>
              </Player>
            // <video src={item.value} className='show_videos' controls='controls' autoplay='autoplay'></video>
                : item.type === 5 ? <audio src={item.value} className='show_videos' controls='controls' autoplay='autoplay'></audio>
                  : item.type === 6 ? <div><a src={item.value} onClick={() => window.open(item.value)}>下载{item.value.match(/\[\S*\]/) && item.value.match(/\[\S*\]/)[0] || '[此图纸]'}</a></div>
                    : item.type === 7 ? 
                      <div type='primary' className='aiImg'>
                        <div className='aiWrap'>
                          <div className='aiButtonV2' onClick={toggleAiImg}>文生图</div>
                          <div className='aiButton' onClick={toggleAiDialog}>AI对话</div>
                        </div>
                      </div>
                    : <div>
                      <div className='radio-title'>{item.title}</div>
                      <Radio.Group onChange={onChange} value={item.defualtValue} buttonStyle='solid'>
                        {item.value.split(',').map((ele, index) => <Radio.Button value={index + 1}>{ele}</Radio.Button>)
                        }
                      </Radio.Group>
                    </div>)
        ))}
        <div>
        </div>
        {aiInput ? null : <div type='primary' onClick={onButtonClick} className='button-bottom'>
          <img src='https://www.coffeebeats.cn/uploads/1585553433162-huiche2.png' />
        </div>}
        {/* { !aiInput ? <div type='primary' onClick={toggleAiImg} className='button-bottom-tiny aiImg'>
          文生图
        </div> : <div type='primary' onClick={toggleAiImg} className='button-bottom-tiny'>
          切换回去
        </div>} */}
        {aiInput ? <div type='primary' onClick={toggleAiImg} className='button-bottom-left'>
          <Tooltip title="输入想生成的图片描述后，点击生成图片即可！" placement="top">
            <Search
              placeholder="请输入文字描述"
              enterButton="生成图片"
              size="large"
              onClick={(e) => {
                e.stopPropagation();
              }}
              onSearch={value => getAiImg(value)}
            />
          </Tooltip>
        </div> : null}
      </div>
      <div className="caozuolan">
        <div className="caozuolanWrapperV2">
          <div className="title" onClick={toggleAiDialog}>AI对话</div>
        </div>
      </div>
      <div className="caozuolan">
        <div className="caozuolanWrapper">
          <div className="title">参考栏</div>
          {duomeitiArrV2 && duomeitiArrV2.map((item, index) => (
            <div onClick={() => {
              if (item.type === 6) {
                window.open(item.value)
                return
              }
              // window.open(item.value)
              setOpeningUrl(item.value)
              setChosenYype(item.type)
              setIsModalOpen(true);
            }}>{getName(item.value)}</div>
          ))}
        </div>
      </div>
      { isModalOpen ? <Modal title="素材详情" visible={isModalOpen} onOk={handleOk} onCancel={() => {
        handleCancel()
      }}>
        <span className="closeIcon" onClick={handleCancel}><Icon type="close-circle" /></span>
        <span className="closeIconV2" onClick={() => {
          window.open(openingUrl)
        }}>新开页面查看</span>
        <div className="modalWrap">
          {/* <img src={openingUrl} /> */}
          { chosenType === 2 ? <img src={openingUrl} /> : <video controls>
            <source src={openingUrl} type="video/mp4" />
          </video> }
        </div>
      </Modal> : null}
      <Modal closable={true}  title="AI助手" visible={showDiaModal} onOk={() => {
        setShowDiaModal(false);
      }}  onClose={() => {
        setShowDiaModal(false);
      }}>
        <TravelPage />
      </Modal>

      <Modal title="AI助手" closable={true} visible={showImgModal} onOk={() => {
        setShowImgModal(false);
      }}  onClose={() => {
        setShowImgModal(false);
      }}>
        <TravelPageImg />
      </Modal>
    </div>
  )
}

export default withRouter(Lesson)
