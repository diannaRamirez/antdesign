import React from 'react';

import Slider from '..';
import { resetWarned } from '../../_util/warning';
import focusTest from '../../../tests/shared/focusTest';
import mountTest from '../../../tests/shared/mountTest';
import rtlTest from '../../../tests/shared/rtlTest';
import { act, fireEvent, render, waitFakeTimer } from '../../../tests/utils';
import ConfigProvider from '../../config-provider';
import type { TooltipProps, TooltipRef } from '../../tooltip';
import SliderTooltip from '../SliderTooltip';

function tooltipProps(): TooltipProps {
  return (global as any).tooltipProps;
}

jest.mock('../../tooltip', () => {
  const ReactReal: typeof React = jest.requireActual('react');
  const Tooltip = jest.requireActual('../../tooltip');
  const TooltipComponent = Tooltip.default;
  return ReactReal.forwardRef<TooltipRef, TooltipProps>((props, ref) => {
    (global as any).tooltipProps = props;
    return <TooltipComponent {...props} ref={ref} />;
  });
});

describe('Slider.Tooltip', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  it('Correct show the tooltip', async () => {
    const { container } = render(<Slider defaultValue={30} />);

    const handleEle = container.querySelector('.ant-slider-handle')!;

    // Enter
    fireEvent.mouseEnter(handleEle);
    await waitFakeTimer();
    expect(tooltipProps().open).toBeTruthy();

    // Down
    fireEvent.mouseDown(handleEle);
    await waitFakeTimer();
    expect(tooltipProps().open).toBeTruthy();

    // Move(Leave)
    fireEvent.mouseLeave(handleEle);
    await waitFakeTimer();
    expect(tooltipProps().open).toBeTruthy();

    // Up
    fireEvent.mouseUp(handleEle);
    await waitFakeTimer();
    expect(tooltipProps().open).toBeFalsy();
  });
});
