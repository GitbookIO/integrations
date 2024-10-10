type PlainObjectValue =
    | number
    | string
    | boolean
    | PlainObject
    | undefined
    | null
    | PlainObjectValue[];
export type PlainObject = {
    [key: string]: PlainObjectValue;
};
