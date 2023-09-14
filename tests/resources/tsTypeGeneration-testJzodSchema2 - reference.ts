import { ZodType, ZodTypeAny, z } from "zod";

export type A = string;
export type B = {
    test?: A;
};
export type TestJzodSchema2 = B;

export const a:z.ZodType<A> = z.string();
export const b:z.ZodType<B> = z.object({test:z.lazy(() =>a),}).strict();
export const testJzodSchema2: z.ZodType<TestJzodSchema2> = z.lazy(() =>b);
