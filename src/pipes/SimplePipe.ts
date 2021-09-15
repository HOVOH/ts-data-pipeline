import { IPipe } from "../index";
import DataError from "../errors/DataError";
import PipeError from "../errors/PipeError";
import CriticalDataError from "../errors/CriticalDataError";

export abstract class SimplePipe<T, O> implements IPipe<T, O>{

  errors: ({ index: number, error: DataError|CriticalDataError })[];

  constructor() {
    this.errors = []
  }

  async processBatch(elements: T[], history: O[]): Promise<O[]> {
    try{
      let processed = await this.process(elements, history);
      processed = this.removeCriticalDataErrors(processed);
      return processed;
    } catch (error){
      throw new PipeError(error.message);
    }
  }

  protected abstract process(elements: T[], history: O[]): Promise<O[]>;

  protected addError(index:number, error: DataError|CriticalDataError){
    this.errors.push({
      index,
      error
    })
  }

  protected removeCriticalDataErrors(elements: O[]): O[]{
    const badDataIndex = this.errors
      .filter(error => error.error.dataError && error.error.critical)
      .map(error => error.index);
    const goodData: O[] = []
    elements.forEach((element, index) => {
      if (!badDataIndex.includes(index)){
        goodData.push(element)
      }
    })
    return goodData;
  }
}
