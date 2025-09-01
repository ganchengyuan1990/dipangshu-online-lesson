/*eslint-disable*/

// TravelPage.js
import React from 'react';
import { TravelProvider } from './TravelContext';
import SearchBar from './SearchBar';
import DestinationList from './DestinationList';
import AutoPlayLesson from './AutoPlayLesson';
import FoodGuide from './FoodGuide';
import ToolBar from './ToolBar';
import './styles.css';

const TravelPage = () => {
  return (
    <TravelProvider>
      <div className="travel-page">
        {/* <SearchBar /> */}
        {/* <AutoPlayLesson /> */}
        <DestinationList />
        <audio style={{ visibility: "hidden" }} controls="controls" id="audioId" width="100" height="100" autoplay="autoplay"></audio>

        {/* <FoodGuide /> */}
        <ToolBar />
      </div>
    </TravelProvider>
  );
};

export default TravelPage;