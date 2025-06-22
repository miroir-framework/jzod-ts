import ts from "typescript";
import { ZodTypeAny } from "zod";
import { createTypeAlias, printNode, zodToTs } from "zod-to-ts";

import {
  jzodToZodTextAndZodSchema,
  ZodTextAndZodSchema,
  ZodTextAndZodSchemaRecord,
} from "@miroir-framework/jzod";


// ################################################################################################
export type TsTypeAliases =  {
  [k: string]: ts.TypeAliasDeclaration;
}

// ################################################################################################
export interface TsTypeAliasesAndZodText {
  contextTsTypeAliases: { [k: string]: ts.TypeAliasDeclaration },
  contextZodText: { [k: string]: string },
  mainTsTypeAlias: ts.TypeAliasDeclaration,
  zodText: string 
}

// ################################################################################################
// ##############################################################################################################
export interface ZodText {
  contextZodText: { [k: string]: string },
  zodText: string 
}

export interface TsTypeText {
  contextTsTypeText: { [k: string]: string },
  tsTypeText: string,
}

export interface ZodTextAndTsTypeText extends ZodText, TsTypeText {
};


// export interface ZodTextAndTsTypeText extends ZodText, TsTypeText {}

export type ZodSchemaToTsTypeStringFunction = (
  zodSchema: ZodTypeAny,
  contextZodSchema: Record<string,ZodTypeAny>,
  typeName?: string,
) => TsTypeText;



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
export function jzodToZodTextAndZodSchemaForTsGeneration(
  element: any, // to avoid circularity on JzodElement
  context: ZodTextAndZodSchemaRecord = {},
): ZodTextAndZodSchema {
  const contextFunction = () => context;
  const elementZodSchemaAndDescription: ZodTextAndZodSchema = jzodToZodTextAndZodSchema(
    element as any,
    contextFunction,
    contextFunction,
    true, // typeScriptGeneration
  );
  return elementZodSchemaAndDescription;
}


// ################################################################################################
export function jzodToZodTextAndTsTypeText(
  element: any, // to avoid circularity on JzodElement
  context: ZodTextAndZodSchemaRecord = {},
  typeName?: string,
): ZodTextAndTsTypeText {
  // console.log("jzodToZodTextAndTsTypeText running for", typeName);
  const elementZodSchemaAndDescription: ZodTextAndZodSchema = jzodToZodTextAndZodSchemaForTsGeneration(
    element,
    context,
  );
  // console.log("jzodToZodTextAndTsTypeText found elementZodSchemaAndDescription.contextZodText",JSON.stringify(elementZodSchemaAndDescription.contextZodText,null,2));
  const contextTsTypesStringObject = Object.fromEntries(
    Object.entries(elementZodSchemaAndDescription.contextZodSchema ?? {}).map((curr) => {
      const actualTypeName = curr[0]?curr[0].replace(/^(.)(.*)$/, (a, b, c) => b.toUpperCase() + c):"";
      const tsNode = zodToTs(curr[1], typeName).node;
      const typeAlias = createTypeAlias(tsNode, actualTypeName);
      const tsTypeString = printNode(typeAlias);
      // console.log("jzodToZodTextAndTsTypeText producing TS type for contextElement", curr[0], tsTypeString);
      // console.log("jzodToZodTextAndTsTypeText producing TS type for contextElement", curr[0]);
      return [curr[0], tsTypeString];
    })
  );
  
  // const tsTypeStringNodeStartTime = Date.now();
  const actualTypeName = typeName?typeName.replace(/^(.)(.*)$/, (a, b, c) => b.toUpperCase() + c):"";
  const tsTypeStringNode = zodToTs(elementZodSchemaAndDescription.zodSchema, typeName).node;
  const tsTypeAlias = createTypeAlias(tsTypeStringNode, actualTypeName);
  const tsTypeString = printNode(tsTypeAlias);

  return {
    contextTsTypeText: contextTsTypesStringObject,
    contextZodText: elementZodSchemaAndDescription.contextZodText ?? {},
    zodText: elementZodSchemaAndDescription.zodText,
    tsTypeText: tsTypeString,
  }
}


