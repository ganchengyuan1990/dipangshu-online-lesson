/*eslint-disable*/

import React, { useState } from 'react';
import { useWorkTable } from './context';

const AIImageSection = () => {

  const { setSelectedImageType } = useWorkTable();

  const [selectedType, setSelectedType] = useState(null);

  const styleList = [
    { key: 1, category: '不限定风格', style: '不限定风格', code: '000' },
    { key: 2, category: '不限定风格', style: '水墨画', code: '101' },
    { key: 3, category: '不限定风格', style: '概念艺术', code: '102' },
    { key: 4, category: '不限定风格', style: '油画1', code: '103' },
    { key: 5, category: '不限定风格', style: '油画2（梵高）', code: '118' },
    { key: 6, category: '不限定风格', style: '水彩画', code: '104' },
    { key: 7, category: '不限定风格', style: '像素画', code: '105' },
    { key: 8, category: '不限定风格', style: '厚涂风格', code: '106' },
    { key: 9, category: '不限定风格', style: '插图', code: '107' },
    { key: 10, category: '不限定风格', style: '剪纸风格', code: '108' },
    { key: 11, category: '艺术绘画类', style: '印象派1（莫奈）', code: '109' },
    { key: 12, category: '艺术绘画类', style: '印象派2', code: '119' },
    { key: 13, category: '艺术绘画类', style: '2.5D', code: '110' },
    { key: 14, category: '艺术绘画类', style: '古典肖像画', code: '111' },
    { key: 15, category: '艺术绘画类', style: '黑白素描画', code: '112' },
    { key: 16, category: '艺术绘画类', style: '赛博朋克', code: '113' },
    { key: 17, category: '艺术绘画类', style: '科幻风格', code: '114' },
    { key: 18, category: '艺术绘画类', style: '暗黑风格', code: '115' },
    { key: 19, category: '艺术绘画类', style: '3D', code: '116' },
    { key: 20, category: '艺术绘画类', style: '蒸汽波', code: '117' },
    { key: 21, category: '游戏动漫类', style: '日系动漫', code: '201' },
    { key: 22, category: '游戏动漫类', style: '怪兽风格', code: '202' },
    { key: 23, category: '游戏动漫类', style: '唯美古风', code: '203' },
    { key: 24, category: '游戏动漫类', style: '复古动漫', code: '204' },
    { key: 25, category: '游戏动漫类', style: '游戏卡通手绘', code: '301' },
    { key: 26, category: '专业写实类', style: '通用写实风格', code: '401' },
  ]


  const handleTypeClick = (id, code) => {
    setSelectedType(id);
    setSelectedImageType(code);
  };

  return (
    <div className="ai-image-section">
      <h3>智能文生图</h3>
      <div className="image-types">
        {styleList.map((item) => (
          <button 
            key={item.key}
            className={`image-type-button ${item.key === selectedType ? 'selected' : ''}`}
            onClick={() => handleTypeClick(item.key, item.code)}
          >{item.style}</button>
        ))}
      </div>
    </div>
  );
};

export default AIImageSection;