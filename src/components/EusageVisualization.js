import PropTypes from 'prop-types';
import { Loading, Accordion } from '@folio/stripes/components';
import CostPerUse from '../reports/CostPerUse';


function EusageVisualization({ hasLoaded, data }) {
  if (!hasLoaded) return <Loading />;

  return (
    <>
      <CostPerUse data={data} />
      <Accordion closedByDefault label={`${data.titleData.length} title-data entries`}>
        <pre>
          {JSON.stringify(data.titleData, null, 2)}
        </pre>
      </Accordion>
    </>
  );
}


EusageVisualization.propTypes = {
  hasLoaded: PropTypes.bool.isRequired,
  data: PropTypes.shape({
    titleData: PropTypes.arrayOf(
      PropTypes.object.isRequired,
    ),
  }).isRequired,
};


export default EusageVisualization;
