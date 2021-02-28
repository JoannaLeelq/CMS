import React from 'react';
import { useEffect, useState } from 'react';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';
import apiService from '../../lib/services/api-service';

export default function Bar({ data }) {
  const [options, setOptions] = useState({
    chart: {
      type: 'column',
    },
    title: {
      text: 'Student VS Teacher',
    },
    subtitle: {
      text: 'Comparing what students are interested in and teachers’ skills',
    },

    yAxis: {
      min: 0,
      title: {
        text: 'Interested VS Skills',
      },
    },
    legend: {
      enabled: false,
    },
    tooltip: {
      pointFormat: 'Interest: <b>{point.y:.1f}</b>',
    },
  });

  useEffect(() => {
    if (!data) {
      return;
    }

    const dataSource = data.map((item) => [item.name, item.amount]);

    setOptions({
      xAxis: {
        type: 'category',
        labels: {
          rotation: -45,
          style: {
            fontSize: '13px',
            fontFamily: 'Verdana, sans-serif',
          },
        },
      },
      series: [
        {
          name: 'Interest',
          data: dataSource,
          dataLabels: {
            enabled: true,
            inside: true,
            color: '#ffffff',
            align: 'right',
            format: '{point.y:.1f}', // one decimal
            y: 10, // 10 pixels down from the top
            style: {
              fontSize: '12px',
              fontFamily: 'Verdana, sans-serif',
            },
          },
        },
      ],
    });
  }, [data]);
  return <HighchartsReact highcharts={Highcharts} options={options}></HighchartsReact>;
}
