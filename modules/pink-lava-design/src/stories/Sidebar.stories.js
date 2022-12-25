import React from 'react';

import {Sidebar as SidebarComponent} from '../components/Sidebar';

export default {
  title: 'Pink Lava/Sidebar',
  component: SidebarComponent,
};

const Template = (args) => <SidebarComponent {...args} />;

export const Sidebar = Template.bind({});