import { gql } from '@apollo/client';

export const LAST_HALF_AN_HOUR_MILLI_SECONDS = new Date(Date.now() - 60 * 30000).getTime();

export const METRICS_QUERY = gql`
  query {
    getMetrics
  }
`;

export const MULTIPLE_MEASUREMENTS_QUERY = (inputQuery: string[]) => {
  return `
 query {
   getMultipleMeasurements(input: [${inputQuery}]){
     metric,
     measurements {
       metric,
       at,
       value,
       unit
     }
   }
 }
`;
};

export const MEASUREMENTS_SUBSCRIPTION_QUERY = gql`
  subscription {
    newMeasurement {
      metric
      at
      value
      unit
    }
  }
`;
