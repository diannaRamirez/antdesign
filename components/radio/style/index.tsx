// deps-lint-skip-all
import { Keyframes } from '@ant-design/cssinjs';
import { resetComponent, genComponentStyleHook, mergeToken } from '../../_util/theme';
import type { FullToken, GenerateStyle } from '../../_util/theme';

// ============================== Tokens ==============================
export interface ComponentToken {}

interface RadioToken extends FullToken<'Radio'> {
  radioFocusShadow: string;
  radioButtonFocusShadow: string;

  radioSize: number;
  radioTop: number;
  radioDotSize: number;
  radioDotColor: string;
  radioDotDisabledColor: string;
  radioSolidCheckedColor: string;

  radioButtonBg: string;
  radioButtonCheckedBg: string;
  radioButtonColor: string;
  radioButtonHoverColor: string;
  radioButtonActiveColor: string;
  radioButtonPaddingHorizontal: number;
  radioDisabledButtonCheckedBg: string;
  radioDisabledButtonCheckedColor: string;
  radioWrapperMarginRight: number;
}

// ============================== Styles ==============================
const antRadioEffect = new Keyframes('antRadioEffect', {
  '0%': { transform: 'scale(1)', opacity: 0.5 },
  '100%': { transform: 'scale(1.6)', opacity: 0 },
});

// styles from RadioGroup only
const getGroupRadioStyle: GenerateStyle<RadioToken> = token => {
  const { componentCls, antCls } = token;
  const groupPrefixCls = `${componentCls}-group`;

  return {
    [groupPrefixCls]: {
      ...resetComponent(token),
      display: 'inline-block',
      fontSize: 0,

      // RTL
      '&&-rtl': {
        direction: 'rtl',
      },

      [`${antCls}-badge ${antCls}-badge-count`]: {
        zIndex: 1,
      },

      [`> ${antCls}-badge:not(:first-child) > ${antCls}-button-wrapper`]: {
        borderInlineStart: 'none',
      },
    },
  };
};

// Styles from radio-wrapper
const getRadioBasicStyle: GenerateStyle<RadioToken> = token => {
  const {
    componentCls,
    radioWrapperMarginRight,
    radioDotColor,
    radioTop,
    radioFocusShadow,
    radioSize,
    motionDurationSlow,
    motionEaseInOut,
    motionEaseInOutCirc,
    radioButtonBg,
    colorBorder,
    controlLineWidth,
    radioDotSize,
    colorBgComponentDisabled,
    colorTextDisabled,
    paddingXS,
    radioDotDisabledColor,
    controlLineType,
  } = token;
  const radioInnerPrefixCls = `${componentCls}-inner`;

  return {
    [`${componentCls}-wrapper`]: {
      ...resetComponent(token),
      position: 'relative',
      display: 'inline-flex',
      alignItems: 'baseline',
      marginInlineStart: 0,
      marginInlineEnd: radioWrapperMarginRight,
      cursor: 'pointer',

      // RTL
      '&&-rtl': {
        direction: 'rtl',
      },

      '&-disabled': {
        cursor: 'not-allowed',
      },

      '&::after': {
        display: 'inline-block',
        width: 0,
        overflow: 'hidden',
        content: '"\\a0"',
      },

      // hashId 在 wrapper 上，只能铺平
      [`${componentCls}-checked::after`]: {
        position: 'absolute',
        insetBlockStart: 0,
        insetInlineStart: 0,
        width: '100%',
        height: '100%',
        border: `${controlLineWidth}px ${controlLineType} ${radioDotColor}`,
        borderRadius: '50%',
        visibility: 'hidden',
        animationName: antRadioEffect,
        animationDuration: motionDurationSlow,
        animationTimingFunction: motionEaseInOut,
        animationFillMode: 'both',
        content: '""',
      },

      [componentCls]: {
        ...resetComponent(token),
        position: 'relative',
        insetBlockStart: radioTop,
        display: 'inline-block',
        outline: 'none',
        cursor: 'pointer',
      },

      [`${componentCls}-wrapper:hover &,
              &:hover ${radioInnerPrefixCls},
              &-input:focus + ${radioInnerPrefixCls}`]: {
        borderColor: radioDotColor,
      },

      [`${componentCls}-input:focus + ${radioInnerPrefixCls}`]: {
        boxShadow: radioFocusShadow,
      },

      [`${componentCls}:hover::after, ${componentCls}-wrapper:hover &::after`]: {
        visibility: 'visible',
      },

      [`${componentCls}-inner`]: {
        '&::after': {
          position: 'absolute',
          insetBlockStart: '50%',
          insetInlineStart: '50%',
          display: 'block',
          width: radioSize,
          height: radioSize,
          marginBlockStart: radioSize / -2,
          marginInlineStart: radioSize / -2,
          backgroundColor: radioDotColor,
          borderBlockStart: 0,
          borderInlineStart: 0,
          borderRadius: radioSize,
          transform: 'scale(0)',
          opacity: 0,
          transition: `all ${motionDurationSlow} ${motionEaseInOutCirc}`,
          content: '""',
        },

        position: 'relative',
        insetBlockStart: 0,
        insetInlineStart: 0,
        display: 'block',
        width: radioSize,
        height: radioSize,
        backgroundColor: radioButtonBg,
        borderColor: colorBorder,
        borderStyle: 'solid',
        borderWidth: controlLineWidth,
        borderRadius: '50%',
        transition: `all ${motionDurationSlow}`,
      },

      [`${componentCls}-input`]: {
        position: 'absolute',
        insetBlockStart: 0,
        insetInlineEnd: 0,
        insetBlockEnd: 0,
        insetInlineStart: 0,
        zIndex: 1,
        cursor: 'pointer',
        opacity: 0,
      },

      // 选中状态
      [`${componentCls}-checked`]: {
        [radioInnerPrefixCls]: {
          borderColor: radioDotColor,

          '&::after': {
            transform: `scale(${radioDotSize / radioSize})`,
            opacity: 1,
            transition: `all ${motionDurationSlow} ${motionEaseInOutCirc}`,
          },
        },
      },

      [`${componentCls}-disabled`]: {
        cursor: 'not-allowed',

        [radioInnerPrefixCls]: {
          backgroundColor: colorBgComponentDisabled,
          borderColor: `${colorBorder} !important`,
          cursor: 'not-allowed',

          '&::after': {
            backgroundColor: radioDotDisabledColor,
          },
        },

        '&-input': {
          cursor: 'not-allowed',
        },

        [`${componentCls}-disabled + span`]: {
          color: colorTextDisabled,
          cursor: 'not-allowed',
        },
      },

      [`span${componentCls} + *`]: {
        paddingInlineStart: paddingXS,
        paddingInlineEnd: paddingXS,
      },
    },
  };
};

