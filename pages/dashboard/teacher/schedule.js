import APPLayout from '../../../components/layout/Layout';
import styled from 'styled-components';
import React, { useState, useEffect, useCallback } from 'react';
import { Calendar, Card, Col, Descriptions, Modal, Row, Tooltip } from 'antd';
import apiService from '../../../lib/services/api-service';
import storage from '../../../lib/services/storage';
import { getMonth, getYear, add, isSameDay } from 'date-fns';
import { DurationUnit, Weekdays } from '../../../lib/constant/duration';
import { ClockCircleOutlined, NotificationFilled } from '@ant-design/icons';
import _ from 'lodash';

function generateClassCalendar(course) {
  if (!course.schedule.classTime) {
    return [];
  }

  const startTime = course.startTime; // '2005-11-12 08:00:00'

  const regex = /\d+\-\d+\-\d+/;
  const dateArray = startTime.match(regex)[0].split('-');

  //if the durationUnit is null, set as default value
  const durationUnit = !!course.durationUnit ? DurationUnit[course.durationUnit] : DurationUnit[1];

  const endTime = add(new Date(dateArray[0], dateArray[1] - 1, dateArray[2]), {
    [durationUnit]: !!course.duration ? course.duration : 1,
  });

  const startDateStr = startTime.split(' ')[0];
  const endDateStr = [endTime.getFullYear(), endTime.getMonth() + 1, endTime.getDate()].join('-');
  const weekdayValues = course.schedule.classTime.map((item) => {
    const index = Weekdays.findIndex((weekday) => weekday === item.split(' ')[0]);
    return { [index]: item.split(' ')[1] };
  });

  /**expected value format:  [
    {
      startDate: startDateStr,
      endDate: endDateStr,
      weekday: 1,
      time: '08:00:00',
      content: 'test',
    },
  ];
  */
  const result = weekdayValues.map((weekday) => ({
    startDate: startDateStr,
    endDate: endDateStr,
    weekday: Object.keys(weekday)[0],
    time: Object.values(weekday)[0],
    content: {
      courseName: course.name,
      chaptNo: 0,
      courseTypes: !!course.type ? course.type.map((item) => item.name) : null,
      teacherName: course.teacherName,
    },
  }));
  return result;
}
/** according to the date to get data
 * const data = [
  {
    startDate: '2021-02-03',
    endDate: '2021-05-03',
    weekday: 1,
    time: '08:00:00',
    content: {},
  },
];
 */
function getListData(item, value) {
  const target = parseInt(item.weekday);

  let listData;

  if (
    value >= new Date(Date.parse(item.startDate)) &&
    value <= new Date(Date.parse(item.endDate))
  ) {
    switch (value.weekday()) {
      case target:
        listData = [{ time: item.time, content: item.content }];
        break;

      default:
    }
  }

  return listData || [];
}

function getMonthListData(item, value) {
  const endDateArr = item.endDate.split('-');
  const startStr = item.startDate.split('-').slice(0, 2).join('-');

  let listData = [];
  if (
    value >= new Date(Date.parse(startStr)) &&
    value < new Date(endDateArr[0], endDateArr[1], '0')
  ) {
    listData.push(item);
  }
  return listData || [];
}

// calculate the lessons number
function handleMonthList(monthList) {
  const allCourseNames = monthList.map((item) => item.content.courseName);
  let statistic = {};

  for (let i = 0, len = allCourseNames.length; i <= len - 1; i++) {
    var item = allCourseNames[i];
    statistic[item] = statistic[item] + 1 || 1;
  }

  const result = monthList.map((item) => {
    // const itemStatistic = { [item.content.courseName]: statistic[item.content.courseName] };
    return {
      courseName: item.content.courseName,
      startDate: item.startDate,
      endDate: item.endDate,
      statistic: statistic[item.content.courseName],
    };
  });

  let handleResult = [];

  for (let i = 0, len = result.length; i <= len - 1; i++) {
    if (i == 0) {
      handleResult.push(result[i]);
    } else {
      const targetIndex = handleResult.findIndex(
        (item) => item.courseName === result[i].courseName
      );
      if (targetIndex == -1) {
        handleResult.push(result[i]);
      }
    }
  }
  console.log(
    '%c [ handleResult ]',
    'font-size:13px; background:pink; color:#bf2c9f;',
    handleResult
  );
  return handleResult;
}

