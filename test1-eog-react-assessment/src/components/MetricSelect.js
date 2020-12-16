import React from 'react';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles, CardContent, Typography } from '@material-ui/core';

const useStyles = makeStyles({
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    alignItems: 'center'
  },
  width300: {
    minWidth: '300px',
  },
  mb8: {
    marginBottom: 8,
  },
});

const MetricSelect = ({ metrics, onMetricChange }) => {
  const [list, setList] = React.useState([]);
  const classes = useStyles();

  const handleChange = event => {
    setList(event.target.value);
    onMetricChange(event.target.value);
  };

  return (
    <CardContent className={classes.header}>
      <Typography variant="h5">Dashboard Chart</Typography>
      <Select
        label="Select Metric"
        className={classes.width300}
        variant="outlined"
        id="list"
        multiple
        value={list}
        onChange={handleChange}
      >
        {metrics.map((metric, index) => (
          <MenuItem key={index} value={metric}>
            {metric}
          </MenuItem>
        ))}
      </Select>
    </CardContent>
  );
};

export default MetricSelect;
