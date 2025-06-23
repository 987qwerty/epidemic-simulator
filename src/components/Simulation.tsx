import React, { use, useEffect, useRef } from 'react'
import { EpidemicStats, SimulationParams } from '../types'
import { Agent } from '../types/Agent'
import { Obstacle } from '../types/Obstacle'
import { CanvasContext } from '../App'

interface Props {
  running: boolean,
  params: SimulationParams,
  onStep: (stats: EpidemicStats) => void,
  day: number
}

const Simulation: React.FC<Props> = ({ running, params, onStep, day }) => {
  const { width, height }: { width: number, height: number } = use(CanvasContext)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const agentsRef = useRef<Agent[]>([])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = width
    canvas.height = height

    // Инициализируем агентов 
    if (!running) { // инициализация при остановке 
      agentsRef.current = Array.from({ length: params.agentsAmount }, (_, i) => (new Agent(i == 0 ? 'infected' : 'healthy', width, height)))
    }
    const obstacles: Obstacle[] = Array.from({ length: 7 }, (_, i) => (new Obstacle(40 + i * 100, 50, 20))).concat(
      Array.from({ length: 7 }, (_, i) => (new Obstacle(40 + i * 100, height - 50, 20)))

    )
    let animationId: number

    const draw = () => {
      const canvas = canvasRef.current
      if (!canvas) return
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      ctx.clearRect(0, 0, width, height)

      if (running) {
        // Обновляем состояние агентов на каждом кадре
        //agentsRef.current = simulateStep(agentsRef.current, params, width, height, obstacles) 
        agentsRef.current.map(a => a.move(agentsRef.current, width, height, params, obstacles))
      }

      // Отрисовка
      agentsRef.current.forEach(agent => {
        ctx.beginPath()
        ctx.arc(agent.x, agent.y, 5, 0, Math.PI * 2)
        switch (agent.status) {
          case 'healthy': ctx.fillStyle = 'green'; break
          case 'infected': ctx.fillStyle = 'red'; break
          case 'recovered': ctx.fillStyle = 'blue'; break
          default: ctx.fillStyle = 'gray'
        }
        ctx.fill()
      })
      obstacles.forEach(obstacle => {
        ctx.beginPath();
        ctx.arc(obstacle.x, obstacle.y, obstacle.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#888'; // Серый цвет колонны
        ctx.fill();
      });
      animationId = requestAnimationFrame(draw)
    }

    draw()

    return () => cancelAnimationFrame(animationId)
  }, [running, params.agentsAmount, width, height])

  // Обновление статистики раз в день (1 секунда)
  useEffect(() => {
    if (!running) return

    const healthy = agentsRef.current.filter(a => a.status === 'healthy').length
    const infected = agentsRef.current.filter(a => a.status === 'infected').length
    const recovered = agentsRef.current.filter(a => a.status === 'recovered').length
    agentsRef.current.map(a => a.incrementDay())
    //agentsRef.current = agentsRef.current.map(a => a.status === 'infected' ? {...a, daysInfected: a.daysInfected + 1} : a)
    onStep({
      day: day++,
      healthy,
      infected,
      recovered,
    })
  }, [day])

  return <canvas className='overflow-auto border-2 rounded-2xl border-[#3e3c4bc7]' ref={canvasRef} />
}

export default Simulation 