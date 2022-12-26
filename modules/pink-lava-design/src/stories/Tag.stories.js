import React from 'react';

import { Tag as TagComponent } from '../components/Tag';

export default {
  title: 'Pink Lava/Lozenge',
  component: TagComponent,
};

const Template = (args) => <TagComponent {...args} />;

export const Lozenge = Template.bind({});