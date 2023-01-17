/* eslint-disable global-require, import/no-dynamic-require, jest/no-export */
import React from 'react';
import ConfigProvider from '../../components/config-provider';
import { render, waitFakeTimer } from '../utils';

export interface Options {
  name?: string;
  findRootElements?: (container: HTMLElement) => HTMLCollection | Element[] | NodeListOf<Element>;
  expectCount?: number;
  beforeRender?: () => void;
}

export default function rootPropsTest(
  component: string,
  customizeRender?: (props: any) => React.ReactNode,
  options?: Options,
) {
  const Component = require(`../../components/${component}`).default as any;
  const name = options?.name ? `(${options.name})` : '';

  describe(`RootProps${name}`, () => {
    let passed = false;

    beforeEach(() => {
      passed = false;
      jest.useFakeTimers();
    });

    afterEach(() => {
      if (!passed || process.env.DEBUG === 'true') {
        console.log(document.body.innerHTML);
      }
      jest.useRealTimers();
    });

    it('rootClassName', async () => {
      const rootClassName = 'TEST_ROOT_CLS';

      if (options?.beforeRender) {
        options?.beforeRender();
      }

      const Demo = () => {
        const holderRef = React.useRef<HTMLDivElement>(null);
        const [show, setShow] = React.useState(false);
        React.useEffect(() => {
          setShow(true);
        }, []);

        const sharedProps = {
          value: 1,
          rootClassName,
          open: true,
        };

        const node = customizeRender ? (
          customizeRender(sharedProps)
        ) : (
          <Component {...sharedProps} />
        );

        return (
          <div id="holder" className="holder" ref={holderRef}>
            {show && (
              <ConfigProvider getPopupContainer={() => holderRef.current!}>{node}</ConfigProvider>
            )}
          </div>
        );
      };

      const { container } = render(<Demo />);
      await waitFakeTimer();

      const holder = container.querySelector<HTMLElement>('#holder')!;
      const childList = Array.from(options?.findRootElements?.(holder) ?? holder.children);

      expect(childList.length).toBeGreaterThan(0);
      if (options?.expectCount) {
        expect(childList.length).toBe(options.expectCount);
      }

      childList.forEach((ele) => {
        expect(ele).toHaveClass(rootClassName);

        // `rootClassName` should not show in children element
        expect(ele.querySelector(`.${rootClassName}`)).toBeFalsy();
      });

      passed = true;
    });
  });
}
