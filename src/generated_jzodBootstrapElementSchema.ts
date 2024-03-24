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
export type JzodAttribute = {
    optional?: boolean | undefined;
    nullable?: boolean | undefined;
    extra?: {
        [x: string]: any;
    } | undefined;
    type: "simpleType";
    coerce?: boolean | undefined;
    definition: JzodEnumAttributeTypes;
};
export type JzodAttributeDateValidations = {
    extra?: {
        [x: string]: any;
    } | undefined;
    type: "min" | "max";
    parameter?: any;
};
export type JzodAttributeDateWithValidations = {
    optional?: boolean | undefined;
    nullable?: boolean | undefined;
    extra?: {
        [x: string]: any;
    } | undefined;
    type: "simpleType";
    definition: "date";
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
export type JzodAttributeNumberWithValidations = {
    optional?: boolean | undefined;
    nullable?: boolean | undefined;
    extra?: {
        [x: string]: any;
    } | undefined;
    type: "simpleType";
    definition: "number";
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
export type JzodAttributeStringWithValidations = {
    optional?: boolean | undefined;
    nullable?: boolean | undefined;
    extra?: {
        [x: string]: any;
    } | undefined;
    type: "simpleType";
    definition: "string";
    coerce?: boolean | undefined;
    validations: JzodAttributeStringValidations[];
};
export type JzodElement = JzodArray | JzodAttribute | JzodAttributeDateWithValidations | JzodAttributeNumberWithValidations | JzodAttributeStringWithValidations | JzodEnum | JzodFunction | JzodLazy | JzodLiteral | JzodIntersection | JzodMap | JzodObject | JzodPromise | JzodRecord | JzodReference | JzodSet | JzodTuple | JzodUnion;
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
export type JzodEnumElementTypes = "array" | "enum" | "function" | "lazy" | "literal" | "intersection" | "map" | "object" | "promise" | "record" | "schemaReference" | "set" | "simpleType" | "tuple" | "union";
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
    discriminator?: string | undefined;
    definition: JzodElement[];
};
export type JzodBootstrapElementSchema = JzodElement;

export const jzodBaseObject: z.ZodType<JzodBaseObject> = z.object({optional:z.boolean().optional(), nullable:z.boolean().optional(), extra:z.record(z.string(),z.any()).optional()}).strict();
export const jzodArray: z.ZodType<JzodArray> = z.object({optional:z.boolean().optional(), nullable:z.boolean().optional(), extra:z.record(z.string(),z.any()).optional()}).strict().extend({type:z.literal("array"), definition:z.lazy(() =>jzodElement)}).strict();
export const jzodAttribute: z.ZodType<JzodAttribute> = z.object({optional:z.boolean().optional(), nullable:z.boolean().optional(), extra:z.record(z.string(),z.any()).optional()}).strict().extend({type:z.literal("simpleType"), coerce:z.boolean().optional(), definition:z.lazy(() =>jzodEnumAttributeTypes)}).strict();
export const jzodAttributeDateValidations: z.ZodType<JzodAttributeDateValidations> = z.object({extra:z.record(z.string(),z.any()).optional(), type:z.enum(["min","max"]), parameter:z.any()}).strict();
export const jzodAttributeDateWithValidations: z.ZodType<JzodAttributeDateWithValidations> = z.object({optional:z.boolean().optional(), nullable:z.boolean().optional(), extra:z.record(z.string(),z.any()).optional()}).strict().extend({type:z.literal("simpleType"), definition:z.literal("date"), coerce:z.boolean().optional(), validations:z.array(z.lazy(() =>jzodAttributeDateValidations))}).strict();
export const jzodAttributeNumberValidations: z.ZodType<JzodAttributeNumberValidations> = z.object({extra:z.record(z.string(),z.any()).optional(), type:z.enum(["gt","gte","lt","lte","int","positive","nonpositive","negative","nonnegative","multipleOf","finite","safe"]), parameter:z.any()}).strict();
export const jzodAttributeNumberWithValidations: z.ZodType<JzodAttributeNumberWithValidations> = z.object({optional:z.boolean().optional(), nullable:z.boolean().optional(), extra:z.record(z.string(),z.any()).optional()}).strict().extend({type:z.literal("simpleType"), definition:z.literal("number"), coerce:z.boolean().optional(), validations:z.array(z.lazy(() =>jzodAttributeNumberValidations))}).strict();
export const jzodAttributeStringValidations: z.ZodType<JzodAttributeStringValidations> = z.object({extra:z.record(z.string(),z.any()).optional(), type:z.enum(["max","min","length","email","url","emoji","uuid","cuid","cuid2","ulid","regex","includes","startsWith","endsWith","datetime","ip"]), parameter:z.any()}).strict();
export const jzodAttributeStringWithValidations: z.ZodType<JzodAttributeStringWithValidations> = z.object({optional:z.boolean().optional(), nullable:z.boolean().optional(), extra:z.record(z.string(),z.any()).optional()}).strict().extend({type:z.literal("simpleType"), definition:z.literal("string"), coerce:z.boolean().optional(), validations:z.array(z.lazy(() =>jzodAttributeStringValidations))}).strict();
export const jzodElement: z.ZodType<JzodElement> = z.union([z.lazy(() =>jzodArray), z.lazy(() =>jzodAttribute), z.lazy(() =>jzodAttributeDateWithValidations), z.lazy(() =>jzodAttributeNumberWithValidations), z.lazy(() =>jzodAttributeStringWithValidations), z.lazy(() =>jzodEnum), z.lazy(() =>jzodFunction), z.lazy(() =>jzodLazy), z.lazy(() =>jzodLiteral), z.lazy(() =>jzodIntersection), z.lazy(() =>jzodMap), z.lazy(() =>jzodObject), z.lazy(() =>jzodPromise), z.lazy(() =>jzodRecord), z.lazy(() =>jzodReference), z.lazy(() =>jzodSet), z.lazy(() =>jzodTuple), z.lazy(() =>jzodUnion)]);
export const jzodEnum: z.ZodType<JzodEnum> = z.object({optional:z.boolean().optional(), nullable:z.boolean().optional(), extra:z.record(z.string(),z.any()).optional()}).strict().extend({type:z.literal("enum"), definition:z.array(z.string())}).strict();
export const jzodEnumAttributeTypes: z.ZodType<JzodEnumAttributeTypes> = z.enum(["any","bigint","boolean","date","never","null","number","string","uuid","undefined","unknown","void"]);
export const jzodEnumElementTypes: z.ZodType<JzodEnumElementTypes> = z.enum(["array","enum","function","lazy","literal","intersection","map","object","promise","record","schemaReference","set","simpleType","tuple","union"]);
export const jzodFunction: z.ZodType<JzodFunction> = z.object({optional:z.boolean().optional(), nullable:z.boolean().optional(), extra:z.record(z.string(),z.any()).optional()}).strict().extend({type:z.literal("function"), definition:z.object({args:z.array(z.lazy(() =>jzodElement)), returns:z.lazy(() =>jzodElement).optional()}).strict()}).strict();
export const jzodLazy: z.ZodType<JzodLazy> = z.object({optional:z.boolean().optional(), nullable:z.boolean().optional(), extra:z.record(z.string(),z.any()).optional()}).strict().extend({type:z.literal("lazy"), definition:z.lazy(() =>jzodFunction)}).strict();
export const jzodLiteral: z.ZodType<JzodLiteral> = z.object({optional:z.boolean().optional(), nullable:z.boolean().optional(), extra:z.record(z.string(),z.any()).optional()}).strict().extend({type:z.literal("literal"), definition:z.union([z.string(), z.number(), z.bigint(), z.boolean()])}).strict();
export const jzodIntersection: z.ZodType<JzodIntersection> = z.object({optional:z.boolean().optional(), nullable:z.boolean().optional(), extra:z.record(z.string(),z.any()).optional()}).strict().extend({type:z.literal("intersection"), definition:z.object({left:z.lazy(() =>jzodElement), right:z.lazy(() =>jzodElement)}).strict()}).strict();
export const jzodMap: z.ZodType<JzodMap> = z.object({optional:z.boolean().optional(), nullable:z.boolean().optional(), extra:z.record(z.string(),z.any()).optional()}).strict().extend({type:z.literal("map"), definition:z.tuple([z.lazy(() =>jzodElement), z.lazy(() =>jzodElement)])}).strict();
export const jzodObject: z.ZodType<JzodObject> = z.object({optional:z.boolean().optional(), nullable:z.boolean().optional(), extra:z.record(z.string(),z.any()).optional()}).strict().extend({extend:z.union([z.lazy(() =>jzodReference), z.lazy(() =>jzodObject)]).optional(), type:z.literal("object"), nonStrict:z.boolean().optional(), partial:z.boolean().optional(), definition:z.record(z.string(),z.lazy(() =>jzodElement))}).strict();
export const jzodPromise: z.ZodType<JzodPromise> = z.object({optional:z.boolean().optional(), nullable:z.boolean().optional(), extra:z.record(z.string(),z.any()).optional()}).strict().extend({type:z.literal("promise"), definition:z.lazy(() =>jzodElement)}).strict();
export const jzodRecord: z.ZodType<JzodRecord> = z.object({optional:z.boolean().optional(), nullable:z.boolean().optional(), extra:z.record(z.string(),z.any()).optional()}).strict().extend({type:z.literal("record"), definition:z.lazy(() =>jzodElement)}).strict();
export const jzodReference: z.ZodType<JzodReference> = z.object({optional:z.boolean().optional(), nullable:z.boolean().optional(), extra:z.record(z.string(),z.any()).optional()}).strict().extend({type:z.literal("schemaReference"), context:z.record(z.string(),z.lazy(() =>jzodElement)).optional(), definition:z.object({eager:z.boolean().optional(), partial:z.boolean().optional(), relativePath:z.string().optional(), absolutePath:z.string().optional()}).strict()}).strict();
export const jzodSet: z.ZodType<JzodSet> = z.object({optional:z.boolean().optional(), nullable:z.boolean().optional(), extra:z.record(z.string(),z.any()).optional()}).strict().extend({type:z.literal("set"), definition:z.lazy(() =>jzodElement)}).strict();
export const jzodTuple: z.ZodType<JzodTuple> = z.object({optional:z.boolean().optional(), nullable:z.boolean().optional(), extra:z.record(z.string(),z.any()).optional()}).strict().extend({type:z.literal("tuple"), definition:z.array(z.lazy(() =>jzodElement))}).strict();
export const jzodUnion: z.ZodType<JzodUnion> = z.object({optional:z.boolean().optional(), nullable:z.boolean().optional(), extra:z.record(z.string(),z.any()).optional()}).strict().extend({type:z.literal("union"), discriminator:z.string().optional(), definition:z.array(z.lazy(() =>jzodElement))}).strict();
export const jzodBootstrapElementSchema = z.lazy(() =>jzodElement);

