// import '../../style/index.less';
// import './index.less';

// // style dependencies
// import '../../button/style';

// deps-lint-skip-all
import * as React from 'react';
import { CSSObject } from '@ant-design/cssinjs';
import {
  GenerateStyle,
  resetComponent,
  FullToken,
  genComponentStyleHook,
  mergeToken,
  roundedArrow,
} from '../../_util/theme';

export interface ComponentToken {
  zIndexDropdown: number;
}

interface DropdownToken extends FullToken<'Dropdown'> {
  dropdownArrowDistance: number;
  dropdownArrowOffset: number;
  dropdownPaddingVertical: number;
  dropdownEdgeChildVerticalPadding: number;
}

// =============================== Base ===============================
const genBaseStyle: GenerateStyle<DropdownToken> = token => {
  const {
    componentCls,
    zIndexDropdown,
    dropdownArrowDistance,
    dropdownArrowOffset,
    sizePopupArrow,
    antCls,
    iconCls,
    colorBgComponent,
    motionDurationMid,
    motionDurationSlow,
    dropdownPaddingVertical,
    fontSizeBase,
    dropdownEdgeChildVerticalPadding,
    radiusBase,
    colorTextDisabled,
    fontSizeIcon,
    controlPaddingHorizontal,
  } = token;

  return {
    [componentCls]: {
      ...resetComponent(token),

      position: 'absolute',
      top: -9999,
      left: {
        _skip_check_: true,
        value: -9999,
      },
      zIndex: zIndexDropdown,
      display: 'block',

      // A placeholder out of dropdown visible range to avoid close when user moving
      '&::before': {
        position: 'absolute',
        insetBlock: `${-dropdownArrowDistance + sizePopupArrow}`,
        // insetInlineStart: -7, // FIXME: Seems not work for hidden element
        zIndex: -9999,
        opacity: 0.0001,
        content: '""',
      },

      [`${componentCls}-wrap`]: {
        position: 'relative',

        [`${antCls}-btn > ${iconCls}-down`]: {
          fontSize: fontSizeIcon,
        },

        [`${iconCls}-down::before`]: {
          transition: `transform ${motionDurationMid}`,
        },
      },

      [`${componentCls}-wrap-open`]: {
        [`${iconCls}-down::before`]: {
          transform: `rotate(180deg)`,
        },
      },

      [`
        &-hidden,
        &-menu-hidden,
        &-menu-submenu-hidden
      `]: {
        display: 'none',
      },

      // =============================================================
      // ==                          Arrow                          ==
      // =============================================================
      // Offset the popover to account for the dropdown arrow
      [`
        &-show-arrow&-placement-topLeft,
        &-show-arrow&-placement-top,
        &-show-arrow&-placement-topRight
      `]: {
        paddingBottom: dropdownArrowDistance,
      },

      [`
        &-show-arrow&-placement-bottomLeft,
        &-show-arrow&-placement-bottom,
        &-show-arrow&-placement-bottomRight
      `]: {
        paddingTop: dropdownArrowDistance,
      },

      // Note: .popover-arrow is outer, .popover-arrow:after is inner
      [`${componentCls}-arrow`]: {
        position: 'absolute',
        zIndex: 1, // lift it up so the menu wouldn't cask shadow on it
        display: 'block',
        width: sizePopupArrow,
        height: sizePopupArrow,
        // Use linear-gradient to prevent arrow from covering text
        background: `linear-gradient(135deg, transparent 40%, ${colorBgComponent} 40%)`,

        ...roundedArrow(sizePopupArrow, 5, colorBgComponent),
      },

      [`
        &-placement-top > ${componentCls}-arrow,
        &-placement-topLeft > ${componentCls}-arrow,
        &-placement-topRight > ${componentCls}-arrow
      `]: {
        bottom: sizePopupArrow * Math.sqrt(1 / 2) + 2,
        boxShadow: `3px 3px 7px -3px rgba(0, 0, 0, 0.1)`, // FIXME: hardcode
        transform: 'rotate(45deg)',
      },

      [`&-placement-top > ${componentCls}-arrow`]: {
        left: {
          _skip_check_: true,
          value: '50%',
        },
        transform: 'translateX(-50%) rotate(45deg)',
      },

      [`&-placement-topLeft > ${componentCls}-arrow`]: {
        left: {
          _skip_check_: true,
          value: dropdownArrowOffset,
        },
      },

      [`&-placement-topRight > ${componentCls}-arrow`]: {
        right: {
          _skip_check_: true,
          value: dropdownArrowOffset,
        },
      },

      [`
          &-placement-bottom > ${componentCls}-arrow,
          &-placement-bottomLeft > ${componentCls}-arrow,
          &-placement-bottomRight > ${componentCls}-arrow
        `]: {
        top: (sizePopupArrow + 2) * Math.sqrt(1 / 2),
        boxShadow: `2px 2px 5px -2px rgba(0, 0, 0, 0.1)`, // FIXME: hardcode
        transform: `rotate(-135deg) translateY(-0.5px)`, // FIXME: hardcode
      },

      [`&-placement-bottom > ${componentCls}-arrow`]: {
        left: {
          _skip_check_: true,
          value: '50%',
        },
        transform: `translateX(-50%) rotate(-135deg) translateY(-0.5px)`,
      },

      [`&-placement-bottomLeft > ${componentCls}-arrow`]: {
        left: {
          _skip_check_: true,
          value: dropdownArrowOffset,
        },
      },

      [`&-placement-bottomRight > ${componentCls}-arrow`]: {
        right: {
          _skip_check_: true,
          value: dropdownArrowOffset,
        },
      },

      // =============================================================
      // ==                          Menu                           ==
      // =============================================================
      [`${componentCls}-menu`]: {
        position: 'relative',
        margin: 0,
        padding: `${dropdownEdgeChildVerticalPadding}px 0`,
        //     text-align: left;
        listStyleType: 'none',
        backgroundColor: colorBgComponent,
        backgroundClip: 'padding-box',
        borderRadius: token.controlRadius,
        outline: 'none',
        boxShadow: token.boxShadow,

        '&-item-group-title': {
          padding: `${dropdownPaddingVertical}px ${controlPaddingHorizontal}px`,
          color: token.colorTextSecondary,
          transition: `all ${motionDurationSlow}`,
        },

        [`&-submenu-popup`]: {
          position: 'absolute',
          zIndex: zIndexDropdown,
          background: 'transparent',
          boxShadow: 'none',
          transformOrigin: '0 0',

          'ul,li': {
            listStyle: 'none',
          },

          ul: {
            marginRight: '0.3em',
            marginLeft: '0.3em',
          },
        },

        // ======================= Item Content =======================
        '&-item': {
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
        },

        '&-item-icon': {
          minWidth: fontSizeBase,
          marginRight: token.marginXS,
          fontSize: token.fontSizeSM,
        },

        '&-title-content': {
          flex: 'auto',

          '> a': {
            color: 'inherit',
            transition: `all ${motionDurationSlow}`,

            '&:hover': {
              color: 'inherit',
            },

            '&::after': {
              position: 'absolute',
              inset: 0,
              content: '""',
            },
          },
        },

        // =========================== Item ===========================
        '&-item, &-submenu-title': {
          clear: 'both',
          margin: 0,
          padding: `${dropdownPaddingVertical}px ${controlPaddingHorizontal}px`,
          color: token.colorText,
          fontWeight: 'normal',
          fontSize: fontSizeBase,
          lineHeight: token.lineHeight,
          cursor: 'pointer',
          transition: `all ${motionDurationSlow}`,

          '&:first-child': !dropdownEdgeChildVerticalPadding
            ? {
                borderRadius: `${radiusBase}px ${radiusBase}px 0 0`,
              }
            : [],

          '&:last-child': !dropdownEdgeChildVerticalPadding
            ? {
                borderRadius: `0 0 ${radiusBase}px ${radiusBase}px`,
              }
            : [],

          '&-selected': {
            color: token.colorPrimary,
            backgroundColor: token.controlItemBgActive,
          },

          [`&:hover, &-active`]: {
            backgroundColor: token.controlItemBgHover,
          },

          '&-disabled': {
            color: colorTextDisabled,
            cursor: 'not-allowed',

            '&:hover': {
              color: colorTextDisabled,
              backgroundColor: colorBgComponent,
              cursor: 'not-allowed',
            },

            a: {
              pointerEvents: 'none',
            },
          },

          '&-divider': {
            height: 1, // By design
            margin: `${token.marginXXS}px 0`,
            overflow: 'hidden',
            lineHeight: 0,
            backgroundColor: token.colorSplit,
          },

          [`${componentCls}-menu-submenu-expand-icon`]: {
            position: 'absolute',
            insetInlineEnd: token.paddingXS,

            [`${componentCls}-menu-submenu-arrow-icon`]: {
              marginInlineEnd: '0 !important',
              color: token.colorTextSecondary,
              fontSize: fontSizeIcon,
              fontStyle: 'normal',
            },
          },
        },

        '&-item-group-list': {
          margin: `0 ${token.marginXS}px`,
          padding: 0,
          listStyle: 'none',
        },

        '&-submenu-title': {
          paddingRight: controlPaddingHorizontal + token.fontSizeSM,
        },

        '&-submenu-vertical': {
          position: 'relative',
        },

        [`&-submenu&-submenu-disabled ${componentCls}-menu-submenu-title`]: {
          [`&, ${componentCls}-menu-submenu-arrow-icon`]: {
            color: colorTextDisabled,
            backgroundColor: colorBgComponent,
            cursor: 'not-allowed',
          },
        },

        // https://github.com/ant-design/ant-design/issues/19264
        [`&-submenu-selected ${componentCls}-menu-submenu-title`]: {
          color: token.colorPrimary,
        },
      },
    },
  };
};
// .css-dev-only-do-not-override-btc0m7.ant-slide-up-enter.ant-slide-up-enter-active

// ============================== Export ==============================
export default genComponentStyleHook(
  'Dropdown',
  token => {
    const { marginXXS, sizePopupArrow, controlHeight, fontSizeBase, lineHeight, paddingXXS } =
      token;

    const dropdownPaddingVertical = (controlHeight - fontSizeBase * lineHeight) / 2;

    const dropdownToken = mergeToken<DropdownToken>(token, {
      dropdownArrowDistance: sizePopupArrow + marginXXS,
      dropdownArrowOffset: (sizePopupArrow / Math.sqrt(2)) * 2,
      dropdownPaddingVertical,
      dropdownEdgeChildVerticalPadding: paddingXXS,
    });
    return [genBaseStyle(dropdownToken)];
  },
  token => ({
    zIndexDropdown: token.zIndexPopup + 50,
  }),
);
