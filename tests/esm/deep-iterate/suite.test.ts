import test from "node:test";

await test("deepIterate()", async () => {
    await import("./args-validation.test.ts");
    await import("./returned-result.test.ts");
    await import("./behavior.test.ts");
});

await import("./default-options/suite.test.ts");
