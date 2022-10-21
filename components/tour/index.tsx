import React, { useContext } from 'react';
import RCTour from '@rc-component/tour';
import classNames from 'classnames';
import renderPanel from './renderPanel';
import type { ConfigConsumerProps } from '../config-provider';
import { ConfigContext } from '../config-provider';
import useStyle from './style';
import type { TourProps } from './interface';

const Tour: React.ForwardRefRenderFunction<HTMLDivElement, TourProps> = props => {
  const {
    prefixCls: customizePrefixCls,
    steps,
    current,
    type,
    rootClassName,
    ...restProps
  } = props;
  const { getPrefixCls, direction } = useContext<ConfigConsumerProps>(ConfigContext);
  const prefixCls = getPrefixCls('tour', customizePrefixCls);
  const [wrapSSR, hashId] = useStyle(prefixCls);

  const customClassName = classNames(
    {
      [`${prefixCls}-rtl`]: direction === 'rtl',
    },
    {
      [`${prefixCls}-primary`]: type === 'primary',
    },
    hashId,
    rootClassName,
  );

  return wrapSSR(
    <RCTour
      {...restProps}
      rootClassName={customClassName}
      prefixCls={prefixCls}
      steps={steps}
      current={current}
      renderPanel={renderPanel}
    />,
  );
};

if (process.env.NODE_ENV !== 'production') {
  Tour.displayName = 'Tour';
}

export default Tour;
