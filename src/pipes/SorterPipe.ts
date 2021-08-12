import { SimplePipe } from "./SimplePipe";

export interface ISorter<T> {
    (e0:T, e1:T):number;
}

class SorterPipe<T> extends SimplePipe<T, T>{

    sorter: ISorter<T>;

    constructor(sorter: ISorter<T>) {
        super();
        this.sorter = sorter;
    }

    async process(elements: T[]): Promise<T[]> {
        return elements.sort(this.sorter);
    }

}
export default SorterPipe;
