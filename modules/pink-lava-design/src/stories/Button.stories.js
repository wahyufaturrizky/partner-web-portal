import React from 'react';

import { Button as ButtonComponent } from '../components/Button';

export default {
  title: 'Pink Lava/Button',
  component: ButtonComponent,
};

const Template = (args) => <ButtonComponent variant="primary" size='big'  {...args} >Button</ButtonComponent>;

export const Button = Template.bind({});