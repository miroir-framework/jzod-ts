import { ZodType, ZodTypeAny, z } from "zod";

export type TestJzodSchema3 = {
    a: string | {
        b: number;
    };
} | {
    b: number;
};

export const testJzodSchema3 = z.union([z.object({a:z.union([z.string(), z.object({b:z.number()}).strict()])}).strict(),z.object({b:z.number()}).strict()]);
