export default interface IRule<T> {
    apply(e: T, dataset?: T[], index?: number): Promise<T>;
}
