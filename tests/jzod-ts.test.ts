import { readFileSync, writeFileSync } from "fs";
import path from "path";
import { describe, expect, it } from "vitest";

import { jzodBootstrapElementSchema } from "@miroir-framework/jzod";
import { jzodToTsCode } from "../src/JzodToTs";

const tmpPath = "./tests/tmp";
const refsPath = "./tests/resources"


const testJzodToTs = async (
  referenceFileName: string,
  testFileName: string,
  testJzodSchema: any, //JzodElement,
  exportPrefix: boolean,
  typeName: string
) => {
  console.log("testJzodToTs:", typeName);
  
  const testResultSchemaFilePath = path.join(tmpPath,testFileName);
  const expectedSchemaFilePath = path.join(refsPath,referenceFileName);

  const result = await jzodToTsCode(
    typeName,
    testJzodSchema,
    {},  // context
    exportPrefix,
  )
  // console.log("ts Type generation result", result);

  writeFileSync(testResultSchemaFilePath,result);

  const resultContents = result.replace(/(\r\n|\n|\r)/gm, "");
  // console.log("ts Type generation resultContents", resultContents);

  const expectedFileContents = readFileSync(expectedSchemaFilePath).toString().replace(/(\r\n|\n|\r)/gm, "")
  console.log("testJzodToTs running for:", typeName);
  expect(resultContents).toEqual(expectedFileContents);
}


describe(
  'Jzod-Ts',
  () => {
    // ############################################################################################
    it("Jzod to TS Type",
      async() => {

        // ########################################################################################
        const testJzodSchema1: any /**JzodElement*/ = { type: "string" };

        await testJzodToTs(
          "tsTypeGeneration-testJzodSchema1 - reference.ts",
          "tsTypeGeneration-testJzodSchema1.ts",
          testJzodSchema1,
          true, // exportPrefix
          "testJzodSchema1"
        );

        // ########################################################################################
        const testJzodSchema2: any /**JzodElement*/ = {
          type: "schemaReference",
          context: {
            a: { type: "string" },
            b: {
              type: "object",
              definition: {
                test: { type: "schemaReference", definition: { relativePath: "a" } }
              },
            },
          },
          definition: { relativePath: "b" },
        };

        await testJzodToTs(
          "tsTypeGeneration-testJzodSchema2 - reference.ts",
          "tsTypeGeneration-testJzodSchema2.ts",
          testJzodSchema2,
          true,
          "testJzodSchema2"
        );

        // ########################################################################################
        const testJzodSchema3: any /**JzodElement*/ = {
          type: "object",
          carryOn: {
            type: "object",
            definition: {
              b: { type: "number" }
            }
          },
          definition: {
            a: { type: "string" },
          }
        };

        await testJzodToTs(
          "tsTypeGeneration-testJzodSchema3 - reference.ts",
          "tsTypeGeneration-testJzodSchema3.ts",
          testJzodSchema3,
          true,
          "testJzodSchema3"
        );

        // ########################################################################################
        const testJzodSchema4: any /**JzodElement*/ = 
        {
          type: "schemaReference", 
          context: {
            ...jzodBootstrapElementSchema.context,
            a: {
              type: "array",
              definition: { type: "schemaReference", definition: {relativePath: "jzodArray"} }
            }
          },
          definition: {
            relativePath: "a"
          },
        }

        await testJzodToTs(
          "tsTypeGeneration-testJzodSchema4 - reference.ts",
          "tsTypeGeneration-testJzodSchema4.ts",
          testJzodSchema4,
          true,
          "testJzodSchema4"
        );
      }
    )
  }
)



