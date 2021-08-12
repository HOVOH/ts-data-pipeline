import { JsonParserPipe } from "../../src";

describe("JsonParserPipe",  () => {
  it("Should return an object if object is valid JSON", async () => {
    const pipe = new JsonParserPipe();
    expect(await pipe.transform("{\"field\":\"value\"}")).toEqual({field: "value"})
  })

  it("Should throw a critical data error if JSON is invalid", async () => {
    expect.assertions(2);
    const pipe = new JsonParserPipe();
    try{
      await pipe.transform("{")
    } catch (cde) {
      expect(cde.critical).toBe(true);
      expect(cde.dataError).toBe(true);
    }
  })
})
