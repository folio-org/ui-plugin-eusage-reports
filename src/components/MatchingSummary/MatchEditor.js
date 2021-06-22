import PropTypes from 'prop-types';
import { Button } from '@folio/stripes/components';


function MatchEditor({ matchType, onClose }) {
  return (
    <>
      <h1>Match editor for <code>{matchType}</code></h1>
      <Button onClick={onClose}>Dismiss</Button>
    </>
  );
}


MatchEditor.propTypes = {
  matchType: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};


export default MatchEditor;
