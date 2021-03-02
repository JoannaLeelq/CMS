import React from 'react';
import { useEffect, useState } from 'react';
import Highcharts from 'highcharts/highmaps';
import HighchartsReact from 'highcharts-react-official';
import HighchartsExporting from 'highcharts/modules/exporting';

import apiService from '../../lib/services/api-service';

if (typeof Highcharts === 'object') {
  HighchartsExporting(Highcharts);
}

export default function Distribution({ data, title }) {
  const [world, setWorld] = useState(null);

  const [options, setOptions] = useState({
    colorAxis: {
      min: 0,
      stops: [
        [0, '#EFEFFF'],
        [0.5, Highcharts.getOptions().colors[0]],
        [1, Highcharts.color(Highcharts.getOptions().colors[0]).brighten(-0.5).get()],
      ],
    },
    legend: {
      layout: 'vertical',
      align: 'left',
      verticalAlign: 'bottom',
    },
  });

  useEffect(() => {
    (async () => {
      const res = await apiService.getWorld();

      setWorld(res.data);
      setOptions({
        series: [{ mapData: res.data }],
      });
    })();
  }, []);

  useEffect(() => {
    if (!data || !world) {
      return;
    }

    const distributionData = data.map((item) => {
      const targetCountry = world.features.find(
        (feature) => item.name.toLowerCase() === feature.properties.name.toLowerCase()
      );

      return !!targetCountry
        ? {
            'hc-key': targetCountry.properties['hc-key'],
            value: item.amount,
          }
        : {};
    });

    const options = {
      title: {
        text: `${title}`,
      },

      series: [
        {
          data: distributionData,
          mapData: world,
          name: 'Total',
          states: {
            hover: {
              color: '#a4edba',
            },
          },
        },
      ],
    };

    setOptions(options);
  }, [data, world]);

  return <HighchartsReact highcharts={Highcharts} constructorType={'mapChart'} options={options} />;
}
