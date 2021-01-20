import { HeartFilled, UserOutlined } from '@ant-design/icons';
import { Card, Col, Row } from 'antd';
import { CardProps } from 'antd/lib/card';
import Link from 'next/link';
import React from 'react';
import styled from 'styled-components';
import { DurationUnit } from '../../lib/constant/duration';

const styledH2 = styled.h2`
  font-weight: 600;
`;

const getDuration = (data) => {
  const duration = data.duration;
  const durationUnit = data.durationUnit;

  const durationContent = `${duration} ${DurationUnit[durationUnit]}`;
  return duration > 1 ? durationContent + 's' : durationContent;
};

export default function CourseOverview(props) {
  const gutter = [0, 20];
  console.log(props);
  return (
    <Card cover={<img src={props.cover} />} bodyStyle={{ paddingBottom: 0 }}>
      <Row gutter={gutter}>
        <h3>{props.name}</h3>
      </Row>

      <Row gutter={gutter} justify="space-between" style={{ borderBottom: '1px solid #b2b7b9' }}>
        <Col style={{ fontWeight: '600' }}>{props.startTime}</Col>
        <Col style={{ display: 'flex', alignItems: 'center' }}>
          <HeartFilled style={{ color: 'red' }} />
          <b>{props.star}</b>
        </Col>
      </Row>

      <Row gutter={gutter} justify="space-between" style={{ borderBottom: '1px solid #b2b7b9' }}>
        <Col style={{ fontWeight: '600' }}>Duration:</Col>
        <Col>
          <b>{getDuration(props)}</b>
        </Col>
      </Row>

      <Row gutter={gutter} justify="space-between" style={{ borderBottom: '1px solid #b2b7b9' }}>
        <Col style={{ fontWeight: '600' }}>Teacher:</Col>
        <Col>
          <b style={{ color: '#4781C7' }}>{props.teacherName}</b>
        </Col>
      </Row>

      <Row gutter={gutter} justify="space-between">
        <Col style={{ fontWeight: '600' }}>
          <UserOutlined style={{ marginRight: 5, fontSize: 16, color: '#1890ff' }} />
          Student Limit:
        </Col>
        <Col>
          <b>{props.maxStudents}</b>
        </Col>
      </Row>

      {props.children}
    </Card>
  );
}
