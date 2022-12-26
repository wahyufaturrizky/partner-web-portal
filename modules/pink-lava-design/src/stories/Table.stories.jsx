import React from 'react';

import { Table as TableComponent } from '../components/Table';

export default {
  title: 'Pink Lava/Table',
  component: TableComponent,
};

const columns = [
  { title: 'Column 1', dataIndex: 'column_1' },
  { title: 'Column 2', dataIndex: 'column_2' },
  { title: 'Column 3', dataIndex: 'column_3' },
  { title: 'Column 4', dataIndex: 'column_4' },
];

const data = [
  { column_1: 'Data 1', column_2: 'Data 2', column_3: 'Data 3', column_4: 'Data 4' },
  { column_1: 'Data 1', column_2: 'Data 2', column_3: 'Data 3', column_4: 'Data 4' },
  { column_1: 'Data 1', column_2: 'Data 2', column_3: 'Data 3', column_4: 'Data 4' },
  { column_1: 'Data 1', column_2: 'Data 2', column_3: 'Data 3', column_4: 'Data 4' },
];

const Template = (args) => <TableComponent data={data} columns={columns} {...args} />;

export const Table = Template.bind({});