import { AgentStatus, IAgent, SimulationParams } from "../types";
import {Obstacle} from '../types/Obstacle'
export class Agent implements IAgent{
    x: number;
    y: number;
    vx: number;
    vy: number;
    status: AgentStatus;
    daysInfected: number;

     constructor(status: AgentStatus, width: number, height: number) {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 2;
        this.vy = (Math.random() - 0.5) * 2;
        this.status = status;
        this.daysInfected = 0;
    }
    move(agents: Agent[], width: number, height: number, params: SimulationParams, obstacles: Obstacle[]): void {
        const MAX_SPEED = params.agentSpeed
        const INFECTION_RADIUS = params.infectionRadius
        const TURN_FACTOR = 0.3
        const OBSTACLE_AVOID_DISTANCE = 5

        //  1. Движение агента 

        // Рандомный поворот (с небольшой вероятностью)
        if (Math.random() < 0.05) {
          const angleChange = (Math.random() - 0.5) * TURN_FACTOR
          const currentAngle = Math.atan2(this.vy, this.vx)
          const newAngle = currentAngle + angleChange

          this.vx = Math.cos(newAngle) * MAX_SPEED
          this.vy = Math.sin(newAngle) * MAX_SPEED
        }
        
        //  Отталкивание при соблюдении социальной изоляции :
        if(params.isSocialIsolation){
          for (let other of agents) {
          const dx = this.x - other.x
          const dy = this.y - other.y
          const dist = Math.hypot(dx, dy) 
          // +5 - Учет радиуса агента 
          if (other !== this && dist  < params.socialIsolationDistance + 5) {
            // Чем ближе — тем сильнее отталкивание
            const force = (params.socialIsolationDistance + 5 ) / (params.socialIsolationDistance + 5 - dist)
            const angle = Math.atan2(dy, dx) 
            this.vx += Math.cos(angle) * force * 0.5
            this.vy += Math.sin(angle) * force * 0.5
            }
          }
        }
        //  Отталкивание от препятствий 
        for (let obstacle of obstacles) {
          const dx = this.x - obstacle.x
          const dy = this.y - obstacle.y
          const dist = Math.hypot(dx, dy) 

          if (dist  < OBSTACLE_AVOID_DISTANCE + obstacle.radius) {
            // Чем ближе — тем сильнее отталкивание
            const force = (OBSTACLE_AVOID_DISTANCE + obstacle.radius ) / (OBSTACLE_AVOID_DISTANCE + obstacle.radius - dist)
            const angle = Math.atan2(dy, dx)
            this.vx += Math.cos(angle) * force * 0.5
            this.vy += Math.sin(angle) * force * 0.5
          }
        }

            //  Ограничение скорости 
        const speed = Math.hypot(this.vx, this.vy)
        if (speed > MAX_SPEED) {
          this.vx = (this.vx / speed) * MAX_SPEED
          this.vy = (this.vy / speed) * MAX_SPEED
        }
        //  Отталкивание от границ 
        if (this.x <= 0 || this.x >= width) {
          this.vx *= -1
        }
        if (this.y <= 0 || this.y >= height) {
          this.vy *= -1
        }

        // Перемещаем агента
        this.x += this.vx
        this.y += this.vy

        //  Логика заражения 
        if (this.status === 'infected') {


          // Поиск здоровых рядом
          for (let other of agents) {
            if (other.status === 'healthy') {
              const dx = this.x - other.x
              const dy = this.y - other.y
              const dist = Math.hypot(dx, dy)

              if (dist < INFECTION_RADIUS && Math.random() < params.infectionRate) {
                other.status = 'infected'
              }
            }
          }

          // Проверка на выздоровление
          if (this.daysInfected >= params.recoveryTime) {
            this.status = 'recovered'
          }
        }
    }
    incrementDay(){
        if(this.status === 'infected'){
            this.daysInfected += 1
        }
    }
}