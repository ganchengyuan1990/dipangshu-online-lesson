// components/LanguageSelector.tsx
/*eslint-disable*/
import React, { useState, useEffect } from 'react';
import { Radio } from 'antd';

interface LanguageSelectorProps {
  onChange?: (lang: string) => void;  // 可选的回调函数
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ onChange }) => {
  // 从 localStorage 获取保存的语言设置，默认为 'zh'
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('preferredLanguage') || 'zh';
  });

  // 处理语言切换
  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    console.log(newLang, '==newLang==')
    setLanguage(newLang);
    localStorage.setItem('preferredLanguage', newLang);
    
    // 如果提供了 onChange 回调，则调用它
    if (onChange) {
      onChange(newLang);
    }
  };

  // 组件挂载时从 localStorage 读取语言设置
  useEffect(() => {
    const savedLang = localStorage.getItem('preferredLanguage');
    if (savedLang) {
      setLanguage(savedLang);
      if (onChange) {
        onChange(savedLang);
      }
    }
  }, []);

  return (
    <Radio.Group value={language} onChange={handleLanguageChange}>
      <Radio.Button value="zh">中文</Radio.Button>
      <Radio.Button value="en">English</Radio.Button>
    </Radio.Group>
  );
};

export default LanguageSelector;