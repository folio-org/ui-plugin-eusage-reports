jest.mock('currency-codes/data', () => ({
  filter: () => [
    {
      code: 'USD',
      currency: 'US Dollar',
    },
    {
      code: 'EUR',
      currency: 'Euro',
    },
  ],
}));
