import React, { useState } from "react";
import { Radio } from "./Radio";
import { Radio as RadioAntd, Space } from 'antd';
import PropTypes from 'prop-types';

export const RadioGroup = ({direction}) => {
  const options = [
    {value: 1, text: 'A'},
    {value: 2, text: 'A'},
    {value: 3, text: 'A'},
    {value: 4, text: 'A'}
  ]

  const [value, setValue] = useState(1)
  return (
    <RadioAntd.Group onChange={(e) => setValue(e.target.value)} value={value}>
       <Space direction={direction}>
        {options.map(radio => (
          <Radio optionType="button" buttonStyle="solid" value={radio.value} checked={radio.value === value} key={radio.value}>{radio.text}</Radio>
        ))}
      </Space>
    </RadioAntd.Group>
  );
}

RadioGroup.propTypes = {
  direction: PropTypes.oneOf(['vertical', 'horizontal']),
}

RadioGroup.defaultProps = {
  direction: 'vertical',
}