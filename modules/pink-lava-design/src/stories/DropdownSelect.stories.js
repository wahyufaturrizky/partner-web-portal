import React from 'react';

import { DropdownSelect as DropdownSelectComponent } from '../components/DropdownSelect';

export default {
  title: 'Pink Lava/Dropdown',
  component: DropdownSelectComponent,
};

const listItems = ['Dropdown 1', 'Dropdown 2', 'Dropdown 3', 'Dropdown 4'];
const Template = (args) => <DropdownSelectComponent items={listItems} {...args} />;

export const DropdownSelect = Template.bind({});