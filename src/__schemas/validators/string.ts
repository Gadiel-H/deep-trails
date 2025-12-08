import type { Validator } from "../types/index";

/** @internal */
export const string = <T extends string = string>(
    matches: T[] = [],
    exactMatch: boolean = false
): Validator<T> => {
    const stringsList: Set<string> = new Set(
        !exactMatch ? matches.map((str) => str.trim().toLowerCase()) : matches
    );

    const __type: string =
        stringsList.size > 0 ? matches.map((str) => `"${str}"`).join(" | ") : "string";

    const __convert: Validator<T>["__convert"] = (
        stringsList.size <= 0 || exactMatch
            ? (str) => str
            : (str) => (typeof str === "string" ? str.trim().toLowerCase() : str)
    ) as <V>(val: V) => T | V;

    const __test: Validator<T>["__test"] = (
        stringsList.size > 0 ? (str) => stringsList.has(str) : (str) => typeof str === "string"
    ) as (val: any) => val is T;

    const __description: string =
        stringsList.size === 0
            ? `be of type "string"`
            : `match some of these ${matches.length} strings: ${matches
                  .map((str) => `"${str}"`)
                  .join(", ")}`;

    return { __test, __description, __type, __convert };
};
