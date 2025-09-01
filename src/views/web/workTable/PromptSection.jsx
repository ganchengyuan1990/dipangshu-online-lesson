/*eslint-disable*/

import React from 'react';
import { useWorkTable } from './context';

const PromptSection = () => {

  const { setPrompt } = useWorkTable();

  return (
    <div className="prompt-section">
      <h3>创意描述</h3>
      <textarea placeholder="请输入创意描述" onChange={(e) => setPrompt(e.target.value)}></textarea>
      {/* <div className="prompt-actions">
        <button>上传参考图</button>
        <button>智能重绘</button>
      </div> */}
    </div>
  );
};

export default PromptSection;