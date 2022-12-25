import React from 'react';

import { ContentSwitcher as ContentSwitcherComponent } from '../components/ContentSwitcher';

export default {
  title: 'Pink Lava/ContentSwitcher',
  component: ContentSwitcherComponent,
};

const options = [
  { label: 'A', value: 'Apple' },
  { label: 'Pear', value: 'Pear', disabled: true },
  { label: 'Orange', value: 'Orange' },
];


const Template = (args) => <ContentSwitcherComponent options={options} defaultValue={'Apple'} checked={true} {...args} />;

export const ContentSwitcher = Template.bind({});