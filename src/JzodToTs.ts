import ts from "typescript";
import { z, ZodTypeAny } from "zod";
import { GetType, createTypeAlias, printNode, withGetType, zodToTs } from "zod-to-ts";
import { pool } from "workerpool";

import {
  jzodElementSchemaToZodSchemaAndDescription,
  jzodElementSchemaToZodSchemaAndDescriptionWithCarryOn,
  // jzodElementSchemaToZodTextAndTsText,
  // jzodElementSchemaToZodTextAndTsTextInParallel,
  TsTypeString,
  TypeScriptGenerationParams,
  ZodSchemaAndDescriptionRecord,
  ZodSchemaToTsTypeStringFunction,
  ZodTextAndTsTypeText,
  ZodTextAndZodSchema,
} from "@miroir-framework/jzod";

// import { JzodElement } from "./generated_jzodBootstrapElementSchema";

import { printTsTypeAliases } from "./tools.js";
import { JzodElement, JzodReference } from "./generated_jzodBootstrapElementSchema.js";
// import { printTsTypeAliases } from "./tools";
// import WorkerPool from "./workerPoolNOTUSED.js";

// ################################################################################################
export type TsTypeAliases =  {
  [k: string]: ts.TypeAliasDeclaration;
  // [k: string]: string;
}

// ################################################################################################
export interface TsTypeAliasesAndZodText {
  contextTsTypeAliases: { [k: string]: ts.TypeAliasDeclaration },
  // contextTsTypeAliases: { [k: string]: string },
  contextZodText: { [k: string]: string },
  mainTsTypeAlias: ts.TypeAliasDeclaration,
  mainZodText: string 
}

// ################################################################################################
export interface ZodText {
  // contextTsTypeStrings: { [k: string]: string },
  contextZodText: { [k: string]: string },
  // mainTsTypeString: string,
  mainZodText: string 
}

export interface TsTypeStringAndZodText extends ZodText, TsTypeString {}

// ################################################################################################
export function jzodElementToZodTextAndZodSchemaForTsGeneration(
  element: any, // to avoid circularity on JzodElement
  context: ZodSchemaAndDescriptionRecord = {},
): ZodTextAndZodSchema {
  const contextFunction = () => context;
  const elementZodSchemaAndDescription: ZodTextAndZodSchema = jzodElementSchemaToZodSchemaAndDescription(
    element as any,
    contextFunction,
    contextFunction,
    {
      typeScriptLazyReferenceConverter: (innerReference: ZodTypeAny & GetType, relativeReference: string | undefined) =>
        withGetType(innerReference, (ts: any) => {
          const actualTypeName = relativeReference
            ? relativeReference.replace(/^(.)(.*)$/, (a, b, c) => b.toUpperCase() + c)
            : "";
          return ts.factory.createTypeReferenceNode(
            ts.factory.createIdentifier(actualTypeName ?? "RELATIVEPATH_NOT_DEFINED"),
            undefined
          );
        }),
      returnTypeScript: true,
    }
  );
  return elementZodSchemaAndDescription;
}

export let getReferences: (() => ZodSchemaAndDescriptionRecord) | undefined = undefined;

