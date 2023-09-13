import { ZodType, ZodTypeAny, z } from "zod";

export type testJzodSchema1 = string;

export const testJzodSchema1: z.ZodType<testJzodSchema1> = z.string();
