import TransformerPipe from "./TransformerPipe";
import CriticalDataError from "../errors/CriticalDataError";
import DataError from "../errors/DataError";

export default class MapPipe<T, O> extends TransformerPipe<T, O> {

  constructor(private map:(t:T, flagError: (error: DataError|CriticalDataError) => void) => O) {
    super();
    this.transform = this.transform.bind(this)
    this.addError = this.addError.bind(this);
  }

  async transform(element: T, i: number): Promise<O> {
    return this.map(element, (error) => this.addError(i, error));
  }

}
