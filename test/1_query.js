import expect from "expect";
import {
  createTreeList,
  resolvePathKeys,
  tail,
  toUpdateQuery
} from "../src/query";

function runPaths(path, fn) {
  fn(path);
  if (Array.isArray(path)) {
    fn(path.join("."));
  } else {
    fn([path]);
  }
}

function createTestWithPayload(
  cmd,
  action,
  expectPayload,
  srcPayload = expectPayload
) {
  it(`should create query to ${action}`, () => {
    function runPrimitivePath(value, key) {
      runPaths(value, p =>
        expect(toUpdateQuery(cmd, p, srcPayload)).toEqual({
          [key]: {
            [cmd]: expectPayload
          }
        })
      );
    }
    runPaths([], p =>
      expect(toUpdateQuery(cmd, p, srcPayload)).toEqual({
        [cmd]: expectPayload
      })
    );
    runPaths(["A"], p =>
      expect(toUpdateQuery(cmd, p, srcPayload)).toEqual({
        A: {
          [cmd]: expectPayload
        }
      })
    );
    runPaths(["A", 91, "B"], p =>
      expect(toUpdateQuery(cmd, p, srcPayload)).toEqual({
        A: {
          91: {
            B: {
              [cmd]: expectPayload
            }
          }
        }
      })
    );
    runPrimitivePath(0, "0");
    runPrimitivePath(91, "91");
    runPrimitivePath(false, "false");
    runPrimitivePath(true, "true");
  });
}

function createTestWithOptionalKeys(cmd, action) {
  it("should create empty query with empty path", () => {
    runPaths([], p => expect(toUpdateQuery(cmd, p)).toEqual({}));
  });
  it(`should create query to ${action}`, () => {
    runPaths(["A"], p => {
      expect(toUpdateQuery(cmd, p)).toEqual({
        [cmd]: ["A"]
      });
      expect(toUpdateQuery(cmd, p, "key")).toEqual({
        A: {
          [cmd]: ["key"]
        }
      });
      expect(toUpdateQuery(cmd, p, ["foo", "bar"])).toEqual({
        A: {
          [cmd]: ["foo", "bar"]
        }
      });
    });
    runPaths(["A", "B"], p => {
      expect(toUpdateQuery(cmd, p)).toEqual({
        A: {
          [cmd]: ["B"]
        }
      });
      expect(toUpdateQuery(cmd, p, "key")).toEqual({
        A: {
          B: {
            [cmd]: ["key"]
          }
        }
      });
      expect(toUpdateQuery(cmd, p, ["foo", "bar"])).toEqual({
        A: {
          B: {
            [cmd]: ["foo", "bar"]
          }
        }
      });
    });
  });
}

describe("query", () => {
  describe("tail", () => {
    it("should return undefined, if array is empty or incorrect despite the offset", () => {
      expect(tail()).toBeUndefined();
      expect(tail([])).toBeUndefined();

      expect(tail(undefined, -1)).toBeUndefined();
      expect(tail(undefined, 0)).toBeUndefined();
      expect(tail(undefined, 1)).toBeUndefined();

      expect(tail([], -1)).toBeUndefined();
      expect(tail([], 0)).toBeUndefined();
      expect(tail([], 1)).toBeUndefined();
    });
    it("should return last element with no offset", () => {
      expect(tail([1, 2])).toEqual(2);
    });
    it("should return element with offset from end, when it's correct", () => {
      expect(tail([1, 2, 3], 0)).toEqual(3);
      expect(tail([1, 2, 3], 1)).toEqual(2);
      expect(tail([1, 2, 3], 2)).toEqual(1);
    });
    it("should return last element when offset is negative", () => {
      expect(tail([1, 2, 3], -1)).toEqual(3);
      expect(tail([1, 2, 3], -10)).toEqual(3);
    });
    it("should return first element when offset is out of range", () => {
      expect(tail([1, 2, 3], 3)).toEqual(1);
      expect(tail([1, 2, 3], 10)).toEqual(1);
    });
  });

  describe("resolvePathKeys", () => {
    it("should resolve empty array", () => {
      runPaths([], p => expect(resolvePathKeys(p)).toEqual([]));
    });
    it("should resolve correct stringified path props", () => {
      runPaths(["a"], p => expect(resolvePathKeys(p)).toEqual(["a"]));
      runPaths(["a", 1], p => expect(resolvePathKeys(p)).toEqual(["a", "1"]));
    });
  });

  describe("createTreeList", () => {
    it("should return array with one empty object, if path props is empty", () => {
      const result = createTreeList([]);
      expect(result.length).toEqual(1);
      expect(result[0]).toEqual({});
    });
    it("should return correct tree list from one path prop", () => {
      const result = createTreeList(["foo"]);
      expect(result.length).toEqual(2);

      const [root, foo] = result;
      expect(root).toEqual({ foo });
      expect(root.foo).toBe(foo);
      expect(foo).toEqual({});
    });
    it("should return correct tree list from many path props", () => {
      const result = createTreeList(["foo", "bar"]);
      expect(result.length).toEqual(3);

      const [root, foo, bar] = result;
      expect(root).toEqual({ foo });
      expect(root.foo).toBe(foo);
      expect(foo).toEqual({ bar });
      expect(foo.bar).toBe(bar);
      expect(bar).toEqual({});
    });
  });

  describe("toUpdateQuery", () => {
    describe("$push (array)", () => {
      createTestWithPayload("$push", "add one element to the end", [5], 5);
      createTestWithPayload("$push", "add many elements to the end", [1, 2]);
    });

    describe("$unshift (array)", () => {
      createTestWithPayload("$unshift", "add one element to the start", [5], 5);
      createTestWithPayload("$unshift", "add many elements to the start", [
        1,
        2
      ]);
    });

    describe("$splice (array of arrays)", () => {
      createTestWithPayload();
    });

    describe("$set (any)", () => {
      createTestWithPayload("$set", "add property with simple value", 5);
      createTestWithPayload("$set", "add property with array value", [5]);
    });

    describe("$toggle (array of strings)", () => {
      createTestWithOptionalKeys("$toggle", "toggle boolean values");
    });

    describe("$unset (array of strings)", () => {
      createTestWithOptionalKeys("$unset", "remove properties");
    });

    describe("$merge (object)", () => {
      createTestWithPayload("$merge", "merge property with object", {
        a: 1,
        b: 2
      });
    });

    describe("$apply (function)", () => {
      createTestWithPayload("$apply", "apply given function to path", () => {});
    });

    describe("$add (any/array/array of arrays)", () => {
      createTestWithPayload("$add", "add one element to a Set", [5], 5);
      createTestWithPayload(
        "$add",
        "add many elements to a Set",
        [1, 2],
        [1, 2]
      );
      createTestWithPayload("$add", "add one element to a Map", [
        ["key", "value"]
      ]);
      createTestWithPayload("$add", "add many elements to Map", [
        [1, 0],
        [2, 1]
      ]);
    });

    describe("$remove (any or array)", () => {
      createTestWithPayload("$remove", "remove one element", [5], 5);
      createTestWithPayload("$remove", "remove many elements", [1, 2]);
    });
  });
});
