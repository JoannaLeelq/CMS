import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { useForm } from 'antd/lib/form/Form';
import React, { useState } from 'react';
import styled, { CSSProperties } from 'styled-components';
import { Form, Input, Button, Checkbox } from 'antd';
import { CloseCircleTwoTone, QuestionCircleOutlined, CheckCircleTwoTone } from '@ant-design/icons';

const StyledForm = styled(Form)`
  display: flex;
`;

export default function EditableText(props) {
  console.log('props: ', props);
  const [isEdit, setIsEdit] = useState(false);
  const [form] = useForm();

  return (
    <>
      {!isEdit ? (
        <div
          onClick={() => {
            setIsEdit(true);
          }}
          style={{ width: '100%' }}
        >
          {props?.textPro}
        </div>
      ) : (
        <Form
          form={form}
          onFinish={(value) => {
            props.saveChange(value);
            setIsEdit(false);
          }}
          style={!props.displaybutton ? { display: 'flex' } : { width: '100%' }}
          initialValues={props.initialValues}
        >
          {props.children}

          <Form.Item>
            <Button onClick={props.cancelChange} style={{ marginRight: '16px' }}>
              {!props.displaybutton ? <CloseCircleTwoTone style={{ color: 'red' }} /> : 'Cancel'}
            </Button>
            <Button htmlType="submit">
              {!props.displaybutton ? <CheckCircleTwoTone /> : 'Save'}
            </Button>
          </Form.Item>
        </Form>
      )}
    </>
  );
}
