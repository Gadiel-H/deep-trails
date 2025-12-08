import type { Validator, PartialValidator } from "../types/index";

/** @internal */
export const typeUnion = <T = unknown>(typesList: PartialValidator<T>[]): Validator<T> => {
    const __convert = <V>(value: V) => {
        for (const prop of typesList) {
            const converted = prop.__convert ? prop.__convert(value) : value;

            if (prop.__test(converted)) return converted;
        }

        return value;
    };

    const __type: string = typesList.map((prop) => prop.__type).join(" | ");

    const __test = (value: unknown): value is T => typesList.some((prop) => prop.__test(value));

    return {
        __test,
        __type,
        __convert,
        __description: `be of type "${__type}"`
    };
};
