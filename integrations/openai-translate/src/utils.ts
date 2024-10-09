import { PlainObject } from '@gitbook/api';

/**
 * Top optimize AI performances, we want to pass a minimal JSON structure to it.
 * To do so we we extract only the parts we care about from the JSON structure.
 */
export function deepExtract<T extends PlainObject>(
    input: T,
    extract: (input: PlainObject) => PlainObject,
): T {
    const keys = Object.keys(input as object);
    const output = extract(input);

    const mapValue = (value: any): any => {
        if (Array.isArray(value)) {
            return value.map((item) => {
                return mapValue(item);
            });
        }
        if (typeof value === 'object') {
            return deepExtract(value, extract);
        }
        return value;
    };

    for (const key of keys) {
        // @ts-ignore
        const value: any = input[key];

        if (Array.isArray(value)) {
            const result = mapValue(value);
            if (result.length > 0) {
                output[key] = result;
            }
        } else if (value && typeof value === 'object') {
            const result = mapValue(value);
            if (Object.keys(result).length > 0) {
                output[key] = result;
            }
        }
    }

    return output;
}

/**
 * Annotate the JSON structure with the annotations splitted from `deepExtract`.
 */
export function deepMerge<T extends PlainObject>(input: T, extracted: object): T {
    const keys = Object.keys(extracted);
    // @ts-ignore
    const result = { ...input };

    const mergeValues = (value: any, extractedValue: any): any => {
        if (Array.isArray(value)) {
            return value.map((item, index) => {
                return mergeValues(item, extractedValue[index]);
            });
        }
        if (typeof value === 'object') {
            return deepMerge(value, extractedValue);
        }
        return extractedValue;
    };

    for (const key of keys) {
        // @ts-ignore
        const extractedValue = extracted[key];
        result[key] = mergeValues(result[key], extractedValue);
    }

    return result;
}