// Styles from radio-button
const getRadioButtonStyle: GenerateStyle<RadioToken> = token => {
  const {
    radioButtonColor,
    controlHeight,
    componentCls,
    controlLineWidth,
    controlLineType,
    colorBorder,
    motionDurationSlow,
    radioButtonPaddingHorizontal,
    fontSize,
    radioButtonBg,
    fontSizeLG,
    controlHeightLG,
    controlHeightSM,
    paddingXS,
    controlRadius,
    radioDotColor,
    radioButtonFocusShadow,
    radioButtonCheckedBg,
    radioButtonHoverColor,
    radioButtonActiveColor,
    radioSolidCheckedColor,
    colorTextDisabled,
    colorBgComponentDisabled,
    radioDisabledButtonCheckedColor,
    radioDisabledButtonCheckedBg,
  } = token;
  return {
    [`${componentCls}-button-wrapper`]: {
      position: 'relative',
      display: 'inline-block',
      height: controlHeight,
      margin: 0,
      paddingInline: radioButtonPaddingHorizontal,
      paddingBlock: 0,
      color: radioButtonColor,
      fontSize,
      lineHeight: `${controlHeight - controlLineWidth * 2}px`,
      background: radioButtonBg,
      border: `${controlLineWidth}px ${controlLineType} ${colorBorder}`,
      // strange align fix for chrome but works
      // https://gw.alipayobjects.com/zos/rmsportal/VFTfKXJuogBAXcvfAUWJ.gif
      borderBlockStartWidth: controlLineWidth + 0.02,
      borderInlineStartWidth: 0,
      borderInlineEndWidth: controlLineWidth,
      cursor: 'pointer',
      transition: [
        `color ${motionDurationSlow}`,
        `background ${motionDurationSlow}`,
        `border-color ${motionDurationSlow}`,
        `box-shadow ${motionDurationSlow}`,
      ].join(','),

      a: {
        color: radioButtonColor,
      },

      [`> ${componentCls}-button`]: {
        position: 'absolute',
        insetBlockStart: 0,
        insetInlineStart: 0,
        zIndex: -1,
        width: '100%',
        height: '100%',
      },

      [`${componentCls}-group-large &`]: {
        height: controlHeightLG,
        fontSize: fontSizeLG,
        lineHeight: `${controlHeightLG - controlLineWidth * 2}px`,
      },

      [`${componentCls}-group-small &`]: {
        height: controlHeightSM,
        paddingInline: paddingXS - controlLineWidth,
        paddingBlock: 0,
        lineHeight: `${controlHeightSM - controlLineWidth * 2}px`,
      },

      '&:not(:first-child)': {
        '&::before': {
          position: 'absolute',
          insetBlockStart: -controlLineWidth,
          insetInlineStart: -controlLineWidth,
          display: 'block',
          boxSizing: 'content-box',
          width: 1,
          height: '100%',
          paddingBlock: controlLineWidth,
          paddingInline: 0,
          backgroundColor: colorBorder,
          transition: `background-color ${motionDurationSlow}`,
          content: '""',
        },
      },

      '&:first-child': {
        borderInlineStart: `${controlLineWidth}px ${controlLineType} ${colorBorder}`,
        borderStartStartRadius: controlRadius,
        borderEndStartRadius: controlRadius,
      },

      '&:last-child': {
        borderStartEndRadius: controlRadius,
        borderEndEndRadius: controlRadius,
      },

      '&:first-child:last-child': {
        borderRadius: controlRadius,
      },

      '&:hover': {
        position: 'relative',
        color: radioDotColor,
      },

      '&:focus-within': {
        boxShadow: radioButtonFocusShadow,
      },

      [`${componentCls}-inner, input[type='checkbox'], input[type='radio']`]: {
        width: 0,
        height: 0,
        opacity: 0,
        pointerEvents: 'none',
      },

      '&-checked:not(&-disabled)': {
        zIndex: 1,
        color: radioDotColor,
        background: radioButtonCheckedBg,
        borderColor: radioDotColor,

        '&::before': {
          backgroundColor: radioDotColor,
        },

        '&:first-child': {
          borderColor: radioDotColor,
        },

        '&:hover': {
          color: radioButtonHoverColor,
          borderColor: radioButtonHoverColor,

          '&::before': {
            backgroundColor: radioButtonHoverColor,
          },
        },

        '&:active': {
          color: radioButtonActiveColor,
          borderColor: radioButtonActiveColor,

          '&::before': {
            backgroundColor: radioButtonActiveColor,
          },
        },

        '&:focus-within': {
          boxShadow: radioButtonFocusShadow,
        },
      },

      [`${componentCls}-group-solid &-checked:not(&-disabled)`]: {
        color: radioSolidCheckedColor,
        background: radioDotColor,
        borderColor: radioDotColor,

        '&:hover': {
          color: radioSolidCheckedColor,
          background: radioButtonHoverColor,
          borderColor: radioButtonHoverColor,
        },

        '&:active': {
          color: radioSolidCheckedColor,
          background: radioButtonActiveColor,
          borderColor: radioButtonActiveColor,
        },

        '&:focus-within': {
          boxShadow: radioButtonFocusShadow,
        },
      },

      '&-disabled': {
        color: colorTextDisabled,
        backgroundColor: colorBgComponentDisabled,
        borderColor: colorBorder,
        cursor: 'not-allowed',

        '&:first-child, &:hover': {
          color: colorTextDisabled,
          backgroundColor: colorBgComponentDisabled,
          borderColor: colorBorder,
        },
      },

      '&-disabled&-checked': {
        color: radioDisabledButtonCheckedColor,
        backgroundColor: radioDisabledButtonCheckedBg,
        borderColor: colorBorder,
        boxShadow: 'none',
      },
    },
  };
};

