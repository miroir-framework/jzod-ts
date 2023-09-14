import ts from "typescript";
import { ZodLazy } from "zod";
import { createTypeAlias, printNode, withGetType, zodToTs } from "zod-to-ts";

import { jzodElementSchemaToZodSchemaAndDescription } from "@miroir-framework/jzod";

import { JzodElement } from "./JzodTsInterface";

import { printTsTypeAliases } from "./tools";
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
export function jzodToTsTypeAliasesAndZodText(
  element: JzodElement,
  typeName?: string,
): TsTypeAliasesAndZodText
{
  const elementZodSchemaAndDescription = jzodElementSchemaToZodSchemaAndDescription(
    element,
    () => ({}),
    () => ({}),
    (innerReference: ZodLazy<any>, relativeReference: string | undefined) =>
      withGetType(innerReference, (ts) => {
        const actualTypeName = relativeReference?relativeReference.replace(/^(.)(.*)$/, (a, b, c) => b.toUpperCase() + c):"";
        return ts.factory.createTypeReferenceNode(

          ts.factory.createIdentifier(actualTypeName ? actualTypeName : "RELATIVEPATH_NOT_DEFINED")
        );
      }
    )
  );

  const contextTsTypesString = Object.fromEntries(
    Object.entries(elementZodSchemaAndDescription.contextZodSchema ?? {}).map((curr) => {
      const actualTypeName = curr[0]?curr[0].replace(/^(.)(.*)$/, (a, b, c) => b.toUpperCase() + c):"";
      // console.log("getTsCodeCorrespondingToZodSchemaAndDescription ", JSON.stringify(curr));
      const tsNode = zodToTs(curr[1], typeName).node;
      const typeAlias = createTypeAlias(tsNode, actualTypeName);
      return [curr[0], typeAlias];
    })
  );

  const tsTypeStringNode = zodToTs(elementZodSchemaAndDescription.zodSchema, typeName).node;
  const tsTypeStringTypeAlias = createTypeAlias(tsTypeStringNode, typeName??"");

  return {
    contextTsTypeAliases: contextTsTypesString,
    contextZodText: elementZodSchemaAndDescription.contextZodText??{},
    mainZodText: elementZodSchemaAndDescription.zodText,
    mainTsTypeAlias: tsTypeStringTypeAlias,
  };
}


// ################################################################################################
export function jzodToTsCode (
  jzodElement: JzodElement,
  exportPrefix: boolean = true,
  typeName?: string,
): string {
  // console.log(
  //   "getTsCodeCorrespondingToZodSchemaAndDescription jzodSchemaZodSchemaAndDescription.contextZodSchema",
  //   "jzodElement",
  //   JSON.stringify(jzodElement)
  // );
  
  const schemaName = typeName?typeName.replace(/^(.)(.*)$/, (a, b, c) => b.toLowerCase() + c):"";
  const actualTypeName = typeName?typeName.replace(/^(.)(.*)$/, (a, b, c) => b.toUpperCase() + c):"";
  // console.log("getTsCodeCorrespondingToZodSchemaAndDescription convertedJsonZodSchema", bodyJsCode);

  const header = `import { ZodType, ZodTypeAny, z } from "zod";`;

  const typeAliasesAndZodText = jzodToTsTypeAliasesAndZodText(jzodElement, actualTypeName);

  const bodyJsCode = `export const ${schemaName}: z.ZodType<${actualTypeName}> = ${typeAliasesAndZodText.mainZodText};`;

  const contextTsTypesString = printTsTypeAliases(typeAliasesAndZodText.contextTsTypeAliases, exportPrefix);
  // console.log("getTsCodeCorrespondingToZodSchemaAndDescription contextTsTypesString",contextTsTypesString);

  const contextJsCode = typeAliasesAndZodText.contextZodText
    ? Object.entries(typeAliasesAndZodText.contextZodText).reduce((acc, curr) => {
        const contextTypeName = curr[0]?curr[0].replace(/^(.)(.*)$/, (a, b, c) => b.toUpperCase() + c):"";
        return `${acc}
export const ${curr[0]}:z.ZodType<${contextTypeName}> = ${curr[1]};`;
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
