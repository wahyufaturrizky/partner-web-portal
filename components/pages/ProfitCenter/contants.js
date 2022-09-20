import moment from "moment";

const defaultValuesCreate = {
  code: "",
  name: "",
  valid_from: moment().utc().toString(),
  valid_to: moment().utc().toString(),
  company_id: "",
  external_code: "",
  description: "",
  person_responsible: "",
};

export { defaultValuesCreate };
