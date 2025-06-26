import {makeAutoObservable} from 'mobx';
import * as OBC from "@thatopen/components";
import * as OBF from "@thatopen/components-front";
import * as THREE from "three";

interface GridInstance {
    visible: boolean;
    material: {
        uniforms: {
            uColor: { value: THREE.Color };
            uSize1: { value: number };
            uSize2: { value: number };
        };
    };
    config: {
        distance: number;
    };
    three: THREE.Mesh;
    create: (world: OBC.World) => void;
}

export class SceneStore {
    private components = new OBC.Components();
    private worlds = this.components.get(OBC.Worlds);
    private world = this.worlds.create<
        OBC.SimpleScene,
        OBC.OrthoPerspectiveCamera,
        OBF.PostproductionRenderer
    >();
    private worldGridManager = this.components.get(OBC.Grids);
    private worldGridInstance: GridInstance | null = null;

    setWorldGrid(item: GridInstance) {
        this.worldGridInstance = item;
    }

    get getWorldGrid() {
        return this.worldGridInstance;
    }


    private maps = this.components.get(OBC.MiniMaps);
    private map:any = null;
    get getMap() {
        return this.map;
    }
    private isWorldReady = false;
    get getIsWorldReady() {
        return this.isWorldReady;
    }
    get getComponents() {
        return this.components;
    }
    get getWorld() {
        return this.world;
    }
    init(viewportContainer: React.RefObject<HTMLDivElement>) {
        this.world.name = "Main";
        this.world.scene = new OBC.SimpleScene(this.components);
        this.world.scene.setup();
        this.world.scene.three.background = null;
        if(viewportContainer.current) {
            this.world.renderer = new OBF.PostproductionRenderer(this.components, viewportContainer.current );
        }
        const {postproduction} = this.world.renderer!;
        this.world.camera = new OBC.OrthoPerspectiveCamera(this.components);

        const gridInstance = this.worldGridManager.create(this.world) as unknown as GridInstance;
        this.setWorldGrid(gridInstance);
        const worldGrid = this.getWorldGrid;

        if (worldGrid) {
            worldGrid.material.uniforms.uColor.value = new THREE.Color("blue");
            worldGrid.material.uniforms.uSize1.value = 5;
            worldGrid.material.uniforms.uSize2.value = 5;
            
        }


        console.log(
            this.world.scene.directionalLights.forEach((el) => {
            el.intensity = 10
        
        }))

        this.components.init();
        postproduction.enabled = false;
        if (worldGrid) {
            postproduction.customEffects.excludedMeshes.push(worldGrid.three);
        }
        postproduction.setPasses({custom: true, ao: true, gamma: true});
        postproduction.customEffects.lineColor = 0x17191c;
        this.isWorldReady = true;
    }
    fragTileInit() {
        const fragments = this.components.get(OBC.FragmentsManager);
        const indexer = this.components.get(OBC.IfcRelationsIndexer);
        const classifier = this.components.get(OBC.Classifier);
        classifier.list.CustomSelections = {};

        const ifcLoader = this.components.get(OBC.IfcLoader);
        async function setupLoader(ifcLoader: OBC.IfcLoader) {

            // Ensure proper initialization
            // await ifcLoader.setup();
            // ifcLoader.settings.wasm = {
            //   path: "/Winnum/resources/themes/current/images/app/ui/designer/media/221/web-ifc/",
            //   absolute: true,
            // };
            ifcLoader.settings.wasm = {
                path: "/web-ifc/",
                absolute: true,
            };
        }
        setupLoader(ifcLoader);

        const tilesLoader = this.components.get(OBF.IfcStreamer);
        tilesLoader.world = this.world;
        tilesLoader.culler.threshold = 10;
        tilesLoader.culler.maxHiddenTime = 1000;
        tilesLoader.culler.maxLostTime = 40000;
        const highlighter = this.components.get(OBF.Highlighter);
        highlighter.setup({world: this.world});
        //highlighter.setup();

        highlighter.zoomToSelection = false;
        const culler = this.components.get(OBC.Cullers).create(this.world);
        culler.threshold = 5;
        this.world.camera.controls.restThreshold = 0.25;
        this.world.camera.controls.addEventListener("rest", () => {
            culler.needsUpdate = true;
            tilesLoader.cancel = true;
            tilesLoader.culler.needsUpdate = true;
        });
        fragments.onFragmentsLoaded.add(async (model) => {
            if (model.hasProperties) {
                await indexer.process(model);
                classifier.byEntity(model);
            }

            if (!model.isStreamed) {
                for (const fragment of model.items) {
                    this.world.meshes.add(fragment.mesh);
                    culler.add(fragment.mesh);
                }
            }

            this.world.scene.three.add(model);

            if (!model.isStreamed) {
                setTimeout(async () => {
                    this.world.camera.fit(this.world.meshes, 0.8);
                }, 50);
            }
        });
        fragments.onFragmentsDisposed.add(({fragmentIDs}) => {
            for (const fragmentID of fragmentIDs) {
                const mesh = [...this.world.meshes].find((mesh) => mesh.uuid === fragmentID);
                if (mesh) {
                    this.world.meshes.delete(mesh);
                }
            }
        });
    }
    minimapInit(mapContainerRef: React.RefObject<HTMLDivElement>) {
        const map = this.maps.create(this.world);
        if (map.renderer && typeof map.renderer.domElement !== 'undefined') {
            const canvas = map.renderer.domElement as HTMLCanvasElement;
            canvas.style.borderRadius = "12px";
            if (mapContainerRef.current) {
                mapContainerRef.current.append(canvas);
            }
            map.resize();
            map.lockRotation = false; //Это для поворота минимап вместе с камерой
        } else {
            console.error("renderer или domElement не найдены");
        }
        this.map = map;
    }
    constructor() {
        makeAutoObservable(this);
    }

}
