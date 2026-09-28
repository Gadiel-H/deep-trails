import test from "node:test";
import assert from "node:assert";

import { PropertiesIterator } from "deep-trails/iterate";

test(".reset()", () => {
    test("Refreshes keys and restarts the shared iteration state", () => {
        const object: Record<string, number> = { first: 1 };
        const iterator = PropertiesIterator(object);

        assert.deepStrictEqual(iterator.next(), {
            done: false,
            value: ["first", 1, 0]
        });

        object["second"] = 2;
        assert.strictEqual(iterator.reset(), true);
        assert.deepStrictEqual(
            [...iterator],
            [
                ["first", 1, 0],
                ["second", 2, 1]
            ]
        );
    });
});
