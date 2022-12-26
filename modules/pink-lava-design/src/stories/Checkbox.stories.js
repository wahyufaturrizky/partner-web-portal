import React from 'react';

import { Checkbox as CheckboxComponent } from '../components/Checkbox';

export default {
  title: 'Pink Lava/Checkbox',
  component: CheckboxComponent,
};

const Template = (args) => <CheckboxComponent checked={true} {...args} />;

export const Checkbox = Template.bind({});