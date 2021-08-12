import { PipelineFactory } from "../src";
import { SimplePipe } from "../src/pipes/SimplePipe";

class TestPipe extends SimplePipe<number, number>{
  protected process(elements: number[], history: number[]): Promise<number[]> {
    return Promise.resolve(elements.map(e => e * history[0]));
  }
}

describe("Pipeline Factory", () => {
  it("Should process elements and append processed to history", async () => {
    const pipelineFact = new PipelineFactory([{
      name: "stage_1",
      pipe: new TestPipe()
    }], 10);
    pipelineFact.fillHistory([2]);
    expect(await pipelineFact.process([1,2,3])).toEqual([2,4,6]);
    expect(pipelineFact.history).toEqual([2,4,6,2]);
    expect(pipelineFact.history.length).toEqual(4);
  })

  it("Should process elements and append and truncate history", async () => {
    const pipelineFact = new PipelineFactory([{
      name: "stage_1",
      pipe: new TestPipe()
    }], 2);
    pipelineFact.fillHistory([2]);
    expect(await pipelineFact.process([1,2,3])).toEqual([2,4,6]);
    expect(pipelineFact.history).toEqual([2,4]);
    expect(pipelineFact.history.length).toEqual(2);
  })

  it("Should process elements and append and truncate", async () => {
    const pipelineFact = new PipelineFactory([{
      name: "stage_1",
      pipe: new TestPipe()
    }], 3);
    pipelineFact.fillHistory([2, 1]);
    expect(await pipelineFact.process([1,2,3])).toEqual([2,4,6]);
    expect(pipelineFact.history).toEqual([2,4,6]);
    expect(pipelineFact.history.length).toEqual(3);
  })

  it("Should process unit", async () => {
    const pipelineFact = new PipelineFactory([{
      name: "stage_1",
      pipe: new TestPipe()
    }], 3);
    pipelineFact.fillHistory([2, 1]);
    expect(await pipelineFact.processUnit(5)).toEqual(10);
    expect(pipelineFact.history).toEqual([10,2,1]);
    expect(pipelineFact.history.length).toEqual(3);
  })
})
