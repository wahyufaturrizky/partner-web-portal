import React from 'react';

import { Header as HeaderComponent } from '../components/Header';

export default {
  title: 'Pink Lava/Header',
  component: HeaderComponent,
};

const items = [
  { key: '1', label: 'Item 1'},
  { key: '2', label: 'Item 2'},
  { key: '3', label: 'Item 3'}
];

const Template = (args) => <HeaderComponent items={items} withMenu={true} {...args}></HeaderComponent>;

export const Header = Template.bind({});