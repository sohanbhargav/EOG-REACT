import React from 'react';
import { Card, CardContent, Grid, makeStyles, Typography } from '@material-ui/core';

const useStyles = makeStyles({
  header: {
    backgroundColor: '#fafafa',
  },
  headerContent: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
  },
  mb8: {
    marginBottom: 8,
  },
});

const DashboardHeader = (props: any) => {
  const { metrics, selection, latestData } = props;
  const classes = useStyles();

  const getValue = (metric: string) => {
    if (selection.indexOf(metric) > -1) {
      const data = latestData.find((m: any) => m.metric === metric);
      return data !== undefined ? `${data.value}${data.unit}` : '';
    }
    return '';
  };

  return (
    <CardContent className={classes.header}>
      <Grid container spacing={2}>
        {metrics.map(
          (metric: string) =>
            getValue(metric) !== '' && (
              <Grid item lg={2} md={2} sm={2} xs={12} key={metric}>
                <Card>
                  <CardContent className={classes.headerContent}>
                    <Typography className={classes.mb8}>{metric}</Typography>
                    <Typography className={classes.mb8} variant="h5">
                      {getValue(metric)}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ),
        )}
      </Grid>
    </CardContent>
  );
};

export default DashboardHeader;
