/*eslint-disable*/


import * as React from 'react';
import { useEffect, useState, useMemo } from 'react';
import WebAudioSpeechRecognizer from '../webaudiospeechrecognizer';
import './index.css';


export default ({ onFinish, tencentInfo }) => {
  const [onReady, onReadySetter] = useState(false);
  const [recording, setRecording] = useState(false);
  // const [tencentInfo, setTencentInfo] = useState<{ appid: string, secretid: string, secretkey: string, token: string } | null>(null);
  const [result, setResult] = useState('');
  // const [speechRecognizerManager, setSpeechRecognizerManager] = useState(() => getRecorderSpeechRecognizer());
  // let speechRecognizerManager = {} as any;

  const speechRecognizerManager = useMemo(() => {
    // const tencentInfo = await getTencentInfo("window.location.host")
    const params = {
      // 用户参数
      appid: tencentInfo?.appid,
      secretid: tencentInfo?.secretid,
      secretkey: tencentInfo?.secretkey,
      token: tencentInfo?.token,
      // 录音参数
      // duration: 100000,
      // frameSize: 1.28,  //单位:k

      // 实时识别接口参数
      engine_model_type: '16k_zh',
      needvad: 0,
      filter_dirty: 1,
      filter_modal: 1,
      filter_punc: 0,
      // convert_num_mode : 1,
      word_info: 2,
      vad_silence_time: 200
    };
    const res = new WebAudioSpeechRecognizer(params);
    return res
    // setTencentInfo(tencentInfo)
  }, [tencentInfo])
  useEffect(() => {
    // 开始识别
    speechRecognizerManager.OnRecognitionStart = (res) => {
      // console.log('开始识别', res);
      console.log('==OnRecognitionStart==', res);
      setRecording(true)
      setResult('')
    }
    // 一句话开始
    speechRecognizerManager.OnSentenceBegin = (res) => {
      console.log('==一句话开始==', res);
    }
    // 识别变化时
    speechRecognizerManager.OnRecognitionResultChange = (res) => {
      console.log('识别变化时', res);
      setResult(res.result.voice_text_str)
    }
    // 一句话结束
    speechRecognizerManager.OnSentenceEnd = (res) => {
      console.log('一句话结束', res);
      setResult(res.result.voice_text_str)
      setRecording(false)
    }
    // 识别错误
    speechRecognizerManager.OnError = (res) => {
      console.log(res, '==========error========');
      setRecording(false)
      endLy({});
    }
    speechRecognizerManager.OnRecorderStop = () => {
      console.log('==录音结束或超过录音时长==');
    }
  }, [tencentInfo])
  useEffect(() => {
    // 识别结束
    speechRecognizerManager.OnRecognitionComplete = (res) => {
      console.log('==识别结束==', res, result);
      onFinish(result)
      setRecording(false)
    }
  }, [result])

  // 确保用户同意使用录音功能
  const getRecordPermission = async () => {

  }

  const startLy = async function (e) {
    console.log(recording, '===recording===')
    e.preventDefault();
    startAsr();
  }
  const startAsr = async function () {
    setResult('')
    if (recording) {
      endLy({});
      return
    }
    console.log('===before start===')
    speechRecognizerManager.start();

  }
  const endLy = function (e) {
    setRecording(false);
    onReadySetter(!onReady);
    console.log('===before endLy===')
    speechRecognizerManager.stop();
  }
  // show?: boolean;
  // onTap?: () => void;
  // zIndex?: number;
  // style?: React.CSSProperties;
  // children?: React.ReactNode;
  return (
    <div>
      { recording ? <div className="mask_wrapper"><div className="mask_text">
          <div className="time-box">
            <div className="start-taste-line">
              <div className="hr1 hr" />
              <div className="hr2 hr" />
              <div className="hr3 hr" />
              <div className="hr4 hr" />
              <div className="hr5 hr" />
              <div className="hr6 hr" />
              <div className="hr7 hr" />
              <div className="hr8 hr" />
              <div className="hr9 hr" />
              <div className="hr10 hr" />
            </div>
        </div>
      </div></div> : null}
      {!onReady ? <div onClick={() => {
        onReadySetter(!onReady);
        getRecordPermission();
      }} className="btn btn-start">
        <img className="btn btn-start" src="https://oss-open.aichan.info/imgs/qa/%E5%B7%A6%E4%BE%A7%E5%9B%BE%E6%A0%87%402x.png"/>
      </div> :
        <div
          className="audio_input"
          onClick={startLy}
          // onTouchStart={startLy}
          // onTouchEnd={endLy}
        >
          <img className="btn btn-start btn-revert" onClick={(e) => {
            e.stopPropagation();
            onReadySetter(!onReady)
          }} src="https://oss-open.aichan.info/imgs/qa/%E5%9B%BE%E6%A0%87%E9%94%AE%E7%9B%98%402x.png"/>
          {!recording ? <div className="recordText">点击 说话</div> : <div>录音识别中，点击结束</div>}
        </div>
      }
    </div>
  );
};
