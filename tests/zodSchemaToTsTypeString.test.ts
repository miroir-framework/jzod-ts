import { describe, expect } from 'vitest';
import { z, ZodTypeAny } from "zod";

import { zodSchemaToTsTypeString } from "../src/JzodToTs";
function performTest(testName: string |undefined,zodSchema:ZodTypeAny, expected:any) {
  const result = zodSchemaToTsTypeString(zodSchema);
  console.log("result", JSON.stringify(result, null, 2));
  expect(result, testName??"No test name!").toEqual(expected);
}

describe(
  "zodSchemaToTsTypeString",
  () => {
    it( "string",
      () => {
        const testZodSchema1: any /**ZodElement*/ = z.string();
        performTest(expect.getState().currentTestName,testZodSchema1,{
            "contextTsTypeStrings": {},
            "mainTsTypeString": "type  = string;",
          }
        );
      }
    )
    it(
      "object",
      () => {
        const testZodSchema2: any /**ZodElement*/ = z.object({
          a: z.string(),
          b: z.object({
            c: z.number(),
            d: z.boolean(),
          }),
        });
        // const result = zodSchemaToTsTypeString(testZodSchema2);
        performTest(expect.getState().currentTestName, testZodSchema2, {
          contextTsTypeStrings: {},
          mainTsTypeString: `type  = {
    a: string;
    b: {
        c: number;
        d: boolean;
    };
};`
        });
      }
    )
    it(
      "array",
      () => {
        const testZodSchema3: any /**ZodElement*/ = z.array(z.string());
        performTest(expect.getState().currentTestName, testZodSchema3, {
          contextTsTypeStrings: {},
          mainTsTypeString: "type  = string[];"
        });
      }
    )
  }
)