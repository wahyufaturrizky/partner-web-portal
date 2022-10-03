const listTabItems = [{ title: "Withholding Tax" }, { title: "VAT" }];
const TaxBodyFields = {
  tax_id: "",
  tax_name: "",
  tax_item_type: "",
  gl_account: "",
  tax_type: "",
  tax_code: "",
  status: "",
  item_details: "",
};

const glAccountList = [
  { id: 1, value: "Land Freight" },
  { id: 2, value: "Air Freight" },
  { id: 3, value: "Sea Freight" },
];

const columnsTaxType = [
  {
    title: "Tax",
    dataIndex: "tax",
  },
];

const dataTaxType = [
  {
    status: "SUCCESS",
    data: {
      rows: [
        {
          tax: "W1",
        },
        {
          tax: "W2",
        },
        {
          tax: "W3",
        },
      ],
      totalRow: 3,
      sort_by: ["tax"],
    },
    message: "list exchange rate",
  },
];
export { listTabItems, TaxBodyFields, glAccountList, columnsTaxType, dataTaxType };
