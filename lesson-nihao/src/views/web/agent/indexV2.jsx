/*eslint-disable*/

import React, { useReducer, useState, useEffect, useRef } from 'react'
import useMount from '@/hooks/useMount'
import { Link, Element, Events, animateScroll as scroll } from 'react-scroll'; // 引入 ScrollLink 组件
import { Button, Radio, Tooltip, Icon, Input, Spin, Card, Modal } from 'antd'
import JoLPlayer from "jol-player";
import { pinyin } from 'pinyin-pro';
import Typed from 'typed.js';
import Speech from 'speak-tts'

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
import { getSkillPromise } from "../../../utils";
import "video-react/dist/video-react.css";

const { Search } = Input;
const ButtonGroup = Button.Group;
const { confirm } = Modal;


import { ANNOUNCEMENT } from '@/config'
import useFetchLesson from '@/hooks/useFetchLesson'
import { withRouter } from 'react-router-dom'
import axios from '@/utils/axios'
import { LogoutOutlined, CloseOutline } from "@ant-design/icons";

import { Toast } from 'antd-mobile';
import 'antd-mobile/lib/modal/style/css';
import 'antd-mobile/lib/toast/style/css';
import './index.less';

//



const recognition = new webkitSpeechRecognition();
recognition.lang = 'zh-CN';
recognition.continuous = false;

