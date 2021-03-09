import React from 'react';
import { useEffect, useState, useRef } from 'react';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';

if (typeof Highcharts === 'object') {
  require('highcharts/modules/heatmap')(Highcharts);
  require('highcharts/modules/exporting')(Highcharts);
}

function getPointCategoryName(point, dimension) {
  var series = point.series,
    isY = dimension === 'y',
    axis = series[isY ? 'yAxis' : 'xAxis'];
  return axis.categories[point[isY ? 'y' : 'x']];
}

export default function HeatMap({ data, title }) {
  const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const xAxis = [...weekdays, 'TOTAL'];
  const [options, setOptions] = useState({
    chart: {
      type: 'heatmap',
      marginTop: 40,
      marginBottom: 80,
      plotBorderWidth: 1,
    },

    title: {
      text: 'Course Schedule Per Weekday',
    },

    xAxis: {
      categories: xAxis,
    },

    accessibility: {
      point: {
        descriptionFormatter: function (point) {
          var ix = point.index + 1,
            xName = getPointCategoryName(point, 'x'),
            yName = getPointCategoryName(point, 'y'),
            val = point.value;
          return ix + '. ' + xName + ' sales ' + yName + ', ' + val + '.';
        },
      },
    },

    colorAxis: {
      min: 0,
      minColor: '#FFFFFF',
      maxColor: '#1890ff',
    },

    legend: {
      align: 'right',
      layout: 'vertical',
      margin: 0,
      verticalAlign: 'top',
      y: 25,
      symbolHeight: 280,
    },

    tooltip: {
      formatter: function () {
        return `<b> ${getPointCategoryName(this.point, 'y')}</b>
             <br/>
             <b>${this.point.value}</b> lessons on <b>${getPointCategoryName(this.point, 'x')}</b>`;
      },
    },

    credits: {
      enabled: false,
    },
    exporting: {
      enabled: false,
    },

    dataLabels: {
      enabled: true,
      color: '#000000',
    },
    responsive: {
      rules: [
        {
          condition: {
            maxWidth: 500,
          },
          chartOptions: {
            yAxis: {
              labels: {
                formatter: function () {
                  return this.value.charAt(0);
                },
              },
            },
          },
        },
      ],
    },
  });

  const charRef = useRef(null);

  useEffect(() => {
    const { chart } = charRef.current;
    const timer = setTimeout(() => {
      chart.reflow();
    }, 30);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    if (!data) {
      return;
    }

    const allCourses = data.map((item) => item.name);
    const yCategories = [...allCourses, 'TOTAL'];

    const courses = data.map((item) => {
      const timeArr = new Array(7).fill(0);
      const courseName = item.name;

      const classTimeArray = item.courses.filter((item) => item.classTime != null);
      const courseTime =
        classTimeArray.length > 0
          ? classTimeArray.map((item) => {
              const classTime = item.classTime.map((singleTime) => singleTime.split(' ')[0]);
              classTime.forEach((weekday) => {
                const index = weekdays.findIndex((item) => item === weekday);
                timeArr[index] += 1;
              });

              return timeArr;
            })
          : [timeArr];
      const xAxisArray = courseTime[0].concat(courseTime[0].reduce((acc, cur) => acc + cur, 0));

      return {
        name: courseName,
        schedule: xAxisArray,
      };
    });

    const dataSource = courses.map((item) => {
      const yIndex = yCategories.findIndex((course) => course === item.name);
      const result = item.schedule.map((courseNum, index) => [index, yIndex, courseNum]);

      return result;
    });

    const lastRow = [];

    for (let i = 0; i < xAxis.length; i++) {
      const columnSum = dataSource
        .flat()
        .filter((item) => item[0] === i)
        .reduce((acc, cur) => acc + cur[2], 0);
      lastRow.push([i, yCategories.length - 1, columnSum]);
    }

    const seriesDataSource = dataSource.flat().concat(lastRow);

    setOptions({
      yAxis: {
        categories: yCategories,
        title: null,
        reversed: true,
      },
      series: [
        {
          name: 'course number per day',
          borderWidth: 1,
          data: seriesDataSource,
          dataLabels: {
            enabled: true,
            color: '#000000',
          },
        },
      ],
    });
  }, [data]);

  return (
    <HighchartsReact highcharts={Highcharts} options={options} ref={charRef}></HighchartsReact>
  );
}
