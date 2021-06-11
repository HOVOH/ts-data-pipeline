import TransformerPipe from "./TransformerPipe";

export default class MapPipe<T, O> extends TransformerPipe<T, O> {

  constructor(private map:(t:T) => O) {
    super();
    this.transform = this.transform.bind(this)
  }

  async transform(element: T): Promise<O> {
    return this.map(element);
  }

}
