'use client';

import * as React from 'react';
import classNames from 'classnames';
import toArray from 'rc-util/lib/Children/toArray';

import useFlexGapSupport from '../_util/hooks/useFlexGapSupport';
import { ConfigContext } from '../config-provider';
import type { SizeType } from '../config-provider/SizeContext';
import Compact from './Compact';
import { SpaceContextProvider } from './context';
import type { SpaceContextType } from './context';
import Item from './Item';
import useStyle from './style';

export { SpaceContext } from './context';

export type SpaceSize = SizeType | number;

export interface SpaceProps extends React.HTMLAttributes<HTMLDivElement> {
  prefixCls?: string;
  className?: string;
  rootClassName?: string;
  style?: React.CSSProperties;
  size?: SpaceSize | [SpaceSize, SpaceSize];
  direction?: 'horizontal' | 'vertical';
  // No `stretch` since many components do not support that.
  align?: 'start' | 'end' | 'center' | 'baseline';
  split?: React.ReactNode;
  wrap?: boolean;
  classNames?: { item: string };
  styles?: { item: React.CSSProperties };
}

function isPresetSize(size: SpaceSize): size is SizeType {
  return typeof size === 'string' && ['small', 'middle', 'large'].includes(size);
}

function isNumberSize(size: SpaceSize): size is number {
  return typeof size === 'number' && !Number.isNaN(size);
}

const Space = React.forwardRef<HTMLDivElement, SpaceProps>((props, ref) => {
  const { getPrefixCls, space, direction: directionConfig } = React.useContext(ConfigContext);

  const {
    size = space?.size || 'small',
    align,
    className,
    rootClassName,
    children,
    direction = 'horizontal',
    prefixCls: customizePrefixCls,
    split,
    style,
    wrap = false,
    classNames: customClassNames,
    styles,
    ...otherProps
  } = props;

  const supportFlexGap = useFlexGapSupport();

  const [horizontalSize, verticalSize] = Array.isArray(size) ? size : ([size, size] as const);

  const childNodes = toArray(children, { keepEmpty: true });

  const mergedAlign = align === undefined && direction === 'horizontal' ? 'center' : align;
  const prefixCls = getPrefixCls('space', customizePrefixCls);
  const [wrapSSR, hashId] = useStyle(prefixCls);

  const cn = classNames(
    prefixCls,
    space?.className,
    hashId,
    `${prefixCls}-${direction}`,
    {
      [`${prefixCls}-rtl`]: directionConfig === 'rtl',
      [`${prefixCls}-align-${mergedAlign}`]: mergedAlign,
      [`${prefixCls}-gap-row-${verticalSize}`]: supportFlexGap && isPresetSize(verticalSize),
      [`${prefixCls}-gap-col-${horizontalSize}`]: supportFlexGap && isPresetSize(horizontalSize),
    },
    className,
    rootClassName,
  );

  const itemClassName = classNames(
    `${prefixCls}-item`,
    customClassNames?.item ?? space?.classNames?.item,
  );

  // Calculate latest one
  let latestIndex = 0;
  const nodes = childNodes.map((child, i) => {
    if (child !== null && child !== undefined) {
      latestIndex = i;
    }

    const key = (child && child.key) || `${itemClassName}-${i}`;

    return (
      <Item
        className={itemClassName}
        key={key}
        direction={direction}
        index={i}
        split={split}
        wrap={wrap}
        style={styles?.item ?? space?.styles?.item}
      >
        {child}
      </Item>
    );
  });

  const spaceContext = React.useMemo<SpaceContextType>(
    () => ({
      horizontalSize: isNumberSize(horizontalSize) ? horizontalSize : 0,
      verticalSize: isNumberSize(verticalSize) ? verticalSize : 0,
      latestIndex,
      supportFlexGap,
    }),
    [horizontalSize, verticalSize, latestIndex, supportFlexGap],
  );

  // =========================== Render ===========================
  if (childNodes.length === 0) {
    return null;
  }

  const gapStyle: React.CSSProperties = {};

  if (wrap) {
    gapStyle.flexWrap = 'wrap';

    // Patch for gap not support
    if (!supportFlexGap && isNumberSize(verticalSize)) {
      gapStyle.marginBottom = -verticalSize;
    }
  }

  if (supportFlexGap) {
    if (verticalSize && isNumberSize(verticalSize)) {
      gapStyle.rowGap = verticalSize;
    }
    if (horizontalSize && isNumberSize(horizontalSize)) {
      gapStyle.columnGap = horizontalSize;
    }
  }

  return wrapSSR(
    <div
      ref={ref}
      className={cn}
      style={{ ...gapStyle, ...space?.style, ...style }}
      {...otherProps}
    >
      <SpaceContextProvider value={spaceContext}>{nodes}</SpaceContextProvider>
    </div>,
  );
});

if (process.env.NODE_ENV !== 'production') {
  Space.displayName = 'Space';
}

type CompoundedComponent = React.ForwardRefExoticComponent<
  SpaceProps & React.RefAttributes<HTMLDivElement>
> & {
  Compact: typeof Compact;
};

const CompoundedSpace = Space as CompoundedComponent;

CompoundedSpace.Compact = Compact;

export default CompoundedSpace;
