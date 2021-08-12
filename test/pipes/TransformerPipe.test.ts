import TransformerPipe from "../../src/pipes/TransformerPipe";
import CriticalDataError from "../../src/errors/CriticalDataError";
import DataError from "../../src/errors/DataError";

class TestTransformerPipe extends TransformerPipe<number, number> {
  transform(element: number, i: number): Promise<number> {
    if (element === 10){
      throw new CriticalDataError("critical", element);
    }
    if (element === 11){
      throw new DataError("error", element);
    }
    if(element ===12){
      this.addError(i, new DataError("manual error", element));
    }
    return Promise.resolve(element*2);
  }
}

describe("TransformerPipe", () => {
  it("Should transform data", async () => {
    const pipe = new TestTransformerPipe();
    expect(await pipe.processBatch([1,2,3], [])).toEqual([2,4,6]);
  })

  it("Should catch thrown error and return data unchanged", async () => {
    const pipe = new TestTransformerPipe();
    expect(await pipe.processBatch([1, 10, 11], [])).toEqual([2,11]);
  })

  it("Should return processed data if error is added manually", async () => {
    const pipe = new TestTransformerPipe();
    expect(await pipe.processBatch([1,12], [])).toEqual([2,24]);
  })
})
