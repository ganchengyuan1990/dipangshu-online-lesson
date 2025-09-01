/*eslint-disable*/

// ToolBar.js
import React, { useState, useEffect, useRef, useMemo } from 'react';
import axios from '@/utils/axios'
import { throttle } from 'lodash';
import SpeechRecognizer from './speechRecognizer/index';
import { Select, Input } from 'antd';
import { useTravel } from './TravelContext';
import './styles.css';

let holding = false;

const ToolBar = () => {
  const [inputText, setInputText] = useState('');
  const [showSimular, setShowSimular] = useState(true);

  const [tencentInfo, setTencentInfo] = useState({});
  const {
    searchQuery,
    setSearchQuery,
    setSearchQueryResult,
    searchQueryResult,
    answerLoading,
    setAnswerLoading,
    simularQuesList, 
    setSimularQuesList,
    simularQuesAllList, 
    setSimularQuesAllList,
    showActive,
  } = useTravel();

  const inputRef = useRef(null);

  const getTencentInfo = async () => {
    axios
    .get('https://www.coffeebeats.cn/api/account/tencent-info').then(res => {
      // setImgUrl(`data:image/png;base64,${res.data.ResultImage}`)
      console.log(res.data, 996644)
      setTencentInfo(res.data);
    })
    
  }

  useEffect(() => {
    getTencentInfo()
    document.addEventListener('keydown', (e) => {
      // if (e.key === 'Enter') {
      //   console.log(inputRef.current, '===inputText==')
      //   handleGenerate(inputRef.current, true)
      // }
    })
    document.addEventListener('click', (e) => {
      setShowSimular(false);
    })
  }, [])

  const relatedElements = useMemo(() => {
    const urlIdx = location.href.split('idx=')[1];
    const historyData = window.localStorage.getItem('allLessonDataWithNoSteps');
    const realLessonData = JSON.parse(historyData || '[]');
    console.log( realLessonData[urlIdx]?.relatedType, '== realLessonData[urlIdx]?.relatedType==')
    const value =realLessonData[urlIdx]?.relatedElements;
    return value ? value.split(',') : [];
  }, [location.href])

  const tools = [
    { name: '帮我写作', icon: '✍️' },
    { name: '图像生成', icon: '🖼️' },
    { name: 'AI 搜索', icon: '🔍' },
    { name: '阅读总结', icon: '📚' },
    { name: '音乐生成', icon: '🎵' },
    { name: '解题答疑', icon: '❓' },
    { name: '学术搜索', icon: '🎓' },
    { name: '更多', icon: '⋯' },
  ];

  const handleGenerate = (newInputText, fromKey = false) => {
    const keyword = typeof newInputText === 'string' ? newInputText : inputText;
    const newSearchQuery = [...searchQuery, keyword];
    setSearchQuery(newSearchQuery)
    setAnswerLoading(true)
    // axios
    // .post('https://www.coffeebeats.cn/tencent/aiDialoge', {
    //   "prompt": inputText,
    // }).then(res => {
    //   // setImgUrl(`data:image/png;base64,${res.data.ResultImage}`)
    //   console.log(res.data, 996644)
    //   const content = res.data?.Choices?.[0]?.Message?.Content;
    //   // content.replace(/<[^>]+>/g, '')
    //   const newSearchQueryResult = [...searchQueryResult, content]
    //   setSearchQueryResult(newSearchQueryResult)
    //   // setSearchQuery(res.data?.Choices?.[0]?.Message?.Content)
    //   setAnswerLoading(false)
    // })
    const userInfo = window?.sessionStorage?.getItem("userInfo")
    // axios
    // .post('https://www.coffeebeats.cn/ai/question', {
    //   "question": keyword,
    //   "userName": JSON.parse(userInfo)?.userName
    // }).then(res => {
    //   // setImgUrl(`data:image/png;base64,${res.data.ResultImage}`)
    //   // 自研小模型
    //   if (res.isFrom === 'ownModel') {
    //     const content = res?.gptData? res?.gptData.Choices?.[0]?.Message?.Content : res.data?.payload?.answer;
    //     setSimularQuesAllList(res.data?.simularList?.filter(x => x.score > 0.8))
    //     setSimularQuesList(res.data?.simularList?.filter(x => x.score > 0.8)?.slice(0,3))
    //     // content.replace(/<[^>]+>/g, '')
    //     const newSearchQueryResult = [...searchQueryResult, {
    //       content,
    //       lessonId: res.data?.payload?.lessonId,
    //       ...res.data?.payload,
    //       insertId: res.insertData?.insertId
    //     }]
    //     setSearchQueryResult(newSearchQueryResult)
    //     // setShowSimular(typeof newInputText !== 'string' || fromKey)
    //     setTimeout(() => {
    //       setShowSimular(false);
    //     }, 5000)
    //     // setSearchQuery(res.data?.Choices?.[0]?.Message?.Content)
    //     setAnswerLoading(false)
    //     setTimeout(() => {
    //       // window.scrollTo(0, document.documentElement.scrollHeight);
    //       // document.querySelector('.am-modal-body').scrollTo(0, document.querySelector('.app-main').scrollHeight);
    //       document.querySelector('.app-main').scrollTo(0, document.querySelector('.app-main').scrollHeight);
    //     }, 500)
    //     return
    //   }
    //   console.log(res, 996644)
    //   const content = res.data?.Choices?.[0]?.Message?.Content;
    //   // content.replace(/<[^>]+>/g, '')
    //   const newSearchQueryResult = [...searchQueryResult, {
    //     content
    //   }]
    //   setSearchQueryResult(newSearchQueryResult)
    //   setTimeout(() => {
    //     // document.querySelector('.am-modal-body').scrollTo(0, document.querySelector('.app-main').scrollHeight);
    //     document.querySelector('.app-main').scrollTo(0, document.querySelector('.app-main').scrollHeight);
    //   }, 500)
    //   // setSearchQuery(res.data?.Choices?.[0]?.Message?.Content)
    //   setAnswerLoading(false)
    // })
    axios
    .post('https://www.coffeebeats.cn/ai/question/inElements', {
      "words": keyword,
      "userName": JSON.parse(userInfo)?.userName,
      "elementIds": relatedElements
    }).then(res => {
      // 自研小模型
      console.log(res, '===res===');
        const content = res?.gptData? res?.gptData.Choices?.[0]?.Message?.Content : res.data?.payload?.answer;
        setSimularQuesAllList(res.data?.simularList?.filter(x => x.score > 0.8))
        setSimularQuesList(res.data?.simularList?.filter(x => x.score > 0.8)?.slice(0,3))
        // content.replace(/<[^>]+>/g, '')
        const newSearchQueryResult = [...searchQueryResult, {
          content,
          lessonId: res.data?.payload?.lessonId,
          ...res.data?.payload,
          insertId: res.insertData?.insertId
        }]
        console.log(newSearchQueryResult, '==newSearchQueryResult==')
        setSearchQueryResult(newSearchQueryResult)
        // setShowSimular(typeof newInputText !== 'string' || fromKey)
        setTimeout(() => {
          setShowSimular(false);
        }, 5000)
        // setSearchQuery(res.data?.Choices?.[0]?.Message?.Content)
        setAnswerLoading(false)
        setTimeout(() => {
          // window.scrollTo(0, document.documentElement.scrollHeight);
          // document.querySelector('.am-modal-body').scrollTo(0, document.querySelector('.app-main').scrollHeight);
          document.querySelector('.app-main').scrollTo(0, document.querySelector('.app-main').scrollHeight);
        }, 500)
    })
    
  }


  const handleGenerateOnlyQues = (newInputText, fromKey = false) => {
    const keyword = typeof newInputText === 'string' ? newInputText : inputText;

    const hhh = /[\u4e00-\u9fa5]/gm.test(newInputText)
    if (!hhh) {
      return
    }
    // if (holding) {
    //   return
    // }
    console.log(88888)
    if (!newInputText) {
      return
    }
    return
    axios
    .post('https://www.coffeebeats.cn/ai/question/withoutgpt', {
      "question": keyword,
    }).then(res => {
      // setImgUrl(`data:image/png;base64,${res.data.ResultImage}`)
      // 自研小模型
      holding = false;
      if (res.isFrom === 'ownModel') {
        setSimularQuesList(res.data?.simularList?.filter(x => x.score > 0.8)?.slice(0,3))
        console.log(res.data?.simularList, '==res.data?.simularList==')

        setSimularQuesAllList(res.data?.simularList?.filter(x => x.score > 0.8))
        setShowSimular(true)
        // setTimeout(() => {
        //   setShowSimular(false);
        // }, 15000)
        // setSearchQuery(res.data?.Choices?.[0]?.Message?.Content)
        setTimeout(() => {
          // document.querySelector('.am-modal-body').scrollTo(0, document.querySelector('.app-main').scrollHeight);
          document.querySelector('.app-main').scrollTo(0, document.querySelector('.app-main').scrollHeight);
        }, 500)
        return
      }
    })

    holding = true;
    
  }

  const throttledInputChange = throttle((value) => {
    // 这里放置你原来的输入处理逻辑
    console.log('throttled input value:', value);
    setInputText(value)
    inputRef.current = value
    handleGenerateOnlyQues(value)
    // 如果有其他处理逻辑，放在这里
  }, 1500);

  if (!showActive) {
    return null
  }

  console.log(simularQuesList, '==simularQuesList==')

  return (
    <div className="tool-bar">
      {/* <div className="tools">
        {tools.map((tool, index) => (
          <button key={index} className="tool-button">
            <span className="tool-icon">{tool.icon}</span>
            <span className="tool-name">{tool.name}</span>
          </button>
        ))}
      </div> */}
      <div className="input-area">
        {showSimular && simularQuesList.length > 0 ? <div className="simular-list">
          {
            simularQuesList.map((item, index) => (
              <div 
                className="simular-item" 
                key={item.id}
                onClick={() => {
                  setInputText(item?.question);
                  setShowSimular(false);
                  setTimeout(() => {
                    setShowSimular(false);
                    handleGenerate(item?.question, item?.videoUrl);
                  }, 300)
                }}
              >{item?.question}</div>
            ))
          }
        </div> : null}
        <button className="attach-button">📎</button>
        <input
          type="text"
          value={inputText}
          onChange={throttle((e) => {
            setInputText(e.target.value)
            inputRef.current = e.target.value
            handleGenerateOnlyQues(e.target.value)
          }, 500)}
          placeholder="输入您感兴趣的内容"
        />
        {/* <Input 
          value={inputText}
          onChange={(e) => throttledInputChange(e.target.value)}
          placeholder="输入您感兴趣的内容"
        /> */}
        {/* <button className="cut-button">✂️</button> */}
        <button className="voice-button" style={{visibility: 'hidden'}}>🎤</button>
        <button className="send-button" onClick={handleGenerate}>↑</button>
        <button className="send-buttonV2" onClick={() => {
              const timeStr = Date.now();
              window.open(`https://www.coffeebeats.cn/chat/index.html?userId=Jason0915${timeStr}&roomId=Jason0915Room${timeStr}`)
        }}>实时对话</button>
        <SpeechRecognizer
          tencentInfo={tencentInfo}
          key={inputText}
          onFinish={(v) => {
            setInputText(v)
            setShowSimular(false);
            setTimeout(() => {
              handleGenerateOnlyQues(v);
            }, 300)
          }}
        />
      </div>
    </div>
  );
};

export default ToolBar;