/*eslint-disable*/

import React, { useState } from 'react';
import { Spin } from 'antd'
import './styles.css';
import { useWorkTable } from './context';

const RightPanel = () => {

  const { state } = useWorkTable();

  console.log(state?.isLoading, 886644)

  return (
    <div className="right-panel">
      {/* 这里可以放置生成的图片或其他内容 */}
      <Spin tip='Loading...' spinning={state.isLoading}>

        <div className="image-placeholder">
          <img src={state.imgUrl} />
          <p>智能文生图</p>
          <p>快去左侧输入你的灵感创意吧~</p>
        </div>
      </Spin>
    </div>
  );
};

export default RightPanel;