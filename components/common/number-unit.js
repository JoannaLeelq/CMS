import { Input, InputNumber, Select } from 'antd';
import React, { useState } from 'react';

export default function NumberWithUnit(props) {
  const { Option } = Select;
  console.log(props);
  const [number, setNumber] = useState(props.number);
  const [unit, setUnit] = useState(props.defaultUnit);

  const onNumberChange = (value) => {
    setNumber(value);
  };

  const onUnitChange = (value) => {
    setUnit(value);
  };

  return (
    <Input.Group compact>
      <InputNumber
        name="duration"
        onChange={onNumberChange}
        value={number}
        min={1}
        style={{ width: '85%' }}
      />
      <Select
        name="durationUnit"
        defaultValue="1"
        value={unit}
        onChange={onUnitChange}
        style={{ width: '15%' }}
      >
        {props.Option.map((item) => (
          <Option key={item.unit} value={item.unit}>
            {item.label}
          </Option>
        ))}
      </Select>
    </Input.Group>
  );
}
