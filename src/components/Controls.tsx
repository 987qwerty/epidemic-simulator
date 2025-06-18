import React, { useState } from 'react';
import { SimulationParams } from '../types';
import settingsLogo from '../assets/settings.svg'
import checkboxChecked from '../assets/checkbox-check.svg'
import checkboxUnChecked from '../assets/checkbox-unchecked.svg'

interface Props {
  onStart: () => void;
  onStop: () => void;
  onParamsChange: (params: SimulationParams) => void;
  params: SimulationParams;
  isRunning: boolean;
}

const Controls: React.FC<Props> = ({ onStart, onStop, onParamsChange, params, isRunning}) => {
  const [settingsOpened, setSettingsOpened] = useState(false)
  return (
    <div className='relative select-none flex gap-2'>
      <button className="h-12 w-40 bg-gray-950 hover:border-2 hover:border-gray-600 hover:bg-gray-900 rounded-2xl" 
        onClick={()=>{onParamsChange(params);onStart();setSettingsOpened(false);}}>Запустить
        </button>
        <button className="h-12 w-40 bg-gray-950 hover:border-2 hover:border-gray-600 hover:bg-gray-900 rounded-2xl"  
         onClick={onStop}>Остановить</button>

      <button className='flex items-center justify-center' onClick={() => setSettingsOpened(!settingsOpened)}>
        <img draggable={false} className='w-10 h-10 invert ' src={settingsLogo}/>
      </button>

      <div  className={`bg-[#0a0a0af1] w-52 flex flex-col flex-nowrap p-2 m-1 content-start gap-3 ${settingsOpened ? "scale-100 opacity-100 " : 'scale-95 opacity-0 pointer-events-none'} overflow-hidden absolute left-44 top-13 transition-all duration-300 delay-75 origin-top-right ease-in-out`} >
        
        <label className='flex flex-col'>
          Число людей:
          <span>
            <input className='h-3 m-2 align-middle bg-blue-600 rounded-lg appearance-none cursor-pointer accent-[#EAF2EF] disabled:bg-gray-500'
            disabled={isRunning}
            type="range"
            min="1"
            max="400"
            step="1"
            value={params.agentsAmount}
            onChange={(e) => {
              onParamsChange({...params, agentsAmount: parseInt(e.target.value)})
            }}
          />
          {params.agentsAmount}
          </span>

        </label>
          
        <label className='flex flex-col'>
          Вероятность заражения:
          <span>
          <input className='h-3 m-2 align-middle bg-blue-600 rounded-lg appearance-none cursor-pointer accent-[#EAF2EF] dis abled:bg-gray-500'
            disabled={isRunning}
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={params.infectionRate}
            onChange={(e) => {
              onParamsChange({...params, infectionRate: parseFloat(e.target.value)})
            }}        
          />
          { (params.infectionRate * 100).toFixed()}%
          </span>

        </label>
        <label className='flex flex-col'>
          Дней до выздоровления:
          <span>
          <input className='h-3 m-2 align-middle bg-blue-600 rounded-lg appearance-none cursor-pointer accent-[#EAF2EF] disabled:bg-gray-500'
            disabled={isRunning}
            type="range"
            min="1"
            max="100"
            value={params.recoveryTime}
            onChange={(e) => {
              onParamsChange({...params, recoveryTime: parseInt(e.target.value)})
            }} 
            />
            {params.recoveryTime}
            </span>

        </label>
        <label className='flex flex-col'>
          Скорость:
          <span>
          <input className='h-3 m-2 align-middle bg-blue-600 rounded-lg appearance-none cursor-pointer accent-[#EAF2EF] disabled:bg-gray-500'
            disabled={isRunning}
            type="range"
            min="0.01"
            max="3"
            step="0.01"
            value={params.agentSpeed}
            onChange={(e) => {
              onParamsChange({...params, agentSpeed: parseFloat(e.target.value)})
            }} 
            />
          {params.agentSpeed}
          </span>
        </label>
        <label className='flex flex-col'>
          Радиус заражения:
          <span>
          <input className='h-3 m-2 align-middle bg-blue-600 rounded-lg appearance-none cursor-pointer accent-[#EAF2EF] disabled:bg-gray-500'
            disabled={isRunning}
            type="range"
            min="1"
            max="75"
            step="1"
            value={params.infectionRadius}
            onChange={(e) => {
              onParamsChange({...params, infectionRadius: parseInt(e.target.value)})
            }} 
            />
          {params.infectionRadius}
          </span>

        </label>
        
        <label className='flex items-center'>
          Социальная дистанция
          <input className='h-3 align-middle bg-blue-600 rounded-lg appearance-none cursor-pointer accent-[#EAF2EF] disabled:bg-gray-500'
            disabled={isRunning}
            type="checkbox"
            checked={params.isSocialIsolation}
            onChange={(e) => {
              onParamsChange({...params, isSocialIsolation:  e.target.checked})
            }} 
            />
          <img className='w-10 h-10 invert ' src={params.isSocialIsolation ? checkboxChecked : checkboxUnChecked}/>

        </label>
        <label className={`${params.isSocialIsolation ? "scale-100" : "scale-0 w-0 h-0"}  flex flex-col`}>
          Радиус изоляции:
          <span>
          <input className='h-3 m-2 align-middle bg-blue-600 rounded-lg appearance-none cursor-pointer accent-[#EAF2EF] disabled:bg-gray-500'
            disabled={isRunning}
            type="range"
            min="1"
            max="30"
            step="1"
            value={params.socialIsolationDistance}
            onChange={(e) => {
              onParamsChange({...params, socialIsolationDistance: parseInt(e.target.value)})
            }} 
            />
          {params.socialIsolationDistance}
          </span>

        </label>
        <button className="h-12 w-40 bg-gray-950 hover:border-2 hover:border-gray-600 hover:bg-gray-900 rounded-2xl" 
        disabled={isRunning}
        onClick={()=> {onParamsChange({    
          agentsAmount: 100,
          infectionRate: 0.3,
          recoveryTime: 20,
          agentSpeed: 1.5, 
          infectionRadius: 10,
          isSocialIsolation:false,
          socialIsolationDistance: 10})}}>Сбросить</button>
      </div>
    </div>
  );
};

export default Controls;