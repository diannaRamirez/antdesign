import React from 'react';
import { Input } from 'antd';

const { TextArea } = Input;

const App: React.FC = () => (
  <div style={{ backgroundColor: 'rgba(0, 0, 128, .2)' }}>
    <Input placeholder="Unbordered" variant="borderless" />
    <Input placeholder="Unbordered" variant="borderless" size="large" />
    <TextArea placeholder="Unbordered" bordered={false} />
    <TextArea placeholder="Unbordered" bordered={false} allowClear />
    <Input placeholder="Unbordered" variant="borderless" allowClear />
    <Input prefix="￥" suffix="RMB" variant="borderless" />
    <Input prefix="￥" suffix="RMB" disabled variant="borderless" />
    <TextArea allowClear style={{ border: '2px solid #000' }} />
  </div>
);

export default App;
