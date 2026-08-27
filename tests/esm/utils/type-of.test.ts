import test from "node:test";
import assert from "node:assert";

import { randomValues } from "../__resources/index.ts";
import { typeOf } from "deep-trails/utils";

test("typeOf does not throw any errors", () => {
    assert.doesNotThrow(() => randomValues.forEach((value) => typeOf(value, value as any)), Error);
});
