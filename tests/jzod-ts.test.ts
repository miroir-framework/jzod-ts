import * as fs from "fs";
import * as path from "path";

import { jzodBootstrapElementSchema } from "@miroir-framework/jzod";
import { jzodToTsCode } from "../src/JzodToTs";
import { JzodElement, jzodElementSchema } from "../src/JzodTsInterface";

const refsPath = "./tests/resources"
const tmpPath = "./tests/tmp";


const testJzodToTs = (
  // testDirectory: string,
  referenceFileName: string,
  testFileName: string,
  testJzodSchema:JzodElement,
  exportPrefix: boolean,
  typeName: string
) => {
  console.log("testJzodToTs:", typeName);
  
  const testResultSchemaFilePath = path.join(tmpPath,testFileName);
  const expectedSchemaFilePath = path.join(refsPath,referenceFileName);

  const result = jzodToTsCode(testJzodSchema,exportPrefix,typeName)
  fs.writeFileSync(testResultSchemaFilePath,result);

  const resultContents = result.replace(/(\r\n|\n|\r)/gm, "");
  // console.log("ts Type generation resultContents", resultContents);

  const expectedFileContents = fs.readFileSync(expectedSchemaFilePath).toString().replace(/(\r\n|\n|\r)/gm, "")
  expect(resultContents).toEqual(expectedFileContents);
}


describe(
  'Jzod-Ts',
  () => {
    // ############################################################################################
    it(
      "Jzod to TS Type",
      async() => {


        // ########################################################################################
        const testJzodSchema1: JzodElement = { type: "simpleType", definition: "string" };

        testJzodToTs(
          "tsTypeGeneration-testJzodSchema1 - reference.ts",
          "tsTypeGeneration-testJzodSchema1.ts",
          testJzodSchema1,
          true,
          "testJzodSchema1"
        );

        // ########################################################################################
        const testJzodSchema2: JzodElement = {
          type: "schemaReference",
          context: {
            a: { type: "simpleType", definition: "string" },
            b: {
              type: "object",
              definition: {
                test: { type: "schemaReference", definition: { relativePath: "a" } }
              },
            },
          },
          definition: { relativePath: "b" },
        };

        testJzodToTs(
          "tsTypeGeneration-testJzodSchema2 - reference.ts",
          "tsTypeGeneration-testJzodSchema2.ts",
          testJzodSchema2,
          true,
          "testJzodSchema2"
        );

        // ########################################################################################
        const testJzodSchema4:JzodElement = 
        {
          type: "schemaReference", 
          context: {
            ...jzodBootstrapElementSchema.context,
            a: {
              type: "array",
              definition: { type: "schemaReference", definition: {relativePath: "jzodArraySchema"} }
            }
          },
          definition: {
            relativePath: "a"
          },
        }

        testJzodToTs(
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



