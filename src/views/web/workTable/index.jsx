/*eslint-disable*/

import React from 'react';
import { WorkTableProvider } from './context';
import AIImageSection from './AIImageSection';
import PromptSection from './PromptSection';
import RightPanel from './RightPanel';
import AspectRatioSection from './AspectRatioSection';
import QualitySection from './QualitySection';
import GenerateButton from './GenerateButton';
import './styles.css';

const WorkTable = () => {
  return (
    <WorkTableProvider>
      <div className="work-table">
          <div className="left-panel">
          <AIImageSection />
          <PromptSection />
          {/* <AspectRatioSection /> */}
          {/* <QualitySection /> */}
          <GenerateButton />
        </div>
        <RightPanel />
      </div>
    </WorkTableProvider>
  );
};

export default WorkTable;