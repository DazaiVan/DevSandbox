// import * as OBC from "@thatopen/components";




// export async function LoadModelIFC(components:OBC.Components,world: OBC.SimpleWorld<OBC.SimpleScene, OBC.SimpleCamera, OBC.SimpleRenderer>){
//     const fragments = components.get(OBC.FragmentsManager);
//     const fragmentIfcLoader = components.get(OBC.IfcLoader);
//     // await fragmentIfcLoader.setup();
//     fragmentIfcLoader.settings.wasm = {
//   path: "https://unpkg.com/web-ifc@0.0.57/",
//   absolute: true,
// };
//     fragmentIfcLoader.settings.webIfc.COORDINATE_TO_ORIGIN = true;
//     async function loadIfc() {
//         const file = await fetch(
//           "/RAC_basic_sample_project.ifc",
//         );
//         const data = await file.arrayBuffer();
//         const buffer = new Uint8Array(data);
//         const model = await fragmentIfcLoader.load(buffer);
//         model.name = "example";
//         world.scene.three.add(model);
//       }
//       fragments.onFragmentsLoaded.add((model) => {
//         console.log(model);
//       });
//       function disposeFragments() {
//         fragments.dispose();
//       }
//       loadIfc()
//     // return null
// }
export{}