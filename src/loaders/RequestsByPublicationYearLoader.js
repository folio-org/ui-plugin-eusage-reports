import PropTypes from 'prop-types';
import RequestsByPublicationYear from '../reports/RequestsByPublicationYear';
import RequestsLoader from './RequestsLoader';

function RequestsByPublicationYearLoader({ params, data }) {
  return <RequestsLoader params={params} data={data} DisplayComponent={RequestsByPublicationYear} />;
}

RequestsByPublicationYearLoader.propTypes = {
  data: PropTypes.object.isRequired,
  params: PropTypes.object.isRequired,
};

export default RequestsByPublicationYearLoader;
