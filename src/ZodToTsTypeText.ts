import { ZodTypeAny } from "zod";
import { zodToTs, createTypeAlias, printNode } from "zod-to-ts";
import { TsTypeText } from "./JzodToTs";

// ################################################################################################
export function zodSchemaToTsTypeText(
  zodSchema: ZodTypeAny,
  contextZodSchema: Record<string,ZodTypeAny> = {},
  typeName?: string,
): TsTypeText {
  const jzodToTsTypeAliasesAndZodTextStartTime = Date.now();
  console.log("@@@@@@@@@@@@@@@@@ zodSchemaToTsTypeStringAndZodText start!");

  console.log(
    "zodSchemaToTsTypeStringAndZodText jzodToZodTextAndZodSchemaForTsGeneration duration",
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
    contextTsTypeText: contextTsTypesStringObject,
    tsTypeText: tsTypeString,
  }
}
