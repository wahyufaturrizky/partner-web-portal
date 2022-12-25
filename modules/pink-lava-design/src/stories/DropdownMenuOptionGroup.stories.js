import React from "react";

import { DropdownMenuOptionGroup as DropdownMenuOptionGroupComponent } from "../components/DropdownMenuOptionGroup";

export default {
  title: "Pink Lava/Dropdown",
  component: DropdownMenuOptionGroupComponent,
};

const listItems = [
  { key: 'dropdown-1', label: 'Dropdown 1', list: [ { value: 'drop-1-sub-1', label: 'Sub 1' } ] },
  { key: 'dropdown-2', label: 'Dropdown 2', list: [ { value: 'drop-2-sub-1', label: 'Sub 1' }, { value: 'drop-2-sub-2', label: 'Sub 2' } ] },
  { key: 'dropdown-3', label: 'Dropdown 3' },
  { key: 'dropdown-4', label: 'Dropdown 4' },
];
const Template = (args) => (
  <DropdownMenuOptionGroupComponent listItems={listItems} {...args} />
);

export const DropdownMenuOptionGroup = Template.bind({});