// ######################################################################################################
export async function jzodElementSchemaToZodTextAndTsTextInParallel(
  element: JzodElement,
  carryOn: ZodTextAndZodSchema | undefined,
  getSchemaEagerReferences: () => ZodSchemaAndDescriptionRecord = () => ({}),
  getLazyReferences: () => ZodSchemaAndDescriptionRecord = () => ({}),
  zodSchemaToTsTypeString: ZodSchemaToTsTypeStringFunction,
  typeScriptGeneration?: TypeScriptGenerationParams,
  nonExtendedJzodSchemaContext: ZodSchemaAndDescriptionRecord = {},
): Promise<ZodTextAndTsTypeText> {
  return new Promise(async (resolve, reject) => {
    try {
      if ((element as any)?.carryOn && !!carryOn) {
        throw new Error(
          "jzodElementSchemaToZodSchemaAndDecritpionWithCarryOn carryOn override is not allowed, at most 1 carryOn clause can be specified in any jzod schema tree."
        );
      }
    
      if (!!carryOn && !["object", "schemaReference", "union"].includes(element.type)) { // only object, schemaReference and union can have a carryOn
        // const plainZodSchema = jzodElementSchemaToZodSchemaAndDescriptionWithCarryOn(
        // if there is a carryOn and current element can not have a carryOn, then return the union of the current element and the carryOn
        const plainZodSchema = jzodElementSchemaToZodSchemaAndDescription(
          element,
          // undefined, // carryOn
          getSchemaEagerReferences,
          getLazyReferences,
          typeScriptGeneration
        );
        const zodSchema = z.union([plainZodSchema.zodSchema, carryOn.zodSchema]);
        const zodText = `z.union([${plainZodSchema.zodText}, ${carryOn.zodText}])`;
        
        if (!typeScriptGeneration?.typeName) {
          throw new Error("typeName must be defined in typeScriptGeneration when generating TypeScript: " + JSON.stringify(typeScriptGeneration));
        }
        const context = Object.fromEntries(Object.entries(getSchemaEagerReferences()).map(e => [e[0], e[1].zodSchema]));
        const tsTypeText = zodSchemaToTsTypeString(zodSchema, context, typeScriptGeneration.typeName);
        const result:ZodTextAndTsTypeText = {
          contextZodText: undefined,
          contextTsTypeText: tsTypeText.contextTsTypeStrings,
          tsTypeText: tsTypeText.mainTsTypeString,
          zodText,
        };
        return result;
      }
      switch (element.type) {
        case "schemaReference": {
          // const carryOnZodSchemaAndDescription = element.carryOn
          //   ? jzodElementSchemaToZodSchemaAndDescriptionWithCarryOn(
          //       element.carryOn,
          //       undefined,
          //       getSchemaEagerReferences,
          //       getLazyReferences,
          //       typeScriptGeneration
          //     )
          //   : carryOn;

          // const localContextReferences: [string, ZodTextAndZodSchema][] = [];
          if (typeScriptGeneration?.returnTypeScript) {
            // spawn a call to jzodElementSchemaToZodSchemaAndDescriptionWithCarryOn (via the Worker) for each context entry
            // only serializable data can be passed to the worker,
            if (
              !typeScriptGeneration.poolsize ||
              !typeScriptGeneration.typeName ||
              !typeScriptGeneration.exportPrefix
            ) {
              throw new Error(
                "poolsize, typename, exportPrefix must be defined in typeScriptGeneration when generating TypeScript: " +
                  JSON.stringify(typeScriptGeneration)
              );
            }
            const entries = Object.entries((element as JzodReference).context ?? {});
            // console.log("jzodElementSchemaToZodTextAndTsTextInParallel using zodSchemaToTsTypeString in worker pool:", zodSchemaToTsTypeString.toString());
            const workerPool = pool(__dirname + '/worker.js')
            getReferences = getSchemaEagerReferences;
            // const pool = workerpool.pool(__dirname + '/myWorker.js');
            await workerPool
              .proxy()
              .then((worker: any) => {
                return worker.handleJzodElementToTsTypeMessage(entries[0]);
              })
              .then(function (result) {
                console.log("Result: " + result); // outputs 55
              })
              .catch(function (err) {
                console.error(err);
              })
              .then(function () {
                workerPool.terminate(); // terminate all workers when done
              });
            
            // const workerPool = new WorkerPool(typeScriptGeneration.poolsize, zodSchemaToTsTypeString, { workDataZodSchemaToTsTypeString: zodSchemaToTsTypeString });
            // console.log("jzodElementSchemaToZodTextAndTsTextInParallel created worker pool", entries, zodSchemaToTsTypeString);
            // const tasks = entries.map((entry) =>
            //   workerPool.run({
            //     key: entry[0],
            //     value: {
            //       jzodElement:entry[1],
            //       typename: typeScriptGeneration.typeName,
            //       exportPrefix: typeScriptGeneration.exportPrefix,
            //     },
            //   })
            // );
            // const results = await Promise.all(tasks);
            // console.log("jzodElementSchemaToZodTextAndTsTextInParallel context results", results);
            // workerPool.terminate();

            const result:ZodTextAndTsTypeText = {
              contextTsTypeText: {"contextTsTypeText not defined": "contextTsTypeText not defined"},
              // zodText: resolvedDefinition.zodText,
              zodText: "zodText not defined",
              tsTypeText: "tsTypeText not defined",
              contextZodText: {"contextZodText not defined": "contextZodText not defined"},
              objectShapeZodText: {"objectShapeZodText not defined": "objectShapeZodText not defined"},
            }
            resolve(result);
          } else {
            throw new Error("schemaReference is not supported in non-TypeScript generation mode");
          }
          break;
        }
        case "string":
        case "number":
        case "bigint":
        case "boolean":
        case "undefined":
        case "object":
        case "function":
        case "array":
        case "any":
        case "date":
        case "never":
        case "null":
        case "uuid":
        case "unknown":
        case "void":
        case "enum":
        case "lazy":
        case "literal":
        case "intersection":
        case "map":
        case "promise":
        case "record":
        case "set":
        case "tuple":
        case "union":
        default: {
          resolve(
            jzodElementSchemaToZodSchemaAndDescriptionWithCarryOn(
              element,
              carryOn,
              getSchemaEagerReferences,
              getLazyReferences,
              typeScriptGeneration
            )
          );
          break;
        }
      }
    } catch (error) {
      reject(error);
    }
  });
}

