import React from 'react';

import { AvatarGroup as AvatarGroupComponent } from '../components/AvatarGroup';

export default {
  title: 'Pink Lava/Avatar',
  component: AvatarGroupComponent,
};

const Template = (args) => <AvatarGroupComponent {...args} />

export const AvatarGroup = Template.bind({});