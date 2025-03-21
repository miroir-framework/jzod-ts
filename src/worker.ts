import { ZodTextAndZodSchema } from "@miroir-framework/jzod";
import { worker } from "workerpool";
import { JzodElement } from "./generated_jzodBootstrapElementSchema.js";
import {
  jzodElementToZodTextAndZodSchemaForTsGeneration,
  jzodToTsTypeStringAndZodText,
  TsTypeStringAndZodText
} from "./JzodToTs.js";


console.log("worker.js run!");

function handleJzodElementToTsTypeMessage(
  jzodElementEntry: [string, JzodElement][],
  extendedJzodSchemaContext: Record<string, JzodElement>
) {
  // console.log(
  //   "worker.js handleJzodElementToTsTypeMessage received message extendedJzodSchemaContext:",
  //   Object.keys(extendedJzodSchemaContext).length,
  //   "keys"
  // );

  const extendedZodSchemaAndDescriptionForTsGenerationContext: Record<string, ZodTextAndZodSchema> =
    {};
  Object.entries(extendedJzodSchemaContext).forEach((e) => {
    extendedZodSchemaAndDescriptionForTsGenerationContext[e[0]] =
      jzodElementToZodTextAndZodSchemaForTsGeneration(
        e[1],
        extendedZodSchemaAndDescriptionForTsGenerationContext
      );
  });
  const converted: [string, TsTypeStringAndZodText][] = jzodElementEntry.map(
    (e: [string, JzodElement]) => {
      // console.log("worker.js handleJzodElementToTsTypeMessage for key", e[0], "starting...");
      return [
        e[0],
        jzodToTsTypeStringAndZodText(
          e[1],
          extendedZodSchemaAndDescriptionForTsGenerationContext,
          e[0]
        ),
      ];
    }
  );

  console.log(
    "worker.js handleJzodElementToTsTypeMessage done for keys",
    jzodElementEntry.map((e) => e[0]),
    "done"
  );
  return converted;
}

worker({
  handleJzodElementToTsTypeMessage,
});