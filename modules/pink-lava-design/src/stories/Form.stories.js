import React from 'react';

import FormComponent from '../components/Form';

export default {
  title: 'Pink Lava/Form',
  component: FormComponent,
};

const Template = (args) => <FormComponent {...args} />;

export const Form = Template.bind({});