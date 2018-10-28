import expect from "expect";
import update from "immutability-helper";
import ioc from "../src/ioc";
import { toUpdateQuery } from "../src/query";

describe("ioc", () => {
  it("should export `toUpdateQuery` and original immutability-helper `update` function", () => {
    expect(ioc.toUpdateQuery).toBe(toUpdateQuery);
    expect(ioc.update).toBe(update);
  });
});
