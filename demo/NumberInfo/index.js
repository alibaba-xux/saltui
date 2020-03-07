/**
 * NumberInfo Component Demo for SaltUI
 * @author shuaige
 *
 * Copyright 2018-2019, SaltUI Team.
 * All rights reserved.
 */
const React = window.React;
const ReactDOM = window.ReactDOM;
import 'salt-context';
import './NumberInfoDemo.styl';

if (window.FastClick) {
  window.FastClick.attach(document.body);
}

// 渲染demo
import Demo from './NumberInfoDemo';

export default Demo;
