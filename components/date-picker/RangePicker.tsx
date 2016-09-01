import React from 'react';
import moment from 'moment';
import RangeCalendar from 'rc-calendar/lib/RangeCalendar';
import RcDatePicker from 'rc-calendar/lib/Picker';
import classNames from 'classnames';
import Icon from '../icon';

export default class RangePicker extends React.Component<any, any> {
  static defaultProps = {
    defaultValue: [],
  };

  constructor(props) {
    super(props);
    const { value, defaultValue } = this.props;
    const start = (value && value[0]) || defaultValue[0];
    const end = (value && value[1]) || defaultValue[1];
    this.state = {
      value: [start, end],
    };
  }

  componentWillReceiveProps(nextProps) {
    if ('value' in nextProps) {
      this.setState({
        value: nextProps.value || [],
      });
    }
  }

  clearSelection = (e) => {
    e.preventDefault();
    e.stopPropagation();
    this.setState({ value: [] });
    this.handleChange([]);
  }

  handleChange = (value) => {
    const props = this.props;
    if (!('value' in props)) {
      this.setState({ value });
    }
    props.onChange(value);
  }

  render() {
    const props = this.props;
    const locale = props.locale;
    // 以下两行代码
    // 给没有初始值的日期选择框提供本地化信息
    // 否则会以周日开始排
    let defaultCalendarValue = moment();

    const { disabledDate, showTime, getCalendarContainer,
      transitionName, disabled, popupStyle, align, style, onOk } = this.props;
    const state = this.state;

    const calendarClassName = classNames({
      'ant-calendar-time': showTime,
    });

    // 需要选择时间时，点击 ok 时才触发 onChange
    let pickerChangeHandler = {
      onChange: this.handleChange,
    };
    let calendarHandler: Object = {
      onOk: this.handleChange,
    };
    if (props.timePicker) {
      pickerChangeHandler.onChange = (value) => {
        this.handleChange(value);
      };
    } else {
      calendarHandler = {};
    }

    const startPlaceholder = ('startPlaceholder' in this.props)
      ? props.startPlaceholder : locale.lang.rangePlaceholder[0];
    const endPlaceholder = ('endPlaceholder' in props)
      ? props.endPlaceholder : locale.lang.rangePlaceholder[1];

    const calendar = (
      <RangeCalendar
        {...calendarHandler}
        prefixCls="ant-calendar"
        className={calendarClassName}
        timePicker={props.timePicker}
        disabledDate={disabledDate}
        dateInputPlaceholder={[startPlaceholder, endPlaceholder]}
        locale={locale.lang}
        onOk={onOk}
        defaultValue={[defaultCalendarValue, defaultCalendarValue]}
      />
    );

    const clearIcon = (!props.disabled && state.value && (state.value[0] || state.value[1]))
      ? <Icon
        type="cross-circle"
        className="ant-calendar-picker-clear"
        onClick={this.clearSelection}
      /> : null;

    return (<span className={props.pickerClass} style={style}>
      <RcDatePicker
        {...pickerChangeHandler}
        transitionName={transitionName}
        disabled={disabled}
        calendar={calendar}
        value={state.value}
        prefixCls="ant-calendar-picker-container"
        style={popupStyle}
        align={align}
        getCalendarContainer={getCalendarContainer}
        onOpen={props.toggleOpen}
        onClose={props.toggleOpen}
      >
        {
          ({ value }) => {
            const start = value[0];
            const end = value[1];
            return (
              <span className={props.pickerInputClass} disabled={disabled}>
                <input
                  disabled={disabled}
                  readOnly
                  value={(start && start.format(props.format)) || ''}
                  placeholder={startPlaceholder}
                  className="ant-calendar-range-picker-input"
                />
                <span className="ant-calendar-range-picker-separator"> ~ </span>
                <input
                  disabled={disabled}
                  readOnly
                  value={(end && end.format(props.format)) || ''}
                  placeholder={endPlaceholder}
                  className="ant-calendar-range-picker-input"
                />
                {clearIcon}
                <span className="ant-calendar-picker-icon" />
              </span>
            );
          }
        }
      </RcDatePicker>
    </span>);
  }
}
