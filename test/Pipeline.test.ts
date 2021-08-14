import { Pipeline, UnitPipeline } from "../src";
import MapPipe from "../src/pipes/MapPipe";
import { SimplePipe } from "../src/pipes/SimplePipe";
import DataError from "../src/errors/DataError";
import CriticalDataError from "../src/errors/CriticalDataError";

class TestHistoryPipe extends SimplePipe<number, number>{
  protected process(elements: number[], history: number[]): Promise<number[]> {
    return Promise.resolve(elements.map(e => e*history[0]));
  }
}

describe("Pipeline", () => {
  it("Should process elements", async () => {
    const pipeline = new Pipeline<number, number>([
      {
        name: "stage_1",
        pipe: new MapPipe((e: number) => e*2)
      },
      {
        name: "stage_2",
        pipe: new MapPipe((e: number) => e*2)
      },
    ])
    expect(await pipeline.process([1,2,3])).toEqual([4,8,12])
  })

  it("Should be able to use history", async () => {
    const pipeline = new Pipeline([{
      name: "stage_1",
      pipe: new TestHistoryPipe()
    }], [2]);
    expect(await pipeline.process([1, 2])).toEqual([2,4]);
  })

  it("Should append a healthRecord for each stage", async () => {
    const pipeline = new Pipeline<number, number>([
      {
        name: "stage_1",
        pipe: new MapPipe((data, flagError) => {
          if(data === 11){
            flagError(new CriticalDataError("critical", data));
          }
          return data
        })
      },
      {
        name: "stage_2",
        pipe: new MapPipe((data, flagError) => {
          if (data === 9 || data === 10){
            flagError(new DataError("error", data))
          }
          return data;
        })
      }
    ])
    await pipeline.process([9,10,11]);
    const hr = pipeline.healthRecord;
    expect(hr.numberOfStages).toBe(2);
    expect(hr.stagesHealth[0].name).toBe("stage_1");
    expect(hr.stagesHealth[0].batchSize).toBe(3);
    expect(hr.stagesHealth[0].errors.length).toBe(1);
    expect(hr.stagesHealth[1].name).toBe("stage_2");
    expect(hr.stagesHealth[1].batchSize).toBe(2);
    expect(hr.stagesHealth[1].errors.length).toBe(2);
  })
})

describe("UnitPipeline", () => {
  it("Should process a single element", async () => {
    const pipeline = new UnitPipeline<number, number>([
      {
        name: "stage_1",
        pipe: new MapPipe((e: number) => e*2)
      },
    ])
    expect(await pipeline.processUnit(1)).toEqual(2);
  })

  it("Should return null if CriticalDataError occurs", async () => {
    const pipeline = new UnitPipeline<number, number>([
      {
        name: "stage_1",
        pipe: new MapPipe((data, flagError) => {
          flagError(new CriticalDataError("critical", data));
          return data
        })
      },
    ])
    expect(await pipeline.processUnit(1)).toBeNull();
  })
})
