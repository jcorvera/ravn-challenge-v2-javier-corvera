export const Role: {
  CC: 'CC';
  CASH: 'CASH';
  ACH: 'ACH';
} = {
  CC: 'CC',
  CASH: 'CASH',
  ACH: 'ACH',
};

export type PaymentType = (typeof Role)[keyof typeof Role];