// ################################################################################################
export async function jzodToTsTypeStringAndZodTextInParallel(
  element: any, // to avoid circularity on JzodElement
  context: ZodSchemaAndDescriptionRecord = {},
  typeName: string,
  poolsize: number,
  exportPrefix: boolean,
): Promise<ZodTextAndTsTypeText> {
  const contextFunction = () => context;
  // const elementZodSchemaAndDescription: ZodTextAndZodSchema = await jzodElementSchemaToZodTextAndTsText(
  const elementZodSchemaAndDescription: ZodTextAndTsTypeText = await jzodElementSchemaToZodTextAndTsTextInParallel(
    element as any,
    undefined, // carryOn
    contextFunction,
    contextFunction,
    zodSchemaToTsTypeString,
    {
      typeScriptLazyReferenceConverter: (innerReference: ZodTypeAny & GetType, relativeReference: string | undefined) =>
        withGetType(innerReference, (ts: any) => {
          const actualTypeName = relativeReference
            ? relativeReference.replace(/^(.)(.*)$/, (a, b, c) => b.toUpperCase() + c)
            : "";
          return ts.factory.createTypeReferenceNode(
            ts.factory.createIdentifier(actualTypeName ?? "RELATIVEPATH_NOT_DEFINED"),
            undefined
          );
        }),
      returnTypeScript: true,
      poolsize,
      typeName,
      exportPrefix
    }
  );
  return elementZodSchemaAndDescription;
}

