import React, { useState, useEffect } from 'react';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';

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
      // pointFormat: 'Interest: <b>{point.y:.1f}</b>',
      formatter: function () {
        return (
          '<b>' +
          this.x +
          '</b><br/>' +
          this.series.name +
          ': ' +
          this.y +
          '<br/>' +
          'Total: ' +
          this.point.stackTotal
        );
      },
    },

    plotOptions: {
      column: {
        stacking: 'normal',
        dataLabels: {
          enabled: true,
        },
      },
    },
    exporting: {
      enabled: false,
    },
  });

  useEffect(() => {
    if (!data || Object.values(data).some((item) => !item)) {
      return;
    }

    const teacherKeys = Object.keys(data.teacher);
    const interestKeys = data.interest.map((item) => item.name);
    const xAxisData = [...teacherKeys, ...interestKeys];
    const xAxisSource = Array.from(new Set(xAxisData));

    const dataInterest = data.interest.map((item) => {
      return [item.name, item.amount];
    });

    // level for teacher skills
    const levelArr = Object.values(data.teacher)
      .flat()
      .map((item) => item.level);
    const levels = levelArr
      .filter((ele, index, self) => {
        return index == self.indexOf(ele);
      })
      .sort();

    // handle teacher skill data group by level   [ "Assembly Language", 30 ]
    const teacherData = Object.entries(data.teacher);

    const categoriesData = levels.map((level) =>
      teacherData.map((item) => {
        const targetObj = item[1]?.find((singleObj) => singleObj.level === level);
        const amount = !!targetObj ? targetObj.amount : 0;
        return [item[0], amount];
      })
    );

    const leveledData = categoriesData.map((item, index) => {
      return {
        name: `level ${index + 1}`,
        data: item,
        stack: 'teacherSkill',
      };
    });

    const seriesData = [
      ...leveledData,
      {
        name: 'Interest',
        data: dataInterest,
        stack: 'interest',
      },
    ];

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
        categories: xAxisSource,
      },

      series: seriesData,
    });
  }, [data]);

  return (
    <HighchartsReact
      highcharts={Highcharts}
      options={options}
      constructorType={'chart'}
    ></HighchartsReact>
  );
}
