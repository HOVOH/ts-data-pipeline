export interface IPipe<T, O>{
    processBatch(elements: T[], history: O[]): Promise<O[]>;
}
