import { Modal, Button } from 'antd';
import React, { useState } from 'react';

export default function ModalForm(props) {
  const { children, cancel, ...others } = props;

  return (
    <Modal
      {...others}
      destroyOnClose={true}
      maskClosable={false}
      onCancel={cancel}
      footer={[
        <Button key="cancel" onClick={cancel}>
          Cancel
        </Button>,
      ]}
    >
      {props.children}
    </Modal>
  );
}
