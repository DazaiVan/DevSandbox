import React from 'react';
import { observer } from 'mobx-react-lite';
import { Table, Input, Switch, Button, Checkbox, Slider, Space } from 'antd';
import { useStore } from '../../stores/StoreProvider';

const WorldsConfiguration = observer(() => {
  const store = useStore();
  const sceneStore = store.sceneStore;
  const map = sceneStore.getMap;

  // Безопасно получаем объект миров
  let worldsArr = [];
  try {
    const worldsObj = sceneStore.getComponents.get && sceneStore.getComponents.get('Worlds');
    if (worldsObj && Array.isArray(worldsObj.list)) {
      worldsArr = worldsObj.list.map((w, idx) => ({
        key: w.uuid || idx,
        name: w.name || `World ${idx + 1}`,
        active: w.active ?? true,
        visible: w.visible ?? true,
        worldObj: w,
      }));
    }
  } catch (e) {
    console.error('Ошибка получения списка миров:', e);
    worldsArr = [];
  }

  const [search, setSearch] = React.useState('');

  const handleToggle = (uuid, field) => {
    const world = worldsArr.find(w => w.key === uuid)?.worldObj;
    if (world && field in world) {
      world[field] = !world[field];
    }
  };

  const handleNameChange = (uuid, value) => {
    const world = worldsArr.find(w => w.key === uuid)?.worldObj;
    if (world && 'name' in world) {
      world.name = value;
    }
  };

  const filteredWorlds = worldsArr.filter(w =>
    typeof w.name === 'string' && w.name.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    {
      title: 'Имя',
      dataIndex: 'name',
      render: (text, record) => (
        <Input
          value={text}
          onChange={e => handleNameChange(record.key, e.target.value)}
        />
      ),
    },
    {
      title: 'Активен',
      dataIndex: 'active',
      render: (active, record) => (
        <Switch
          checked={!!active}
          onChange={() => handleToggle(record.key, 'active')}
        />
      ),
    },
    {
      title: 'Виден',
      dataIndex: 'visible',
      render: (visible, record) => (
        <Switch
          checked={!!visible}
          onChange={() => handleToggle(record.key, 'visible')}
        />
      ),
    },
    // Можно добавить действия, если поддерживается удаление миров
  ];

  // Настройки миникарты напрямую из MobX store
  return (
    <div>
      <Input.Search
        placeholder="Поиск миров"
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{ marginBottom: 16 }}
      />
      <Table
        columns={columns}
        dataSource={filteredWorlds}
        pagination={false}
        rowKey="key"
        style={{ marginBottom: 24 }}
      />
      <div style={{ marginTop: 32 }}>
        <h3>Настройки миникарты</h3>
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <Checkbox
            checked={!!map?.enabled}
            onChange={e => { if(map) map.enabled = e.target.checked; }}
          >
            Включить
          </Checkbox>
          <Checkbox
            checked={!!map?.config?.visible}
            onChange={e => { if(map?.config) map.config.visible = e.target.checked; }}
          >
            Показать
          </Checkbox>
          <Checkbox
            checked={!!map?.config?.lockRotation}
            onChange={e => { if(map?.config) map.config.lockRotation = e.target.checked; }}
          >
            Фиксировать поворот
          </Checkbox>
          <div>
            <span>Приближение: </span>
            <Slider
              min={0.01}
              max={0.5}
              step={0.01}
              value={map?.config?.zoom || 0.1}
              onChange={v => { if(map?.config) map.config.zoom = v; }}
              style={{ width: 200 }}
            />
          </div>
          <div>
            <span>Переднее смещение: </span>
            <Slider
              min={0}
              max={5}
              step={1}
              value={map?.config?.frontOffset || 0}
              onChange={v => { if(map?.config) map.config.frontOffset = v; }}
              style={{ width: 200 }}
            />
          </div>
          <div>
            <span>Ширина: </span>
            <Slider
              min={100}
              max={500}
              step={10}
              value={map?.config?.sizeX || 200}
              onChange={v => { if(map?.config) map.config.sizeX = v; }}
              style={{ width: 200 }}
            />
          </div>
          <div>
            <span>Высота: </span>
            <Slider
              min={100}
              max={500}
              step={10}
              value={map?.config?.sizeY || 200}
              onChange={v => { if(map?.config) map.config.sizeY = v; }}
              style={{ width: 200 }}
            />
          </div>
        </Space>
      </div>
    </div>
  );
});

export default WorldsConfiguration;