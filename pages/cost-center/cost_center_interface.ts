export interface CompanyList {
  id: number;
  name: string;
  language: string;
  currency: string;
}

// export interface RowCompanyList {
//   id: number;
//   name: string;
//   code: string;
//   companyType: string;
//   industry: string;
//   status: string;
//   isActive: boolean;
// }

export interface ProfitCenterList {
  rows: RowProfitCenter[];
  totalRow: number;
  sortBy: string[];
}

export interface RowProfitCenter {
  companyId: string;
  profitCenterId: string;
  code: string;
  name: string;
  validFrom: Date;
  validTo: Date;
  externalCode: string;
  description: string;
  personResponsible: string;
  createdAt: Date;
  createdBy: number;
  modifiedAt: Date;
  modifiedBy: number | null;
  deletedBy: null;
  deletedAt: null;
}

export interface CurrenciesData {
  rows: RowCurrenciesData[];
  totalRow: number;
  sortBy: string[];
}

export interface RowCurrenciesData {
  id: string;
  currency: string;
  currencyName: string;
  createdAt: Date;
  createdBy: number;
  modifiedAt: Date;
  modifiedBy: number | null;
  deletedBy: null;
  deletedAt: null;
}

export interface LanguagesData {
  rows: RowLanguagesData[];
  totalRow: number;
  sortBy: string[];
}

export interface RowLanguagesData {
  id: string;
  name: string;
  createdBy: number;
  createdAt: Date;
  modifiedBy: null;
  modifiedAt: null;
  deletedBy: null;
  deletedAt: null;
}

export interface CostCenterSave {
  language: string;
  currency: string;
  profit_center_id: string;
  company_id: string;
  code: string;
  name: string;
  valid_from: string;
  valid_to: string;
  external_code: string;
  person_responsible: string;
}
