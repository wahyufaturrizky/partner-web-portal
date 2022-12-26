import React from "react";
import { DropdownMenuOptionCustome as DropdownMenuOptionCustomeComponent } from "../components/DropdownMenuOptionCustome";

const listItems = [
  { value: 'dropdown-1', label: 'Dropdown 1' },
  { value: 'dropdown-2', label: 'Dropdown 2' },
  { value: 'dropdown-3', label: 'Dropdown 3' },
  { value: 'dropdown-4', label: 'Dropdown 4' },
];
export default {
  title: "Pink Lava/Dropdown",
  component: DropdownMenuOptionCustomeComponent,
};

const Template = (args) => <DropdownMenuOptionCustomeComponent {...args} listItems={listItems} checked={true} />;

export const DropdownMenuOptionCustome = Template.bind({});
