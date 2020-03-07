/**
 * RadioField Component for SaltUI
 * @author shanchao
 * update by ruiyang.dry
 * Copyright 2018-2019, SaltUI Team.
 * All rights reserved.
 */
import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import OptionCheckedIcon from 'salt-icon/lib/OptionChecked';
import FieldRequiredIcon from 'salt-icon/lib/FieldRequired';
import AngleRight from 'salt-icon/lib/AngleRight';
import { prefixClass } from '../Context';
import Group from '../Group';
import Popup from '../Popup';
import Field from '../Field';
import RadioNormal from './RadioNormal';
import RadioNormalDisabled from './RadioNormalDisabled';
import RadioSelected from './RadioSelected';
import RadioSelectedDisabled from './RadioSelectedDisabled';

const renderIcon = (checked, disabled, position) => {
  let RenderedIcon = null;
  if (checked) {
    RenderedIcon = disabled ? RadioSelectedDisabled : RadioSelected;
  } else {
    RenderedIcon = disabled ? RadioNormalDisabled : RadioNormal;
  }
  return (
    <div className={classnames(prefixClass('radio-field-icon-wrapper FBAC FBH'), {
      [position]: !!position,
    })}
    >
      <RenderedIcon
        className={classnames(prefixClass('radio-field-icon'))}
      />
    </div>
  );
};
class RadioField extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  }

  /* eslint-disable no-param-reassign */
  clickAction(value, item, index, data) {
    const t = this;
    const { data: radioArray, onChange, readOnly } = t.props;
    const { disable } = item;
    if (disable || readOnly) {
      return;
    }
    radioArray.map((radioItem) => {
      radioItem.checked = false;
      return radioItem;
    });
    item.checked = !item.checked;
    this.hidePopup();
    t.forceUpdate(() => {
      if (onChange) {
        onChange(value, index, data);
      }
    });
  }

  showPopup() {
    if (this.props.readOnly) {
      return;
    }
    this.setState({ visible: true });
  }

  hidePopup() {
    this.setState({ visible: false });
  }

  renderField() {
    const t = this;
    const middleIcon = !t.props.readOnly ? (
      <AngleRight
        className={prefixClass('radio-field-arrow-icon')}
        width={26}
        height={26}
      />
    ) : null;
    let currentValue;
    t.props.data.some((item) => {
      if (item.checked) {
        currentValue = item;
        return true;
      }
      return false;
    });
    return (
      <Field
        {...t.props}
        middleIcon={middleIcon}
        className={classnames(prefixClass('radio-field'), {
          [t.props.className]: !!t.props.className,
        })}
        onClick={t.showPopup.bind(t)}
      >
        <div>
          {!currentValue ? <div className={prefixClass('omit radio-field-placeholder')}>{t.props.placeholder}</div> : ''}
          <div className={prefixClass('radio-field-value FBH FBAC')}>
            <span
              className={classnames(prefixClass('FB1 omit'), {
                [prefixClass('radio-field-readonly')]: !!t.props.readOnly,
              })}
            >{currentValue ? t.props.formatter(currentValue) : null}
            </span>
          </div>
        </div>
        <Popup
          content={t.finalJSX}
          visible={t.state.visible}
          animationType="slide-up"
          maskClosable
          onMaskClick={t.hidePopup.bind(t)}
        />
      </Field>
    );
  }

  /* eslint-enable no-param-reassign */
  render() {
    const t = this;
    const {
      rootClassName,
      className,
      data: radioArray,
      groupListArgument,
      groupListFlag,
      label,
      mode,
      tip,
    } = t.props;

    const radioArrayComponent = radioArray.map((item, index, data) => {
      const { checked, disable, value } = item;
      /* eslint-disable react/no-array-index-key */
      return (
        <div
          key={index}
          className={classnames(prefixClass('radio-field-row FBAC FBH'), {
            disable,
          })}
          onClick={t.clickAction.bind(t, value, item, index, data)}
        >
          {
            t.props.iconPosition === 'left' && renderIcon(checked, disable)
          }
          <div
            ref={`content${index}`}
            className={prefixClass('radio-field-content FB1')}
          >
            {item.content || item.text}
          </div>
          {
            t.props.iconPosition === 'right' && renderIcon(checked, disable, 'right')
          }
          {
            disable && <div className={prefixClass('radio-field-disable-mask')} />
          }
        </div>
      );
    });

    const requiredTag = (
      <FieldRequiredIcon
        className={prefixClass('radio-field-label-required')}
        width={6}
        height={6}
        fill="red"
      />
    );

    this.finalJSX = (
      <Group className={classnames(prefixClass('radio-field'), {
        [rootClassName]: !!rootClassName,
        'is-group': true,
      }, {
          [className]: !!className,
        })}
      >
        {
          label === ''
            ? null
            : (
              <Group.Head className={classnames(prefixClass('radio-field-label'))}>
                {label}
                {this.props.required && requiredTag}
              </Group.Head>
            )
        }
        <Group.List {...groupListArgument}>
          {radioArrayComponent}
        </Group.List>
        {tip ?
          <div className="t-field-box t-FBH t-field-tip-box">
            <div className="t-FBH t-FBAC t-LH1_5 t-field-tip" style={{ borderTop: 'none' }}>{tip}</div>
          </div> : null}
      </Group>
    );

    if (!groupListFlag) {
      this.finalJSX = (
        <div
          className={classnames(prefixClass('radio-field'), {
            [rootClassName]: !!rootClassName,
            [className]: !!className,
          })
          }
        >
          {radioArrayComponent}
        </div>
      );
    }

    return (
      <div>
        {mode === 'popup' ? this.renderField() : this.finalJSX }
      </div>);
  }
}

RadioField.defaultProps = {
  data: [],
  onChange() { },
  groupListFlag: true,
  groupListArgument: {
    lineIndent: 0,
    itemIndent: 16,
  },
  label: '',
  iconPosition: 'right',
  required: false,
  readOnly: false,
  className: undefined,
  mode: 'default',
  maskClosable: true,
  formatter: item => item.label || item.content.toString(),
  onMaskClose: () => {},
};

// http://facebook.github.io/react/docs/reusable-components.html
RadioField.propTypes = {
  className: PropTypes.string,
  data: PropTypes.array,
  onChange: PropTypes.func,
  onMaskClose: PropTypes.func,
  readOnly: PropTypes.bool,
  groupListFlag: PropTypes.bool,
  groupListArgument: PropTypes.object,
  iconPosition: PropTypes.string,
  required: PropTypes.bool,
  label: PropTypes.node,
  mode: PropTypes.string,
  maskClosable: PropTypes.bool,
  formatter: PropTypes.func,
};

RadioField.displayName = 'RadioField';

export default RadioField;
