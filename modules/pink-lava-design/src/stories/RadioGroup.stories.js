import React from 'react';

import { RadioGroup as RadioGroupComponent } from '../components/RadioGroup';

export default {
  title: 'Pink Lava/Radio',
  component: RadioGroupComponent,
};

const Template = (args) => <RadioGroupComponent {...args} />;

export const RadioGroup = Template.bind({});