import { createContext } from "react";

export const RegisterFormContext = createContext({
  stepList: [
    { status: "process", title: "Create Account" },
    { status: "wait", title: "Bussines Type" },
    { status: "wait", title: "Create Subdomain" },
    { status: "wait", title: "Finished" },
  ],
  currentStep: 0,
  industryField: "Agricultural",
  companyType: "company",
  numberEmployees: "1-50",
  setStepList: (stepList) => {},
  setCurrentStep: (currentStep) => {},
  setIndustryField: (value) => {},
  setCompanyType: (value) => {},
  setNumberEmployees: (value) => {},
});
