import { ZodType, ZodTypeAny, z } from "zod";

export type TestJzodSchema1 = string;

export const testJzodSchema1: z.ZodType<TestJzodSchema1> = z.string();
