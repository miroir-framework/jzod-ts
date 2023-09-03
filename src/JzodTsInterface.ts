import { ZodType, z } from "zod";

const jzodRootSchema = z.object({
  optional: z.boolean().optional(),
}).strict();
type JzodRoot = z.infer<typeof jzodRootSchema>;

// ##############################################################################################################
export const jzodEnumAttributeTypesSchema = z.enum([
  "any",
  "bigint",
  "boolean",
  "date",
  "never",
  "null",
  "number",
  "string",
  "uuid",
  "undefined",
  "unknown",
  "void",
])

export type JzodEnumTypes = z.infer<typeof jzodEnumAttributeTypesSchema>;

// ##############################################################################################################
export const jzodEnumElementTypesSchema = z.enum([
  "array",
  "enum",
  "function",
  "lazy",
  "literal",
  "intersection",
  "map",
  "object",
  "promise",
  "record",
  "schemaReference",
  "set",
  "simpleType",
  "tuple",
  "union",
])

export type JzodEnumElementTypes = z.infer<typeof jzodEnumElementTypesSchema>;


// ##############################################################################################################
export interface JzodArray extends JzodRoot {
  optional?: boolean,
  nullable?: boolean,
  extra?: {[k:string]:any},
  type: 'array',
  definition: JzodElement
}

export const jzodArraySchema: z.ZodType<JzodArray> = z.object({ // issue with JsonSchema conversion when using extend from ZodRootSchema, although the 2 are functionnaly equivalent
  optional: z.boolean().optional(),
  nullable: z.boolean().optional(),
  extra: z.record(z.string(),z.any()).optional(),
  type: z.literal('array'),
  definition: z.lazy(()=>jzodElementSchema)
}).strict();

// ##############################################################################################################
export const jzodAttributeDateValidationsSchema = z
  .object({
    extra: z.record(z.string(), z.any()).optional(),
    type: z.enum([
      "min",
      "max",
    ]),
    parameter: z.any(),
  })
  .strict();

export type JzodAttributeDateValidations = z.infer<typeof jzodAttributeDateValidationsSchema>;

// ##############################################################################################################
export const jzodAttributeNumberValidationsSchema = z
  .object({
    extra: z.record(z.string(), z.any()).optional(),
    type: z.enum([
      "gt",
      "gte",
      "lt",
      "lte",
      "int",
      "positive",
      "nonpositive",
      "negative",
      "nonnegative",
      "multipleOf",
      "finite",
      "safe",
    ]),
    parameter: z.any(),
  })
  .strict();

export type JzodAttributeNumberValidations = z.infer<typeof jzodAttributeNumberValidationsSchema>;

// ##############################################################################################################
export const jzodAttributeStringValidationsSchema = z
  .object({
    extra: z.record(z.string(), z.any()).optional(),
    type: z.enum([
      "max",
      "min",
      "length",
      "email",
      "url",
      "emoji",
      "uuid",
      "cuid",
      "cuid2",
      "ulid",
      "regex",
      "includes",
      "startsWith",
      "endsWith",
      "datetime",
      "ip",
    ]),
    parameter: z.any(),
  })
  .strict();

export type JzodAttributeStringValidations = z.infer<typeof jzodAttributeStringValidationsSchema>;

// ##############################################################################################################
export const jzodAttributeDateWithValidationsSchema = z.object({
  optional: z.boolean().optional(),
  nullable: z.boolean().optional(),
  extra: z.record(z.string(),z.any()).optional(),
  coerce: z.boolean().optional(),
  type: z.literal(jzodEnumElementTypesSchema.enum.simpleType),
  definition: z.literal(jzodEnumAttributeTypesSchema.enum.date),
  validations: z.array(jzodAttributeDateValidationsSchema),
}).strict();

export type JzodAttributeDateWithValidations = z.infer<typeof jzodAttributeDateWithValidationsSchema>;

