/* eslint-disable react/no-array-index-key */
import React, { useState } from 'react';
import classNames from 'classnames';
import ResizeObserver from 'rc-resize-observer';
import { useEvent } from 'rc-util';

import type { GetProp } from '../_util/type';
import { devUseWarning } from '../_util/warning';
import { ConfigContext } from '../config-provider';
import useCSSVarCls from '../config-provider/hooks/useCSSVarCls';
import useItems from './hooks/useItems';
import useResizable from './hooks/useResizable';
import useResize from './hooks/useResize';
import useSizes from './hooks/useSizes';
import type { SplitterProps } from './interface';
import { InternalPanel } from './Panel';
import SplitBar from './SplitBar';
import useStyle from './style';

const Splitter: React.FC<React.PropsWithChildren<SplitterProps>> = (props) => {
  const {
    prefixCls: customizePrefixCls,
    className,
    style,
    layout,
    children,
    rootClassName,
    onResizeStart,
    onResize,
    onResizeEnd,
  } = props;

  const { getPrefixCls, direction } = React.useContext(ConfigContext);
  const prefixCls = getPrefixCls('splitter', customizePrefixCls);
  const rootCls = useCSSVarCls(prefixCls);
  const [wrapCSSVar, hashId, cssVarCls] = useStyle(prefixCls, rootCls);

  // ======================== Direct ========================
  const isVertical = layout === 'vertical';
  const isRTL = direction === 'rtl';
  const reverse = !isVertical && isRTL;

  // ====================== Items Data ======================
  const items = useItems(children);

  // >>> Warning for uncontrolled
  if (process.env.NODE_ENV !== 'production') {
    const warning = devUseWarning('Splitter');

    let existSize = false;
    let existUndefinedSize = false;

    items.forEach((item) => {
      if (item.size !== undefined) {
        existSize = true;
      } else {
        existUndefinedSize = true;
      }
    });

    if (existSize && existUndefinedSize && !onResize) {
      warning(
        false,
        'usage',
        'When part of `Splitter.Panel` has `size`, `onResize` is required or change `size` to `defaultSize`.',
      );
    }
  }

  // ====================== Container =======================
  const [containerSize, setContainerSize] = useState<number>(100);

  const onContainerResize: GetProp<typeof ResizeObserver, 'onResize'> = (size) => {
    setContainerSize(isVertical ? size.offsetHeight : size.offsetWidth);
  };

  // ========================= Size =========================
  const [itemPxSizes, itemPtgSizes, itemPtgMinSizes, itemPtgMaxSizes, updateSizes] = useSizes(
    items,
    containerSize,
  );

  // ====================== Resizable =======================
  const resizableInfos = useResizable(items, itemPxSizes);

  const [onOffsetStart, onOffsetUpdate, onOffsetEnd, onCollapse, movingIndex] = useResize(
    items,
    resizableInfos,
    itemPtgSizes,
    containerSize,
    updateSizes,
  );

  // ======================== Events ========================
  const onInternalResizeStart = useEvent((index: number) => {
    onOffsetStart(index);
    onResizeStart?.(itemPxSizes);
  });

  const onInternalResizeUpdate = useEvent((index: number, offset: number) => {
    const nextSizes = onOffsetUpdate(index, offset);
    onResize?.(nextSizes);
  });

  const onInternalResizeEnd = useEvent(() => {
    onOffsetEnd();
    onResizeEnd?.(itemPxSizes);
  });

  const onInternalCollapse = useEvent((index: number, type: 'start' | 'end') => {
    const nextSizes = onCollapse(index, type);
    onResize?.(nextSizes);
    onResizeEnd?.(nextSizes);
  });

  // ======================== Styles ========================
  const containerClassName = classNames(
    prefixCls,
    className,
    {
      [`${prefixCls}-horizontal`]: !isVertical,
      [`${prefixCls}-vertical`]: isVertical,
      [`${prefixCls}-rtl`]: isRTL,
    },
    rootClassName,
    cssVarCls,
    rootCls,
    hashId,
  );

  // ======================== Render ========================
  const maskCls = `${prefixCls}-mask`;

  const stackSizes = React.useMemo(() => {
    const mergedSizes = [];

    let stack = 0;
    for (let i = 0; i < items.length; i += 1) {
      stack += itemPtgSizes[i];
      mergedSizes.push(stack);
    }

    return mergedSizes;
  }, [itemPtgSizes]);

  return wrapCSSVar(
    <>
      <ResizeObserver onResize={onContainerResize}>
        <div style={style} className={containerClassName}>
          {items.map((item, idx) => {
            // Panel
            const panel = <InternalPanel {...item} prefixCls={prefixCls} size={itemPxSizes[idx]} />;

            // Split Bar
            let splitBar: React.ReactElement | null = null;

            const resizableInfo = resizableInfos[idx];
            if (resizableInfo) {
              const ariaMinStart = (stackSizes[idx - 1] || 0) + itemPtgMinSizes[idx];
              const ariaMinEnd = (stackSizes[idx + 1] || 100) - itemPtgMaxSizes[idx + 1];

              const ariaMaxStart = (stackSizes[idx - 1] || 0) + itemPtgMaxSizes[idx];
              const ariaMaxEnd = (stackSizes[idx + 1] || 100) - itemPtgMinSizes[idx + 1];

              splitBar = (
                <SplitBar
                  index={idx}
                  active={movingIndex === idx}
                  prefixCls={prefixCls}
                  vertical={isVertical}
                  resizable={resizableInfo.resizable}
                  ariaNow={stackSizes[idx] * 100}
                  ariaMin={Math.max(ariaMinStart, ariaMinEnd) * 100}
                  ariaMax={Math.min(ariaMaxStart, ariaMaxEnd) * 100}
                  startCollapsible={resizableInfo.startCollapsible}
                  endCollapsible={resizableInfo.endCollapsible}
                  onOffsetStart={onInternalResizeStart}
                  onOffsetUpdate={(index, offsetX, offsetY) => {
                    let offset = isVertical ? offsetY : offsetX;
                    if (reverse) {
                      offset = -offset;
                    }
                    onInternalResizeUpdate(index, offset);
                  }}
                  onOffsetEnd={onInternalResizeEnd}
                  onCollapse={onInternalCollapse}
                />
              );
            }

            return (
              <React.Fragment key={`split-panel-${idx}`}>
                {panel}
                {splitBar}
              </React.Fragment>
            );
          })}
        </div>
      </ResizeObserver>

      {/* Fake mask for cursor */}
      {typeof movingIndex === 'number' && (
        <div
          aria-hidden
          className={classNames(maskCls, {
            [`${maskCls}-horizontal`]: !isVertical,
            [`${maskCls}-vertical`]: isVertical,
          })}
        />
      )}
    </>,
  );
};

if (process.env.NODE_ENV !== 'production') {
  Splitter.displayName = 'Splitter';
}

export default Splitter;
