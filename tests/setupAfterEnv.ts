import { toHaveNoViolations } from 'jest-axe';
import '@testing-library/jest-dom';
import format, { plugins } from 'pretty-format';

/**
 * React 17 & 18 will have different behavior in some special cases:
 *
 * React 17:
 *
 * ```html
 * <span> Hello World </span>
 * ```
 *
 * React 18:
 *
 * ```html
 * <span> Hello World </span>
 * ```
 *
 * These diff is nothing important in front end but will break in snapshot diff.
 */
expect.addSnapshotSerializer({
  test: element =>
    element instanceof HTMLElement || (Array.isArray(element) && element[0] instanceof HTMLElement),
  print: element => {
    const htmlContent = format(element, {
      plugins: [plugins.DOMCollection, plugins.DOMElement],
    });

    const filtered = htmlContent
      .split(/[\n\r]+/)
      .filter(line => line.trim())
      .join('\n');

    return filtered;
  },
});

expect.extend(toHaveNoViolations);
