import {IBatchPipe} from "../IPipe";
import ISorter from "./ISorter";

class SorterPipe<T> implements IBatchPipe<T, T>{

    sorter: ISorter<T>;

    constructor(sorter: ISorter<T>) {
        this.sorter = sorter;
    }

    async process(elements: T[]): Promise<T[]> {
        return elements.sort(this.sorter);
    }

}
export default SorterPipe;
