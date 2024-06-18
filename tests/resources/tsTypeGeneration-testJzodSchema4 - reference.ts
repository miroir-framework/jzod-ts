import { ZodType, ZodTypeAny, z } from "zod";

export type JzodBaseObject = {
    optional?: boolean | undefined;
    nullable?: boolean | undefined;
    extra?: {
        [x: string]: any;
    } | undefined;
};
export type JzodArray = {
    optional?: boolean | undefined;
    nullable?: boolean | undefined;
    extra?: {
        [x: string]: any;
    } | undefined;
    type: "array";
    definition: JzodElement;
};
export type JzodPlainAttribute = {
    optional?: boolean | undefined;
    nullable?: boolean | undefined;
    extra?: {
        [x: string]: any;
    } | undefined;
    type: JzodEnumAttributeTypes;
    coerce?: boolean | undefined;
};
export type JzodAttributeDateValidations = {
    extra?: {
        [x: string]: any;
    } | undefined;
    type: "min" | "max";
    parameter?: any;
};
export type JzodAttributePlainDateWithValidations = {
    optional?: boolean | undefined;
    nullable?: boolean | undefined;
    extra?: {
        [x: string]: any;
    } | undefined;
    type: "date";
    coerce?: boolean | undefined;
    validations: JzodAttributeDateValidations[];
};
export type JzodAttributeNumberValidations = {
    extra?: {
        [x: string]: any;
    } | undefined;
    type: "gt" | "gte" | "lt" | "lte" | "int" | "positive" | "nonpositive" | "negative" | "nonnegative" | "multipleOf" | "finite" | "safe";
    parameter?: any;
};
export type JzodAttributePlainNumberWithValidations = {
    optional?: boolean | undefined;
    nullable?: boolean | undefined;
    extra?: {
        [x: string]: any;
    } | undefined;
    type: "number";
    coerce?: boolean | undefined;
    validations: JzodAttributeNumberValidations[];
};
export type JzodAttributeStringValidations = {
    extra?: {
        [x: string]: any;
    } | undefined;
    type: "max" | "min" | "length" | "email" | "url" | "emoji" | "uuid" | "cuid" | "cuid2" | "ulid" | "regex" | "includes" | "startsWith" | "endsWith" | "datetime" | "ip";
    parameter?: any;
};
export type JzodAttributePlainStringWithValidations = {
    optional?: boolean | undefined;
    nullable?: boolean | undefined;
    extra?: {
        [x: string]: any;
    } | undefined;
    type: "string";
    coerce?: boolean | undefined;
    validations: JzodAttributeStringValidations[];
};
export type JzodElement = JzodArray | JzodPlainAttribute | JzodAttributePlainDateWithValidations | JzodAttributePlainNumberWithValidations | JzodAttributePlainStringWithValidations | JzodEnum | JzodFunction | JzodLazy | JzodLiteral | JzodIntersection | JzodMap | JzodObject | JzodPromise | JzodRecord | JzodReference | JzodSet | JzodTuple | JzodUnion;
export type JzodEnum = {
    optional?: boolean | undefined;
    nullable?: boolean | undefined;
    extra?: {
        [x: string]: any;
    } | undefined;
    type: "enum";
    definition: string[];
};
export type JzodEnumAttributeTypes = "any" | "bigint" | "boolean" | "date" | "never" | "null" | "number" | "string" | "uuid" | "undefined" | "unknown" | "void";
export type JzodEnumElementTypes = "array" | "date" | "enum" | "function" | "lazy" | "literal" | "intersection" | "map" | "number" | "object" | "promise" | "record" | "schemaReference" | "set" | "simpleType" | "string" | "tuple" | "union";
export type JzodFunction = {
    optional?: boolean | undefined;
    nullable?: boolean | undefined;
    extra?: {
        [x: string]: any;
    } | undefined;
    type: "function";
    definition: {
        args: JzodElement[];
        returns?: JzodElement | undefined;
    };
};
export type JzodLazy = {
    optional?: boolean | undefined;
    nullable?: boolean | undefined;
    extra?: {
        [x: string]: any;
    } | undefined;
    type: "lazy";
    definition: JzodFunction;
};
export type JzodLiteral = {
    optional?: boolean | undefined;
    nullable?: boolean | undefined;
    extra?: {
        [x: string]: any;
    } | undefined;
    type: "literal";
    definition: string | number | bigint | boolean;
};
export type JzodIntersection = {
    optional?: boolean | undefined;
    nullable?: boolean | undefined;
    extra?: {
        [x: string]: any;
    } | undefined;
    type: "intersection";
    definition: {
        left: JzodElement;
        right: JzodElement;
    };
};
export type JzodMap = {
    optional?: boolean | undefined;
    nullable?: boolean | undefined;
    extra?: {
        [x: string]: any;
    } | undefined;
    type: "map";
    definition: [
        JzodElement,
        JzodElement
    ];
};
export type JzodObject = {
    optional?: boolean | undefined;
    nullable?: boolean | undefined;
    extra?: {
        [x: string]: any;
    } | undefined;
    extend?: (JzodReference | JzodObject) | undefined;
    type: "object";
    nonStrict?: boolean | undefined;
    partial?: boolean | undefined;
    definition: {
        [x: string]: JzodElement;
    };
};
export type JzodPromise = {
    optional?: boolean | undefined;
    nullable?: boolean | undefined;
    extra?: {
        [x: string]: any;
    } | undefined;
    type: "promise";
    definition: JzodElement;
};
export type JzodRecord = {
    optional?: boolean | undefined;
    nullable?: boolean | undefined;
    extra?: {
        [x: string]: any;
    } | undefined;
    type: "record";
    definition: JzodElement;
};
export type JzodReference = {
    optional?: boolean | undefined;
    nullable?: boolean | undefined;
    extra?: {
        [x: string]: any;
    } | undefined;
    type: "schemaReference";
    context?: {
        [x: string]: JzodElement;
    } | undefined;
    definition: {
        eager?: boolean | undefined;
        partial?: boolean | undefined;
        relativePath?: string | undefined;
        absolutePath?: string | undefined;
    };
};
export type JzodSet = {
    optional?: boolean | undefined;
    nullable?: boolean | undefined;
    extra?: {
        [x: string]: any;
    } | undefined;
    type: "set";
    definition: JzodElement;
};
export type JzodTuple = {
    optional?: boolean | undefined;
    nullable?: boolean | undefined;
    extra?: {
        [x: string]: any;
    } | undefined;
    type: "tuple";
    definition: JzodElement[];
};
export type JzodUnion = {
    optional?: boolean | undefined;
    nullable?: boolean | undefined;
    extra?: {
        [x: string]: any;
    } | undefined;
    type: "union";
    discriminator?: ({
        discriminatorType: "string";
        value: string;
    } | {
        discriminatorType: "array";
        value: string[];
    }) | undefined;
    definition: JzodElement[];
};
export type A = JzodArray[];
export type TestJzodSchema4 = A;

