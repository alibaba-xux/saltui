/**
 * Filter Component for SaltUI
 * @author taoqili
 * Copyright 2018-2019, SaltUI Team.
 * All rights reserved.
 */
import React from 'react';
import PropTypes from 'prop-types';
import FilterBar from './FilterBar'
import FilterPanel from './FilterPanel'
import Context from '../Context'
import classnames from 'classnames'
import Mask from '../Mask'

class Filter extends React.Component {
  static displayName = 'Filter';

  static propTypes = {
    className: PropTypes.string,
    options: PropTypes.array,
    size: PropTypes.oneOf([1, 2, 3, 4]),
    activeIndex: PropTypes.number,
    onChange: PropTypes.func,
    onConfirm: PropTypes.func,
    onReset: PropTypes.func,
    value: PropTypes.object
  };

  static defaultProps = {
    className: undefined,
    options: [],
    size: 4,
    activeIndex: -1,
    value: null,
    onChange: () => {
    },
    onConfirm: () => {
    },
    onReset: () => {
    }
  };

  constructor(props) {
    super(props);
    this.selectData = {};
    if (props.defaultValue) {
      this.setSelect(props.defaultValue, true)
    }
    this.state = {
      activeIndex: props.activeIndex,
      maskVisible: false,
      maskOffset: 0
    }
  }

  setSelect = (data = {}, ignoreOnChange) => {
    const name = Object.keys(data)[0];
    const { onChange } = this.props;
    this.selectData = {
      ...this.selectData,
      ...data
    };
    !ignoreOnChange && onChange({
      name,
      currentSelected: data[name],
      allSelected: this.getSelect()
    }, this)
  };

  getSelect = (name) => {
    let data = this.selectData;
    Object.keys(this.selectData).map(name => {
      if (!data[name] || !data[name].length) {
        delete data[name]
      }
    });
    return !name ? data : data[name];
  };

  clearValue(name) {
    if (!name) {
      this.selectData = {}
    }
    delete this.selectData[name]
  }
  setValue(name, data) {
    if (!name || !data || !data.length) {
      return
    }
    this.setSelect({
      [name]: data
    })
  }
  getValue(name) {
    return this.getSelect(name)
  }

  getActiveIndex = () => {
    return this.state.activeIndex
  };

  setActiveIndex = index => {
    this.setState({
      activeIndex: index,
    });
    if (index === -1) {
      this.setState({
        maskVisible: false
      })
    }
  };

  handleMask = (isShow, group) => {
    this.setState({
      maskVisible: isShow && group.type !== 'switch' && group.type !== 'super'
    })
  };
  setMaskOffset = (offset) => {
    this.setState({
      maskOffset: offset
    })
  }
  handleMaskClick = () => {
    const { onConfirm } = this.props;
    const options = this.formatOptions();
    const group = options.groups[this.state.activeIndex];
    if (group && group.multiSelect) {
      onConfirm(this.getSelect(), this)
    }
    this.setState({
      activeIndex: -1,
      maskVisible: false
    })
  };

  formatOptions = () => {
    const { size, options } = this.props;
    let maxSize = size > 4 ? 4 : size;
    if (options.length <= maxSize) {
      return {
        maxSize,
        groups: options,
        _backItems: options
      }
    }
    let newFilterGroups = [...options];
    return {
      maxSize,
      groups: [
        ...newFilterGroups.splice(0, maxSize - 1),
        {
          name: '_super_',
          title: '高级筛选',
          icon: 'filter',
          type: 'super',
          children: [
            ...newFilterGroups.map(item => {
              item._groupKey_ = '_super_';
              return item;
            })
          ]
        }
      ],
      _backItems: options
    }
  };


  render() {
    const options = this.formatOptions();
    const {
      activeIndex,
      maskVisible,
      maskOffset
    } = this.state;
    const props = {
      ...this.props,
      activeIndex,
      options,
      setSelect: this.setSelect,
      getSelect: this.getSelect,
      getActiveIndex: this.getActiveIndex,
      setActiveIndex: this.setActiveIndex,
      handleMask: this.handleMask,
      setMaskOffset: this.setMaskOffset,
      onConfirm: (data) => {
        this.props.onConfirm(data, this)
      },
      onReset: (data) => {
        this.props.onReset(data, this)
      },
      onChange: (data) => {
        this.props.onChange(data, this)
      }

    };
    return (
      <div className={classnames(Context.prefixClass('filter-wrapper'), {
        [props.className]: !!props.className,
      })}>
        <FilterBar {...props} />
        <FilterPanel {...props} />
        <Mask
          visible={maskVisible}
          opacity={0.4}
          zIndex={800}
          topOffset={`${maskOffset}px`}
          onClick={this.handleMaskClick}
        />
      </div>
    );
  }
}

export default Filter;
