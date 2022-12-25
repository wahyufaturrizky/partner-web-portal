import React from 'react';

import { Calendar as CalendarComponent } from '../components/Calendar';

export default {
  title: 'Pink Lava/Calendar',
  component: CalendarComponent,
};

const Template = (args) => <CalendarComponent {...args} />;

export const Calendar = Template.bind({});