import React from 'react';

import { Notification as NotificationComponent } from '../components/Notification';

export default {
  title: 'Pink Lava/Notification',
  component: NotificationComponent,
};

const Template = (args) => <NotificationComponent {...args} />;

export const Notification = Template.bind({});