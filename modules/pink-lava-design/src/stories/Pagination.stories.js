import usePagination from '@lucasmogari/react-pagination';
import React from 'react';

import { Pagination as PaginationComponent } from '../components/Pagination';

export default {
  title: 'Pink Lava/Pagination',
  component: PaginationComponent,
};

const Template = (args) => <PaginationComponent pagination={usePagination({ page: 1, totalPages: 100, totalItems: 1000, itemsPerPage: 10 })} {...args} />;

export const Pagination = Template.bind({});