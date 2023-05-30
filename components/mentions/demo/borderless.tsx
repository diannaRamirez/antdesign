import { Mentions } from 'antd';
import type { MentionsOptionProps } from 'antd/es/mentions';
import React from 'react';

const onChange = (value: string) => {
  console.log('Change:', value);
};

const onSelect = (option: MentionsOptionProps) => {
  console.log('select', option);
};

const App: React.FC = () => (
  <Mentions
    style={{ width: '100%' }}
    placeholder="input @ to mention people (borderless)"
    onChange={onChange}
    onSelect={onSelect}
    bordered={false}
    options={[
      {
        value: 'afc163',
        label: 'afc163',
      },
      {
        value: 'zombieJ',
        label: 'zombieJ',
      },
      {
        value: 'MadCcc',
        label: 'MadCcc',
      },
    ]}
  />
);

export default App;
