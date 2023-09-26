import { ZodType, ZodTypeAny, z } from "zod";

export type JzodBaseObjectSchema = {
    optional?: boolean | undefined;
    nullable?: boolean | undefined;
    extra?: {
        [x: string]: any;
    } | undefined;
};
export type JzodArraySchema = {
    optional?: boolean | undefined;
    nullable?: boolean | undefined;
    extra?: {
        [x: string]: any;
    } | undefined;
    type: "array";
    definition?: JzodElementSchema;
};
export type JzodAttributeSchema = {
    optional?: boolean | undefined;
    nullable?: boolean | undefined;
    extra?: {
        [x: string]: any;
    } | undefined;
    type: "simpleType";
    coerce?: boolean | undefined;
    definition?: JzodEnumAttributeTypesSchema;
};
export type JzodAttributeDateValidationsSchema = {
    extra?: {
        [x: string]: any;
    } | undefined;
    type: "min" | "max";
    parameter?: any;
};
export type JzodAttributeDateWithValidationsSchema = {
    optional?: boolean | undefined;
    nullable?: boolean | undefined;
    extra?: {
        [x: string]: any;
    } | undefined;
    type: "simpleType";
    definition: "date";
    validations: JzodAttributeDateValidationsSchema[];
};
export type JzodAttributeNumberValidationsSchema = {
    extra?: {
        [x: string]: any;
    } | undefined;
    type: "gt" | "gte" | "lt" | "lte" | "int" | "positive" | "nonpositive" | "negative" | "nonnegative" | "multipleOf" | "finite" | "safe";
    parameter?: any;
};
export type JzodAttributeNumberWithValidationsSchema = {
    optional?: boolean | undefined;
    nullable?: boolean | undefined;
    extra?: {
        [x: string]: any;
    } | undefined;
    type: "simpleType";
    definition: "number";
    validations: JzodAttributeNumberValidationsSchema[];
};
export type JzodAttributeStringValidationsSchema = {
    extra?: {
        [x: string]: any;
    } | undefined;
    type: "max" | "min" | "length" | "email" | "url" | "emoji" | "uuid" | "cuid" | "cuid2" | "ulid" | "regex" | "includes" | "startsWith" | "endsWith" | "datetime" | "ip";
    parameter?: any;
};
export type JzodAttributeStringWithValidationsSchema = {
    optional?: boolean | undefined;
    nullable?: boolean | undefined;
    extra?: {
        [x: string]: any;
    } | undefined;
    type: "simpleType";
    definition: "string";
    validations: JzodAttributeStringValidationsSchema[];
};
export type JzodElementSchema = JzodArraySchema | JzodAttributeSchema | JzodAttributeDateWithValidationsSchema | JzodAttributeNumberWithValidationsSchema | JzodAttributeStringWithValidationsSchema | JzodEnumSchema | JzodFunctionSchema | JzodLazySchema | JzodLiteralSchema | JzodIntersectionSchema | JzodMapSchema | JzodObjectSchema | JzodPromiseSchema | JzodRecordSchema | JzodReferenceSchema | JzodSetSchema | JzodTupleSchema | JzodUnionSchema;
export type JzodEnumSchema = {
    optional?: boolean | undefined;
    nullable?: boolean | undefined;
    extra?: {
        [x: string]: any;
    } | undefined;
    type: "enum";
    definition: string[];
};
export type JzodEnumAttributeTypesSchema = "any" | "bigint" | "boolean" | "date" | "never" | "null" | "number" | "string" | "uuid" | "undefined" | "unknown" | "void";
export type JzodEnumElementTypesSchema = "array" | "enum" | "function" | "lazy" | "literal" | "intersection" | "map" | "object" | "promise" | "record" | "schemaReference" | "set" | "simpleType" | "tuple" | "union";
export type JzodFunctionSchema = {
    optional?: boolean | undefined;
    nullable?: boolean | undefined;
    extra?: {
        [x: string]: any;
    } | undefined;
    type: "function";
    definition: {
        args: JzodElementSchema[];
        returns?: JzodElementSchema;
    };
};
export type JzodLazySchema = {
    optional?: boolean | undefined;
    nullable?: boolean | undefined;
    extra?: {
        [x: string]: any;
    } | undefined;
    type: "lazy";
    definition?: JzodFunctionSchema;
};
export type JzodLiteralSchema = {
    optional?: boolean | undefined;
    nullable?: boolean | undefined;
    extra?: {
        [x: string]: any;
    } | undefined;
    type: "literal";
    definition: string;
};
export type JzodIntersectionSchema = {
    optional?: boolean | undefined;
    nullable?: boolean | undefined;
    extra?: {
        [x: string]: any;
    } | undefined;
    type: "intersection";
    definition: {
        left?: JzodElementSchema;
        right?: JzodElementSchema;
    };
};
export type JzodMapSchema = {
    optional?: boolean | undefined;
    nullable?: boolean | undefined;
    extra?: {
        [x: string]: any;
    } | undefined;
    type: "map";
    definition: [
        JzodElementSchema,
        JzodElementSchema
    ];
};
export type JzodObjectSchema = {
    optional?: boolean | undefined;
    nullable?: boolean | undefined;
    extra?: {
        [x: string]: any;
    } | undefined;
    extend?: (JzodReferenceSchema | JzodObjectSchema) | undefined;
    type: "object";
    nonStrict?: boolean | undefined;
    definition: {
        [x: string]: JzodElementSchema;
    };
};
export type JzodPromiseSchema = {
    optional?: boolean | undefined;
    nullable?: boolean | undefined;
    extra?: {
        [x: string]: any;
    } | undefined;
    type: "promise";
    definition?: JzodElementSchema;
};
export type JzodRecordSchema = {
    optional?: boolean | undefined;
    nullable?: boolean | undefined;
    extra?: {
        [x: string]: any;
    } | undefined;
    type: "record";
    definition?: JzodElementSchema;
};
export type JzodReferenceSchema = {
    optional?: boolean | undefined;
    nullable?: boolean | undefined;
    extra?: {
        [x: string]: any;
    } | undefined;
    type: "schemaReference";
    context?: {
        [x: string]: JzodElementSchema;
    } | undefined;
    definition: {
        eager?: boolean | undefined;
        relativePath?: string | undefined;
        absolutePath?: string | undefined;
    };
};
export type JzodSetSchema = {
    optional?: boolean | undefined;
    nullable?: boolean | undefined;
    extra?: {
        [x: string]: any;
    } | undefined;
    type: "set";
    definition?: JzodElementSchema;
};
export type JzodTupleSchema = {
    optional?: boolean | undefined;
    nullable?: boolean | undefined;
    extra?: {
        [x: string]: any;
    } | undefined;
    type: "tuple";
    definition: JzodElementSchema[];
};
export type JzodUnionSchema = {
    optional?: boolean | undefined;
    nullable?: boolean | undefined;
    extra?: {
        [x: string]: any;
    } | undefined;
    type: "union";
    discriminator?: string | undefined;
    definition: JzodElementSchema[];
};
export type A = JzodArray[];
export type TestJzodSchema4 = A;

