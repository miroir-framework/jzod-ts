import { ZodType, ZodTypeAny, z } from "zod";

export type a = string;
export type b = {
    test?: a;
};
export type testJzodSchema2 = b;

export const a=z.string();
export const b=z.object({test:z.lazy(() =>a),}).strict();
export const testJzodSchema2 = z.lazy(() =>b);
