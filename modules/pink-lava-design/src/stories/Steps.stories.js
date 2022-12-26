import React from 'react';

import { Steps as Component } from '../components/Steps';

export default {
  title: 'Pink Lava/Steps',
  component: Component,
};

const stepList = [
  { title: 'Step 1', status: 'Status 1' },
  { title: 'Step 2', status: 'Status 2' },
  { title: 'Step 3', status: 'Status 3' },
]
const Template = (args) => <Component stepList={stepList} {...args} />;

export const Steps = Template.bind({});