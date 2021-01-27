import { Table } from 'antd';
import React from 'react';

export default function WeekCalendar(props) {
  if (!props) {
    return <></>;
  }
  const { data } = props;

  const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const columns = weekdays.map((weekday) => ({
    title: weekday,
    dataIndex: weekday,
    key: weekday,
    render: () => {
      const target = data.find((item) => item.includes(weekday));

      if (target) {
        return target.split(' ')[1];
      }
      return null;
    },
  }));

  //   const columns = [
  //     {
  //       title: 'Sunday',
  //       dataIndex: 'sunday',
  //       key: 'sunday',
  //       render: (text, record) => {
  //           const target = data.find(item => item.toLocaleLowerCase().includes('Sunday'))
  //           if(target){
  //               return target.split(' ')[1];
  //           }
  //           return null;
  //       }
  //     },
  //     {
  //       title: 'Monday',
  //       dataIndex: 'monday',
  //       key: 'monday',
  //     },
  //     {
  //       title: 'Tuesday',
  //       dataIndex: 'tuesday',
  //       key: 'tuesday',
  //     },
  //     {
  //       title: 'Wednesday',
  //       dataIndex: 'wednesday',
  //       key: 'wednesday',
  //     },
  //     {
  //       title: 'Thursday',
  //       dataIndex: 'thursday',
  //       key: 'thursday',
  //     },
  //     {
  //       title: 'Friday',
  //       dataIndex: 'friday',
  //       key: 'friday',
  //     },
  //     {
  //       title: 'Saturday',
  //       dataIndex: 'saturday',
  //       key: 'saturday',
  //     },
  //   ];

  const dataSource = data.map((item, index) => {
    const itemList = item.split(' ');
    let itemObj = {};
    itemObj.key = index;
    itemObj[itemList[0].toLocaleLowerCase()] = itemList[1];
    return itemObj;
  });

  return (
    <Table
      bordered
      rowKey="1"
      size="small"
      columns={columns}
      dataSource={[new Array(7).fill({ id: 0 })]}
      pagination={false}
      tableLayout="fixed"
    ></Table>
  );
}
