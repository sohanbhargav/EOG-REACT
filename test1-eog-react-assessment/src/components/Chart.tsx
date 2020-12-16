import React from 'react';
import Plot from 'react-plotly.js';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  chart: {
    width: '100%',
    height: '100%',
  },
});

export default (props: any) => {
  const classes = useStyles();
  const tempPresent = props.chartData.filter((node: any) => node.yaxis === 'y').length > 1;
  return (
    <Plot
      className={classes.chart}
      data={props.chartData}
      layout={{
        margin: { t: 100, b: 100 },
        autosize: true,
        xaxis: { domain: [0.1, 1], fixedrange: true },
        yaxis: {
          title: 'temperature (F)',
          showline: true,
          zeroline: false,
          ticks: 'outside',
          visible: tempPresent,
          fixedrange: true,
        },
        yaxis2: {
          title: 'pressure (PSI)',
          overlaying: 'y',
          anchor: 'free',
          position: -0.1,
          side: 'left',
          showline: true,
          zeroline: false,
          tickmode: 'auto',
          ticks: 'inside',
          ticklen: 20,
          tickcolor: '#b8b8b8',
          fixedrange: true,
        },
        yaxis3: {
          title: 'injection valve opening (%)',
          overlaying: 'y',
          side: 'right',
          showline: true,
          zeroline: false,
          ticks: 'outside',
          fixedrange: true,
        },
        legend: { orientation: 'h', y: 1.2 },
      }}
      config={{
        displayModeBar: false,
      }}
    />
  );
};
