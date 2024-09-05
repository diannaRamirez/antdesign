import React from 'react';
import { useMergedState } from 'rc-util';

import type { PanelProps } from '../interface';

/**
 * Save the size state.
 * Align the size into flex percentage base.
 */
export default function useSizes(items: PanelProps[], containerSize: number) {
  const propSize = items.map((item) => item.size);

  const itemsCount = items.length;

  // We do not need care the size state match the `items` length in `useState`.
  // It will calculate later.
  const [size, setSize] = useMergedState<(string | number | undefined)[]>([], {
    value: propSize,
  });

  // Post handle the size. Will do:
  // 1. Convert all the px into percentage if not empty.
  // 2. Get rest percentage for exist percentage.
  // 3. Fill the rest percentage into empty item.
  const postPercentSizes = React.useMemo(() => {
    const ptgList: number[] = [];
    let emptyCount = 0;

    // Fill default percentage
    for (let i = 0; i < itemsCount; i += 1) {
      const itemSize = size[i];

      if (typeof itemSize === 'string' && itemSize.endsWith('%')) {
        ptgList[i] = Number(itemSize.slice(0, -1));
      } else if (itemSize || itemSize === 0) {
        const num = Number(itemSize);
        if (!Number.isNaN(num)) {
          ptgList[i] = num / containerSize;
        }
      } else {
        emptyCount += 1;
      }
    }

    // Get empty percentage
    const totalPtg = ptgList.reduce((acc, ptg) => acc + ptg, 0);
    const restPtg = 1 - totalPtg;
    const restAvgPtg = Math.max(restPtg, 0) / emptyCount;

    // Fill empty percentage
    for (let i = 0; i < itemsCount; i += 1) {
      if (ptgList[i] === undefined) {
        ptgList[i] = restAvgPtg;
      }
    }

    return ptgList;
  }, [size, containerSize]);

  return [postPercentSizes] as const;
}