// ################################################################################################
// NOT USED FOR NOW
export function jzodToTsTypeStringAndZodText(
  element: any, // to avoid circularity on JzodElement
  context: ZodSchemaAndDescriptionRecord = {},
  typeName?: string,
// ): Promise<TsTypeStringAndZodText> {
): TsTypeStringAndZodText {
  const jzodToTsTypeAliasesAndZodTextStartTime = Date.now();
  console.log("@@@@@@@@@@@@@@@@@ jzodToTsTypeStringAndZodText start!");
  const elementZodSchemaAndDescription: ZodTextAndZodSchema = jzodElementToZodTextAndZodSchemaForTsGeneration(
    element,
    context,
  );

  console.log(
    "jzodToTsTypeStringAndZodText jzodElementToZodTextAndZodSchemaForTsGeneration duration",
    Date.now() - jzodToTsTypeAliasesAndZodTextStartTime, "ms"
  );

  const contextTsTypesStringStartTime = Date.now();

  const contextTsTypesStringObject = Object.fromEntries(
    Object.entries(elementZodSchemaAndDescription.contextZodSchema ?? {}).map((curr) => {
      const actualTypeName = curr[0]?curr[0].replace(/^(.)(.*)$/, (a, b, c) => b.toUpperCase() + c):"";
      const tsNode = zodToTs(curr[1], typeName).node;
      const typeAlias = createTypeAlias(tsNode, actualTypeName);
      const tsTypeString = printNode(typeAlias);
      return [curr[0], tsTypeString];
    })
  );
  
  console.log(
    "jzodToTsTypeStringAndZodText contextTsTypesString duration",
    Date.now() - contextTsTypesStringStartTime, "ms"
  );
  const tsTypeStringNodeStartTime = Date.now();
  const tsTypeStringNode = zodToTs(elementZodSchemaAndDescription.zodSchema, typeName).node;
  const tsTypeAlias = createTypeAlias(tsTypeStringNode, typeName ?? "");
  const tsTypeString = printNode(tsTypeAlias);
  console.log(
    "jzodToTsTypeStringAndZodText tsTypeStringNode duration",
    Date.now() - tsTypeStringNodeStartTime, "ms"
  );

  console.log("@@@@@@@@@@@@@@@@@ jzodToTsTypeStringAndZodText end in:", Date.now() - jzodToTsTypeAliasesAndZodTextStartTime, "ms");
  return {
    contextTsTypeStrings: contextTsTypesStringObject,
    contextZodText: elementZodSchemaAndDescription.contextZodText ?? {},
    mainZodText: elementZodSchemaAndDescription.zodText,
    mainTsTypeString: tsTypeString,
  }
  // return {
  //   contextTsTypeAliases: contextTsTypesStringObject,
  //   contextZodText: elementZodSchemaAndDescription.contextZodText ?? {},
  //   mainZodText: elementZodSchemaAndDescription.zodText,
  //   mainTsTypeAlias: tsTypeStringTypeAlias,
  // };
}

// ################################################################################################
export function zodSchemaToTsTypeString(
  zodSchema: ZodTypeAny,
  contextZodSchema: Record<string,ZodTypeAny> = {},
  typeName?: string,
): TsTypeString {
  const jzodToTsTypeAliasesAndZodTextStartTime = Date.now();
  console.log("@@@@@@@@@@@@@@@@@ zodSchemaToTsTypeStringAndZodText start!");

  console.log(
    "zodSchemaToTsTypeStringAndZodText jzodElementToZodTextAndZodSchemaForTsGeneration duration",
    Date.now() - jzodToTsTypeAliasesAndZodTextStartTime, "ms"
  );

  const contextTsTypesStringStartTime = Date.now();

  const contextTsTypesStringObject = Object.fromEntries(
    Object.entries(contextZodSchema ?? {}).map((curr) => {
      const actualTypeName = curr[0]?curr[0].replace(/^(.)(.*)$/, (a, b, c) => b.toUpperCase() + c):"";
      const tsNode = zodToTs(curr[1], typeName).node;
      const typeAlias = createTypeAlias(tsNode, actualTypeName);
      const tsTypeString = printNode(typeAlias);
      return [curr[0], tsTypeString];
    })
  );
  
  console.log(
    "zodSchemaToTsTypeStringAndZodText contextTsTypesString duration",
    Date.now() - contextTsTypesStringStartTime, "ms"
  );
  const tsTypeStringNodeStartTime = Date.now();
  const tsTypeStringNode = zodToTs(zodSchema, typeName).node;
  const tsTypeAlias = createTypeAlias(tsTypeStringNode, typeName ?? "");
  const tsTypeString = printNode(tsTypeAlias);
  console.log(
    "zodSchemaToTsTypeStringAndZodText tsTypeStringNode duration",
    Date.now() - tsTypeStringNodeStartTime, "ms"
  );

  console.log("@@@@@@@@@@@@@@@@@ zodSchemaToTsTypeStringAndZodText end in:", Date.now() - jzodToTsTypeAliasesAndZodTextStartTime, "ms");
  return {
    contextTsTypeStrings: contextTsTypesStringObject,
    // contextZodText: elementZodSchemaAndDescription.contextZodText ?? {},
    // mainZodText: elementZodSchemaAndDescription.zodText,
    mainTsTypeString: tsTypeString,
  }
}

