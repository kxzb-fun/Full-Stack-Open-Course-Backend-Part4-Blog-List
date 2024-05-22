const { test, describe } = require("node:test");
const assert = require("node:assert");

const { average } = require("../utils/for_testing");

describe("average", () => {
  test("of one value is the value itself", () => {
    // we wrote the tests in quite a compact way, 
    // without assigning the output of the function being tested to a variable
    assert.strictEqual(average([1]), 1);
  });

  test("of many is calculated right", () => {
    assert.strictEqual(average([1, 2, 3, 4, 5, 6]), 3.5);
  });

  test("of empty array is zero", () => {
    assert.strictEqual(average([]), 0);
  });
});