// ##############################################################################################################
export const jzodAttributeNumberWithValidationsSchema = z.object({
  optional: z.boolean().optional(),
  nullable: z.boolean().optional(),
  extra: z.record(z.string(),z.any()).optional(),
  coerce: z.boolean().optional(),
  type: z.literal(jzodEnumElementTypesSchema.enum.simpleType),
  definition: z.literal(jzodEnumAttributeTypesSchema.enum.number),
  validations: z.array(jzodAttributeNumberValidationsSchema),
}).strict();

export type JzodAttributeNumberWithValidations = z.infer<typeof jzodAttributeNumberWithValidationsSchema>;

// ##############################################################################################################
export const jzodAttributeStringWithValidationsSchema = z.object({
  optional: z.boolean().optional(),
  nullable: z.boolean().optional(),
  extra: z.record(z.string(),z.any()).optional(),
  coerce: z.boolean().optional(),
  type: z.literal(jzodEnumElementTypesSchema.enum.simpleType),
  definition: z.literal(jzodEnumAttributeTypesSchema.enum.string),
  validations: z.array(jzodAttributeStringValidationsSchema),
}).strict();

export type JzodAttributeStringWithValidations = z.infer<typeof jzodAttributeStringWithValidationsSchema>;

// ##############################################################################################################
export const jzodAttributeSchema = z.object({
  optional: z.boolean().optional(),
  nullable: z.boolean().optional(),
  extra: z.record(z.string(),z.any()).optional(),
  coerce: z.boolean().optional(),
  type: z.literal(jzodEnumElementTypesSchema.enum.simpleType),
  definition: z.lazy(()=>jzodEnumAttributeTypesSchema),
}).strict();

export type JzodAttribute = z.infer<typeof jzodAttributeSchema>;


// ##############################################################################################################
export type JzodElement =
| JzodArray
| JzodAttribute
| JzodAttributeDateWithValidations
| JzodAttributeNumberWithValidations
| JzodAttributeStringWithValidations
| JzodEnum
| JzodFunction
| JzodLazy
| JzodLiteral
| JzodIntersection
| JzodMap
| JzodRecord
| JzodObject
| JzodPromise
| JzodReference
| JzodSet
| JzodTuple
| JzodUnion
;

export const jzodElementSchema: z.ZodType<JzodElement> = z.union([
  z.lazy(()=>jzodArraySchema),
  z.lazy(()=>jzodAttributeSchema),
  z.lazy(()=>jzodAttributeDateWithValidationsSchema),
  z.lazy(()=>jzodAttributeNumberWithValidationsSchema),
  z.lazy(()=>jzodAttributeStringWithValidationsSchema),
  z.lazy(()=>jzodEnumSchema),
  z.lazy(()=>jzodFunctionSchema),
  z.lazy(()=>jzodLazySchema),
  z.lazy(()=>jzodLiteralSchema),
  z.lazy(()=>jzodIntersectionSchema),
  z.lazy(()=>jzodMapSchema),
  z.lazy(()=>jzodObjectSchema),
  z.lazy(()=>jzodPromiseSchema),
  z.lazy(()=>jzodRecordSchema),
  z.lazy(()=>jzodReferenceSchema),
  z.lazy(()=>jzodSetSchema),
  z.lazy(()=>jzodTupleSchema),
  z.lazy(()=>jzodUnionSchema),
])

// // ##############################################################################################################
// export const jzodElementSetSchema = z.record(z.string(),jzodElementSchema);
// export type JzodElementSet = z.infer<typeof jzodElementSetSchema>;

// ##############################################################################################################
export const jzodEnumSchema = z.object({
  optional: z.boolean().optional(),
  nullable: z.boolean().optional(),
  extra: z.record(z.string(),z.any()).optional(),
  type: z.literal(jzodEnumElementTypesSchema.enum.enum),
  definition: z.array(z.string()),
}).strict();

export type JzodEnum = z.infer<typeof jzodEnumSchema>;

