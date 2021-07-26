import PropTypes from 'prop-types';
import { stripesConnect } from '@folio/stripes/core';
import UseOverTime from '../reports/UseOverTime';


function UseOverTimeLoader({ data, resources }) {
  return <UseOverTime
    hasLoaded={resources.useOverTime.hasLoaded}
    data={{
      ...data,
      useOverTime: resources.useOverTime.records[0],
    }}
  />;
}


UseOverTimeLoader.manifest = {
  useOverTime: {
    type: 'okapi',
    path: 'eusage-reports/stored-reports/use-over-time',
    params: (_q, _p, _r, _l, props) => {
      const aId = props.data.agreement.id;
      if (!aId) return null;
      return ({
        agreementId: aId,
        startDate: '1970-01-01', // XXX set from UI
        endDate: '2999-12-31', // XXX set from UI
        format: 'BOOK', // XXX set from UI
        includeOA: true, // XXX set from UI
      });
    },
  },
};


UseOverTimeLoader.propTypes = {
  data: PropTypes.object.isRequired,
  resources: PropTypes.shape({
    useOverTime: PropTypes.shape({
      hasLoaded: PropTypes.bool.isRequired,
      records: PropTypes.arrayOf(
        PropTypes.object.isRequired,
      ),
    }),
  }).isRequired,
};


export default stripesConnect(UseOverTimeLoader);
