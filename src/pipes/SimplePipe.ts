import { IPipe } from "../index";
import DataError from "../errors/DataError";
import PipeError from "../errors/PipeError";
import CriticalDataError from "../errors/CriticalDataError";

export abstract class SimplePipe<T, O> implements IPipe<T, O>{

  errors: ({ index: number, error: DataError|CriticalDataError })[] = [];

  async processBatch(elements: T[], history: O[]): Promise<O[]> {
    try{
      const processed = await this.process(elements, history);
      this.removeCriticalDataErrors(processed);
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

  protected removeCriticalDataErrors(elements: O[]){
    for (let pipeError of this.errors){
      const {index, error} = pipeError;
      if (error.dataError && error.critical){
        elements.splice(index, 1);
      }
    }
  }
}
