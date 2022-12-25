import React from "react";

import { DatePickerInput as DatepickerComponent } from "../components/Datepicker";

export default {
  title: "Pink Lava/Datepicker",
  component: DatepickerComponent,
};

const Template = (args) => <DatepickerComponent {...args} />;

export const Datepicker = Template.bind({});
