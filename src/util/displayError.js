import { FormattedMessage } from 'react-intl';


function displayError(callout, wrapperTag, errorTag, errorMessage) {
  const error = errorTag ?
    <FormattedMessage id={`ui-plugin-eusage-reports.${wrapperTag}.${errorTag}`} /> :
    errorMessage;

  callout.sendCallout({
    type: 'error',
    message: <FormattedMessage
      id={`ui-plugin-eusage-reports.${wrapperTag}`}
      values={{ error }}
    />
  });

  return undefined;
}


export default displayError;
