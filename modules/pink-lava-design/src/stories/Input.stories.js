import React from 'react';

import { Input as InputComponent } from '../components/Input';

export default {
  title: 'Pink Lava/Input',
  component: InputComponent,
};

const Template = (args) => <InputComponent {...args} />;

export const Input = Template.bind({});