import * as React from 'react';
import devWarning from '../_util/devWarning';
import Base, { BlockProps } from './Base';
import { tupleNum } from '../_util/type';

const TITLE_ELE_LIST = tupleNum(1, 2, 3, 4, 5);

type Remove<T, K> = {
  [P in Exclude<keyof T, K>]: T[P];
};

export interface TitleProps extends Remove<BlockProps, 'strong'> {
  level?: typeof TITLE_ELE_LIST[number];
}

const Title: React.FC<TitleProps> = props => {
  const { level = 1, ...restProps } = props;
  let component: string;

  if (TITLE_ELE_LIST.indexOf(level) !== -1) {
    component = `h${level}`;
  } else {
    devWarning(
      false,
      'Typography.Title',
      'Title only accept `1 | 2 | 3 | 4 | 5` as `level` value. And `5` need 4.6.0+ version.',
    );
    component = 'h1';
  }

  return <Base {...restProps} component={component} />;
};

export default Title;