// ##############################################################################################################
export interface JzodFunction {
  // optional?: boolean,
  // nullable?: boolean,
  extra?: {[k:string]:any},
  type: 'function',
  definition: {args: JzodElement[], returns?: JzodElement},
}
export const jzodFunctionSchema: ZodType<JzodFunction> = z.object({
  type: z.literal(jzodEnumElementTypesSchema.enum.function),
  extra: z.record(z.string(),z.any()).optional(),
  // anyway, arg and returns types are not use upon validation to check the function's interface. Suffices for it to be a function, it is then valid.
  definition: z.object({
    args:z.array(jzodElementSchema),
    returns: jzodElementSchema.optional(),
  })
}).strict();

// ##############################################################################################################
export const jzodLazySchema = z.object({
  type: z.literal(jzodEnumElementTypesSchema.enum.lazy),
  extra: z.record(z.string(),z.any()).optional(),
  definition: jzodFunctionSchema,
}).strict();

export type JzodLazy = z.infer<typeof jzodLazySchema>;

// ##############################################################################################################
export const jzodLiteralSchema = z.object({
  optional: z.boolean().optional(),
  nullable: z.boolean().optional(),
  extra: z.record(z.string(),z.any()).optional(),
  type: z.literal(jzodEnumElementTypesSchema.enum.literal),
  definition: z.string(),
}).strict();

export type JzodLiteral = z.infer<typeof jzodLiteralSchema>;

// ##############################################################################################################
export interface JzodIntersection {
  optional?: boolean,
  nullable?: boolean,
  extra?: {[k:string]:any},
  type: 'intersection',
  definition: {left: JzodElement, right: JzodElement},
}

export const jzodIntersectionSchema: z.ZodType<JzodIntersection> = z.object({
  optional: z.boolean().optional(),
  nullable: z.boolean().optional(),
  extra: z.record(z.string(),z.any()).optional(),
  type: z.literal(jzodEnumElementTypesSchema.enum.intersection),
  definition: z.lazy(()=>z.object({left: jzodElementSchema, right: jzodElementSchema}))
}).strict();

// ##############################################################################################################
export interface JzodMap extends JzodRoot {
  optional?: boolean,
  nullable?: boolean,
  extra?: {[k:string]:any},
  type: 'map',
  definition: [JzodElement,JzodElement]
}

export const jzodMapSchema: z.ZodType<JzodMap> = z.object({ // issue with JsonSchema conversion when using extend from ZodRootSchema, although the 2 are functionnaly equivalent
  optional: z.boolean().optional(),
  nullable: z.boolean().optional(),
  extra: z.record(z.string(),z.any()).optional(),
  type: z.literal('map'),
  definition: z.lazy(()=>z.tuple([jzodElementSchema, jzodElementSchema]))
}).strict();

// ##############################################################################################################
export interface JzodObject extends JzodRoot {
  optional?: boolean,
  nullable?: boolean,
  extend?: JzodReference | JzodObject,
  extra?: {[k:string]:any},
  type: "object",
  nonStrict?: boolean,
  // context?: {[attributeName:string]: JzodElement},
  definition: {[attributeName:string]: JzodElement}
}

export const jzodObjectSchema: z.ZodType<JzodObject> = z.object({
  optional: z.boolean().optional(),
  nullable: z.boolean().optional(),
  extend: z.lazy(()=>z.union([jzodReferenceSchema,jzodObjectSchema])).optional(),
  extra: z.record(z.string(),z.any()).optional(),
  type: z.literal(jzodEnumElementTypesSchema.enum.object),
  nonStrict: z.boolean().optional(),
  definition: z.lazy(()=>z.record(z.string(),jzodElementSchema)),
}).strict();

// ##############################################################################################################
export interface JzodPromise extends JzodRoot {
  // optional?: boolean,
  // nullable?: boolean,
  extra?: {[k:string]:any},
  type: 'promise',
  definition: JzodElement
}

