import React from 'react';

import { Badge as BadgeComponent } from '../components/Badge';

export default {
  title: 'Pink Lava/Badge',
  component: BadgeComponent,
};

const Template = (args) => <BadgeComponent variant="primary" size='big'  {...args} >Badge</BadgeComponent>;

export const Badge = Template.bind({});