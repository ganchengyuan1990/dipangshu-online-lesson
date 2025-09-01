/*eslint-disable*/

import React from 'react';
import axios from '@/utils/axios'
import { useWorkTable } from './context';
import { Toast } from 'antd-mobile'
const GenerateButton = () => {
  const { state, generateImage, setLoading } = useWorkTable();

  const handleGenerate = () => {
    setLoading(true)
    axios
    .post('https://www.coffeebeats.cn/tencent/wordToImgWithStyleV2', {
      "prompt": state.prompt,
      "style": state.selectedImageType
    }).then(res => {
      if (!res.data.ResultImage) {
        Toast.fail('请稍等再试');
        return
      }
      // setImgUrl(`data:image/png;base64,${res.data.ResultImage}`)
      generateImage(`data:image/png;base64,${res.data.ResultImage}`)
      setLoading(false)
    })
    
  }

  return (
    <button className="generate-button" onClick={handleGenerate}>
      开始生成
    </button>
  );
};

export default GenerateButton;