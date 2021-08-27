import PropTypes from 'prop-types';
import RequestsByPublicationYear from '../reports/RequestsByPublicationYear';
import RequestsLoader from './RequestsLoader';

function RequestsByDateOfUseLoader({ params, data }) {
  return <RequestsLoader params={params} data={data} DisplayComponent={RequestsByPublicationYear} />;
}

RequestsByDateOfUseLoader.propTypes = {
  data: PropTypes.object.isRequired,
  params: PropTypes.object.isRequired,
};

export default RequestsByDateOfUseLoader;
