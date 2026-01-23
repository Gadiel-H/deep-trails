import type { Validator, PartialValidator } from "../types/index";

/**
 * Returns a validator that joins a list of validators.
 *
 * @remarks
 * - If any of the validators matches, the value is considered valid.
 * - The conversion method attempts to convert the value until it is valid or there are no more converters.
 *
 * @internal
 */
export const typeUnion = <T = unknown>(validators: PartialValidator<T>[]): Validator<T> => {
    const __convert = <V>(value: V) => {
        for (const validator of validators) {
            const converted = validator.__convert ? validator.__convert(value) : value;

            if (validator.__test(converted)) return converted;
        }

        return value;
    };

    const __type: string = validators.map((prop) => prop.__type).join(" | ");
    const __description: string = `be of type "${__type}"`;
    const __test = (value: unknown): value is T => {
        return validators.some((prop) => prop.__test(value));
    };

    return { __test, __type, __convert, __description };
};
