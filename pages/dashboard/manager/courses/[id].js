import APPLayout from '../../../../components/layout/layout';
import { useRouter } from 'next/router';
import 'antd/dist/antd.css';
import React, { useState, useEffect } from 'react';
import apiService from '../../../../lib/services/api-service';
import { Row, Col, Card, Badge, Steps, Tag, Collapse } from 'antd';
import styled from 'styled-components';
import CourseOverview from '../../../../components/course/courseOverview';
import WeekCalendar from '../../../../components/common/week-calendar';

const StyledCol = styled(Col)`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  position: relative;
  border-right: 1px solid #b2b7b9;
  :last-child {
    border-right: none;
  }
  p {
    margin-bottom: 0;
  }
  b {
    color: #7356f1;
    font-size: 24px;
  }
`;

const StyledRow = styled(Row)`
  border-top: 1px solid #b2b7b9;
  width: calc(100% + 48px);
  margin: 0 -24px 0 -24px !important;
`;

const StepsRow = styled(Row)`
  overflow-x: scroll;
  ::-webkit-scrollbar {
    display: none;
  }
  .ant-steps-item-title {
    overflow: hidden;
  }
`;

const { Step } = Steps;

const tagColor = [
  'magenta',
  'volcano',
  'orange',
  'gold',
  'green',
  'cyan',
  'geekblue',
  'purple',
  'red',
  'lime',
];

const genExtra = (currentIndex, processKey) => {
  if (currentIndex === processKey) {
    return <Tag color={'green'}>processing</Tag>;
  }

  if (currentIndex > processKey) {
    return <Tag color={'orange'}>wait</Tag>;
  }

  if (currentIndex < processKey) {
    return <Tag color={'default'}>finish</Tag>;
  }
};

export async function getServerSideProps(context) {
  return {
    props: { id: context.params.id },
  };
}

export default function CourseDetail(props) {
  const router = useRouter();
  const [leftInfo, setLeftInfo] = useState([]);
  const [processKey, setProcessKey] = useState(0);
  const [data, setData] = useState();

  useEffect(() => {
    const id = router.query.id || props.id;
    apiService.getCourseDetail({ id }).then((res) => {
      const data = res.data;

      if (data) {
        const sales = res.data.sales;
        const leftInfo = [
          { label: 'Price', value: sales.price },
          { label: 'Batches', value: sales.batches },
          { label: 'Students', value: sales.studentAmount },
          { label: 'Earnings', value: sales.earnings },
        ];
        setLeftInfo(leftInfo);
        setProcessKey(
          res.data.schedule.chapters.findIndex((item) => item.id === res.data.schedule.current)
        );
        setData(data);
      }
    });
  }, []);

  return (
    <APPLayout>
      <Row gutter={[30, 16]}>
        <Col xs={24} sm={24} md={8}>
          <CourseOverview {...data} cardCss={{ bodyStyle: { paddingBottom: 0 } }}>
            <StyledRow gutter={[6, 16]} justify="space-between" align="middle">
              {leftInfo.map((item, index) => (
                <StyledCol span={6} key={index}>
                  <b>{item.value}</b>
                  <p>{item.label}</p>
                </StyledCol>
              ))}
            </StyledRow>
          </CourseOverview>
        </Col>

        <Col xs={24} sm={24} md={16}>
          <Card>
            <h2 style={{ color: '#624AEB' }}>Course Detail</h2>

            <h3>Create Time</h3>
            <Row>{data?.ctime}</Row>

            <h3>Start Time</h3>
            <Row>{data?.startTime}</Row>

            <Badge color="#87d068" offset={[5, 10]}>
              <h3>Status</h3>
            </Badge>
            <StepsRow>
              <Steps current={processKey} size="small" style={{ width: 'auto' }}>
                {data?.schedule.chapters.map((item) => (
                  <Step title={item.name} key={item.id} style={{ overflow: 'initial' }} />
                ))}
              </Steps>
            </StepsRow>

            <h3>Course Code</h3>
            <Row>{data?.uid}</Row>

            <h3>Class Time</h3>
            <Row>
              {!!data?.schedule.classTime ? (
                <WeekCalendar data={data.schedule.classTime} />
              ) : (
                <div>wait for class Time arrange</div>
              )}
            </Row>

            <h3>Category</h3>
            {data?.type.map((item, index) => (
              <Tag color={tagColor[index]} key={index}>
                {item.name}
              </Tag>
            ))}

            <h3>Description</h3>
            {!!data?.detail ? <Row>{data.detail}</Row> : <Row>no detail</Row>}

            <h3>Chapter</h3>
            {data?.schedule && (
              <Collapse defaultActiveKey={data.schedule.current}>
                {data?.schedule.chapters.map((item) => (
                  <Collapse.Panel
                    key={item.id}
                    header={item.name}
                    extra={genExtra(item.id, data.schedule.current)}
                  >
                    <p>{item.content}</p>
                  </Collapse.Panel>
                ))}
              </Collapse>
            )}
          </Card>
        </Col>
      </Row>
    </APPLayout>
  );
}
