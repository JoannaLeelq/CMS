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

const genExtra = (sourcedata, processKey) => {
  if (sourcedata.id === processKey) {
    return <Tag color={'green'}>processing</Tag>;
  }

  if (sourcedata.id > processKey) {
    return <Tag color={'orange'}>wait</Tag>;
  }

  if (sourcedata.id < processKey) {
    return <Tag color={'default'}>finish</Tag>;
  }
};

export async function getServerSideProps(context) {
  // console.log(context);
  return {
    props: { id: context.params.id },
  };
}

export default function CourseDetail(props) {
  const router = useRouter();
  const [leftInfo, setLeftInfo] = useState([]);
  const [processKey, setProcessKey] = useState(0);
  const [data, setData] = useState();
  console.log(router);

  useEffect(() => {
    const id = router.query.id || props.id;
    apiService.getCourseDetail({ id }).then((res) => {
      console.log('res', res);
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

  // return <div>this is detail page</div>;

  return (
    <APPLayout>
      <Row gutter={[30, 16]}>
        <Col span={8}>
          <CourseOverview {...data}>
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

        {/* <Col span={16}>
          <Card>
            <h2 style={{ color: '#624AEB' }}>Course Detail</h2>

            <h3>Create Time</h3>
            <Row>{data?.ctime}</Row>

            <h3>Start Time</h3>
            <Row>{data?.startTime}</Row>

            <Badge color="#87d068" offset={[5, 24]}>
              <h3>Status</h3>
            </Badge>
            <Steps current={processKey}>
              {data?.schedule.chapters.map((item) => (
                <Steps.Step title={item.name} key={item.id} />
              ))}
            </Steps>

            <h3>Course Code</h3>
            <Row>{data?.uid}</Row>

            <h3>Class Time</h3>
            <WeekCalendar data={data?.schedule.classTime} />

            <h3>Category</h3>
            <Tag color="processing">{data?.typeName}</Tag>

            <h3>Description</h3>
            {!!data?.detail ? <Row>{data.detail}</Row> : <Row>no detail</Row>}

            <h3>Chapter</h3>
            {data?.schedule && (
              <Collapse defaultActiveKey={data?.schedule.current}>
                {data?.schedule.chapters.map((item) => (
                  <Collapse.Panel
                    key={item.id}
                    header={item.name}
                    extra={genExtra(item, data.schedule.current)}
                  >
                    <p>{item.content}</p>
                  </Collapse.Panel>
                ))}
              </Collapse>
            )}
          </Card>
        </Col> */}
      </Row>
    </APPLayout>
  );
}
