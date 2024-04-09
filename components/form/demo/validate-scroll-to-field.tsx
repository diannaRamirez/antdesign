import React from 'react';
import { Button, Flex, Form, Input, Select } from 'antd';

const App = () => {
  const [form] = Form.useForm();

  return (
    <Form
      form={form}
      scrollToFirstError
      style={{ padding: '2rem 4rem' }}
      labelCol={{ span: 2 }}
      wrapperCol={{ span: 8 }}
    >
      <Form.Item wrapperCol={{ offset: 2 }}>
        <Button onClick={() => form.scrollToField('bio')}>Scroll to Bio</Button>
      </Form.Item>

      <Form.Item name="username" label="UserName" rules={[{ required: true }]}>
        <Input />
      </Form.Item>

      <Form.Item label="Occupation" name="occupation">
        <Select
          options={[
            { label: 'Designer', value: 'designer' },
            { label: 'Developer', value: 'developer' },
            { label: 'Product Manager', value: 'product-manager' },
          ]}
        />
      </Form.Item>

      <Form.Item name="motto" label="Motto">
        <Input.TextArea rows={4} />
      </Form.Item>

      <Form.Item name="bio" label="Bio" rules={[{ required: true }]}>
        <Input.TextArea rows={6} />
      </Form.Item>

      <Form.Item wrapperCol={{ offset: 2 }}>
        <Flex gap="small">
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
          <Button danger onClick={() => form.resetFields()}>
            Reset
          </Button>
        </Flex>
      </Form.Item>
    </Form>
  );
};

export default App;
