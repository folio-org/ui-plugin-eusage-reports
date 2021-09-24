import { IntlProvider } from 'react-intl';
import stripesComponentsTranslations from '@folio/stripes-components/translations/stripes-components/en';
import localTranslations from '../../../translations/ui-plugin-eusage-reports/en';

const translationSets = [
  {
    prefix: 'ui-plugin-eusage-reports',
    translations: localTranslations,
  },
  {
    prefix: 'stripes-components',
    translations: stripesComponentsTranslations,
  },
];


function withIntlConfiguration(children) {
  const allTranslations = {};

  translationSets.forEach((set) => {
    const { prefix, translations } = set;
    Object.keys(translations).forEach(key => {
      allTranslations[`${prefix}.${key}`] = translations[key];
    });
  });

  return (
    <IntlProvider locale="en-US" messages={allTranslations}>
      {children}
    </IntlProvider>
  );
}


export default withIntlConfiguration;