export const jzodPromiseSchema: z.ZodType<JzodPromise> = z.object({ // issue with JsonSchema conversion when using extend from ZodRootSchema, although the 2 are functionnaly equivalent
  // optional: z.boolean().optional(),
  // nullable: z.boolean().optional(),
  extra: z.record(z.string(),z.any()).optional(),
  type: z.literal('promise'),
  definition: z.lazy(()=>jzodElementSchema)
}).strict();


// ##############################################################################################################
export interface JzodRecord {
  optional?: boolean,
  nullable?: boolean,
  extra?: {[k:string]:any},
  type: 'record',
  definition: JzodElement,
}

export const jzodRecordSchema: z.ZodType<JzodRecord> = z.object({
  optional: z.boolean().optional(),
  nullable: z.boolean().optional(),
  extra: z.record(z.string(),z.any()).optional(),
  type: z.literal(jzodEnumElementTypesSchema.enum.record),
  definition: z.lazy(()=>jzodElementSchema)
}).strict();

// ##############################################################################################################
export interface JzodReference {
  optional?: boolean,
  nullable?: boolean,
  extra?: {[k:string]:any},
  context?: {[attributeName:string]: JzodElement},
  type: 'schemaReference',
  definition: {
    eager?: boolean,
    relativePath?: string,
    absolutePath?: string,
  },
}

export const jzodReferenceSchema: ZodType<JzodReference> = z.object({ // inheritance from ZodRootSchema leads to a different JsonSchema thus invalidates tests, although it is semantically equivalent
  optional: z.boolean().optional(),
  nullable: z.boolean().optional(),
  extra: z.record(z.string(),z.any()).optional(),
  type: z.literal(jzodEnumElementTypesSchema.enum.schemaReference),
  context: z.lazy(()=>z.record(z.string(),jzodElementSchema)).optional(),
  definition: z.object({
    eager: z.boolean().optional(),
    relativePath: z.string().optional(),
    absolutePath: z.string().optional(),
  })
}).strict()

// export type JzodReference = z.infer<typeof jzodReferenceSchema>;

// ##############################################################################################################
export interface JzodSet extends JzodRoot {
  optional?: boolean,
  nullable?: boolean,
  extra?: {[k:string]:any},
  type: 'set',
  definition: JzodElement
}

export const jzodSetSchema: z.ZodType<JzodSet> = z.object({ // issue with JsonSchema conversion when using extend from ZodRootSchema, although the 2 are functionnaly equivalent
  optional: z.boolean().optional(),
  nullable: z.boolean().optional(),
  extra: z.record(z.string(),z.any()).optional(),
  type: z.literal('set'),
  definition: z.lazy(()=>jzodElementSchema)
}).strict();

// ##############################################################################################################
export interface JzodTuple {
  optional?: boolean,
  nullable?: boolean,
  extra?: {[k:string]:any},
  type: 'tuple',
  definition: JzodElement[],
}

export const jzodTupleSchema: z.ZodType<JzodTuple> = z.object({
  optional: z.boolean().optional(),
  nullable: z.boolean().optional(),
  extra: z.record(z.string(),z.any()).optional(),
  type: z.literal(jzodEnumElementTypesSchema.enum.tuple),
  definition: z.array(jzodElementSchema),
}).strict();

// ##############################################################################################################
export interface JzodUnion {
  optional?: boolean,
  nullable?: boolean,
  extra?: {[k:string]:any},
  type: "union",
  discriminator?: string,
  definition: JzodElement[],
}
export const jzodUnionSchema: z.ZodType<JzodUnion> = z.object({
  optional: z.boolean().optional(),
  nullable: z.boolean().optional(),
  extra: z.record(z.string(),z.any()).optional(),
  type: z.literal(jzodEnumElementTypesSchema.enum.union),
  discriminator: z.string().optional(),
  definition: z.lazy(()=>z.array(jzodElementSchema))
}).strict();

