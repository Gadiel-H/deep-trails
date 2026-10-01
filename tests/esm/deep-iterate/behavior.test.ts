import test from "node:test";
import assert from "node:assert";

import { deepIterate } from "deep-trails";

await test("onGetter catches, executes, and delegates property getters", () => {
    const getterError = new Error("getter failed");
    const source = Object.defineProperty({}, "value", {
        get() {
            throw getterError;
        }
    });

    let caughtValue: unknown;
    let caughtCause: unknown;
    deepIterate(source, (child) => {
        caughtValue = child.value;
        if (child.getterError) caughtCause = child.getterError.cause;
    });
    assert.strictEqual(caughtValue, undefined);
    assert.strictEqual(caughtCause, getterError);

    assert.throws(
        () => deepIterate(source, () => {}, { onGetter: "execute" }),
        (error) => error === getterError
    );

    let delegatedValue: unknown;
    let handlerCalls = 0;
    deepIterate(
        source,
        (child) => {
            delegatedValue = child.value;
            assert.strictEqual(child.getterError, null);
        },
        {
            onGetter(node, descriptor) {
                handlerCalls++;
                assert.strictEqual(node.parentValue, source);
                assert.strictEqual(typeof descriptor.get, "function");
                return { value: "handled" };
            }
        }
    );
    assert.strictEqual(handlerCalls, 1);
    assert.strictEqual(delegatedValue, "handled");
});

await test("onGetter can report an error returned by its handler", () => {
    const getterError = new Error("reported getter error");
    const source = Object.defineProperty({}, "value", {
        get() {
            return "not read";
        }
    });

    let value: unknown;
    let cause: unknown;
    deepIterate(
        source,
        (child) => {
            value = child.value;
            if (child.getterError) cause = child.getterError.cause;
        },
        { onGetter: () => ({ error: getterError }) }
    );

    assert.strictEqual(value, undefined);
    assert.strictEqual(cause, getterError);
});

await test("onCircular supports skip, throw, and bounded callback decisions", () => {
    const circular: { self?: unknown } = {};
    circular.self = circular;

    let defaultVisits = 0;
    deepIterate(circular, () => {
        defaultVisits++;
    });
    assert.strictEqual(defaultVisits, 1);

    assert.throws(
        () => deepIterate(circular, () => {}, { onCircular: "throw-error" }),
        (error) => error instanceof ReferenceError && error.message.includes("self")
    );

    const circularVisits: number[] = [];
    let callbackVisits = 0;
    deepIterate(
        circular,
        () => {
            callbackVisits++;
        },
        {
            onCircular(context) {
                circularVisits.push(context.visits);
                return circularVisits.length === 1 ? "iterate" : "skip";
            }
        }
    );
    assert.deepStrictEqual(circularVisits, [1, 2]);
    assert.strictEqual(callbackVisits, 2);
});

await test("control flags skip a subtree and finish the traversal", () => {
    const visited: unknown[] = [];
    deepIterate(
        { branch: { nested: true }, stop: true, never: true },
        (child, _parent, control) => {
            visited.push(child.key);
            if (child.key === "branch") control.skipNode = true;
            if (child.key === "stop") control.finishNow = true;
        }
    );

    assert.deepStrictEqual(visited, ["branch", "stop"]);
});

await test("setValue mutates object and Map entries and reports failure statuses", () => {
    const object = { value: 1 };
    let objectResult: unknown;
    deepIterate(object, (child, _parent, control) => {
        if (child.key === "value") objectResult = control.setValue(2);
    });
    assert.strictEqual(object.value, 2);
    assert.deepStrictEqual(objectResult, { ok: true });

    const map = new Map([["value", 1]]);
    let mapResult: unknown;
    deepIterate(map, (child, _parent, control) => {
        if (child.key === "value") mapResult = control.setValue(3);
    });
    assert.strictEqual(map.get("value"), 3);
    assert.deepStrictEqual(mapResult, { ok: true });

    const unchanged = { value: 1 };
    const failures: unknown[] = [];
    deepIterate(unchanged, (child, _parent, control) => {
        if (child.key !== "value") return;
        failures.push((control.setValue as () => unknown)());
        failures.push(control.setValue(1));
    });
    assert.deepStrictEqual(failures, [
        { ok: false, errorCode: "MISSING_VALUE" },
        { ok: false, errorCode: "SAME_VALUE" }
    ]);

    const readonly = {};
    Object.defineProperty(readonly, "value", { value: 1 });
    let readonlyResult: unknown;
    deepIterate(readonly, (child, _parent, control) => {
        if (child.key === "value") readonlyResult = control.setValue(2);
    });
    assert.deepStrictEqual(readonlyResult, { ok: false, errorCode: "READONLY_PROPERTY" });

    let setResult: unknown;
    deepIterate(new Set([1]), (_child, _parent, control) => {
        setResult = control.setValue(2);
    });
    assert.deepStrictEqual(setResult, { ok: false, errorCode: "CANNOT_CHANGE_SET" });
});

await test("callback failures retain the original error as cause", () => {
    const callbackError = new Error("callback failed");

    assert.throws(
        () =>
            deepIterate({ value: 1 }, () => {
                throw callbackError;
            }),
        (error) => error instanceof Error && error.cause === callbackError
    );
});
