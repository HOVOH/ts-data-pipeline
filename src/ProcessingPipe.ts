import IRule from "./IRule";
import {IBatchPipe, IUnitPipe} from "./IPipe";
import HealthThresholdNotReached from "./errors/HealthThresholdNotReached";

class ProcessingPipe<T> implements IBatchPipe<T, T>, IUnitPipe<T, T>{
    rules: IRule<T>[];
    index: number = 0;
    collection: T[] = [];
    validityThreshold: number;
    unhealthy: number = 0;
    invalid: (T)[] = [];

    constructor(validityThreshold = 0.8, rules: IRule<T>[] = []) {
        this.validityThreshold = validityThreshold;
        this.rules = rules;
    }

    addRule(rule: IRule<T>){
        this.rules.push(rule);
    }

    async process(elements: T[]): Promise<T[]>{
        this.cleanUp();
        this.collection = elements;
        for (this.index = 0; this.index < this.collection.length; this.index++){
            try {
                await this.applyRuleOnIndex();
            } catch (irrecoverablePipeError){
                this.invalid.push(this.collection[this.index]);
                this.collection.splice(this.index, 1);
                this.index--;
            }
            if (!this.dataIsHealthy()){
                throw new HealthThresholdNotReached(`Health threshold (${this.validityThreshold}) not reached`);
            }
        }
        return this.collection;
    }

    private async applyRuleOnIndex(){
        let element = this.collection[this.index];
        let unhealthy = false;
        for (const rule of this.rules) {
            try {
                element = await rule.apply(element, this.collection, this.index);
            } catch (pipeError) {
                if (!unhealthy){
                    unhealthy = true;
                    this.unhealthy++;
                }
                if (pipeError.throwAway){
                    throw pipeError;
                }
            }
        }
      this.collection[this.index] = element;
    }

    dataIsHealthy(){
      return this.collection.length > 0 && (this.collection.length - this.unhealthy)/this.collection.length >= this.validityThreshold
    }

    async processUnit(elements: T[], index: number): Promise<T[]>{
        this.cleanUp();
        this.index = index;
        this.collection = elements;
        await this.applyRuleOnIndex();
        return this.collection;
    }

    private cleanUp() {
        this.index = 0;
        this.unhealthy = 0;
        this.invalid = [];
    }

}
export default ProcessingPipe;
