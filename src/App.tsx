import React, { Context, createContext, useEffect, useState } from 'react';
import Simulation from './components/Simulation';
import Controls from './components/Controls';
import EpidemicChart from './components/EpidemicChart.tsx';

import { SimulationParams, EpidemicStats } from './types';


export const CanvasContext: Context<{ width: number, height: number }> = createContext({ width: 0, height: 0 });

const App: React.FC = () => {
  //параметры моделирования
  const [params, setParams] = useState<SimulationParams>({
    agentsAmount: 100,
    infectionRate: 0.3,
    recoveryTime: 20,
    agentSpeed: 1.5,
    infectionRadius: 10,
    isSocialIsolation: false,
    socialIsolationDistance: 10

  });
  // состояние симуляции
  const [running, setRunning] = useState<boolean>(false);
  const [day, setDay] = useState<number>(0);

  // Размеры canvas
  const canvasSize = { width: 600, height: 300 }

  // статистика по дням
  const [stats, setStats] = useState<EpidemicStats[]>([
    { day: 0, healthy: params.agentsAmount - 1, infected: 1, recovered: 0 }
  ]);

  const handleNewStep = (newStats: EpidemicStats) => {
    setStats(prev => [...prev, newStats]);
  };

  // обновление дня (1 секунда - 1 день) 
  useEffect(() => {
    if (!running) return

    const interval = setInterval(() => {
      setDay(prev => prev + 1);
    }, 1000); // 1 секунда = 1 день
    return () => clearInterval(interval)
  }, [running])

  return (
    <div className='flex flex-col items-center'>

      <div className='p-3 w-full h-auto flex justify-between items-center bg-[#14213d] rounded-b-lg '>
        <h1 className='text-1xl font-semibold'>Моделирование эпидемии</h1>
        <Controls
          onStart={() => {
            if (!running) {
              setRunning(true);
              setDay(0);
              setStats([{ day: 0, healthy: params.agentsAmount - 1, infected: 1, recovered: 0 }]);
            }
          }
          }
          onStop={() => setRunning(false)}
          onParamsChange={setParams}
          params={params}
          isRunning={running} />
      </div>
      <div className="items-center p-1 my-4 flex flex-col gap-2">
        <div>
          <CanvasContext.Provider value={canvasSize}>
            <Simulation running={running} params={params} onStep={handleNewStep} day={day} />
          </CanvasContext.Provider>
        </div>
        <div>
          <EpidemicChart data={stats} />
        </div>

      </div>
    </div>
  );
};


export default App;