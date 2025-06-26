import * as THREE from "three";
import * as BUI from "@thatopen/ui";
import * as OBC from "@thatopen/components";

export default (world: OBC.World, components: OBC.Components) => {
    if(!world) return
    const casters = components.get(OBC.Raycasters);
    casters.get(world);

    const clipper = components.get(OBC.Clipper);
    clipper.enabled = true;

    window.onclick = () => {
        const clipperTab = document.querySelector('bim-tabs[tab="__unnamed__4"]')!;
        if(clipperTab) {
            clipper.config.enabled = true;
            clipper.config.visible = true;
        }
        else {
            clipper.config.enabled = false;
            clipper.config.visible = false;
        }
    }

    window.onkeydown = (event) => {
        const clipperTab = document.querySelector('bim-tabs[tab="__unnamed__4"]')!;
        if(!clipperTab) return
        if(event.key === ' ') {
            if (clipper.enabled) { clipper.create(world); }
        }

        if (event.key === "Delete" || event.key === "Backspace") {
            if (clipper.enabled) { clipper.delete(world); }
        }
    };

    return  BUI.Component.create<BUI.PanelSection>(() => {
        return BUI.html`
        
        <bim-panel 
            style="width: 100%;
        ">
            
            <bim-panel-section label="Команды">
                <bim-label>Пробел (Space): Создание плоскости сечения</bim-label>
                <bim-label>Backspace: Удаление плоскости сечения</bim-label>
                <bim-label>  <span style="color: red">*</span>Предварительно требуется навестись на плоскость, подлежащую удалению</bim-label>
                
            </bim-panel-section>
            
            <bim-panel-section collapsed label="Управление компонентом">
                <bim-checkbox label="Включить клиппер" checked 
                    @change="${({ target }: { target: BUI.Checkbox }) => {
                        clipper.config.enabled = target.value;
                    }}">
                </bim-checkbox>
                
                <bim-checkbox label="Показать клиппер" checked 
                    @change="${({ target }: { target: BUI.Checkbox }) => {
                        console.log(target)
                        clipper.config.visible = target.value;
                    }}">
                </bim-checkbox>
                
                <bim-color-input 
                        label="Цвет плоскости" color="#202932" 
                        @input="${({ target }: { target: BUI.ColorInput }) => {
                            clipper.config.color = new THREE.Color(target.color);
                        }}">
                </bim-color-input>
                
                <bim-number-input 
                  slider step="0.01" label="Прозрачность плоскости" value="0.2" min="0.1" max="1"
                  @change="${({ target }: { target: BUI.NumberInput }) => {
                    clipper.config.opacity = target.value;
                    }}">
                </bim-number-input>
                
                <bim-number-input 
                  slider step="0.1" label="Размер плоскости" value="5" min="2" max="10"
                  @change="${({ target }: { target: BUI.NumberInput }) => {
                    clipper.config.size = target.value;
                    }}">
                </bim-number-input>
                
                <bim-button 
                  label="Удалить все" 
                  @click="${() => {
                    clipper.deleteAll();
                    }}">  
                </bim-button>
                
            </bim-panel-section>
            
          </bim-panel>
        `;
    });

}


