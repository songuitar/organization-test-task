export interface BossChangeRequest {
  newBossId: number
}

export interface Employee {
  id: number,
  name: string,
  boss?: Employee,
  subordinates: Employee[]
}
