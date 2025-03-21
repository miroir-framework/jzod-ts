import ts from "typescript";
import { z, ZodTypeAny } from "zod";
import { GetType, createTypeAlias, printNode, withGetType, zodToTs } from "zod-to-ts";
import { pool } from "workerpool";

import {
  jzodElementSchemaToZodSchemaAndDescription,
  jzodElementSchemaToZodSchemaAndDescriptionWithCarryOn,
  TsTypeString,
  TypeScriptGenerationParams,
  ZodSchemaAndDescriptionRecord,
  ZodSchemaToTsTypeStringFunction,
  ZodTextAndTsTypeText,
  ZodTextAndZodSchema,
} from "@miroir-framework/jzod";

import { JzodElement, JzodReference } from "./generated_jzodBootstrapElementSchema.js";

// ################################################################################################
export type TsTypeAliases =  {
  [k: string]: ts.TypeAliasDeclaration;
}

// ################################################################################################
export interface TsTypeAliasesAndZodText {
  contextTsTypeAliases: { [k: string]: ts.TypeAliasDeclaration },
  contextZodText: { [k: string]: string },
  mainTsTypeAlias: ts.TypeAliasDeclaration,
  mainZodText: string 
}

// ################################################################################################
export interface ZodText {
  contextZodText: { [k: string]: string },
  mainZodText: string 
}

export interface TsTypeStringAndZodText extends ZodText, TsTypeString {}

// ################################################################################################
export function printTsTypeAlias(
  typeAlias: ts.TypeAliasDeclaration,
  exportPrefix: boolean = true,
): string {
  return (exportPrefix?"export ":"")+printNode(typeAlias)
}

// ################################################################################################
export function printTsTypeAliases(
  typeAliases: TsTypeAliases,
  exportPrefix: boolean = true,
): string {
  const result = Object.entries(typeAliases).reduce((acc, curr) => {
    // console.log("printTypeAliases ", JSON.stringify(curr));
    return `${acc}
${printTsTypeAlias(curr[1],exportPrefix)}`;
  }, "");
  return result;
}

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

let globalReferences: ZodSchemaAndDescriptionRecord | undefined = undefined;

export function getGlobalReferences () { return globalReferences };

