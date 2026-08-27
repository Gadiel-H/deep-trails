import { run } from "node:test";
import { spec } from "node:test/reporters";

const files = ["./tests/package/suite.test.ts", "./tests/cjs/suite.test.ts"];

run({ files }).compose(new spec()).pipe(process.stdout);
