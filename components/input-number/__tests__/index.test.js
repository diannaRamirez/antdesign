import React from 'react';
import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons';
import InputNumber from '..';
import focusTest from '../../../tests/shared/focusTest';
import mountTest from '../../../tests/shared/mountTest';
import rtlTest from '../../../tests/shared/rtlTest';
import { fireEvent, render } from '../../../tests/utils';

describe('InputNumber', () => {
  focusTest(InputNumber);
  mountTest(InputNumber);
  rtlTest(InputNumber);

  // https://github.com/ant-design/ant-design/issues/13896
  it('should return null when blur a empty input number', () => {
    const onChange = jest.fn();
    const { container } = render(<InputNumber defaultValue="1" onChange={onChange} />);
    fireEvent.change(container.querySelector('input'), { target: { value: '' } });
    expect(onChange).toHaveBeenLastCalledWith(null);
  });

  it('should call onStep when press up or down button', () => {
    const onStep = jest.fn();
    const { container } = render(<InputNumber defaultValue={1} onStep={onStep} />);
    fireEvent.mouseDown(container.querySelector('.ant-input-number-handler-up'));
    expect(onStep).toHaveBeenCalledTimes(1);
    expect(onStep).toHaveBeenLastCalledWith(2, { offset: 1, type: 'up' });

    fireEvent.mouseDown(container.querySelector('.ant-input-number-handler-down'));
    expect(onStep).toHaveBeenCalledTimes(2);
    expect(onStep).toHaveBeenLastCalledWith(1, { offset: 1, type: 'down' });
  });

  it('renders correctly when controls is boolean', () => {
    const { asFragment } = render(<InputNumber controls={false} />);
    expect(asFragment().firstChild).toMatchSnapshot();
  });

  it('renders correctly when controls is {}', () => {
    const { asFragment } = render(<InputNumber controls={{}} />);
    expect(asFragment().firstChild).toMatchSnapshot();
  });

  it('renders correctly when controls has custom upIcon and downIcon', () => {
    const { asFragment } = render(
      <InputNumber
        controls={{
          upIcon: <ArrowUpOutlined />,
          downIcon: <ArrowDownOutlined />,
        }}
      />,
    );
    expect(asFragment().firstChild).toMatchSnapshot();
  });

  it('should support className', () => {
    const { container } = render(
      <InputNumber
        controls={{
          upIcon: <ArrowUpOutlined className="my-class-name" />,
          downIcon: <ArrowDownOutlined className="my-class-name" />,
        }}
      />,
    );
    expect(container.querySelector('.anticon-arrow-up')?.className.includes('my-class-name')).toBe(
      true,
    );
    expect(
      container.querySelector('.anticon-arrow-down')?.className.includes('my-class-name'),
    ).toBe(true);
  });
});
