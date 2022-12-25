import React from 'react';

import { EmptyState as EmptyStateComponent } from '../components/EmptyState';

export default {
  title: 'Pink Lava/EmptyState',
  component: EmptyStateComponent,
};

const Template = (args) => <EmptyStateComponent {...args} checked={true} />;

export const EmptyState = Template.bind({});