import { ZodType, ZodTypeAny, z } from "zod";

export type A = string;
export type B = {
    test: A;
};
export type TestJzodSchema2 = B;

export const a = z.string();
export const b = z.object({test:z.lazy(() =>a)}).strict();
export const testJzodSchema2 = z.lazy(() =>b);
