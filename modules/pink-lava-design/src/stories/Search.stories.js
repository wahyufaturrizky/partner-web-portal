import React from 'react';

import { Search as SearchComponent } from '../components/Search';

export default {
  title: 'Pink Lava/Search',
  component: SearchComponent,
};

const Template = (args) => <SearchComponent {...args} />;

export const Search = Template.bind({});