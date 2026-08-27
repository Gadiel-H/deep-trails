import test from "node:test";
import assert from "node:assert";

import { randomValues } from "../__resources/index.ts";
import * as utils from "deep-trails/utils";

type Utils = typeof utils;
type CheckerName = keyof Utils & `is${string}`;

const checkers = Object.fromEntries(
    Object.entries(utils).filter(
        ([key, value]) => key.startsWith("is") && typeof value === "function"
    )
) as Pick<Utils, CheckerName>;

test("The type checkers does not throw any errors", () => {
    for (const key in checkers) {
        const checker = checkers[key as CheckerName];

        assert.doesNotThrow(() => randomValues.forEach(checker), Error);
    }
});
