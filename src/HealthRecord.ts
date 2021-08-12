import DataError from "./errors/DataError";
import CriticalDataError from "./errors/CriticalDataError";

export interface StageHealthRecord {
  name: string,
  errors: (DataError|CriticalDataError)[],
  batchSize: number
}

export class HealthRecord {
  stagesHealth: StageHealthRecord[]

  constructor() {
    this.stagesHealth = [];
  }

  append(stageName: string, errors: (DataError|CriticalDataError)[], batchSize: number){
    this.stagesHealth.push({
      name: stageName,
      errors,
      batchSize,
    })
  }

  get numberOfStages(): number{
    return this.stagesHealth.length;
  }

  forStage(name: string){
    return this.stagesHealth.find(stage => stage.name === name);
  }
}