export const jzodBaseObject = z.object({optional:z.boolean().optional(), nullable:z.boolean().optional(), extra:z.record(z.string(),z.any()).optional()}).strict();
export const jzodArray = z.object({optional:z.boolean().optional(), nullable:z.boolean().optional(), extra:z.record(z.string(),z.any()).optional()}).strict().extend({type:z.literal("array"), definition:z.lazy(() =>jzodElement)}).strict();
export const jzodPlainAttribute = z.object({optional:z.boolean().optional(), nullable:z.boolean().optional(), extra:z.record(z.string(),z.any()).optional()}).strict().extend({type:z.lazy(() =>jzodEnumAttributeTypes), coerce:z.boolean().optional()}).strict();
export const jzodAttributeDateValidations = z.object({extra:z.record(z.string(),z.any()).optional(), type:z.enum(["min","max"]), parameter:z.any()}).strict();
export const jzodAttributePlainDateWithValidations = z.object({optional:z.boolean().optional(), nullable:z.boolean().optional(), extra:z.record(z.string(),z.any()).optional()}).strict().extend({type:z.literal("date"), coerce:z.boolean().optional(), validations:z.array(z.lazy(() =>jzodAttributeDateValidations))}).strict();
export const jzodAttributeNumberValidations = z.object({extra:z.record(z.string(),z.any()).optional(), type:z.enum(["gt","gte","lt","lte","int","positive","nonpositive","negative","nonnegative","multipleOf","finite","safe"]), parameter:z.any()}).strict();
export const jzodAttributePlainNumberWithValidations = z.object({optional:z.boolean().optional(), nullable:z.boolean().optional(), extra:z.record(z.string(),z.any()).optional()}).strict().extend({type:z.literal("number"), coerce:z.boolean().optional(), validations:z.array(z.lazy(() =>jzodAttributeNumberValidations))}).strict();
export const jzodAttributeStringValidations = z.object({extra:z.record(z.string(),z.any()).optional(), type:z.enum(["max","min","length","email","url","emoji","uuid","cuid","cuid2","ulid","regex","includes","startsWith","endsWith","datetime","ip"]), parameter:z.any()}).strict();
export const jzodAttributePlainStringWithValidations = z.object({optional:z.boolean().optional(), nullable:z.boolean().optional(), extra:z.record(z.string(),z.any()).optional()}).strict().extend({type:z.literal("string"), coerce:z.boolean().optional(), validations:z.array(z.lazy(() =>jzodAttributeStringValidations))}).strict();
export const jzodElement = z.union([z.lazy(() =>jzodArray), z.lazy(() =>jzodPlainAttribute), z.lazy(() =>jzodAttributePlainDateWithValidations), z.lazy(() =>jzodAttributePlainNumberWithValidations), z.lazy(() =>jzodAttributePlainStringWithValidations), z.lazy(() =>jzodEnum), z.lazy(() =>jzodFunction), z.lazy(() =>jzodLazy), z.lazy(() =>jzodLiteral), z.lazy(() =>jzodIntersection), z.lazy(() =>jzodMap), z.lazy(() =>jzodObject), z.lazy(() =>jzodPromise), z.lazy(() =>jzodRecord), z.lazy(() =>jzodReference), z.lazy(() =>jzodSet), z.lazy(() =>jzodTuple), z.lazy(() =>jzodUnion)]);
export const jzodEnum = z.object({optional:z.boolean().optional(), nullable:z.boolean().optional(), extra:z.record(z.string(),z.any()).optional()}).strict().extend({type:z.literal("enum"), definition:z.array(z.string())}).strict();
export const jzodEnumAttributeTypes = z.enum(["any","bigint","boolean","date","never","null","number","string","uuid","undefined","unknown","void"]);
export const jzodEnumElementTypes = z.enum(["array","date","enum","function","lazy","literal","intersection","map","number","object","promise","record","schemaReference","set","simpleType","string","tuple","union"]);
export const jzodFunction = z.object({optional:z.boolean().optional(), nullable:z.boolean().optional(), extra:z.record(z.string(),z.any()).optional()}).strict().extend({type:z.literal("function"), definition:z.object({args:z.array(z.lazy(() =>jzodElement)), returns:z.lazy(() =>jzodElement).optional()}).strict()}).strict();
export const jzodLazy = z.object({optional:z.boolean().optional(), nullable:z.boolean().optional(), extra:z.record(z.string(),z.any()).optional()}).strict().extend({type:z.literal("lazy"), definition:z.lazy(() =>jzodFunction)}).strict();
export const jzodLiteral = z.object({optional:z.boolean().optional(), nullable:z.boolean().optional(), extra:z.record(z.string(),z.any()).optional()}).strict().extend({type:z.literal("literal"), definition:z.union([z.string(), z.number(), z.bigint(), z.boolean()])}).strict();
export const jzodIntersection = z.object({optional:z.boolean().optional(), nullable:z.boolean().optional(), extra:z.record(z.string(),z.any()).optional()}).strict().extend({type:z.literal("intersection"), definition:z.object({left:z.lazy(() =>jzodElement), right:z.lazy(() =>jzodElement)}).strict()}).strict();
export const jzodMap = z.object({optional:z.boolean().optional(), nullable:z.boolean().optional(), extra:z.record(z.string(),z.any()).optional()}).strict().extend({type:z.literal("map"), definition:z.tuple([z.lazy(() =>jzodElement), z.lazy(() =>jzodElement)])}).strict();
export const jzodObject = z.object({optional:z.boolean().optional(), nullable:z.boolean().optional(), extra:z.record(z.string(),z.any()).optional()}).strict().extend({extend:z.union([z.lazy(() =>jzodReference), z.lazy(() =>jzodObject)]).optional(), type:z.literal("object"), nonStrict:z.boolean().optional(), partial:z.boolean().optional(), definition:z.record(z.string(),z.lazy(() =>jzodElement))}).strict();
export const jzodPromise = z.object({optional:z.boolean().optional(), nullable:z.boolean().optional(), extra:z.record(z.string(),z.any()).optional()}).strict().extend({type:z.literal("promise"), definition:z.lazy(() =>jzodElement)}).strict();
export const jzodRecord = z.object({optional:z.boolean().optional(), nullable:z.boolean().optional(), extra:z.record(z.string(),z.any()).optional()}).strict().extend({type:z.literal("record"), definition:z.lazy(() =>jzodElement)}).strict();
export const jzodReference = z.object({optional:z.boolean().optional(), nullable:z.boolean().optional(), extra:z.record(z.string(),z.any()).optional()}).strict().extend({type:z.literal("schemaReference"), context:z.record(z.string(),z.lazy(() =>jzodElement)).optional(), definition:z.object({eager:z.boolean().optional(), partial:z.boolean().optional(), relativePath:z.string().optional(), absolutePath:z.string().optional()}).strict()}).strict();
export const jzodSet = z.object({optional:z.boolean().optional(), nullable:z.boolean().optional(), extra:z.record(z.string(),z.any()).optional()}).strict().extend({type:z.literal("set"), definition:z.lazy(() =>jzodElement)}).strict();
export const jzodTuple = z.object({optional:z.boolean().optional(), nullable:z.boolean().optional(), extra:z.record(z.string(),z.any()).optional()}).strict().extend({type:z.literal("tuple"), definition:z.array(z.lazy(() =>jzodElement))}).strict();
export const jzodUnion = z.object({optional:z.boolean().optional(), nullable:z.boolean().optional(), extra:z.record(z.string(),z.any()).optional()}).strict().extend({type:z.literal("union"), discriminator:z.union([z.object({discriminatorType:z.literal("string"), value:z.string()}).strict(), z.object({discriminatorType:z.literal("array"), value:z.array(z.string())}).strict()]).optional(), definition:z.array(z.lazy(() =>jzodElement))}).strict();
export const a = z.array(z.lazy(() =>jzodArray));
export const testJzodSchema4 = z.lazy(() =>a);
