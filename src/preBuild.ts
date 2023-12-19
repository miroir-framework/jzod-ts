import { existsSync, readFileSync, writeFileSync } from 'fs';
import { jzodBootstrapElementSchema } from '@miroir-framework/jzod';

import { jzodToTsCode } from './JzodToTs.js';

export function generateZodSchemaFileFromJzodSchema(
  jzodElement: any, //JzodElement,
  targetFileName: string,
  jzodSchemaVariableName:string,
) {
  // console.log("generateZodSchemaFileFromJzodSchema called!");
 
  const newFileContentsNotFormated = jzodToTsCode(jzodElement, true, jzodSchemaVariableName,Object.keys(jzodElement.context))
  // const newFileContents = `import { JzodObject, jzodObject } from "@miroir-framework/jzod-ts";
  const newFileContents = `${newFileContentsNotFormated}
`;

  if (targetFileName && existsSync(targetFileName)) {
    const oldFileContents = readFileSync(targetFileName).toString()
    if (newFileContents != oldFileContents)  {
      // console.log("generateZodSchemaFileFromJzodSchema newFileContents",newFileContents);
      writeFileSync(targetFileName,newFileContents);
    } else {
      console.log("generateZodSchemaFileFromJzodSchema entityDefinitionReport old contents equal new contents, no file generation needed.");
    }
  } else {
    writeFileSync(targetFileName,newFileContents);
  }
}

// ################################################################################################
const jzodSchemaConversion
: {
  jzodElement: any,
  targetFileName: string,
  jzodSchemaVariableName:string,
}[]
= [
  {
    jzodElement: jzodBootstrapElementSchema,
    targetFileName: "./src/generated_jzodBootstrapElementSchema.ts",
    jzodSchemaVariableName: "jzodBootstrapElementSchema",
  },
];

try {
  for (const schema of jzodSchemaConversion) {
    generateZodSchemaFileFromJzodSchema(schema.jzodElement,schema.targetFileName,schema.jzodSchemaVariableName)
    console.info("GENERATED",schema.targetFileName);
  }
  
} catch (error) {
  console.error("could not generate TS files from Jzod schemas", error);
}