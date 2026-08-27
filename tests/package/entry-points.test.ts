import fs from "node:fs";
import test from "node:test";
import assert from "node:assert";

const importOpts = { with: { type: "json" } };

type ExportsType = "types" | "import" | "require";
type ExportsDict = { [entryPoint: string]: PathsDict };
type PathsDict = { [key in ExportsType]?: string };

test("All specified entry points exists", async () => {
    const packageJSON = (await import("../../package.json", importOpts)).default;
    const exports: ExportsDict = packageJSON.exports;
    const exportsFields: (keyof PathsDict)[] = ["types", "import", "require"];

    for (const entryPoint in exports) {
        if (exports[entryPoint] == null) continue;

        const pathsDict: PathsDict = exports[entryPoint];

        for (const field of exportsFields) {
            if (pathsDict[field] == null) continue;

            const path: string = pathsDict[field];
            const pathExists = fs.existsSync(path);

            assert.strictEqual(pathExists, true, `"${path}" does not exist`);
        }
    }
});
