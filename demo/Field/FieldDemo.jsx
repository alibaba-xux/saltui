/**
 * Field Component Demo for SaltUI
 * @author
 *
 * Copyright 2018-2019, SaltUI Team.
 * All rights reserved.
 */

import React from 'react';
import Group from 'salt-group';
import AngleRight from 'salt-icon/lib/AngleRight';
import Toast from 'salt-toast';
import Field from 'salt-field';
import Icon from 'salt-icon';

// build之后, 测试一下下面一行, 把上面一行注释掉
// const Field = require('../../dist');

class Demo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const angleIconProps = { fill: 'rgba(31,56,88,0.40)', width: 20, height: 20 };
    return (
      <div>
        <Group.List >
          <Field label="左右结构" required>
            <div>自定义输入元素的区域, 不带图标</div>
          </Field>
        </Group.List>
        <Group.List >
          <Field>
            <div>自定义输入元素的区域, 不带 label, 不带图标</div>
          </Field>
        </Group.List>
        <Group.List >
          <Field label="左右结构左右结构" tip={<div>这里是tip这里是tip这里是tip这里是tip这里是tip这里是tip这里是tip这里是tip<a href="https://salt-ui.github.io/" target="_blank">salt-ui</a>这里是tip</div>}>
            <div>自定义输入元素的区域, 带tip</div>
          </Field>
        </Group.List>
        <Group.List >
          <Field label="上下结构" layout="v" tip={<div>这里是tip这里是tip这里是tip这里是tip这里是tip这里是tip这里是tip这里是tip<a href="https://salt-ui.github.io/" target="_blank">salt-ui</a>这里是tip</div>}>
            <div>自定义输入元素的区域, 带tip</div>
          </Field>
        </Group.List>
        <Group.List >
          <Field label="左右结构" icon={<AngleRight {...angleIconProps} />}>
            <div>自定义输入元素的区域, 带图标</div>
          </Field>
        </Group.List>
        <Group.List>
          <Field layout="v" label="上下结构" icon={<AngleRight {...angleIconProps} />}>
            <div>
              <p>自定义输入元素的区域, 带图标</p>
            </div>
          </Field>
        </Group.List>
        <Group.List>
          <Field layout="v" label="上下结构" icon={<Icon name={'face-smile-line'} />} middleIcon={<AngleRight {...angleIconProps} />}>
            <div>
              <p>自定义输入元素的区域, 带content icon和middle icon，middle icon垂直居中</p>
            </div>
          </Field>
        </Group.List>
        <Group.List>
          <Field layout="v" label="上下结构" icon={<Icon name={'setting'}/>} errMsg={'输入有误'} middleIcon={<AngleRight {...angleIconProps} />}>
            <div>
              <p>自定义输入元素的区域, 带图标，图标垂直居中,带错误提示</p>
            </div>
          </Field>
        </Group.List>
        <Group.List >
          <Field label="左右结构" icon={<AngleRight {...angleIconProps} />} errMsg="输入有误" toastComponent={Toast}>
            <div>自定义输入元素的区域, 带图标, 带错误提示</div>
          </Field>
        </Group.List>
        <Group.List>
          <Field
            layout="h"
            label="左右结构"
            multiLine
          >
            <div>自定义输入元素的区域多行很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多</div>
          </Field>
        </Group.List>

        <Group.List>
          <Field layout="v" label="上下结构" icon={<AngleRight {...angleIconProps} />}>
            <div className="t-omit">自定义输入元素的区域多行点点点很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多</div>
          </Field>
        </Group.List>
        <Group.List>
          <Field layout="v" label="上下结构（右侧自定义）" labelRight={<AngleRight {...angleIconProps} />}>
            <div className="t-omit">自定义输入元素的区域</div>
          </Field>
        </Group.List>
        <Group.List>
          <Field layout="v" label="上下结构（没有 children）" tip={<div>这里是tip这里是tip这里是tip这里是tip这里是tip这里是tip这里是tip这里是tip<a href="https://salt-ui.github.io/" target="_blank">salt-ui</a>这里是tip</div>} />
        </Group.List>
        <Group.List >
          <Field label="左右结构（禁用）" disabled icon={<AngleRight {...angleIconProps} />} errMsg="输入有误" toastComponent={Toast}>
            <div>自定义输入元素的区域, 带图标, 带错误提示，禁用状态</div>
          </Field>
        </Group.List>
      </div>
    );
  }
}

export default Demo;
