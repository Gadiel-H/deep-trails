import test from "node:test";
import assert from "node:assert";

import { toSimpleString } from "deep-trails/utils";
import { randomValues } from "../__resources/index.ts";

test("toSimpleString does not throw any errors", () => {
    assert.doesNotThrow(() => randomValues.forEach(toSimpleString), Error);
});
