/*eslint-disable*/


// FoodGuide.js
import React from 'react';
import { useTravel } from './TravelContext';
import './styles.css';
// import './styles.less';


const FoodGuide = () => {
  const { foodGuides } = useTravel();

  return (
    <div className="food-guide">
      <h2>以下是一些小众旅行地的美食攻略：</h2>
      {foodGuides.map((guide, index) => (
        <div key={index}>
          <h3>{guide.city}</h3>
          <ul>
            {guide.foods.map((food, foodIndex) => (
              <li key={foodIndex}>
                <h4>{food.name}</h4>
                <p>{food.description}</p>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default FoodGuide;
