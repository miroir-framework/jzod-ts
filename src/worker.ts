// import { parentPort } from "worker_threads";
// import { jzodElementSchemaToZodSchemaAndDescriptionWithCarryOn } from "./JzodToZod.js";
// // import { WorkerPool, workerPoolFunctionReferences, workerPoolZodSchemaToTsTypeString } from "./WorkerPool.js";
// import { ZodTextAndZodSchema } from "./JzodInterface.js";

import { jzodElementSchemaToZodSchemaAndDescriptionWithCarryOn, ZodTextAndZodSchema } from "@miroir-framework/jzod";
import { getReferences } from "./JzodToTs.js";
import { worker } from "workerpool";


// import { worker } from "workerpool"

console.log("worker.js run!");

function handleJzodElementToTsTypeMessage(e: any) {
   // console.log("worker.js onmessage!");
   console.log("worker.js handleJzodElementToTsTypeMessage received message:", JSON.stringify(e, null, 2));
    const { key, value: {jzodElement, typeName, exportPrefix} } = e;
  //  console.log("worker.js handleJzodElementToTsTypeMessage received jzodElement:", JSON.stringify(jzodElement, null, 2), );

  //  console.log("worker.js onmessage received WorkerPool", WorkerPool);
  //  console.log("worker.js onmessage received WorkerPool.localFunctionReferences=", workerPoolFunctionReferences);
   // console.log("worker.js onmessage received zodSchemaToTsTypeString=", workerPoolZodSchemaToTsTypeString);

   // if (!workerPoolZodSchemaToTsTypeString) {
   //   throw new Error("workerPoolZodSchemaToTsTypeString is not defined in worker.js.");
   // }


  //  const converted: ZodTextAndZodSchema = jzodElementSchemaToZodSchemaAndDescriptionWithCarryOn(
  //    // name,
  //    jzodElement,
  //    undefined, // carryOnZodSchemaAndDescription,
  //    getReferences, // () => ({ ...getSchemaEagerReferences(), ...Object.fromEntries(localContextReferences) }),
  //    getReferences, // () => ({ ...getLazyReferences(), ...Object.fromEntries(localContextReferences) }),
  //    // WorkerPool.localFunctionReferences, // () => ({ ...getSchemaEagerReferences(), ...Object.fromEntries(localContextReferences) }),
  //    // WorkerPool.localFunctionReferences, // () => ({ ...getLazyReferences(), ...Object.fromEntries(localContextReferences) }),
  //    undefined // typeScriptGeneration, not used because we only convert to top element to Zod text and TypeScript type code.
  //  );

   // const context = Object.fromEntries(Object.entries(getSchemaEagerReferences()).map(e => [e[0], e[1].zodSchema]));

   // const tsTypeText = WorkerPool.zodSchemaToTsTypeString(converted.zodSchema, converted.contextZodSchema??{}, typeName);
   // const tsTypeText = workerPoolZodSchemaToTsTypeString(converted.zodSchema, converted.contextZodSchema??{}, typeName);
   const tsTypeText = "workerPoolZodSchemaToTsTypeString(converted.zodSchema, converted.contextZodSchema??{}, typeName)";

   // console.log("worker.js onmessage for key", key, "returning message:", JSON.stringify(converted, circular, 2));
  //  console.log("worker.js onmessage for key", key, "returning message:", JSON.stringify(converted, null, 2));
   // parentPort?.postMessage({ key, value: "worker" + key + " done" });
   return ({ key, value: tsTypeText });
  //  parentPort?.postMessage({ key, value: tsTypeText });
}

worker({
  handleJzodElementToTsTypeMessage,
});



// if (!!parentPort) {
//   parentPort.on("message", (e) => {
//     // console.log("worker.js onmessage!");
//     const { key, value: {jzodElement, typeName, exportPrefix} } = e;
//     // console.log("worker.js onmessage received message:", JSON.stringify(e, null, 2));
//     console.log("worker.js onmessage received jzodElement:", JSON.stringify(jzodElement, null, 2), );

//     console.log("worker.js onmessage received WorkerPool", WorkerPool);
//     console.log("worker.js onmessage received WorkerPool.localFunctionReferences=", workerPoolFunctionReferences);
//     // console.log("worker.js onmessage received zodSchemaToTsTypeString=", workerPoolZodSchemaToTsTypeString);

//     // if (!workerPoolZodSchemaToTsTypeString) {
//     //   throw new Error("workerPoolZodSchemaToTsTypeString is not defined in worker.js.");
//     // }


//     const converted: ZodTextAndZodSchema = jzodElementSchemaToZodSchemaAndDescriptionWithCarryOn(
//       // name,
//       jzodElement,
//       undefined, // carryOnZodSchemaAndDescription,
//       workerPoolFunctionReferences, // () => ({ ...getSchemaEagerReferences(), ...Object.fromEntries(localContextReferences) }),
//       workerPoolFunctionReferences, // () => ({ ...getLazyReferences(), ...Object.fromEntries(localContextReferences) }),
//       // WorkerPool.localFunctionReferences, // () => ({ ...getSchemaEagerReferences(), ...Object.fromEntries(localContextReferences) }),
//       // WorkerPool.localFunctionReferences, // () => ({ ...getLazyReferences(), ...Object.fromEntries(localContextReferences) }),
//       undefined // typeScriptGeneration, not used because we only convert to top element to Zod text and TypeScript type code.
//     );

//     // const context = Object.fromEntries(Object.entries(getSchemaEagerReferences()).map(e => [e[0], e[1].zodSchema]));

//     // const tsTypeText = WorkerPool.zodSchemaToTsTypeString(converted.zodSchema, converted.contextZodSchema??{}, typeName);
//     // const tsTypeText = workerPoolZodSchemaToTsTypeString(converted.zodSchema, converted.contextZodSchema??{}, typeName);
//     const tsTypeText = "workerPoolZodSchemaToTsTypeString(converted.zodSchema, converted.contextZodSchema??{}, typeName)";

//     // console.log("worker.js onmessage for key", key, "returning message:", JSON.stringify(converted, circular, 2));
//     console.log("worker.js onmessage for key", key, "returning message:", JSON.stringify(converted, null, 2));
//     // parentPort?.postMessage({ key, value: "worker" + key + " done" });
//     parentPort?.postMessage({ key, value: tsTypeText });
//     // parentPort?.postMessage({ key, value: converted });
//   });
// } else {
//   console.error("parentPort is not defined in this worker.");
// }
