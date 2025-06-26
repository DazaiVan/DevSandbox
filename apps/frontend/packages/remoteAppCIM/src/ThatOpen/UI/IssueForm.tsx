import {markerCast} from "../Toolbars/Marker";
import {observer} from "mobx-react-lite";
import {Form, Select,Input,Button,DatePicker} from "antd";
import { useStore } from "../../stores/StoreProvider";
import { useEffect } from "react";
import { useIssueForm } from "../../hooks/useIssueForm";
import { IssueFormProps } from "../../types/types";


const IssueForm = observer((setIssueFormShow:IssueFormProps) => {
    const { form, onCancel, onFinish } = useIssueForm(setIssueFormShow);
    const store = useStore();
    const {TextArea} = Input;

    useEffect(() => {
        if(store.issueFormStore.isIssueFormOpen){
            form.resetFields()
            //store.usersStore.loadUsers()
        }
    }, [store.issueFormStore.isIssueFormOpen]);

    return (
        <Form
        className="issue-tab__form"
        id="issueForm"
        form={form}
        layout="vertical"
        onFinish={onFinish}
    >
        <div style={{display:"flex",flexDirection:'column', justifyContent:'space-between', gap:'0.1rem',  height: "40rem"}}>
                <Form.Item label="Статус"
                           name="status"
                           rules={[{required: true, message: 'Пожалуйста выберите статус'}]}
                >
                    <Select
                        style={{width: '8em'}}
                        placeholder='Выберите'
                        options={
                            [
                                {value: 'открыто', label: 'Открыто'},
                                {value: 'отвечено', label: 'Отвечено'},
                                {value: 'закрыто', label: 'Закрыто'}
                            ]}
                    />
                </Form.Item>
                <Form.Item label="Заголовок"
                           name="title"
                           rules={[{required: true, message: 'Пожалуйста введите заголовок'}]}
                >
                    <Input placeholder='Введите заголовок'/>
                </Form.Item>
                <Form.Item label="Описание"
                           name="description"
                >
                    <TextArea placeholder="Введите описание" autoSize={{minRows: 2, maxRows: 4}}></TextArea>
                </Form.Item>
                <Form.Item label="Назначить"
                           name="assignedTo"
                >
                    <Select
                    
                        placeholder='Выберите пользователя или компанию'
                        // options={store.usersStore.users.map((user:IUserType) => ({
                        //     value: user.email + " " + user.name,
                        //     label: user.email + " " + user.name
                        // }))}
                    />
                </Form.Item>
     
                <Form.Item label="Расположение"
                           name="location"
                >
                    <Input placeholder="Введите расположение"/>
                </Form.Item>
                <Form.Item label="Компания"
                           name="company"
                >
                    <Input placeholder="Введите компанию"/>
                </Form.Item>
                <Form.Item label="Тип проблемы"
                           name="issueType"
                >
                    <Input placeholder="Введите тип проблемы"/>
                </Form.Item>
                <Form.Item label="Первопричина"
                           name="rootCause"
                >
                    <Input placeholder="Введите первопричину"/>
                </Form.Item>
                <Form.Item label="Срок"
                           name="dueDate"
                           rules={[{required: true, message: 'Пожалуйста введите дату срока'}]}
                >
                    <DatePicker format={'DD.MM.YYYY'}/>
                </Form.Item>
           
        </div>


        <div style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-end",
            gap: "1.5em",
            alignItems: "center"
        }}>
            <Button key="cancel" onClick={onCancel}>
                Отменить
            </Button>
            <Button key="submit" type="primary" htmlType='submit'>
                Добавить
            </Button>
        </div>
        </Form>
    )
})
export default IssueForm;
// return BUI.Component.create<BUI.PanelSection>(() => {
//     return BUI.html`
//             <form id="issueForm" class="issue-tab__form">
//                 <div>
//                     <label for="status">Статус:</label>
//                     <select id="status" name="status" required>
//                         <option value="open">Открыто</option>
//                         <option value="answered">Ответено</option>
//                         <option value="closed">Закрыто</option>
//                     </select>
//                 </div>
//                 <div>
//                     <label for="title">Заголовок:</label>
//                     <input type="text" id="title" name="title" required placeholder="Введите заголовок">
//                 </div>
//                 <div>
//                     <label for="description">Описание:</label>
//                     <textarea id="description" name="description" placeholder="Введите описание"></textarea>
//                 </div>
//                 <div>
//                     <label for="assignee">Назначить:</label>
//                     <select id="assignee" name="assignee">
//                         <option value="type1">Никита</option>
//                         <option value="type2">Ваня</option>
//                         <option value="type3">Даня</option>
//                     </select>
//                 </div>
//                 <div>
//                     <label for="location">Расположение:</label>
//                     <input type="text" id="location" name="location" placeholder="Введите расположение">
//                 </div>
//                 <div>
//                     <label for="company">Компания:</label>
//                     <input type="text" id="company" name="company" placeholder="Введите компанию">
//                 </div>
//                 <div>
//                     <label for="issueType">Тип проблемы:</label>
//                     <input type="text" id="issueType" name="issueType" placeholder="Введите расположение">
//                 </div>
//                 <div>
//                     <label for="rootCause">Первопричина:</label>
//                     <input type="text" id="rootCause" name="rootCause" placeholder="Введите расположение">
//                 </div>
//                 <div>
//                     <label for="dueDate">Срок:</label>
//                     <input type="date" id="dueDate" name="dueDate" required>
//                 </div>
//                 <div>
//                     <bim-button class="issue-tab__button" id="cancelCreation" @click=${onCancel} label="Отменить">
//                     </bim-button>
//                     <bim-button type="submit" class="issue-tab__button" id="issueCreate" @click=${() => onIssueSet()} label="Создать Issue">
//                     </bim-button>
//                 </div>
//             </form>
//     `;
// });