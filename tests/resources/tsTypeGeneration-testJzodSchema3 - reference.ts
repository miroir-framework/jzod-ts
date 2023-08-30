import { ZodType, ZodTypeAny, z } from "zod";


type jzodLiteralSchema = {
    optional?: boolean | undefined;
    extra?: {
        [x: string]: any;
    } | undefined;
    type: "literal";
    definition: string;
};
type jzodElementSchema = jzodLiteralSchema;
type testJzodSchema3 = {
    b: jzodElementSchema[];
};

export const jzodLiteralSchema=z.object({optional:z.boolean().optional(),extra:z.record(z.string(),z.any()).optional(),type:z.literal("literal"),definition:z.string(),}).strict();
export const jzodElementSchema=z.union([z.lazy(() =>jzodLiteralSchema),]);
export const testJzodSchema3 = z.object({b:z.array(z.lazy(() =>jzodElementSchema)),}).strict();
