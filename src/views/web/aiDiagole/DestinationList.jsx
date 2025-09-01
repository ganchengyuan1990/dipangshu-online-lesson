/*eslint-disable*/

// DestinationList.js
import React, { useEffect, useState } from 'react';
import { getAiSound } from "../../../utils"
import { Result, Button } from 'antd'
import { useTravel } from './TravelContext';
import VideoPlayer from './VideoPlayer';
// import Markdown from 'markdown-to-jsx'
import Markdown from 'markdown-to-jsx'
// import Markdown from './MarkDown'
// import ReactMarkdown from "react-markdown";
import SearchBar from './SearchBar';
import './styles.less';


const DestinationList = () => {
  const { searchQueryResult, searchQuery, answerLoading, showActive, currentLessonIndex, setCurrentLessonIndex } = useTravel();
  const [currentLanguage, setCurrentLanguage] = useState('');


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
    setTimeout(async () => {
      // await getAiSound('https://www.coffeebeats.cn/uploads/1717249390229.mp3')
      const allADoms = document.querySelectorAll('a');
      for (let i = 0; i < allADoms.length; i++) {
        const _target = allADoms[i];
        _target.onclick = (e) => {
          const src = _target.getAttribute('src')
          console.log(src, '===outerHTML===')
          if (src) {
            window.open(src);
          }
          
        }
      }
    }, 500)

  }, [searchQueryResult])

  if (!showActive) {
    return null
  }

  if (searchQuery.length === 0 && searchQueryResult.length === 0) {
    return (
      <>
        <img src="https://oss-open.aichan.info/imgs/gif/downloadkkk.gif" className="introImg"></img>
        <div className="intro">{currentLanguage === 'en' ? 'Hello, I am your AI assistant, you can tell me any questions' : '您好，我是您的AI助手，有任何问题都可以对我说'}</div>

        <Button onClick={() => {
          setCurrentLessonIndex(currentLessonIndex + 1)
        }}>{currentLanguage === 'en' ? 'No problem, continue to the next lesson' : '没有问题，继续下一课'}</Button>
      </>
      
    )
  }

  if (searchQuery.length !== searchQueryResult.length && answerLoading) {
    return (
      <div className="destination-list">
        {/* <h2>十一假期想要避开人挤人，不妨考虑以下小众旅行地：</h2> */}
        <ul>
          {searchQuery.map((dest, index) => {
            if (index < searchQuery.length - 1) {
              return (
                <li key={index}>
                  <SearchBar index={index}></SearchBar>
                  {/* <div className='article-detail' dangerouslySetInnerHTML={{ __html: searchQueryResult[index] || '' }} /> */}
                  <div className="destination-answer"><Markdown>{searchQueryResult[index]?.content}</Markdown></div>
                  {dest?.lessonId ? <div className="lesson-info"  onClick={() => {
                    window.open(`https://www.coffeebeats.cn/v2-online/index.html#/lesson/${dest.lessonId}`)
                  }}>{currentLanguage === 'en' ? 'This content comes from the following courses, please click to view' : '该内容来自以下课程，请点击查看'}</div> : null}
                </li>
              )
            } else {
              return (
                <li key={index}>
                  <SearchBar index={index}></SearchBar>
                  <div className="message-box-f50daf primary-_0d1e0"><div className="message-box-content-wrapper-_856da"><div className="message-content message-box-content-_106c9 primary-_0d1e0"><span className="flex items-baseline"><div className="dot-flashing-_2676d"></div></span></div></div></div>
                </li>
              )
            }
          })}
        </ul>
      </div>
    )
  }

  return (
    <div className="destination-list">
      <ul>
        {searchQueryResult.map((dest, index) => (
          <li key={index}>
            <SearchBar index={index}></SearchBar>
            {/* <div className='article-detail' dangerouslySetInnerHTML={{ __html: dest }} /> */}
            <img className="aiPeople" src="https://cdn.coffeebeats.cn/WechatIMG3145.jpeg-smaller" />
            <div className="destination-answer"><Markdown>{dest.content}</Markdown></div>
            {dest?.videoUrl ? <VideoPlayer src={dest?.videoUrl} startTime={dest?.startTime} endTime={dest?.endTime}></VideoPlayer> : null}
            {dest?.lessonId ? <div className="lesson-info" onClick={() => {
              window.open(`https://www.coffeebeats.cn/v2-online/index.html#/lesson/${dest.lessonId}`)
            }}>{currentLanguage === 'en' ? 'This content comes from the following courses, please click to view' : '该内容来自以下课程，请点击查看'}</div> : null}
          </li>
        ))}
      </ul>
      <Button onClick={() => {
          setCurrentLessonIndex(currentLessonIndex + 1)
        }}>{currentLanguage === 'en' ? 'No problem, continue to the next lesson' : '没有问题，继续下一课'}</Button>
    </div>
  );
};

export default DestinationList;