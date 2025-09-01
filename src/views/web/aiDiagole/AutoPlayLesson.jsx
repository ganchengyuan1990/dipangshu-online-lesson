/*eslint-disable*/

// AutoPlayLesson.js
import React, { useEffect, useState, useRef, useMemo } from 'react';
import axios from '@/utils/axios'
import { withRouter } from 'react-router-dom'
import TravelPage from "../aiDiagoleModal";
import VideoPlayer from './VideoPlayer';
import { Result, Button, Tooltip, Icon } from 'antd'
import { Modal } from 'antd-mobile';

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

// import { getAiSound } from "../../../utils"
import { useTravel } from './TravelContext';
// import Markdown from 'markdown-to-jsx'
import Markdown from 'markdown-to-jsx'
// import Markdown from './MarkDown'
// import ReactMarkdown from "react-markdown";
import SearchBar from './SearchBar';
import './styles.less';
// import '../../../styles/app.less';


function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


const AutoPlayLesson = (props) => {
  const lessonDataRef = useRef([]);
  const { canShowActive, currentLessonIndex, searchQueryResult, setSearchQueryResult } = useTravel();
  const [lessonData, lessonDataSetter] = useState([]);
  const [currentImage, setCurrentImage] = useState('');
  const [showImageModal, setShowImageModal] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('');
  const [aliyunVideoSuffix, setAliyunVideoSuffix] = useState('');
  const [canActive, setCanActive] = useState(false);
  const [startLesson, setStartLesson] = useState(false);
  const [pause, setPause] = useState(false);
  const [showPause, setShowPause] = useState(false);
  const [showDiaModal, setShowDiaModal] = useState(false);

  const [currentPlayIndex, setCurrentPlayIndex] = useState(0);
  const [lessonIndex, setLessonIndex] = useState(0);

  const [openingUrl, setOpeningUrl] = useState("");
  const [chosenType, setChosenYype]=  useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);


  const videoRef = useRef(null);


  const getAiSound = async (mp3, index) => {
    const newLesson = JSON.parse(JSON.stringify(lessonDataRef.current));
    newLesson[index].shown = true;
    // newLesson[index + 1].shown = true;
    lessonDataSetter(newLesson)
    lessonDataRef.current = newLesson;
    document.querySelector('.app-main').scrollTo(0, document.querySelector('.app-main').scrollHeight);
    return new Promise((resolve, reject) => {
      let audio = document.getElementById("audioId")
      audio.src = mp3
      audio.addEventListener("canplay", () => {
        // console.log(audio.src, 988)
        audio.playbackRate = 12
        audio.play()
        // window.URL.revokeObjectURL(audio.src);
      });
      audio.addEventListener("ended", () => {
        // console.log(audio.src, '===ended====')
        document.querySelector('.app-main').scrollTo(0, document.querySelector('.app-main').scrollHeight);
        // lessonDataRef.current = newLesson;
        // lessonDataSetter(newLesson)
        resolve()
        // window.URL.revokeObjectURL(audio.src);
      })
    })
  }

  const toggleAiImg = () => {
    // setAiInput(!aiInput)
    // props.history.push(`/workTable`)
    // window.open()
    setPause(true);
    console.log(currentPlayIndex, '==currentPlayIndex==')
    window.currentPlayIndex = currentPlayIndex;
    window.sessionStorage.setItem('currentPlayIndex', currentPlayIndex);
    const timeStr = Date.now();
    window.open(`https://www.coffeebeats.cn/chat/index.html?userId=Jason0915${timeStr}&roomId=Jason0915Room${timeStr}`)
    setCurrentPlayIndex(window.currentPlayIndex);
    window.location.reload();
    setTimeout(() => {
      const newData = lessonData.map((e, idx) => {
        if (idx <= window.currentPlayIndex) {
          e.shown = true;
        }
        return e;
      });
      lessonDataSetter(newData);
    }, 2000)
  }

  const toggleAiDialog = () => {
    // props.history.push(`/aiDiagole`)
    setShowDiaModal(true);
  }

  const duomeitiArrV2 = useMemo(() => {
    return (lessonData || []).filter(x => {
      return x.type !== 1;
    })
  }, [lessonData.length])

  const judgeLanguage = () => {
    const preferredLanguage = window.localStorage.getItem('preferredLanguage');
    const historyData = window.localStorage.getItem('allLessonData');
    if (historyData) {
      const historyDataJson = JSON.parse(historyData);
      if (historyDataJson?.[0]?.lesson_title === '《工具九宫格|工具微精通》') {
        if (preferredLanguage) {
          setCurrentLanguage(preferredLanguage);
        }
      }
    }

  }

  useEffect(() => {
    const urlIdx = location.href.split('idx=')[1];
    const realLessonIndex = urlIdx || currentLessonIndex;
    judgeLanguage();
    canShowActive(false);
    setStartLesson(false);
    const historyData = window.localStorage.getItem('allLessonDataWithNoSteps');
    const realLessonData = JSON.parse(historyData || '[]');
    let newData = realLessonData[realLessonIndex]?.content?.[0]?.content;
    if (window.sessionStorage?.getItem('currentPlayIndex')) {
      newData.forEach((e, idx) => {
        if (idx <= window.sessionStorage?.getItem('currentPlayIndex')) {
          e.shown = true;
        }
      })
      setStartLesson(true);
      setShowPause(true);
      setCurrentPlayIndex(window.sessionStorage?.getItem('currentPlayIndex'));
      window.sessionStorage.removeItem('currentPlayIndex');
    }
    console.log(newData, 'newData')
    lessonDataSetter(newData);
    lessonDataRef.current = newData;
    // axios
    // // .post('https://www.coffeebeats.cn/ai/qwen/videoElements', {
    // .post('https://www.coffeebeats.cn/ai/qwen/picElements', {
    //   "prompt": '请告诉我图片里是什么',
    //   // "pic": "https://dashscope.oss-cn-beijing.aliyuncs.com/images/dog_and_girl.jpeg"
    //   "pic": "https://www.coffeebeats.cn/uploads/1738670954595-a18fa7bb4702f54906a912a8cf5369ac_64201_600_600.jpg!con"
    // }).then(res => {

    // })
  }, [currentLessonIndex])

  const getName = (url) => {
    "https://www.coffeebeats.cn/uploads/1694660404866-图片：小猫毛料与成品料对比.jpg"
    const a = url.split('-');
    if (a[1]) {
      return a[1].split('.')[0]
    }
    return url;
  }

  const autoPlayLesson = async (data) => {
    for (let i = 0; i < data.length; i++) {
      if (data[i].type === 1) {
        await getAiSound(currentLanguage === 'en' ? lessonData[i].mp3FilePathEn : lessonData[i].mp3FilePath, i)
        await sleep(500);
        setShowImageModal(false);
        setCurrentPlayIndex(i + 1);
      } else {
        const newLesson = JSON.parse(JSON.stringify(lessonDataRef.current));
        newLesson[i].shown = true;
        lessonDataSetter(newLesson)
        lessonDataRef.current = newLesson;
        if (data[i].type === 2) {
          setCurrentImage(data[i].value);
          setShowImageModal(true);
          await sleep(5000);
          setShowImageModal(false);
        }
        else if (data[i].type === 3) {
          // const inter = setInterval(async () => {
          //   const videoDom = document.querySelector('.iiivideo')
          //   console.log(videoDom, '===videoDom===')
          //   if(videoDom.readyState > 0) {
          //     // 在这里获取时长，不然有可能获取错误的视频时长，获取到的时长是一个string格式，注意格式化
          //     console.log(parseFloat(videoDom.duration, 10), 'videoDom===3333')
          //     clearInterval(inter)
          //     clearInterval(i);
          //     videoDom.play();
          //     await sleep(10 * 1000);
          //     setShowVideoModal(false);

          //   }
          // }, 1000);
          const [enVideoRes, videoRes] = await Promise.all([
            axios
              // .post('https://www.coffeebeats.cn/ai/qwen/videoElements', {
              .post('https://www.coffeebeats.cn/getAliOssFileUrl', {
                fileName: data[i].enValue && data[i].enValue.split('com/')[1]
              }),
            axios
              // .post('https://www.coffeebeats.cn/ai/qwen/videoElements', {
              .post('https://www.coffeebeats.cn/getAliOssFileUrl', {
                fileName: data[i].value && data[i].value.split('com/')[1]
              }),
          ]);


          console.log(data[i].enValue, enVideoRes?.url, '==enVideoRes?.data?.url==')
          newLesson[i].enValue = enVideoRes?.url;
          lessonDataSetter(newLesson)
          lessonDataRef.current = newLesson;

          setAliyunVideoSuffix(enVideoRes?.url?.split('.mp4')?.[1]);

          setCurrentImage(currentLanguage === 'en' ? enVideoRes?.url : data[i].value);
          setShowVideoModal(true);
          await sleep(1500);
          const videoDom = document.querySelector('.iiivideo')
          if (videoDom?.readyState > 0) {
            // 在这里获取时长，不然有可能获取错误的视频时长，获取到的时长是一个string格式，注意格式化
            // console.log(parseFloat(videoDom.duration, 10), 'videoDom===3333')
            videoDom.play();
            await sleep(Number(videoDom.duration) * 1000);
            // await sleep(1000);
            // await sleep(1000);
            setShowVideoModal(false);
          }

        }
        else {
          setShowImageModal(false);
          setShowVideoModal(false);
        }
        document.querySelector('.app-main').scrollTo(0, document.querySelector('.app-main').scrollHeight);
        await sleep(data[i].type === 3 ? 3000 : 1500);
        setCurrentPlayIndex(i + 1);
      }
    }

    await sleep(1000)
    canShowActive(true);
    await sleep(500)
    document.querySelector('.app-main').scrollTo(0, document.querySelector('.app-main').scrollHeight);
  }

  const resumePlayLesson = async (data) => {
    for (let i = currentPlayIndex; i < data.length; i++) {
      if (data[i].type === 1) {
        await getAiSound(currentLanguage === 'en' ? lessonData[i].mp3FilePathEn : lessonData[i].mp3FilePath, i)
        await sleep(500);
        setShowImageModal(false);
        setCurrentPlayIndex(i + 1);
      } else {
        const newLesson = JSON.parse(JSON.stringify(lessonDataRef.current));
        newLesson[i].shown = true;
        lessonDataSetter(newLesson)
        lessonDataRef.current = newLesson;
        if (data[i].type === 2) {
          setCurrentImage(data[i].value);
          setShowImageModal(true);
          await sleep(5000);
          setShowImageModal(false);
        }
        else if (data[i].type === 3) {
          // const inter = setInterval(async () => {
          //   const videoDom = document.querySelector('.iiivideo')
          //   console.log(videoDom, '===videoDom===')
          //   if(videoDom.readyState > 0) {
          //     // 在这里获取时长，不然有可能获取错误的视频时长，获取到的时长是一个string格式，注意格式化
          //     console.log(parseFloat(videoDom.duration, 10), 'videoDom===3333')
          //     clearInterval(inter)
          //     clearInterval(i);
          //     videoDom.play();
          //     await sleep(10 * 1000);
          //     setShowVideoModal(false);

          //   }
          // }, 1000);
          const [enVideoRes, videoRes] = await Promise.all([
            axios
              // .post('https://www.coffeebeats.cn/ai/qwen/videoElements', {
              .post('https://www.coffeebeats.cn/getAliOssFileUrl', {
                fileName: data[i].enValue && data[i].enValue.split('com/')[1]
              }),
            axios
              // .post('https://www.coffeebeats.cn/ai/qwen/videoElements', {
              .post('https://www.coffeebeats.cn/getAliOssFileUrl', {
                fileName: data[i].value && data[i].value.split('com/')[1]
              }),
          ]);


          console.log(data[i].enValue, enVideoRes?.url, '==enVideoRes?.data?.url==')
          newLesson[i].enValue = enVideoRes?.url;
          lessonDataSetter(newLesson)
          lessonDataRef.current = newLesson;

          setAliyunVideoSuffix(enVideoRes?.url?.split('.mp4')?.[1]);

          setCurrentImage(currentLanguage === 'en' ? enVideoRes?.url : data[i].value);
          setShowVideoModal(true);
          await sleep(1500);
          const videoDom = document.querySelector('.iiivideo')
          if (videoDom?.readyState > 0) {
            // 在这里获取时长，不然有可能获取错误的视频时长，获取到的时长是一个string格式，注意格式化
            videoDom.play();
            await sleep(Number(videoDom.duration) * 1000);
            // await sleep(1000);
            // await sleep(1000);
            setShowVideoModal(false);
          }

        }
        else {
          setShowImageModal(false);
          setShowVideoModal(false);
        }
        document.querySelector('.app-main').scrollTo(0, document.querySelector('.app-main').scrollHeight);
        await sleep(data[i].type === 3 ? 3000 : 1500);
        setCurrentPlayIndex(i + 1);
      }
    }

    await sleep(1000)
    canShowActive(true);
    await sleep(500)
    document.querySelector('.app-main').scrollTo(0, document.querySelector('.app-main').scrollHeight);
  }

  // if (!startLesson) {
  //   return (
  //     <>
  //       <Button type='primary' onClick={async () => {
  //         setStartLesson(true);
  //         setSearchQueryResult([]);
  //         // const newLesson = JSON.parse(JSON.stringify(lessonDataRef.current));

  //         await autoPlayLesson(lessonData);


  //       }}>{currentLanguage !== 'en' ? '开始课程' : 'Start Lesson'}</Button>
  //     </>
  //   )
  // }


  return (
    <div className="destination-list">
      <Modal title="素材详情" visible={showImageModal || showVideoModal} onOk={() => {
        setShowImageModal(false)
        setShowVideoModal(false);
      }} onCancel={() => {
        setShowImageModal(false)
        setShowVideoModal(false);
      }} closable={true} onClose={() => {
        setShowImageModal(false)
        setShowVideoModal(false);
      }} >
        {showImageModal && <img className="iiimage" src={currentImage}></img>}
        {showVideoModal && <video ref={videoRef} className="iiivideo" controls><source src={currentImage} type='video/mp4' /></video>}
      </Modal>

      <Modal className="gogogo" closable={true}  title="AI助手" visible={showDiaModal} onOk={() => {
        setShowDiaModal(false);
      }}  onClose={() => {
        setShowDiaModal(false);
      }}>
        <TravelPage />
      </Modal>
      { isModalOpen ? <Modal title="素材详情" visible={isModalOpen} onOk={() => {
        setIsModalOpen(true);
      }} onCancel={() => {
        setIsModalOpen(false);
      }}>
        <span className="closeIcon" onClick={() => {
          setIsModalOpen(false);
        }}><Icon type="close-circle" /></span>
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
      {lessonData && lessonData.map((item, index) => {

        return item.shown && (item.type === 1 ?
          <div key={index} className='show_words'>
            {item.from === 'agentAsk' ? <Card title="AI助教提示：" extra={<div>
            </div>}>
              <div style={{ marginRight: 20 }} className={`${item.from}`}><div dangerouslySetInnerHTML={{ __html: currentLanguage === 'en' ? item.enValue : item.value }} /></div>
            </Card> : item.from === 'agent' ? <Card title={item?.title || "AI助教回答："} extra={item?.answerType ? <div>{item?.answerType}</div> : item.noSide ? null : <div>
              <ButtonGroup>
                <Button>有效</Button>
                <Button>无效</Button>
                <Button>反馈</Button>
              </ButtonGroup>
            </div>}>
              <div onClick={() => {

              }} style={{ marginRight: 20 }} className={`${item.from}`}><div dangerouslySetInnerHTML={{ __html: currentLanguage === 'en' ? item.enValue : item.value }} /></div>
            </Card> : <div style={{ marginRight: 20 }} className={`${item.from}`}><div dangerouslySetInnerHTML={{ __html: currentLanguage === 'en' ? item.enValue : item.value }} /></div>}
            <span onClick={() => {
              props.history.push(`/lesson/${props.match.params.id}/remark/${index}?cat=${window.location.href.split('=')[1]}`)
            }} style={{ position: 'absolute', top: '50%', right: '-10px', transform: 'translate(-50%, -50%)' }}></span>
          </div>
          : item.type === 2 ? item.from === 'agent' ? <Card style={{ marginBottom: '20px' }} title={item?.title || "AI助教回答："} extra={item?.answerType ? <div>{item?.answerType}</div> : item.noSide ? null : <div>
            <ButtonGroup>
              <Button>有效</Button>
              <Button>无效</Button>
              <Button>反馈</Button>
            </ButtonGroup>
          </div>}>
            <div style={{ marginRight: 20 }} className={`${item.from}`}><img key={index} className='show_pics' src={item.value}></img></div>
          </Card> : <img key={index} className='show_pics' src={item.value}></img>
            : item.type === 3 ? item.from === 'agent' ? <Card style={{ marginBottom: '20px' }} title={item?.title || "AI助教回答："} extra={item?.answerType ? <div>{item?.answerType}</div> : item.noSide ? null : <div>
              <ButtonGroup>
                <Button>有效</Button>
                <Button>无效</Button>
                <Button>反馈</Button>
              </ButtonGroup>
            </div>}>
              <div style={{ marginRight: 20 }} className={`${item.from}`}>
                {/* <Player
                      ref={c => {
                        // this.player = c;
                      }}
                      // autoPlay={true}
                      startTime={0}
                      style={{ width: '80%' }}
                      playsInline='true'
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
                    </Player> */}
                {/* <video controls><source src={currentLanguage === 'en' ? `${item.enValue}` : item.value} type='video/mp4'/></video> */}
                <Button onClick={() => {
                  setShowVideoModal(true);
                  setCurrentImage(currentLanguage === 'en' ? item.enValue : item.value);
                }}>打开视频</Button>
              </div>
            </Card> :
              <div className='show_pics' key={index}>
                {/* <Player
                      ref={c => {
                        // this.player = c;
                      }}
                      // autoPlay='true'
                      startTime={0}
                      style={{ width: '80%' }}
                      playsInline='true'
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
                    </Player> */}
                {/* <video controls><source src={currentLanguage === 'en' ? `${item.enValue}` : item.value} type='video/mp4' /></video> */}
                <Button onClick={() => {
                  setShowVideoModal(true);
                  setCurrentImage(currentLanguage === 'en' ? item.enValue : item.value);
                }}>打开视频</Button>
              </div>
              // <video src={item.value} className='show_videos' controls='controls' autoplay='autoplay'></video>
              : item.type === 5 ? <audio src={item.value} className='show_videos' controls='controls' autoplay='autoplay'></audio>
                : item.type === 6 ? <div><a src={item.value} onClick={() => window.open(item.value)}>{currentLanguage === 'en' ? 'download' : '下载'}{item.value.match(/\[\S*\]/) && item.value.match(/\[\S*\]/)[0] || '[此图纸]'}</a></div>
                  : item.type === 7 ? <div type='primary' onClick={toggleAiImg} className='aiImg'></div>
                    : <div>
                      <div className='radio-title'>{item.title}</div>
                      <Radio.Group onChange={onChange} value={item.defualtValue} buttonStyle='solid'>
                        {item.value.split(',').map((ele, index) => <Radio.Button value={index + 1} key={index}>{ele}</Radio.Button>)
                        }
                      </Radio.Group>
                    </div>)
      })}
      {!startLesson || !showPause ? null : pause ? <Button onClick={() => {
        // setStartLesson(true);
        setShowPause(false);
        resumePlayLesson(lessonData);
        setPause(false);
      }}>继续播放</Button> : <Button onClick={() => {
        window.currentPlayIndex = currentPlayIndex;
        window.location.reload();
        setTimeout(() => {
          setCurrentPlayIndex(window.currentPlayIndex);
          newData = lessonData.map((e, idx) => {
            if (idx <= window.currentPlayIndex) {
              e.shown = true;
            }
            return e;
          });
          console.log(newData, 'newData===')
          lessonDataSetter(newData)
        }, 1000);
      }}>暂停播放</Button>}

      <div className='caozuolanWrap'>
        <div className="caozuolan">
          <div className="caozuolanWrapperV2">
            <div className="title" style={{ textDecoration: 'underline', marginBottom: '6px', color: '#1677ff', fontSize: '16px', cursor: "pointer" }} onClick={toggleAiDialog}>AI对答</div>
            {/* 开始和暂停按钮 */}
            {!startLesson ? (
              <Button type="primary" onClick={async () => {
                setStartLesson(true);
                setSearchQueryResult([]);
                await autoPlayLesson(lessonData);
              }}>开始课程</Button>
            ) : (
              pause ? (
                <Button type="primary" onClick={() => {
                  setShowPause(false);
                  resumePlayLesson(lessonData);
                  setPause(false);
                }}>继续播放</Button>
              ) : (
                  <Button type="primary" onClick={() => {
                    window.currentPlayIndex = currentPlayIndex;
                    const audioElement = document.getElementById("audioId");
                    if (audioElement && !audioElement.paused) {
                      audioElement.pause();
                    }
                    setPause(true);
                  }}>暂停播放</Button>
              )
            )}
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
      </div>

    </div>
  );
};

export default withRouter(AutoPlayLesson);
