import expect from "expect";
import update from "immutability-helper";
import sinon from "sinon";
import * as functions from "../src/functions";

function testCommandFunction(cmd, destIsOptional) {
  function testUpdateCall(withDest, dest) {
    const ioc = require("./ioc.extensions").default;

    const srcMock = {};
    const payloadMock = {};
    const queryMock = {};
    const resultMock = {};

    const toUpdateQueryStub = sinon.stub().returns(queryMock);
    const updateStub = sinon.stub().returns(resultMock);

    ioc.stubToUpdateQuery(toUpdateQueryStub);
    ioc.stubUpdate(updateStub);

    /* eslint-disable import/namespace */
    const result = withDest
      ? functions[cmd](srcMock, dest, payloadMock)
      : functions[cmd](srcMock, payloadMock);
    /* eslint-enable import/namespace */

    ioc.restoreToUpdateQuery();
    ioc.restoreUpdate();

    expect(toUpdateQueryStub.calledOnce).toEqual(true);
    expect(toUpdateQueryStub.getCall(0).args[0]).toBe(cmd);
    expect(toUpdateQueryStub.getCall(0).args[1]).toBe(dest);
    expect(toUpdateQueryStub.getCall(0).args[2]).toBe(payloadMock);

    expect(updateStub.calledOnce).toEqual(true);
    expect(updateStub.getCall(0).args[0]).toBe(srcMock);
    expect(updateStub.getCall(0).args[1]).toBe(queryMock);

    expect(result).toBe(resultMock);
  }
  describe(cmd, () => {
    if (destIsOptional) {
      it("should call update correctly without dest", () => {
        testUpdateCall(false, "");
      });
    }
    it("should call update correctly with string dest", () => {
      testUpdateCall(true, "");
      testUpdateCall(true, "a");
      testUpdateCall(true, "a.b");
    });
    it("should call update correctly with array dest", () => {
      testUpdateCall(true, []);
      testUpdateCall(true, ["a"]);
      testUpdateCall(true, ["a", "b"]);
    });
  });
}

describe("functions", () => {
  describe("$update", () => {
    it("should be the original immutability-helper update function", () => {
      expect(functions.$update).toBe(update);
    });
  });

  testCommandFunction("$push", true);
  testCommandFunction("$unshift", true);
  testCommandFunction("$splice", true);
  testCommandFunction("$set", false);
  testCommandFunction("$toggle", false);
  testCommandFunction("$unset", false);
  testCommandFunction("$merge", true);
  testCommandFunction("$apply", true);
  testCommandFunction("$add", true);
  testCommandFunction("$remove", true);
});
