import * as CUI from "@thatopen/ui-obc";
import Compass from '../../icons/mdi--compass.svg'
import Color from '../../icons/eva--color-palette-fill.svg'
import World from '../../icons/tabler--world.svg'
import Expand from '../../icons/eva--expand-fill.svg'
import {Button, Checkbox, Select, Slider} from "antd";
import {observer} from "mobx-react-lite";
import Search from "antd/es/input/Search";
import {useEffect, useRef, useState} from "react";
import { useStore } from "../../stores/StoreProvider";
import WorldsConfiguration from "./WorldTable";
import WorldConfigurationTable from "../Tables/WorldConfigurationTable";


const Settings = observer(() => {
  const store = useStore();
  const themeStore = store.themeStore;
  const [checkedEn, setCheckedEn] = useState(true);
  const [checkedShow, setCheckedShow] = useState(true);
  const [checkedRot, setCheckedRot] = useState(false);
  const components = store.sceneStore.getComponents;
  const map = store.sceneStore.getMap;
  const worldsTableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
      if(worldsTableRef.current && worldsTable instanceof HTMLElement)
        
          worldsTableRef.current.appendChild(worldsTable)
          const bimTable = document.querySelectorAll("bim-input")
          console.log(bimTable)
      
  }, []);

  const onThemeChange = (value: number) => {
    const themes = ['light', 'dark', 'system'] as const;
    themeStore.setTheme(themes[value - 1]);
  };

  const [worldsTable] = CUI.tables.worldsConfiguration( {components});
  

  const mapSize = map.getSize();
  const onWorldConfigSearch = (e:string) => {
    //worldsTable.queryString = e;
  };
  return (
      <div>
        <div>
          <div className="TitleWithIcon">
            <img height={"14px"} src={Color} alt="Color"/>
            <p>Цветовая тема</p>
          </div>
          <Select
              style={{width:"100%" }}
              onChange={onThemeChange}
              defaultValue={themeStore.getCurrentTheme}
              options={[
              {value:1, label:'Светлая'},
              {value:2, label:'Темная'},
              {value:3, label:'Системная'},
              ]}
          >
          </Select>
        </div>
        <div>
          <div className="TitleWithIcon">
            <img height={"14px"} src={World} alt="World"/>
            <p>Миры</p>
          </div>
          <div style={{display: "flex", gap: "0.375rem"}}>
            <Search onSearch={(e)=>onWorldConfigSearch(e)} enterButton placeholder="Поиск..."></Search>
            <Button style={{flex: 0}} onClick={() => (worldsTable.expanded = !worldsTable.expanded)}>
              <img height={"14px"} src={Expand} alt="World"/>
            </Button>
          </div>

          <WorldConfigurationTable/>
          <div ref={worldsTableRef}></div>
        </div>
          <div>
              <div className="TitleWithIcon">
                  <img height={"14px"} src={Compass} alt="Color"/>
                  <p>Настройки миникарты</p>
              </div>
              <Checkbox
                  checked={checkedEn}
                  onChange={(e) => {
                      setCheckedEn(e.target.checked);
                      map.enabled = e.target.checked;
                  }}>
                  Включить
              </Checkbox>
              <Checkbox
                  checked={checkedShow}
                  onChange={(e) => {
                      setCheckedShow(e.target.checked);
                      map.config.visible = e.target.checked;
                  }}>
                  Показать
              </Checkbox>
              <Checkbox
                  checked={checkedRot}
                  onChange={(e) => {
                      setCheckedRot(e.target.checked);
                      map.config.lockRotation = e.target.checked;
                  }}>
                  Фиксировать поворот
              </Checkbox>
              <div>
                  <p>Приближение</p>
                  <Slider
                      min={0.01}
                      max={0.5}
                      step={0.01}
                      defaultValue={map.zoom}
                      onChange={(e) => {
                          map.config.zoom = e;
                      }}
                  />
              </div>
              <div>
                  <p>Переднее смещение</p>
                  <Slider
                      min={0}
                      max={5}
                      step={1}
                      defaultValue={map.frontOffset}
                      onChange={(e) => {
                          map.config.frontOffset = e;
                      }}
                  />
              </div>
              <div>
                  <p>Ширина</p>
                  <Slider
                      min={100}
                      max={500}
                      step={10}
                      defaultValue={mapSize.x}
                      onChange={(e) => {
                          map.config.sizeX = e;
                      }}
                  />
              </div>
              <div>
                  <p>Высота</p>
                  <Slider
                      min={100}
                      max={500}
                      step={10}
                      defaultValue={mapSize.y}
                      onChange={(e) => {
                          map.config.sizeY = e;
                      }}
                  />
              </div>
          </div>

      </div>
  )
});
export default Settings;
