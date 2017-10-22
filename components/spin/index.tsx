import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Animate from 'rc-animate';
import isCssAnimationSupported from '../_util/isCssAnimationSupported';
import omit from 'omit.js';

export interface SpinProps {
  prefixCls?: string;
  className?: string;
  spinning?: boolean;
  size?: 'small' | 'default' | 'large';
  tip?: string;
  delay?: number;
  wrapperClassName?: string;
  indicator?: React.ReactNode
}

export default class Spin extends React.Component<SpinProps, any> {
  static defaultProps = {
    prefixCls: 'ant-spin',
    spinning: true,
    size: 'default',
    wrapperClassName: '',
    indicator: null,
  };

  static propTypes = {
    prefixCls: PropTypes.string,
    className: PropTypes.string,
    spinning: PropTypes.bool,
    size: PropTypes.oneOf(['small', 'default', 'large']),
    wrapperClassName: PropTypes.string,
    indicator: PropTypes.node,
  };

  debounceTimeout: number;
  delayTimeout: number;

  constructor(props) {
    super(props);
    const spinning = props.spinning;
    this.state = {
      spinning,
    };
  }

  isNestedPattern() {
    return !!(this.props && this.props.children);
  }

  componentDidMount() {
    if (!isCssAnimationSupported()) {
      // Show text in IE9
      this.setState({
        notCssAnimationSupported: true,
      });
    }
  }

  componentWillUnmount() {
    if (this.debounceTimeout) {
      clearTimeout(this.debounceTimeout);
    }
    if (this.delayTimeout) {
      clearTimeout(this.delayTimeout);
    }
  }

  componentWillReceiveProps(nextProps) {
    const currentSpinning = this.props.spinning;
    const spinning = nextProps.spinning;
    const { delay } = this.props;

    if (this.debounceTimeout) {
      clearTimeout(this.debounceTimeout);
    }
    if (currentSpinning && !spinning) {
      this.debounceTimeout = window.setTimeout(() => this.setState({ spinning }), 200);
      if (this.delayTimeout) {
        clearTimeout(this.delayTimeout);
      }
    } else {
      if (spinning && delay && !isNaN(Number(delay))) {
        if (this.delayTimeout) {
          clearTimeout(this.delayTimeout);
        }
        this.delayTimeout = window.setTimeout(() => this.setState({ spinning }), delay);
      } else {
        this.setState({ spinning });
      }
    }
  }
  render() {
    const { className, size, prefixCls, tip, wrapperClassName, indicator, ...restProps } = this.props;
    const { spinning, notCssAnimationSupported } = this.state;

    const spinClassName = classNames(prefixCls, {
      [`${prefixCls}-sm`]: size === 'small',
      [`${prefixCls}-lg`]: size === 'large',
      [`${prefixCls}-spinning`]: spinning,
      [`${prefixCls}-show-text`]: !!tip || notCssAnimationSupported,
    }, className);

    // fix https://fb.me/react-unknown-prop
    const divProps = omit(restProps, [
      'spinning',
      'delay',
    ]);

    const spinElement = (
      <div {...divProps} className={spinClassName} >
        {
          indicator ? indicator : (
            <span className={`${prefixCls}-dot`}>
              <i />
              <i />
              <i />
              <i />
            </span>
          )
        }
        {tip ? <div className={`${prefixCls}-text`}>{tip}</div> : null}
      </div>
    );
    if (this.isNestedPattern()) {
      let animateClassName = prefixCls + '-nested-loading';
      if (wrapperClassName) {
        animateClassName += ' ' + wrapperClassName;
      }
      const containerClassName = classNames({
        [`${prefixCls}-container`]: true,
        [`${prefixCls}-blur`]: spinning,
      });
      return (
        <Animate
          {...divProps}
          component="div"
          className={animateClassName}
          style={null}
          transitionName="fade"
        >
          {spinning && <div key="loading">{spinElement}</div>}
          <div className={containerClassName} key="container">
            {this.props.children}
          </div>
        </Animate>
      );
    }
    return spinElement;
  }
}
