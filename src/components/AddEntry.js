import React from 'react';
import { Form, Input, DatePicker, Select, Button } from 'antd';
import moment from 'moment';

const { Option } = Select;

const AddEntry = ({ form, isEditing, editEntry, cancelEdit, addEntry, updateEntry }) => {
  return (
    <Form form={form} layout="vertical" onFinish={isEditing ? updateEntry : addEntry}>
      <Form.Item name="name" label="Category" rules={[{ required: true, message: 'Please input category!' }]}>
        <Input placeholder="Category" />
      </Form.Item>
      <Form.Item name="amount" label="Amount" rules={[{ required: true, message: 'Please input amount!' }]}>
        <Input type="number" placeholder="Amount" />
      </Form.Item>
      <Form.Item name="date" label="Date" rules={[{ required: true, message: 'Please select date!' }]}>
        <DatePicker />
      </Form.Item>
      <Form.Item name="type" label="Type" rules={[{ required: true, message: 'Please select type!' }]}>
        <Select placeholder="Select type">
          <Option value="income">Income</Option>
          <Option value="expense">Expense</Option>
        </Select>
      </Form.Item>
      <Form.Item style={{ textAlign: 'right' }}>
        <Button htmlType="button" onClick={cancelEdit} style={{ marginRight: 8 }}>
          Cancel
        </Button>
        <Button type="primary" htmlType="submit">
          {isEditing ? 'Update Entry' : 'Add Entry'}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default AddEntry;
