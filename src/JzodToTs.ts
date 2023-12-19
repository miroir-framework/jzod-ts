import ts from "typescript";
import { ZodTypeAny } from "zod";
import { GetType, createTypeAlias, printNode, withGetType, zodToTs } from "zod-to-ts";

import { jzodElementSchemaToZodSchemaAndDescription } from "@miroir-framework/jzod";

import { JzodElement } from "./generated_jzodBootstrapElementSchema";

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
    (innerReference: ZodTypeAny & GetType, relativeReference: string | undefined) =>
      withGetType(innerReference, (ts:any) => {
        const actualTypeName = relativeReference?relativeReference.replace(/^(.)(.*)$/, (a, b, c) => b.toUpperCase() + c):"";
        return ts.factory.createTypeReferenceNode(
          ts.factory.createIdentifier(actualTypeName ?? "RELATIVEPATH_NOT_DEFINED"),
          undefined
        );
      }
    ) 
  );

  const contextTsTypesString = Object.fromEntries(
    Object.entries(elementZodSchemaAndDescription.contextZodSchema ?? {}).map((curr) => {
      const actualTypeName = curr[0]?curr[0].replace(/^(.)(.*)$/, (a, b, c) => b.toUpperCase() + c):"";
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
  // typeSchema: boolean = false,
  typeAnotationForSchema: string[] = [],
): string {
  // console.log(
  //   "################################### jzodToTsCode ",
  //   "jzodElement",
  //   JSON.stringify(jzodElement, null, 2)
  // );
  
  const schemaName = typeName?typeName.replace(/^(.)(.*)$/, (a, b, c) => b.toLowerCase() + c):"";
  const actualTypeName = typeName?typeName.replace(/^(.)(.*)$/, (a, b, c) => b.toUpperCase() + c):"";

  // console.log("jzodToTsCode typeAnotationForSchema", typeAnotationForSchema);

  const header = `import { ZodType, ZodTypeAny, z } from "zod";`;

  const typeAliasesAndZodText = jzodToTsTypeAliasesAndZodText(jzodElement, actualTypeName);

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
