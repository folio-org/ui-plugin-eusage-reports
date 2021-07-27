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
        startDate: props.params.startDate + '-01', // XXX until mod-eusage-reports is fixed
        endDate: props.params.endDate + '-01', // XXX until mod-eusage-reports is fixed
        format: props.params.format,
        includeOA: props.params.includeOA,
      });
    },
  },
};


UseOverTimeLoader.propTypes = {
  data: PropTypes.object.isRequired,
  params: PropTypes.shape({
    report: PropTypes.string.isRequired, // uot, rbu, etc.
    format: PropTypes.string.isRequired, // j=journal, b=book, etc.
    includeOA: PropTypes.bool.isRequired,
    startDate: PropTypes.string.isRequired, // ISO-format date
    endDate: PropTypes.string.isRequired, // ISO-format date
  }).isRequired,
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
