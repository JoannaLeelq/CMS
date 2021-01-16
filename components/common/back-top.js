import { VerticalAlignTopOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

const ToTop = styled(VerticalAlignTopOutlined)`
  position: fixed;
  right: 15px;
  bottom: 50px;
  font-size: 50px;
  color: #fff;
  background: rgba(0, 0, 0, 0.3);
  opacity: 0.5;
  transition: all 0.5s;
  :hover {
    opacity: 0.8;
  }
`;

export default function BackTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = document.getElementById('contentPart');

    const listener = (e) => {
      const visible = e.target.scrollTop > 600;

      setVisible(visible);
    };

    element.addEventListener('scroll', listener);

    return () => {
      element.removeEventListener('scroll', listener);
    };
  }, [visible]);

  return visible ? (
    <ToTop
      onClick={() => {
        const element = document.getElementById('contentPart');

        element.scrollTo({ top: 0, behavior: 'smooth' });
      }}
    />
  ) : null;
}
