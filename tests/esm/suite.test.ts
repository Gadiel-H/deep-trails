console.log("\nAPI in ES modules");

await import("./library-load.test.ts");
await import("./utils/suite.test.ts");
await import("./deep-iterate/suite.test.ts");
await import("./properties-iterator/suite.test.ts");
