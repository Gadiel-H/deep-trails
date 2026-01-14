/// @ts-check
const fs = require("node:fs");
const test = require("node:test");
const assert = require("node:assert");

test("All specified entry points exists", () => {
    const { exports } = require("../../package.json");
    const exportsFields = ["types", "import", "require"];

    for (const entryPoint in exports) {
        /// @ts-ignore
        const pathsDict = exports[entryPoint];

        for (const field of exportsFields) {
            if (!(field in pathsDict)) continue;

            const path = pathsDict[field];
            const pathExists = fs.existsSync(path);

            assert.strictEqual(pathExists, true, `"${path}" does not exist`);
        }
    }
});
