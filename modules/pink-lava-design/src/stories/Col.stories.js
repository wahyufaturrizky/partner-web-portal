import React from 'react';

import { Col as ColComponent } from '../components/Col';

export default {
  title: 'Pink Lava/Col',
  component: ColComponent,
};

const Template = (args) => <ColComponent checked={true} {...args} />;

export const Col = Template.bind({});