import type { CSSObject } from '@ant-design/cssinjs';
import type { GenerateStyle } from '../../_util/theme';
import type { TableToken } from './index';

const genStickyStyle: GenerateStyle<TableToken, CSSObject> = token => {
  const {
    componentCls,
    colorLoadingOpacity,
    tableScrollThumbBg,
    tableScrollThumbBgHover,
    tableScrollThumbSize,
    tableScrollBg,
  } = token;
  const tableBorder = `${token.controlLineWidth}px ${token.controlLineType} ${token.tableBorderColor}`;
  return {
    [`${componentCls}-wrapper`]: {
      [`${componentCls}-sticky`]: {
        '&-holder': {
          position: 'sticky',
          zIndex: token.zIndexTableSticky,
          background: token.colorBgComponent,
        },

        '&-scroll': {
          position: 'sticky',
          bottom: 0,
          height: `${tableScrollThumbSize}px !important`,
          zIndex: token.zIndexTableSticky,
          display: 'flex',
          alignItems: 'center',
          background: tableScrollBg,
          borderTop: tableBorder,
          opacity: colorLoadingOpacity,

          '&:hover': {
            transformOrigin: 'center bottom',
          },

          // fake scrollbar style of sticky
          '&-bar': {
            height: tableScrollThumbSize,
            backgroundColor: tableScrollThumbBg,
            borderRadius: 100,
            transition: `all ${token.motionDurationSlow}, transform none`,
            position: 'absolute',
            bottom: 0,

            '&:hover, &-active': {
              backgroundColor: tableScrollThumbBgHover,
            },
          },
        },
      },
    },
  };
};

export default genStickyStyle;
