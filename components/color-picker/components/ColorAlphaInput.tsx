import type { FC } from 'react';
import React, { useEffect, useState } from 'react';
import type { Color } from '../color';
import type { ColorPickerBaseProps } from '../interface';
import { generateColor, getAlphaColor } from '../util';
import ColorSteppers from './ColorSteppers';

interface ColorAlphaInputProps extends Pick<ColorPickerBaseProps, 'prefixCls'> {
  value?: Color;
  onChange?: (value: Color) => void;
}

const ColorAlphaInput: FC<ColorAlphaInputProps> = ({ prefixCls, value, onChange }) => {
  const ColorAlphaInputPrefixCls = `${prefixCls}-alpha-input`;
  const [alphaValue, setAlphaValue] = useState(generateColor(value || '#000'));

  // Update step value
  useEffect(() => {
    if (value) {
      setAlphaValue(value);
    }
  }, [value]);

  const handleAlphaChange = (step: number) => {
    const hsba = alphaValue.toHsb();
    hsba.a = (step || 0) / 100;
    const genColor = generateColor(hsba);
    if (value) {
      onChange?.(genColor);
    } else {
      setAlphaValue(genColor);
    }
  };

  return (
    <ColorSteppers
      value={getAlphaColor(alphaValue)}
      prefixCls={prefixCls}
      formatter={(step) => `${step}%`}
      className={ColorAlphaInputPrefixCls}
      onChange={handleAlphaChange}
    />
  );
};

export default ColorAlphaInput;
