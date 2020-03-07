/**
 * Steps Component for SaltUI
 * @author muwen.lb
 *
 * Copyright 2018-2019, SaltUI Team.
 * All rights reserved.
 */
import React from 'react';
import PropTypes from 'prop-types';
import Check from 'salt-icon/lib/Check';
import classnames from 'classnames';
import Context from '../Context';

const { prefixClass } = Context;

class Step extends React.Component {
  constructor(props) {
    super(props);
    this.onIconClick = this.onIconClick.bind(this);
  }
  onIconClick() {
    if (this.props.hasDetail) {
      this.props.onChange(Number(this.props.stepNumber) - 1);
    }
  }

  render() {
    const { props } = this;
    const {
      status = 'wait',
      maxDescriptionWidth: maxWidth,
      direction,
      fixStyle,
      tailWidth,
      showIcon,
    } = props;
    let icon;
    const stepCls = classnames(prefixClass(`steps-item steps-status-${status}`), {
      [prefixClass('steps-item-last')]: props.stepLast,
      [prefixClass('steps-custom')]: props.icon,
      [prefixClass('steps-no-desc')]: !props.description,
    });
    let tail;
    let description;
    if (status !== 'finish' && ((!props.icon && status !== 'process') || !props.stepLast)) {
      icon = <span className={prefixClass('steps-icon')}>{props.stepNumber}</span>;
    } else {
      icon = (
        <span className={prefixClass('steps-icon')}>
          {showIcon && <Check width={18} height={18} fill="#66bc5c" /> }
        </span>);
    }

    if (!props.stepLast) {
      tail = <div className={prefixClass('steps-tail')}><i /></div>;
    }
    if (props.description) {
      description = (
        <div className={prefixClass('steps-description')}>
          {props.description}
        </div>);
    }

    const stepWrapperStyle = {
      ...fixStyle,
      width: tailWidth,
    };

    const detailCls = classnames(prefixClass('steps-detail'), {
      [prefixClass('steps-detail-current')]: props.showDetail,
    });
    const headStyleFixed = { cursor: (props.hasDetail ? 'pointer' : 'default') };
    return (
      <div className={stepCls} style={stepWrapperStyle}>
        {tail}
        <div className={prefixClass('steps-head')} style={headStyleFixed} onClick={this.onIconClick}>
          <div className={prefixClass('steps-head-inner')}>{icon}</div>
        </div>
        <div className={prefixClass('steps-main')} style={{ maxWidth }}>
          <div className={prefixClass('steps-detail-arrow')} style={{ display: (props.showDetail ? 'block' : 'none') }} />
          <div className={prefixClass('steps-title')} style={{ width: direction !== 'vertial' ? tailWidth : 'auto' }}>
            {props.showCurrentTitle ? '' : props.title}
          </div>
          <div>
            {description}
            {description ? <div className={prefixClass('steps-description-arrow')} /> : null}
          </div>
        </div>
        <div className={detailCls}>
          <div className={prefixClass('steps-detail-con')} style={props.detailContentFixStyle}>
            <div className={prefixClass('steps-detail-content')}>
              {props.children}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Step.propTypes = {
  hasDetail: PropTypes.bool,
  showIcon: PropTypes.bool,
  onChange: PropTypes.func,
  stepNumber: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
};
Step.defaultProps = {
  hasDetail: true,
  showIcon: true,
  onChange() {},
  stepNumber: '',
};

export default Step;
