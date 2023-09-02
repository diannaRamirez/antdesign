import * as React from 'react';

import { SpaceContext } from './context';
import type { SpaceContextType } from './context';

export interface ItemProps {
  className: string;
  children: React.ReactNode;
  index: number;
  direction?: 'horizontal' | 'vertical';
  split?: React.ReactNode;
  wrap?: boolean;
  style?: React.CSSProperties;
}

const Item: React.FC<ItemProps> = ({
  className,
  direction,
  index,
  children,
  split,
  wrap,
  style: customStyle,
}) => {
  const { horizontalSize, verticalSize, latestIndex, supportFlexGap } =
    React.useContext<SpaceContextType>(SpaceContext);

  let style: React.CSSProperties = {};

  if (!supportFlexGap) {
    if (direction === 'vertical') {
      if (index < latestIndex) {
        style = { marginBottom: horizontalSize / (split ? 2 : 1) };
      }
    } else {
      style = {
        ...(index < latestIndex && { marginInlineStart: horizontalSize / (split ? 2 : 1) }),
        ...(wrap && { paddingBottom: verticalSize }),
      };
    }
  }

  if (children === null || children === undefined) {
    return null;
  }

  return (
    <>
      <div className={className} style={{ ...style, ...customStyle }}>
        {children}
      </div>
      {index < latestIndex && split && (
        <span className={`${className}-split`} style={style}>
          {split}
        </span>
      )}
    </>
  );
};

export default Item;
