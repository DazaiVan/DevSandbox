import * as THREE from "three";
import React, { useState } from 'react';
import { DownOutlined } from '@ant-design/icons';
import { Checkbox, Tree } from 'antd';
import type { TreeDataNode, TreeProps } from 'antd';
import {observer} from "mobx-react-lite";

import { useStore } from "../../stores/StoreProvider";
import { ColorInput, SliderInput } from '../Toolbars/Sections/Clipper2';
import { toHexFormat } from "antd/es/color-picker/color";
import { SceneStore } from "../../stores/SceneStore";




const WorldConfigurationTable: React.FC = observer(() => {
  const store = useStore();
  const themeStore = store.themeStore;
  
  // Theme
  const [currentTheme, setCurrentTheme] = useState(themeStore.getCurrentTheme);

  const onThemeChange = (value: number) => {
    const themes = ['light', 'dark',] as const;
    themeStore.setTheme(themes[value - 1]);
    setCurrentTheme(value);
  };

  // GRID
  const worldGrid = store.sceneStore.getWorldGrid;
  const [visible, setVisible] = useState(true);
  const[sizeX, setSizeX] = useState(5)
  const[sizeY, setSizeY] = useState(5)
  const[gridColor, setGridColor] = useState("0000ff")
  const [distance, setDistance] = useState(500)

  // Directional Light
  const directionalLight = store.sceneStore.getWorld.scene.config.directionalLight;
  const [dLEnable, setDLEnable] = useState(true);
  const [dLPositionX, setdLPositionX] = useState(5);
  const [dLPositionY, setdLPositionY] = useState(10);
  const [dLPositionZ, setdLPositionZ] = useState(3);
  const [intensity, setIntensity] = useState(10);
  const [DLColor, setDLColor] = useState("FFFFFF")

  //Ambient Light
  const ambientLight = store.sceneStore.getWorld.scene.config.ambientLight;
  const [aLEnable, setALEnable] = useState(true);
  const [alIntensity, setALIntensity] = useState(1.5)
  const [ALColor, setALColor] = useState("FFFFFF")

  //Perspective Camera 
  const perCamera = store.sceneStore.getWorld.camera.controls
  const [nearF, setNearF] = useState(1);
  const [farF, setFarF] = useState(1000);
  const [fieldOfView, setFieldOfView] = useState(60);
  const [invertDrag, setInvertDrag] = useState(true);
  const [dollySpeed, setDollySpeed] = useState(1);
  const [truckSpeed, setTruckSpeed] = useState(2);
  const [smoothTime, setSmoothTime] = useState(0.2);

  //renderer
  // const renderer = store.sceneStore.getWorld.renderer;
  // const [gammaCorection, setGammaCorection] = useState(true);
  // //Ambient Occlusion
  // const [ambientOcclusion, setAmbientOcclusion] = useState(true);
  // const [samples, setSamples] = useState(16);
  // const [color, setColor] = useState('FFFFFF');
  // const [halfResolution, setHalfResolution] = useState(true);
  // const [screenSpaceRadius, setScreenSpaceRadius] = useState(true);
  // const [radius, setRadius] = useState(1);
  // const [rALIntensity, setRALIntensity] = useState(4);
  // const [distanceFallow, setDistanceFallow] = useState(4);
  // const [denoiseSamples, setDenoiseSamples] = useState(1); 
  // const [denoiseRadius, setDenoiseRadius] = useState(13); 
  // //custom effects
  // const [customEffects, setCustomEffects] = useState(true);
  // //gloss
  // const [gloss, setGloss] = useState(true);
  // const [glossMin, setGlossMin] = useState(-0.1);
  // const [glossMax, setGlossMax] = useState(0.1);
  // const [glossExponent, setGlossExponent] = useState(1.9);
  // //Outline
  // const [outline, setOutline] = useState(true);
  // const [outlineColor, setOutlineColor] = useState('17191c');
  // const [outlineTolerance, setOutlineTolerance] = useState(3);
  

  const treeData: TreeDataNode[] = [
    {
      title: 'Main',
      key: 'Main',
      children: [
        {
          title: 'Scene',
          key: 'Scene',
          children: [
            {
              title: 
              <Checkbox 
                  style={{ 
                      width: 175,
                      color: 'var(--text-primary)'
                  }}
                  defaultChecked={visible} 
                  onChange={(e) => {
                    setVisible(!visible);
                    worldGrid!.visible = !visible;
                    
                  }}
              >
                  Grid
              </Checkbox>,
              key: 'Grid',
              children: [
                {
                  title: 
                  <SliderInput
                    text='Size X' 
                    min={1} 
                    max={10} 
                    defaultValue={sizeX} 
                    step={0.5} 
                    onChange={(e) => {
                      setSizeX(e)
                      worldGrid!.material.uniforms.uSize1.value = sizeX
                    }}
                  />,
                  key: 'SizeX',
                },
                {
                  title: 
                  <SliderInput
                    text='Size Y' 
                    min={1} 
                    max={10} 
                    defaultValue={sizeY} 
                    step={0.5} 
                    onChange={(e) => {
                      setSizeY(e)
                      worldGrid!.material.uniforms.uSize2.value = sizeY
                    }}
                  />,
                  key: 'SizeY',
                },
                {
                  title: 
                  <ColorInput 
                    text="Color" 
                    defaultColor={gridColor}
                    onChange={(e) => {
                      setGridColor(e.metaColor.toHexString())
                      worldGrid!.material.uniforms.uColor.value = new THREE.Color(e.metaColor.toHexString());
                      //clipper.config.color = new THREE.Color(e.metaColor.toHexString());
                    }}
                  />,
                  key: 'Grid Color'
                },
                {
                  title: 
                  <SliderInput
                    text='Distance' 
                    min={300} 
                    max={1000} 
                    defaultValue={distance} 
                    step={10} 
                    onChange={(e) => {
                      setDistance(e);
                      worldGrid!.config.distance = distance
                    }}
                  />,
                  key: 'Distance',
                },
              ]
            },
            {
              title: 
              <Checkbox 
                style={{ 
                    width: 175,
                    color: 'var(--text-primary)'
                }}
                defaultChecked={dLEnable} 
                onChange={(e) => {
                  setDLEnable(!dLEnable);

                  dLEnable 
                  ? directionalLight.intensity = 0
                  : directionalLight.intensity = 10
                  
                }}
                >
                Directional Light
              </Checkbox>,
              key: 'Directional Light',
              children: [
                {
                  title: 
                  <SliderInput
                    text='Position X' 
                    min={-50} 
                    max={50} 
                    defaultValue={dLPositionX} 
                    step={1} 
                    onChange={(e) => {
                      setdLPositionX(e);
                      directionalLight.position = new THREE.Vector3(e, dLPositionY, dLPositionZ)
                    }}
                  />,
                  key: 'DL Position X',
                },
                {
                  title: 
                  <SliderInput
                    text='Position Y' 
                    min={-50} 
                    max={50} 
                    defaultValue={dLPositionY} 
                    step={1} 
                    onChange={(e) => {
                      setdLPositionY(e);
                      directionalLight.position = new THREE.Vector3(dLPositionX, e, dLPositionZ)
                    }}
                  />,
                  key: 'DL Position Y',
                },
                {
                  title: 
                  <SliderInput
                    text='Position Z' 
                    min={-50} 
                    max={50} 
                    defaultValue={dLPositionZ} 
                    step={1} 
                    onChange={(e) => {
                      setdLPositionZ(e);
                      directionalLight.position = new THREE.Vector3(dLPositionX, dLPositionY, e)
                    }}
                  />,
                  key: 'DL Position Z',
                },
                {
                  title: 
                  <SliderInput
                    text='Intensity' 
                    min={0} 
                    max={10} 
                    defaultValue={intensity} 
                    step={1} 
                    onChange={(e) => {
                      setIntensity(e)
                      directionalLight.intensity = e;
                    }}
                  />,
                  key: 'DL Intensity',
                },
                {
                  title: 
                  <ColorInput 
                    text="Color" 
                    defaultColor={DLColor}
                    onChange={(e) => {
                      setDLColor(e.metaColor.toHexString())
                      directionalLight.color = new THREE.Color(e.metaColor.toHexString());
                    }}
                  />,
                  key: 'DL Color'
                },
              ]
            },
            {
              title: 
              <Checkbox 
                style={{ 
                    width: 175,
                    color: 'var(--text-primary)'
                }}
                defaultChecked={aLEnable} 
                onChange={(e) => {
                  setALEnable(!aLEnable);

                  aLEnable 
                  ? ambientLight.intensity = 0
                  : ambientLight.intensity = 10
                  
                }}
              >
              Ambient Light
              </Checkbox>,
              key: 'Ambient Light',
              children: [
                {
                  title: 
                  <SliderInput
                    text='Intensity' 
                    min={0} 
                    max={10} 
                    defaultValue={alIntensity} 
                    step={0.5} 
                    onChange={(e) => {
                      setALIntensity(e)
                      ambientLight.intensity = e;
                    }}
                  />,
                  key: 'AL Intensity',
                },
                {
                  title: 
                  <ColorInput 
                    text="Color" 
                    defaultColor={ALColor}
                    onChange={(e) => {
                      setALColor(e.metaColor.toHexString())
                      ambientLight.color = new THREE.Color(e.metaColor.toHexString());
                    }}
                  />,
                  key: 'AL Color'
                },
              ]
            },
            {
              title: 'Perspective camera',
              key: 'Perspective camera',
              children: [
                {
                  title: 
                  <SliderInput
                    text='Near Frustum' 
                    min={0.1} 
                    max={10} 
                    defaultValue={nearF} 
                    step={0.1} 
                    onChange={(e) => {
                      setNearF(e)
                      perCamera.camera.near = e
                    }}
                  />,
                  key: 'Near Frustum',
                },
                {
                  title: 
                  <SliderInput
                    text='Far Frustum' 
                    min={300} 
                    max={2000} 
                    defaultValue={farF} 
                    step={10} 
                    onChange={(e) => {
                      setFarF(e)
                      perCamera.camera.far = e;
                    }}
                  />,
                  key: 'Far Frustum',
                },
                {
                  title: 
                  <SliderInput
                    text='Field of View' 
                    min={10} 
                    max={120} 
                    defaultValue={fieldOfView} 
                    step={1} 
                    onChange={(e) => {
                      setFieldOfView(e)
                    }}
                  />,
                  key: 'Field of View',
                },
                {
                  title: 
                  <Checkbox 
                    style={{ 
                        width: 175,
                        color: 'var(--text-primary)'
                    }}
                    defaultChecked={invertDrag} 
                    onChange={(e) => {
                      setInvertDrag(!invertDrag);
                      perCamera.dragToOffset = !invertDrag;
                      
                    }}
                  >
                    Invert Drag
                 </Checkbox>,
                  
                  key: 'Invert Drag',
                },
                {
                  title: 
                  <SliderInput
                    text='Dolly Speed' 
                    min={0.5} 
                    max={3} 
                    defaultValue={dollySpeed} 
                    step={0.1} 
                    onChange={(e) => {
                      setDollySpeed(e)
                      perCamera.dollySpeed = e;
                    }}
                  />,
                  key: 'Dolly Speed',
                },
                {
                  title: 
                  <SliderInput
                    text='Truck Speed' 
                    min={0.5} 
                    max={6} 
                    defaultValue={truckSpeed} 
                    step={0.1} 
                    onChange={(e) => {
                      setTruckSpeed(e)
                      perCamera.truckSpeed = e
                    }}
                  />,
                  key: 'Truck Speed',
                },
                {
                  title: 
                  <SliderInput
                    text='Smooth Time' 
                    min={0.01} 
                    max={2} 
                    defaultValue={smoothTime} 
                    step={0.01} 
                    onChange={(e) => {
                      setSmoothTime(e)
                      perCamera.smoothTime = e;
                    }}
                  />,
                  key: 'Smooth Time',
                },
              ]
            },
            // {
            //   title: 'Renderer',
            //   key: 'Renderer',
            //   children: [
            //     {
            //       title: 
            //       <Checkbox 
            //         style={{ 
            //             width: 175,
            //             color: 'var(--text-primary)'
            //         }}
            //         defaultChecked={gammaCorection} 
            //         onChange={(e) => {
            //           setGammaCorection(!gammaCorection);
            //           renderer!.components.list.forEach((el) => {
            //           })
            //         }}
            //       >
            //         Gamma Corection
            //       </Checkbox>,
            //       key: 'Gamma Corection',
            //     },
            //     {
            //       title: 
            //       <Checkbox 
            //         style={{ 
            //             width: 175,
            //             color: 'var(--text-primary)'
            //         }}
            //         defaultChecked={gammaCorection} 
                    
            //       >
            //         Ambient Occlusion
            //       </Checkbox>,
            //       key: 'Ambient Occlusion',
            //     },
            //   ]
            // }
          ],
        },
      ]
    },
  ];

  const onSelect: TreeProps['onSelect'] = (selectedKeys, info) => {
    return(
      console.log(selectedKeys)
    )
  };


  return (
    <Tree
      style={{
        color: 'var(--text-primary)',
        backgroundColor: 'var(--bg-primary)',
        
      }}
      autoExpandParent={true}
      showLine
      switcherIcon={<DownOutlined />}
      defaultExpandedKeys={
        ['Main', 'Scene', 'Grid', 'Directional Light', 'Ambient Light', 'Perspective camera',]
      }
      onSelect={onSelect}
      treeData={treeData}
    />
  )


});


export default WorldConfigurationTable;