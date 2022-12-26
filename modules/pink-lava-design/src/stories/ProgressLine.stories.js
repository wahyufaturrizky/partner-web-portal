import React from 'react';

import { Progress as ProgressComponent } from '../components/LineProgressBar';

export default {
  title: 'Pink Lava/Progress',
  component: ProgressComponent,
};

const Template = (args) => <ProgressComponent {...args} checked={true} />;

export const LineProgress = Template.bind({});