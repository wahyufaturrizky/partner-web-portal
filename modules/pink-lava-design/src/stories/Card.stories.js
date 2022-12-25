import React from 'react';

import { Card as CardComponent } from '../components/Card';

export default {
  title: 'Pink Lava/Card',
  component: CardComponent,
};

const Template = (args) => <CardComponent {...args} />;

export const Card = Template.bind({});