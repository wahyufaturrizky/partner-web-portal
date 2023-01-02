import { createContext } from "react";

export const CustomerContext = createContext({
  companyLogo: "",
  setCompanyLogo: (logo) => {},
  selectFromForm: true,
  setSelectFromForm: (value) => {},
});