// ################################################################################################
export function jzodToTsTypeAliasesAndZodText(
  element: any, // to avoid circularity on JzodElement
  context: ZodSchemaAndDescriptionRecord = {},
  typeName?: string,
// ): Promise<TsTypeAliasesAndZodText> {
): TsTypeAliasesAndZodText {
  const jzodToTsTypeAliasesAndZodTextStartTime = Date.now();
  console.log("@@@@@@@@@@@@@@@@@ jzodToTsTypeAliasesAndZodText start!");
  const elementZodSchemaAndDescription: ZodTextAndZodSchema = jzodElementToZodTextAndZodSchemaForTsGeneration(
    element,
    context,
  );

  console.log(
    "jzodToTsTypeAliasesAndZodText jzodElementToZodTextAndZodSchemaForTsGeneration duration",
    Date.now() - jzodToTsTypeAliasesAndZodTextStartTime, "ms"
  );

  const contextTsTypesStringStartTime = Date.now();

  const contextTsTypesString = Object.fromEntries(
    Object.entries(elementZodSchemaAndDescription.contextZodSchema ?? {}).map((curr) => {
      const actualTypeName = curr[0]?curr[0].replace(/^(.)(.*)$/, (a, b, c) => b.toUpperCase() + c):"";
      const tsNode = zodToTs(curr[1], typeName).node;
      const typeAlias = createTypeAlias(tsNode, actualTypeName);
      return [curr[0], typeAlias];
    })
  );
  
  console.log(
    "jzodToTsTypeAliasesAndZodText contextTsTypesString duration",
    Date.now() - contextTsTypesStringStartTime, "ms"
  );
  const tsTypeStringNodeStartTime = Date.now();
  const tsTypeStringNode = zodToTs(elementZodSchemaAndDescription.zodSchema, typeName).node;
  const tsTypeStringTypeAlias = createTypeAlias(tsTypeStringNode, typeName ?? "");
  console.log(
    "jzodToTsTypeAliasesAndZodText tsTypeStringNode duration",
    Date.now() - tsTypeStringNodeStartTime, "ms"
  );

  console.log("@@@@@@@@@@@@@@@@@ jzodToTsTypeAliasesAndZodText end in:", Date.now() - jzodToTsTypeAliasesAndZodTextStartTime, "ms");
  return {
    contextTsTypeAliases: contextTsTypesString,
    contextZodText: elementZodSchemaAndDescription.contextZodText ?? {},
    mainZodText: elementZodSchemaAndDescription.zodText,
    mainTsTypeAlias: tsTypeStringTypeAlias,
  };
}


// ################################################################################################
// export async function jzodToTsCode (
export function jzodToTsCode (
  jzodElement: any, // to avoid circulatity on JzodElement
  context: ZodSchemaAndDescriptionRecord = {},
  exportPrefix: boolean = true,
  typeName?: string,
  typeAnotationForSchema: string[] = [],
): string {
// ): Promise<string> {
  // console.log(
  //   "################################### jzodToTsCode typeName",
  //   typeName,
  //   "jzodElement",
  //   JSON.stringify(jzodElement, null, 2)
  // );
  
  const schemaName = typeName?typeName.replace(/^(.)(.*)$/, (a, b, c) => b.toLowerCase() + c):"";
  const actualTypeName = typeName?typeName.replace(/^(.)(.*)$/, (a, b, c) => b.toUpperCase() + c):"";

  // console.log("jzodToTsCode typeAnotationForSchema", typeAnotationForSchema);

  const header = `import { ZodType, ZodTypeAny, z } from "zod";`;

  const typeAliasesAndZodText = jzodToTsTypeAliasesAndZodText(
    jzodElement,
    context,
    actualTypeName,
  );

  const bodyJsCode = typeAnotationForSchema.includes(schemaName??"")
    ? `export const ${schemaName}: z.ZodType<${actualTypeName}> = ${typeAliasesAndZodText.mainZodText};`
    : `export const ${schemaName} = ${typeAliasesAndZodText.mainZodText};`;

  const contextTsTypesString = printTsTypeAliases(typeAliasesAndZodText.contextTsTypeAliases, exportPrefix);
  // console.log("jzodToTsCode zod text for converted jzodElement",typeAliasesAndZodText.contextZodText);

  const contextJsCode = typeAliasesAndZodText.contextZodText
    ? Object.entries(typeAliasesAndZodText.contextZodText).reduce((acc, curr) => {
      const contextTypeName = curr[0]?curr[0].replace(/^(.)(.*)$/, (a, b, c) => b.toUpperCase() + c):"";
      return typeAnotationForSchema.includes(curr[0])?
        `${acc}
export const ${curr[0]}: z.ZodType<${contextTypeName}> = ${curr[1]};`
      :
        `${acc}
export const ${curr[0]} = ${curr[1]};`
      ;
    }, "")
    : ""
  ;

  const tsTypesString = (exportPrefix?"export ":"") + printNode(typeAliasesAndZodText.mainTsTypeAlias);
  // console.log("getTsCodeCorrespondingToZodSchemaAndDescription tsTypeString",tsTypesString);

  return `${header}
${contextTsTypesString}
${tsTypesString}
${contextJsCode}
${bodyJsCode}
`;
}

