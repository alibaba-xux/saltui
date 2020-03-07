/**
 * Calendar Component Demo for SaltUI
 * @author quanyun.mqy
 *
 * Copyright 2018-2019, SaltUI Team.
 * All rights reserved.
 */

import React from 'react';
import Button from 'salt-button';
import Calendar from 'salt-calendar';

class CalendarDemo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: {
        startDate: '2019-01-12',
        endDate: '2019-01-14',
      },
      // value: {
      // value: 1499702400000,
      // startDate: 1499702400000,
      // startDateType: 'PM',
      // endDate: 1499961600000,
      // endDateType: 'PM',
      // },
      // value: 1489702400000, // 1499961600000
    };
    // 禁用钉钉容器的 webViewBounce
    window.dd && window.dd.ui.webViewBounce.disable();
    this.calendarProps = {
      maskClosable: true,
      renderDayBadge: Calendar.util.generateSpecialWorkdayOrHolidayRender({
        '2017-07-22': 'work',
        '2017-07-25': 'leave',
      }),
      disabledDate: current => current > new Date().getTime(),
      renderCustomDayLabel(curren, value) {
        if (Calendar.util.isSameDay(curren, '2017.7.31')) {
          return (
            <span className="special-day">端午节</span>
          );
        }
        return null;
      },
    };
  }

  onOk(value) {
    console.log('onOk, and value is: ', value);
    this.setState({
      value,
      visible: false,
    });
  }

  onCancel() {
    console.log('onCancel');
    this.setState({
      visible: false,
    });
  }

  onMaskClose() {
    console.log('onMaskClose');
  }

  render() {
    return (
      <div className="t-calendar-demo">
        <input />
        <Button onClick={() => {
          this.setState({
            visible: true,
            singleMode: true,
            animationType: 'slideLeft',
            showHalfDay: false,
          });
        }}
        >打开单点日历
        </Button>
        <Button
          style={{ marginTop: 10 }}
          onClick={() => {
          this.setState({
            visible: true,
            singleMode: false,
            animationType: 'slideLeft',
            showHalfDay: false,
          });
        }}
        >打开级联日历
        </Button>
        <Button
          style={{ marginTop: 10 }}
          onClick={() => {
          this.setState({
            visible: true,
            singleMode: false,
            showHalfDay: true,
            animationType: 'slideLeft',
          });
        }}
        >打开级联日历，可选择半天
        </Button>
        <Button
          style={{ marginTop: 10 }}
          onClick={() => {
          this.setState({
            visible: true,
            singleMode: false,
            animationType: 'slideUp',
            showHalfDay: true,
          });
        }}
        >从底部划出
        </Button>
        <Calendar
          {...this.calendarProps}
          {...this.state}
          onOk={(value) => { this.onOk(value); }}
          onCancel={() => { this.onCancel(); }}
          onMaskClose={() => { this.onMaskClose(); }}
        />
      </div>
    );
  }
}

export default CalendarDemo;