function Agent(props) {
  // let isBuyed = false
  window.voice = null;
  const ref1 = React.useRef(null);
  const ref2 = React.useRef(null);
  const ref3 = React.useRef(null);
  const ref4 = React.useRef(null);
  const ref5 = React.useRef(null);
  const [chosenLessonId, setChosenLessonId] = useState(102);
  const [showAnimation, setShowAnimation] = useState(true);
  const [showLesson, setShowLesson] = useState(false);



  useMount(() => {
    // setTimeout(() => {
    //   setShowAnimation(false);
    //   setTimeout(() => {
    //     // var typed = new Typed('#typed',options);
    //     setTimeout(() => {
    //       // const element2 = document.querySelector('.ant-modal-body .ant-modal-confirm-content').childNodes[1];
    //       console.log(ref1, 888)
    //       ref1.current.className = 'typing';
    //       ref1.current.style.display = 'block';
    //       setTimeout(() => {
    //         // const element3 = document.querySelector('.ant-modal-body .ant-modal-confirm-content').childNodes[2];
    //         ref2.current.className = 'typing';
    //         ref2.current.style.display = 'block';
    //         setTimeout(() => {
    //           // const element3 = document.querySelector('.ant-modal-body .ant-modal-confirm-content').childNodes[2];
    //           ref5.current.style.display = 'block';
    //         }, 2500)
    //       }, 2000)
    //     }, 2000)
    //   }, 1000);
    //   confirm({
    //     title: '您的AI助教已上线',
    //     width: 600,
    //     height: 400,
    //     content: <div style={{marginTop: 30}}>
    //       <div id="#typed1" className="typing">
    //         <div>你想动手做什么？</div>
    //       </div>
    //       <div ref={ref1} id="#typed2" style={{ display: 'none ', color: "#109080", marginLeft: "400px"}}>我想做......</div>
    //       <div ref={ref2} id="#typed3" style={{ display: 'none '}}>目前我可以进行木作教学，我们一起来试一试，请问你有木工基础吗？</div>
    //       <div ref={ref5} style={{ display: 'none ', marginLeft: "300px", marginBottom: '12px'}}>
    //         <ButtonGroup>
    //           <Button onClick={() => {
    //             ref3.current.className = 'typing';
    //             ref3.current.style.display = 'block';
    //             setChosenLessonId(102)
    //             window.chosenLessonId = 102;
    //           }}>无基础</Button>
    //           <Button onClick={() => {
    //             ref4.current.className = 'typing';
    //             ref4.current.style.display = 'block';
    //             setChosenLessonId(61);
    //             window.chosenLessonId = 61;

    //           }}>有基础</Button>
    //         </ButtonGroup>
    //       </div>
    //       <div ref={ref3} id="#typed4" style={{ display: 'none '}}>那我们从简单的项目开始，尝试做一把木质的果酱刀</div>
    //       <div ref={ref4} id="#typed5" style={{ display: 'none '}}>我们可以尝试制作一个中国传统的榫卯结构：格肩榫</div>


    //     </div>,
    //     onOk: async () => {
    //       axios
    //       .get('https://www.coffeebeats.cn/getOnlineLessonV2ById', {
    //         params: {
    //           id: window.chosenLessonId,
    //           catIndex: window.location.href.split('=')[1],
    //         }
    //       })
    //       .then(response => {
    //         setShowLesson(true);
    //         let sss = [];
    //         setTimeout(async () => {
    //           let speechSynthesis = window.speechSynthesis;
    //           speechSynthesis.addEventListener && speechSynthesis.addEventListener('voiceschanged', updateVoice);
    //           function updateVoice() {
    //             if (speechSynthesis) {
    //               window.voice = speechSynthesis.getVoices().find(voice => { console.log(voice, 999555); return voice.lang == 'zh-CN'})
    //             }
    //             // document.getElementById('voice_name').textContent = voice?.name ?? '(No Voice)';
    //           }
    //           updateVoice()
    
    
    //           if (response.result?.content?.[0]?.name?.indexOf("导入") >= 0) {
    //             const newDataList = JSON.parse(JSON.stringify(dataList))
    //             const contents = response.result?.content[0]?.content;
    //             for(let i = 0; i < contents?.length; i++) {
    //               contents[i].shown = true;
    //               contents[i].noSide = true;
    //               contents[i].title = '课程导入：';
    //               contents[i].from = 'agent';
    //               newDataList.push(contents[i]);
    //               // console.log(123123123)
    //               // await getSkillPromise(3000);
    //             }
    //             let stepDaoyu = `完成这个项目有${response.result?.steps?.length}个主要步骤，分别是：</br>`
    //             response.result?.steps.forEach(x => {
    //               stepDaoyu += `${x.step}: ${x.content}</br>`
    //             })
    //             newDataList.push({
    //               type: 1,
    //               shown: true,
    //               value: stepDaoyu,
    //               noSide: true,
    //               from: 'agent'
    //             })
                
    //             newDataList.push({
    //               type: 1,
    //               shown: true,
    //               value: `接下来集中注意力！我们从第一步开始`,
    //               noSide: true,
    //               from: 'agent'
    //             })
    //             contents.push({
    //               type: 1,
    //               shown: true,
    //               value: stepDaoyu.replace(/<\/br>/g, ''),
    //               mp3FilePath: 'https://cdn.coffeebeats.cn/mp3/4.mp3',
    //               noSide: true,
    //               from: 'agent'
    //             })
    //             contents.push({
    //               type: 1,
    //               shown: true,
    //               value: `接下来集中注意力！我们从第一步开始`,
    //               mp3FilePath: 'https://cdn.coffeebeats.cn/mp3/5.mp3',
    //               noSide: true,
    //               from: 'agent'
    //             })
    
    //             setDataList(newDataList)
    //             const strContents = contents.filter(x => x.type === 1);
    //             const ssu = new SpeechSynthesisUtterance(strContents[0]?.value);
    //             // ssu.voice = window.voice;
    //             // ssu.voice = speechSynthesis.getVoices()[0]
    //             ssu.pitch = 0;
    //             ssu.lang = 'zh-TW';
    //             ssu.rate = 1.2;
    //             ssu.addEventListener('end', e => {
    //               var ele = document.querySelector('.app-main');
    //               if (!ele) {
    //                 return
    //               }
    //               // ele.scrollTop = ele.scrollHeight + 300
    //               ele.scrollTo({ top: 800, behavior: 'smooth' })
    //               setTimeout(() => {
    //                 if (!strContents[1]) {
    //                   return
    //                 }
    //                 const ssu1 = new SpeechSynthesisUtterance(strContents[1]?.value);
    //                 // ssu.voice = window.voice;
    //                 // ssu.voice = speechSynthesis.getVoices()[0]
    //                 ssu1.pitch = 0;
    //                 ssu1.rate = 1.2;
    //                 ssu1.lang = 'zh-TW';
    //                 ssu1.addEventListener('end', e => {
    //                   // showStepsSetter(true);
    //                   setTimeout(() => {
    //                     var ele = document.querySelector('.app-main');
    //                     if (!ele) {
    //                       return
    //                     }
    //                     // ele.scrollTop = ele.scrollHeight + 300
    //                     ele.scrollTo({ top: 100000, behavior: 'smooth' })
    
    
    //                     const ssu2 = new SpeechSynthesisUtterance(strContents[2]?.value);
    //                     // ssu.voice = window.voice;
    //                     // ssu.voice = speechSynthesis.getVoices()[0]
    //                     ssu2.pitch = 0;
    //                     ssu2.lang = 'zh-TW';
    //                     speechSynthesis.speak(ssu2);
    //                     ssu2.addEventListener('end', e => {
    //                       // setAiInput(false);
    //                       setTimeout(() => {
    //                         var ele = document.querySelector('.app-main');
    //                         if (!ele) {
    //                           return
    //                         }
    //                         // ele.scrollTop = ele.scrollHeight + 300
    //                         ele.scrollTo({ top: 100000, behavior: 'smooth' })
      
      
    //                         const ssu3 = new SpeechSynthesisUtterance(strContents[3]?.value);
    //                         // ssu.voice = window.voice;
    //                         // ssu.voice = speechSynthesis.getVoices()[0]
    //                         ssu3.pitch = 0;
    //                         ssu3.lang = 'zh-TW';
    //                         speechSynthesis.speak(ssu3);
    //                       }, 1000);
    
    //                     })
    //                   }, 1500)
    
    
    //                 })
    
    //                 speechSynthesis.speak(ssu1);
    //               }, 1500)
    //             });

    //             // document.querySelector(".ant-modal-mask").style.display = 'none';
    //             // document.querySelector(".ant-modal-wrap").style.display = 'none';
      
    //             console.log(strContents, '==strContents===')
      
    //             var ele = document.querySelector('.app-main');
    //             // await getAiSound("https://cdn.coffeebeats.cn/mp3/1.mp3");
    //             for(let i = 0; i < strContents.length; i++) {
    //               await getAiSound(strContents[i].mp3FilePath)
    //               ele.scrollTo({ top: 800 * (i + 1), behavior: 'smooth' })
    //             }
    
                
    //             // var typed = new Typed('.element', options);
    
    
    
    
    
    //             // speechSynthesis.speak(ssu);
    
    
    //             // console.log(contents, '===contents===')
    //           }
    
    
    //         }, 2000);
    //         if (response.result?.steps) {
    //           response.result.steps = JSON.parse(response.result?.steps);
    //           response.result.steps.forEach(x => {
    //             if (x.scripts) {
    //               sss = sss.concat(x.scripts);
    //             }
    //           })
    //           stepsArrSetter(response.result.steps);
    //           setScripts(sss);
    //           console.log(response.result.steps, '===response.result.steps===')
    
    //         }
    //         // if () {}
    //         lessonDataSetter(response.result);
    //         setTimeout(() => {
    //           showStepsSetter(true);
    //           answerLoadingSetter(false);
    //         }, 1500)
    //       })

    //     },
    //     okText: "开始上课"
    //   });
    // }, 50000000);
    try {
      const search = props.location.search
      const _array = search.split('?')
      const _value = _array[1]
      const _param = _value.split('=')[1]
      setCatIndex(_param)
    } catch (e) {
      console.log(e)
    }

  })

  const videoRef = React.useRef(null);


  const defaultRadio = 0
  const [radio, setRadio] = useState(defaultRadio)
  const [loading, showLoading] = useState(false)
  const [audioIndex, setAudioIndex] = useState(7)
  const [answerLoading, answerLoadingSetter] = useState(true)

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [aiInput, setAiInput] = useState(true);
  const [lessonData, lessonDataSetter] = useState({});
  const [showSteps, showStepsSetter] = useState(false);
  const [stepsArr, stepsArrSetter] = useState([]);



  const [openingUrl, setOpeningUrl] = useState("");
  const [chosenType, setChosenYype] = useState("");
  const [scripts, setScripts] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);

  const [aiImg, aiImgSetter] = useState('')


  const [duomeitiArr, setDuomeitiArr] = useState([])
  const [chosenFlag, setChosenFlag] = useState(false)
  const [classOver, setClassOver] = useState(false)
  const [recogOver, setRecogOver] = useState(false)


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
    console.log(recogOver, '==recogOver==')
  }, [recogOver]);

  useEffect(() => {
    setDuomeitiArr((dataList || []).filter(x => {
      return x.type !== 1;
    }))
    setDataList(initData);
  }, [initData]);

  useEffect(() => {
    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;
      const textPinyin = pinyin(text, {
        toneType: 'none'
      })
      console.log(text, textPinyin, '===text===')
      // alert(text)

      recognition.stop();
      setRecogOver(true)


      let digit = -1;
      if (text.indexOf('一') >= 0) {
        digit = 1;
      } else if (text.indexOf('二') >= 0) {
        digit = 2;
      } else if (text.indexOf('三') >= 0) {
        digit = 3;
      } else if (text.indexOf('四') >= 0) {
        digit = 4;
      } else if (text.indexOf('五') >= 0) {
        digit = 5;
      } else if (text.indexOf('六') >= 0) {
        digit = 6;
      } else if (text.indexOf('七') >= 0) {
        digit = 7;
      } else if (text.indexOf('八') >= 0) {
        digit = 8;
      }


      if (digit >= 100000) {
        const newDataList = JSON.parse(JSON.stringify(dataList))
        newDataList.splice(newDataList.length - 1, 0, {
          type: 1,
          shown: true,
          // value: `抱歉，这个问题有点刁钻😊，我们换个说法再咨询吧，或者可以点击按钮尝试<a className='aiImageButton'>AI文生图</a>`,
          value: `好的，关于第${digit}步，你可以先尝试一下，如果有问题，请直接提问`,
          noSide: true,
          from: 'agent'
        });
        setDataList(newDataList)
        // setCurrentStep(digit - 1);
        // setRecogOver(false)

        const speak = document.getElementById('speak');

        window.ssuString = `好的，关于第${digit}步，你可以先尝试一下，如果有问题，请直接提问`

        // const ssu = new SpeechSynthesisUtterance(`好的，关于第${digit}步，你可以先尝试一下，如果有问题，请直接提问`);
        // ssu.voice = voice;
        // ssu.lang = 'zh-CN';
        // // ssu.addEventListener('start', e => console.log('start', e));
        // // ssu.addEventListener('end', e => console.log('end', e));
        // // ssu.addEventListener('error', e => {
        // //   console.log('error', e)
        // //   alert(JSON.stringify(e));
        // // });

        // speechSynthesis.speak(ssu);


        // const clickFunc = () => {
        //   const ssu = new SpeechSynthesisUtterance(window.speakString);
        //   ssu.voice = voice;
        //   ssu.lang = 'zh-CN';
        //   ssu.addEventListener('start', e => console.log('start', e));
        //   ssu.addEventListener('end', e => console.log('end', e));
        //   ssu.addEventListener('error', e => {
        //     console.log('error', e)
        //     alert(JSON.stringify(e));
        //   });
        //   speechSynthesis.speak(ssu);
        //   // alert(voice?.name)
        // }

        // speak.removeEventListener('click', clickFunc);

        // speak.addEventListener('click', clickFunc);

        setTimeout(() => {
          // let synth = window.speechSynthesis;
          // let utterThis = new SpeechSynthesisUtterance(window.speakString);
          // synth.speak(utterThis);
          // speak.click();
          const targetDomArr = document.querySelectorAll('.agent')
          if (targetDomArr.length > 0) {
            targetDomArr[targetDomArr.length - 1].click();
          }

        }, 300);
      } else {
        // const finalScripts = scripts;
        const finalScripts = lessonData.steps[currentStep - 2]?.scripts || [];
        let targetItem = null;
        finalScripts.forEach(x => {
          const sss = x.keywords.split('；');
          (sss || []).forEach(y => {
            if (pinyin(x.keywords, {
              toneType: 'none'
            }).indexOf(pinyin(y, { toneType: 'none' })) >= 0) {
              targetItem = x
            }
          })
        })
        // const targetItem = finalScripts.find(x => x.keywords.indexOf(text) >= 0 || pinyin(x.keywords, {
        //   toneType: 'none'
        // }).indexOf(pinyin(text, { toneType: 'none' })) >= 0);
        console.log(finalScripts, lessonData.steps, currentStep, targetItem,'====scripts====')
        if (targetItem) {
          const newDataList = JSON.parse(JSON.stringify(dataList))
          const content = targetItem.contents[0]?.param;
          content.from = 'agent'
          content.shown = true;
          const contents = targetItem.contents.map(x => {
            return {
              ...x.param,
              from: "agent",
              shown: true,
              answerType: targetItem.type,
            }
          });
          contents.unshift({
            from: "agent",
            shown: true,
            type: 1,
            value: targetItem.type === 'positive' ? "看看这样是不是更好些" : "看看问题是不是出在这里",
          })
          contents.push({
            from: "agent",
            shown: true,
            type: 1,
            value: "这个回答您还满意吗？若有问题可以继续提问😊",
          })
          console.log(...contents, 9999)
          newDataList.splice(newDataList.length - 1, 0, ...contents);
          setDataList(newDataList)

          window.ssuString = `这个回答您还满意吗？若有问题可以继续提问`


          setTimeout(() => {
            console.log('====again=====')
            const targetDomArr = document.querySelectorAll('.agent')
            // if (targetDomArr.length > 0) {
            //   targetDomArr[targetDomArr.length - 1].click();
            // }
            getAiSound('https://www.coffeebeats.cn/uploads/1716559604122.mp3')
            // recognition.start();
          }, 300)

        } else {
          const newDataList = JSON.parse(JSON.stringify(dataList))
          newDataList.splice(newDataList.length, 0, {
            type: 1,
            shown: true,
            // value: `抱歉，这个问题有点刁钻😊，我们换个说法再咨询吧，或者可以点击按钮尝试<a className='aiImageButton'>AI文生图</a>`,
            value: "你不妨先尝试一下，再来提问，因为没有亲身体会，很难有针对性地沟通😊",
            noSide: true,
            from: 'agent'
          });
          setDataList(newDataList)
          window.ssuString = `你不妨先尝试一下，再来提问，因为没有亲身体会，很难有针对性地沟通`

          setTimeout(() => {
            console.log('====again=====')
            const targetDomArr = document.querySelectorAll('.agent')
            if (targetDomArr.length > 0) {
              targetDomArr[targetDomArr.length - 1].click();
            }
            // recognition.start();
          }, 300)

          setTimeout(() => {
            if (lessonData.content?.[currentStep + 1]?.name?.indexOf("收尾") >= 0) {
              const newDataList = JSON.parse(JSON.stringify(dataList))
              const contents = lessonData.content[currentStep + 1]?.content;
              for(let i = 0; i < contents?.length; i++) {
                contents[i].shown = true;
                contents[i].noSide = true;
                contents[i].title = '课程尾声：';
                contents[i].from = 'agent';
                newDataList.push(contents[i]);
                // console.log(123123123)
                // await getSkillPromise(3000);
              }
              // newDataList.push({
              //   type: 1,
              //   shown: true,
              //   title:'课程尾声：',
              //   value: `课程到此结束，感谢您的参与！`,
              //   noSide: true,
              //   from: 'agent'
              // })
              // contents.push({
              //   type: 1,
              //   shown: true,
              //   title:'课程尾声：',
              //   value: `课程到此结束，感谢您的参与！`,
              //   noSide: true,
              //   from: 'agent'
              // })
              setDataList(newDataList)
              const strContents = contents.filter(x => x.type === 1);
              const ssu = new SpeechSynthesisUtterance(strContents[0]?.value);
              ssu.addEventListener('end', e => {
                setTimeout(() => {
                  var ele = document.querySelector('.app-main');
                  const ssu1 = new SpeechSynthesisUtterance(strContents[1]?.value);
                  ssu1.lang = 'zh-TW';
                  ssu1.rate = 1.2;
                  speechSynthesis.speak(ssu1);
                  if (!ele) {
                    return
                  }
                  ele.scrollTo({ top: 100000, behavior: 'smooth' })
                }, 1000);
              });
              // ssu.voice = window.voice;
              // ssu.voice = speechSynthesis.getVoices()[0]
              ssu.pitch = 0;
              ssu.lang = 'zh-TW';
              ssu.rate = 1.2;
              speechSynthesis.speak(ssu);
              setCurrentStep(currentStep + 1);

            }
            
          }, 8000);
        }
      }


      setTimeout(() => {
        var ele = document.querySelector('.app-main');
        if (!ele) {
          return
        }
        // ele.scrollTop = ele.scrollHeight + 300
        ele.scrollTo({ top: 100000, behavior: 'smooth' })

      }, 500);

    };
  }, [dataList.length, currentStep])

  const toggleAiImg = () => {
    setAiInput(!aiInput)
  }


  const getAiSound = async (mp3) => {
    // axios
    // .post('https://www.coffeebeats.cn/tencent/textToSound', {
    //   "prompt": word,

    // }).then(res => {
    //   console.log(res, '===getAiSound===')
      
    //   let audioBlob = base64ToBlob(res?.data?.Audio,"mp3");
    //   let audio = document.getElementById("audioId");
    //   audio.src = window.URL.createObjectURL(audioBlob);
    //   audio.addEventListener("canplay", () => {
    //     console.log(audio.src, 988)
    //     audio.play();
    //     // window.URL.revokeObjectURL(audio.src);
    //   });
    //   audio.addEventListener("ended", () => {
    //     console.log(audio.src, '===ended====')
    //     // window.URL.revokeObjectURL(audio.src);
    //   });
    // });

    return new Promise((resolve, reject) => {
      let audio = document.getElementById("audioId");
      audio.src = mp3
      audio.addEventListener("canplay", () => {
        console.log(audio.src, 988)
        audio.playbackRate = 1.2
        audio.play();
        // window.URL.revokeObjectURL(audio.src);
      });
      audio.addEventListener("ended", () => {
        console.log(audio.src, '===ended====')
        resolve();
        // window.URL.revokeObjectURL(audio.src);
      });
    });



    
  }


  const onButtonClick = async () => {
    const newDataList = JSON.parse(JSON.stringify(dataList))
    const thisContents = lessonData.content[currentStep]?.content;
    let speakStr = '';
    let mp3FilePath = ''

    if (currentStep - 1 > stepsArr.length) {
      return
    }

    if (stepsArr[currentStep - 1] && !stepsArr[currentStep - 1].dataSerted) {
      newDataList.splice(newDataList?.length, 0, ...thisContents);
      const newStepsArr = JSON.parse(JSON.stringify(stepsArr));
      newStepsArr[currentStep - 1].dataSerted = true;
      stepsArrSetter(newStepsArr)
    }

    // 尾声阶段
    if (!stepsArr[currentStep - 1]) {
      thisContents.forEach(x => {
        x.shown = true
      });
      newDataList.splice(newDataList?.length, 0, ...thisContents);
      setDataList(newDataList)
      const strContents = thisContents.filter(x => x.type === 1);
      var ele = document.querySelector('.app-main');
      for(let i = 0; i < strContents.length; i++) {
        await getAiSound(strContents[i].mp3FilePath)
        ele.scrollTop = ele.scrollHeight
        // ele.scrollTo({ top: 80 * (i + 1), behavior: 'smooth' })
      }
      setCurrentStep(currentStep + 1);
      return
    }
    if (newDataList[newDataList.length - 1] && newDataList[newDataList.length - 1].shown) {
      if (currentStep - 1 === stepsArr.length) {
        return
      }
      newDataList.splice(newDataList.length, 0, {
        type: 1,
        shown: true,
        // value: `抱歉，这个问题有点刁钻😊，我们换个说法再咨询吧，或者可以点击按钮尝试<a className='aiImageButton'>AI文生图</a>`,
        value: "这步没问题吧？可以说下一步吗😊?",
        from: 'agent'
      });
      setRecogOver(true);
      setCurrentStep(currentStep + 1)
      setTimeout(() => {
        setRecogOver(false);
      }, 5000)
      setDataList(newDataList)
      const ssu = new SpeechSynthesisUtterance("这步没问题吧？可以说下一步吗");
      // ssu.voice = window.voice;
      // ssu.voice = speechSynthesis.getVoices()[0]
      ssu.pitch = 0;
      ssu.lang = 'zh-TW';
      ssu.rate = 1.2;
      setTimeout(async () => {
        // speechSynthesis.speak(ssu);
        await getAiSound("https://cdn.coffeebeats.cn/mp3/6.mp3");
        var ele = document.querySelector('.app-main');
        if (!ele) {
          return
        }
        ele.scrollTop = ele.scrollHeight
      }, 500)
      setAiInput(true);
      return;
      // setDataList(newDataList1)
      // setClassOver(true)

    }

    

    // newDataList.splice(newDataList.length - 1, 0, {
    //   type: 1,
    //   shown: true,
    //   // value: `抱歉，这个问题有点刁钻😊，我们换个说法再咨询吧，或者可以点击按钮尝试<a className='aiImageButton'>AI文生图</a>`,
    //   value: "这步没问题吧？可以说下一步吗😊?<br/>如果是，请回答<span style={{ fontWeight: \'bold\' }}>Y</span>，或者直接向助教进行提问吗，说出关键字即可",
    //   from: 'agentAsk'
    // });
    // setDataList(newDataList)

    // setTimeout(() => {
    //   var ele = document.querySelector('.app-main');
    //   if (!ele) {
    //     return
    //   }
    //   // ele.scrollTop = ele.scrollHeight + 300
    //   ele.scrollTo({ top: 1000000, behavior: 'smooth' });
    // }, 500);

    // return

    // const targetList = JSON.parse(JSON.stringify(dataList))
    for (let i = 0; i < newDataList.length - 1; i++) {
      if (!newDataList[i].shown) {
        newDataList[i].shown = true
        if (newDataList[i].type === 1) {
          speakStr = newDataList[i].value;
          mp3FilePath = newDataList[i].mp3FilePath;
        }
        setProcessIndex(i)
        videoRef.current && videoRef.current.load()
        break
      } else if (newDataList[i].shown && !newDataList[i + 1].shown) {
        if (newDataList[i].type === 4 && !chosenFlag) {
          // if (dataList[i + 1].type !== 4) {
          //   setChosenFlag(false)
          // }
          return
        } else {
          setChosenFlag(false)
          newDataList[i + 1].shown = true
          if (newDataList[i + 1].type === 1) {
            speakStr = newDataList[i + 1].value;
            mp3FilePath = newDataList[i + 1].mp3FilePath;
          }
          setProcessIndex(i + 1)
        }
        break
      }
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
      dataList: newDataList,
      classOver: classOver,
    }
    const _targetIndex = initData.findIndex(item => item.id === props.match.params.id)
    if (_targetIndex >= 0) {
      initData[_targetIndex] = historyData
    } else {
      initData.push(historyData)
    }
    window.localStorage.setItem('historyData', JSON.stringify(initData))
    setDataList(newDataList)
    setTitle(title + ' ')

    const ssu = new SpeechSynthesisUtterance(speakStr);
    // ssu.voice = window.voice;
    // ssu.voice = speechSynthesis.getVoices()[0]
    ssu.pitch = 0;
    ssu.lang = 'zh-TW';
    ssu.rate = 1.2;
    setTimeout(() => {
      // speechSynthesis.speak(ssu);
      if (speakStr) {
        // getAiSound(`https://cdn.coffeebeats.cn/mp3/${audioIndex}.mp3`);
        getAiSound(mp3FilePath);
        // setAudioIndex(audioIndex + 1);

      }
    }, 500)

    setTimeout(() => {
      var ele = document.querySelector('.app-main');
      if (!ele) {
        return
      }
      ele.scrollTop = ele.scrollHeight
    }, 200)
  }
  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    console.log(998)
    setIsModalOpen(false);
  };


  console.log(dataList, '===datalist===')

  if (showAnimation) {
    return <div style={{ position: 'fixed' , top: 0, bottom: 0, left: 0, right: 0, zIndex: 1000, backgroundColor: '#fff'}}>
      <img onClick={async () => {
        setShowAnimation(false);
        setTimeout(() => {
          // var typed = new Typed('#typed',options);
          setTimeout(() => {
            // const element2 = document.querySelector('.ant-modal-body .ant-modal-confirm-content').childNodes[1];
            console.log(ref1, 888)
            ref1.current.className = 'typing';
            ref1.current.style.display = 'block';
            setTimeout(() => {
              // const element3 = document.querySelector('.ant-modal-body .ant-modal-confirm-content').childNodes[2];
              ref2.current.className = 'typing';
              ref2.current.style.display = 'block';
              setTimeout(() => {
                // const element3 = document.querySelector('.ant-modal-body .ant-modal-confirm-content').childNodes[2];
                ref5.current.style.display = 'block';
              }, 2500)
            }, 2000)
          }, 2000)
        }, 1000);
        // getAiSound('https://www.coffeebeats.cn/uploads/1716559604122.mp3')
        confirm({
          title: '您的AI助教已上线',
          width: 600,
          height: 400,
          content: <div style={{marginTop: 30}}>
            <div id="#typed1" className="typing">
              <div>你想动手做什么？</div>
            </div>
            <div ref={ref1} id="#typed2" style={{ display: 'none ', color: "#109080", marginLeft: "400px"}}>我想做......</div>
            <div ref={ref2} id="#typed3" style={{ display: 'none '}}>目前我可以进行木作教学，我们一起来试一试，请问你有木工基础吗？</div>
            <div ref={ref5} style={{ display: 'none ', marginLeft: "300px", marginBottom: '12px'}}>
              <ButtonGroup>
                <Button onClick={() => {
                  ref3.current.className = 'typing';
                  ref3.current.style.display = 'block';
                  setChosenLessonId(102)
                  window.chosenLessonId = 102;
                }}>无基础</Button>
                <Button onClick={() => {
                  ref4.current.className = 'typing';
                  ref4.current.style.display = 'block';
                  setChosenLessonId(106);
                  window.chosenLessonId = 106;
  
                }}>有基础</Button>
              </ButtonGroup>
            </div>
            <div ref={ref3} id="#typed4" style={{ display: 'none '}}>那我们从简单的项目开始，尝试做一把木质的果酱刀</div>
            <div ref={ref4} id="#typed5" style={{ display: 'none '}}>我们可以尝试制作一个中国传统的榫卯结构：格肩榫</div>
  
  
          </div>,
          onOk: async () => {
            axios
            .get('https://www.coffeebeats.cn/getOnlineLessonV2ById', {
              params: {
                id: window.chosenLessonId,
                catIndex: window.location.href.split('=')[1],
              }
            })
            .then(response => {
              setShowLesson(true);
              let sss = [];
              setTimeout(async () => {
                let speechSynthesis = window.speechSynthesis;
                speechSynthesis.addEventListener && speechSynthesis.addEventListener('voiceschanged', updateVoice);
                function updateVoice() {
                  if (speechSynthesis) {
                    window.voice = speechSynthesis.getVoices().find(voice => { console.log(voice, 999555); return voice.lang == 'zh-CN'})
                  }
                  // document.getElementById('voice_name').textContent = voice?.name ?? '(No Voice)';
                }
                updateVoice()
      
      
                if (response.result?.content?.[0]?.name?.indexOf("导入") >= 0) {
                  const newDataList = JSON.parse(JSON.stringify([]))
                  const contents = response.result?.content[0]?.content;
                  for(let i = 0; i < contents?.length; i++) {
                    contents[i].shown = true;
                    contents[i].noSide = true;
                    contents[i].title = '课程导入：';
                    contents[i].from = 'agent';
                    newDataList.push(contents[i]);
                    // console.log(123123123)
                    // await getSkillPromise(3000);
                  }
                  let stepDaoyu = `完成这个项目有${response.result?.steps?.length}个主要步骤，分别是：</br>`
                  response.result?.steps.forEach(x => {
                    stepDaoyu += `${x.step}: ${x.content}</br>`
                  })
                  newDataList.push({
                    type: 1,
                    shown: true,
                    value: stepDaoyu,
                    noSide: true,
                    from: 'agent'
                  })
                  
                  newDataList.push({
                    type: 1,
                    shown: true,
                    value: `接下来集中注意力！我们从第一步开始`,
                    noSide: true,
                    from: 'agent'
                  })
                  contents.push({
                    type: 1,
                    shown: true,
                    value: stepDaoyu.replace(/<\/br>/g, ''),
                    mp3FilePath: window.chosenLessonId === 106 ? 'https://www.coffeebeats.cn/uploads/1717076439101.mp3' : 'https://cdn.coffeebeats.cn/mp3/4.mp3',
                    noSide: true,
                    from: 'agent'
                  })
                  contents.push({
                    type: 1,
                    shown: true,
                    value: `接下来集中注意力！我们从第一步开始`,
                    mp3FilePath: 'https://cdn.coffeebeats.cn/mp3/5.mp3',
                    noSide: true,
                    from: 'agent'
                  })
      
                  setDataList(newDataList)
                  const strContents = contents.filter(x => x.type === 1);
                  const ssu = new SpeechSynthesisUtterance(strContents[0]?.value);
                  // ssu.voice = window.voice;
                  // ssu.voice = speechSynthesis.getVoices()[0]
                  ssu.pitch = 0;
                  ssu.lang = 'zh-TW';
                  ssu.rate = 1.2;
                  ssu.addEventListener('end', e => {
                    var ele = document.querySelector('.app-main');
                    if (!ele) {
                      return
                    }
                    // ele.scrollTop = ele.scrollHeight + 300
                    ele.scrollTo({ top: 800, behavior: 'smooth' })
                    setTimeout(() => {
                      if (!strContents[1]) {
                        return
                      }
                      const ssu1 = new SpeechSynthesisUtterance(strContents[1]?.value);
                      // ssu.voice = window.voice;
                      // ssu.voice = speechSynthesis.getVoices()[0]
                      ssu1.pitch = 0;
                      ssu1.rate = 1.2;
                      ssu1.lang = 'zh-TW';
                      ssu1.addEventListener('end', e => {
                        // showStepsSetter(true);
                        setTimeout(() => {
                          var ele = document.querySelector('.app-main');
                          if (!ele) {
                            return
                          }
                          // ele.scrollTop = ele.scrollHeight + 300
                          ele.scrollTo({ top: 100000, behavior: 'smooth' })
      
      
                          const ssu2 = new SpeechSynthesisUtterance(strContents[2]?.value);
                          // ssu.voice = window.voice;
                          // ssu.voice = speechSynthesis.getVoices()[0]
                          ssu2.pitch = 0;
                          ssu2.lang = 'zh-TW';
                          speechSynthesis.speak(ssu2);
                          ssu2.addEventListener('end', e => {
                            // setAiInput(false);
                            setTimeout(() => {
                              var ele = document.querySelector('.app-main');
                              if (!ele) {
                                return
                              }
                              // ele.scrollTop = ele.scrollHeight + 300
                              ele.scrollTo({ top: 100000, behavior: 'smooth' })
        
        
                              const ssu3 = new SpeechSynthesisUtterance(strContents[3]?.value);
                              // ssu.voice = window.voice;
                              // ssu.voice = speechSynthesis.getVoices()[0]
                              ssu3.pitch = 0;
                              ssu3.lang = 'zh-TW';
                              speechSynthesis.speak(ssu3);
                            }, 1000);
      
                          })
                        }, 1500)
      
      
                      })
      
                      speechSynthesis.speak(ssu1);
                    }, 1500)
                  });
  
                  // document.querySelector(".ant-modal-mask").style.display = 'none';
                  // document.querySelector(".ant-modal-wrap").style.display = 'none';
        
                  console.log(strContents, '==strContents===')
        
                  var ele = document.querySelector('.app-main');
                  // await getAiSound("https://cdn.coffeebeats.cn/mp3/1.mp3");
                  for(let i = 0; i < strContents.length; i++) {
                    await getAiSound(strContents[i].mp3FilePath)
                    ele.scrollTo({ top: 800 * (i + 1), behavior: 'smooth' })
                  }
      
                  
                  // var typed = new Typed('.element', options);
      
      
      
      
      
                  // speechSynthesis.speak(ssu);
      
      
                  // console.log(contents, '===contents===')
                }
      
      
              }, 2000);
              if (response.result?.steps) {
                response.result.steps = JSON.parse(response.result?.steps);
                response.result.steps.forEach(x => {
                  if (x.scripts) {
                    sss = sss.concat(x.scripts);
                  }
                })
                stepsArrSetter(response.result.steps);
                setScripts(sss);
                console.log(response.result.steps, '===response.result.steps===')
      
              }
              // if () {}
              lessonDataSetter(response.result);
              setTimeout(() => {
                showStepsSetter(true);
                answerLoadingSetter(false);
              }, 1500)
            })
  
          },
          okText: "开始上课"
        });
      }} style={{ width: '100%'}} src="https://oss-open.aichan.info/imgs/qa/BG%402x%20%281%29.png-compress" />
      <audio style={{visibility: "hidden"}} controls="controls" id="audioId" width="100" height="100" autoplay="autoplay"></audio>
    </div>
  }

  if (!showLesson) {
    return null
  }

  return (
    <div long={dataList?.length} style={{ marginBottom: '100px' }} className='innerWrapper'>
      {/* <div>{dataList.length}</div> */}
      {/* <div style={{ display: 'block' }}>
        <textarea id="text">“你好”</textarea>
        <div id="voice_name"></div>
        <button type="button" id="speak" style={{ height: '300px'}}>
          Speak
        </button>
      </div> */}

      {/* <Element name="my-element" className="element" style={{ visibility: 'visible' }}> */}
      {/* <div className="message-content message-box-content-_106c9 primary-_0d1e0">
        <div className="container-b2861c flow-markdown-body" dir="ltr">
          <div className="auto-hide-last-sibling-br paragraph-ae1685 br-paragraph-space">我是你专属的AI技能助教😊，可以帮你解决各类学习问题。有任何关于《{lessonData.lesson_name}》的问题都可以咨询我。</div>
          <div className="auto-hide-last-sibling-br paragraph-ae1685 br-paragraph-space">这节课的最终成果是这样的：<div><img src={lessonData.img} /></div></div>
        </div>
      </div> */}
      {/* </Element> */}


      {answerLoading ? <div className="message-box-f50daf primary-_0d1e0"><div className="message-box-content-wrapper-_856da"><div className="message-content message-box-content-_106c9 primary-_0d1e0"><span className="flex items-baseline"><div className="dot-flashing-_2676d"></div></span></div></div></div> : null}

      {/* {lessonData?.steps?.length && showSteps ? <div className="message-content message-box-content-_106c9 primary-_0d1e0">
        <div className="container-b2861c flow-markdown-body" dir="ltr">
          <div className="auto-hide-last-sibling-br paragraph-ae1685 br-paragraph-space" style={{ fontWeight: 'bold' }}>完成这个项目有{lessonData?.steps?.length}个主要步骤，分别是：</div>
          {(lessonData?.steps || []).map((x, idx) => (
            <div key={idx} className="auto-hide-last-sibling-br paragraph-ae1685 br-paragraph-space">{x.step}: {x.content}</div>
          ))}
        </div>
      </div> : null} */}

      <div className="wrapper" style={{ maxWidth: '90%' }}>
        {loading ? <div className="loadingWrapper">
          <Spin />
        </div> : null}

        {/* <Link id="scrollDest" activeClass="active" to="my-element" spy={true} smooth={true} duration={500} style={{ visibility: 'visible' }}>22</Link> */}




        <div style={{ flex: 1 }}>
          {dataList && dataList.map((item, index) => {
            // if (item.from === 'agentAsk') {
            //   try {
            //     recognition.start();
            //   } catch(e) {
            //     console.log(e, '===recognition e===')
            //   }
            //   setTimeout(() => {
            //     recognition.stop();
            //   }, 5000)
            // }

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

                    // let voice = null;
                    //   function updateVoice() {
                    //     voice = speechSynthesis.getVoices().find(voice => voice.lang == 'zh-CN')
                    //     // document.getElementById('voice_name').textContent = voice?.name ?? '(No Voice)';
                    //   }
                    //   speechSynthesis.addEventListener('voiceschanged', updateVoice);
                    //   updateVoice();
                    const ssu = new SpeechSynthesisUtterance(window.ssuString);
                    ssu.voice = window.voice;
                    ssu.lang = 'zh-TW';
                    //   ssu.addEventListener('start', e => console.log('start', e));
                    //   ssu.addEventListener('end', e => console.log('end', e));
                    //   ssu.addEventListener('error', e => console.log('error', e));
                    // ssu.trigger('start');
                    speechSynthesis.speak(ssu);

                    // tts.speak2("中国人不骗中国人")



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
                    <Player
                      ref={c => {
                        // this.player = c;
                      }}
                      autoPlay={true}
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
                    </Player>
                  </div>
                </Card> :
                  <div className='show_pics'>
                    <Player
                      ref={c => {
                        // this.player = c;
                      }}
                      autoPlay='true'
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
                    </Player>
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
          <div>
          </div>
          {aiInput ? null : <div type='primary' onClick={onButtonClick} className='button-bottom'>
            <img src='https://www.coffeebeats.cn/uploads/1585553433162-huiche2.png' />
            <Button type='primary' style={{ position: 'absolute', left: '50px', top: '15px' }} onClick={(e) => {
              e.stopPropagation();
              setAiInput(true);
            }}>返回AI助手</Button>
          </div>}
          {/* { !aiInput ? <div type='primary' onClick={toggleAiImg} className='button-bottom-tiny aiImg'>
          文生图
        </div> : <div type='primary' onClick={toggleAiImg} className='button-bottom-tiny'>
          切换回去
        </div>} */}
          {aiInput ? <div type='primary' className='button-bottom-left' onClick={onButtonClick}>
            {/* <Tooltip title="输入想生成的图片描述后，点击生成图片即可！" placement="top"> */}
            {/* <div>{window.ssuString}</div> */}
            <Tooltip title={recogOver ? "点击此处可进行语音提问" : ""} visible={recogOver} placement="top">
              <img className="aiPeople" onClick={(e) => {
                e.stopPropagation();
                // const ssu = new SpeechSynthesisUtterance(window.ssuString);
                // ssu.voice = window.voice;
                // ssu.lang = 'zh-TW';
                // speechSynthesis.speak(ssu);

                // const ssu = new SpeechSynthesisUtterance(window.ssuString);
                // ssu.voice = window.voice;
                // ssu.lang = 'zh-TW';
                // speechSynthesis.speak(ssu);

                // EventListener.on('audioSetup', (e) => {
                //   const ssu = new SpeechSynthesisUtterance(e || window.ssuString);
                //   ssu.voice = window.voice;
                //   ssu.lang = 'zh-TW';
                //   //   ssu.addEventListener('start', e => console.log('start', e));
                //   //   ssu.addEventListener('end', e => console.log('end', e));
                //   //   ssu.addEventListener('error', e => console.log('error', e));
                //   // ssu.trigger('start');
                //   speechSynthesis.speak(ssu);
                // });


                try {
                  recognition.start();
                  setRecogOver(false);
                  // setTimeout(() => {
                  //   recognition.stop();
                  // }, 5000)
                } catch (e) {
                  console.log(e, '===e===')
                  // alert(JSON.stringify(e))
                  setRecogOver(true);
                  recognition.stop();
                }

              }} src="https://p9-flow-imagex-sign.byteimg.com/ocean-cloud-tos/FileBizType.BIZ_BOT_ICON/2507315094491437_1708785320092927971.png~tplv-a9rns2rl98-image-qvalue.png?rk3s=0317c356&x-expires=1720835116&x-signature=%2Fy%2FjgCQyzCGC3GwBpd3WeskJBsk%3D" />
            </Tooltip>

            {/* <Search
              placeholder="请输入文字描述"
              enterButton="提问"
              // addonBefore={<Button onClick={() => {
              //   try {
              //     recognition.start();
              //     setTimeout(() => {
              //       recognition.stop();
              //     }, 5000)
              //   } catch (e) {
              //     console.log(e, '===e===')
              //     alert(JSON.stringify(e))
              //   }

              // }}>语音输入</Button>}
              size="large"
              onClick={(e) => {
                e.stopPropagation();

              }}
              // onSearch={value => askQuestion(value)}
              onSearch={onButtonClick}
            /> */}
            <img src='https://www.coffeebeats.cn/uploads/1585553433162-huiche2.png' />
            {/* </Tooltip> */}
          </div> : null}
        </div>
        <Element name="my-element" className="element" style={{ visibility: 'visible' }}>
        </Element>
        {isModalOpen ? <Modal title="素材详情" visible={isModalOpen} onOk={handleOk} onCancel={() => {
          handleCancel()
        }}>
          <span className="closeIcon" onClick={handleCancel}><Icon type="close-circle" /></span>
          <span className="closeIconV2" onClick={() => {
            window.open(openingUrl)
          }}>新开页面查看</span>
          <div className="modalWrap">
            {/* <img src={openingUrl} /> */}
            {chosenType === 2 ? <img src={openingUrl} /> : <video controls>
              <source src={openingUrl} type="video/mp4" />
            </video>}
          </div>
        </Modal> : null}
      </div>
      <audio style={{visibility: "hidden"}} controls="controls" id="audioId" width="100" height="100" autoplay="autoplay"></audio>
    </div>
  )
}

export default withRouter(Agent)