// ################################################################################################
export async function jzodToTsCodeInParallel (
  jzodElement: any, // to avoid circulatity on JzodElement
  context: ZodSchemaAndDescriptionRecord = {},
  exportPrefix: boolean = true,
  typeName?: string,
  typeAnotationForSchema: string[] = [],
  poolSize: number = 4
): Promise<string> {
  // console.log(
  //   "################################### jzodToTsCode typeName",
  //   typeName,
  //   "jzodElement",
  //   JSON.stringify(jzodElement, null, 2)
  // );
  
  const schemaName = typeName?typeName.replace(/^(.)(.*)$/, (a, b, c) => b.toLowerCase() + c):"";
  const actualTypeName = typeName?typeName.replace(/^(.)(.*)$/, (a, b, c) => b.toUpperCase() + c):"";

  // console.log("jzodToTsCode typeAnotationForSchema", typeAnotationForSchema);

  const header = `import { ZodType, ZodTypeAny, z } from "zod";`;

  const tsTypeStringsAndZodText = await jzodToTsTypeStringAndZodTextInParallel(
    jzodElement,
    context,
    actualTypeName,
    poolSize,
    exportPrefix
  );

  console.log("jzod-ts jzodToTsCodeInParallel found tsTypeStringsAndZodText",tsTypeStringsAndZodText);
//   const bodyJsCode = typeAnotationForSchema.includes(schemaName??"")
//     ? `export const ${schemaName}: z.ZodType<${actualTypeName}> = ${tsTypeStringsAndZodText.zodText};`
//     : `export const ${schemaName} = ${tsTypeStringsAndZodText.zodText};`;
//     // ? `export const ${schemaName}: z.ZodType<${actualTypeName}> = ${typeAliasesAndZodText.mainZodText};`
//     // : `export const ${schemaName} = ${typeAliasesAndZodText.mainZodText};`;

//   const contextTsTypesString = printTsTypeAliases(tsTypeStringsAndZodText.contextTsTypeAliases, exportPrefix);
//   // console.log("jzodToTsCode zod text for converted jzodElement",typeAliasesAndZodText.contextZodText);

//   const contextJsCode = tsTypeStringsAndZodText.contextZodText
//     ? Object.entries(tsTypeStringsAndZodText.contextZodText).reduce((acc, curr) => {
//       const contextTypeName = curr[0]?curr[0].replace(/^(.)(.*)$/, (a, b, c) => b.toUpperCase() + c):"";
//       return typeAnotationForSchema.includes(curr[0])?
//         `${acc}
// export const ${curr[0]}: z.ZodType<${contextTypeName}> = ${curr[1]};`
//       :
//         `${acc}
// export const ${curr[0]} = ${curr[1]};`
//       ;
//     }, "")
//     : ""
//   ;

//   const tsTypesString = (exportPrefix?"export ":"") + printNode(tsTypeStringsAndZodText.mainTsTypeAlias);
  // console.log("getTsCodeCorrespondingToZodSchemaAndDescription tsTypeString",tsTypesString);

  return `waaaa ${header} waaaaa
`;
//   return `${header}
// ${contextTsTypesString}
// ${tsTypesString}
// ${contextJsCode}
// ${bodyJsCode}
// `;
}
