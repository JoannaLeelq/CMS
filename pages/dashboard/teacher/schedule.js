import APPLayout from '../../../components/layout/Layout';
import styled from 'styled-components';
import React, { useState, useEffect, useCallback } from 'react';
import { Calendar, Card, Col, Descriptions, Modal, Row, Tooltip } from 'antd';
import apiService from '../../../lib/services/api-service';
import storage from '../../../lib/services/storage';
import { getMonth, getYear, add } from 'date-fns';

function generateClassCalendar(course) {
  const startTime = '2005-11-12 08:00:00';
  const endTime = add(new Date(2014, 8, 1), { years: 2, months: 9, weeks: 1, days: 7 });
  console.log('%c [ endTime ]', 'font-size:13px; background:pink; color:#bf2c9f;', endTime);
}

export default function Schedule() {
  const [data, setData] = useState([]);
  const userId = storage.getUserInfo().userId;

  const dateCellRender = (value) => {
    const listData = data.map();

    return (
      <>
        {listData.map((item, index) => (
          <Row gutter={[6, 6]} key={index} style={{ fontSize: 12 }}>
            <Col span={1}>
              <ClockCircleOutlined />
            </Col>
          </Row>
        ))}
      </>
    );
  };

  const monthCellRender = (current) => {
    const month = getMonth(current);
    const year = getYear(current);
    const result = data.map((course) => {
      const result = course;
    });
  };

  useEffect(() => {
    apiService.getClassSchedule({ userId: userId }).then((res) => {
      const { data } = res;
      const classScheduleList = data?.map((course) => ({
        ...course,
        calendar: generateClassCalendar(course),
      }));

      setData(classScheduleList);
    });
  }, []);

  return (
    <APPLayout>
      <Card title="My Class Schedule">
        <Calendar monthCellRender={monthCellRender} />
      </Card>
    </APPLayout>
  );
}
