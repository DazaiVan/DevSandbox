
import { Tabs } from 'antd';
import Load from "./Sections/Import";
import EntityAttributes from "../Panels/EntityAttributes";
import Export from "./Sections/Exports";
import Clipper2 from "./Sections/Clipper2";
import Clipper from "./Sections/Clipper";
import Measurement2 from "./Sections/Measurement2";

const ToolBar = () => {
    return(
        <Tabs
            className={"toolbar"}
            defaultActiveKey="1"
            items={[
                {
                    label: 'Импорт',
                    key: '1',
                    children: <Load/>,
                },
                {
                    label: 'Экспорт',
                    key: '2',
                    children: <Export/>,
                },
                {
                    label: 'Управление моделью',
                    key: '3',
                    children: <EntityAttributes/>,
                },
                {
                    label: 'Измерения',
                    key: '4',
                    children: <Measurement2/>,
                },
                {
                    label: 'Плоскость сечения',
                    key: '5',
                    children: <Clipper2/>,
                },
            ]}
        />
            )
}

export default ToolBar