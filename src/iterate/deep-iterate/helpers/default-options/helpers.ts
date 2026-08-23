import type { Options } from "../../../../types/deep-iterate/index";
import { toSimpleString } from "../../../../utils/public/index.js";
import { optionsSchema } from "../../schemas/options-schema.js";

const optionsList = Reflect.ownKeys(optionsSchema).map(String).join("\n      ");
type OptionsSchema = typeof optionsSchema;
type OptionKey = keyof OptionsSchema;

export type AnyOptions = Options<object>;

export function validateExistence(key: PropertyKey): asserts key is OptionKey {
    if (!(key in optionsSchema)) {
        throw new TypeError(
            `Cannot assign to ${toSimpleString(key)} in deepIterate.options because is not defined in the schema\n` +
                `    The known options are:\n` +
                `      ${optionsList}\n`
        );
    }
}

export function setOption<K extends OptionKey>(
    obj: AnyOptions,
    key: K,
    value: unknown
): AnyOptions[K] {
    const safeValue = getSafeValue(key, value);
    obj[key] = safeValue;

    return safeValue;
}

export function getSafeValue<K extends keyof OptionsSchema>(key: K, value: unknown): AnyOptions[K] {
    const knownKey = key;
    const schemaProp = optionsSchema[knownKey];
    const description = schemaProp.__description;
    const converted = schemaProp.__convert(value);

    if (!schemaProp.__test(converted)) {
        const valString = toSimpleString(value);
        throw new TypeError(
            `Cannot assign ${valString} to deepIterate.options.${knownKey}\n` +
                `    It must ${description}.\n`
        );
    }

    return converted;
}
