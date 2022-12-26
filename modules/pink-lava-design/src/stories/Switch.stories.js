import React from 'react';

import { Switch as SwitchComponent } from '../components/Switch';

export default {
  title: 'Pink Lava/Switch',
  component: SwitchComponent,
};

const Template = (args) => <SwitchComponent {...args} />;

export const Switch = Template.bind({});