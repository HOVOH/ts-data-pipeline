import { IBatchPipe } from "../IPipe";


export default abstract class TransformerPipe<T, O> implements IBatchPipe<T, O>{

  abstract transform(element: T): Promise<O>;

  async process(elements: T[]): Promise<O[]> {
    return Promise.all(elements.map((e)=>this.transform(e)));
  }
}
