/*eslint-disable*/

// TravelContext.js
import React, { createContext, useState, useContext } from 'react';

const TravelContext = createContext();

export const TravelProvider = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState([]);
  const [simularQuesList, setSimularQuesList] = useState([]);
  const [simularQuesAllList, setSimularQuesAllList] = useState([]);
  const [searchQueryResult, setSearchQueryResult] = useState([]);
  const [answerLoading, setAnswerLoading] = useState(false);
  const [showActive, canShowActive] = useState(true);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);



  const [destinations] = useState(searchQueryResult);
  const [foodGuides] = useState([
    {
      city: '广西百色',
      foods: [
        {
          name: '萍姐烧烤',
          description: '位于一条小巷的斜坡上，环境简陋，烟火弥漫，妥妥的民间美食氛围感。本地特色烤猪眼是一定要尝的，体验茹毛饮血之刺激与口中爆破之惊喜；烤五花肉、隔山肉、大肠、酸菜等，无一失望。'
        },
        {
          name: '红旗粉店',
          description: '本地人推荐的粉店，一见本地人排队挤作一团，人声鼎沸，就知道来对了。一碗肥又烫粉，佐一根油条，惬意。又烫肥瘦相间，极香，与清汤相得益彰。'
        }
      ]
    }
  ]);

  return (
    <TravelContext.Provider value={{ 
      searchQuery, setSearchQuery, destinations, foodGuides, searchQueryResult, setSearchQueryResult, answerLoading, setAnswerLoading, simularQuesList, setSimularQuesList, simularQuesAllList, setSimularQuesAllList, showActive, canShowActive, currentLessonIndex, setCurrentLessonIndex
    }}>
      {children}
    </TravelContext.Provider>
  );
};

export const useTravel = () => useContext(TravelContext);