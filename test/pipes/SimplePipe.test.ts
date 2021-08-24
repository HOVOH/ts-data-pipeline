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
    const ns = elements.map((n, i) => {
      if (n < 5){
        this.addError(i, new DataError("error", "0"));
      } else if (n < 10){
        this.addError(i, new CriticalDataError("critical error", "1"))
      }
      return n*2
    })
    return Promise.resolve(ns);
  }
}

describe("SimplePipe", () => {
  it("Should process data", async () => {
    const pipe = new TestSimplePipe();
    expect(await pipe.processBatch([10,20,30], [])).toEqual([20,40,60]);
  })

  it("Should remove data with CriticalDataError", async () => {
    const pipe = new DataErrorSimplePipe();
    expect(await pipe.processBatch([1,5,10,7,3,8], [])).toEqual([2,20,6])
  })
})
