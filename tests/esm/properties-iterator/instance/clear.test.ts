import test from "node:test";
import assert from "node:assert";

import { PropertiesIterator } from "deep-trails/iterate";

test(".clear()", () => {
    test("Releases references and leaves detached methods finished", () => {
        const iterator = PropertiesIterator({ value: 1 });
        const next = iterator.next;
        const peek = iterator.peek;
        const getSize = iterator.getSize;
        const reset = iterator.reset;

        assert.strictEqual(iterator.clear(), true);
        assert.strictEqual(iterator.object, null);
        assert.strictEqual(getSize(), undefined);
        assert.deepStrictEqual(next(), { done: true, value: null });
        assert.deepStrictEqual(peek(), { done: true, value: null });
        assert.strictEqual(reset(), false);
        assert.strictEqual(iterator.clear(), false);
    });
});
