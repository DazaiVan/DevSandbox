import * as THREE from "three";
import * as BUI from "@thatopen/ui";
import * as OBC from "@thatopen/components";
import {observer} from "mobx-react-lite";
import {useStore} from "../../../stores/StoreProvider";
import type { InputNumberProps } from 'antd';
import {Tooltip, ColorPicker, Button, Flex, Splitter, Slider, Typography, Checkbox} from "antd";
import type { SliderSingleProps } from 'antd';
import React, {useEffect, useRef, useState} from "react";

const { Text, Title } = Typography;

const Clipper2 = observer(() => {
    const store = useStore();
    const world = store.sceneStore.getWorld
    const components = store.sceneStore.getComponents;

    const casters = components.get(OBC.Raycasters);
    casters.get(world);

    const clipper = components.get(OBC.Clipper);
    const [clipperEnable, setClipperEnable] = useState(true);
    const [clipperVisible, setClipperVisible] = useState(true);

    clipper.enabled = clipperEnable;
    clipper.visible = clipperVisible;

    const clipperTab = document.getElementById('rc-tabs-1-tab-5')!.parentElement!
    const observer =
        new MutationObserver((mutationsList) => {
            for(const mutation of mutationsList) {
                if(mutation.type === 'attributes') {
                    if(!clipperTab.classList.contains('ant-tabs-tab-active')) {
                        clipper.enabled = false;
                        clipper.visible = false;
                    } else {
                        clipper.enabled = clipperEnable;
                        clipper.visible = clipperVisible;
                    }
                }
            }
        })

    observer.observe(clipperTab, {
        attributes: true
    })

    window.onkeydown = (event) => {
        const clipperTab = document.getElementById('rc-tabs-1-tab-5')!;
        if(!clipperTab.parentElement!.classList.contains('ant-tabs-tab-active')) return

        switch (event.key) {
            case "Enter": if (clipperEnable) clipper.create(world); break
            case "Delete": clipper.delete(world); break
            case "Backspace": clipper.delete(world); break
        }
    };

    return (
        <div style={{ color: 'var(--text-primary)' }}>
            <Splitter style={{ 
                height: 150, 
                boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
                backgroundColor: 'var(--bg-primary)',
                border: '1px solid var(--border-color)',
                borderRadius: '8px'
            }}>
                <Splitter.Panel>
                    <ClipperTitle text='Помощь' />

                    <Flex vertical={true} justify="center" align="start">
                        <Text style={{ color: 'var(--text-primary)' }}>Enter: Создание плоскости сечения;</Text>
                        <Tooltip title={"Сначала необходимо навести курсор на плоскость, которую планируется удалить."}>
                            <span style={{ color: 'var(--text-primary)' }}>
                                Backspace: Удаление плоскости сечения;
                                <span style={{color: "red"}}> *</span>
                            </span>
                        </Tooltip>
                    </Flex>
                </Splitter.Panel>

                <Splitter.Panel>
                    <ClipperTitle text='Команды' />
                    <Flex align="center" style={{padding:"0 20px 0 20px"}} wrap gap="middle">
                        <Checkbox 
                            style={{ 
                                width: 175,
                                color: 'var(--text-primary)'
                            }}
                            defaultChecked={true} 
                            onChange={(e) => {
                                setClipperEnable(e.target.checked);
                                clipper.config.enabled = clipperEnable;
                            }}
                        >
                            Включить плоскость
                        </Checkbox>

                        <Checkbox 
                            style={{ 
                                width: 175,
                                color: 'var(--text-primary)'
                            }}
                            defaultChecked={true} 
                            onChange={(e) => {
                                setClipperVisible(e.target.checked);
                                clipper.config.enabled = clipperVisible;
                            }}
                        >
                            Показать плоскость
                        </Checkbox>

                        <SliderInput 
                            text='Прозрачность плоскости' 
                            min={0.01} 
                            max={1} 
                            defaultValue={0.2} 
                            step={0.01} 
                            onChange={(e) => {clipper.config.opacity= e;}}
                        />
                        <SliderInput 
                            text='Размер плоскости' 
                            min={0.1} 
                            max={10} 
                            defaultValue={5} 
                            step={0.01} 
                            onChange={(e) => {clipper.config.size= e;}}
                        />
                        <ColorInput 
                            text="Цвет плоскости" 
                            onChange={(e) => {clipper.config.color = new THREE.Color(e.metaColor.toHexString());}}
                        />
                        <Button 
                            style={{
                                alignItems:"end",
                                backgroundColor: 'var(--bg-primary)',
                                color: 'var(--text-primary)',
                                borderColor: 'var(--border-color)'
                            }} 
                            danger={true} 
                            onClick={() => {clipper.deleteAll()}}
                        >
                            Удалить всё
                        </Button>
                    </Flex>
                </Splitter.Panel>
            </Splitter>
        </div>
    )
})

interface IHandler {
    text: string;
    defaultColor?: string;
    onChange: (e: any) => void;
}

export const SliderInput = (props: IHandler & SliderSingleProps) => {
    const {text, onChange, ...rest} = props
    return (
        <Flex vertical={true}>
            <Text style={{ color: 'var(--text-primary)' }}>{text}</Text>
            <Slider
                {...rest}
                onChange={onChange}
                style={{ width: 175 }}
            />
        </Flex>
    )
}

export const ColorInput = (props:IHandler) => {
    const {text, defaultColor = '#0000ff', onChange} = props
    return (
        <Flex vertical={true}>
            <Text style={{ color: 'var(--text-primary)' }}>{text}</Text>
            <ColorPicker
                defaultValue={defaultColor}
                showText
                allowClear
                onChange={onChange}
            />
        </Flex>
    )
}

interface ITitle {
    text: string
}

const ClipperTitle = (props: ITitle) => {
    return (
        <Flex justify="center" align="start" style={{margin:" 0 0 12px 0"}}>
            <Title 
                style={{ 
                    margin: 0,
                    color: 'var(--text-primary)'
                }}
                type="secondary"
                level={4}
            >
                {props.text}
            </Title>
        </Flex>
    )
}

export default Clipper2