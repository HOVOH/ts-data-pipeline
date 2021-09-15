import { SimplePipe } from "./pipes/SimplePipe";
import { HealthRecord } from "./HealthRecord";

export interface IPipeline<T, O> {
    process(elements: T[]): Promise<O[]>;
}

export interface IUnitPipeline<T,O>{
    processUnit(element: T): Promise<O | null>;
}

export interface Stage<T, O> {
    name: string,
    pipe: SimplePipe<T, O>
}

export class Pipeline<T, O> implements IPipeline<T, O>{
    stages: Stage<any, any>[];
    healthRecord: HealthRecord;
    history: O[];

    constructor(stages: Stage<any, any>[], history: O[] = []) {
        this.stages = stages;
        this.history = history;
        this.healthRecord = new HealthRecord();
    }

    async process(elements: T[]): Promise<O[]> {
        let product: (T|O)[] = elements;
        for (const stage of this.stages) {
            const batchSize = product.length;
            product = await stage.pipe.processBatch(product, this.history);
            this.processHealthRecord(stage, batchSize);
        }
        return <O[]> product;
    }

    private processHealthRecord(stage: Stage<any, any>, batchSize: number){
        this.healthRecord.append(
          stage.name,
          stage.pipe.errors.map(iError => iError.error),
          batchSize
        );
    }
}

export class UnitPipeline<T, O> extends Pipeline<T, O> implements IUnitPipeline<T, O>{

    async processUnit(element: T): Promise<O | null>{
      const product = await this.process([element]);
      return product[0]??null;
    }
}
