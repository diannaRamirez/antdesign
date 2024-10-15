import type { CSSObject } from '@ant-design/cssinjs';
import type { TreeToken } from '.';

// ============================ Directory =============================
export const genDirectoryStyle = ({
  treeCls,
  treeNodeCls,
  directoryNodeSelectedBg,
  directoryNodeSelectedColor,
  motionDurationMid,
  borderRadius,
  controlItemBgHover,
}: TreeToken): CSSObject => ({
  [`${treeCls}${treeCls}-directory ${treeNodeCls}`]: {
    position: 'relative',

    // >>> Title
    [`${treeCls}-node-content-wrapper`]: {
      '> *': {
        position: 'relative',
      },

      '&:hover': {
        background: 'transparent',
      },

      // Expand interactive area to whole line
      '&:before': {
        position: 'absolute',
        inset: 0,
        transition: `background-color ${motionDurationMid}`,
        content: '""',
        borderRadius,
      },

      '&:hover:before': {
        background: controlItemBgHover,
      },
    },

    [`${treeCls}-switcher`]: {
      marginInlineEnd: 0,
    },

    // ============= Selected =============
    '&-selected': {
      // >>> Switcher
      [`${treeCls}-switcher`]: {
        color: directoryNodeSelectedColor,
        zIndex: 1,
      },

      // >>> Title
      [`${treeCls}-node-content-wrapper`]: {
        color: directoryNodeSelectedColor,
        background: 'transparent',

        '&:before, &:hover:before': {
          background: directoryNodeSelectedBg,
        },
      },
    },
  },
});
