import test from "node:test";

test("deepIterate.options", async () => {
    await import("./property.test.ts");
    await import("./object.test.ts");
    await import("./proxy-rejections.test.ts");
});
