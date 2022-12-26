import React from "react";

import { DropdownMenuOptionGroupCustom as DropdownMenuOptionGroupCustomComponent } from "../components/DropdownMenuOptionGroupCustom";

export default {
  title: "Pink Lava/Dropdown",
  component: DropdownMenuOptionGroupCustomComponent,
};

const listItems = [
  {
    // label: "By Country",
    list: [
      { label: "PMA Bandung Selatan", value: "filter-1" },
      { label: "PMA Majalengka", value: "filter-2" },
    ],
  },
  {
    label: "By Division",
    list: [
      { label: "Division 1", value: "division-1" },
      { label: "Division 2", value: "division-2" },
    ],
  },
];
const Template = (args) => (
  <DropdownMenuOptionGroupCustomComponent
    listItems={listItems}
    {...args}
    roundedSelector
    showClearButton
  />
);

export const DropdownMenuOptionGroupCustom = Template.bind({});
