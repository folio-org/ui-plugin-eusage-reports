import PropTypes from 'prop-types';
import RequestsByDateOfUse from '../reports/RequestsByDateOfUse';
import RequestsLoader from './RequestsLoader';

function RequestsByDateOfUseLoader({ params, data }) {
  return <RequestsLoader params={params} data={data} DisplayComponent={RequestsByDateOfUse} />;
}

RequestsByDateOfUseLoader.propTypes = {
  data: PropTypes.object.isRequired,
  params: PropTypes.object.isRequired,
};

export default RequestsByDateOfUseLoader;
