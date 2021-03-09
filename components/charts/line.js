import React from 'react';
import { useEffect, useState } from 'react';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';
import styled from 'styled-components';

export default function Line({ data }) {
  // const chartCallback = (chart) => {
  //   setTimeout(() => {
  //     chart.reflow();
  //   },30);
  // };
  const [options, setOptions] = useState({
    chart: {
      type: 'line',
    },
    title: {
      text: null,
    },

    xAxis: {
      categories: [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ],
    },
    yAxis: {
      title: {
        text: 'Increment',
      },
    },
    exporting: {
      enabled: false,
    },
  });

  useEffect(() => {
    if (!data) {
      return;
    }

    const dataSource = data.map((item) => ({ name: item.name.split('-')[1], amount: item.amount }));
    const seriesData = new Array(12).fill(0).map((_, index) => {
      const month = index + 1;
      const courseAmount = dataSource
        .filter((item) => item.name == month)
        .reduce((acc, cur) => acc + cur.amount, 0);

      return courseAmount;
    });

    setOptions({
      series: [
        {
          name: 'course',
          data: seriesData,
        },
      ],
    });
  }, [data]);
  return (
    <HighchartsReact
      highcharts={Highcharts}
      options={options}
      // callback={chartCallback}
    ></HighchartsReact>
  );
}
