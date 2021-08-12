import { SimplePipe } from "./SimplePipe";

export default abstract class TransformerPipe<T, O> extends SimplePipe<T, O>{

  abstract transform(element: T, i: number): Promise<O>;

  process(elements: T[]): Promise<O[]> {
    return <Promise<O[]>> Promise.all(
      elements.map((e, i) => this.safeTransform(e, i))
    );
  }

  async safeTransform(e: T, i: number): Promise<O>{
    try {
      return await this.transform(e, i);
    } catch (error){
      this.addError(i, error);
    }
    return e as unknown as O
  }
}
