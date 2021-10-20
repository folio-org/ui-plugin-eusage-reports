import React from 'react';
import { FormattedMessage } from 'react-intl';
import displayError from './displayError';


function performLongOperation(okapiKy, callout, operation, path, data, values, whenComplete) {
  const p = okapiKy.post(path, { json: data, timeout: false });

  callout.sendCallout({
    message: <FormattedMessage
      id={`ui-plugin-eusage-reports.button.${operation}.dispatched`}
      values={values}
    />
  });

  return p.then(() => {
    callout.sendCallout({
      message: <FormattedMessage
        id={`ui-plugin-eusage-reports.button.${operation}.completed`}
        values={values}
      />
    });
    if (whenComplete) whenComplete();
  }).catch(err => {
    displayError(callout, `button.${operation}.error`, undefined, err.toString());
  });
}



export default performLongOperation;
