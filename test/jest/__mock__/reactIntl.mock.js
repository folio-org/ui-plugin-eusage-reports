import React from 'react';

jest.mock('react-intl', () => {
  const intl = {
    formatMessage: ({ id }) => id,
  };

  return {
    ...jest.requireActual('react-intl'),
    FormattedMessage: jest.fn(({ id, children }) => {
      if (children) {
        return children([id]);
      }

      return id;
    }),
    useIntl: () => intl,
    injectIntl: (Component) => (props) => <Component {...props} intl={intl} />,
  };
});
