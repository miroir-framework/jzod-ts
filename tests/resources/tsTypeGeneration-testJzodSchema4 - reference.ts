import { ZodType, ZodTypeAny, z } from "zod";

export type jzodBaseObjectSchema = {
    optional?: boolean | undefined;
    nullable?: boolean | undefined;
    extra?: {
        [x: string]: any;
    } | undefined;
};
export type jzodArraySchema = {
    optional?: boolean | undefined;
    nullable?: boolean | undefined;
    extra?: {
        [x: string]: any;
    } | undefined;
    type: "array";
    definition?: jzodElementSchema;
};
export type jzodAttributeSchema = {
    optional?: boolean | undefined;
    nullable?: boolean | undefined;
    extra?: {
        [x: string]: any;
    } | undefined;
    type: "simpleType";
    definition?: jzodEnumAttributeTypesSchema;
};
export type jzodAttributeDateValidationsSchema = {
    extra?: {
        [x: string]: any;
    } | undefined;
    type: "min" | "max";
    parameter?: any;
};
export type jzodAttributeDateWithValidationsSchema = {
    optional?: boolean | undefined;
    nullable?: boolean | undefined;
    extra?: {
        [x: string]: any;
    } | undefined;
    type: "simpleType";
    definition: "date";
    validations: jzodAttributeDateValidationsSchema[];
};
export type jzodAttributeNumberValidationsSchema = {
    extra?: {
        [x: string]: any;
    } | undefined;
    type: "gt" | "gte" | "lt" | "lte" | "int" | "positive" | "nonpositive" | "negative" | "nonnegative" | "multipleOf" | "finite" | "safe";
    parameter?: any;
};
export type jzodAttributeNumberWithValidationsSchema = {
    optional?: boolean | undefined;
    nullable?: boolean | undefined;
    extra?: {
        [x: string]: any;
    } | undefined;
    type: "simpleType";
    definition: "number";
    validations: jzodAttributeNumberValidationsSchema[];
};
export type jzodAttributeStringValidationsSchema = {
    extra?: {
        [x: string]: any;
    } | undefined;
    type: "max" | "min" | "length" | "email" | "url" | "emoji" | "uuid" | "cuid" | "cuid2" | "ulid" | "regex" | "includes" | "startsWith" | "endsWith" | "datetime" | "ip";
    parameter?: any;
};
export type jzodAttributeStringWithValidationsSchema = {
    optional?: boolean | undefined;
    nullable?: boolean | undefined;
    extra?: {
        [x: string]: any;
    } | undefined;
    type: "simpleType";
    definition: "string";
    validations: jzodAttributeStringValidationsSchema[];
};
export type jzodElementSchema = jzodArraySchema | jzodAttributeSchema | jzodAttributeDateWithValidationsSchema | jzodAttributeNumberWithValidationsSchema | jzodAttributeStringWithValidationsSchema | jzodEnumSchema | jzodFunctionSchema | jzodLazySchema | jzodLiteralSchema | jzodIntersectionSchema | jzodMapSchema | jzodObjectSchema | jzodPromiseSchema | jzodRecordSchema | jzodReferenceSchema | jzodSetSchema | jzodTupleSchema | jzodUnionSchema;
export type jzodEnumSchema = {
    optional?: boolean | undefined;
    nullable?: boolean | undefined;
    extra?: {
        [x: string]: any;
    } | undefined;
    type: "enum";
    definition: string[];
};
export type jzodEnumAttributeTypesSchema = "any" | "bigint" | "boolean" | "date" | "never" | "null" | "number" | "string" | "uuid" | "undefined" | "unknown" | "void";
export type jzodEnumElementTypesSchema = "array" | "enum" | "function" | "lazy" | "literal" | "intersection" | "map" | "object" | "promise" | "record" | "schemaReference" | "set" | "simpleType" | "tuple" | "union";
export type jzodFunctionSchema = {
    optional?: boolean | undefined;
    nullable?: boolean | undefined;
    extra?: {
        [x: string]: any;
    } | undefined;
    type: "function";
    definition: {
        args: jzodElementSchema[];
        returns?: jzodElementSchema;
    };
};
export type jzodLazySchema = {
    optional?: boolean | undefined;
    nullable?: boolean | undefined;
    extra?: {
        [x: string]: any;
    } | undefined;
    type: "lazy";
    definition?: jzodFunctionSchema;
};
export type jzodLiteralSchema = {
    optional?: boolean | undefined;
    nullable?: boolean | undefined;
    extra?: {
        [x: string]: any;
    } | undefined;
    type: "literal";
    definition: string;
};
export type jzodIntersectionSchema = {
    optional?: boolean | undefined;
    nullable?: boolean | undefined;
    extra?: {
        [x: string]: any;
    } | undefined;
    type: "intersection";
    definition: {
        left?: jzodElementSchema;
        right?: jzodElementSchema;
    };
};
export type jzodMapSchema = {
    optional?: boolean | undefined;
    nullable?: boolean | undefined;
    extra?: {
        [x: string]: any;
    } | undefined;
    type: "map";
    definition: [
        jzodElementSchema,
        jzodElementSchema
    ];
};
export type jzodObjectSchema = {
    optional?: boolean | undefined;
    nullable?: boolean | undefined;
    extra?: {
        [x: string]: any;
    } | undefined;
    extend?: (jzodReferenceSchema | jzodObjectSchema) | undefined;
    type: "object";
    definition: {
        [x: string]: jzodElementSchema;
    };
};
export type jzodPromiseSchema = {
    optional?: boolean | undefined;
    nullable?: boolean | undefined;
    extra?: {
        [x: string]: any;
    } | undefined;
    type: "promise";
    definition?: jzodElementSchema;
};
export type jzodRecordSchema = {
    optional?: boolean | undefined;
    nullable?: boolean | undefined;
    extra?: {
        [x: string]: any;
    } | undefined;
    type: "record";
    definition?: jzodElementSchema;
};
export type jzodReferenceSchema = {
    optional?: boolean | undefined;
    nullable?: boolean | undefined;
    extra?: {
        [x: string]: any;
    } | undefined;
    type: "schemaReference";
    context?: {
        [x: string]: jzodElementSchema;
    } | undefined;
    definition: {
        eager?: boolean | undefined;
        relativePath?: string | undefined;
        absolutePath?: string | undefined;
    };
};
export type jzodSetSchema = {
    optional?: boolean | undefined;
    nullable?: boolean | undefined;
    extra?: {
        [x: string]: any;
    } | undefined;
    type: "set";
    definition?: jzodElementSchema;
};
export type jzodTupleSchema = {
    optional?: boolean | undefined;
    nullable?: boolean | undefined;
    extra?: {
        [x: string]: any;
    } | undefined;
    type: "tuple";
    definition: jzodElementSchema[];
};
export type jzodUnionSchema = {
    optional?: boolean | undefined;
    nullable?: boolean | undefined;
    extra?: {
        [x: string]: any;
    } | undefined;
    type: "union";
    discriminator?: string | undefined;
    definition: jzodElementSchema[];
};
export type a = jzodArraySchema[];
export type testJzodSchema4 = a;

