import {Tabs} from "antd";
import ProjectInformation from "./ProjectInformation";
import Settings from "./Settings";
import Issue from "./Issue";
import { observer } from "mobx-react-lite";

const MenuBar= observer(() => {
    return(
        <Tabs
            style={{height:222}}
            defaultActiveKey="1"
            items={[
                {
                    label: 'Проект',
                    key: '1',
                    children: <ProjectInformation/>,
                },
                {
                    label: 'Настройки',
                    key: '2',
                    children: <Settings/>,
                },
                {
                    label: 'Помощь',
                    key: '3',
                    children: '',
                },
                {
                    label: 'Issue',
                    key: '4',
                    children: <Issue/>,
                },
            ]}
        />
    )
});
export default MenuBar;