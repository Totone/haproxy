import React from 'react';
import LineChart from 'react-linechart';
import PropTypes from 'prop-types';

import './chart.scss';

const Chart = ({
  data,
  size,
}) => {
  if (window.innerWidth < 480)
    size = window.innerWidth;
  return(
    <section className="chart">
      <LineChart
        id="chart"
        width={size}
        height={size}
        data={data}
        hideXAxis={true}
        hideYLabel={true}
      />  
    </section>
  )
}

Chart.propTypes = {
  data: PropTypes.array.isRequired,
  size: PropTypes.number,
}

Chart.defaultProps = {
  size: 500,
}

export default Chart;
