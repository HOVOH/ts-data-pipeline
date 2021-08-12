import TransformerPipe from "./TransformerPipe";
import CriticalDataError from "../errors/CriticalDataError";

export default class JsonParserPipe<T> extends TransformerPipe<string, T>{
  async transform(element: string): Promise<T> {
    try {
      return JSON.parse(element);
    } catch (error) {
      throw new CriticalDataError(error.message, element);
    }
  }
}
