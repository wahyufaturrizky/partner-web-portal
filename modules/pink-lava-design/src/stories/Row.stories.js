import React from 'react';

import { Row as RowComponent } from '../components/Row';

export default {
  title: 'Pink Lava/Row',
  component: RowComponent,
};

const Template = (args) => <RowComponent checked={true} {...args} />;

export const Row = Template.bind({});