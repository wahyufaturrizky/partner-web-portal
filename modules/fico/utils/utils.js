export const STATUS_VARIANT = {
  DRAFT: 'grey',
  SUBMITTED: 'green',
  SUBMIT: 'green',
};

export const STATUS_DOWN_PAYMENT_VARIANT = {
  DRAFT: 'grey',
  'TAX VERIF': 'pink',
  'ACCOUNTING SUBMIT': 'pink',
  PAYMENT: 'cheese',
  COMPLETED: 'green',
  SUBMITTED: 'blue',
  REJECTED: 'red',
};

export const STATUS_APPROVAL_VARIANT = {
  WAITING: 'cheese',
  ACTIVE: 'green',
  APPROVED: 'blue',
  REJECTED: 'red',
  INACTIVE: 'black',
};

export const STATUS_ASSET_DISPOSAL_VARIANT = {
  DRAFT: 'grey',
  SUBMITTED: 'green',
};

export const STATUS_ASSET_MUTATION_VARIANT = {
  DRAFT: 'grey',
  SUBMITTED: 'green',
  RECEIVED: 'blue',
  'WAITING FOR RECEIVED': 'cheese',
};

export const STATUS_APPROVAL_TEXT = {
  WAITING: 'Waiting for Approval',
  ACTIVE: 'Active',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
  INACTIVE: 'Inactive',
};

export const STATUS_ORDER_VARIANT = {
  RELEASED: 'blue',
  COMPLETED: 'green',
  CLOSED: 'red',
  DRAFT: 'grey',
  CREATED: 'pink',
};

export const STATUS_WORD = {
  // number
  0: 'DRAFT',
  1: 'SUBMITTED',

  // lowercase
  submit: 'submitted',
  reject: 'rejected',

  // Capitalize
  Submit: 'Submitted',
  Reject: 'Rejected',

  // UPPERCASE
  SUBMIT: 'SUBMITTED',
  REJECT: 'REJECTED',
};

export const STATUS_AP_VARIANT = {
  0: 'grey',
  1: 'green',
  2: 'pink',
  3: 'pink',
  4: 'cheese',
  5: 'blue',
  8: 'red',
};

export const STATUS_AP_WORDING = {
  0: 'Draft',
  1: 'Submitted',
  2: 'Purchasing Verif',
  3: 'Tax Verif',
  4: 'Accounting Verif',
  5: 'Full Approved',
  8: 'Rejected',
};
