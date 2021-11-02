import { Pipeline, Stage, UnitPipeline } from "./Pipeline";
import { HealthRecord } from "./HealthRecord";
import {EventEmitter} from 'events';

const BEFORE_PROCESS_EVENT = "before_process_event";
const AFTER_PROCESS_EVENT = "after_process_event";

export class PipelineFactory<T, O>{

  stages: () => Stage<any, any>[];
  history: O[] = [];
  eventEmitter: EventEmitter;

  private readonly maxHistorySize: number;
  constructor(stages: () => Stage<any, any>[], maxHistorySize = 10) {
    this.stages = stages;
    this.maxHistorySize = maxHistorySize;
    this.eventEmitter = new EventEmitter();
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

  async process(elements: T[]): Promise<{ data: O[], health: HealthRecord }> {
    const pipeline = new Pipeline(this.stages(), [...this.history]);
    this.eventEmitter.emit(BEFORE_PROCESS_EVENT, elements, [...this.history])
    const processed = await pipeline.process(elements);
    this.eventEmitter.emit(AFTER_PROCESS_EVENT, pipeline.healthRecord, processed, this.history)
    this.fillHistory(processed);
    return { data: processed, health: pipeline.healthRecord };
  }

  async processUnit(element: T): Promise<{ data: O|null, health: HealthRecord }> {
    const pipeline = new UnitPipeline(this.stages(), [...this.history]);
    this.eventEmitter.emit(BEFORE_PROCESS_EVENT, [element], [...this.history])
    const processed = await pipeline.processUnit(element);
    this.eventEmitter.emit(AFTER_PROCESS_EVENT, pipeline.healthRecord, processed, this.history)
    if (processed) {
      this.fillHistory([processed]);
    }
    return { data: processed, health: pipeline.healthRecord };
  }

  beforeProcess(cb: (elements: Readonly<T[]>, history: Readonly<T[]>) => void){
    this.eventEmitter.on(BEFORE_PROCESS_EVENT, cb);
    return () => this.eventEmitter.removeListener(BEFORE_PROCESS_EVENT, cb);
  }

  afterProcess(cb: (healthRecord: Readonly<HealthRecord>, elements: Readonly<T[]>, history: Readonly<T[]>) => void){
    this.eventEmitter.on(AFTER_PROCESS_EVENT, cb);
    return () => this.eventEmitter.removeListener(AFTER_PROCESS_EVENT, cb);
  }

}
