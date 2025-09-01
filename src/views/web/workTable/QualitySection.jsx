/*eslint-disable*/

import React from 'react';

const QualitySection = () => {
  return (
    <div className="quality-section">
      <h3>画质</h3>
      <div className="quality-buttons">
        <button>标准</button>
        <button className="selected">高画质</button>
      </div>
    </div>
  );
};

export default QualitySection;