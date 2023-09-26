import { ZodType, ZodTypeAny, z } from "zod";


type jzodLiteral = {
    optional?: boolean | undefined;
    extra?: {
        [x: string]: any;
    } | undefined;
    type: "literal";
    definition: string;
};
type jzodElement = jzodLiteral;
type testJzodSchema3 = {
    b: jzodElement[];
};

export const jzodLiteral=z.object({optional:z.boolean().optional(),extra:z.record(z.string(),z.any()).optional(),type:z.literal("literal"),definition:z.string(),}).strict();
export const jzodElement=z.union([z.lazy(() =>jzodLiteral),]);
export const testJzodSchema3 = z.object({b:z.array(z.lazy(() =>jzodElement)),}).strict();