// ######################################################################################################
export async function jzodElementSchemaToZodTextAndTsTextInParallel(
  // element: JzodElement,
  typeName: string,
  element: any,
  carryOn: ZodTextAndZodSchema | undefined,
  getSchemaEagerReferences: () => ZodSchemaAndDescriptionRecord = () => ({}),
  getLazyReferences: () => ZodSchemaAndDescriptionRecord = () => ({}),
  exendedJzodSchemaContext: Record<string, JzodElement>,
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
        // if there is a carryOn and current element can not have a carryOn, then return the union of the current element and the carryOn
        const plainZodSchema = jzodElementToZodTextAndZodSchemaForTsGeneration(
          element,
          getSchemaEagerReferences(),
        );
        const zodSchema = z.union([plainZodSchema.zodSchema, carryOn.zodSchema]);
        const zodText = `z.union([${plainZodSchema.zodText}, ${carryOn.zodText}])`;
        
        if (!typeScriptGeneration?.typeName) {
          throw new Error("typeName must be defined in typeScriptGeneration when generating TypeScript: " + JSON.stringify(typeScriptGeneration));
        }
        const context = Object.fromEntries(Object.entries(getSchemaEagerReferences()).map(e => [e[0], (e[1] as any).zodSchema]));
        const tsTypeText = zodSchemaToTsTypeString(zodSchema, context, typeScriptGeneration.typeName);
        const result:ZodTextAndTsTypeText = {
          contextZodText: undefined,
          contextTsTypeText: tsTypeText.contextTsTypeStrings,
          tsTypeText: tsTypeText.mainTsTypeString,
          zodText,
        };
        resolve(result);
      }
      switch (element.type) {
        case "schemaReference": {
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
            const entries:[string, JzodElement][] = Object.entries((element as JzodReference).context ?? {});
            // console.log("jzodElementSchemaToZodTextAndTsTextInParallel using zodSchemaToTsTypeString in worker pool:", zodSchemaToTsTypeString.toString());
            const workerFileName = __dirname + '/src/worker.js'
            console.log("jzodElementSchemaToZodTextAndTsTextInParallel creating worker pool", workerFileName);
            const workerPool = pool(workerFileName)
            const segments = typeScriptGeneration.poolsize;
            const chunkSize = Math.ceil(entries.length / segments);
            const slices = Array.from({ length: segments }, (_, i) =>
              entries.slice(i * chunkSize, (i + 1) * chunkSize)
            );

            let workerPoolResults: [string, TsTypeStringAndZodText][][] = [];
            const poolCalls = await Promise.all(
              slices.map((slice) =>
              workerPool
                .proxy()
                .then((worker: any) =>
                  worker.handleJzodElementToTsTypeMessage(slice, exendedJzodSchemaContext)
                )
              )
            )
            .then((results) => {
              workerPoolResults = results;
            })
            .catch((err) => {
            console.error(err);
            })
            .finally(() => {
            workerPool.terminate();
            });
            const flatResults: [string, TsTypeStringAndZodText][] = workerPoolResults.flat();
            const result: ZodTextAndTsTypeText = {
              contextTsTypeText: flatResults.reduce(
                (acc, curr: [string, TsTypeStringAndZodText]) => ({
                  ...acc,
                  [curr[0]]: curr[1].mainTsTypeString,
                }),
                {}
              ),
              zodText: element.definition.relativePath,
              tsTypeText: element.definition.relativePath,
              contextZodText: flatResults.reduce(
                (acc, curr: [string, TsTypeStringAndZodText]) => ({
                  ...acc,
                  [curr[0]]: curr[1].mainZodText,
                }),
                {}
              ),
              objectShapeZodText: {
                "objectShapeZodText not defined": "objectShapeZodText not defined",
              },
            };
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
          const preResult = jzodToTsTypeStringAndZodText(
            element,
            getSchemaEagerReferences(),
            typeName
          );
          const result: ZodTextAndTsTypeText = {
            contextTsTypeText: preResult.contextTsTypeStrings,
            contextZodText: preResult.contextZodText,
            zodText: preResult.mainZodText,
            tsTypeText: preResult.mainTsTypeString,
          };
          resolve(result);
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
  exendedJzodSchemaContext: Record<string, JzodElement>,
  typeName: string,
  poolsize: number,
  exportPrefix: boolean,
): Promise<ZodTextAndTsTypeText> {
  const contextFunction = () => context;
  const elementZodSchemaAndDescription: ZodTextAndTsTypeText = await jzodElementSchemaToZodTextAndTsTextInParallel(
    typeName,
    element as any,
    undefined, // carryOn
    contextFunction,
    contextFunction,
    exendedJzodSchemaContext,
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
): TsTypeStringAndZodText {
  // console.log("jzodToTsTypeStringAndZodText running for", typeName);
  const elementZodSchemaAndDescription: ZodTextAndZodSchema = jzodElementToZodTextAndZodSchemaForTsGeneration(
    element,
    context,
  );
  const contextTsTypesStringStartTime = Date.now();

  const contextTsTypesStringObject = Object.fromEntries(
    Object.entries(elementZodSchemaAndDescription.contextZodSchema ?? {}).map((curr) => {
      const actualTypeName = curr[0]?curr[0].replace(/^(.)(.*)$/, (a, b, c) => b.toUpperCase() + c):"";
      console.log("jzodToTsTypeStringAndZodText producing TS type for contextElement", curr[0], "actualTypeName", actualTypeName);
      const tsNode = zodToTs(curr[1], typeName).node;
      const typeAlias = createTypeAlias(tsNode, actualTypeName);
      const tsTypeString = printNode(typeAlias);
      return [curr[0], tsTypeString];
    })
  );
  
  const tsTypeStringNodeStartTime = Date.now();
  const actualTypeName = typeName?typeName.replace(/^(.)(.*)$/, (a, b, c) => b.toUpperCase() + c):"";
  const tsTypeStringNode = zodToTs(elementZodSchemaAndDescription.zodSchema, typeName).node;
  const tsTypeAlias = createTypeAlias(tsTypeStringNode, actualTypeName);
  const tsTypeString = printNode(tsTypeAlias);

  return {
    contextTsTypeStrings: contextTsTypesStringObject,
    contextZodText: elementZodSchemaAndDescription.contextZodText ?? {},
    mainZodText: elementZodSchemaAndDescription.zodText,
    mainTsTypeString: tsTypeString,
  }
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
      console.log("zodSchemaToTsTypeStringAndZodText converting context entry", curr[0]);
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
  const actualTypeName = typeName?typeName.replace(/^(.)(.*)$/, (a, b, c) => b.toUpperCase() + c):"";
  const tsTypeStringNode = zodToTs(zodSchema, typeName).node;
  const tsTypeAlias = createTypeAlias(tsTypeStringNode, actualTypeName);
  const tsTypeString = printNode(tsTypeAlias);
  console.log(
    "zodSchemaToTsTypeStringAndZodText tsTypeStringNode duration",
    Date.now() - tsTypeStringNodeStartTime, "ms"
  );

  console.log("@@@@@@@@@@@@@@@@@ zodSchemaToTsTypeStringAndZodText end in:", Date.now() - jzodToTsTypeAliasesAndZodTextStartTime, "ms");
  return {
    contextTsTypeStrings: contextTsTypesStringObject,
    mainTsTypeString: tsTypeString,
  }
}

// ################################################################################################
export function jzodToTsTypeAliasesAndZodText(
  element: any, // to avoid circularity on JzodElement
  context: ZodSchemaAndDescriptionRecord = {},
  typeName?: string,
): TsTypeAliasesAndZodText {
  const jzodToTsTypeAliasesAndZodTextStartTime = Date.now();
  console.log("@@@@@@@@@@@@@@@@@ jzodToTsTypeAliasesAndZodText start!", Object.keys(context).length);
  console.log("jzodToTsTypeAliasesAndZodText context:", JSON.stringify(Object.keys(context)));
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
      console.log("jzodToTsTypeAliasesAndZodText converting elementZodSchemaAndDescription entry", curr[0]);
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
  includeHeader: boolean = true,
  includeBody: boolean = true,
  importContextFilePath?: string | undefined,
): string {
  // console.log(
  //   "################################### jzodToTsCode typeName",
  //   typeName,
  //   "jzodElement",
  //   JSON.stringify(jzodElement, null, 2)
  // );
  
  const schemaName = typeName?typeName.replace(/^(.)(.*)$/, (a, b, c) => b.toLowerCase() + c):"";
  const actualTypeName = typeName?typeName.replace(/^(.)(.*)$/, (a, b, c) => b.toUpperCase() + c):"";

  // console.log("jzodToTsCode typeAnotationForSchema", typeAnotationForSchema);

  const header = includeHeader?`import { ZodType, ZodTypeAny, z } from "zod";`:"";

  const imports = importContextFilePath?
    "import { \n" + 
    [
      ...Object.keys(context),
      ...Object.keys(context).map((e) => e.replace(/^(.)(.*)$/, (a, b, c) => b.toUpperCase() + c)),
    ]
    .join(",\n") +
    "\n } from \"" +
    importContextFilePath + "\";"
    :"";

  const typeAliasesAndZodText = jzodToTsTypeAliasesAndZodText(
    jzodElement,
    context,
    actualTypeName,
  );

  const bodyJsCode = includeBody?typeAnotationForSchema.includes(schemaName??"")
    ? `export const ${schemaName}: z.ZodType<${actualTypeName}> = ${typeAliasesAndZodText.mainZodText};`
    : `export const ${schemaName} = ${typeAliasesAndZodText.mainZodText};`
    :"";

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
${imports}
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
  exendedJzodSchemaContext: Record<string, JzodElement>,
  exportPrefix: boolean = true,
  typeName?: string,
  typeAnotationForSchema: string[] = [],
  poolSize: number = 4,
  extendedTsTypes?: string

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
    exendedJzodSchemaContext,
    actualTypeName,
    poolSize,
    exportPrefix
  );

  // console.log("jzod-ts jzodToTsCodeInParallel found tsTypeStringsAndZodText",tsTypeStringsAndZodText);
  const bodyJsCode = typeAnotationForSchema.includes(schemaName??"")
    ? `export const ${schemaName}: z.ZodType<${actualTypeName}> = ${tsTypeStringsAndZodText.zodText};`
    : `export const ${schemaName} = ${tsTypeStringsAndZodText.zodText};`;

  const contextTsTypesString = tsTypeStringsAndZodText.contextTsTypeText
    ? Object.entries(tsTypeStringsAndZodText.contextTsTypeText).reduce((acc, curr) => {
      const contextTypeName = curr[0];
      return exportPrefix?`${acc}
export ${curr[1]};`
: `${acc}
${curr[1]};`
      ;
    }, "")
    : ""
  ;
  // console.log("jzodToTsCode zod text for converted jzodElement",typeAliasesAndZodText.contextZodText);

  const contextJsCode = tsTypeStringsAndZodText.contextZodText
    ? Object.entries(tsTypeStringsAndZodText.contextZodText).reduce((acc, curr) => {
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

  // console.log("getTsCodeCorrespondingToZodSchemaAndDescription tsTypeString",tsTypesString);

  return `${header}
${extendedTsTypes}
${contextTsTypesString}
${contextJsCode}
${bodyJsCode}
`;
}
