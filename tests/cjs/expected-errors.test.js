/// @ts-check
const test = require("node:test");
const assert = require("node:assert");

test("deepIterate throws type errors when it receives invalid arguments", () => {
    const { deepIterate } = require("deep-trails");

    assert.throws(
        /// @ts-ignore
        () => deepIterate("expects an object"),
        TypeError
    );

    assert.throws(
        /// @ts-ignore
        () => deepIterate({}, "() => {}"),
        TypeError
    );

    const invalidOptions = {
        maxParentVisits: NaN,
        visitLogType: "none"
    };

    assert.throws(
        /// @ts-ignore
        () => deepIterate({}, () => {}, invalidOptions),
        TypeError
    );
});