// ################################################################################################
export function jzodToZodTextAndTsTypeAliases(
  element: any, // to avoid circularity on JzodElement
  context: ZodTextAndZodSchemaRecord = {},
  typeName?: string,
): TsTypeAliasesAndZodText {
  const jzodToTsTypeAliasesAndZodTextStartTime = Date.now();
  console.log("@@@@@@@@@@@@@@@@@ jzodToZodTextAndTsTypeAliases start!", Object.keys(context).length);
  console.log("jzodToZodTextAndTsTypeAliases context:", JSON.stringify(Object.keys(context)));
  const elementZodSchemaAndDescription: ZodTextAndZodSchema = jzodToZodTextAndZodSchemaForTsGeneration(
    element,
    context,
  );

  console.log(
    "jzodToZodTextAndTsTypeAliases jzodToZodTextAndZodSchemaForTsGeneration duration",
    Date.now() - jzodToTsTypeAliasesAndZodTextStartTime, "ms"
  );

  const contextTsTypesStringStartTime = Date.now();

  const contextTsTypesString = Object.fromEntries(
    Object.entries(elementZodSchemaAndDescription.contextZodSchema ?? {}).map((curr) => {
      console.log("jzodToZodTextAndTsTypeAliases converting elementZodSchemaAndDescription entry", curr[0]);
      const actualTypeName = curr[0]?curr[0].replace(/^(.)(.*)$/, (a, b, c) => b.toUpperCase() + c):"";
      const tsNode = zodToTs(curr[1], typeName).node;
      const typeAlias = createTypeAlias(tsNode, actualTypeName);
      return [curr[0], typeAlias];
    })
  );
  
  console.log(
    "jzodToZodTextAndTsTypeAliases contextTsTypesString duration",
    Date.now() - contextTsTypesStringStartTime, "ms"
  );
  const tsTypeStringNodeStartTime = Date.now();
  const tsTypeStringNode = zodToTs(elementZodSchemaAndDescription.zodSchema, typeName).node;
  const tsTypeStringTypeAlias = createTypeAlias(tsTypeStringNode, typeName ?? "");
  console.log(
    "jzodToZodTextAndTsTypeAliases tsTypeStringNode duration",
    Date.now() - tsTypeStringNodeStartTime, "ms"
  );

  console.log("@@@@@@@@@@@@@@@@@ jzodToZodTextAndTsTypeAliases end in:", Date.now() - jzodToTsTypeAliasesAndZodTextStartTime, "ms");
  return {
    contextTsTypeAliases: contextTsTypesString,
    contextZodText: elementZodSchemaAndDescription.contextZodText ?? {},
    zodText: elementZodSchemaAndDescription.zodText,
    mainTsTypeAlias: tsTypeStringTypeAlias,
  };
}


// ################################################################################################
/**
 * 
 * @param typeName the name given to the resulting TS type definition
 * @param jzodElement the JzodElement to convert to TS code
 * @param context the context of the JzodElement, to be used for recursive types, for example.
 * @param exportPrefix true if the resulting TS code should be prefixed with "export "
 * @param typeAnotationForSchema adds a type annotation for the resulting TS type definition, in the form of ZodType<typeName>. This is useful for the linter, to precisely define the type, instead of relying on potentially coarser type inference mechanism. Recursive types cannot use this feature.
 * @param extendedTsTypesText a string containing additional TS types to be included in the resulting TS code, for example, types that are used in the context of the JzodElement, but are not defined in the JzodElement itself.
 * @returns a string containing the resulting TS code
 */
export function jzodToTsCode(
  typeName: string,
  jzodElement: any, // to avoid circulatity on JzodElement
  context: ZodTextAndZodSchemaRecord = {},
  exportPrefix: boolean = true,
  headerForZodImports: boolean = true,
  typeAnotationForSchema: string[] = [],
  extendedTsTypesText: string = "",
): string {
  // console.log(
  //   "################################### jzodToTsCode typeName",
  //   typeName,
  //   "jzodElement",
  //   JSON.stringify(jzodElement, null, 2)
  // );

  const schemaName = typeName
    ? typeName.replace(/^(.)(.*)$/, (a, b, c) => b.toLowerCase() + c)
    : "";
  const actualTypeName = typeName
    ? typeName.replace(/^(.)(.*)$/, (a, b, c) => b.toUpperCase() + c)
    : "";

  // console.log("jzodToTsCode typeAnotationForSchema", typeAnotationForSchema);

  const header = headerForZodImports?`import { ZodType, ZodTypeAny, z } from "zod";`:"";

  const tsTypeStringsAndZodText = jzodToZodTextAndTsTypeText(jzodElement, context, actualTypeName);

  // console.log("jzod-ts jzodToTsCode found tsTypeStringsAndZodText",JSON.stringify(tsTypeStringsAndZodText,null,2));

  const contextTsTypesString = tsTypeStringsAndZodText.contextTsTypeText
    ? Object.entries(tsTypeStringsAndZodText.contextTsTypeText).reduce((acc, curr) => {
        return exportPrefix
          ? `${acc}
export ${curr[1]}`
          : `${acc}
${curr[1]}`;
      }, "")
    : "";
  // console.log("jzodToTsCode context TS type string",contextTsTypesString);

  const contextJsCode = tsTypeStringsAndZodText.contextZodText
    ? Object.entries(tsTypeStringsAndZodText.contextZodText).reduce((acc, curr) => {
        const contextTypeName = curr[0]
          ? curr[0].replace(/^(.)(.*)$/, (a, b, c) => b.toUpperCase() + c)
          : "";
        return typeAnotationForSchema.includes(curr[0])
          ? `${acc}
export const ${curr[0]}: z.ZodType<${contextTypeName}> = ${curr[1]};`
          : `${acc}
export const ${curr[0]} = ${curr[1]};`;
      }, "")
    : "";
  // console.log("jzodToTsCode context JS code",contextJsCode);

  const bodyTsCode = (exportPrefix ? "export " : "") + tsTypeStringsAndZodText.tsTypeText;

  const bodyJsCode = typeAnotationForSchema.includes(schemaName ?? "")
    ? `export const ${schemaName}: z.ZodType<${actualTypeName}> = ${tsTypeStringsAndZodText.zodText};`
    : `export const ${schemaName} = ${tsTypeStringsAndZodText.zodText};`;

  // console.log("getTsCodeCorrespondingToZodSchemaAndDescription tsTypeString",tsTypesString);

  return `${header}
${extendedTsTypesText ?? ""}
${contextTsTypesString}
${bodyTsCode}
${contextJsCode}
${bodyJsCode}
`;
}
