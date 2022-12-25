import React from 'react';

import { OverflowMenu as OverflowMenuComponent } from '../components/OverflowMenu';

export default {
  title: 'Pink Lava/OverflowMenu',
  component: OverflowMenuComponent,
};

const Template = (args) => <OverflowMenuComponent {...args} />;

export const OverflowMenu = Template.bind({});