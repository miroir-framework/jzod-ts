import { ZodType, z } from "zod";

const jzodRootSchema = z.object({
  optional: z.boolean().optional(),
}).strict();
type JzodRoot = z.infer<typeof jzodRootSchema>;

// ##############################################################################################################
export const jzodEnumAttributeTypes = z.enum([
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

export type JzodEnumTypes = z.infer<typeof jzodEnumAttributeTypes>;

// ##############################################################################################################
export const jzodEnumElementTypes = z.enum([
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

export type JzodEnumElementTypes = z.infer<typeof jzodEnumElementTypes>;


// ##############################################################################################################
export interface JzodArray extends JzodRoot {
  optional?: boolean,
  nullable?: boolean,
  extra?: {[k:string]:any},
  type: 'array',
  definition: JzodElement
}

export const jzodArray: z.ZodType<JzodArray> = z.object({ // issue with JsonSchema conversion when using extend from ZodRootSchema, although the 2 are functionnaly equivalent
  optional: z.boolean().optional(),
  nullable: z.boolean().optional(),
  extra: z.record(z.string(),z.any()).optional(),
  type: z.literal('array'),
  definition: z.lazy(()=>jzodElement)
}).strict();

// ##############################################################################################################
export const jzodAttributeDateValidations = z
  .object({
    extra: z.record(z.string(), z.any()).optional(),
    type: z.enum([
      "min",
      "max",
    ]),
    parameter: z.any(),
  })
  .strict();

export type JzodAttributeDateValidations = z.infer<typeof jzodAttributeDateValidations>;

// ##############################################################################################################
export const jzodAttributeNumberValidations = z
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

export type JzodAttributeNumberValidations = z.infer<typeof jzodAttributeNumberValidations>;

// ##############################################################################################################
export const jzodAttributeStringValidations = z
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

export type JzodAttributeStringValidations = z.infer<typeof jzodAttributeStringValidations>;

// ##############################################################################################################
export const jzodAttributeDateWithValidations = z.object({
  optional: z.boolean().optional(),
  nullable: z.boolean().optional(),
  extra: z.record(z.string(),z.any()).optional(),
  coerce: z.boolean().optional(),
  type: z.literal(jzodEnumElementTypes.enum.simpleType),
  definition: z.literal(jzodEnumAttributeTypes.enum.date),
  validations: z.array(jzodAttributeDateValidations),
}).strict();

export type JzodAttributeDateWithValidations = z.infer<typeof jzodAttributeDateWithValidations>;

// ##############################################################################################################
export const jzodAttributeNumberWithValidations = z.object({
  optional: z.boolean().optional(),
  nullable: z.boolean().optional(),
  extra: z.record(z.string(),z.any()).optional(),
  coerce: z.boolean().optional(),
  type: z.literal(jzodEnumElementTypes.enum.simpleType),
  definition: z.literal(jzodEnumAttributeTypes.enum.number),
  validations: z.array(jzodAttributeNumberValidations),
}).strict();

export type JzodAttributeNumberWithValidations = z.infer<typeof jzodAttributeNumberWithValidations>;

// ##############################################################################################################
export const jzodAttributeStringWithValidations = z.object({
  optional: z.boolean().optional(),
  nullable: z.boolean().optional(),
  extra: z.record(z.string(),z.any()).optional(),
  coerce: z.boolean().optional(),
  type: z.literal(jzodEnumElementTypes.enum.simpleType),
  definition: z.literal(jzodEnumAttributeTypes.enum.string),
  validations: z.array(jzodAttributeStringValidations),
}).strict();

export type JzodAttributeStringWithValidations = z.infer<typeof jzodAttributeStringWithValidations>;

// ##############################################################################################################
export const jzodAttribute = z.object({
  optional: z.boolean().optional(),
  nullable: z.boolean().optional(),
  extra: z.record(z.string(),z.any()).optional(),
  coerce: z.boolean().optional(),
  type: z.literal(jzodEnumElementTypes.enum.simpleType),
  definition: z.lazy(()=>jzodEnumAttributeTypes),
}).strict();

export type JzodAttribute = z.infer<typeof jzodAttribute>;


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

export const jzodElement: z.ZodType<JzodElement> = z.union([
  z.lazy(()=>jzodArray),
  z.lazy(()=>jzodAttribute),
  z.lazy(()=>jzodAttributeDateWithValidations),
  z.lazy(()=>jzodAttributeNumberWithValidations),
  z.lazy(()=>jzodAttributeStringWithValidations),
  z.lazy(()=>jzodEnum),
  z.lazy(()=>jzodFunction),
  z.lazy(()=>jzodLazy),
  z.lazy(()=>jzodLiteral),
  z.lazy(()=>jzodIntersection),
  z.lazy(()=>jzodMapSchema),
  z.lazy(()=>jzodObject),
  z.lazy(()=>jzodPromise),
  z.lazy(()=>jzodRecord),
  z.lazy(()=>jzodReference),
  z.lazy(()=>jzodSet),
  z.lazy(()=>jzodTuple),
  z.lazy(()=>jzodUnion),
])

// // ##############################################################################################################
// export const jzodElementSetSchema = z.record(z.string(),jzodElement);
// export type JzodElementSet = z.infer<typeof jzodElementSetSchema>;

// ##############################################################################################################
export const jzodEnum = z.object({
  optional: z.boolean().optional(),
  nullable: z.boolean().optional(),
  extra: z.record(z.string(),z.any()).optional(),
  type: z.literal(jzodEnumElementTypes.enum.enum),
  definition: z.array(z.string()),
}).strict();

export type JzodEnum = z.infer<typeof jzodEnum>;

// ##############################################################################################################
export interface JzodFunction {
  // optional?: boolean,
  // nullable?: boolean,
  extra?: {[k:string]:any},
  type: 'function',
  definition: {args: JzodElement[], returns?: JzodElement},
}
export const jzodFunction: ZodType<JzodFunction> = z.object({
  type: z.literal(jzodEnumElementTypes.enum.function),
  extra: z.record(z.string(),z.any()).optional(),
  // anyway, arg and returns types are not use upon validation to check the function's interface. Suffices for it to be a function, it is then valid.
  definition: z.object({
    args:z.array(jzodElement),
    returns: jzodElement.optional(),
  })
}).strict();

// ##############################################################################################################
export const jzodLazy = z.object({
  type: z.literal(jzodEnumElementTypes.enum.lazy),
  extra: z.record(z.string(),z.any()).optional(),
  definition: jzodFunction,
}).strict();

export type JzodLazy = z.infer<typeof jzodLazy>;

// ##############################################################################################################
export const jzodLiteral = z.object({
  optional: z.boolean().optional(),
  nullable: z.boolean().optional(),
  extra: z.record(z.string(),z.any()).optional(),
  type: z.literal(jzodEnumElementTypes.enum.literal),
  definition: z.string(),
}).strict();

export type JzodLiteral = z.infer<typeof jzodLiteral>;

// ##############################################################################################################
export interface JzodIntersection {
  optional?: boolean,
  nullable?: boolean,
  extra?: {[k:string]:any},
  type: 'intersection',
  definition: {left: JzodElement, right: JzodElement},
}

export const jzodIntersection: z.ZodType<JzodIntersection> = z.object({
  optional: z.boolean().optional(),
  nullable: z.boolean().optional(),
  extra: z.record(z.string(),z.any()).optional(),
  type: z.literal(jzodEnumElementTypes.enum.intersection),
  definition: z.lazy(()=>z.object({left: jzodElement, right: jzodElement}))
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
  definition: z.lazy(()=>z.tuple([jzodElement, jzodElement]))
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

export const jzodObject: z.ZodType<JzodObject> = z.object({
  optional: z.boolean().optional(),
  nullable: z.boolean().optional(),
  extend: z.lazy(()=>z.union([jzodReference,jzodObject])).optional(),
  extra: z.record(z.string(),z.any()).optional(),
  type: z.literal(jzodEnumElementTypes.enum.object),
  nonStrict: z.boolean().optional(),
  definition: z.lazy(()=>z.record(z.string(),jzodElement)),
}).strict();

// ##############################################################################################################
export interface JzodPromise extends JzodRoot {
  // optional?: boolean,
  // nullable?: boolean,
  extra?: {[k:string]:any},
  type: 'promise',
  definition: JzodElement
}

export const jzodPromise: z.ZodType<JzodPromise> = z.object({ // issue with JsonSchema conversion when using extend from ZodRootSchema, although the 2 are functionnaly equivalent
  // optional: z.boolean().optional(),
  // nullable: z.boolean().optional(),
  extra: z.record(z.string(),z.any()).optional(),
  type: z.literal('promise'),
  definition: z.lazy(()=>jzodElement)
}).strict();


// ##############################################################################################################
export interface JzodRecord {
  optional?: boolean,
  nullable?: boolean,
  extra?: {[k:string]:any},
  type: 'record',
  definition: JzodElement,
}

export const jzodRecord: z.ZodType<JzodRecord> = z.object({
  optional: z.boolean().optional(),
  nullable: z.boolean().optional(),
  extra: z.record(z.string(),z.any()).optional(),
  type: z.literal(jzodEnumElementTypes.enum.record),
  definition: z.lazy(()=>jzodElement)
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

export const jzodReference: ZodType<JzodReference> = z.object({ // inheritance from ZodRootSchema leads to a different JsonSchema thus invalidates tests, although it is semantically equivalent
  optional: z.boolean().optional(),
  nullable: z.boolean().optional(),
  extra: z.record(z.string(),z.any()).optional(),
  type: z.literal(jzodEnumElementTypes.enum.schemaReference),
  context: z.lazy(()=>z.record(z.string(),jzodElement)).optional(),
  definition: z.object({
    eager: z.boolean().optional(),
    relativePath: z.string().optional(),
    absolutePath: z.string().optional(),
  })
}).strict()

// export type JzodReference = z.infer<typeof jzodReference>;

// ##############################################################################################################
export interface JzodSet extends JzodRoot {
  optional?: boolean,
  nullable?: boolean,
  extra?: {[k:string]:any},
  type: 'set',
  definition: JzodElement
}

export const jzodSet: z.ZodType<JzodSet> = z.object({ // issue with JsonSchema conversion when using extend from ZodRootSchema, although the 2 are functionnaly equivalent
  optional: z.boolean().optional(),
  nullable: z.boolean().optional(),
  extra: z.record(z.string(),z.any()).optional(),
  type: z.literal('set'),
  definition: z.lazy(()=>jzodElement)
}).strict();

// ##############################################################################################################
export interface JzodTuple {
  optional?: boolean,
  nullable?: boolean,
  extra?: {[k:string]:any},
  type: 'tuple',
  definition: JzodElement[],
}

export const jzodTuple: z.ZodType<JzodTuple> = z.object({
  optional: z.boolean().optional(),
  nullable: z.boolean().optional(),
  extra: z.record(z.string(),z.any()).optional(),
  type: z.literal(jzodEnumElementTypes.enum.tuple),
  definition: z.array(jzodElement),
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
export const jzodUnion: z.ZodType<JzodUnion> = z.object({
  optional: z.boolean().optional(),
  nullable: z.boolean().optional(),
  extra: z.record(z.string(),z.any()).optional(),
  type: z.literal(jzodEnumElementTypes.enum.union),
  discriminator: z.string().optional(),
  definition: z.lazy(()=>z.array(jzodElement))
}).strict();

