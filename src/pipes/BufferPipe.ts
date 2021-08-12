import { IPipe } from "../IPipe";

export default abstract class BufferPipe<T, O> implements IPipe<T, O>{

  queue: T[][] = [];
  resolvers: ((o: O[]) => void)[] = []
  rejecters: ((a: any) => void)[] = []
  intervalId: NodeJS.Timeout;

  protected constructor(interval: number) {
    this.intervalId = setInterval(() => this.onInterval(), interval);
  }

  async onInterval(){
    if (this.queue.length === 0) return;
    const test: T[][] = this.queue.slice();
    this.queue = []
    const resolvers = this.resolvers.slice();
    this.resolvers = [];
    const rejecters = this.rejecters.slice();
    this.rejecters = [];

    const flattened = test.reduce((acc, val)=>acc.concat(val), [])
    let processed;
    try {
      processed = await this.run(flattened);
    } catch (e){
      console.log(e)
      rejecters.forEach(reject=> reject({
        message:"Error while Batch execution: "+e.message,
        stack: e.stack
      }));
      return;
    }

    const resolved: O[][] = []
    for (let i = 0; i < flattened.length; i += test[i].length){
      resolved.push(processed.slice(i, i+test[i].length));
    }
    resolvers.forEach((resolve, index) => resolve(resolved[index]))
  }

  abstract run(queued: T[]): Promise<O[]>;

  processBatch(elements: T[]): Promise<O[]> {
    this.queue.push(elements)
    return new Promise<O[]>((resolve, reject) => {
      this.resolvers.push(resolve)
      this.rejecters.push(reject)
    });
  }
}
