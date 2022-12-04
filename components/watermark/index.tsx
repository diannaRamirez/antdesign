import React, { useEffect, useMemo, useRef } from 'react';
import useMutationObserver from './useMutationObserver';

const FontGap = 3;

const getStyleStr = (style: Record<string, string | number>): string => {
  let styleStr = '';
  Object.keys(style).forEach((item) => {
    const key = item.replace(/([A-Z])/g, '-$1').toLowerCase();
    styleStr += `${key}: ${style[item]}; `;
  });
  return styleStr;
};

export interface WatermarkProps {
  zIndex?: number;
  rotate?: number;
  width?: number;
  height?: number;
  image?: string;
  content?: string | string[];
  font?: {
    color?: string;
    fontSize?: number | string;
    fontWeight?: 'normal' | 'light' | 'weight' | number;
    fontStyle?: 'none' | 'normal' | 'italic' | 'oblique';
    fontFamily?: string;
  };
  style?: React.CSSProperties;
  className?: string;
  gap?: [number, number];
  offset?: [number, number];
  children?: React.ReactNode;
}

const Watermark: React.FC<WatermarkProps> = (props) => {
  const {
    /**
     * The antd content layer zIndex is basically below 10
     * https://github.com/ant-design/ant-design/blob/6192403b2ce517c017f9e58a32d58774921c10cd/components/style/themes/default.less#L335
     */
    zIndex = 9,
    rotate = -22,
    width,
    height,
    image,
    content,
    font = {},
    style,
    className,
    gap = [200, 200],
    offset,
    children,
  } = props;

  const {
    color = 'rgba(0,0,0,.15)',
    fontSize = 16,
    fontWeight = 'normal',
    fontStyle = 'normal',
    fontFamily = 'sans-serif',
  } = font;

  const [gapX, gapY] = gap;

  /** Calculate the style of the offset */
  const offsetStyle = useMemo(() => {
    const gapXCenter = gapX / 2;
    const gapYCenter = gapY / 2;
    const offsetLeft = offset?.[0] ?? gapXCenter;
    const offsetTop = offset?.[1] ?? gapYCenter;
    const mergedOffsetStyle: React.CSSProperties = {};
    let mergedOffsetLeft = offsetLeft - gapXCenter;
    let mergedOffsetTop = offsetTop - gapYCenter;

    if (mergedOffsetLeft > 0) {
      mergedOffsetStyle.left = `${mergedOffsetLeft}px`;
      mergedOffsetStyle.width = `calc(100% - ${mergedOffsetLeft}px)`;
      mergedOffsetLeft = 0;
    }
    if (mergedOffsetTop > 0) {
      mergedOffsetStyle.top = `${mergedOffsetTop}px`;
      mergedOffsetStyle.height = `calc(100% - ${mergedOffsetTop}px)`;
      mergedOffsetTop = 0;
    }

    return {
      ...mergedOffsetStyle,
      backgroundPosition: `${mergedOffsetLeft}px ${mergedOffsetTop}px`,
    };
  }, [offset, gap]);

  const getMarkStyle = (markWidth: number) => ({
    zIndex,
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
    backgroundSize: `${gapX + markWidth}px`,
    pointerEvents: 'none',
    backgroundRepeat: 'repeat',
    ...offsetStyle,
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const watermarkDom = useRef<HTMLDivElement>();
  const { WATERMARK_ID_NAME, watermarkId, createObserver, destroyObserver } = useMutationObserver();

  const destroyWatermark = () => {
    if (watermarkDom.current) {
      watermarkDom.current.remove();
      watermarkDom.current = undefined;
    }
  };

  const reRendering = (mutation: MutationRecord) => {
    let flag = false;
    // Whether to delete the watermark node
    if (mutation.removedNodes.length) {
      mutation.removedNodes.forEach((node) => {
        if ((node as HTMLDivElement).getAttribute?.(WATERMARK_ID_NAME) === watermarkId) {
          flag = true;
        }
      });
    }
    // Whether the watermark dom property value has been modified
    if (
      mutation.type === 'attributes' &&
      ((mutation.target as HTMLDivElement).getAttribute?.(WATERMARK_ID_NAME) === watermarkId ||
        mutation.attributeName === WATERMARK_ID_NAME)
    ) {
      flag = true;
    }
    return flag;
  };

  const appendWatermark = (base64Url: string, markWidth: number) => {
    if (containerRef.current && watermarkDom.current) {
      destroyObserver();
      watermarkDom.current.setAttribute(WATERMARK_ID_NAME, watermarkId);
      watermarkDom.current.setAttribute(
        'style',
        getStyleStr({
          ...getMarkStyle(markWidth),
          backgroundImage: `url('${base64Url}')`,
        }),
      );
      containerRef.current?.append(watermarkDom.current);
      createObserver(containerRef.current, (mutations) => {
        mutations.forEach((mutation) => {
          if (reRendering(mutation)) {
            destroyWatermark();
            // eslint-disable-next-line @typescript-eslint/no-use-before-define
            renderWatermark();
          }
        });
      });
    }
  };

  /**
   * Get the width and height of the watermark. The default values are as follows
   * Image: [120, 64]; Content: It's calculated by content;
   */
  const getMarkSize = (ctx: CanvasRenderingContext2D) => {
    let defaultWidth = 120;
    let defaultHeight = 64;
    if (!image && ctx.measureText) {
      ctx.font = `${Number(fontSize)}px ${fontFamily}`;
      const contents = Array.isArray(content) ? content : [content];
      const widths = contents.map((item) => ctx.measureText(item as string).width);
      defaultWidth = Math.ceil(Math.max(...widths));
      defaultHeight = Number(fontSize) * contents.length + (contents.length - 1) * FontGap;
    }
    return [width ?? defaultWidth, height ?? defaultHeight];
  };

  const renderWatermark = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (ctx) {
      if (!watermarkDom.current) {
        watermarkDom.current = document.createElement('div');
      }

      const ratio = window.devicePixelRatio || 1;
      const [markWidth, markHeight] = getMarkSize(ctx);
      const canvasWidth = `${(gapX + markWidth) * ratio}px`;
      const canvasHeight = `${(gapY + markHeight) * ratio}px`;
      canvas.setAttribute('width', canvasWidth);
      canvas.setAttribute('height', canvasHeight);

      const mergedMarkWidth = markWidth * ratio;
      const mergedMarkHeight = markHeight * ratio;
      const gapXCenter = (gapX * ratio) / 2;
      const gapYCenter = (gapY * ratio) / 2;

      /** Rotate with the canvas as the center point */
      const centerX = (mergedMarkWidth + gapX * ratio) / 2;
      const centerY = (mergedMarkHeight + gapY * ratio) / 2;
      ctx.translate(centerX, centerY);
      ctx.rotate((Math.PI / 180) * Number(rotate));
      ctx.translate(-centerX, -centerY);

      if (image) {
        const img = new Image();
        img.onload = () => {
          ctx.drawImage(img, gapXCenter, gapYCenter, mergedMarkWidth, mergedMarkHeight);
          appendWatermark(canvas.toDataURL(), markWidth);
        };
        img.crossOrigin = 'anonymous';
        img.referrerPolicy = 'no-referrer';
        img.src = image;
      } else {
        const mergedFontSize = Number(fontSize) * ratio;
        ctx.font = `${fontStyle} normal ${fontWeight} ${mergedFontSize}px/${mergedMarkHeight}px ${fontFamily}`;
        ctx.fillStyle = color;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.translate(mergedMarkWidth / 2, 0);
        if (Array.isArray(content)) {
          content?.forEach((item: string, index: number) =>
            ctx.fillText(item, gapXCenter, gapYCenter + index * (mergedFontSize + FontGap * ratio)),
          );
        } else {
          ctx.fillText(content ?? '', gapXCenter, gapYCenter);
        }
        appendWatermark(canvas.toDataURL(), markWidth);
      }
    }
  };

  useEffect(() => {
    renderWatermark();
  }, [rotate, zIndex, width, height, image, content, font, style, className, gap]);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        ...style,
      }}
      className={className}
    >
      {children}
    </div>
  );
};

export default Watermark;
