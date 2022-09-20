import type { CSSObject } from '@ant-design/cssinjs';
import type { FullToken, GenerateStyle } from '../../theme';
import { genComponentStyleHook, mergeToken } from '../../theme';
import { resetComponent, resetIcon } from '../../style';

/** Component only token. Which will handle additional calculation of alias token */
export interface ComponentToken {
  zIndexPopup: number;
}

type FloatButtonToken = FullToken<'FloatButton'> & {
  floatButtonColor: string;
  floatButtonBackgroundColor: string;
  floatButtonHoverBackgroundColor: string;
  floatButtonFontSize: number;
  floatButtonSize: number;
  floatButtonIconSize: number;

  // Position
  floatButtonBlockEnd: number;
  floatButtonInlineEnd: number;
};

// ============================== Group ==============================
const floatButtonGroupStyle: GenerateStyle<FloatButtonToken, CSSObject> = token => {
  const { componentCls, floatButtonSize } = token;
  const groupPrefixCls = `${componentCls}-group`;
  return {
    [groupPrefixCls]: {
      ...resetComponent(token),
      display: 'block',
      border: 'none',
      position: 'fixed',
      width: floatButtonSize,
      height: 'auto',
      boxShadow: 'none',
      minHeight: floatButtonSize,
      insetInlineEnd: token.floatButtonInlineEnd,
      insetBlockEnd: token.floatButtonBlockEnd,
      backgroundColor: token.colorBgContainer,
      borderRadius: token.radiusSM,
      '&&-rtl': {
        direction: 'rtl',
      },
      [componentCls]: {
        position: 'static',
      },
    },
    [`${groupPrefixCls}-circle`]: {
      [`${componentCls}-circle:not(:last-child)`]: {
        marginBottom: token.margin,
        [`${componentCls}-body`]: {
          width: floatButtonSize,
          height: floatButtonSize,
        },
      },
    },
    [`${groupPrefixCls}-square`]: {
      [`${componentCls}-square`]: {
        padding: token.paddingXXS,
        marginTop: 0,
        '&:not(:last-child)': {
          borderBottom: `${token.lineWidth}px ${token.lineType} ${token.colorSplit}`,
        },
        [`${componentCls}-body`]: {
          width: floatButtonSize - token.paddingXXS * 2,
          height: floatButtonSize - token.paddingXXS * 2,
        },
      },
    },
    [`${componentCls}-square-tigger`]: {
      marginTop: `${token.margin}px !important`,
      borderRadius: `${token.radiusBase}px !important`,
    },
  };
};

// ============================== Shared ==============================
const sharedFloatButtonStyle: GenerateStyle<FloatButtonToken, CSSObject> = token => {
  const { componentCls, floatButtonIconSize, floatButtonSize } = token;

  return {
    [componentCls]: {
      ...resetComponent(token),
      border: 'none',
      position: 'fixed',
      cursor: 'pointer',
      overflow: 'hidden',
      zIndex: 20,
      display: 'block',
      justifyContent: 'center',
      alignItems: 'center',
      width: floatButtonSize,
      height: floatButtonSize,
      insetInlineEnd: token.floatButtonInlineEnd,
      insetBlockEnd: token.floatButtonBlockEnd,
      boxShadow: token.boxShadowSecondary,
      '&:empty': {
        display: 'none',
      },
      [`${componentCls}-body`]: {
        width: floatButtonSize,
        height: floatButtonSize,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        transition: `all ${token.motionDurationFast}`,
        [`${componentCls}-content`]: {
          overflow: 'hidden',
          textAlign: 'center',
        },
        [`${componentCls}-icon`]: {
          ...resetIcon(),
          fontSize: floatButtonIconSize,
          lineHeight: 1,
        },
        [`${componentCls}-default-icon`]: {
          color: token.colorText,
        },
        [`${componentCls}-primary-icon`]: {
          color: token.colorTextLightSolid,
        },
      },
    },
    [`${componentCls}-circle`]: {
      height: floatButtonSize,
      borderRadius: '50%',
      [`${componentCls}-body`]: {
        borderRadius: '50%',
      },
    },
    [`${componentCls}-square`]: {
      minHeight: floatButtonSize,
      borderRadius: token.radiusBase,
      [`${componentCls}-body`]: {
        borderRadius: token.radiusSM,
      },
    },
    [`${componentCls}-default`]: {
      backgroundColor: token.colorBgContainer,
      transition: `background-color ${token.motionDurationFast}`,
      [`${componentCls}-body`]: {
        backgroundColor: token.colorBgContainer,
        transition: `background-color ${token.motionDurationFast}`,
        '&:hover': {
          backgroundColor: token.colorFillContent,
          transition: `background-color ${token.motionDurationFast}`,
        },
      },
    },
    [`${componentCls}-primary`]: {
      backgroundColor: token.colorPrimary,
      [`${componentCls}-body`]: {
        backgroundColor: token.colorPrimary,
        transition: `background-color ${token.motionDurationFast}`,
        '&:hover': {
          backgroundColor: token.colorPrimaryHover,
          transition: `background-color ${token.motionDurationFast}`,
        },
      },
    },
  };
};

// ============================== Export ==============================
export default genComponentStyleHook<'FloatButton'>('FloatButton', token => {
  const {
    colorTextLightSolid,
    colorBgContainer,
    controlHeightLG,
    marginXXL,
    marginLG,
    fontSize,
    fontSizeHeading4,
    controlItemBgHover,
  } = token;
  const floatButtonToken = mergeToken<FloatButtonToken>(token, {
    floatButtonBackgroundColor: colorBgContainer,
    floatButtonColor: colorTextLightSolid,
    floatButtonHoverBackgroundColor: controlItemBgHover,
    floatButtonFontSize: fontSize,
    floatButtonIconSize: fontSizeHeading4,
    floatButtonSize: controlHeightLG,

    floatButtonBlockEnd: marginXXL,
    floatButtonInlineEnd: marginLG,
  });
  return [floatButtonGroupStyle(floatButtonToken), sharedFloatButtonStyle(floatButtonToken)];
});
