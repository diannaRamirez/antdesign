import type { ReactNode, CSSProperties } from 'react';
import type {
  TourProps as RCTourProps,
  TourStepProps as RCTourStepProps,
} from '@rc-component/tour';

export type TourProps = Omit<RCTourProps, 'renderPanel'> & {
  steps?: TourStepProps[];
  className?: string;
  prefixCls?: string;
  current?: number;
  stepRender?: (current: number, total: number) => ReactNode;
  type?: 'default' | 'primary'; //	default	类型，影响底色与文字颜色
};

export interface TourStepProps extends RCTourStepProps {
  cover?: ReactNode; // 展示的图片或者视频
  title: ReactNode; // 标题
  description?: ReactNode; //	主要描述部分
  nextButtonProps?: { children?: ReactNode; onClick?: () => void };
  prevButtonProps?: { children?: ReactNode; onClick?: () => void };
  finishButtonProps?: { children?: ReactNode; onClick?: () => void };
  style?: CSSProperties;
  stepRender?: (current: number, total: number) => ReactNode;
  type?: 'default' | 'primary'; //	default	类型，影响底色与文字颜色
}

export interface TourLocale {
  Next: string;
  Previous: string;
  Finish: string;
}