export default function Schedule() {
  const [data, setData] = useState([]);
  const [classInfo, setClassInfo] = useState(null);

  const dateCellRender = (current) => {
    const flatCalendar = data.map((item) => item.calendar).flat();

    const listData = flatCalendar
      .map((item) => {
        return getListData(item, current);
      })
      .flat();

    return (
      <>
        {listData.map((item, index) => {
          return (
            <Row
              gutter={[2, 2]}
              key={index}
              style={{ fontSize: 12 }}
              onClick={() => setClassInfo(item)}
            >
              <Col xs={1}>
                <ClockCircleOutlined />
              </Col>
              <Col xs={22} md={8} offset={1}>
                {item.time}
              </Col>
              <Col xs={24} md={8} style={{ color: 'orange' }}>
                {item.content.courseName}
              </Col>
            </Row>
          );
        })}
      </>
    );
  };

  const monthCellRender = (current) => {
    const flatCalendar = data.map((item) => item.calendar).flat();

    const listData = flatCalendar

      .map((item) => {
        const monthContent = getMonthListData(item, current);
        return monthContent;
      })
      .flat();

    const monthCourseStatistic = handleMonthList(listData);

    return (
      <>
        {monthCourseStatistic.map((item, index) => {
          return (
            <>
              <Row gutter={[3, 3]} key={index}>
                <Col>
                  <b>{item.startDate}</b>
                </Col>
                <Col>
                  <b>{item.endDate}</b>
                </Col>
                <Col>
                  <b>{item.courseName}</b>
                </Col>
                <Col>
                  <b>{item.statistic}</b>
                </Col>
              </Row>
            </>
          );
        })}
      </>
    );
  };

  useEffect(() => {
    const userId = storage ? storage.getUserInfo()['userId'] : null;
    apiService.getClassSchedule({ userId: userId }).then((res) => {
      const { data } = res;

      /**
       * calendar needs to write as the below format
       calendar: [
          {
            startDate: '2021-02-03',
            endDate: '2021-05-03',
            weekday: 1,
            time: '08:00:00',
            content: 'test',
          },
          {
            startDate: '2021-01-03',
            endDate: '2021-06-03',
            weekday: 3,
            time: '08:00:00',
            content: 'test 02',
          },
        ],
       */

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
        <Calendar dateCellRender={dateCellRender} monthCellRender={monthCellRender} />
      </Card>

      <Modal
        title="Class Info"
        visible={!!classInfo}
        footer={null}
        onCancel={() => setClassInfo(null)}
      >
        <Descriptions>
          <Descriptions.Item span={8} label="Course Name ">
            {classInfo?.content.courseName}
          </Descriptions.Item>
          <Descriptions.Item span={8} label="Chapter N.O ">
            {classInfo?.content.chaptNo}
          </Descriptions.Item>
          <Descriptions.Item span={8} label="Course Type ">
            {!!classInfo?.content.courseTypes
              ? classInfo?.content.courseTypes.map((item) => (
                  <span style={{ paddingLeft: '15px' }}>{item}</span>
                ))
              : null}
          </Descriptions.Item>
          <Descriptions.Item span={8} label="Teacher Name ">
            {classInfo?.content.teacherName}
          </Descriptions.Item>
          <Descriptions.Item span={8} label="Class Time ">
            {classInfo?.time}
            <Tooltip title="Remend me">
              <NotificationFilled style={{ color: '#1890ff', marginLeft: 10, cursor: 'pointer' }} />
            </Tooltip>
          </Descriptions.Item>
          <Descriptions.Item span={8} label="Chapter Name "></Descriptions.Item>
          <Descriptions.Item span={8} label="Chapter Content "></Descriptions.Item>
        </Descriptions>
      </Modal>
    </APPLayout>
  );
}
