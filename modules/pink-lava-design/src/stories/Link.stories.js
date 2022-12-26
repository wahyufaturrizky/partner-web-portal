import React from 'react';

import { Link as LinkComponent } from '../components/Link';

export default {
  title: 'Pink Lava/Link',
  component: LinkComponent,
};

const Template = (args) => <LinkComponent {...args} />;

export const Link = Template.bind({});