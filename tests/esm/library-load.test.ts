import test from "node:test";
import assert from "node:assert";

function readOwnProps<T extends object, K extends keyof T>(obj: T): void {
    const keys = Reflect.ownKeys(obj) as K[];

    for (const key of keys) obj[key];
}

test("The library loads without errors", () => {
    assert.doesNotThrow(async () => {
        readOwnProps(await import("deep-trails"));

        readOwnProps(await import("deep-trails/utils"));

        readOwnProps(await import("deep-trails/iterate"));
    }, Error);
});
