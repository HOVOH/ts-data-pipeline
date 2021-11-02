import { CriticalDataError, MapPipe, PipelineFactory, TransformerPipe } from "../src";
import { SimplePipe } from "../src";

class TestPipe extends SimplePipe<number, number>{
  protected process(elements: number[], history: number[]): Promise<number[]> {
    return Promise.resolve(elements.map(e => e * history[0]));
  }
}

class ErrorPipe extends TransformerPipe<number, number> {

  async transform(e: number) {
    if (e === 10){
      throw new CriticalDataError("critical", 10);
    }
    return e*2
  }
}

describe("Pipeline Factory", () => {
  it("Should process elements and append processed to history", async () => {
    const pipelineFact = new PipelineFactory(() => [{
      name: "stage_1",
      pipe: new TestPipe()
    }], 10);
    pipelineFact.fillHistory([2]);
    const {data} = await pipelineFact.process([1,2,3]);
    expect(data).toEqual([2,4,6]);
    expect(pipelineFact.history).toEqual([2,4,6,2]);
    expect(pipelineFact.history.length).toEqual(4);
  })

  it("Should process elements and append and truncate history", async () => {
    const pipelineFact = new PipelineFactory(() => [{
      name: "stage_1",
      pipe: new TestPipe()
    }], 2);
    pipelineFact.fillHistory([2]);
    const {data} = await pipelineFact.process([1,2,3]);
    expect(data).toEqual([2,4,6]);
    expect(pipelineFact.history).toEqual([2,4]);
    expect(pipelineFact.history.length).toEqual(2);
  })

  it("Should process elements and append and truncate", async () => {
    const pipelineFact = new PipelineFactory(() => [{
      name: "stage_1",
      pipe: new TestPipe()
    }], 3);
    pipelineFact.fillHistory([2, 1]);
    const {data} = await pipelineFact.process([1,2,3]);
    expect(data).toEqual([2, 4, 6]);
    expect(pipelineFact.history).toEqual([2,4,6]);
    expect(pipelineFact.history.length).toEqual(3);
  })

  it("Should process unit", async () => {
    const pipelineFact = new PipelineFactory(() => [{
      name: "stage_1",
      pipe: new TestPipe()
    }], 3);
    pipelineFact.fillHistory([2, 1]);
    const {data} = await pipelineFact.processUnit(5);
    expect(data).toEqual(10);
    expect(pipelineFact.history).toEqual([10, 2, 1]);
    expect(pipelineFact.history.length).toEqual(3);
  });

  it("Should be reusable", async() => {
    const pipelineFact = new PipelineFactory(() => [{
      name: "stage_1",
      pipe: new TestPipe(),
    }], 3);
    pipelineFact.fillHistory([2, 1]);
    const {data: d1} = await pipelineFact.processUnit(5);
    expect(d1).toEqual(10);
    const {data: d2} = await pipelineFact.processUnit(5);
    expect(d2).toEqual(50)
    const {data: d3} = await pipelineFact.processUnit(10);
    expect(d3).toEqual(500)
  })

  it("Should be reusable (thrown error)", async() => {
    const pipelineFact = new PipelineFactory(() => [{
      name: "stage_1",
      pipe: new ErrorPipe()
    }], 3);
    const {data: d1} = await pipelineFact.process([10, 5]);
    expect(d1).toEqual([10]);
    const {data: d2} = await pipelineFact.process([10, 5]);
    expect(d2).toEqual([10])
    const {data: d3} = await pipelineFact.process([100, 100]);
    expect(d3).toEqual([200,200])
  })
})
