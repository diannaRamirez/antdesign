import fs from 'fs';
import path from 'path';
import localPackage from '../package.json';

// =================================================================
// ==                           Version                           ==
// =================================================================
const { version } = localPackage;

fs.writeFileSync(
  path.join(__dirname, '..', 'components', 'version', 'version.ts'),
  `export default '${version}';`,
  'utf8',
);

// =================================================================
// ==                          StyleKeys                          ==
// =================================================================
// When style name length <= 5, we just ignore it since it's smaller.
const KEY_LIST = [
  'WebkitBackfaceVisibility',
  'WebkitBoxOrient',
  'WebkitLineClamp',
  'WebkitTapHighlightColor',
  'WebkitTransformStyle',
  'alignItems',
  'alignSelf',
  'animationDelay',
  'animationDirection',
  'animationDuration',
  'animationFillMode',
  'animationIterationCount',
  'animationName',
  'animationPlayState',
  'animationTimingFunction',
  'appearance',
  'background',
  'backgroundClip',
  'backgroundColor',
  'backgroundImage',
  'backgroundPosition',
  'backgroundRepeat',
  'backgroundSize',
  'border',
  'borderBlockEnd',
  'borderBlockEndColor',
  'borderBlockEndWidth',
  'borderBlockStart',
  'borderBlockStartColor',
  'borderBlockStartWidth',
  'borderBottom',
  'borderBottomColor',
  'borderBottomWidth',
  'borderCollapse',
  'borderColor',
  'borderEndEndRadius',
  'borderEndStartRadius',
  'borderInlineEnd',
  'borderInlineEndColor',
  'borderInlineEndWidth',
  'borderInlineStart',
  'borderInlineStartColor',
  'borderInlineStartWidth',
  'borderLeft',
  'borderLeftColor',
  'borderRadius',
  'borderRight',
  'borderRightColor',
  'borderSpacing',
  'borderStartEndRadius',
  'borderStartStartRadius',
  'borderStyle',
  'borderTop',
  'borderTopColor',
  'borderTopWidth',
  'borderWidth',
  'bottom',
  'boxShadow',
  'boxSizing',
  'columnGap',
  'container',
  'content',
  'cursor',
  'direction',
  'display',
  'filter',
  'flexBasis',
  'flexDirection',
  'flexFlow',
  'flexGrow',
  'flexShrink',
  'flexWrap',
  'fontFamily',
  'fontSize',
  'fontStretch',
  'fontStyle',
  'fontVariant',
  'fontWeight',
  'height',
  'insetBlock',
  'insetBlockEnd',
  'insetBlockStart',
  'insetInline',
  'insetInlineEnd',
  'insetInlineStart',
  'justifyContent',
  'justifyItems',
  'letterSpacing',
  'lineHeight',
  'listStyle',
  'listStylePosition',
  'listStyleType',
  'margin',
  'marginBlock',
  'marginBlockEnd',
  'marginBlockStart',
  'marginBottom',
  'marginInline',
  'marginInlineEnd',
  'marginInlineStart',
  'marginLeft',
  'marginRight',
  'marginTop',
  'maxHeight',
  'maxWidth',
  'minHeight',
  'minWidth',
  'objectFit',
  'opacity',
  'outline',
  'outlineColor',
  'overflow',
  'overflowWrap',
  'overflowX',
  'overflowY',
  'padding',
  'paddingBlock',
  'paddingBlockStart',
  'paddingBottom',
  'paddingInline',
  'paddingInlineEnd',
  'paddingInlineStart',
  'paddingLeft',
  'paddingRight',
  'paddingTop',
  'pointerEvents',
  'position',
  'resize',
  'rowGap',
  'stroke',
  'tabSize',
  'tableLayout',
  'textAlign',
  'textDecoration',
  'textDecorationSkipInk',
  'textIndent',
  'textOverflow',
  'textRendering',
  'textShadow',
  'textTransform',
  'touchAction',
  'transform',
  'transformOrigin',
  'transition',
  'transitionDuration',
  'transitionTimingFunction',
  'userSelect',
  'verticalAlign',
  'visibility',
  'whiteSpace',
  'width',
  'willChange',
  'wordBreak',
  'wordWrap',
  'writingMode',
  'zIndex',
];

const sheet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

const styleMap: Record<string, string> = {};
KEY_LIST.forEach((key, index) => {
  const id =
    (index >= sheet.length ? sheet[Math.floor(index / sheet.length) - 1] : '') +
    sheet[index % sheet.length];

  styleMap[key] = id;
});

const sheetPath = path.join(__dirname, '..', 'components', 'style', 'sheet.ts');

const SHEET_COMMENT = '/** Auto Generated By `generate-envPrepare` */';
let sheetReplaceStart = false;
const sheetFileLines: string[] = [];
fs.readFileSync(sheetPath, 'utf8')
  .split(/\n/)
  .forEach((line) => {
    if (line.includes(SHEET_COMMENT)) {
      if (sheetReplaceStart) {
        sheetReplaceStart = false;
      } else {
        sheetReplaceStart = true;
      }
      return;
    }

    sheetFileLines.push(line);
  });

fs.writeFileSync(sheetPath, sheetFileLines.join('\n'), 'utf8');
