import PropTypes from 'prop-types';
import { Loading, Row, Col, Accordion } from '@folio/stripes/components';
import CostPerUse from '../reports/CostPerUse';


function EusageVisualization({ hasLoaded, data }) {
  if (!hasLoaded) return <Loading />;

  return (
    <>
      <Row>
        <Col xs={4}>
          Report
        </Col>
        <Col xs={4}>
          Format
        </Col>
        <Col xs={4}>
          Include Open Access use?
        </Col>
      </Row>
      <Row>
        <Col xs={4}>
          Start month
        </Col>
        <Col xs={4}>
          End month
        </Col>
        {/* No third column in this row */}
      </Row>
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
