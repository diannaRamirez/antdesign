import RightOutlined from '@ant-design/icons/RightOutlined';
import classNames from 'classnames';
import RcCollapse from 'rc-collapse';
import type { CSSMotionProps } from 'rc-motion';
import * as React from 'react';

import toArray from 'rc-util/lib/Children/toArray';
import omit from 'rc-util/lib/omit';
import type { CollapsibleType } from 'rc-collapse/es/interface';
import { ConfigContext } from '../config-provider';
import initCollapseMotion from '../_util/motion';
import { cloneElement } from '../_util/reactNode';
import warning from '../_util/warning';
import type { CollapsePanelProps } from './CollapsePanel';
import type { SizeType } from '../config-provider/SizeContext';
import SizeContext from '../config-provider/SizeContext';
import CollapsePanel from './CollapsePanel';

import useStyle from './style';

/** @deprecated Please use `start` | `end` instead */
type ExpandIconPositionLegacy = 'left' | 'right';
export type ExpandIconPosition = 'start' | 'end' | ExpandIconPositionLegacy | undefined;

type ItemType = Pick<
  CollapsePanelProps,
  | 'expandIcon'
  | 'header'
  | 'extra'
  | 'disabled'
  | 'collapsible'
  | 'onItemClick'
  // css motion
  | 'forceRender'
  | 'destroyInactivePanel'
> & {
  key?: React.Key;
  content?: React.ReactNode;
};

export interface CollapseProps {
  activeKey?: Array<string | number> | string | number;
  defaultActiveKey?: Array<string | number> | string | number;
  /** 手风琴效果 */
  accordion?: boolean;
  destroyInactivePanel?: boolean;
  onChange?: (key: string | string[]) => void;
  style?: React.CSSProperties;
  className?: string;
  rootClassName?: string;
  bordered?: boolean;
  prefixCls?: string;
  expandIcon?: (panelProps: PanelProps) => React.ReactNode;
  expandIconPosition?: ExpandIconPosition;
  ghost?: boolean;
  size?: SizeType;
  collapsible?: CollapsibleType;
  children?: React.ReactNode;
  /**
   * Collapse item content
   * @since 5.4.0
   */
  items?: ItemType[];
}

interface PanelProps {
  isActive?: boolean;
  header?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  showArrow?: boolean;
  forceRender?: boolean;
  /** @deprecated Use `collapsible="disabled"` instead */
  disabled?: boolean;
  extra?: React.ReactNode;
  collapsible?: CollapsibleType;
}

const Collapse = React.forwardRef<HTMLDivElement, CollapseProps>((props, ref) => {
  const { getPrefixCls, direction } = React.useContext(ConfigContext);
  const size = React.useContext(SizeContext);

  const {
    prefixCls: customizePrefixCls,
    className,
    rootClassName,
    bordered = true,
    ghost,
    size: customizeSize,
    expandIconPosition = 'start',
  } = props;

  const mergedSize = customizeSize || size || 'middle';
  const prefixCls = getPrefixCls('collapse', customizePrefixCls);
  const rootPrefixCls = getPrefixCls();
  const [wrapSSR, hashId] = useStyle(prefixCls);

  // Warning if use legacy type `expandIconPosition`
  warning(
    expandIconPosition !== 'left' && expandIconPosition !== 'right',
    'Collapse',
    '`expandIconPosition` with `left` or `right` is deprecated. Please use `start` or `end` instead.',
  );

  // Align with logic position
  const mergedExpandIconPosition = React.useMemo(() => {
    if (expandIconPosition === 'left') {
      return 'start';
    }
    return expandIconPosition === 'right' ? 'end' : expandIconPosition;
  }, [expandIconPosition]);

  const renderExpandIcon = (panelProps: PanelProps = {}) => {
    const { expandIcon } = props;
    const icon = (
      expandIcon ? (
        expandIcon(panelProps)
      ) : (
        <RightOutlined rotate={panelProps.isActive ? 90 : undefined} />
      )
    ) as React.ReactNode;

    return cloneElement(icon, () => ({
      className: classNames((icon as any).props.className, `${prefixCls}-arrow`),
    }));
  };

  const collapseClassName = classNames(
    `${prefixCls}-icon-position-${mergedExpandIconPosition}`,
    {
      [`${prefixCls}-borderless`]: !bordered,
      [`${prefixCls}-rtl`]: direction === 'rtl',
      [`${prefixCls}-ghost`]: !!ghost,
      [`${prefixCls}-${mergedSize}`]: mergedSize !== 'middle',
    },
    className,
    rootClassName,
    hashId,
  );
  const openMotion: CSSMotionProps = {
    ...initCollapseMotion(rootPrefixCls),
    motionAppear: false,
    leavedClassName: `${prefixCls}-content-hidden`,
  };

  const getItems = () => {
    const { children, items } = props;
    if (Array.isArray(items)) {
      return items.map((item, index) => {
        const key = item.key || String(index);
        const { disabled, collapsible, content, ...restItemProps } = item;
        return (
          <CollapsePanel
            key={key}
            collapsible={collapsible ?? (disabled ? 'disabled' : undefined)}
            {...restItemProps}
          >
            {content}
          </CollapsePanel>
        );
      });
    }
    return toArray(children).map((child: React.ReactElement, index: number) => {
      if (child.props?.disabled) {
        const key = child.key || String(index);
        const { disabled, collapsible } = child.props;
        const childProps: CollapseProps & { key: React.Key } = {
          ...omit(child.props, ['disabled']),
          key,
          collapsible: collapsible ?? (disabled ? 'disabled' : undefined),
        };
        return cloneElement(child, childProps);
      }
      return child;
    });
  };

  return wrapSSR(
    <RcCollapse
      ref={ref}
      openMotion={openMotion}
      {...omit(props, ['rootClassName'])}
      expandIcon={renderExpandIcon}
      prefixCls={prefixCls}
      className={collapseClassName}
    >
      {getItems()}
    </RcCollapse>,
  );
});

if (process.env.NODE_ENV !== 'production') {
  Collapse.displayName = 'Collapse';
}

export default Object.assign(Collapse, {
  /**
   * @deprecated Please use `<Collapse items={[]} />` instead
   */
  Panel: CollapsePanel,
});
