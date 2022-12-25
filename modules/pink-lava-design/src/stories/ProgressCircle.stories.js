import React from 'react';

import { Progress as ProgressComponent } from '../components/CircleProgressBar';

export default {
  title: 'Pink Lava/Progress',
  component: ProgressComponent,
};

const Template = (args) => <ProgressComponent {...args} />;

export const CircleProgress = Template.bind({});