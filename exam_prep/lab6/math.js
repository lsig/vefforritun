const doDivision = (a, b) => {
    return a / b;
}

const stringifyDivision = (a, b) => {
    return a + " divided by " + b + " is " + module.exports.doDivision(a, b);
}

module.exports = { doDivision, stringifyDivision }
