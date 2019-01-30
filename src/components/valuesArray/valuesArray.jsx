import React from 'react';
import PropTypes from 'prop-types';

import './valuesArray.scss';

const ValuesArray = ({
  data
}) => {
  const output = [];
  data.forEach((item, index) => {
    output[index] = item;
  });
  output.reverse();

  return (
    <section className="valuesArray">
      <h2>Values</h2>
      {
        output.map((value, index) => (
        <div
          key={index}
          className="valuesArray-cellValue"
        >
          {value}
        </div>
        ))
      }
    </section>
  )
}

ValuesArray.propTypes = {
  data: PropTypes.array.isRequired,
}

export default ValuesArray;