// ============================== Export ==============================
export default genComponentStyleHook('Radio', token => {
  const {
    padding,
    controlLineWidth,
    colorBgComponentDisabled,
    paddingXXS,
    colorTextDisabled,
    colorBgComponent,
    fontSize,
    lineHeight,
    fontSizeLG,
    colorPrimaryOutline,
    colorPrimaryHover,
    colorPrimaryActive,
    colorText,
    colorPrimary,
    marginXS,
    controlOutlineWidth,
  } = token;

  // Radio
  const radioFocusShadow = `0 0 0 ${controlOutlineWidth}px ${colorPrimaryOutline}`;
  const radioButtonFocusShadow = radioFocusShadow;

  const radioSize = fontSizeLG;
  const radioTop = (Math.round(fontSize * lineHeight) - radioSize) / 2;
  const radioDotSize = radioSize - paddingXXS * 2;
  const radioDotColor = colorPrimary;

  // Radio buttons
  const radioButtonColor = colorText;
  const radioButtonHoverColor = colorPrimaryHover;
  const radioButtonActiveColor = colorPrimaryActive;
  const radioButtonPaddingHorizontal = padding - controlLineWidth;
  const radioDisabledButtonCheckedColor = colorTextDisabled;
  const radioWrapperMarginRight = marginXS;

  const radioToken = mergeToken<RadioToken>(token, {
    radioFocusShadow,
    radioButtonFocusShadow,
    radioSize,
    radioTop,
    radioDotSize,
    radioDotColor,
    radioDotDisabledColor: colorTextDisabled,
    radioSolidCheckedColor: colorBgComponent,
    radioButtonBg: colorBgComponent,
    radioButtonCheckedBg: colorBgComponent,
    radioButtonColor,
    radioButtonHoverColor,
    radioButtonActiveColor,
    radioButtonPaddingHorizontal,
    radioDisabledButtonCheckedBg: colorBgComponentDisabled,
    radioDisabledButtonCheckedColor,
    radioWrapperMarginRight,
  });

  return [
    getGroupRadioStyle(radioToken),
    getRadioBasicStyle(radioToken),
    getRadioButtonStyle(radioToken),
  ];
});
