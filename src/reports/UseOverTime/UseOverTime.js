import PropTypes from 'prop-types';
import { Accordion } from '@folio/stripes/components';


function UseOverTime({ data }) {
  return (
    <>
      <p>yep nope yep</p>
      <Accordion closedByDefault label="use-over-time data">
        <pre>
          {JSON.stringify(data.useOverTime, null, 2)}
        </pre>
      </Accordion>
    </>
  );
}


UseOverTime.propTypes = {
  data: PropTypes.shape({
    useOverTime: PropTypes.shape({
    }).isRequired,
  }).isRequired,
};


export default UseOverTime;
