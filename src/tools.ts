import { printNode } from "zod-to-ts";
import ts from "typescript";

import { TsTypeAliases } from "./JzodToTs";

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