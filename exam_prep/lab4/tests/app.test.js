describe("doPythagoras(a, b)", () => {
  it("should return correct result given two positive number", () => {
    const a = 3;
    const b = 4;
    chai.expect(doPythagoras(a, b)).to.equal(5);
  });

  it("should return negative number if one of the number is negative", () => {
    const a = 3;
    const b = -4;
    chai.expect(doPythagoras(a, b)).to.equal("Negative numbers");
  });

  it('should return "Negative numbers" in case at least one parameter is negative', () => {
    const a = -5;
    const b = 4;
    chai.expect(doPythagoras(a, b)).to.equal("Negative numbers");
  });
});
