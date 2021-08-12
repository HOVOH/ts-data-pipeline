import { IPipeline, IUnitPipeline, Pipeline, Stage, UnitPipeline } from "./Pipeline";

export class PipelineFactory<T, O> implements IPipeline<T, O>, IUnitPipeline<T, O>{

  stages: Stage<any, any>[];
  history: O[] = [];
  private readonly maxHistorySize: number;
  constructor(stages: Stage<any, any>[], maxHistorySize = 10) {
    this.stages = stages;
    this.maxHistorySize = maxHistorySize;

  }

  fillHistory(history: O[]){
    if (history.length >= this.maxHistorySize) {
      this.history.splice(0, this.maxHistorySize, ...history.slice(0, this.maxHistorySize));
      return;
    }
    if(this.history.length + history.length > this.maxHistorySize){
      this.history.splice(this.maxHistorySize - history.length);
    }
    this.history.unshift(...history)
  }

  async process(elements: T[]): Promise<O[]> {
    const pipeline = new Pipeline(this.stages, [...this.history]);
    const processed = await pipeline.process(elements);
    this.fillHistory(processed);
    return processed;
  }

  async processUnit(element: T): Promise<O> {
    const pipeline = new UnitPipeline(this.stages, this.history);
    const processed = await pipeline.processUnit(element);
    this.fillHistory([processed]);
    return processed;
  }


}
