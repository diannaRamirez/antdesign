import { Keyframes } from '@ant-design/cssinjs';
import type { FullToken, GenerateStyle } from '../../theme';
import { genComponentStyleHook, mergeToken } from '../../theme';
import genNotificationPlacementStyle from './placement';
import { resetComponent } from '../../style';

/** Component only token. Which will handle additional calculation of alias token */
export interface ComponentToken {
  zIndexPopup: number;
  width: number;
}

export interface NotificationToken extends FullToken<'Notification'> {
  notificationBg: string;
  notificationPaddingVertical: number;
  notificationPaddingHorizontal: number;
  notificationPadding: string;
  notificationMarginBottom: number;
  notificationMarginEdge: number;
  animationMaxHeight: number;
}

const genNotificationStyle: GenerateStyle<NotificationToken> = token => {
  const {
    iconCls,
    componentCls, // .ant-notification
    boxShadow,
    fontSizeLG,
    notificationMarginBottom,
    radiusBase,
    colorSuccess,
    colorInfo,
    colorWarning,
    colorError,
    colorTextHeading,
    notificationBg,
    notificationPadding,
    notificationMarginEdge,
    motionDurationMid,
    motionEaseInOut,
    fontSizeBase,
    lineHeight,
    width,
  } = token;

  const noticeCls = `${componentCls}-notice`;

  const notificationFadeIn = new Keyframes('antNotificationFadeIn', {
    '0%': {
      left: {
        _skip_check_: true,
        value: width,
      },
      opacity: 0,
    },

    '100%': {
      left: {
        _skip_check_: true,
        value: 0,
      },
      opacity: 1,
    },
  });

  const notificationFadeOut = new Keyframes('antNotificationFadeOut', {
    '0%': {
      maxHeight: token.animationMaxHeight,
      marginBottom: notificationMarginBottom,
      opacity: 1,
    },

    '100%': {
      maxHeight: 0,
      marginBottom: 0,
      paddingTop: 0,
      paddingBottom: 0,
      opacity: 0,
    },
  });

  return [
    // ============================ Holder ============================
    {
      [componentCls]: {
        ...resetComponent(token),

        position: 'fixed',
        zIndex: token.zIndexPopup,
        marginInlineEnd: notificationMarginEdge,

        [`${componentCls}-hook-holder`]: {
          position: 'relative',
        },

        [`&${componentCls}-top, &${componentCls}-bottom`]: {
          [`${componentCls}-notice`]: {
            marginInline: 'auto auto',
          },
        },

        [`&${componentCls}-topLeft, &${componentCls}-bottomLeft`]: {
          [`${componentCls}-notice`]: {
            marginInlineEnd: 'auto',
            marginInlineStart: 0,
          },
        },

        //  animation
        [`${componentCls}-fade-enter, ${componentCls}-fade-appear`]: {
          animationDuration: token.motionDurationMid,
          animationTimingFunction: motionEaseInOut,
          animationFillMode: 'both',
          opacity: 0,
          animationPlayState: 'paused',
        },

        [`${componentCls}-fade-leave`]: {
          animationTimingFunction: motionEaseInOut,
          animationFillMode: 'both',

          animationDuration: motionDurationMid,
          animationPlayState: 'paused',
        },

        [`${componentCls}-fade-enter${componentCls}-fade-enter-active, ${componentCls}-fade-appear${componentCls}-fade-appear-active`]:
          {
            animationName: notificationFadeIn,
            animationPlayState: 'running',
          },

        [`${componentCls}-fade-leave${componentCls}-fade-leave-active`]: {
          animationName: notificationFadeOut,
          animationPlayState: 'running',
        },

        // placement
        ...genNotificationPlacementStyle(token),

        // RTL
        '&-rtl': {
          direction: 'rtl',

          [`${componentCls}-notice-btn`]: {
            float: 'left',
          },
        },
      },
    },

    // ============================ Notice ============================
    {
      [noticeCls]: {
        position: 'relative',
        width,
        maxWidth: `calc(100vw - ${notificationMarginEdge * 2}px)`,
        marginBottom: notificationMarginBottom,
        marginInlineStart: 'auto',
        padding: notificationPadding,
        overflow: 'hidden',
        lineHeight,
        wordWrap: 'break-word',
        background: notificationBg,
        borderRadius: radiusBase,
        boxShadow,

        [`${componentCls}-close-icon`]: {
          fontSize: fontSizeBase,
          cursor: 'pointer',
        },

        [`${noticeCls}-message`]: {
          marginBottom: token.marginXS,
          color: colorTextHeading,
          fontSize: fontSizeLG,
          lineHeight: token.lineHeightLG,
        },

        [`${noticeCls}-description`]: {
          fontSize: fontSizeBase,
        },

        [`&${noticeCls}-closable ${noticeCls}-message`]: {
          paddingInlineEnd: token.paddingLG,
        },

        [`${noticeCls}-with-icon ${noticeCls}-message`]: {
          marginBottom: token.marginXXS,
          marginInlineStart: token.marginXXL,
          fontSize: fontSizeLG,
        },

        [`${noticeCls}-with-icon ${noticeCls}-description`]: {
          marginInlineStart: token.marginXXL,
          fontSize: fontSizeBase,
        },

        // Icon & color style in different selector level
        // https://github.com/ant-design/ant-design/issues/16503
        // https://github.com/ant-design/ant-design/issues/15512
        [`${noticeCls}-icon`]: {
          position: 'absolute',
          marginInlineStart: token.marginXXS,
          fontSize: token.fontSizeLG * token.lineHeightLG,

          // icon-font
          [`&-success${iconCls}`]: {
            color: colorSuccess,
          },
          [`&-info${iconCls}`]: {
            color: colorInfo,
          },
          [`&-warning${iconCls}`]: {
            color: colorWarning,
          },
          [`&-error${iconCls}`]: {
            color: colorError,
          },
        },

        [`${noticeCls}-close`]: {
          position: 'absolute',
          top: token.notificationPaddingVertical,
          insetInlineEnd: token.notificationPaddingHorizontal,
          color: token.colorAction,
          outline: 'none',

          '&:hover': {
            color: token.colorActionHover,
          },
        },

        [`${noticeCls}-btn`]: {
          float: 'right',
          marginTop: token.margin,
        },
      },
    },

    // ============================= Pure =============================
    {
      [`${noticeCls}-pure-panel`]: {
        margin: 0,
      },
    },
  ];
};

// ============================== Export ==============================
export default genComponentStyleHook(
  'Notification',
  token => {
    const notificationPaddingVertical = token.padding;
    const notificationPaddingHorizontal = token.paddingLG;

    const notificationToken = mergeToken<NotificationToken>(token, {
      // default.less variables
      notificationBg: token.colorBgElevated,
      notificationPaddingVertical,
      notificationPaddingHorizontal,
      // index.less variables
      notificationPadding: `${notificationPaddingVertical}px ${notificationPaddingHorizontal}px`,
      notificationMarginBottom: token.margin,
      notificationMarginEdge: token.marginLG,
      animationMaxHeight: 150,
    });

    return [genNotificationStyle(notificationToken)];
  },
  token => ({
    zIndexPopup: token.zIndexPopupBase + 50,
    width: 384,
  }),
);
