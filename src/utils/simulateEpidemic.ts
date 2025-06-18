// src/utils/simulateStep.ts

import { Agent, Obstacle, SimulationParams } from '../types'

const TURN_FACTOR = 0.3
const OBSTACLE_AVOID_DISTANCE = 5

/**
 * Основная функция симуляции одного шага.
 * Обновляет состояние всех агентов: их положение, заражение, выздоровление.
 */
export const simulateStep = (
  agents: Agent[],
  params: SimulationParams,
  width: number,
  height: number,
  obstacles: Obstacle[] = []

): Agent[] => {
  return agents.map(agent => {
    const MAX_SPEED = params.agentSpeed
    const INFECTION_RADIUS = params.infectionRadius
    //  1. Движение агента 

    // Рандомный поворот (с небольшой вероятностью)
    if (Math.random() < 0.05) {
      const angleChange = (Math.random() - 0.5) * TURN_FACTOR
      const currentAngle = Math.atan2(agent.vy, agent.vx)
      const newAngle = currentAngle + angleChange

      agent.vx = Math.cos(newAngle) * MAX_SPEED
      agent.vy = Math.sin(newAngle) * MAX_SPEED
    }

    //  Отталкивание при соблюдении социальной изоляции :
    if(params.isSocialIsolation){
      for (let other of agents) {
      const dx = agent.x - other.x
      const dy = agent.y - other.y
      const dist = Math.hypot(dx, dy) 
      // +5 - Учет радиуса агента 
      if (other !== agent && dist  < params.socialIsolationDistance + 5) {
        // Чем ближе — тем сильнее отталкивание
        const force = (params.socialIsolationDistance + 5 ) / (params.socialIsolationDistance + 5 - dist)
        const angle = Math.atan2(dy, dx) 
        agent.vx += Math.cos(angle) * force * 0.5
        agent.vy += Math.sin(angle) * force * 0.5
        }
      }
    }
    //  Отталкивание от препятствий 
    for (let obstacle of obstacles) {
      const dx = agent.x - obstacle.x
      const dy = agent.y - obstacle.y
      const dist = Math.hypot(dx, dy) 

      if (dist  < OBSTACLE_AVOID_DISTANCE + obstacle.radius) {
        // Чем ближе — тем сильнее отталкивание
        const force = (OBSTACLE_AVOID_DISTANCE + obstacle.radius ) / (OBSTACLE_AVOID_DISTANCE + obstacle.radius - dist)
        const angle = Math.atan2(dy, dx)
        agent.vx += Math.cos(angle) * force * 0.5
        agent.vy += Math.sin(angle) * force * 0.5
      }
    }
    //  Ограничение скорости 
    const speed = Math.hypot(agent.vx, agent.vy)
    if (speed > MAX_SPEED) {
      agent.vx = (agent.vx / speed) * MAX_SPEED
      agent.vy = (agent.vy / speed) * MAX_SPEED
    }
    //  Отталкивание от границ 
    if (agent.x <= 0 || agent.x >= width) {
      agent.vx *= -1
    }
    if (agent.y <= 0 || agent.y >= height) {
      agent.vy *= -1
    }

    // Перемещаем агента
    agent.x += agent.vx
    agent.y += agent.vy

    //  Логика заражения 
    if (agent.status === 'infected') {


      // Поиск здоровых рядом
      for (let other of agents) {
        if (other.status === 'healthy') {
          const dx = agent.x - other.x
          const dy = agent.y - other.y
          const dist = Math.hypot(dx, dy)

          if (dist < INFECTION_RADIUS && Math.random() < params.infectionRate) {
            other.status = 'infected'
          }
        }
      }

      // Проверка на выздоровление
      if (agent.daysInfected >= params.recoveryTime) {
        agent.status = 'recovered'
      }
    }

    return agent
  })
}