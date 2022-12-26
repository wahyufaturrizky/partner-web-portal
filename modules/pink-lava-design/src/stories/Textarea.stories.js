import React from 'react';

import { TextArea as TextareaComponent } from '../components/Textarea';

export default {
  title: 'Pink Lava/Textarea',
  component: TextareaComponent,
};

const Template = (args) => <TextareaComponent {...args} />;

export const Textarea = Template.bind({});