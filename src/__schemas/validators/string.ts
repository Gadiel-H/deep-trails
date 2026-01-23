import type { Validator } from "../types/index";

/**
 * Returns a validator for string matches, or simply for any string.
 *
 * @param matches - The optional matches.
 * @param exactMatch - If there are matches:
 * if truthy, the comparison is exact; otherwise, is case-insensitive and trims whitespace.
 *
 * @internal
 */
export const string = <T extends string = string>(
    matches: T[] = [],
    exactMatch: boolean = false
): Validator<T> => {
    let __type: string = "string";
    let __description: string = `be of type "string"`;
    let __test: Validator<T>["__test"];
    let __convert: Validator<T>["__convert"] = (str) => str;

    if (matches.length > 0) {
        const string = matches.map((str) => `"${str}"`).join(", ");
        const normalized = !exactMatch ? matches.map((str) => str.trim().toLowerCase()) : matches;
        const uniqueCases = new Set(normalized.values());

        __test = ((str) => uniqueCases.has(str)) as any;
        __type = matches.map((str) => `"${str}"`).join(" | ");
        __description = `match some of these ${uniqueCases.size} strings: ${string}`;

        if (!exactMatch) {
            __convert = ((str) =>
                typeof str === "string" ? str.trim().toLowerCase() : str) as any;
        }
    } else {
        __test = ((str) => typeof str === "string") as any;
    }

    return { __test, __description, __type, __convert };
};
