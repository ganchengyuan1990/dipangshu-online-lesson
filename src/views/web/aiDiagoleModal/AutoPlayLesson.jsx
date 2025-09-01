/*eslint-disable*/

// AutoPlayLesson.js
import React, { useEffect, useState, useRef } from 'react';
import axios from '@/utils/axios'
import { Result, Button, Modal } from 'antd'

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
import './styles.css';
// import './styles.less';

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


const AutoPlayLesson = () => {
  const lessonDataRef = useRef([]);
  const { canShowActive, currentLessonIndex, searchQueryResult, setSearchQueryResult  } = useTravel();
  const [lessonData, lessonDataSetter] = useState([]);
  const [currentImage, setCurrentImage] = useState('');
  const [showImageModal, setShowImageModal] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('');
  const [canActive, setCanActive] = useState(false);
  const [startLesson, setStartLesson] = useState(false);
  const [lessonIndex, setLessonIndex]= useState(0);

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
        console.log(audio.src, 988)
        audio.playbackRate = 1.2
        audio.play()
        // window.URL.revokeObjectURL(audio.src);
      });
      audio.addEventListener("ended", () => {
        console.log(audio.src, '===ended====')
        document.querySelector('.app-main').scrollTo(0, document.querySelector('.app-main').scrollHeight);
        // lessonDataRef.current = newLesson;
        // lessonDataSetter(newLesson)
        resolve()
        // window.URL.revokeObjectURL(audio.src);
      })
    })
  }

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
    judgeLanguage();
    canShowActive(false);
    console.log(currentLessonIndex, '===effect====')
    setStartLesson(false);
    const historyData = window.localStorage.getItem('allLessonDataWithNoSteps');
    const realLessonData = JSON.parse(historyData || '[]');
    lessonDataSetter(realLessonData[currentLessonIndex]?.content?.[0]?.content);
    lessonDataRef.current = realLessonData[currentLessonIndex]?.content?.[0]?.content;
  }, [currentLessonIndex])

  console.log(lessonData, '==lessonData==')

  const autoPlayLesson = async (data) => {
    for(let i = 0; i < data.length; i++) {
      if (data[i].type === 1) {
        await getAiSound(lessonData[i].mp3FilePath, i)
        await sleep(500);
        setShowImageModal(false);
      } else {        
        const newLesson = JSON.parse(JSON.stringify(lessonDataRef.current));
        newLesson[i].shown = true;
        lessonDataSetter(newLesson)
        lessonDataRef.current = newLesson;
        if (data[i].type === 2) {
          setCurrentImage(data[i].value);
          setShowImageModal(true);
          await sleep(500);
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
          setCurrentImage(data[i].value);
          setShowVideoModal(true);
          await sleep(1500);
          const videoDom = document.querySelector('.iiivideo')
          console.log(videoDom, '===videoDom===')
          if(videoDom.readyState > 0) {
            // 在这里获取时长，不然有可能获取错误的视频时长，获取到的时长是一个string格式，注意格式化
            console.log(parseFloat(videoDom.duration, 10), 'videoDom===3333')
            videoDom.play();
            await sleep(Number(videoDom.duration) * 1000);
            setShowVideoModal(false);
          }
          
        } 
        else {
          setShowImageModal(false);
          setShowVideoModal(false);
        }
        document.querySelector('.app-main').scrollTo(0, document.querySelector('.app-main').scrollHeight);
        await sleep(data[i].type === 3 ? 3000: 1500);
      }
    }

    await sleep(1000)
    canShowActive(true);
    await sleep(500)
    document.querySelector('.app-main').scrollTo(0, document.querySelector('.app-main').scrollHeight);
  }

  if (!startLesson) {
    return (
      <Button type='primary' onClick={async () => {
        setStartLesson(true);
        setSearchQueryResult([]);
        // const newLesson = JSON.parse(JSON.stringify(lessonDataRef.current));
        // await getAiSound(lessonData[0].mp3FilePath, 0)
        // await getAiSound(lessonData[2].mp3FilePath, 2)

        await autoPlayLesson(lessonData);

        
      }}>{currentLanguage !== 'en' ? '开始课程' : 'Start Lesson'}</Button>
    )
  }

  return (
    <div className="destination-list">
      <Modal title="素材详情" visible={showImageModal || showVideoModal} onOk={() => {
        setShowImageModal(false)
        setShowVideoModal(false);
      }} onCancel={() => {
        setShowImageModal(false)
        setShowVideoModal(false);
      }}>
        { showImageModal && <img className="iiimage" src={currentImage}></img> }
        { showVideoModal && <video ref={videoRef} className="iiivideo" controls><source src={currentImage} type='video/mp4'/></video> }
      </Modal>
      {lessonData && lessonData.map((item, index) => {

        return item.shown && (item.type === 1 ?
          <div key={index} className='show_words'>
            {item.from === 'agentAsk' ? <Card title="AI助教提示：" extra={<div>
            </div>}>
              <div style={{ marginRight: 20 }} className={`${item.from}`}><div dangerouslySetInnerHTML={{ __html: item.value }} /></div>
            </Card> : item.from === 'agent' ? <Card title={item?.title || "AI助教回答："} extra={item?.answerType ? <div>{item?.answerType}</div> : item.noSide ? null : <div>
              <ButtonGroup>
                <Button>有效</Button>
                <Button>无效</Button>
                <Button>反馈</Button>
              </ButtonGroup>
            </div>}>
              <div onClick={() => {

              }} style={{ marginRight: 20 }} className={`${item.from}`}><div dangerouslySetInnerHTML={{ __html: item.value }} /></div>
            </Card> : <div style={{ marginRight: 20 }} className={`${item.from}`}><div dangerouslySetInnerHTML={{ __html: item.value }} /></div>}
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
                <video controls><source src={item.value} type='video/mp4'/></video>
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
                <video controls><source src={item.value} type='video/mp4' /></video>
              </div>
              // <video src={item.value} className='show_videos' controls='controls' autoplay='autoplay'></video>
              : item.type === 5 ? <audio src={item.value} className='show_videos' controls='controls' autoplay='autoplay'></audio>
                : item.type === 6 ? <div><a src={item.value} onClick={() => window.open(item.value)}>下载{item.value.match(/\[\S*\]/) && item.value.match(/\[\S*\]/)[0] || '[此图纸]'}</a></div>
                  : item.type === 7 ? <Tooltip title="点击试用" placement="rightTop" defaultVisible={true}><div type='primary' onClick={toggleAiImg} className='aiImg'></div></Tooltip>
                    : <div>
                      <div className='radio-title'>{item.title}</div>
                      <Radio.Group onChange={onChange} value={item.defualtValue} buttonStyle='solid'>
                        {item.value.split(',').map((ele, index) => <Radio.Button value={index + 1} key={index}>{ele}</Radio.Button>)
                        }
                      </Radio.Group>
                    </div>)
      })}
    </div>
  );
};

export default AutoPlayLesson;
