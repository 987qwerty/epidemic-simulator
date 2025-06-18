export type AgentStatus = 'healthy' | 'infected' | 'recovered'

export interface IAgent {
  x: number,
  y: number,
  vx: number,
  vy: number,
  status: AgentStatus,
  daysInfected: number
}

export interface SimulationParams {
  agentsAmount: number,
  infectionRate: number,
  recoveryTime: number,
  agentSpeed: number, 
  infectionRadius: number,
  isSocialIsolation: boolean,
  socialIsolationDistance: number
}

export interface EpidemicStats {
  day: number,
  healthy: number,
  infected: number,
  recovered: number
}

export interface IObstacle {
  x: number,
  y: number,
  radius: number
}