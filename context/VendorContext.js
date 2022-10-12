import { createContext } from "react";

export const VendorContext = createContext({
  companyLogo: "",
  setCompanyLogo: (logo) => {},
  selectFromForm: true,
  setSelectFromForm: (value) => {},
});
