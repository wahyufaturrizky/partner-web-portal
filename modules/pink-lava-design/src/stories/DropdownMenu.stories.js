import React from 'react';

import { DropdownMenu as DropdownMenuComponent } from '../components/DropdownMenu';

export default {
  title: 'Pink Lava/Dropdown',
  component: DropdownMenuComponent,
};

const menuList = [
  { key: 'menu-1', value: 'Menu 1' },
  { key: 'menu-2', value: 'Menu 2' },
  { key: 'menu-3', value: 'Menu 3' },
  { key: 'menu-4', value: 'Menu 4' },
];

const Template = (args) => <DropdownMenuComponent title="Menu List" menuList={menuList} buttonVariant={'primary'} buttonSize={'big'} textVariant={'headingRegular'} textColor={'white'} {...args} />;

export const DropdownMenu = Template.bind({});