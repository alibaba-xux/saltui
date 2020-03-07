/**
 * Steps Component Demo for SaltUI
 * @author muwen.lb
 *
 * Copyright 2018-2019, SaltUI Team.
 * All rights reserved.
 */

import React from 'react';
import Steps, { Step } from 'salt-steps';

class StepsDemo extends React.Component {
  render() {
    return (
      <div>
        <Steps current={2} showIcon maxDescriptionWidth={10}>
          <Step key={0} title="步骤一" />
          <Step key={1} title="步骤二" />
          <Step key={2} title="步骤三" />
          <Step key={3} />
        </Steps>
        <Steps current={2} showIcon direction="vertical">
          <Step key={0} title="步骤一" description="描述一" />
          <Step key={1} title="步骤二" />
          <Step key={2} title="步骤三" />
          <Step key={3} title="步骤四" />
          <Step key={4} title="步骤五" />
        </Steps>
        <Steps current={2} showIcon={false} maxDescriptionWidth={10}>
          <Step key={0} title="步骤一" />
          <Step key={1} title="步骤二" />
          <Step key={2} title="步骤三" />
          <Step key={3} />
        </Steps>
      </div>
    );
  }
}

export default StepsDemo;
