import classNames from 'classnames';
import useMergedState from 'rc-util/lib/hooks/useMergedState';
import type { FC } from 'react';
import React, { useMemo } from 'react';
import Collapse from '../../collapse';
import { useLocale } from '../../locale';
import type { Color } from '../color';
import type { ColorPickerBaseProps, PresetsItem } from '../interface';
import { generateColor } from '../util';

const { Panel } = Collapse;

interface ColorPresetsProps
  extends Pick<ColorPickerBaseProps, 'presets' | 'prefixCls' | 'direction'> {
  value?: Color;
  onChange?: (value: Color) => void;
}

const genPresetColor = (list: PresetsItem[]) =>
  list.map((value) => {
    value.colors = value.colors.map((color) => generateColor(color));
    return value;
  });

const isBright = (value: Color) => {
  const { r, g, b, a } = value.toRgb();
  if (a <= 0.5) {
    return true;
  }
  return r * 0.299 + g * 0.587 + b * 0.114 > 192;
};

const ColorPresets: FC<ColorPresetsProps> = ({
  prefixCls,
  presets = [],
  value: color,
  onChange,
  direction,
}) => {
  const [locale] = useLocale('ColorPicker');
  const [presetsValue] = useMergedState(genPresetColor(presets), {
    value: genPresetColor(presets),
    postState: (item) => genPresetColor(item),
  });
  const colorPresetsPrefixCls = `${prefixCls}-presets`;

  const activeKey = useMemo(
    () => presetsValue.map((preset) => `panel-${preset.label}`),
    [presetsValue],
  );

  const handleClick = (colorValue: Color) => {
    onChange?.(colorValue);
  };

  return (
    <div className={colorPresetsPrefixCls}>
      <Collapse defaultActiveKey={activeKey} ghost>
        {presetsValue.map((preset) => (
          <Panel
            header={<div className={`${colorPresetsPrefixCls}-label`}>{preset?.label}</div>}
            key={`panel-${preset?.label}`}
          >
            <div className={`${colorPresetsPrefixCls}-items`}>
              {Array.isArray(preset?.colors) && preset?.colors.length > 0 ? (
                preset.colors.map((presetColor: Color) => (
                  <div
                    key={`preset-${presetColor.toHexString()}`}
                    className={classNames(`${colorPresetsPrefixCls}-color`, {
                      [`${colorPresetsPrefixCls}-color-checked`]:
                        presetColor.toHexString() === color?.toHexString(),
                    })}
                    onClick={() => handleClick(presetColor)}
                  >
                    <div
                      className={classNames(`${colorPresetsPrefixCls}-color-box`, {
                        [`${colorPresetsPrefixCls}-color-box-rtl`]: direction === 'rtl',
                        [`${colorPresetsPrefixCls}-color-bright`]: isBright(presetColor),
                      })}
                    >
                      <div className={`${colorPresetsPrefixCls}-color-block`} />
                      <div
                        className={`${colorPresetsPrefixCls}-color-layer`}
                        style={{
                          background: generateColor(presetColor).toRgbString(),
                        }}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <span className={`${colorPresetsPrefixCls}-empty`}>{locale.presetEmpty}</span>
              )}
            </div>
          </Panel>
        ))}
      </Collapse>
    </div>
  );
};
export default ColorPresets;
