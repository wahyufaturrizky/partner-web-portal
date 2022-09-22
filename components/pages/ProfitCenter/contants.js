import moment from "moment";

const defaultValuesCreate = {
  code: "",
  name: "",
  valid_from: moment(),
  valid_to: moment("9999-12-31"),
  company_id: "",
  external_code: "",
  description: "",
  person_responsible: "",
};

export { defaultValuesCreate };