export const jzodBaseObjectSchema=z.object({optional:z.boolean().optional(),nullable:z.boolean().optional(),extra:z.record(z.string(),z.any()).optional(),}).strict();
export const jzodArraySchema=z.object({optional:z.boolean().optional(),nullable:z.boolean().optional(),extra:z.record(z.string(),z.any()).optional(),}).strict().extend({type:z.literal("array"),definition:z.lazy(() =>jzodElementSchema),}).strict();
export const jzodAttributeSchema=z.object({optional:z.boolean().optional(),nullable:z.boolean().optional(),extra:z.record(z.string(),z.any()).optional(),}).strict().extend({type:z.literal("simpleType"),definition:z.lazy(() =>jzodEnumAttributeTypesSchema),}).strict();
export const jzodAttributeDateValidationsSchema=z.object({extra:z.record(z.string(),z.any()).optional(),type:z.enum(["min","max"] as any),parameter:z.any(),}).strict();
export const jzodAttributeDateWithValidationsSchema=z.object({optional:z.boolean().optional(),nullable:z.boolean().optional(),extra:z.record(z.string(),z.any()).optional(),}).strict().extend({type:z.literal("simpleType"),definition:z.literal("date"),validations:z.array(z.lazy(() =>jzodAttributeDateValidationsSchema)),}).strict();
export const jzodAttributeNumberValidationsSchema=z.object({extra:z.record(z.string(),z.any()).optional(),type:z.enum(["gt","gte","lt","lte","int","positive","nonpositive","negative","nonnegative","multipleOf","finite","safe"] as any),parameter:z.any(),}).strict();
export const jzodAttributeNumberWithValidationsSchema=z.object({optional:z.boolean().optional(),nullable:z.boolean().optional(),extra:z.record(z.string(),z.any()).optional(),}).strict().extend({type:z.literal("simpleType"),definition:z.literal("number"),validations:z.array(z.lazy(() =>jzodAttributeNumberValidationsSchema)),}).strict();
export const jzodAttributeStringValidationsSchema=z.object({extra:z.record(z.string(),z.any()).optional(),type:z.enum(["max","min","length","email","url","emoji","uuid","cuid","cuid2","ulid","regex","includes","startsWith","endsWith","datetime","ip"] as any),parameter:z.any(),}).strict();
export const jzodAttributeStringWithValidationsSchema=z.object({optional:z.boolean().optional(),nullable:z.boolean().optional(),extra:z.record(z.string(),z.any()).optional(),}).strict().extend({type:z.literal("simpleType"),definition:z.literal("string"),validations:z.array(z.lazy(() =>jzodAttributeStringValidationsSchema)),}).strict();
export const jzodElementSchema=z.union([z.lazy(() =>jzodArraySchema),z.lazy(() =>jzodAttributeSchema),z.lazy(() =>jzodAttributeDateWithValidationsSchema),z.lazy(() =>jzodAttributeNumberWithValidationsSchema),z.lazy(() =>jzodAttributeStringWithValidationsSchema),z.lazy(() =>jzodEnumSchema),z.lazy(() =>jzodFunctionSchema),z.lazy(() =>jzodLazySchema),z.lazy(() =>jzodLiteralSchema),z.lazy(() =>jzodIntersectionSchema),z.lazy(() =>jzodMapSchema),z.lazy(() =>jzodObjectSchema),z.lazy(() =>jzodPromiseSchema),z.lazy(() =>jzodRecordSchema),z.lazy(() =>jzodReferenceSchema),z.lazy(() =>jzodSetSchema),z.lazy(() =>jzodTupleSchema),z.lazy(() =>jzodUnionSchema),]);
export const jzodEnumSchema=z.object({optional:z.boolean().optional(),nullable:z.boolean().optional(),extra:z.record(z.string(),z.any()).optional(),}).strict().extend({type:z.literal("enum"),definition:z.array(z.string()),}).strict();
export const jzodEnumAttributeTypesSchema=z.enum(["any","bigint","boolean","date","never","null","number","string","uuid","undefined","unknown","void"] as any);
export const jzodEnumElementTypesSchema=z.enum(["array","enum","function","lazy","literal","intersection","map","object","promise","record","schemaReference","set","simpleType","tuple","union"] as any);
export const jzodFunctionSchema=z.object({optional:z.boolean().optional(),nullable:z.boolean().optional(),extra:z.record(z.string(),z.any()).optional(),}).strict().extend({type:z.literal("function"),definition:z.object({args:z.array(z.lazy(() =>jzodElementSchema)),returns:z.lazy(() =>jzodElementSchema).optional(),}).strict(),}).strict();
export const jzodLazySchema=z.object({optional:z.boolean().optional(),nullable:z.boolean().optional(),extra:z.record(z.string(),z.any()).optional(),}).strict().extend({type:z.literal("lazy"),definition:z.lazy(() =>jzodFunctionSchema),}).strict();
export const jzodLiteralSchema=z.object({optional:z.boolean().optional(),nullable:z.boolean().optional(),extra:z.record(z.string(),z.any()).optional(),}).strict().extend({type:z.literal("literal"),definition:z.string(),}).strict();
export const jzodIntersectionSchema=z.object({optional:z.boolean().optional(),nullable:z.boolean().optional(),extra:z.record(z.string(),z.any()).optional(),}).strict().extend({type:z.literal("intersection"),definition:z.object({left:z.lazy(() =>jzodElementSchema),right:z.lazy(() =>jzodElementSchema),}).strict(),}).strict();
export const jzodMapSchema=z.object({optional:z.boolean().optional(),nullable:z.boolean().optional(),extra:z.record(z.string(),z.any()).optional(),}).strict().extend({type:z.literal("map"),definition:z.tuple(["z.lazy(() =>jzodElementSchema)","z.lazy(() =>jzodElementSchema)"] as any),}).strict();
export const jzodObjectSchema=z.object({optional:z.boolean().optional(),nullable:z.boolean().optional(),extra:z.record(z.string(),z.any()).optional(),}).strict().extend({extend:z.union([z.lazy(() =>jzodReferenceSchema),z.lazy(() =>jzodObjectSchema),]).optional(),type:z.literal("object"),definition:z.record(z.string(),z.lazy(() =>jzodElementSchema)),}).strict();
export const jzodPromiseSchema=z.object({optional:z.boolean().optional(),nullable:z.boolean().optional(),extra:z.record(z.string(),z.any()).optional(),}).strict().extend({type:z.literal("promise"),definition:z.lazy(() =>jzodElementSchema),}).strict();
export const jzodRecordSchema=z.object({optional:z.boolean().optional(),nullable:z.boolean().optional(),extra:z.record(z.string(),z.any()).optional(),}).strict().extend({type:z.literal("record"),definition:z.lazy(() =>jzodElementSchema),}).strict();
export const jzodReferenceSchema=z.object({optional:z.boolean().optional(),nullable:z.boolean().optional(),extra:z.record(z.string(),z.any()).optional(),}).strict().extend({type:z.literal("schemaReference"),context:z.record(z.string(),z.lazy(() =>jzodElementSchema)).optional(),definition:z.object({eager:z.boolean().optional(),relativePath:z.string().optional(),absolutePath:z.string().optional(),}).strict(),}).strict();
export const jzodSetSchema=z.object({optional:z.boolean().optional(),nullable:z.boolean().optional(),extra:z.record(z.string(),z.any()).optional(),}).strict().extend({type:z.literal("set"),definition:z.lazy(() =>jzodElementSchema),}).strict();
export const jzodTupleSchema=z.object({optional:z.boolean().optional(),nullable:z.boolean().optional(),extra:z.record(z.string(),z.any()).optional(),}).strict().extend({type:z.literal("tuple"),definition:z.array(z.lazy(() =>jzodElementSchema)),}).strict();
export const jzodUnionSchema=z.object({optional:z.boolean().optional(),nullable:z.boolean().optional(),extra:z.record(z.string(),z.any()).optional(),}).strict().extend({type:z.literal("union"),discriminator:z.string().optional(),definition:z.array(z.lazy(() =>jzodElementSchema)),}).strict();
export const a=z.array(z.lazy(() =>jzodArraySchema));
export const testJzodSchema4 = z.lazy(() =>a);
