/*eslint-disable*/

// DestinationList.js
import React, { useEffect } from 'react';
import axios from '@/utils/axios'
import { getAiSound } from "../../../utils"
import { Result, Button, message } from 'antd'
import { useTravel } from './TravelContext';
import VideoPlayer from '../aiDiagole/VideoPlayer';
// import Markdown from 'markdown-to-jsx'
import Markdown from 'markdown-to-jsx'
// import Markdown from './MarkDown'
// import ReactMarkdown from "react-markdown";
import SearchBar from './SearchBar';
import './styles.css';
// import './styles.less';


const DestinationList = () => {
  const { searchQueryResult, searchQuery, answerLoading, showActive, currentLessonIndex, setCurrentLessonIndex } = useTravel();

  useEffect(() => {
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
        <div className="intro">您好，我是您的AI助手，有任何问题都可以对我说</div>
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
                  }}>该内容来自以下课程，请点击查看</div> : null}
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

  console.log(searchQueryResult, '==searchQueryResult==')

  return (
    <div className="destination-list">
      <ul>
        {searchQueryResult.map((dest, index) => (
          <li key={index}>
            <SearchBar index={index}></SearchBar>
            {/* <div className='article-detail' dangerouslySetInnerHTML={{ __html: dest }} /> */}
            <img className="aiPeople" src="https://cdn.coffeebeats.cn/WechatIMG3145.jpeg-smaller" />
            {dest?.content ? <div className="destination-answer">
              <Markdown>{dest.content}</Markdown>
              {dest?.videoUrl ? <VideoPlayer src={dest?.videoUrl} startTime={dest?.startTime} endTime={dest?.endTime}></VideoPlayer> : null}
            </div> : <div className="destination-answer">
              未找到合适的答案，请咨询现场老师
            </div>}
            <div style={{ marginLeft: '50px', marginTop: '12px' }}>
              <Button style={{ marginRight: '8px'}} onClick={async () => {
                console.log(dest.insertId, '===insertId====')
                  axios
                  .post('https://www.coffeebeats.cn/updateNoAnswerRight', {
                    "id": dest.insertId,
                    "right": 2
                  }).then(res => {
                    message.success('反馈成功');
                    // message.success(<div style={{position: 'relative', top: '100px', zIndex: 10000}}>
                    //   反馈成功
                    // </div>, 15);
                  })
              }}>有用</Button>
              <Button onClick={() => {
                axios
                  .post('https://www.coffeebeats.cn/updateNoAnswerRight', {
                    "id": dest.insertId,
                    "right": 1
                  }).then(res => {
                    message.success('感谢您的反馈');
                    // message.success(<div style={{position: 'relative', top: '100px', zIndex: 10000}}>
                    //   感谢您的反馈
                    // </div>, 15);
                  })
              }}>无用</Button>
            </div>
            {dest?.lessonId ? <div className="lesson-info" onClick={() => {
              window.open(`https://www.coffeebeats.cn/v2-online/index.html#/lesson/${dest.lessonId}`)
            }}>该内容来自以下课程，请点击查看</div> : null}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DestinationList;
