import { Button, Form, Input, Select } from 'antd';
import React from 'react';
import styled from 'styled-components';
import apiService from '../../lib/services/api-service';

const ModalFormSubmit = styled(Form.Item)`
  position: absolute;
  bottom: 0;
  right: 8em;
  margin-bottom: 10px;
`;

export default function AddStudentForm(props) {
  console.log(props);
  const [form] = Form.useForm();
  const { student, countries, onFinish } = props;
  const validateMessages = { required: `${name} is required` };

  return (
    <Form
      form={form}
      validateMessages={validateMessages}
      onFinish={(studentInfo) => {
        const response = !student
          ? apiService.addStudent(studentInfo)
          : apiService.updateStudent({ ...studentInfo, id: student.id });

        response.then((response) => {
          const { data } = response;

          if (onFinish) {
            onFinish(data);
          }
        });
      }}
      initialValues={{
        name: student?.name,
        email: student?.email,
        country: student?.area,
        type: student?.typeName,
      }}
    >
      <Form.Item label="Name" name="name" rules={[{ required: true }]}>
        <Input type="text" placeholder="student name" />
      </Form.Item>

      <Form.Item
        label="Email"
        name="email"
        rules={[{ type: 'email', message: 'email form invalid' }]}
      >
        <Input type="text" placeholder="email" />
      </Form.Item>

      <Form.Item label="Area" name="country" rules={[{ required: true }]}>
        <Select>
          {countries.map((item, index) => (
            <Select.Option value={item.en} key={index}>
              {item.en}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item label="Student Type" name="type" rules={[{ required: true }]}>
        <Select>
          <Select.Option value={1}>Tester</Select.Option>
          <Select.Option value={2}>Developer</Select.Option>
        </Select>
      </Form.Item>

      <ModalFormSubmit shouldUpdate={true}>
        {() => (
          <Button type="primary" htmlType="submit">
            {!!student ? 'Update' : 'Add'}
          </Button>
        )}
      </ModalFormSubmit>
    </Form>
  );
}
