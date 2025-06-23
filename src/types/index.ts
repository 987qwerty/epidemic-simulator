export type AgentStatus = 'healthy' | 'infected' | 'recovered'

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
