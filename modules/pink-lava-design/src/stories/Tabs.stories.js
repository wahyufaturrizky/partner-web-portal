import React from 'react';

import { Tabs as TabsComponent } from '../components/Tabs';
import { Lozenge } from './Tag.stories';

export default {
  title: 'Pink Lava/Tabs',
  component: TabsComponent,
};

const tabs = [
  {
    title: "Super User List",
    children: () => "Super User List"
  },
  {
    title: "Role List",
    children: () => "Role List"
  },
  {
    title: "Permission List",
    children: () => "Permission List"
  },
]

const Template = (args) => <TabsComponent listTabPane={tabs} {...args} />;

export const Tabs = Template.bind({});