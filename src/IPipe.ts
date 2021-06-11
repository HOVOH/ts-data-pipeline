export interface IBatchPipe<T, O>{
    process(elements: T[]): Promise<O[]>;
}

export interface IUnitPipe<T, O> {
    processUnit(elements: T[], index: number): Promise<O[]>;
}
