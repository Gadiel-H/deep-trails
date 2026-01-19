# Contributing

Thank you for your interest in improving **deep-trails**.  
This document provides a short and practical guide to contributing, from setup to submitting changes.

---

## Requirements

- Node.js 18 or newer
- npm (comes with Node.js)

## Steps

1. **Fork the repository**

    Go to the repository and fork it to your GitHub account.

2. **Clone the repository**

    ```bash
    git clone https://github.com/gadiel-h/deep-trails
    cd deep-trails
    ```

3. **Create a branch for your changes**

    ```bash
    git checkout -b my-branch
    ```

4. **Install development dependencies**

    ```bash
    npm ci
    # if it fails:
    npm install
    ```

5. **Make your changes**
    - For example, fix bugs or add new features.
    - Follow the existing code style and configurations.

6. **Run tests**

    ```bash
    npm run test
    ```

7. **Format the code**

    ```bash
    npm run format
    ```

8. **Check TypeScript errors**

    ```bash
    npx tsc
    ```

    If you're unsure about a TypeScript error, open the PR and explain it.

9. **Commit with your changes**

    ```bash
    git add .
    git commit -m "Short description of the change"
    ```

10. **Push your branch**

    ```bash
    git push origin my-branch
    ```

11. **Open a Pull Request**
    - Go to your fork on GitHub.
    - Choose "Compare & pull request".
    - Briefly describe your changes.

---

## Project structure

```
deep-trails/
│
├── config/                # Development configuration
│
├── scripts/               # Development scripts
│
├── examples/              # Usage examples
│
├── tests/                 # Library tests
│
└── src/                   # Source code
    │
    ├── iterate/               # Module "deep-trails/iterate"
    │   │
    │   ├── iterator-factories/    # Functions for creating iterators
    │   │
    │   └── deep-iterate/          # Main deepIterate implementation
    │       │
    │       ├── main.ts                # Public entry function
    │       │
    │       ├── core.ts                # Internal recursive logic
    │       │
    │       └── schemas/               # Parameter validation schemas
    │
    ├── utils/                 # General utilities
    │   │
    │   └── public/                # User-facing utilities
    │
    ├── __schemas/             # Object validation and schema creation
    │   │
    │   └── validators/            # Required data validators
    │
    └── types/                 # Public and internal type declarations
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

- `build:iife`: IIFE bundle with sourcemap, for browsers.

- `build:types`: Type declarations.

- `build:docs`: Generates documentation via TypeDoc.

#### Formatting

- `format`: Formats code using Prettier.

- `format:check`: Verifies code style without modify files.

#### Other scripts

- `clean`: Removes `dist/` and `docs/`.

- `test`: Runs the test suite using Node's built-in test runner.

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

You can help improve it in the source code with TSDoc comments, and also in the MarkDown files.

You can read it at https://gadiel-h.github.io/deep-trails
