import { SimplePipe } from "../../src/pipes/SimplePipe";
import DataError from "../../src/errors/DataError";
import CriticalDataError from "../../src/errors/CriticalDataError";

class TestSimplePipe extends SimplePipe<number, number> {
  process(elements: number[]): Promise<number[]> {
    return Promise.resolve(elements.map(n => n*2));
  }
}

class DataErrorSimplePipe extends SimplePipe<number, number>{
  protected process(elements: number[]): Promise<number[]> {
    this.addError(0, new DataError("error", "0"));
    this.addError(1, new CriticalDataError("critical error", "1"))
    return Promise.resolve(elements);
  }
}

describe("SimplePipe", () => {
  it("Should process data", async () => {
    const pipe = new TestSimplePipe();
    expect(await pipe.processBatch([1,2,3], [])).toEqual([2,4,6]);
  })

  it("Should remove data with CriticalDataError", async () => {
    const pipe = new DataErrorSimplePipe();
    expect(await pipe.processBatch([1,2,3], [])).toEqual([1,3])
  })
})
