import React from 'react';

import { Avatar as AvatarComponent } from '../components/Avatar';

export default {
  title: 'Pink Lava/Avatar',
  component: AvatarComponent,
};

const Template = (args) => <AvatarComponent variant="primary" size='big'  {...args} >Avatar</AvatarComponent>;

export const Avatar = Template.bind({});