const math = require("../math");

describe("doDivision(a,b)", () => {
  test("If division is correct", () => {
    expect(math.doDivision(4, 3).toFixed(2)).toEqual((4 / 3).toFixed(2));
  });

  test("division by zero", () => {
    expect(math.doDivision(4, 0)).toBe(Infinity);
  });

  test("division by strings", () => {
    expect(math.doDivision(4, "hello")).toBe(NaN);
  });
});

describe("stringifyDivision(a, b)", () => {
  test("If output is to be expected", () => {
    expect(math.stringifyDivision(4, 2)).toEqual("4 divided by 2 is 2");
  });
});
