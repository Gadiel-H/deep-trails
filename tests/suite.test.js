/// @ts-check
const { run } = require("node:test");
const { spec } = require("node:test/reporters");

const files = ["./tests/package/suite.test.js", "./tests/cjs/suite.test.js"];

run({ files }).compose(new spec()).pipe(process.stdout);
