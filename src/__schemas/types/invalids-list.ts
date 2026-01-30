/**
 * An array where each item represents an invalid property in the validated object.
 * @internal
 */
export type InvalidsList = [path: string, expectedType: string, value: string][];
