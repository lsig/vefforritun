doDivision = (a, b) => {
  return a / b;
};

stringifyDivision = (a, b) => {
  const ans = doDivision(a, b);
  return `${a} divided by ${b} is ${ans}`;
};

module.exports = {
  doDivision,
  stringifyDivision,
};
