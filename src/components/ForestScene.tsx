import React from 'react';
import { SessionState } from '../types';
import { ForestCanvas } from '../three/ForestCanvas';

interface ForestSceneProps {
  growth: number;
  state: SessionState;
  scars: number;
  isWinter: boolean;
}

export const ForestScene: React.FC<ForestSceneProps> = ({
  growth,
  state,
  scars,
  isWinter,
}) => {
  return (
    <div className="w-full relative" id="forest-ecosystem-scene">
      <ForestCanvas 
        growth={growth} 
        state={state} 
        scars={scars} 
        isWinter={isWinter} 
      />
    </div>
  );
};
