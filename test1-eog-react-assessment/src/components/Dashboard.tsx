import { useSubscription, gql } from '@apollo/client';
import { makeStyles } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { client } from '../App';
import Chart from './Chart';
import DashboardHeader from './DashboardHeader';
import MetricSelect from './MetricSelect';
import {
  MEASUREMENTS_SUBSCRIPTION_QUERY,
  METRICS_QUERY,
  MULTIPLE_MEASUREMENTS_QUERY,
  LAST_HALF_AN_HOUR_MILLI_SECONDS,
} from './Queries';

const useStyles = makeStyles({
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '24px',
  },
});

// Get metrics list
const getMetricNames = async () => {
  const res = await client.query({
    query: gql`
      ${METRICS_QUERY}
    `,
  });
  return res.data.getMetrics;
};

// Get measurements for selected metrics
const getMulitpleMeasurementsData = async (metrics: string[]) => {
  const metricOptions = metrics.map(metric => {
    return `{ metricName: "${metric}", after: ${LAST_HALF_AN_HOUR_MILLI_SECONDS} }`;
  });
  const res = await client.query({
    query: gql`
      ${MULTIPLE_MEASUREMENTS_QUERY(metricOptions)}
    `,
  });
  return res.data.getMultipleMeasurements;
};

const transformToChartData = (data: any[]) => {
  const returnArr: Plotly.Data[] = [];
  const colorArr: string[] = ['#a83a32', '#2d8fa1', '#5ba12d', '#9c2894', '#e6ad8e', '#32403f'];
  data.forEach(metricNode => {
    let metricObj: any = {
      x: [],
      y: [],
      name: '',
      yaxis: '',
      type: 'scatter',
      line: { color: colorArr[data.indexOf(metricNode)] },
    };
    metricNode.measurements.forEach((measurement: any) => {
      (metricObj.x as Plotly.Datum[]).push(new Date(measurement.at));
      (metricObj.y as Plotly.Datum[]).push(measurement.value);
    });
    metricObj.name = metricNode.metric;
    switch (metricNode.measurements[0].unit) {
      case 'F':
        metricObj.yaxis = 'y';
        break;
      case 'PSI':
        metricObj.yaxis = 'y2';
        break;
      case '%':
        metricObj.yaxis = 'y3';
    }
    returnArr.push(metricObj);
  });
  return returnArr;
};

const Dashboard = () => {
  const [merticsSelection, setMetricsSelection] = useState<string[]>([]);
  const [metricNames, setMetricNames] = useState<(string | undefined)[]>([]);
  const [chartData, setChartData] = useState<any>([]);
  const [latestData, setLatestData] = React.useState<any[]>([]);
  const { loading, data } = useSubscription(MEASUREMENTS_SUBSCRIPTION_QUERY);
  const handleSelection = async (val: string[]) => {
    setMetricsSelection(val);
  };

  const classes = useStyles();

  useEffect(() => {
    const getMetricNamesList = async () => {
      const list = await getMetricNames();
      setMetricNames(list);
      let tempData: any[] = [];
      list.forEach((metric: string) => {
        tempData.push({ metric: metric, at: 0, value: 0, unit: '' });
      });
      setLatestData(tempData);
    };
    getMetricNamesList();
  }, []);

  useEffect(() => {
    if (data) {
      let latestDataTemplate = latestData.map((measurement: any) => {
        return measurement.metric === data.newMeasurement.metric ? data.newMeasurement : measurement;
      });
      setLatestData(latestDataTemplate);
    }
  }, [data]);

  useEffect(() => {
    const fetchMultipleMeasurements = async () => {
      const multipleMetricsData = await getMulitpleMeasurementsData(merticsSelection);
      if (multipleMetricsData.length > 0) {
        setChartData(transformToChartData(multipleMetricsData));
      }
    };
    fetchMultipleMeasurements();
  }, [merticsSelection, data]);

  if (loading)
    return (
      <div className={classes.loadingContainer}>
        <p>Loading...</p>
      </div>
    );
  return (
    <div>
      {metricNames && <MetricSelect metrics={metricNames} onMetricChange={handleSelection} />}
      {chartData.length > 0 && (
        <DashboardHeader metrics={metricNames} selection={merticsSelection} latestData={latestData} />
      )}
      {chartData.length > 0 && <Chart chartData={chartData} />}
    </div>
  );
};

export default Dashboard;
