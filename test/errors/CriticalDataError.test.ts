import CriticalDataError from "../../src/errors/CriticalDataError";

describe("Critical Data Error", () => {
  it("constructor", () => {
    const error = new CriticalDataError("test", {test: "hello"})
    expect(error.critical).toBe(true)
    expect(error.message).toBe("test");
    expect(error.data).toEqual({test: "hello"});
    expect(error.pipeError).toBe(true);
  })

})