export const jzodBaseObjectSchema:z.ZodType<JzodBaseObjectSchema> = z.object({optional:z.boolean().optional(),nullable:z.boolean().optional(),extra:z.record(z.string(),z.any()).optional(),}).strict();
export const jzodArraySchema:z.ZodType<JzodArraySchema> = z.object({optional:z.boolean().optional(),nullable:z.boolean().optional(),extra:z.record(z.string(),z.any()).optional(),}).strict().extend({type:z.literal("array"),definition:z.lazy(() =>jzodElementSchema),}).strict();
export const jzodAttributeSchema:z.ZodType<JzodAttributeSchema> = z.object({optional:z.boolean().optional(),nullable:z.boolean().optional(),extra:z.record(z.string(),z.any()).optional(),}).strict().extend({type:z.literal("simpleType"),coerce:z.boolean().optional(),definition:z.lazy(() =>jzodEnumAttributeTypesSchema),}).strict();
export const jzodAttributeDateValidationsSchema:z.ZodType<JzodAttributeDateValidationsSchema> = z.object({extra:z.record(z.string(),z.any()).optional(),type:z.enum(["min","max"] as any),parameter:z.any(),}).strict();
export const jzodAttributeDateWithValidationsSchema:z.ZodType<JzodAttributeDateWithValidationsSchema> = z.object({optional:z.boolean().optional(),nullable:z.boolean().optional(),extra:z.record(z.string(),z.any()).optional(),}).strict().extend({type:z.literal("simpleType"),definition:z.literal("date"),validations:z.array(z.lazy(() =>jzodAttributeDateValidationsSchema)),}).strict();
export const jzodAttributeNumberValidationsSchema:z.ZodType<JzodAttributeNumberValidationsSchema> = z.object({extra:z.record(z.string(),z.any()).optional(),type:z.enum(["gt","gte","lt","lte","int","positive","nonpositive","negative","nonnegative","multipleOf","finite","safe"] as any),parameter:z.any(),}).strict();
export const jzodAttributeNumberWithValidationsSchema:z.ZodType<JzodAttributeNumberWithValidationsSchema> = z.object({optional:z.boolean().optional(),nullable:z.boolean().optional(),extra:z.record(z.string(),z.any()).optional(),}).strict().extend({type:z.literal("simpleType"),definition:z.literal("number"),validations:z.array(z.lazy(() =>jzodAttributeNumberValidationsSchema)),}).strict();
export const jzodAttributeStringValidationsSchema:z.ZodType<JzodAttributeStringValidationsSchema> = z.object({extra:z.record(z.string(),z.any()).optional(),type:z.enum(["max","min","length","email","url","emoji","uuid","cuid","cuid2","ulid","regex","includes","startsWith","endsWith","datetime","ip"] as any),parameter:z.any(),}).strict();
export const jzodAttributeStringWithValidationsSchema:z.ZodType<JzodAttributeStringWithValidationsSchema> = z.object({optional:z.boolean().optional(),nullable:z.boolean().optional(),extra:z.record(z.string(),z.any()).optional(),}).strict().extend({type:z.literal("simpleType"),definition:z.literal("string"),validations:z.array(z.lazy(() =>jzodAttributeStringValidationsSchema)),}).strict();
export const jzodElementSchema:z.ZodType<JzodElementSchema> = z.union([z.lazy(() =>jzodArraySchema),z.lazy(() =>jzodAttributeSchema),z.lazy(() =>jzodAttributeDateWithValidationsSchema),z.lazy(() =>jzodAttributeNumberWithValidationsSchema),z.lazy(() =>jzodAttributeStringWithValidationsSchema),z.lazy(() =>jzodEnumSchema),z.lazy(() =>jzodFunctionSchema),z.lazy(() =>jzodLazySchema),z.lazy(() =>jzodLiteralSchema),z.lazy(() =>jzodIntersectionSchema),z.lazy(() =>jzodMapSchema),z.lazy(() =>jzodObjectSchema),z.lazy(() =>jzodPromiseSchema),z.lazy(() =>jzodRecordSchema),z.lazy(() =>jzodReferenceSchema),z.lazy(() =>jzodSetSchema),z.lazy(() =>jzodTupleSchema),z.lazy(() =>jzodUnionSchema),]);
export const jzodEnumSchema:z.ZodType<JzodEnumSchema> = z.object({optional:z.boolean().optional(),nullable:z.boolean().optional(),extra:z.record(z.string(),z.any()).optional(),}).strict().extend({type:z.literal("enum"),definition:z.array(z.string()),}).strict();
export const jzodEnumAttributeTypesSchema:z.ZodType<JzodEnumAttributeTypesSchema> = z.enum(["any","bigint","boolean","date","never","null","number","string","uuid","undefined","unknown","void"] as any);
export const jzodEnumElementTypesSchema:z.ZodType<JzodEnumElementTypesSchema> = z.enum(["array","enum","function","lazy","literal","intersection","map","object","promise","record","schemaReference","set","simpleType","tuple","union"] as any);
export const jzodFunctionSchema:z.ZodType<JzodFunctionSchema> = z.object({optional:z.boolean().optional(),nullable:z.boolean().optional(),extra:z.record(z.string(),z.any()).optional(),}).strict().extend({type:z.literal("function"),definition:z.object({args:z.array(z.lazy(() =>jzodElementSchema)),returns:z.lazy(() =>jzodElementSchema).optional(),}).strict(),}).strict();
export const jzodLazySchema:z.ZodType<JzodLazySchema> = z.object({optional:z.boolean().optional(),nullable:z.boolean().optional(),extra:z.record(z.string(),z.any()).optional(),}).strict().extend({type:z.literal("lazy"),definition:z.lazy(() =>jzodFunctionSchema),}).strict();
export const jzodLiteralSchema:z.ZodType<JzodLiteralSchema> = z.object({optional:z.boolean().optional(),nullable:z.boolean().optional(),extra:z.record(z.string(),z.any()).optional(),}).strict().extend({type:z.literal("literal"),definition:z.string(),}).strict();
export const jzodIntersectionSchema:z.ZodType<JzodIntersectionSchema> = z.object({optional:z.boolean().optional(),nullable:z.boolean().optional(),extra:z.record(z.string(),z.any()).optional(),}).strict().extend({type:z.literal("intersection"),definition:z.object({left:z.lazy(() =>jzodElementSchema),right:z.lazy(() =>jzodElementSchema),}).strict(),}).strict();
export const jzodMapSchema:z.ZodType<JzodMapSchema> = z.object({optional:z.boolean().optional(),nullable:z.boolean().optional(),extra:z.record(z.string(),z.any()).optional(),}).strict().extend({type:z.literal("map"),definition:z.tuple(["z.lazy(() =>jzodElementSchema)","z.lazy(() =>jzodElementSchema)"] as any),}).strict();
export const jzodObjectSchema:z.ZodType<JzodObjectSchema> = z.object({optional:z.boolean().optional(),nullable:z.boolean().optional(),extra:z.record(z.string(),z.any()).optional(),}).strict().extend({extend:z.union([z.lazy(() =>jzodReferenceSchema),z.lazy(() =>jzodObjectSchema),]).optional(),type:z.literal("object"),nonStrict:z.boolean().optional(),definition:z.record(z.string(),z.lazy(() =>jzodElementSchema)),}).strict();
export const jzodPromiseSchema:z.ZodType<JzodPromiseSchema> = z.object({optional:z.boolean().optional(),nullable:z.boolean().optional(),extra:z.record(z.string(),z.any()).optional(),}).strict().extend({type:z.literal("promise"),definition:z.lazy(() =>jzodElementSchema),}).strict();
export const jzodRecordSchema:z.ZodType<JzodRecordSchema> = z.object({optional:z.boolean().optional(),nullable:z.boolean().optional(),extra:z.record(z.string(),z.any()).optional(),}).strict().extend({type:z.literal("record"),definition:z.lazy(() =>jzodElementSchema),}).strict();
export const jzodReferenceSchema:z.ZodType<JzodReferenceSchema> = z.object({optional:z.boolean().optional(),nullable:z.boolean().optional(),extra:z.record(z.string(),z.any()).optional(),}).strict().extend({type:z.literal("schemaReference"),context:z.record(z.string(),z.lazy(() =>jzodElementSchema)).optional(),definition:z.object({eager:z.boolean().optional(),relativePath:z.string().optional(),absolutePath:z.string().optional(),}).strict(),}).strict();
export const jzodSetSchema:z.ZodType<JzodSetSchema> = z.object({optional:z.boolean().optional(),nullable:z.boolean().optional(),extra:z.record(z.string(),z.any()).optional(),}).strict().extend({type:z.literal("set"),definition:z.lazy(() =>jzodElementSchema),}).strict();
export const jzodTupleSchema:z.ZodType<JzodTupleSchema> = z.object({optional:z.boolean().optional(),nullable:z.boolean().optional(),extra:z.record(z.string(),z.any()).optional(),}).strict().extend({type:z.literal("tuple"),definition:z.array(z.lazy(() =>jzodElementSchema)),}).strict();
export const jzodUnionSchema:z.ZodType<JzodUnionSchema> = z.object({optional:z.boolean().optional(),nullable:z.boolean().optional(),extra:z.record(z.string(),z.any()).optional(),}).strict().extend({type:z.literal("union"),discriminator:z.string().optional(),definition:z.array(z.lazy(() =>jzodElementSchema)),}).strict();
export const a:z.ZodType<A> = z.array(z.lazy(() =>jzodArray));
export const testJzodSchema4: z.ZodType<TestJzodSchema4> = z.lazy(() =>a);
