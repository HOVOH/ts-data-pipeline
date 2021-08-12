import DataError from "../../src/errors/DataError";

describe("Data Error", () => {
  it("constructor", () => {
    const error = new DataError("test", {test: "hello"})
    expect(error.critical).toBe(false)
    expect(error.message).toBe("test");
    expect(error.data).toEqual({test: "hello"});
    expect(error.pipeError).toBe(true);
  })

})
