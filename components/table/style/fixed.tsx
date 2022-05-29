import type { CSSObject } from '@ant-design/cssinjs';
import { TinyColor } from '@ctrl/tinycolor';
import type { GenerateStyle } from '../../_util/theme';
import type { TableToken } from './index';

const genFixedStyle: GenerateStyle<TableToken, CSSObject> = token => {
  const { componentCls } = token;
  // FIXME
  const shadowColor = new TinyColor('rgba(0, 0, 0, 0.15)').darken(5).toRgbString();
  return {
    [`${componentCls}-wrapper`]: {
      [`
        ${componentCls}-cell-fix-left,
        ${componentCls}-cell-fix-right
      `]: {
        position: 'sticky !important' as 'sticky',
        zIndex: token.zIndexTableFixed,
        background: token.tableBg,
      },

      [`
        ${componentCls}-cell-fix-left-first::after,
        ${componentCls}-cell-fix-left-last::after
      `]: {
        position: 'absolute',
        top: 0,
        insetInlineEnd: 0,
        bottom: -1,
        width: 30,
        transform: 'translateX(100%)',
        transition: `box-shadow ${token.motionDurationSlow}`,
        content: '""',
        pointerEvents: 'none',
      },

      [`
        ${componentCls}-cell-fix-right-first::after,
        ${componentCls}-cell-fix-right-last::after
      `]: {
        position: 'absolute',
        top: 0,
        bottom: -1,
        insetInlineStart: 0,
        width: 30,
        transform: 'translateX(-100%)',
        transition: `box-shadow ${token.motionDurationSlow}`,
        content: '""',
        pointerEvents: 'none',
      },

      [`${componentCls}-container`]: {
        '&::before, &::after': {
          position: 'absolute',
          top: 0,
          bottom: 0,
          zIndex: 1,
          width: 30,
          transition: `box-shadow ${token.motionDurationSlow}`,
          content: '""',
          pointerEvents: 'none',
        },

        '&::before': {
          insetInlineStart: 0,
        },

        '&::after': {
          insetInlineEnd: 0,
        },
      },

      [`${componentCls}-ping-left`]: {
        [`&:not(${componentCls}-has-fix-left) ${componentCls}-container`]: {
          position: 'relative',

          '&::before': {
            boxShadow: `inset 10px 0 8px -8px ${shadowColor}`,
          },
        },

        [`
          ${componentCls}-cell-fix-left-first::after,
          ${componentCls}-cell-fix-left-last::after
        `]: {
          boxShadow: `inset 10px 0 8px -8px ${shadowColor}`,
        },

        [`${componentCls}-cell-fix-left-last::before`]: {
          backgroundColor: 'transparent !important',
        },
      },

      [`${componentCls}-ping-right`]: {
        [`&:not(${componentCls}-has-fix-right) ${componentCls}-container`]: {
          position: 'relative',

          '&::after': {
            boxShadow: `inset -10px 0 8px -8px ${shadowColor}`,
          },
        },

        [`
          ${componentCls}-cell-fix-right-first::after,
          ${componentCls}-cell-fix-right-last::after
        `]: {
          boxShadow: `inset -10px 0 8px -8px ${shadowColor}`,
        },
      },
    },
  };
};

export default genFixedStyle;
