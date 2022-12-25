import React from 'react';

import { Text as TextComponent } from '../components/Text';

export default {
  title: 'Pink Lava/Text',
  component: TextComponent,
};

const Template = (args) => <TextComponent {...args}>Text</TextComponent>;

export const Text = Template.bind({});