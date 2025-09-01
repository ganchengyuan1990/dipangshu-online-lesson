/*eslint-disable*/


import React from 'react';
import { useTravel } from './TravelContext';
import './styles.less';

const SearchBar = (props) => {
  const { searchQuery, setSearchQuery } = useTravel();
  const { index } = props

  return (
    <div className="search-bar">
      {/* <input 
        type="text" 
        value={searchQuery[index]}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="在最下面输入框填入您想要搜索的内容"
      /> */}
      <img className="aiPeople" src="https://oss-open.aichan.info/imgs/gif/download.gif" alt="" />
      <span className="search-query">{searchQuery[index]}</span>
      {/* <div className="search-source">基于 9 个搜索来源</div> */}
    </div>
  );
};

export default SearchBar;