/*eslint-disable*/

import React, { createContext, useState, useContext } from 'react';

const WorkTableContext = createContext();

export const WorkTableProvider = ({ children }) => {
  const [state, setState] = useState({
    selectedImageType: null,
    prompt: '',
    aspectRatio: '1:1',
    quality: 'standard',
    imgUrl: '',
    isLoading: false,
  });

  const setSelectedImageType = (type) => {
    setState(prevState => ({ ...prevState, selectedImageType: type }));
  };

  const setPrompt = (prompt) => {
    setState(prevState => ({ ...prevState, prompt }));
  };

  const setAspectRatio = (ratio) => {
    setState(prevState => ({ ...prevState, aspectRatio: ratio }));
  };

  const setQuality = (quality) => {
    setState(prevState => ({ ...prevState, quality }));
  };

  const generateImage = (imgUrl) => {
    // 这里可以添加生成图片的逻辑
    setState(prevState => ({ ...prevState, imgUrl }));
  };

  const setLoading = (value) => {
    // 这里可以添加生成图片的逻辑
    setState(prevState => ({ ...prevState,  isLoading: value}));
  };

  return (
    <WorkTableContext.Provider
      value={{
        state,
        setSelectedImageType,
        setPrompt,
        setAspectRatio,
        setQuality,
        generateImage,
        setLoading,
      }}
    >
      {children}
    </WorkTableContext.Provider>
  );
};

export const useWorkTable = () => {
  const context = useContext(WorkTableContext);
  if (context === undefined) {
    throw new Error('useWorkTable must be used within a WorkTableProvider');
  }
  return context;
};