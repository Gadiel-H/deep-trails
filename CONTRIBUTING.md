# Contributing

Thank you for your interest in improving **deep-trails**.  
This document provides a short and practical guide to contributing, from setup to submitting changes.

---

### Sections:

- [Steps](#steps)
- [Project structure](#project-structure)
- [NPM scripts](#npm-scripts)
- [Details](#details)
- [Documentation](#documentation)

---

## Steps

1. **Clone the repository**

    ```bash
    git clone https://github.com/gadiel-h/deep-trails
    cd deep-trails
    ```

2. **Create a branch for your changes**

    ```bash
    git checkout -b my-branch
    ```

3. **Install development dependencies**

    ```bash
    npm ci
    ```

4. **Make your changes**
    - For example, fix bugs or add new features.
    - Follow the existing code style and configurations.

5. **Run tests**

    ```bash
    npm run test
    ```

    The test suite relies on Node’s built-in "node:test" and "node:assert" modules.

6. **Format the code**

    ```bash
    npm run format
    ```

7. **Check TypeScript errors**

    ```bash
    npx tsc
    ```

    If there are minor errors, you can send it and they will be corrected later.

8. **Commit with your changes**

    ```bash
    git add ./
    git commit -m "Short description of the change"
    ```

9. **Push your branch**

    ```bash
    git push origin my-branch
    ```

10. **Open a Pull Request**
    - Go to your fork on GitHub.
    - Choose "Compare & pull request".
    - Briefly describe your changes.

---

## Project structure

```
deep-trails/
|
+—— config/                # Development configuration
|
+—— scripts/               # Development scripts
|
+—— examples/              # Usage examples
|
+—— src/                   # Source code
    |
    +—— iterate/               # Module "deep-trails/iterate"
    |   |
    |   +—— iterator-factories/    # Iterator creation utilities
    |   |
    |   +—— deep-iterate/          # Main deepIterate implementation
    |       |
    |       +—— main.ts                # Public entry function
    |       |
    |       +—— core.ts                # Internal recursive logic
    |       |
    |       +—— schemas/               # Parameter validation schemas
    |
    +—— utils/                 # General utilities
    |   |
    |   +—— public/                # User-facing utilities
    |
    +—— __schemas/             # Object validation and schema creation
    |
    +—— types/                 # Public and internal type declarations
```

Within each directory, you might also find:

- `helpers/` – Internal dependencies for that module.

- `types/` – Local type declarations.

- `index.ts` – Entry point re-exporting contents.

## NPM scripts

Development scripts available in **package.json**.

#### Building

- `build`: Full package build (ESM, CJS, IIFE, types).

- `build:esm`: ECMAScript modules.

- `build:cjs`: CommonJS modules.

- `build:iife`: IIFE bundle, for browsers.

- `build:types`: Type declarations.

- `build:docs`: Generates documentation via TypeDoc.

#### Formating

- `format`: Formats code using Prettier.

- `format:check`: Verifies code style without modify files.

#### Other scripts

- `clean`: Removes `dist/` and `docs/`.

- `test`: Run existing tests.

- `watch:{esm|cjs|iife|types|docs}`: Build in watch mode.

- `dev`: Starts a dev session with watchers and a server.

## Details

A few points that help keep the project stable and easy to maintain:

- The builds are intended for ES6+ environments.
- Avoid modifying configuration files unless previously discussed.
- No external runtime dependencies; development dependencies only.
- For questions, suggestions, or larger ideas, feel free to open an issue.
- For significant changes, please discuss them before starting a pull request.

## Documentation

The documentation is generated in the `gh-pages` branch.

Documentation updates are handled by maintainers during review, or automatically through CI if enabled.

You can read it at https://gadiel-h.github.io/deep-trails
