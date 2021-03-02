import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';
import HighchartsExporting from 'highcharts/modules/exporting';
import { useEffect, useState } from 'react';

export default function Pie({ data, title, subtitle }) {
  const [options, setOptions] = useState({
    chart: {
      plotBackgroundColor: null,
      plotBorderWidth: null,
      plotShadow: false,
      type: 'pie',
    },
    tooltip: {
      pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b> <br> total:{point.y}',
    },
    accessibility: {
      point: {
        valueSuffix: '%',
      },
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: 'pointer',
        dataLabels: {
          enabled: true,
          format: '<br>{point.name}: {point.percentage:.1f} %',
        },
      },
    },
    credits: {
      enabled: false,
    },
    exporting: {
      enabled: false,
    },
  });

  useEffect(() => {
    if (!data) {
      return;
    }

    const dataSource = data.map((item) => ({ name: item.name, y: item.amount }));

    const option = {
      title: {
        text: title,
      },
      subtitle: {
        text: subtitle,
        align: 'right',
      },
      series: [
        {
          name: 'percentage',
          colorByPoint: true,
          data: dataSource,
        },
      ],
    };
    setOptions(option);
  }, [data]);
  return <HighchartsReact highcharts={Highcharts} options={options}></HighchartsReact>;
}
