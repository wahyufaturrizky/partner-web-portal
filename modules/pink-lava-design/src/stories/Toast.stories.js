import React from 'react';

import { Toast as ToastComponent } from '../components/Toast';

export default {
  title: 'Pink Lava/Toast',
  component: ToastComponent,
};

const Template = (args) => <ToastComponent {...args} />;

export const Toast = Template.bind({});