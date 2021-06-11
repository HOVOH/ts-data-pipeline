import { BatchPipeline } from "./Pipeline";

export class PipelineFactory<U,V,T extends BatchPipeline<U, V>> {

  constructor(private builder:() => Promise<T>) {
  }

  async create(): Promise<T>{
    return this.builder();
  }
}
