import TransformerPipe from "./TransformerPipe";

export default class JsonParserPipe<T> extends TransformerPipe<string, T>{
  async transform(element: string): Promise<T> {
    return JSON.parse(element);
  }
}
